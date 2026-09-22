import fs from 'fs';

const html = fs.readFileSync('docs/imports/startech-processor-probe.html', 'utf8');
let pos = 0;
let i = 0;
while (i < 3) {
  pos = html.indexOf('class="p-item', pos);
  if (pos < 0) break;
  console.log('--- CARD', i, '---');
  console.log(html.slice(pos, pos + 1200));
  pos += 20;
  i++;
}

// Try simpler parse: all p-item-name links
const nameRe =
  /class="p-item-name"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/gi;
const names = [...html.matchAll(nameRe)];
console.log('name matches', names.length);
console.log(names.slice(0, 3).map((m) => [m[1], m[2].replace(/<[^>]+>/g, '').trim()]));

const priceRe = /class="p-item-price"[^>]*>([\s\S]*?)<\/div>/gi;
const prices = [...html.matchAll(priceRe)];
console.log('price matches', prices.length);
console.log(prices.slice(0, 3).map((m) => m[1].replace(/\s+/g, ' ').trim()));
