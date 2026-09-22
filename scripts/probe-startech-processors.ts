import https from 'https';
import fs from 'fs';

function fetchText(url: string): Promise<{ status: number; html: string }> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () =>
            resolve({ status: res.statusCode || 0, html: Buffer.concat(chunks).toString('utf8') })
          );
        }
      )
      .on('error', reject);
  });
}

async function main() {
  const url = 'https://www.startech.com.bd/component/processor?filter_status=7&limit=90';
  const { status, html } = await fetchText(url);
  console.log('status', status, 'len', html.length);
  console.log({
    pitem: (html.match(/p-item/g) || []).length,
    athlon: (html.match(/Athlon/g) || []).length,
    ryzen: (html.match(/Ryzen/g) || []).length,
    cloudflare: /cf-browser|just a moment|challenge-platform/i.test(html),
  });
  fs.writeFileSync('docs/imports/startech-processor-probe.html', html);
  const idx = html.search(/Athlon|Ryzen 5 2400|p-item/i);
  console.log('idx', idx);
  if (idx >= 0) console.log(html.slice(idx, idx + 500));
  else console.log(html.slice(0, 800));
}

main().catch(console.error);
