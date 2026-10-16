const fs = require('fs');
const crypto = require('crypto');
const path = '.env';
const text = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
if (/^NEXTAUTH_SECRET=\S+/m.test(text)) {
  console.log('NEXTAUTH_SECRET already set');
  process.exit(0);
}
const secret = crypto.randomBytes(32).toString('base64');
const sep = text.length && !text.endsWith('\n') ? '\n' : '';
fs.appendFileSync(path, `${sep}NEXTAUTH_SECRET="${secret}"\n`);
console.log('NEXTAUTH_SECRET written');
