// Pings IndexNow (Bing, Yandex, Seznam, Naver; shared with DuckDuckGo/Yahoo via Bing)
// with every URL in sitemap.xml. Run AFTER pushing, so the key file is live:
//   node scripts/indexnow.js            -> submit all sitemap URLs
//   node scripts/indexnow.js URL [URL]  -> submit only these URLs
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const HOST = 'automotivecondos.com';
const KEY = '28decce94cc405ba1ed035ce3da3333e';

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls.slice(0, 10000),
});

const req = https.request({
  hostname: 'api.indexnow.org',
  path: '/indexnow',
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) },
}, res => {
  let out = '';
  res.on('data', d => (out += d));
  res.on('end', () => console.log(`IndexNow: HTTP ${res.statusCode} for ${urls.length} URLs ${out}`));
});
req.on('error', e => console.error('IndexNow error:', e.message));
req.write(body);
req.end();
