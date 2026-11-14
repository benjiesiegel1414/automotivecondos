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
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}styles.css">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-2F3PGKL62S"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-2F3PGKL62S');</script>
</head>
<body>
<header class="site">
  <div class="wrap">
    <a class="brand" href="/">${LOGO}<span class="word">Automotive<span>Condos</span></span></a>
    <nav class="main">
      <a href="${p}map">Map</a>
      <a href="${p}states">Browse by State</a>
      <a href="/price-index">Price Index</a>
      <a href="${p}blog">Blog</a>
      <a href="${p}about">About</a>
      <a class="nav-adv" href="/advertise">Advertise</a>
      <a class="btn" href="${p}list-your-condo">List Your Condo</a>
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
        <a href="${p}map">Map</a>
        <a href="${p}states">Browse by State</a>
        <a href="${p}list-your-condo">List Your Condo</a>
        <a href="/advertise">Advertise</a>
      </div>
      <div>
        <h4>Learn</h4>
        <a href="${p}blog">Blog</a>
        <a href="${p}blog/what-is-a-car-condo">What Is a Car Condo?</a>
        <a href="${p}blog/car-condo-cost-guide">Cost Guide</a>
        <a href="/price-index">Car Condo Price Index</a>
        <a href="${p}best/best-car-condos-texas">Best Car Condos in Texas</a>
        <a href="${p}best/best-car-condos-florida">Best Car Condos in Florida</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="${p}about">About</a>
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
// derived numeric price for filters + map (written back to communities.json)
{ const { parsePrice } = require('./prices'); let changed=false;
  DATA.communities.forEach(c=>{ const pp=parsePrice(c.priceNote); const v=(pp&&pp.low)?Math.round(pp.low):null; if((c.priceLow??null)!==v){ if(v==null) delete c.priceLow; else c.priceLow=v; changed=true; } });
  if(changed) fs.writeFileSync(path.join(ROOT,'data','communities.json'), JSON.stringify(DATA,null,1)); }
const byState = {};
for (const c of DATA.communities) (byState[c.state] ||= []).push(c);
const states = Object.keys(byState).sort((a,b)=>STATE_NAMES[a].localeCompare(STATE_NAMES[b]));

// --- city index (cities with 2+ communities get their own page) ---
function cleanCity(s){ return String(s).replace(/\s*\(.*?\)/g,'').trim(); }
const cityMap = {};
for (const c of DATA.communities) { const k = cleanCity(c.city) + '|' + c.state; (cityMap[k] = cityMap[k] || []).push(c); }
const cityPages = Object.entries(cityMap).filter(([k,v]) => v.length >= 2).map(([k,v]) => {
  const [city, st] = k.split('|');
  return { city, st, list: v, slug: slug(city) + '-' + st.toLowerCase() };
}).sort((a,b) => b.list.length - a.list.length);
const cityByKey = {}; cityPages.forEach(cp => { cityByKey[cp.city + '|' + cp.st] = cp; });
const STATE_GUIDES = { MI:'garage-condos-michigan', MN:'garage-condos-minnesota', AZ:'car-condos-arizona', TX:'garage-condos-texas',
  FL:'car-condos-florida', CA:'car-condos-california', CO:'car-condos-colorado', WA:'garage-condos-washington',
  NC:'car-condos-north-south-carolina', SC:'car-condos-north-south-carolina' };
// add later guides only once their blog file exists
Object.entries({ WI:'garage-condos-wisconsin', OH:'car-condos-ohio', GA:'garage-condos-georgia', ID:'garage-condos-idaho', KS:'car-condos-kansas', NV:'car-condos-nevada' })
  .forEach(([st,s]) => { if (fs.existsSync(path.join(ROOT,'blog',s+'.html'))) STATE_GUIDES[st]=s; });

// --- paid unit listings (data/listings.json, built from the listing form + Stripe) ---
const LISTINGS_FILE = path.join(ROOT, 'data', 'listings.json');
const LISTINGS = fs.existsSync(LISTINGS_FILE) ? (JSON.parse(fs.readFileSync(LISTINGS_FILE, 'utf8')).listings || []).filter(l => l.status === 'active') : [];
LISTINGS.forEach(l => { l.pageSlug = l.pageSlug || (slug(l.title || 'unit').slice(0, 60).replace(/-+$/,'') + '-' + String(l.id).toLowerCase()); });
function fmtListPrice(l){ const n = Number(l.price); if (!n) return 'Inquire'; const s = '$' + n.toLocaleString('en-US'); return l.offer === 'rent' ? s + '/mo' : s; }
function unitCard(l, pre){
  const img = l.photos && l.photos[0] ? `${pre}${l.photos[0]}` : `${pre}assets/photos/pillar-market.jpg`;
  const specs = [l.sqft ? Number(l.sqft).toLocaleString('en-US') + ' sq ft' : '', l.door ? esc(l.door) + ' door' : ''].filter(Boolean).join(' · ');
  return `<a class="unit-card" href="${pre}listings/${l.pageSlug}">
      <div class="uc-img" style="background-image:url('${img}')"><span class="uc-tag ${l.offer==='rent'?'rent':''}">${l.offer==='rent'?'For rent':'For sale'}</span></div>
      <div class="uc-bd"><div class="uc-price">${fmtListPrice(l)}</div><h3>${esc(l.title)}</h3>
      <div class="meta">${esc(l.community_name || '')}${l.community_name ? ' · ' : ''}${esc(cleanCity(l.city))}, ${l.state}</div>${specs ? `<div class="meta">${specs}</div>` : ''}</div>
    </a>`;
}
function unitSection(list, pre, heading){
  if (!list.length) return '';
  return `<div class="sec-head" style="margin-top:30px"><h2 style="font-size:22px">${heading} <span class="blue">(${list.length})</span></h2></div>
    <div class="grid c3 units-grid">${list.map(l => unitCard(l, pre)).join('\n')}</div>`;
}

function ld(obj){ return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g,'\\u003c') + '</script>'; }

// --- researched details + "best of" rankings ---
const DET = fs.existsSync(path.join(ROOT,'data','details.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT,'data','details.json'),'utf8')) : {details:{}};
const DETAILS = DET.details || {};
const BEST = fs.existsSync(path.join(ROOT,'data','best.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT,'data','best.json'),'utf8')).pages : [];
const BY_SLUG = {}; DATA.communities.forEach(c=>{ BY_SLUG[c.slug]=c; });
const BEST_RANK = {}; const BEST_BY_STATE = {};
BEST.forEach(b=>{ BEST_BY_STATE[b.state]=b; b.picks.forEach((pk,i)=>{ BEST_RANK[pk.slug]={rank:i+1, award:pk.award, page:b}; }); });
function specRows(d){
  return [['Units',d.units],['Unit sizes',d.size],['Ceilings',d.ceilings],['Doors',d.doors],['Pricing',d.price],['Developer',d.developer],['Location',d.address],['Timeline',d.timeline]]
    .filter(r=>r[1]).map(r=>`<tr><th>${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('');
}
function sourcesHtml(d){
  return (d.sources&&d.sources.length) ? `<p class="src-note">Sources: ${d.sources.map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener nofollow">${esc(x[0])}</a>`).join(' · ')}. Last checked ${esc(DET.checked||'2026')}.</p>` : '';
}

// --- states index ---
const indexCards = states.map(st => {
  const list = byState[st];
  const cities = new Set(list.map(c=>c.city)).size;
  return `<a class="card" href="states/${slug(STATE_NAMES[st])}" style="display:block">
    <h3>${STATE_NAMES[st]}</h3>
    <div class="meta">${list.length} communit${list.length===1?'y':'ies'} · ${cities} cit${cities===1?'y':'ies'}</div>
    <div class="price">View communities →</div>
  </a>`;
}).join('\n');

fs.writeFileSync(path.join(ROOT, 'states.html'), page({
  title: 'Car Condos by State | AutomotiveCondos.com',
  desc: `Browse every car condo community we track, organized by state. ${DATA.communities.length} communities and counting.`,
  canonical: 'https://automotivecondos.com/states',
  depth: 0,
  body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / Car Condos by State</div>
    <h1 style="margin-top:10px">Car Condos <span class="blue">by State</span></h1>
    <p style="color:var(--muted);max-width:640px">Every car condo community in our national directory, organized by state. Updated ${DATA.updated}.</p>
    <div class="grid c3" style="margin-top:26px">${indexCards}</div>
    <div class="sec-head" style="margin-top:40px"><h2 style="font-size:22px">Popular car condo cities</h2></div>
    <div style="margin-top:12px">${cityPages.slice(0,40).map(cp=>`<a class="pill" href="cities/${cp.slug}">${esc(cp.city)}, ${cp.st} <span style="color:var(--muted);font-weight:500">(${cp.list.length})</span></a>`).join('')}</div>
    <div class="sec-head" style="margin-top:40px"><h2 style="font-size:22px">Garage condos for sale by state</h2></div>
    <div style="margin-top:12px">${states.filter(st=>byState[st].length>=5).map(st=>`<a class="pill" href="for-sale/garage-condos-for-sale-${slug(STATE_NAMES[st])}">${STATE_NAMES[st]} <span style="color:var(--muted);font-weight:500">(${byState[st].length})</span></a>`).join('')}<a class="pill" href="car-condos-for-rent">Car condos for rent</a></div>
  </div>
</section>`
}));

// --- state pages ---
fs.mkdirSync(path.join(ROOT, 'states'), {recursive:true});
for (const st of states) {
  const name = STATE_NAMES[st];
  const list = byState[st].slice().sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
  const cities = [...new Set(list.map(c=>c.city))].sort();
  const rows = list.map(c=>`<tr data-offer="${c.offer||'buy'}" data-price="${c.priceLow||''}" data-status="${esc(c.status)}" data-units="${c.units||''}" data-track="${c.track?1:''}" data-specs="${DETAILS[c.slug]?1:''}" data-href="../communities/${c.slug}"><td><strong>${esc(c.name)}</strong></td><td>${esc(c.city)}</td><td>${esc(c.status)}</td><td>${c.units??'—'}</td><td>${esc(c.priceNote||'Inquire')}</td><td><a href="../communities/${c.slug}">Details →</a></td></tr>`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'states', slug(name)+'.html'), page({
    title: `Car Condos in ${name}: Communities & Listings | AutomotiveCondos.com`,
    desc: `${list.length} car condo communities in ${name} across ${cities.length} cities — status, unit counts and pricing, plus how to buy or sell a unit.`,
    canonical: `https://automotivecondos.com/states/${slug(name)}`,
    depth: 1,
    body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states">By State</a> / ${name}</div>
    <h1 style="margin-top:10px">Car Condos in <span class="blue">${name}</span></h1>
    <p style="color:var(--muted);max-width:680px">${list.length} communit${list.length===1?'y':'ies'} across ${cities.length} cit${cities.length===1?'y':'ies'} in our ${name} directory. Own a unit here? <a href="../list-your-condo">List it with us</a> — for sale or for rent — and reach the buyers and renters comparing communities on this page.</p>
    ${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":"By State","item":"https://automotivecondos.com/states"},{"@type":"ListItem","position":3,"name":name,"item":`https://automotivecondos.com/states/${slug(name)}`}]})}
    ${ld({"@context":"https://schema.org","@type":"ItemList","name":`Car condo communities in ${name}`,"numberOfItems":list.length,"itemListElement":list.map((c,i)=>({"@type":"ListItem","position":i+1,"url":`https://automotivecondos.com/communities/${c.slug}`,"name":c.name}))})}
    <div style="margin:18px 0 10px">${[...new Set(cities.map(cleanCity))].map(c=>{const cp=cityByKey[c+'|'+st]; return cp ? `<a class="pill" href="../cities/${cp.slug}">${esc(c)} <span style="color:var(--muted);font-weight:500">(${cp.list.length})</span></a>` : `<span class="pill" style="cursor:default">${esc(c)}</span>`;}).join('')}</div>
    <p style="font-size:14px;margin:0 0 14px">${byState[st].length >= 5 ? `<a href="../for-sale/garage-condos-for-sale-${slug(name)}">${name} garage condos for sale →</a> · ` : ''}${STATE_GUIDES[st] ? `<a href="../blog/${STATE_GUIDES[st]}">${name} market guide →</a> · ` : ''}<a href="../car-condos-for-rent">Car condos for rent →</a></p>
    ${BEST_BY_STATE[st] ? `<a class="best-banner" href="../best/${BEST_BY_STATE[st].slug}"><span class="bb-tag">Ranked</span><span class="bb-txt"><strong>The ${BEST_BY_STATE[st].picks.length} best car condos in ${name}</strong> Specs, ceilings, prices and amenities compared</span><span class="bb-go">See the list →</span></a>` : ''}
    ${unitSection(LISTINGS.filter(l=>l.state===st), '../', `Units for sale &amp; rent in ${name}`)}
    <div class="dir-filters" id="dir-filters" style="margin-top:${LISTINGS.some(l=>l.state===st)?'26px':'0'}">
      <select data-k="price" class="field" aria-label="Price"><option value="">Any price</option><option value="0-150000">Under $150K</option><option value="150000-300000">$150K–$300K</option><option value="300000-500000">$300K–$500K</option><option value="500000-1000000">$500K–$1M</option><option value="1000000-1e12">$1M+</option></select>
      <select data-k="status" class="field" aria-label="Status"><option value="">Any status</option><option value="Selling">Selling now</option><option value="new">Pre-construction</option><option value="Resale only">Resale only</option><option value="Established">Established</option></select>
      <select data-k="offer" class="field" aria-label="Buy or rent"><option value="">Buy &amp; rent</option><option value="buy">For sale</option><option value="rent">For rent</option></select>
      <select data-k="size" class="field" aria-label="Community size"><option value="">Any size</option><option value="0-39">Boutique (under 40 units)</option><option value="40-100">Mid-size (40–100)</option><option value="101-100000">Large (100+)</option></select>
      ${list.some(c=>c.track)?'<label class="chk"><input type="checkbox" data-k="track"> Track access</label>':''}
      ${list.some(c=>DETAILS[c.slug])?'<label class="chk"><input type="checkbox" data-k="specs"> Full specs</label>':''}
      <span class="df-count" id="df-count">Showing ${list.length} of ${list.length}</span>
    </div>
    <div class="table-scroll">
    <table class="data">
      <thead><tr><th>Community</th><th>City</th><th>Status</th><th>Units</th><th>Pricing</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
    <script>
    (function(){
      var wrap = document.getElementById('dir-filters'); if(!wrap) return;
      var rows = document.querySelectorAll('table.data tbody tr');
      function apply(){
        var v = {}; wrap.querySelectorAll('[data-k]').forEach(function(el){ v[el.getAttribute('data-k')] = el.type==='checkbox' ? el.checked : el.value; });
        var n = 0;
        rows.forEach(function(tr){
          var d = tr.dataset, ok = true;
          if (v.price){ var r=v.price.split('-').map(Number), p=+d.price; ok = ok && !!d.price && p>=r[0] && p<r[1]; }
          if (v.status){ ok = ok && (v.status==='new' ? (d.status==='Planned'||d.status==='Under construction') : d.status===v.status); }
          if (v.offer){ var o=d.offer||'buy'; ok = ok && (v.offer==='buy' ? (o==='buy'||o==='both') : o==='both'); }
          if (v.size){ var s=v.size.split('-').map(Number), u=+d.units; ok = ok && !!d.units && u>=s[0] && u<=s[1]; }
          if (v.track) ok = ok && d.track==='1';
          if (v.specs) ok = ok && d.specs==='1';
          tr.style.display = ok ? '' : 'none'; if (ok) n++;
        });
        document.getElementById('df-count').textContent = 'Showing ' + n + ' of ' + rows.length + (n===0 ? ' (try fewer filters)' : '');
      }
      wrap.addEventListener('change', apply);
    })();
    document.querySelectorAll('tr[data-href]').forEach(function(r){
      r.style.cursor='pointer';
      r.addEventListener('click', function(e){ if(e.target.closest('a')) return; location.href = r.getAttribute('data-href'); });
    });
    </script>
    <p style="font-size:13px;color:var(--muted);margin-top:10px">Data updated ${DATA.updated}. Unit counts and pricing are approximate — confirm with each community. See something out of date? <a href="mailto:contact@automotivecondos.com">Tell us</a></p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Selling or renting out a ${name} car condo?</h2>
    <p>Your buyer — or renter — is already on this page. A featured listing puts your unit, for sale or for rent, at the top of the ${name} directory.</p>
    <a class="btn" href="../list-your-condo">List Your Condo</a>
  </div>
</section>`
  }));
}

// --- community detail pages ---
fs.mkdirSync(path.join(ROOT, 'communities'), {recursive: true});

function priceNums(s){
  if(!s) return [];
  const m = s.match(/\$\s?[\d,.]+\s?[KkMm]?/g) || [];
  return m.map(x=>{
    const mm = x.match(/\$\s?([\d,.]+)\s?([KkMm]?)/);
    let v = parseFloat(mm[1].replace(/,/g,''));
    const u = (mm[2]||'').toLowerCase();
    if(u==='k') v*=1e3; if(u==='m') v*=1e6;
    if(v>0 && v<10000 && !u) v*=1000; // "$650/SF" style guards below
    return v;
  }).filter(v=>v>=20000 && v<=5e6);
}
function fmtPrice(v){
  if(v>=1e6) return '$'+(v/1e6).toFixed(v%1e6?1:0)+'M';
  return '$'+Math.round(v/1000)+'K';
}
const stateAgg = {};
for (const st of states) {
  const cs = DATA.communities.filter(c=>c.state===st);
  let nums = [];
  cs.forEach(c=>{ nums = nums.concat(priceNums(c.priceNote)); });
  stateAgg[st] = {
    count: cs.length,
    units: cs.reduce((a,c)=>a+(c.units||0),0),
    selling: cs.filter(c=>c.status==='Selling').length,
    rent: cs.filter(c=>c.offer==='both').length,
    min: nums.length?Math.min.apply(null,nums):null,
    max: nums.length?Math.max.apply(null,nums):null
  };
}
function kindOf(c){
  const n = c.name.toLowerCase();
  if(/track|motorsport|raceway|circuit|speedway|paddock|pit row|racing|apex|concourse|bir |cota/.test(n)) return 'track';
  if(/rv|boat|coach|marine|toy/.test(n)) return 'toy';
  if(/storage|flex|warehouse|suites|condos? of|space/.test(n) && !/motor|auto|car|garage club/.test(n)) return 'storage';
  return 'motor';
}
const KIND_COPY = {
  track: {label:'motorsports / trackside community', feats:['Direct or near-direct track access for events and lapping days','Secure garage bays sized for race cars, trailers, and tools','A social paddock scene — owners wrench, watch, and run the track together','Power, lighting, and prep space suited to performance cars']},
  toy:   {label:'RV, boat & toy storage community', feats:['Tall doors and deep bays sized for motorhomes, boats on trailers, and off-road toys','Owner-controlled access — pull in and out on your schedule, no valet windows','Power for battery tenders, interior lighting, and often water or dump access','Climate and security far beyond a typical outdoor or self-storage lot']},
  motor: {label:'car condo / motor condo community', feats:['Private, deeded garage bays built for collections — not generic storage','Room for lifts, epoxy floors, cabinetry, and mezzanine lounges','Gated entry, cameras, and an owner community that cares about cars','A clubhouse or shared social space in many communities of this style']},
  storage: {label:'garage / storage condo community', feats:['Deeded ownership — an appreciating alternative to renting storage forever','Tall roll-up doors and clear-span space for vehicles, trailers, and gear','Power, lighting, and often climate control inside your own four walls','Low association dues covering the roof, exterior, and common drives']}
};
const STATUS_COPY = {
  'Selling': n => `${n} is actively selling units — developer inventory is available now, which usually means first pick of sizes and locations within the community.`,
  'Resale only': n => `${n} is sold out of developer inventory. Units here trade on the resale market, so availability comes and goes — inquiries get first word when an owner lists.`,
  'Under construction': n => `${n} is under construction. Pre-construction buyers typically get the best pricing and unit selection before delivery.`,
  'Planned': n => `${n} is in the planning / pre-development stage. Early reservations often lock pre-construction pricing before the first shovel hits dirt.`,
  'Established': n => `${n} is an established, operating community. Units change hands by resale and occasionally by lease — inquire to hear what's available.`
};

for (const c of DATA.communities) {
  const stName = STATE_NAMES[c.state];
  const agg = stateAgg[c.state];
  const offer = c.offer === 'both' ? 'For sale or for rent' : 'For sale / resale';
  const nearby = DATA.communities.filter(x => x.state === c.state && x.slug !== c.slug).slice(0, 6);
  const det = DETAILS[c.slug];
  const kc = KIND_COPY[kindOf(c)];
  const myNums = priceNums(c.priceNote);
  const pageUrl = `https://automotivecondos.com/communities/${c.slug}`;

  // about paragraph
  const bits = [];
  bits.push(`${c.name} is a ${kc.label} in ${c.city}, ${stName}.`);
  if (c.units) bits.push(`The community spans ${c.units} individually owned units.`);
  bits.push(STATUS_COPY[c.status] ? STATUS_COPY[c.status](c.name.split('(')[0].trim()) : '');
  if (c.offer === 'both') bits.push(`Units here are offered both for sale and for rent, so you can get in the door without buying first.`);
  const about = bits.filter(Boolean).join(' ');

  // market context
  const rankByUnits = c.units ? (DATA.communities.filter(x=>x.state===c.state && (x.units||0) > c.units).length + 1) : null;
  const ctx = [];
  ctx.push(`<strong>${agg.count}</strong> car condo communit${agg.count===1?'y':'ies'} tracked in ${stName}`);
  if (agg.units) ctx.push(`<strong>${agg.units.toLocaleString()}+</strong> known units statewide`);
  if (agg.min && agg.max && agg.min < agg.max) ctx.push(`${stName} pricing we track runs roughly <strong>${fmtPrice(agg.min)} – ${fmtPrice(agg.max)}</strong>`);
  if (rankByUnits && rankByUnits <= 10 && agg.count > 3) ctx.push(`Top-${rankByUnits} largest community in the state by unit count`);
  if (agg.rent) ctx.push(`<strong>${agg.rent}</strong> ${stName} communit${agg.rent===1?'y':'ies'} also offer${agg.rent===1?'s':''} rentals`);

  // FAQ
  const faqs = [];
  faqs.push([`How much does a unit at ${c.name} cost?`,
    (c.priceNote && c.priceNote !== 'Inquire') ? `Our latest tracked pricing for ${c.name} is: ${c.priceNote}. Pricing moves with the market — request the listing info below for current numbers.`
    : `Pricing for ${c.name} is available on inquiry. For context, ${stName} communities we track run roughly ${agg.min&&agg.max?fmtPrice(agg.min)+' to '+fmtPrice(agg.max):'from under $100K for basic storage condos to seven figures for luxury motor condos'}. Request the listing info below for current numbers.`]);
  faqs.push([`Can I rent a unit at ${c.name}?`,
    c.offer === 'both' ? `Yes — ${c.name} offers units for rent as well as for sale. Request the listing info below and we'll include current rental availability.`
    : `${c.name} is tracked as a for-sale community. Some owners do lease their units privately, though — inquire below and we'll check what's available, and point you to ${stName} communities with rentals if needed.`]);
  faqs.push([`How do I buy at ${c.name}?`,
    `Start with the free listing info request on this page. You'll get everything we track on ${c.name} by email, and we follow up personally with current availability, pricing, and the direct path to buy${c.offer==='both'?' or rent':''} — typically within 24 hours.`]);
  const faqLd = JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))});

  const mlName = JSON.stringify(c.name + ' (' + c.state + ')');
  const mlUrl = JSON.stringify(pageUrl);
  const directLink = c.website || pageUrl;
  const mlSite = JSON.stringify(directLink);
  const hasSite = !!c.website;

  fs.writeFileSync(path.join(ROOT, 'communities', c.slug + '.html'), page({
    title: `${c.name} — Car Condos in ${c.city}, ${c.state} | AutomotiveCondos.com`,
    desc: `${c.name} in ${c.city}, ${stName}: ${c.status.toLowerCase()}${c.units ? ', ' + c.units + ' units' : ''}. ${c.priceNote && c.priceNote !== 'Inquire' ? 'Pricing: ' + c.priceNote + '. ' : ''}Get the full listing info by email, free.`,
    canonical: pageUrl,
    depth: 1,
    body: `
<script type="application/ld+json">${faqLd}</script>
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states">By State</a> / <a href="../states/${slug(stName)}">${stName}</a> / ${esc(c.name)}</div>
    <h1 style="margin-top:10px">${esc(c.name)}</h1>
    <p style="color:var(--muted);font-size:17px">${cityByKey[cleanCity(c.city)+'|'+c.state] ? `<a href="../cities/${cityByKey[cleanCity(c.city)+'|'+c.state].slug}">${esc(c.city)}</a>` : esc(c.city)}, <a href="../states/${slug(stName)}">${stName}</a> · ${esc(kc.label.charAt(0).toUpperCase()+kc.label.slice(1))}</p>
    ${ld(Object.assign({"@context":"https://schema.org","@type":"Place","name":c.name,"url":pageUrl,"address":{"@type":"PostalAddress","addressLocality":cleanCity(c.city),"addressRegion":c.state,"addressCountry":"US"}}, (typeof c.lat==='number'&&typeof c.lng==='number') ? {"geo":{"@type":"GeoCoordinates","latitude":c.lat,"longitude":c.lng}} : {}))}
    ${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":stName,"item":`https://automotivecondos.com/states/${slug(stName)}`},{"@type":"ListItem","position":3,"name":c.name,"item":pageUrl}]})}
    <div class="grid c4" style="margin-top:18px">
      <div class="card"><div class="meta">Status</div><div style="font-weight:800;font-size:17px">${esc(c.status)}</div></div>
      <div class="card"><div class="meta">Units</div><div style="font-weight:800;font-size:17px">${c.units ?? '—'}</div></div>
      <div class="card"><div class="meta">Offering</div><div style="font-weight:800;font-size:17px">${offer}</div></div>
      <div class="card"><div class="meta">Pricing</div><div style="font-weight:800;font-size:17px;color:var(--blue)">${esc(c.priceNote || 'Inquire')}</div></div>
    </div>
    ${unitSection(LISTINGS.filter(l=>l.community_slug===c.slug), '../', `Units available at ${esc(c.name)}`)}

    <div class="detail-cols">
      <div class="detail-main">
        ${BEST_RANK[c.slug] ? `<a class="rank-badge" href="../best/${BEST_RANK[c.slug].page.slug}">#${BEST_RANK[c.slug].rank} in Best Car Condos in ${STATE_NAMES[BEST_RANK[c.slug].page.state]} · ${esc(BEST_RANK[c.slug].award)} →</a>` : ''}
        <h2>About this community</h2>
        ${det && det.summary ? `<p>${esc(det.summary)}</p>` : ''}
        <p>${esc(about)}</p>
        ${det && specRows(det) ? `<h2>Specs at a glance</h2><div class="table-scroll"><table class="spec-table">${specRows(det)}</table></div>` : ''}
        ${det && det.amenities ? `<h2>Amenities and features</h2><ul class="feat-list">${det.amenities.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>` : `
        <h2>What communities like this offer</h2>
        <p class="meta" style="font-size:13.5px;margin-bottom:8px">Typical of the ${esc(kc.label.replace("community","communities"))} we track — confirm specifics for ${esc(c.name)} via the listing info request.</p>
        <ul class="feat-list">${kc.feats.map(f=>`<li>${f}</li>`).join('')}</ul>`}
        ${det ? sourcesHtml(det) : ''}

        <h2>The ${stName} market at a glance</h2>
        <ul class="feat-list ctx">${ctx.map(x=>`<li>${x}</li>`).join('')}</ul>
        <p style="font-size:14px"><a href="../states/${slug(stName)}">Browse every ${stName} community →</a> · <a href="../map">See the national map →</a></p>

        <h2>Frequently asked questions</h2>
        ${faqs.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
      </div>

      <div class="detail-side">
        <div class="card inq" id="inquire">
          <div class="inq-tag">Free · No obligation</div>
          <h3>Unlock the direct listing link</h3>
          <p class="meta" style="font-size:14px;margin-bottom:12px">Enter your email for instant access to the direct listing ${hasSite?'website':'details'} for ${esc(c.name)} — plus everything we track on this community, sent to your inbox.</p>
          <form id="lead-form">
            <input type="email" required placeholder="you@email.com" class="field" id="lead-email" autocomplete="email">
            <button class="btn" type="submit" style="width:100%">Unlock Instant Access</button>
            <div class="lead-note">Instant access — no confirmation hoops. We'll also email you the link and new listings like this one. Unsubscribe anytime.</div>
          </form>
          <div id="lead-ok" style="display:none">
            <div class="lead-ok-big">✓ Unlocked</div>
            ${hasSite
              ? `<a class="btn" style="width:100%;text-align:center;margin:6px 0 10px" href="${esc(directLink)}" target="_blank" rel="noopener nofollow">Open the ${esc(c.name)} Listing →</a>
            <div style="font-size:13px;color:var(--muted)">We also emailed you this link plus everything we track on ${esc(c.name)}.</div>`
              : `<div style="font-size:14px;margin:4px 0 8px">${esc(c.name)} doesn't have a public listing site — everything we track is on this page, and we just emailed it to you. We'll follow up with direct contact details.</div>`}
          </div>
        </div>
        <p style="font-size:12.5px;color:var(--muted);margin-top:10px">Details compiled from public sources and may change. Represent this community? <a href="../list-your-condo">Claim this page</a>.</p>
      </div>
    </div>

    ${nearby.length ? `<div class="sec-head" style="margin-top:34px"><h2 style="font-size:20px">More in ${stName}</h2><div class="sub"><a href="../states/${slug(stName)}">Full directory →</a></div></div>
    <div class="grid c3">` + nearby.map(x => `<a class="card" href="${x.slug}" style="display:block"><h3 style="font-size:15px">${esc(x.name)}</h3><div class="meta">${esc(x.city)}, ${x.state} · ${esc(x.status)}</div><div class="price">${esc(x.priceNote || 'Inquire')}</div></a>`).join('') + '</div>' : ''}
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Own a unit at ${esc(c.name)}?</h2>
    <p>Buyers are viewing this page. List your unit with photos, specs, your price and your direct contact info for $29/month, cancel anytime.</p>
    <a class="btn" href="../submit-listing?community=${c.slug}">List My Unit Here</a>
  </div>
</section>
<script>
(function(){
  var f = document.getElementById('lead-form');
  if (!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending...';
    var fd = new FormData();
    fd.append('fields[email]', document.getElementById('lead-email').value);
    fd.append('fields[community]', ${mlName});
    fd.append('fields[community_url]', ${mlUrl});
    fd.append('fields[community_site]', ${mlSite});
    fd.append('ml-submit', '1');
    fd.append('anticsrf', 'true');
    var done = function(){
      f.style.display = 'none';
      document.getElementById('lead-ok').style.display = 'block';
      try { gtag('event', 'generate_lead', {community: ${mlName}}); } catch(err) {}
    };
    var url = 'https://assets.mailerlite.com/jsonp/2512297/forms/203492809790982079/subscribe';
    fetch(url, {method:'POST', body: fd}).then(done).catch(function(){
      fetch(url, {method:'POST', body: fd, mode:'no-cors'}).then(done).catch(done);
    });
  });
})();
</script>`
  }));
}

// --- city pages ---
fs.mkdirSync(path.join(ROOT, 'cities'), {recursive: true});
const STATUS_ORDER = {'Selling':0,'Under construction':1,'Planned':2,'Established':3,'Resale only':4};
for (const cp of cityPages) {
  const stName = STATE_NAMES[cp.st];
  const list = cp.list.slice().sort((a,b)=>(STATUS_ORDER[a.status]-STATUS_ORDER[b.status]) || ((b.units||0)-(a.units||0)));
  const n = list.length;
  const units = list.reduce((a,c)=>a+(c.units||0),0);
  let nums = []; list.forEach(c=>{ nums = nums.concat(priceNums(c.priceNote)); });
  const pmin = nums.length ? Math.min.apply(null,nums) : null, pmax = nums.length ? Math.max.apply(null,nums) : null;
  const priceTxt = pmin ? (pmin===pmax ? fmtPrice(pmin) : fmtPrice(pmin)+' – '+fmtPrice(pmax)) : 'Inquire';
  const selling = list.filter(c=>['Selling','Under construction','Planned'].includes(c.status)).length;
  const resale = list.filter(c=>['Resale only','Established'].includes(c.status)).length;
  const rentals = list.filter(c=>c.offer==='both').length;
  const stTotal = DATA.communities.filter(c=>c.state===cp.st).length;
  const url = `https://automotivecondos.com/cities/${cp.slug}`;
  const nearby = cityPages.filter(x=>x.st===cp.st && x.slug!==cp.slug).slice(0,8);
  const place = `${cp.city}, ${cp.st}`;

  const about = [
    `${cp.city} is home to ${n} of the ${stTotal} car condo communities we track in ${stName}${stTotal ? ` — about ${Math.round(n/stTotal*100)}% of the state's market` : ''}.`,
    selling ? `${selling} ${selling===1?'is':'are'} actively selling, under construction, or taking reservations, so new-build units are available${resale ? `, while ${resale} ${resale===1?'trades':'trade'} on the resale market` : ''}.` : `Every community here is established, so units trade on the resale market — inquiring early is the best way to hear about openings.`,
    rentals ? `${rentals} ${rentals===1?'community also offers':'communities also offer'} units for rent if you want to try a garage condo before you buy.` : `None of the ${cp.city} communities we track advertise rentals, though individual owners sometimes lease privately.`,
    pmin ? `Tracked pricing in ${cp.city} runs roughly ${priceTxt}, depending on unit size, finish, and community amenities.` : ''
  ].filter(Boolean).join(' ');

  const faqs = [
    [`How many car condo communities are in ${place}?`, `We currently track ${n} car condo and garage condo communities in ${cp.city}, ${stName}${units ? `, with ${units.toLocaleString()}+ known units between them` : ''}. Each one has its own page with status, unit count, and pricing.`],
    [`How much does a car condo cost in ${cp.city}?`, pmin ? `Pricing we track in ${cp.city} runs roughly ${priceTxt}. Smaller storage-style units sit at the low end; finished luxury units with mezzanines and amenities sit at the top.` : `Most ${cp.city} communities price units on inquiry. Open any community below to unlock its direct listing and current pricing.`],
    [`Can I rent a car condo in ${cp.city}?`, rentals ? `Yes — ${rentals} ${rentals===1?'community':'communities'} in ${cp.city} also ${rentals===1?'offers':'offer'} units for rent. Look for the "For sale or for rent" label below.` : `The ${cp.city} communities we track are primarily for sale, but private owner leases do come up. Check each community page, or browse ${stName} communities that offer rentals.`]
  ];

  const cards = list.map(c=>`<a class="card" href="../communities/${c.slug}" style="display:block">
      <div class="meta" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:${['Selling','Under construction','Planned'].includes(c.status)?'var(--blue)':'var(--muted)'}">${esc(c.status)}${c.offer==='both'?' · Buy or rent':''}</div>
      <h3 style="font-size:16.5px;margin:6px 0 4px">${esc(c.name)}</h3>
      <div class="meta">${c.units ? c.units + ' units' : 'Units: inquire'}</div>
      <div class="price">${esc(c.priceNote || 'Inquire')}</div>
      <div style="margin-top:8px;font-size:13px;font-weight:800;color:var(--blue)">View community →</div>
    </a>`).join('\n');

  fs.writeFileSync(path.join(ROOT, 'cities', cp.slug + '.html'), page({
    title: `Car Condos in ${place}: ${n} Communities (2026) | AutomotiveCondos.com`,
    desc: `Compare ${n} car condo and garage condo communities in ${cp.city}, ${stName}${pmin ? ` — pricing from ${fmtPrice(pmin)}` : ''}. Status, units, rentals, and direct listing links.`,
    canonical: url,
    depth: 1,
    body: `
${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":stName,"item":`https://automotivecondos.com/states/${slug(stName)}`},{"@type":"ListItem","position":3,"name":cp.city,"item":url}]})}
${ld({"@context":"https://schema.org","@type":"ItemList","name":`Car condo communities in ${place}`,"numberOfItems":n,"itemListElement":list.map((c,i)=>({"@type":"ListItem","position":i+1,"url":`https://automotivecondos.com/communities/${c.slug}`,"name":c.name}))})}
${ld({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))})}
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states/${slug(stName)}">${stName}</a> / ${esc(cp.city)}</div>
    <h1 style="margin-top:10px">Car Condos in <span class="blue">${esc(place)}</span></h1>
    <p style="color:var(--muted);max-width:700px;font-size:16px">${n} car condo and garage condo communities in ${esc(cp.city)}, compared side by side. Open any community to see the details and unlock its direct listing link.</p>
    <div class="grid c4" style="margin-top:18px">
      <div class="card"><div class="meta">Communities</div><div style="font-weight:800;font-size:24px">${n}</div></div>
      <div class="card"><div class="meta">Known units</div><div style="font-weight:800;font-size:24px">${units ? units.toLocaleString() + '+' : '—'}</div></div>
      <div class="card"><div class="meta">${pmin && pmin!==pmax ? 'Price range' : 'Tracked pricing'}</div><div style="font-weight:800;font-size:20px;color:var(--blue)">${priceTxt}</div></div>
      <div class="card"><div class="meta">Selling / pre-selling</div><div style="font-weight:800;font-size:24px">${selling}</div></div>
    </div>
    <div class="sec-head" style="margin-top:34px"><h2 style="font-size:22px">Every community in ${esc(cp.city)}</h2></div>
    <div class="grid c3" style="margin-top:14px">${cards}</div>

    <div class="detail-main" style="max-width:820px;margin-top:36px">
      <h2>The ${esc(cp.city)} car condo market</h2>
      <p>${esc(about)}</p>
      <h2>Frequently asked questions</h2>
      ${faqs.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
    </div>

    ${nearby.length ? `<div class="sec-head" style="margin-top:30px"><h2 style="font-size:20px">More ${stName} car condo cities</h2></div>
    <div style="margin-top:10px">${nearby.map(x=>`<a class="pill" href="${x.slug}">${esc(x.city)} <span style="color:var(--muted);font-weight:500">(${x.list.length})</span></a>`).join('')}</div>` : ''}
    <p style="font-size:14px;margin-top:14px"><a href="../states/${slug(stName)}">All ${stName} car condos →</a>${STATE_GUIDES[cp.st] ? ` · <a href="../blog/${STATE_GUIDES[cp.st]}">${stName} market guide →</a>` : ''} · <a href="../map">National map →</a></p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Own a car condo in ${esc(cp.city)}?</h2>
    <p>Buyers comparing ${esc(cp.city)} communities land on this page. List your unit for sale or rent with photos, specs and your direct contact for $29/month.</p>
    <a class="btn" href="../list-your-condo">List Your Condo</a>
  </div>
</section>`
  }));
}

// --- "for sale" state pages + national "for rent" page ---
fs.mkdirSync(path.join(ROOT, 'for-sale'), {recursive: true});
const NEW_ST = ['Selling','Under construction','Planned'];
const minPrice = c => { const n = priceNums(c.priceNote); return n.length ? Math.min.apply(null, n) : null; };
const saleCard = c => `<a class="card" href="../communities/${c.slug}" style="display:block">
      <div class="meta" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:${NEW_ST.includes(c.status)?'var(--blue)':'var(--muted)'}">${esc(c.status)}${c.offer==='both'?' · Buy or rent':''}</div>
      <h3 style="font-size:16.5px;margin:6px 0 4px">${esc(c.name)}</h3>
      <div class="meta">${esc(c.city)}${c.units ? ' · ' + c.units + ' units' : ''}</div>
      <div class="price">${esc(c.priceNote || 'Inquire')}</div>
      <div style="margin-top:8px;font-size:13px;font-weight:800;color:var(--blue)">View community →</div>
    </a>`;
const bySaleOrder = (a,b) => { const pa = minPrice(a), pb = minPrice(b); if (pa!=null && pb!=null) return pa-pb; if (pa!=null) return -1; if (pb!=null) return 1; return (b.units||0)-(a.units||0); };
const saleStates = states.filter(st => byState[st].length >= 5);
const saleSlug = st => `garage-condos-for-sale-${slug(STATE_NAMES[st])}`;
for (const st of saleStates) {
  const name = STATE_NAMES[st];
  const list = byState[st];
  const fresh = list.filter(c=>NEW_ST.includes(c.status)).sort(bySaleOrder);
  const resale = list.filter(c=>!NEW_ST.includes(c.status)).sort(bySaleOrder);
  const priced = list.filter(c=>minPrice(c)!=null);
  const ag = stateAgg[st];
  const range = ag.min ? (ag.min===ag.max ? fmtPrice(ag.min) : `${fmtPrice(ag.min)} to ${fmtPrice(ag.max)}`) : 'on inquiry';
  const cheapest = priced.slice().sort(bySaleOrder)[0];
  const url = `https://automotivecondos.com/for-sale/${saleSlug(st)}`;
  const topCities = Object.entries(list.reduce((m,c)=>{const k=cleanCity(c.city); m[k]=(m[k]||0)+1; return m;},{})).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const faqs = [
    [`How many garage condos are for sale in ${name}?`, `We track ${list.length} car condo and garage condo communities in ${name}. ${fresh.length} ${fresh.length===1?'is':'are'} selling new units, under construction, or taking reservations, and ${resale.length} ${resale.length===1?'is an established community':'are established communities'} where units change hands on the resale market.`],
    [`How much does a garage condo cost in ${name}?`, ag.min ? `Published pricing across ${priced.length} ${name} communities runs ${range}. ${cheapest ? `The lowest tracked starting price is at ${cheapest.name} in ${cheapest.city} (${cheapest.priceNote}).` : ''} Most other communities price on inquiry, so unlock each listing for current numbers.` : `Most ${name} communities price units on inquiry. Open any community below to unlock its direct listing and current pricing.`],
    [`Where are most ${name} garage condos located?`, `The biggest clusters are in ${topCities.map(([c,n])=>`${c} (${n})`).join(', ')}. The full ${name} directory lists every city we track.`],
    [`Should I buy new construction or resale?`, `New construction lets you pick a unit and finish early, often at pre-construction pricing, but you wait for the build. Resale units are available now and you can see the finished community first, but inventory is thin, so it pays to inquire with several communities at once.`]
  ];
  fs.writeFileSync(path.join(ROOT, 'for-sale', saleSlug(st) + '.html'), page({
    title: `Garage Condos for Sale in ${name} (2026): ${list.length} Communities | AutomotiveCondos.com`,
    desc: `${list.length} garage and car condo communities with units for sale in ${name}. ${fresh.length} selling new units${ag.min ? `, pricing from ${fmtPrice(ag.min)}` : ''}. Compare and unlock direct listing links.`,
    canonical: url,
    depth: 1,
    body: `
${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":name,"item":`https://automotivecondos.com/states/${slug(name)}`},{"@type":"ListItem","position":3,"name":"For sale","item":url}]})}
${ld({"@context":"https://schema.org","@type":"ItemList","name":`Garage condos for sale in ${name}`,"numberOfItems":list.length,"itemListElement":fresh.concat(resale).map((c,i)=>({"@type":"ListItem","position":i+1,"url":`https://automotivecondos.com/communities/${c.slug}`,"name":c.name}))})}
${ld({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))})}
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states/${slug(name)}">${name}</a> / For sale</div>
    <h1 style="margin-top:10px">Garage Condos for Sale in <span class="blue">${name}</span></h1>
    <p style="color:var(--muted);max-width:700px;font-size:16px">Every ${name} car condo and garage condo community with units to buy, split into new construction and resale and sorted by starting price. Open any community to unlock its direct listing link.</p>
    <div class="grid c4" style="margin-top:18px">
      <div class="card"><div class="meta">Communities</div><div style="font-weight:800;font-size:24px">${list.length}</div></div>
      <div class="card"><div class="meta">New construction</div><div style="font-weight:800;font-size:24px">${fresh.length}</div></div>
      <div class="card"><div class="meta">Resale market</div><div style="font-weight:800;font-size:24px">${resale.length}</div></div>
      <div class="card"><div class="meta">Tracked pricing</div><div style="font-weight:800;font-size:20px;color:var(--blue)">${ag.min ? (ag.min===ag.max ? fmtPrice(ag.min) : fmtPrice(ag.min)+' – '+fmtPrice(ag.max)) : 'Inquire'}</div></div>
    </div>
    ${fresh.length ? `<div class="sec-head" style="margin-top:34px"><h2 style="font-size:22px">New construction and pre-selling (${fresh.length})</h2></div>
    <div class="grid c3" style="margin-top:14px">${fresh.map(saleCard).join('\n')}</div>` : ''}
    ${resale.length ? `<div class="sec-head" style="margin-top:34px"><h2 style="font-size:22px">Resale communities (${resale.length})</h2></div>
    <p style="color:var(--muted);font-size:14px;margin:6px 0 0">Built out communities where owners sell individual units. Inventory turns over slowly, so inquire early.</p>
    <div class="grid c3" style="margin-top:14px">${resale.map(saleCard).join('\n')}</div>` : ''}
    <div class="detail-main" style="max-width:820px;margin-top:36px">
      <h2>Frequently asked questions</h2>
      ${faqs.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
    </div>
    <p style="font-size:14px;margin-top:14px"><a href="../states/${slug(name)}">Full ${name} directory →</a>${STATE_GUIDES[st] ? ` · <a href="../blog/${STATE_GUIDES[st]}">${name} market guide →</a>` : ''} · <a href="../car-condos-for-rent">Car condos for rent →</a> · <a href="../blog/buying-a-car-condo-guide">Buying guide →</a></p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Selling a car condo in ${name}?</h2>
    <p>Buyers shopping ${name} land on this page. List your unit and put it in front of them.</p>
    <a class="btn" href="../list-your-condo">List Your Condo</a>
  </div>
</section>`
  }));
}
{
  const rentals = DATA.communities.filter(c=>c.offer==='both');
  const rStates = [...new Set(rentals.map(c=>c.state))].sort((a,b)=>STATE_NAMES[a].localeCompare(STATE_NAMES[b]));
  const url = 'https://automotivecondos.com/car-condos-for-rent';
  const faqs = [
    ['Can you rent a car condo?', `Yes. ${rentals.length} of the ${DATA.communities.length} communities we track offer units for rent as well as for sale, across ${rStates.length} states. Renting is a good way to try garage condo life before buying.`],
    ['How much does it cost to rent a car condo?', 'Rents vary widely by market, unit size and finish. Storage style units in smaller markets rent for far less than finished luxury units in major metros. Open any community below to unlock its direct listing and current rates.'],
    ['What if there is no rental community near me?', 'Individual owners in for-sale communities often lease their units privately. Check the full state directory and inquire with the communities closest to you.']
  ];
  fs.writeFileSync(path.join(ROOT, 'car-condos-for-rent.html'), page({
    title: `Car Condos for Rent (2026): ${rentals.length} Communities With Rentals | AutomotiveCondos.com`,
    desc: `${rentals.length} car condo and garage condo communities that rent units, across ${rStates.length} states. Compare locations and unlock direct listing links.`,
    canonical: url,
    depth: 0,
    body: `
${ld({"@context":"https://schema.org","@type":"ItemList","name":"Car condos for rent","numberOfItems":rentals.length,"itemListElement":rentals.map((c,i)=>({"@type":"ListItem","position":i+1,"url":`https://automotivecondos.com/communities/${c.slug}`,"name":c.name}))})}
${ld({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))})}
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / Car condos for rent</div>
    <h1 style="margin-top:10px">Car Condos <span class="blue">for Rent</span></h1>
    <p style="color:var(--muted);max-width:700px;font-size:16px">${rentals.length} communities in ${rStates.length} states that rent units as well as sell them. Try garage condo life before you buy.</p>
    ${rStates.map(st=>`<div class="sec-head" style="margin-top:30px"><h2 style="font-size:21px">${STATE_NAMES[st]}</h2></div>
    <div class="grid c3" style="margin-top:12px">${rentals.filter(c=>c.state===st).map(c=>saleCard(c).replace(/\.\.\/communities\//g,'communities/')).join('\n')}</div>`).join('\n')}
    <div class="detail-main" style="max-width:820px;margin-top:36px">
      <h2>Frequently asked questions</h2>
      ${faqs.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
    </div>
    <p style="font-size:14px;margin-top:14px"><a href="states">Browse all states →</a> · <a href="map">National map →</a> · <a href="blog/renting-out-your-garage-condo">Renting out your unit →</a></p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Renting out a car condo?</h2>
    <p>Renters searching for garage space land on this page. List your unit for rent.</p>
    <a class="btn" href="list-your-condo">List Your Condo</a>
  </div>
</section>`
  }));
}


// --- listing pages ---
fs.mkdirSync(path.join(ROOT, 'listings'), {recursive: true});
for (const l of LISTINGS) {
  const stName = STATE_NAMES[l.state] || l.state;
  const url = `https://automotivecondos.com/listings/${l.pageSlug}`;
  const comm = DATA.communities.find(c => c.slug === l.community_slug);
  const photos = (l.photos && l.photos.length) ? l.photos : ['assets/photos/pillar-market.jpg'];
  const feats = (Array.isArray(l.features) ? l.features : String(l.features || '').split(',')).map(x => x.trim()).filter(Boolean);
  const specs = [['Price', fmtListPrice(l)], ['Size', l.sqft ? Number(l.sqft).toLocaleString('en-US') + ' sq ft' : ''], ['Door (W x H)', l.door || ''], ['Clear height', l.ceiling || ''], ['Offer', l.offer === 'rent' ? 'For rent' : 'For sale']].filter(x => x[1]);
  const others = LISTINGS.filter(x => x !== l && (x.community_slug === l.community_slug || x.state === l.state)).slice(0, 3);
  const desc = `${l.offer==='rent'?'For rent':'For sale'}: ${l.title} at ${l.community_name || 'a car condo community'} in ${cleanCity(l.city)}, ${l.state}. ${fmtListPrice(l)}${l.sqft ? ', ' + l.sqft + ' sq ft' : ''}. Photos, specs and direct contact.`;
  fs.writeFileSync(path.join(ROOT, 'listings', l.pageSlug + '.html'), page({
    title: `${l.title} | ${l.offer==='rent'?'For Rent':'For Sale'} in ${cleanCity(l.city)}, ${l.state} | AutomotiveCondos.com`,
    desc: desc.slice(0, 158),
    canonical: url,
    depth: 1,
    body: `
${ld({"@context":"https://schema.org","@type":"Product","name":l.title,"description":String(l.description||'').slice(0,500),"image":photos.map(p=>'https://automotivecondos.com/'+p),"url":url,"offers":{"@type":"Offer","price":Number(l.price)||undefined,"priceCurrency":"USD","availability":"https://schema.org/InStock","url":url}})}
${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":stName,"item":`https://automotivecondos.com/states/${slug(stName)}`},...(comm?[{"@type":"ListItem","position":3,"name":comm.name,"item":`https://automotivecondos.com/communities/${comm.slug}`}]:[]),{"@type":"ListItem","position":comm?4:3,"name":l.title,"item":url}]})}
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states/${slug(stName)}">${stName}</a>${comm ? ` / <a href="../communities/${comm.slug}">${esc(comm.name)}</a>` : ''} / Listing</div>
    <div class="lst-head">
      <div><span class="uc-tag static ${l.offer==='rent'?'rent':''}">${l.offer==='rent'?'For rent':'For sale'}</span>
      <h1 style="margin:10px 0 6px">${esc(l.title)}</h1>
      <p style="color:var(--muted);font-size:17px;margin:0">${comm ? `<a href="../communities/${comm.slug}">${esc(comm.name)}</a> · ` : (l.community_name ? esc(l.community_name) + ' · ' : '')}${esc(cleanCity(l.city))}, <a href="../states/${slug(stName)}">${stName}</a></p></div>
      <div class="lst-price">${fmtListPrice(l)}</div>
    </div>
    <div class="lst-gallery${photos.length===1?' one':''}">
      ${photos.slice(0,5).map((p,i)=>`<a href="../${p}" target="_blank" rel="noopener" class="g${i}" style="background-image:url('../${p}')" aria-label="Photo ${i+1}"></a>`).join('')}
    </div>
    ${photos.length > 5 ? `<p class="meta" style="font-size:13px;margin-top:6px">${photos.length} photos · <a href="../${photos[5]}" target="_blank" rel="noopener">see more</a></p>` : ''}
    <div class="detail-cols">
      <div class="detail-main">
        <div class="grid c3 lst-specs">${specs.map(x=>`<div class="card"><div class="meta">${x[0]}</div><div style="font-weight:800;font-size:17px">${esc(x[1])}</div></div>`).join('')}</div>
        <h2>About this unit</h2>
        ${String(l.description||'').split(/\n{2,}|\r?\n/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}
        ${feats.length ? `<h2>Features</h2><ul class="feat-list">${feats.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        ${comm ? `<h2>About ${esc(comm.name)}</h2><p>${esc(comm.name)} is ${/^[aeiou]/i.test(comm.status)?'an':'a'} ${esc(comm.status.toLowerCase())} car condo community in ${esc(cleanCity(comm.city))}, ${stName}${comm.units ? ' with ' + comm.units + ' units' : ''}. <a href="../communities/${comm.slug}">See everything we track on ${esc(comm.name)} →</a></p>` : ''}
        <p class="meta" style="font-size:12.5px;margin-top:22px">Listed by the owner or their agent. Details are provided by the lister and not verified by AutomotiveCondos.com; confirm everything directly before you buy or rent. Listing ID ${esc(l.id)}.</p>
      </div>
      <div class="detail-side">
        <div class="card inq">
          <div class="inq-tag">Contact the ${l.offer==='rent'?'owner':'seller'} directly</div>
          <h3>${esc(l.contact_name || 'Listing contact')}</h3>
          ${l.contact_phone ? `<a class="btn" style="width:100%;text-align:center;margin:8px 0" href="tel:${esc(String(l.contact_phone).replace(/[^0-9+]/g,''))}">Call ${esc(l.contact_phone)}</a>` : ''}
          ${l.contact_email ? `<a class="btn ghost" style="width:100%;text-align:center;margin:4px 0" href="mailto:${esc(l.contact_email)}?subject=${encodeURIComponent('AutomotiveCondos listing: ' + l.title)}">Email the ${l.offer==='rent'?'owner':'seller'}</a>` : ''}
          ${l.website ? `<a style="display:block;text-align:center;margin-top:10px;font-weight:700" href="${esc(l.website)}" target="_blank" rel="noopener nofollow">Visit website →</a>` : ''}
          <p class="meta" style="font-size:12.5px;margin-top:12px">Mention you found it on AutomotiveCondos.com.</p>
        </div>
      </div>
    </div>
    ${unitSection(others, '../', 'More units nearby')}
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Have a car condo to sell or rent?</h2>
    <p>Get your own listing page like this one, shown on its community and state pages, for $29/month.</p>
    <a class="btn" href="../submit-listing">List My Unit</a>
  </div>
</section>`
  }));
}

// --- "best of" ranking pages ---
fs.mkdirSync(path.join(ROOT,'best'),{recursive:true});
for (const b of BEST) {
  const stName = STATE_NAMES[b.state];
  const url = `https://automotivecondos.com/best/${b.slug}`;
  const picks = b.picks.map(pk=>({...pk, c: BY_SLUG[pk.slug], d: DETAILS[pk.slug]||{}})).filter(x=>x.c);
  const short = (v,n)=> v ? (v.length>n ? v.slice(0,n).replace(/[ ,;(]+[^ ]*$/,'')+'…' : v) : '—';
  const cut = v => v ? String(v).split(/ \(| plus|; |, each|, with|\. /)[0].replace(/[ ,;]+$/,'') : '—';
  const cmpRows = picks.map((x,i)=>`<tr data-href="../communities/${x.c.slug}"><td>${i+1}</td><td><a href="#pick-${i+1}"><strong>${esc(x.c.name)}</strong></a><div class="meta">${esc(x.award)}</div></td><td>${esc(x.c.city)}</td><td>${esc(x.c.priceNote && x.c.priceNote!=='Inquire' ? x.c.priceNote : cut(x.d.price))}</td><td>${esc(cut(x.d.size))}</td><td>${esc(x.c.status)}</td></tr>`).join('');
  const cards = picks.map((x,i)=>`
  <article class="best-pick" id="pick-${i+1}">
    <div class="bp-head"><div class="bp-rank">${i+1}</div><div><div class="bp-award">${esc(x.award)}</div><h2><a href="../communities/${x.c.slug}">${esc(x.c.name)}</a></h2><div class="meta">${esc(x.c.city)}, ${b.state} · ${esc(x.c.status)}${x.c.units?` · ${x.c.units} units`:''}</div></div></div>
    ${x.d.summary?`<p>${esc(x.d.summary)}</p>`:''}
    <div class="bp-cols">
      <div><h3>Why it made the list</h3><p>${esc(x.why)}</p><h3>Worth knowing</h3><p>${esc(x.watch)}</p></div>
      <div>${specRows(x.d) ? `<table class="spec-table">${specRows(x.d)}</table>` : `<table class="spec-table"><tr><th>Pricing</th><td>${esc(x.c.priceNote||'Inquire')}</td></tr></table>`}</div>
    </div>
    ${x.d.amenities?`<h3>Amenities</h3><ul class="feat-list two">${x.d.amenities.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>`:''}
    <div class="bp-foot"><a class="btn" href="../communities/${x.c.slug}">Full details &amp; listing info</a>${x.d.sources?`<span class="src-note">Sources: ${x.d.sources.map(s=>`<a href="${esc(s[1])}" target="_blank" rel="noopener nofollow">${esc(s[0])}</a>`).join(' · ')}</span>`:''}</div>
  </article>`).join('');
  const budget = (b.budget||[]).map(([label,sl])=>`<div class="card"><h3 style="font-size:16px">${esc(label)}</h3><ul class="feat-list">${sl.filter(s=>BY_SLUG[s]).map(s=>`<li><a href="../communities/${s}">${esc(BY_SLUG[s].name)}</a> <span class="meta">${esc(BY_SLUG[s].priceNote && BY_SLUG[s].priceNote!=='Inquire' ? BY_SLUG[s].priceNote : cut(DETAILS[s]&&DETAILS[s].price))}</span></li>`).join('')}</ul></div>`).join('');
  const total = byState[b.state].length;
  const other = BEST.filter(x=>x!==b);
  fs.writeFileSync(path.join(ROOT,'best',b.slug+'.html'), page({
    title: b.title.length>70 ? b.title.replace(/: .*$/,'') + ' | AutomotiveCondos.com' : b.title,
    desc: b.desc, canonical: url, depth: 1,
    body: `
${ld({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://automotivecondos.com/"},{"@type":"ListItem","position":2,"name":stName,"item":`https://automotivecondos.com/states/${slug(stName)}`},{"@type":"ListItem","position":3,"name":b.h1,"item":url}]})}
${ld({"@context":"https://schema.org","@type":"ItemList","name":b.h1,"itemListOrder":"https://schema.org/ItemListOrderAscending","numberOfItems":picks.length,"itemListElement":picks.map((x,i)=>({"@type":"ListItem","position":i+1,"name":x.c.name,"url":`https://automotivecondos.com/communities/${x.c.slug}`}))})}
${ld({"@context":"https://schema.org","@type":"FAQPage","mainEntity":b.faq.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))})}
<section class="block best-hero">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states/${slug(stName)}">${stName}</a> / Best car condos</div>
    <div class="bh-kicker">2026 Rankings · Updated ${esc(DET.checked||'2026')}</div>
    <h1>${esc(b.h1)}</h1>
    <p class="bh-lede">${esc(b.intro)}</p>
    <div class="bh-stats"><div><strong>${total}</strong><span>${stName} communities tracked</span></div><div><strong>${picks.length}</strong><span>Picks, each for a different buyer</span></div><div><strong>${picks.filter(x=>x.d.sources).length}</strong><span>Picks with sourced specs</span></div></div>
  </div>
</section>
<section class="block" style="padding-top:10px">
  <div class="wrap">
    <h2 style="font-size:22px">Quick comparison</h2>
    <div class="table-scroll"><table class="data best-cmp"><thead><tr><th>#</th><th>Community</th><th>City</th><th>Pricing</th><th>Unit sizes</th><th>Status</th></tr></thead><tbody>${cmpRows}</tbody></table></div>
    <div class="how-we-pick"><h3>How we picked</h3><p>We went through all ${total} ${stName} communities in our directory. We weighed build quality and specs (ceiling height, door size, construction), amenities and clubhouse, track access, location, price per square foot, developer track record and whether you can actually buy in today. No community paid to be on this list. Specs and prices come from developer materials, listings and local reporting, and the sources are linked under each pick. Prices move fast, so confirm the current numbers before you buy.</p></div>
    ${cards}
    <h2 style="font-size:22px;margin-top:40px">Best ${stName} car condos by budget</h2>
    <div class="grid c3">${budget}</div>
    <h2 style="font-size:22px;margin-top:40px">Frequently asked questions</h2>
    ${b.faq.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
    <p style="margin-top:26px;font-size:15px"><a href="../states/${slug(stName)}">See all ${total} ${stName} communities →</a>${STATE_GUIDES[b.state]?` · <a href="../blog/${STATE_GUIDES[b.state]}">${stName} market guide →</a>`:''}${byState[b.state].length>=5?` · <a href="../for-sale/garage-condos-for-sale-${slug(stName)}">${stName} garage condos for sale →</a>`:''}${other.map(o=>` · <a href="${o.slug}">${esc(o.h1)} →</a>`).join('')}</p>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Run a ${stName} community?</h2>
    <p>Put your community in front of the buyers reading this list. Featured spots are limited.</p>
    <a class="btn btn-gold" href="/advertise">See Packages</a>
  </div>
</section>
<script>document.querySelectorAll('table.best-cmp tbody tr').forEach(function(tr){tr.style.cursor='pointer';tr.addEventListener('click',function(e){if(e.target.closest('a'))return;location.href=tr.getAttribute('data-href');});});</script>`
  }));
}


// --- Car Condo Price Index ---
{
  const { parsePrice } = require('./prices');
  const MONTH = new Date().toISOString().slice(0,7);
  const monthName = new Date(MONTH+'-15').toLocaleString('en-US',{month:'long',year:'numeric'});
  const med = a => { if(!a.length) return null; const b=[...a].sort((x,y)=>x-y); const m=Math.floor(b.length/2); return b.length%2?b[m]:(b[m-1]+b[m])/2; };
  const fmt = v => v==null?'—':(v>=1e6?'$'+(v/1e6).toFixed(v>=1e7?0:2).replace(/\.?0+$/,'')+'M':'$'+Math.round(v/1e3)+'K');
  const priced = DATA.communities.map(c=>({c,p:parsePrice(c.priceNote)})).filter(x=>x.p&&x.p.low);
  const lows = priced.map(x=>x.p.low);
  const nat = { n: priced.length, median: med(lows), mean: lows.reduce((a,b)=>a+b,0)/lows.length,
    newMed: med(priced.filter(x=>!x.p.resale).map(x=>x.p.low)), resaleMed: med(priced.filter(x=>x.p.resale).map(x=>x.p.low)),
    newN: priced.filter(x=>!x.p.resale).length, resaleN: priced.filter(x=>x.p.resale).length };
  const buckets = [['Under $100K',0,1e5],['$100K–$250K',1e5,2.5e5],['$250K–$500K',2.5e5,5e5],['$500K–$1M',5e5,1e6],['$1M and up',1e6,1e12]]
    .map(([l,a,b])=>({l, n: lows.filter(v=>v>=a&&v<b).length}));
  const stRows = Object.keys(byState).map(st=>{ const xs=priced.filter(x=>x.c.state===st); const l=xs.map(x=>x.p.low);
    return {st, name:STATE_NAMES[st], total:byState[st].length, n:xs.length, median:med(l), min:l.length?Math.min(...l):null, max:xs.length?Math.max(...xs.map(x=>x.p.high||x.p.low)):null}; })
    .filter(r=>r.n>=4).sort((a,b)=>b.median-a.median);
  const metroMap = {}; priced.forEach(x=>{ const k=x.c.city+', '+x.c.state; (metroMap[k]=metroMap[k]||[]).push(x.p.low); });
  const cities = Object.entries(metroMap).filter(([k,v])=>v.length>=3).map(([k,v])=>({k,n:v.length,median:med(v)})).sort((a,b)=>b.median-a.median);
  const cheapest = [...priced].sort((a,b)=>a.p.low-b.p.low).filter(x=>x.p.low>=50000).slice(0,10);
  const priciest = [...priced].sort((a,b)=>b.p.low-a.p.low).slice(0,10);
  const perSf = priced.filter(x=>x.p.perSf).map(x=>x.p.perSf);

  // history (one snapshot per month, current month overwritten)
  const HF = path.join(ROOT,'data','price-index-history.json');
  const hist = fs.existsSync(HF) ? JSON.parse(fs.readFileSync(HF,'utf8')) : {snapshots:[]};
  const snap = { month: MONTH, n: nat.n, median: nat.median, newMedian: nat.newMed, resaleMedian: nat.resaleMed, communities: DATA.communities.length,
    states: Object.fromEntries(stRows.map(r=>[r.st,{n:r.n,median:r.median}])) };
  hist.snapshots = hist.snapshots.filter(x=>x.month!==MONTH).concat([snap]).sort((a,b)=>a.month.localeCompare(b.month));
  fs.writeFileSync(HF, JSON.stringify(hist,null,1));
  const prev = hist.snapshots.length>1 ? hist.snapshots[hist.snapshots.length-2] : null;
  const chg = (cur,old) => (old&&cur) ? ((cur-old)/old*100) : null;
  const chgTxt = v => v==null ? '<span class="pi-new">First reading</span>' : `<span class="${v>=0?'pi-up':'pi-down'}">${v>=0?'▲':'▼'} ${Math.abs(v).toFixed(1)}%</span>`;
  const natChg = prev ? chg(nat.median, prev.median) : null;

  // horizontal bar chart (single series, one hue)
  const maxM = Math.max(...stRows.map(r=>r.median));
  const chart = `<div class="pi-rows" role="img" aria-label="Median entry price by state">${stRows.map(r=>`<div class="pi-row" title="${r.name}: median entry price ${fmt(r.median)} (${r.n} priced communities)"><div class="pr-l">${r.name}</div><div class="pr-t"><div class="pr-b" style="width:${(r.median/maxM*82).toFixed(1)}%"></div><span class="pr-v">${fmt(r.median)}</span></div></div>`).join('')}</div>`;
  const maxB = Math.max(...buckets.map(b=>b.n));
  const dist = `<div class="pi-dist">${buckets.map(b=>`<div class="pd-col" title="${b.l}: ${b.n} communities"><div class="pd-n">${b.n}</div><div class="pd-bar" style="height:${Math.max(4,b.n/maxB*150)}px"></div><div class="pd-l">${b.l}</div><div class="pd-pct">${Math.round(b.n/nat.n*100)}%</div></div>`).join('')}</div>`;
  const stTable = stRows.map((r,i)=>`<tr><td>${i+1}</td><td><a href="states/${slug(r.name)}">${r.name}</a></td><td><strong>${fmt(r.median)}</strong></td><td>${fmt(r.min)} – ${fmt(r.max)}</td><td>${r.n} of ${r.total}</td><td>${prev&&prev.states[r.st]?chgTxt(chg(r.median,prev.states[r.st].median)):chgTxt(null)}</td></tr>`).join('');
  const cityTable = cities.map(r=>{ const [city,st]=r.k.split(', '); return `<tr><td><a href="cities/${slug(city)}-${st.toLowerCase()}">${esc(city)}</a>, ${st}</td><td><strong>${fmt(r.median)}</strong></td><td>${r.n}</td></tr>`; }).join('');
  const li = xs => xs.map(x=>`<li><a href="communities/${x.c.slug}">${esc(x.c.name)}</a> <span class="meta">${esc(x.c.city)}, ${x.c.state} · ${esc(x.c.priceNote)}</span></li>`).join('');
  const top = stRows[0], bottom = stRows[stRows.length-1];
  const url = 'https://automotivecondos.com/price-index';
  const faq = [
    ['How much does a car condo cost in the US?', `As of ${monthName}, the median entry price across the ${nat.n} car condo communities with published pricing in our directory is ${fmt(nat.median)}. Half of communities start below that and half above it. Entry prices range from under $50K for small storage-style units to more than $1M for luxury and trackside suites.`],
    ['Which state has the most expensive car condos?', `Among states with at least four priced communities, ${top.name} has the highest median entry price at ${fmt(top.median)}.`],
    ['Which state has the cheapest car condos?', `${bottom.name} has the lowest median entry price at ${fmt(bottom.median)} among states with at least four priced communities.`],
    ['Are new car condos more expensive than resales?', `New and pre-construction communities in our data have a median starting price of ${fmt(nat.newMed)} (${nat.newN} communities), versus ${fmt(nat.resaleMed)} for resale-only listings (${nat.resaleN} communities). Newer projects tend to be larger and more amenitized, which explains much of the gap.`],
    ['How often is the Car Condo Price Index updated?', 'Monthly. Each update is saved as a dated snapshot, so the index builds a price history for every state over time.']
  ];
  fs.writeFileSync(path.join(ROOT,'price-index.html'), page({
    title: `Car Condo Price Index (${monthName}): What Car Condos Cost by State`,
    desc: `The ${monthName} Car Condo Price Index: median car condo and garage condo prices nationally and in ${stRows.length} states, from ${nat.n} priced communities. Cheapest and priciest markets, new vs resale, updated monthly.`,
    canonical: url, depth: 0,
    body: `
${ld({"@context":"https://schema.org","@type":"Dataset","name":"Car Condo Price Index","description":`Median entry prices for car condo and garage condo communities in the United States, by state and city, from ${nat.n} communities with published pricing.`,"url":url,"creator":{"@type":"Organization","name":"AutomotiveCondos.com","url":"https://automotivecondos.com/"},"temporalCoverage":hist.snapshots[0].month+"/"+MONTH,"spatialCoverage":"United States","dateModified":new Date().toISOString().slice(0,10),"isAccessibleForFree":true,"license":"https://creativecommons.org/licenses/by/4.0/"})}
${ld({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(f=>({"@type":"Question","name":f[0],"acceptedAnswer":{"@type":"Answer","text":f[1]}}))})}
<section class="block best-hero">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / Car Condo Price Index</div>
    <div class="bh-kicker">Updated monthly · ${monthName}</div>
    <h1>The Car Condo Price Index</h1>
    <p class="bh-lede">What car condos and garage condos actually cost across the US. Built from published pricing for ${nat.n} of the ${DATA.communities.length} communities in our directory, and updated every month so you can watch each market move.</p>
    <div class="pi-hero">
      <div class="pi-big"><span>National median entry price</span><strong>${fmt(nat.median)}</strong><em>${chgTxt(natChg)}</em></div>
      <div class="bh-stats" style="margin-top:0">
        <div><strong>${fmt(nat.newMed)}</strong><span>New / pre-construction median</span></div>
        <div><strong>${fmt(nat.resaleMed)}</strong><span>Resale median</span></div>
        <div><strong>${nat.n}</strong><span>Priced communities</span></div>
        <div><strong>${stRows.length}</strong><span>States indexed</span></div>
      </div>
    </div>
  </div>
</section>
<section class="block" style="padding-top:26px">
  <div class="wrap">
    <div class="pi-key">
      <div><strong>Most expensive state</strong><span>${top.name} · ${fmt(top.median)} median</span></div>
      <div><strong>Most affordable state</strong><span>${bottom.name} · ${fmt(bottom.median)} median</span></div>
      <div><strong>Under $250K</strong><span>${Math.round((buckets[0].n+buckets[1].n)/nat.n*100)}% of communities start below $250K</span></div>
      <div><strong>$1M+ entry</strong><span>${buckets[4].n} communities start at $1M or more</span></div>
    </div>

    <h2 class="pi-h2">Median entry price by state</h2>
    <p class="meta">States with at least four communities with published pricing. Hover or tap a bar for the sample size.</p>
    <div class="pi-chart-wrap">${chart}</div>

    <h2 class="pi-h2">State by state</h2>
    <div class="table-scroll"><table class="data"><thead><tr><th>#</th><th>State</th><th>Median entry</th><th>Range</th><th>Priced communities</th><th>vs last month</th></tr></thead><tbody>${stTable}</tbody></table></div>

    <h2 class="pi-h2">How entry prices are spread</h2>
    <p class="meta">Number of communities by starting price, nationwide.</p>
    ${dist}

    ${cities.length?`<h2 class="pi-h2">Cities with the most priced communities</h2><p class="meta">Cities with three or more communities with published pricing.</p><div class="table-scroll"><table class="data"><thead><tr><th>City</th><th>Median entry</th><th>Communities</th></tr></thead><tbody>${cityTable}</tbody></table></div>`:''}

    <div class="grid c2" style="margin-top:34px">
      <div class="card"><h3>Lowest entry prices</h3><p class="meta">Cheapest starting prices we track (excluding units under $50K)</p><ul class="feat-list">${li(cheapest)}</ul></div>
      <div class="card"><h3>Highest entry prices</h3><p class="meta">Communities with the highest starting prices</p><ul class="feat-list">${li(priciest)}</ul></div>
    </div>
    ${perSf.length>=5?`<p class="meta" style="margin-top:16px">Where developers quote price per square foot (${perSf.length} communities), the median is $${Math.round(med(perSf))}/sq ft.</p>`:''}

    <div class="how-we-pick" style="margin-top:34px"><h3>Methodology</h3><p>The index uses the lowest published price for each community in our directory: the developer's "from" price for new and pre-construction projects, and the lowest recent asking or sold price for resale-only communities. Rentals, deposits and per-square-foot quotes are left out of the medians. We use the median rather than the average because a handful of $1M+ suites would pull an average far above what most buyers pay. States need at least four priced communities to be ranked. Prices come from developer sites, MLS and commercial listings, and local reporting. The index is rebuilt monthly and each month is saved as a snapshot, so changes over time reflect both price moves and new communities entering the data. Free to cite with a link to AutomotiveCondos.com.</p></div>

    <h2 class="pi-h2">Frequently asked questions</h2>
    ${faq.map(f=>`<h3 class="faq-q">${esc(f[0])}</h3><p>${esc(f[1])}</p>`).join('')}
    <p style="margin-top:22px"><a href="blog/car-condo-cost-guide">Full car condo cost guide →</a> · <a href="best/best-car-condos-texas">Best car condos in Texas →</a> · <a href="best/best-car-condos-florida">Best car condos in Florida →</a></p>
  </div>
</section>`
  }));
  console.log('Price index:', nat.n, 'priced, median', fmt(nat.median), stRows.length, 'states,', cities.length, 'cities');
}

// --- sitemap ---
const urls = ['price-index.html', ...BEST.map(b=>`best/${b.slug}.html`), ...LISTINGS.map(l=>`listings/${l.pageSlug}.html`), 'submit-listing.html', 'car-condos-for-rent.html', ...saleStates.map(st=>`for-sale/${saleSlug(st)}.html`),'', 'map.html', 'states.html', 'blog.html', 'about.html', 'list-your-condo.html', 'advertise',
  ...fs.readdirSync(path.join(ROOT,'blog')).filter(f=>f.endsWith('.html')).map(f=>'blog/'+f),
  ...states.map(st=>`states/${slug(STATE_NAMES[st])}.html`),
  ...DATA.communities.map(c=>`communities/${c.slug}.html`),
  ...cityPages.map(cp=>`cities/${cp.slug}.html`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>https://automotivecondos.com/${u.replace(/\.html$/,'')}</loc></url>`).join('\n')}
</urlset>
`);

console.log(`Built states.html, ${states.length} state pages, ${cityPages.length} city pages, sitemap.xml (${DATA.communities.length} communities).`);
