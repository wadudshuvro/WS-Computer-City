import {
  GoogleGenerativeAI,
  SchemaType,
  type Content,
  type FunctionDeclaration,
  type GenerateContentResult,
  type Schema,
} from '@google/generative-ai';
import { CATALOG_TOOL_DECLARATIONS, runCatalogTool, type CatalogProductCard } from '@/lib/ai/catalogTools';

export const AGENT_SYSTEM_PROMPT = `You are LogicBay BD's product advisor for a Bangladesh computer hardware shop.

Rules:
- Answer ONLY using data returned by your tools (search_products, get_product, list_categories) or catalog tool result JSON provided in the conversation.
- Never invent product names, SKUs, prices, or stock. If tools find nothing, say so clearly and suggest a broader search.
- Prefer in-stock products when recommending.
- Prices are in BDT (৳). Mention stock status when relevant.
- Write for everyday shoppers of any age: short clear sentences, simple words, easy to scan.
- Use PLAIN TEXT only. Do NOT use markdown. No **bold**, no *asterisks*, no bullet markdown, no [link](url) syntax.
- When listing a product, use separate lines like:
  Product name
  Price: ৳12,500
  Status: In stock
- The website already shows clickable product cards under your reply, so you do not need to paste URLs.
- You may reply in English or Bangla to match the user.
- Do not discuss orders, payments, or shipping details beyond "contact the store" — this catalog has no order tracking yet.
- Warranty and specs come from get_product keySpecs when available.`;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/** New Google AI Studio keys require gemini-3.6-flash (2.x flash blocked for new users). */
export function getGeminiModelName(): string {
  return process.env.AI_MODEL?.trim() || 'gemini-3.6-flash';
}

function mapParamType(t: 'OBJECT' | 'STRING' | 'NUMBER'): SchemaType {
  if (t === 'STRING') return SchemaType.STRING;
  if (t === 'NUMBER') return SchemaType.NUMBER;
  return SchemaType.OBJECT;
}

function toolDeclarations(): FunctionDeclaration[] {
  return CATALOG_TOOL_DECLARATIONS.map((t) => {
    const properties: { [k: string]: Schema } = {};
    for (const [key, prop] of Object.entries(t.parameters.properties ?? {})) {
      properties[key] = {
        type: mapParamType(prop.type),
        description: prop.description,
      } as Schema;
    }

    return {
      name: t.name,
      description: t.description,
      parameters: {
        type: SchemaType.OBJECT,
        properties,
        ...('required' in t.parameters && t.parameters.required
          ? { required: t.parameters.required }
          : {}),
      },
    };
  });
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

export function createCatalogChatModel() {
  return getClient().getGenerativeModel({
    model: getGeminiModelName(),
    systemInstruction: AGENT_SYSTEM_PROMPT,
    tools: [{ functionDeclarations: toolDeclarations() }],
  });
}

export function createAnswerModel() {
  return getClient().getGenerativeModel({
    model: getGeminiModelName(),
    systemInstruction: AGENT_SYSTEM_PROMPT,
  });
}

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export function toGeminiHistory(messages: ChatTurn[]): Content[] {
  const out: Content[] = [];
  for (const msg of messages) {
    const text = msg.content?.trim();
    if (!text) continue;
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const last = out[out.length - 1];
    if (last && last.role === role) {
      const prev = last.parts[0];
      if (prev && 'text' in prev && typeof prev.text === 'string') {
        last.parts = [{ text: `${prev.text}\n${text}` }];
      }
      continue;
    }
    out.push({ role, parts: [{ text }] });
  }
  return out;
}

export function extractText(result: GenerateContentResult): string {
  try {
    return result.response.text().trim();
  } catch {
    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    return parts
      .map((p) => ('text' in p && typeof p.text === 'string' ? p.text : ''))
      .join('')
      .trim();
  }
}

export function extractFunctionCalls(result: GenerateContentResult): Array<{
  name: string;
  args: Record<string, unknown>;
}> {
  const calls = result.response.functionCalls?.() ?? [];
  return calls.map((c) => ({
    name: c.name,
    args: (c.args ?? {}) as Record<string, unknown>,
  }));
}

function mergeProducts(
  existing: CatalogProductCard[],
  incoming: CatalogProductCard[]
): CatalogProductCard[] {
  const map = new Map<string, CatalogProductCard>();
  for (const p of [...existing, ...incoming]) {
    map.set(p.slug, p);
  }
  return Array.from(map.values()).slice(0, 8);
}

const MAX_TOOL_ROUNDS = 3;

/**
 * Tool loop compatible with Gemini 3.x (no role:"function").
 * Uses native function calls on the first pass, then injects tool JSON
 * as a normal user message for the final answer.
 */
export async function runCatalogAgent(messages: ChatTurn[]): Promise<{
  reply: string;
  products: CatalogProductCard[];
}> {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    throw new Error('Last message must be from the user');
  }

  const toolModel = createCatalogChatModel();
  const answerModel = createAnswerModel();
  const contents: Content[] = [
    ...toGeminiHistory(messages.slice(0, -1)),
    { role: 'user', parts: [{ text: last.content }] },
  ];

  let collected: CatalogProductCard[] = [];
  let result = await toolModel.generateContent({ contents });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const calls = extractFunctionCalls(result);
    if (calls.length === 0) break;

    const toolPayload: Array<{ name: string; result: unknown }> = [];
    for (const call of calls) {
      const { result: toolResult, products } = await runCatalogTool(
        call.name,
        JSON.stringify(call.args ?? {})
      );
      collected = mergeProducts(collected, products);
      toolPayload.push({ name: call.name, result: toolResult });
    }

    // Avoid role "function" (rejected by gemini-3.x). Pass results as user text.
    contents.push({
      role: 'model',
      parts: [
        {
          text: `I looked up the catalog using: ${calls.map((c) => c.name).join(', ')}.`,
        },
      ],
    });
    contents.push({
      role: 'user',
      parts: [
        {
          text:
            'Catalog tool results (JSON). Answer using ONLY this data. Do not invent products.\n' +
            JSON.stringify(toolPayload),
        },
      ],
    });

    result = await answerModel.generateContent({ contents });
  }

  let reply = extractText(result);
  if (!reply) {
    reply =
      collected.length > 0
        ? 'Here are products from our catalog that match your question.'
        : 'I could not find a matching answer in the catalog. Try another product name, brand, or budget.';
  }

  return { reply, products: collected };
}
