#!/usr/bin/env node
/* Builds blog.html + blog/<slug>.html from the POSTS array below. Add a post, run: node scripts/blog.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const LOGO = `<svg width="30" height="26" viewBox="0 0 70 60" aria-hidden="true"><rect x="5" y="5" width="60" height="50" rx="4" fill="none" stroke="#FFFFFF" stroke-width="4"/><path d="M11 12 H59 M11 18 H59" stroke="#FFFFFF" stroke-width="3"/><rect x="11" y="23" width="48" height="26" fill="#3B8EE2"/><path d="M17 45 C17 41 19 38 22 38 H27 L31 33 H42 L46 38 H48 C51 38 53 41 53 45 Z" fill="#FFFFFF"/><circle cx="23" cy="45" r="3.6" fill="#3B8EE2" stroke="#FFFFFF" stroke-width="2.2"/><circle cx="46" cy="45" r="3.6" fill="#3B8EE2" stroke="#FFFFFF" stroke-width="2.2"/></svg>`;

function page({title, desc, canonical, body, depth}) {
  const p = depth ? '../' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
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

const POSTS = [
{
slug: 'what-is-a-car-condo',
tag: 'Guide',
title: 'What Is a Car Condo? Deeded Garage Ownership, Explained',
desc: 'A car condo is a garage unit you own outright — deeded real property you can finance, improve, lease, and sell. Here is how they work and why collectors are buying them.',
date: 'November 6, 2026',
teaser: 'Why collectors are buying garages the way they buy homes.',
html: `
<p>A car condo (also called a garage condo, auto condo, or motor condo) is a garage unit you <strong>own outright</strong> — deeded real property, exactly like a residential condominium. You take title, you can finance it with a mortgage, improve it however you like, lease it out, and sell it when you're done. That single fact separates a car condo from every storage unit you've ever rented.</p>
<h2>How ownership works</h2>
<p>A developer builds a community of garage units — typically 20 to 300 of them — and sells each unit individually. You get a deed, you pay property taxes, and a condo association maintains the shell: roof, exterior walls, common drives, insurance on the structure, and usually gated security. Association dues are typically modest compared to a residential HOA because there's not much to maintain.</p>
<p>Inside your walls, it's yours. Owners finish units with epoxy floors, lifts, mezzanine lofts with lounges, bathrooms, A/C, and in some communities a small office for a business.</p>
<h2>Who buys them</h2>
<ul>
<li><strong>Collectors</strong> who have outgrown the home garage and want their cars in one secure, climate-controlled place.</li>
<li><strong>RV and boat owners</strong> — a 14- or 16-foot door clears most motorhomes, and HOA-restricted neighborhoods can't complain about what's parked inside.</li>
<li><strong>Small businesses and tradespeople</strong>, where zoning allows — detailers, shops, contractors who need deeded space instead of a lease.</li>
<li><strong>Investors</strong> who lease units to all of the above, or buy pre-construction in early phases.</li>
</ul>
<h2>Car condo vs. storage unit</h2>
<p>A rented storage bay is an expense that goes up every year and builds nothing. A car condo is an asset: you control your costs, you build equity, and well-located communities have appreciated meaningfully as the category has grown. Many sold-out communities now trade actively on the resale market.</p>
<h2>The community factor</h2>
<p>Don't underestimate this one: most car condo communities turn into car clubs. Cars-and-coffee mornings, member events, neighbors who will talk camshafts with you for an hour. For a lot of owners, that's half the purchase.</p>
<p>Ready to look? <a href="../states.html">Browse every community by state</a>, or read our <a href="car-condo-cost-guide.html">2026 cost guide</a> next.</p>`
},
{
slug: 'car-condo-cost-guide',
tag: 'Pricing',
title: 'How Much Does a Car Condo Cost in 2026?',
desc: 'Car condo prices in 2026 range from under $200K to over $2M. Here is what drives the price — market, size, door height, finish level — plus the ongoing fees to budget for.',
date: 'November 6, 2026',
teaser: 'Price ranges by market, what drives them, and the fees nobody mentions.',
html: `
<p>Car condo pricing is wide: entry-level units in secondary markets start under $200K, typical units in strong markets run $300K–$600K, and finished luxury vaults in premium communities trade from $800K past $2M. Here's how to read the range.</p>
<h2>What drives the price</h2>
<ul>
<li><strong>Market.</strong> Florida is the deepest car condo market in the country, and within it, metro matters: Tampa Bay and Southeast Florida command far more than inland secondary markets. Track-side communities (units attached to a motorsports circuit) carry their own premium.</li>
<li><strong>Size.</strong> Units commonly run 600 to 2,500+ sq ft. Price per square foot is the honest comparison — most of the market falls roughly between $175 and $325/sq ft, with premium markets well above that.</li>
<li><strong>Door and ceiling height.</strong> A 14-foot door that clears a Class C motorhome — or 16 feet for a Class A — adds real money. So does the clear height for a four-post lift.</li>
<li><strong>Finish level.</strong> A bare shell and a finished unit with mezzanine, bath, A/C, and epoxy are different products. Finished resales often price near what the build-out actually cost — sometimes less.</li>
<li><strong>Phase.</strong> Pre-construction pricing in an early phase is usually the cheapest a community ever sells for. The trade: you don't control the delivery date.</li>
</ul>
<h2>New vs. resale</h2>
<p>New units from the developer typically price above comparable resales — you're paying for current construction costs and first choice of location in the building. Resales between owners can be the better deal, especially when the seller already invested in the build-out.</p>
<h2>The ongoing costs nobody mentions</h2>
<ul>
<li><strong>Association dues</strong> — usually modest ($100–$400/month is common), covering the shell, common areas, and master insurance.</li>
<li><strong>Property taxes</strong> — it's deeded real estate; budget for your county's rate on the assessed value.</li>
<li><strong>Insurance on contents and interior improvements</strong> — the association's policy covers the structure, not your cars or your build-out.</li>
<li><strong>Utilities</strong> — power for the lift and A/C is on you.</li>
</ul>
<h2>Bottom line</h2>
<p>Figure the real comparison in $/sq ft against other communities in the same metro, then adjust for door height, finish, and dues. <a href="../states.html">Compare communities in your state</a> — and if you own a unit and wonder what it's worth today, <a href="../list-your-condo.html">talk to us</a>.</p>`
},
{
slug: 'buying-a-car-condo-guide',
tag: 'Checklist',
title: 'Buying a Car Condo: 9 Things to Check Before You Sign',
desc: 'Door height, clear ceiling height, lift capacity, HOA rules, zoning, power, insurance, phasing, and resale — the 9-point checklist for buying a car condo.',
date: 'November 6, 2026',
teaser: 'Door heights, lifts, HOA rules, zoning — the details that decide it.',
html: `
<p>Car condos look simple — four walls and a big door — but the details decide whether the unit actually works for you. Run this checklist before you sign anything.</p>
<h2>1. Measure the door, not the building</h2>
<p>A 12-foot door handles cars and trailers. A 14-foot door clears most enclosed trailers and Class C motorhomes. A Class A motorhome wants 16 feet. The brochure says "RV storage"; the door says the truth.</p>
<h2>2. Confirm clear ceiling height</h2>
<p>Two-post lifts want about 12 feet of clear height; four-post storage lifts want 14+. Measure under the lowest obstruction — sprinkler lines, lights, door tracks — not to the roof peak.</p>
<h2>3. Read the declaration before you dream</h2>
<p>Some communities allow running a business, some allow a loft lounge, very few allow overnight stays — and the rules live in the condo declaration and city zoning, not the sales pitch. If your plan is "shop by day, man-cave by night," confirm both allow it.</p>
<h2>4. Check the power</h2>
<p>A lift, a welder, two A/C units and an EV charger add up. Ask what service the unit has (100A? 200A?) and what upgrading costs.</p>
<h2>5. Ask what the dues cover — and read the reserve study</h2>
<p>Dues are usually reasonable, but ask what happens when the roof needs replacing. A community with no reserves is a special assessment waiting to happen.</p>
<h2>6. Insurance: structure vs. contents</h2>
<p>The association insures the shell. Your cars, your lift, your mezzanine build-out need your own policy. Get a quote before closing, not after.</p>
<h2>7. Understand the phase you're buying into</h2>
<p>Early-phase pre-construction pricing is usually the community's lowest ever — but delivery dates slip. If you need the space this year, a finished resale beats a rendering.</p>
<h2>8. Visit on a Saturday</h2>
<p>The community is half the product. Show up when owners are around: if the culture is cars-and-coffee and open doors, you'll know in ten minutes. If it's dead silent rows of closed doors, you'll know that too.</p>
<h2>9. Think resale from day one</h2>
<p>Generic, well-located units with tall doors resell fastest. Ultra-personalized build-outs can narrow your buyer pool. You don't have to build for the next owner — just know what you're choosing.</p>
<p>Start the hunt: <a href="../states.html">every car condo community, by state</a>. New to the category? Read <a href="what-is-a-car-condo.html">What Is a Car Condo?</a> first.</p>`
}
];

// posts
fs.mkdirSync(path.join(ROOT, 'blog'), {recursive:true});
for (const post of POSTS) {
  fs.writeFileSync(path.join(ROOT, 'blog', post.slug + '.html'), page({
    title: `${post.title} | AutomotiveCondos.com`,
    desc: post.desc,
    canonical: `https://automotivecondos.com/blog/${post.slug}.html`,
    depth: 1,
    body: `
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs" style="max-width:820px;margin:0 auto 14px"><a href="../index.html">Home</a> / <a href="../blog.html">Blog</a> / ${post.title}</div>
    <article class="post">
      <h1>${post.title}</h1>
      <div class="post-meta">${post.date} · AutomotiveCondos.com</div>
      ${post.html}
    </article>
  </div>
</section>
<section class="cta-band">
  <div class="wrap">
    <h2>Browse every car condo <span class="lightblue">in America</span></h2>
    <p>Every community, organized by state — status, unit counts, and pricing.</p>
    <a class="btn" href="../states.html">Browse by State</a>
  </div>
</section>`
  }));
}

// blog index
const cards = POSTS.map(p=>`<a class="card post-card" href="blog/${p.slug}.html" style="display:block">
  <span class="tag gray">${p.tag}</span>
  <h3>${p.title}</h3>
  <div class="meta">${p.teaser}</div>
  <div class="price">Read →</div>
</a>`).join('\n');

fs.writeFileSync(path.join(ROOT, 'blog.html'), page({
  title: 'Car Condo Blog — Guides, Pricing & Market Intel | AutomotiveCondos.com',
  desc: 'In-depth guides on buying, selling, and owning car condos: pricing, checklists, market trends, and community spotlights.',
  canonical: 'https://automotivecondos.com/blog.html',
  depth: 0,
  body: `
<section class="block">
  <div class="wrap">
    <h1>The Car Condo <span class="blue">Blog</span></h1>
    <p style="color:var(--muted);max-width:640px">Guides, pricing intel, and market analysis for buyers, owners, and developers.</p>
    <div class="grid c3" style="margin-top:26px">${cards}</div>
  </div>
</section>`
}));

console.log(`Built blog.html + ${POSTS.length} posts.`);
