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
    <div class="breadcrumbs"><a href="/">Home</a> / Car Condos by State</div>
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
  const rows = list.map(c=>`<tr data-offer="${c.offer||'buy'}" data-href="../communities/${c.slug}.html"><td><strong>${esc(c.name)}</strong></td><td>${esc(c.city)}</td><td>${esc(c.status)}</td><td>${c.units??'—'}</td><td>${esc(c.priceNote||'Inquire')}</td><td><a href="../communities/${c.slug}.html">Details →</a></td></tr>`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'states', slug(name)+'.html'), page({
    title: `Car Condos in ${name}: Communities & Listings | AutomotiveCondos.com`,
    desc: `${list.length} car condo communities in ${name} across ${cities.length} cities — status, unit counts and pricing, plus how to buy or sell a unit.`,
    canonical: `https://automotivecondos.com/states/${slug(name)}.html`,
    depth: 1,
    body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states.html">By State</a> / ${name}</div>
    <h1 style="margin-top:10px">Car Condos in <span class="blue">${name}</span></h1>
    <p style="color:var(--muted);max-width:680px">${list.length} communit${list.length===1?'y':'ies'} across ${cities.length} cit${cities.length===1?'y':'ies'} in our ${name} directory. Own a unit here? <a href="../list-your-condo.html">List it with us</a> — for sale or for rent — and reach the buyers and renters comparing communities on this page.</p>
    <div style="margin:18px 0 10px">${cities.map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>
    <div style="margin:0 0 18px" id="offer-toggle">
      <button class="btn" data-f="all" style="margin-right:8px">All</button>
      <button class="btn ghost" data-f="buy" style="margin-right:8px">For Sale</button>
      <button class="btn ghost" data-f="rent">For Rent</button>
    </div>
    <div class="table-scroll">
    <table class="data">
      <thead><tr><th>Community</th><th>City</th><th>Status</th><th>Units</th><th>Pricing</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
    <script>
    (function(){
      var wrap = document.getElementById('offer-toggle'); if(!wrap) return;
      wrap.addEventListener('click', function(e){
        var b = e.target.closest('button'); if(!b) return;
        var f = b.getAttribute('data-f');
        wrap.querySelectorAll('button').forEach(function(x){x.className = x===b ? 'btn' : 'btn ghost'; if(x!==b){x.style.marginRight=x.getAttribute('data-f')==='rent'?'':'8px';}});
        document.querySelectorAll('table.data tbody tr').forEach(function(tr){
          var o = tr.getAttribute('data-offer')||'buy';
          var show = f==='all' || (f==='buy' && (o==='buy'||o==='both')) || (f==='rent' && o==='both');
          tr.style.display = show ? '' : 'none';
        });
      });
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
    <a class="btn" href="../list-your-condo.html">List Your Condo</a>
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
  const kc = KIND_COPY[kindOf(c)];
  const myNums = priceNums(c.priceNote);
  const pageUrl = `https://automotivecondos.com/communities/${c.slug}.html`;

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
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="../states.html">By State</a> / <a href="../states/${slug(stName)}.html">${stName}</a> / ${esc(c.name)}</div>
    <h1 style="margin-top:10px">${esc(c.name)}</h1>
    <p style="color:var(--muted);font-size:17px">${esc(c.city)}, ${stName} · ${esc(kc.label.charAt(0).toUpperCase()+kc.label.slice(1))}</p>
    <div class="grid c4" style="margin-top:18px">
      <div class="card"><div class="meta">Status</div><div style="font-weight:800;font-size:17px">${esc(c.status)}</div></div>
      <div class="card"><div class="meta">Units</div><div style="font-weight:800;font-size:17px">${c.units ?? '—'}</div></div>
      <div class="card"><div class="meta">Offering</div><div style="font-weight:800;font-size:17px">${offer}</div></div>
      <div class="card"><div class="meta">Pricing</div><div style="font-weight:800;font-size:17px;color:var(--blue)">${esc(c.priceNote || 'Inquire')}</div></div>
    </div>

    <div class="detail-cols">
      <div class="detail-main">
        <h2>About this community</h2>
        <p>${esc(about)}</p>

        <h2>What communities like this offer</h2>
        <p class="meta" style="font-size:13.5px;margin-bottom:8px">Typical of the ${esc(kc.label.replace("community","communities"))} we track — confirm specifics for ${esc(c.name)} via the listing info request.</p>
        <ul class="feat-list">${kc.feats.map(f=>`<li>${f}</li>`).join('')}</ul>

        <h2>The ${stName} market at a glance</h2>
        <ul class="feat-list ctx">${ctx.map(x=>`<li>${x}</li>`).join('')}</ul>
        <p style="font-size:14px"><a href="../states/${slug(stName)}.html">Browse every ${stName} community →</a> · <a href="../map.html">See the national map →</a></p>

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
        <p style="font-size:12.5px;color:var(--muted);margin-top:10px">Details compiled from public sources and may change. Represent this community? <a href="../list-your-condo.html">Claim this page</a>.</p>
      </div>
    </div>

    ${nearby.length ? `<div class="sec-head" style="margin-top:34px"><h2 style="font-size:20px">More in ${stName}</h2><div class="sub"><a href="../states/${slug(stName)}.html">Full directory →</a></div></div>
    <div class="grid c3">` + nearby.map(x => `<a class="card" href="${x.slug}.html" style="display:block"><h3 style="font-size:15px">${esc(x.name)}</h3><div class="meta">${esc(x.city)}, ${x.state} · ${esc(x.status)}</div><div class="price">${esc(x.priceNote || 'Inquire')}</div></a>`).join('') + '</div>' : ''}
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Own a unit at ${esc(c.name)}?</h2>
    <p>Buyers are viewing this page. List your unit for a one-time $49, or add your direct contact for $29/month and every inquiry reaches you instantly.</p>
    <a class="btn" href="../list-your-condo.html">List Your Condo</a>
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

// --- sitemap ---
const urls = ['', 'map.html', 'states.html', 'blog.html', 'about.html', 'list-your-condo.html',
  ...fs.readdirSync(path.join(ROOT,'blog')).filter(f=>f.endsWith('.html')).map(f=>'blog/'+f),
  ...states.map(st=>`states/${slug(STATE_NAMES[st])}.html`),
  ...DATA.communities.map(c=>`communities/${c.slug}.html`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`  <url><loc>https://automotivecondos.com/${u}</loc></url>`).join('\n')}
</urlset>
`);

console.log(`Built states.html, ${states.length} state pages, sitemap.xml (${DATA.communities.length} communities).`);
