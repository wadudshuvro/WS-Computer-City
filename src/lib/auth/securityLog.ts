/** Security log. Never pass passwords, tokens, card numbers, or webhook secrets. */
export function securityLog(event: string, details: Record<string, string | number | boolean | undefined>): void {
  const blocked = /password|secret|token|authorization|card|cvv|pan/i;
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(details)) {
    if (value === undefined || blocked.test(key)) continue;
    safe[key] = value;
  }
  console.warn(JSON.stringify({ at: new Date().toISOString(), event, ...safe }));
}
