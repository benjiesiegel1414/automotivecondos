#!/usr/bin/env node
/* AutomotiveCondos.com — builds states.html + states/<slug>.html from data/communities.json */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'communities.json'), 'utf8'));

const STATE_NAMES = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const LOGO = `<svg width="30" height="26" viewBox="0 0 70 60" aria-hidden="true"><rect x="5" y="5" width="60" height="50" rx="4" fill="none" stroke="#FFFFFF" stroke-width="4"/><path d="M11 12 H59 M11 18 H59" stroke="#FFFFFF" stroke-width="3"/><rect x="11" y="23" width="48" height="26" fill="#3B8EE2"/><path d="M17 45 C17 41 19 38 22 38 H27 L31 33 H42 L46 38 H48 C51 38 53 41 53 45 Z" fill="#FFFFFF"/><circle cx="23" cy="45" r="3.6" fill="#3B8EE2" stroke="#FFFFFF" stroke-width="2.2"/><circle cx="46" cy="45" r="3.6" fill="#3B8EE2" stroke="#FFFFFF" stroke-width="2.2"/></svg>`;

function page({title, desc, canonical, body, depth}) {
  const p = depth ? '../' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}styles.css">
</head>
<body>
<header class="site">
  <div class="wrap">
    <a class="brand" href="${p}index.html">${LOGO}<span class="word">Automotive<span>Condos</span></span></a>
    <nav class="main">
      <a href="${p}map.html">Map</a>
      <a href="${p}states.html">Browse by State</a>
      <a href="${p}blog.html">Blog</a>
      <a href="${p}about.html">About</a>
      <a class="btn" href="${p}list-your-condo.html">List Your Condo</a>
    </nav>
  </div>
</header>
${body}
<footer class="site">
  <div class="wrap">
    <div class="cols">
      <div>
        <h4>AutomotiveCondos.com</h4>
        <p>The national directory of car condos — every community, every state, buyers and sellers in one place.</p>
      </div>
      <div>
        <h4>Marketplace</h4>
        <a href="${p}map.html">Map</a>
        <a href="${p}states.html">Browse by State</a>
        <a href="${p}list-your-condo.html">List Your Condo</a>
      </div>
      <div>
        <h4>Learn</h4>
        <a href="${p}blog.html">Blog</a>
        <a href="${p}blog/what-is-a-car-condo.html">What Is a Car Condo?</a>
        <a href="${p}blog/car-condo-cost-guide.html">Cost Guide</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="${p}about.html">About</a>
        <a href="mailto:contact@automotivecondos.com">Contact</a>
      </div>
    </div>
    <div class="fine">© 2026 AutomotiveCondos.com · All information deemed reliable but not guaranteed. Verify details with each community or developer.</div>
  </div>
</footer>
</body>
</html>`;
}

// group by state
const byState = {};
for (const c of DATA.communities) (byState[c.state] ||= []).push(c);
const states = Object.keys(byState).sort((a,b)=>STATE_NAMES[a].localeCompare(STATE_NAMES[b]));

// --- states index ---
const indexCards = states.map(st => {
  const list = byState[st];
  const cities = new Set(list.map(c=>c.city)).size;
  return `<a class="card" href="states/${slug(STATE_NAMES[st])}.html" style="display:block">
    <h3>${STATE_NAMES[st]}</h3>
    <div class="meta">${list.length} communit${list.length===1?'y':'ies'} · ${cities} cit${cities===1?'y':'ies'}</div>
    <div class="price">View communities →</div>
  </a>`;
}).join('\n');

fs.writeFileSync(path.join(ROOT, 'states.html'), page({
  title: 'Car Condos by State | AutomotiveCondos.com',
  desc: `Browse every car condo community we track, organized by state. ${DATA.communities.length} communities and counting.`,
  canonical: 'https://automotivecondos.com/states.html',
  depth: 0,
  body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="index.html">Home</a> / Car Condos by State</div>
    <h1 style="margin-top:10px">Car Condos <span class="blue">by State</span></h1>
    <p style="color:var(--muted);max-width:640px">Every car condo community in our national directory, organized by state. Updated ${DATA.updated}.</p>
    <div class="grid c3" style="margin-top:26px">${indexCards}</div>
  </div>
</section>`
}));

// --- state pages ---
fs.mkdirSync(path.join(ROOT, 'states'), {recursive:true});
for (const st of states) {
  const name = STATE_NAMES[st];
  const list = byState[st].slice().sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
  const cities = [...new Set(list.map(c=>c.city))].sort();
  const rows = list.map(c=>`<tr><td><strong>${esc(c.name)}</strong></td><td>${esc(c.city)}</td><td>${esc(c.status)}</td><td>${c.units??'—'}</td><td>${esc(c.priceNote||'Inquire')}</td><td><a href="mailto:contact@automotivecondos.com?subject=Inquiry: ${encodeURIComponent(c.name)} (${c.state})">Inquire →</a></td></tr>`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'states', slug(name)+'.html'), page({
    title: `Car Condos in ${name}: Communities & Listings | AutomotiveCondos.com`,
    desc: `${list.length} car condo communities in ${name} across ${cities.length} cities — status, unit counts and pricing, plus how to buy or sell a unit.`,
    canonical: `https://automotivecondos.com/states/${slug(name)}.html`,
    depth: 1,
    body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="../index.html">Home</a> / <a href="../states.html">By State</a> / ${name}</div>
    <h1 style="margin-top:10px">Car Condos in <span class="blue">${name}</span></h1>
    <p style="color:var(--muted);max-width:680px">${list.length} communit${list.length===1?'y':'ies'} across ${cities.length} cit${cities.length===1?'y':'ies'} in our ${name} directory. Own a unit here? <a href="../list-your-condo.html">List it with us</a> and reach buyers comparing communities on this page.</p>
    <div style="margin:18px 0 26px">${cities.map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>
    <div class="table-scroll">
    <table class="data">
      <thead><tr><th>Community</th><th>City</th><th>Status</th><th>Units</th><th>Pricing</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
    <p style="font-size:13px;color:var(--muted);margin-top:10px">Data updated ${DATA.updated}. Unit counts and pricing are approximate — confirm with each community. See something out of date? <a href="mailto:contact@automotivecondos.com">Tell us</a></p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Selling a ${name} car condo?</h2>
    <p>Your buyer is already on this page. A featured listing puts your unit — photos, full details, your contact — at the top of the ${name} directory.</p>
    <a class="btn" href="../list-your-condo.html">List Your Condo</a>
  </div>
</section>`
  }));
}

// --- sitemap ---
const urls = ['', 'map.html', 'states.html', 'blog.html', 'about.html', 'list-your-condo.html',
  'blog/what-is-a-car-condo.html', 'blog/car-condo-cost-guide.html', 'blog/buying-a-car-condo-guide.html',
  ...states.map(st=>`states/${slug(STATE_NAMES[st])}.html`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>https://automotivecondos.com/${u}</loc></url>`).join('\n')}
</urlset>
`);

console.log(`Built states.html, ${states.length} state pages, sitemap.xml (${DATA.communities.length} communities).`);
