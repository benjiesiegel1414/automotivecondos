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
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}styles.css">
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
},
{
slug: 'garage-condos-for-sale-near-me',
tag: 'Find One',
title: 'Garage Condos for Sale Near Me: How to Actually Find One in 2026',
desc: 'Searching "garage condos for sale near me"? Here is why the MLS fails you, where garage condos actually get listed, and how to find every community in your state.',
date: 'November 6, 2026',
teaser: 'Why the MLS fails you, and where these units actually trade.',
faq: [
["Why don't garage condos show up on Zillow?", "Many garage condos are classified as commercial condominiums, so they get listed on commercial platforms (LoopNet, Crexi) or sold directly by developers rather than through the residential MLS feeds that power Zillow and Realtor.com. Resales often trade owner-to-owner inside the community before they're ever publicly listed."],
["How do I find garage condos in my state?", "Start with a state-level directory. AutomotiveCondos.com tracks 270+ communities across 42 states, including communities that are selling, resale-only, under construction, and planned — so you can see every option in your market, not just the ones paying to advertise."],
["Can I buy a garage condo before it's built?", "Yes. Most new communities sell units in pre-construction phases, and early-phase pricing is usually the lowest the community will ever offer. The trade-off is that delivery dates can slip by months or more."]
],
html: `
<p>Type "garage condos for sale near me" into Google and you'll get a mess: a few expired LoopNet listings, a Zillow page full of regular condos that happen to have garages, and maybe one developer site for a community three states away. The frustrating truth is that garage condos are one of the fastest-growing niches in real estate — and one of the hardest to shop for.</p>
<h2>Why garage condos are so hard to find</h2>
<p>Three reasons this market hides from normal search tools:</p>
<ul>
<li><strong>They're often commercial property.</strong> Many garage condo communities are zoned and platted as commercial condominiums. That pushes listings to LoopNet and Crexi — platforms most car collectors never think to search — instead of the residential MLS that feeds Zillow and Realtor.com.</li>
<li><strong>Developers sell direct.</strong> New communities typically sell through their own websites and sales offices, with no MLS listing at all. If you don't know a community exists, you'll never see its inventory.</li>
<li><strong>Resales happen inside the walls.</strong> In sold-out communities, units frequently change hands owner-to-owner — someone mentions at cars-and-coffee that they're selling, and it's gone before it was ever listed.</li>
</ul>
<h2>The right way to search</h2>
<p><strong>Step 1: Map every community in your market.</strong> Before you shop units, you need the full list of communities within driving distance. That's exactly what our <a href="../states.html">state-by-state directory</a> and <a href="../map.html">national map</a> are for — every community we track, including resale-only communities that never advertise and planned projects you can get into at pre-construction pricing.</p>
<p><strong>Step 2: Sort by status.</strong> "Selling" communities have developer inventory today. "Resale only" communities are sold out, but units trade regularly — these are often the best-located, most established buildings. "Under construction" and "Planned" are your early-pricing opportunities.</p>
<p><strong>Step 3: Get on lists.</strong> For sold-out communities you love, contact the association or developer and ask to be notified of resales. Serious buyers who've expressed interest hear about units days before the public does.</p>
<p><strong>Step 4: Check the commercial platforms too.</strong> Once you know a community's exact name, search it on LoopNet and Crexi — resale units that do get formally listed usually land there.</p>
<h2>What "near me" really means in this market</h2>
<p>Garage condos cluster around wealth, car culture, and friendly zoning — which means coverage is uneven. Florida alone has 100+ communities; some entire states have one or two. If your metro has nothing, look at the nearest hub: collectors routinely buy units 45–90 minutes from home, because the unit is a destination, not a daily commute.</p>
<h2>Skip the searching — inquire once</h2>
<p>Found a community on our directory you want in? Hit the Inquire link on any <a href="../states.html">state page</a> or <a href="../map.html">map pin</a> and we'll point you at what's available there — listed with us or not.</p>`
},
{
slug: 'are-garage-condos-a-good-investment',
tag: 'Investment',
title: 'Are Garage Condos a Good Investment? The Honest 2026 Analysis',
desc: 'Garage condos have appreciated sharply in top markets — but they are not houses. Here is the honest case for and against garage condos as an investment in 2026.',
date: 'November 6, 2026',
teaser: 'Appreciation, rental income, and the honest case against.',
faq: [
["Do garage condos appreciate in value?", "In established markets they have. In Florida, the median recorded garage condo sale climbed from roughly $230K in 2021 to roughly $429K in 2026 — up about 87% — and county assessors raised values 11.5% for 2026. Appreciation varies heavily by market and community, and past results don't guarantee future returns."],
["Can you rent out a garage condo?", "Usually yes, subject to the association's rules. Leases on finished units commonly run several hundred to over a thousand dollars per month depending on market and size, making them a genuine income asset for some owners."],
["Are garage condos risky?", "The main risks are concentration (a niche buyer pool), oversupply in hot markets where many new projects are being built at once, and illiquidity compared to houses. Buying well-located units at sensible price-per-square-foot numbers is the best protection."]
],
html: `
<p>Garage condos sit in an odd spot: part real estate, part lifestyle purchase, part business asset. So are they an investment, or an expensive toy box? Honest answer: they can be either, and the difference is mostly about what you pay and where.</p>
<h2>The bull case</h2>
<ul>
<li><strong>Real appreciation in real markets.</strong> In Florida — the deepest garage condo market in the country — the median recorded single-unit sale rose from about $230K in 2021 to about $429K in 2026, and county assessed values on established units rose 11.5% for 2026. Sold-out communities trade actively on resale.</li>
<li><strong>It's deeded real property.</strong> You can finance it, depreciate it (when used for business), 1031-exchange it in many cases, lease it, and sell it. A rented storage bay gives you none of that.</li>
<li><strong>Rental income is real.</strong> Finished units in good markets lease for several hundred to $1,000+ per month. Boat, RV, and collector demand is structural — HOA-restricted suburbs keep producing customers who can't park their toys at home.</li>
<li><strong>Supply is constrained where it matters.</strong> Land near wealthy zip codes with industrial-friendly zoning is scarce. The best-located communities are irreplaceable.</li>
</ul>
<h2>The bear case</h2>
<ul>
<li><strong>Niche buyer pool.</strong> When you sell a house, everyone is a potential buyer. When you sell a garage condo, your buyer owns toys and money. Expect longer marketing times than residential.</li>
<li><strong>Pipeline risk.</strong> Hot markets are attracting a wave of new construction — Florida alone has dozens of projects planned or under construction. If several deliver into the same metro at once, resale pricing softens.</li>
<li><strong>Dues and taxes never sleep.</strong> Between association dues, property taxes, insurance on contents, and utilities, a typical unit carries real monthly cost. Vacancy isn't free.</li>
<li><strong>Ultra-custom build-outs don't always pay back.</strong> The $150K bar-and-memorabilia mezzanine makes the unit perfect for you, not necessarily worth $150K more to the next buyer.</li>
</ul>
<h2>How investors underwrite them</h2>
<p>Treat it like small commercial real estate: compare on <strong>price per square foot</strong> against other communities in the same metro (most of the national market trades between roughly $175 and $325/sq ft, with premium markets well above), confirm door height and clear height (they drive rentability), read the association budget and reserves, and model dues + taxes + insurance against realistic lease rates. If the numbers work as a rental, the lifestyle use is free optionality.</p>
<h2>Bottom line</h2>
<p>A well-located unit bought at a sane $/sq ft in a supply-constrained market has been a genuinely good hold over the past five years. A top-of-market unit in a metro with six competing projects under construction is a lifestyle purchase — enjoy it, but don't call it alpha.</p>
<p>Research your market: <a href="../states.html">browse every community by state</a> or read the <a href="car-condo-cost-guide.html">2026 cost guide</a> next. This is general information, not financial advice — run your own numbers.</p>`
},
{
slug: 'how-to-finance-a-garage-condo',
tag: 'Financing',
title: 'How to Finance a Garage Condo: Loans, Rates & What Lenders Want',
desc: 'You usually cannot get a normal 30-year mortgage on a garage condo. Here are the five ways buyers actually finance them — commercial loans, HELOCs, developer programs and more.',
date: 'November 6, 2026',
teaser: 'Why there is no 30-year mortgage, and the five routes that work.',
faq: [
["Can you get a mortgage on a garage condo?", "Not a conventional residential mortgage in most cases — garage condos typically aren't eligible for Fannie Mae/Freddie Mac programs because they're not dwellings. Buyers use commercial condo loans, local bank portfolio loans, HELOCs on their home, developer financing, or cash."],
["What down payment do you need for a garage condo?", "Commercial and portfolio lenders commonly want 20–30% down on garage condos, though terms vary widely by bank and borrower. Developer programs on new construction sometimes require less."],
["Are garage condo loan rates higher than mortgage rates?", "Usually yes. Commercial condo loans typically price above residential mortgage rates and often carry shorter terms — e.g. 15–25 year amortizations, sometimes with balloon payments or rate resets."]
],
html: `
<p>Here's the surprise that catches most first-time garage condo buyers: <strong>you generally can't get a normal 30-year mortgage on one.</strong> Residential mortgage programs are built for dwellings, and a garage condo — however nice the mezzanine lounge — usually isn't one. But tens of thousands of these units have been financed. Here's how buyers actually do it.</p>
<h2>1. Commercial / small-balance condo loans</h2>
<p>The standard route. Local and regional banks and credit unions write commercial condominium loans on garage units, typically with 20–30% down, amortizations of 15–25 years, and rates somewhat above residential mortgages — sometimes with a balloon or a rate reset at year 5 or 10. The bank that already financed other units in your community is your best first call: they know the collateral and the association.</p>
<h2>2. Portfolio loans from community banks</h2>
<p>Smaller banks that keep loans on their own books have flexibility the big national lenders don't. If you have strong credit, real income, and a banking relationship, a portfolio lender can often structure something sensible even when the big banks say "we don't do garages."</p>
<h2>3. Home equity (HELOC or cash-out refi)</h2>
<p>Many buyers simply tap equity in their primary home. The money is cheap relative to commercial debt, the process is familiar, and you close as a cash buyer — which matters in communities where units sell fast. The obvious caveat: you're putting your house behind your garage. Size it responsibly.</p>
<h2>4. Developer and builder financing</h2>
<p>New communities frequently line up a preferred lender or offer structured deposits on pre-construction sales — e.g. staged payments during construction with financing arranged at delivery. Early-phase buyers often get the best of both worlds: the lowest pricing the community will ever offer, plus time to arrange the loan.</p>
<h2>5. Business purchase / SBA angle</h2>
<p>If the unit will genuinely house your business (and the community's zoning allows commercial use), it may qualify for business lending, including SBA 504/7(a) programs in some cases — often with lower down payments than a commercial condo loan. Talk to your lender and accountant; the use rules are real.</p>
<h2>What every lender will ask about</h2>
<ul>
<li><strong>The association's health</strong> — budget, reserves, owner-occupancy mix, pending litigation.</li>
<li><strong>The appraisal</strong> — comps are thin in young communities; expect the appraiser to look at other garage condo sales in the metro, which is where knowing your market's $/sq ft helps you sanity-check the price. Our <a href="car-condo-cost-guide.html">cost guide</a> covers typical ranges.</li>
<li><strong>Your exit</strong> — shorter loan terms mean you should know whether you'll hold, refinance, or sell before any balloon.</li>
</ul>
<p>Shopping markets first? <a href="../states.html">Browse communities by state</a> and compare pricing before you talk to a single lender. This is general information, not financial advice — confirm terms with your own lender.</p>`
},
{
slug: 'renting-out-your-garage-condo',
tag: 'Income',
title: 'Renting Out a Garage Condo: Rates, Rules & Real Returns',
desc: 'Garage condos can produce genuine rental income — finished units lease for hundreds to over a thousand dollars a month. What to check, what to charge, and what can go wrong.',
date: 'November 6, 2026',
teaser: 'What units lease for, and the rules that decide if you can.',
faq: [
["How much does a garage condo rent for?", "Depending on market, size, and finish level, garage condo leases commonly run from a few hundred dollars a month for basic units to $1,000–$2,500+ for large finished units in premium markets. Local comparables matter more than national averages."],
["Can my HOA stop me from renting my garage condo?", "Yes — the condo declaration governs. Some associations allow leasing freely, some require minimum lease terms or board approval, and some prohibit commercial activity by tenants. Read the declaration before you buy with rental plans."],
["Is garage condo rental income passive?", "Mostly. With one tenant, no plumbing in many units, and the association maintaining the shell, garage condos are among the lowest-touch rentals in real estate — but you still handle leasing, insurance, and the occasional tenant issue."]
],
html: `
<p>The quiet secret of the garage condo world: a lot of owners never park a car in their unit. They lease it — to the collector who isn't ready to buy, the small business that needs deeded-quality space without buying, the RV owner whose HOA just sent another nastygram. Done right, it's some of the lowest-drama rental income in real estate.</p>
<h2>What units actually lease for</h2>
<p>Rates track size, finish, and market. Rough bands we see across the country: basic unfinished bays in secondary markets from a few hundred dollars a month; mid-size finished units in active markets $800–$1,500; large, climate-controlled units with mezzanines in premium metros $1,500–$2,500+. One data point from our directory: a 29-unit Spokane community leases units from about $1,250/month. Your true comp is whatever similar units in your own metro lease for — check the communities near you on our <a href="../map.html">map</a> and call around.</p>
<h2>Read the declaration first</h2>
<p>Before you buy with rental intent, confirm three things in the condo documents:</p>
<ul>
<li><strong>Leasing rules.</strong> Minimum lease terms? Board approval? A cap on the percentage of units leased at once?</li>
<li><strong>Use rules.</strong> Can a tenant run a business? Store a commercial vehicle? Wrench on cars? The answer varies wildly between communities.</li>
<li><strong>Insurance requirements.</strong> Most associations require owners (and often tenants) to carry their own liability and contents coverage.</li>
</ul>
<h2>The underwriting math</h2>
<p>Say a unit costs $350K with $250/month dues, $300/month taxes, and $75/month insurance. At $1,400/month rent you're grossing 4.8% and netting roughly 2.6% before any debt — plus whatever appreciation the market gives you. That's not a cap-rate monster; it's a hard asset that pays its own carry while it (historically, in good markets) appreciates. Buyers using leverage need the rent to clear the commercial loan payment too — see <a href="how-to-finance-a-garage-condo.html">our financing guide</a>.</p>
<h2>Finding tenants</h2>
<p>Demand usually finds you: community waiting lists, the association's own grapevine, local car club groups, and RV/boat owner forums. Good tenants stay years — moving a car collection is a project nobody repeats casually.</p>
<h2>What can go wrong</h2>
<p>The short list: a tenant running an unauthorized business that violates zoning; uninsured contents losses becoming your problem; associations tightening lease rules after you buy (get the current rules in writing); and vacancy in thin markets. None of these are exotic — they're the standard landlord homework, minus the toilets.</p>
<p>Thinking of buying a unit to lease? <a href="../states.html">Compare communities and pricing in your state</a>, or if you already own one and want it in front of buyers instead, <a href="../list-your-condo.html">list it with us</a>.</p>`
},
{
slug: 'garage-condo-vs-storage-unit',
tag: 'Comparison',
title: 'Garage Condo vs. Storage Unit: The Real 10-Year Cost Comparison',
desc: 'Renting climate-controlled vehicle storage can cost $500+/month forever. Buying a garage condo costs more upfront but builds equity. Here is the honest 10-year math.',
date: 'November 6, 2026',
teaser: 'Rent forever, or own the box? The 10-year math.',
faq: [
["Is it cheaper to rent storage or buy a garage condo?", "Over a short horizon, renting is cheaper. Over 5–10+ years, ownership often wins for anyone storing valuable vehicles long-term: rent money is gone forever, while a deeded unit builds equity and has historically appreciated in strong markets."],
["What does climate-controlled car storage cost per month?", "Enclosed, climate-controlled vehicle storage commonly runs $250–$700+ per vehicle per month in major metros, and premium collector storage with concierge service can run far higher."],
["Can I write off a garage condo?", "If the unit is used for business purposes, owners may be able to depreciate it and deduct expenses — a benefit renters never get. Rules are situation-specific, so confirm with your accountant."]
],
html: `
<p>Every garage condo owner had the same moment: writing yet another monthly storage check and realizing the facility's owner was building wealth with their money. Here's the honest comparison between renting space and owning it.</p>
<h2>The monthly math</h2>
<p><strong>Renting:</strong> enclosed single-car storage commonly runs $150–$300/month in average markets; climate-controlled collector storage in major metros runs $250–$700+ per car; concierge collector facilities can be four figures. For a three-car collection in a good facility, $900–$2,000/month is normal — $108K–$240K over ten years, gone.</p>
<p><strong>Owning:</strong> a $300K unit carries roughly $500–$900/month in dues, taxes, insurance, and utilities. Add financing and the monthly outlay can resemble high-end rent — but a chunk of every payment is principal, and the asset itself has historically appreciated in strong markets (Florida's median sale is up ~87% since 2021).</p>
<h2>Where ownership wins</h2>
<ul>
<li><strong>Equity instead of receipts.</strong> Ten years of rent buys nothing. Ten years of ownership in a decent market has often meant meaningful appreciation plus principal paydown.</li>
<li><strong>Total control.</strong> Your lift, your compressor, your beer fridge, your hours. Storage facilities limit access, prohibit wrenching, and can non-renew you.</li>
<li><strong>Space for the lifestyle.</strong> A 1,200 sq ft unit with a mezzanine is a clubhouse, not a parking spot. Storage bays are parking spots.</li>
<li><strong>Business flexibility.</strong> Where zoning allows, owners can run businesses, depreciate the asset, and deduct expenses. Renters can't.</li>
<li><strong>Rate risk.</strong> Storage rents have risen relentlessly; facilities reprice annually. Your dues rise slower, and a fixed loan payment never does.</li>
</ul>
<h2>Where renting wins</h2>
<ul>
<li><strong>Short horizons.</strong> Need space for 18 months? Rent. Transaction costs eat short ownership periods.</li>
<li><strong>Zero capital.</strong> No down payment, no closing costs, no exposure.</li>
<li><strong>Total flexibility.</strong> Collection shrinking? Walk away at the end of the lease.</li>
<li><strong>Thin markets.</strong> If your metro has no quality communities, a good rental facility beats a bad purchase.</li>
</ul>
<h2>The break-even intuition</h2>
<p>For multi-vehicle owners paying $1,000+/month in premium storage, ownership has historically broken even somewhere in years 4–7 once equity, appreciation, and rent avoidance are netted against carrying costs — faster in appreciating markets, slower where prices are flat. Run your own numbers with local storage quotes and real dues from a community you'd actually buy in.</p>
<p>See what ownership costs in your market: <a href="../states.html">browse communities by state</a>, then read <a href="car-condo-cost-guide.html">the full cost guide</a> and <a href="how-to-finance-a-garage-condo.html">financing options</a>.</p>`
},
{
slug: 'best-states-for-garage-condos',
tag: 'Markets',
title: 'The Best States for Garage Condos in 2026, Ranked by the Data',
desc: 'We track 270+ garage condo communities across 42 states. Here is where the market is deepest, where it is growing fastest, and where buyers still have room to get in early.',
date: 'November 6, 2026',
teaser: 'Where the market is deepest — straight from our directory data.',
faq: [
["Which state has the most garage condos?", "Florida, by a wide margin — our directory tracks roughly 100 communities there, more than triple any other state, concentrated in Southwest Florida, Tampa Bay, and the southeast coast."],
["What states are garage condos growing fastest in?", "Texas and Arizona stand out: Texas has 30+ communities led by the 14-location Garages of America platform, and Arizona has 20+ including multi-location brands like Toy Barn and LuxeLocker, with several more under construction in both states."],
["Are there garage condos outside the Sun Belt?", "Yes — Minnesota and Wisconsin pioneered the concept (AutoMotorPlex), Chicago's suburbs have an active cluster, and communities now exist everywhere from New Hampshire lake country to Anchorage, Alaska."]
],
html: `
<p>We track <strong>270+ garage condo communities across 42 states</strong> — selling, resale-only, under construction, and planned. That dataset gives a pretty clear picture of where this market actually lives. Here's the 2026 landscape.</p>
<h2>Tier 1: Florida — the capital</h2>
<p>Around <a href="../states/florida.html">100 communities</a>, from $180K resale bays in Punta Gorda to $2M+ trackside units at Tampa's Motor Enclave. Southwest Florida (Naples–Fort Myers–Punta Gorda) is the deepest sub-market in America; Tampa Bay carries the highest medians; and the pipeline is enormous — including a planned 400-unit motorsport resort in Naples. Deep resale liquidity, real price history, and real competition among developers.</p>
<h2>Tier 2: Texas and Arizona — the growth engines</h2>
<p><a href="../states/texas.html">Texas</a> (30+ communities) is the platform-builder state: Garages of America alone operates 14 locations across DFW, Houston, and Austin, with COTA trackside condos topping $1.25M. <a href="../states/arizona.html">Arizona</a> (20+) is brand country too — Toy Barn's nine Phoenix-area locations, LuxeLocker's buy-or-rent model, and new luxury projects in Scottsdale. Both states add projects quarterly.</p>
<h2>Tier 3: Established regional hubs</h2>
<ul>
<li><strong><a href="../states/minnesota.html">Minnesota</a> / <a href="../states/wisconsin.html">Wisconsin</a>:</strong> where the category was born — AutoMotorPlex Chanhassen remains the spiritual home, with new phases in Medina and projects in Lakeville and Big Lake.</li>
<li><strong><a href="../states/illinois.html">Illinois</a>:</strong> Chicago's suburbs are busy — Iron Gate Naperville, plus new builds in Barrington, Lake Zurich, and Mundelein.</li>
<li><strong><a href="../states/michigan.html">Michigan</a>:</strong> M1 Concourse's 250+ units beside a private track, with Motorsports Gateway Howell under construction.</li>
<li><strong><a href="../states/colorado.html">Colorado</a> / <a href="../states/idaho.html">Idaho</a> / <a href="../states/washington.html">Washington</a>:</strong> steady mountain-west growth from Denver's metro clusters to Boise, Spokane, and a 100-unit motor-and-yacht project on Seattle's Salmon Bay.</li>
<li><strong>The Carolinas &amp; Georgia:</strong> racing country delivers — Charlotte's speedway corridor, Storage Caves' multi-state expansion, Atlanta Motorsports Park trackside units.</li>
</ul>
<h2>The sleepers</h2>
<p>Two surprises from the data: <strong>Alaska</strong> — Anchorage alone has five communities (long winters, big toys); and <strong>New Hampshire's lake country</strong>, with three communities serving boat-season storage demand. Meanwhile, genuinely underbuilt territory remains: Las Vegas proper, Southern California's inland metros, Nashville, and most of the Northeast outside New Jersey — markets with the car culture and the money, but hardly any product. Developers, take note.</p>
<h2>How to use this</h2>
<p>Pick your state on <a href="../map.html">the map</a>, compare communities by status and price, and remember the pattern that holds everywhere: the best-located communities sell out, go resale-only, and appreciate. The buyers who do best get into good locations early. Start here: <a href="../states.html">all 42 states</a>.</p>`
},
{
slug: 'garage-condo-buildout-ideas',
tag: 'Build-Out',
title: 'Garage Condo Build-Out Guide: Mezzanines, Lifts & What Adds Value',
desc: 'From epoxy floors to mezzanine lounges: what a garage condo build-out costs, what order to do it in, and which upgrades actually return money at resale.',
date: 'November 6, 2026',
teaser: 'What build-outs cost, and which upgrades return money.',
faq: [
["How much does a garage condo build-out cost?", "Typical ranges: basic (epoxy, lighting, storage) $15K–$40K; mid-level (mezzanine, half bath, mini-split climate) $50K–$120K; showpiece build-outs with full lounges, kitchens and A/V run $150K–$300K+."],
["Do I need permits to finish a garage condo?", "Usually yes for anything structural, electrical, or plumbing — mezzanines, bathrooms, panel upgrades. The association typically requires approval of plans too. Unpermitted work can bite you at resale."],
["What garage condo upgrades add the most resale value?", "The market consistently pays for: climate control, a bathroom, a code-compliant mezzanine, upgraded electrical service, and quality lighting/epoxy. Highly personal theming returns the least."]
],
html: `
<p>The day you close on a bare shell is the day the real fun starts. Here's how experienced owners sequence a build-out, what each stage costs, and — if you ever sell — which dollars come back.</p>
<h2>Stage 1: The foundation layer ($15K–$40K)</h2>
<ul>
<li><strong>Epoxy or polyaspartic floors</strong> — do this first, with the unit empty. Figure $5–$12/sq ft done right.</li>
<li><strong>Lighting</strong> — high-output LED transforms the space for a few thousand dollars. Nothing else you do returns as much per dollar.</li>
<li><strong>Electrical upgrades</strong> — more circuits, 240V for the lift and welder, EV charging. Confirm your panel capacity before anything else; upgrading service later is far costlier.</li>
<li><strong>Storage systems</strong> — cabinets, slatwall, overhead racks.</li>
</ul>
<h2>Stage 2: Capability ($20K–$60K)</h2>
<ul>
<li><strong>The lift</strong> — four-post storage lifts from ~$3K–$8K installed; confirm clear ceiling height first (storage lifts want 14+ feet).</li>
<li><strong>Climate control</strong> — mini-splits are the standard answer; in humid states, dehumidification protects the cars even when you skip cooling.</li>
<li><strong>Compressed air</strong> — plumbed air with drops at each bay separates real shops from pretty ones.</li>
<li><strong>Water/half bath</strong> — if your unit has plumbing stubs, a half bath is among the highest-ROI additions in the category. If it doesn't, get quotes before dreaming.</li>
</ul>
<h2>Stage 3: The mezzanine ($30K–$120K+)</h2>
<p>The signature garage condo move. A steel mezzanine with code stairs and railing typically starts around $20K–$40K installed before finishes; a finished lounge above (flooring, drywall, HVAC extension, furniture, A/V) takes it well past $75K. Permits and association approval are nearly always required — mezzanines are structural. Done right, it roughly doubles your usable square footage, and the market pays for documented, permitted space.</p>
<h2>What returns money — and what doesn't</h2>
<p><strong>Pays back:</strong> climate control, bathrooms, permitted mezzanines, electrical capacity, lifts (negotiable but valued), quality floors and lighting. These make the unit more capable for any future owner.</p>
<p><strong>Doesn't:</strong> team-branded theming, built-in memorabilia displays, exotic finishes, and anything unpermitted. Build the showpiece if it makes you happy — just know those dollars are consumption, not investment. (More on that logic in <a href="are-garage-condos-a-good-investment.html">our investment guide</a>.)</p>
<h2>Sequence it like a pro</h2>
<p>Floors → electrical → climate → lift/air → mezzanine → finishes. Every owner who did it backwards (mezzanine first, floors last) has a story about moving nine tons of steel to epoxy underneath it.</p>
<p>Still shopping for the shell itself? Check ceiling heights and door specs before you fall in love — our <a href="buying-a-car-condo-guide.html">9-point buying checklist</a> covers what to verify, and the <a href="../states.html">directory</a> covers where to look.</p>`
}
];

// posts
fs.mkdirSync(path.join(ROOT, 'blog'), {recursive:true});
for (const post of POSTS) {
  const bodyFile = path.join(__dirname, 'posts', post.slug + '.html');
  const body = fs.existsSync(bodyFile) ? fs.readFileSync(bodyFile, 'utf8') : post.html;
  let faqHtml = '', faqLd = '';
  if (post.faq && post.faq.length) {
    faqHtml = `<h2>Frequently asked questions</h2>` + post.faq.map(([q,a]) =>
      `<h3 style="text-transform:none;letter-spacing:0;font-size:17px;margin-top:20px">${q}</h3><p>${a}</p>`).join('');
    faqLd = `\n<script type="application/ld+json">${JSON.stringify({
      "@context":"https://schema.org","@type":"FAQPage",
      "mainEntity": post.faq.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))
    })}</scr`+`ipt>`;
  }
  const articleLd = `\n<script type="application/ld+json">${JSON.stringify({
    "@context":"https://schema.org","@type":"Article","headline":post.title,
    "description":post.desc,"datePublished":"2026-11-06",
    "author":{"@type":"Organization","name":"AutomotiveCondos.com"},
    "publisher":{"@type":"Organization","name":"AutomotiveCondos.com","url":"https://automotivecondos.com"},
    "mainEntityOfPage":`https://automotivecondos.com/blog/${post.slug}.html`
  })}</scr`+`ipt>`;
  fs.writeFileSync(path.join(ROOT, 'blog', post.slug + '.html'), page({
    title: `${post.title} | AutomotiveCondos.com`,
    desc: post.desc,
    canonical: `https://automotivecondos.com/blog/${post.slug}.html`,
    depth: 1,
    body: `${articleLd}${faqLd}
<section class="block">
  <div class="wrap">
    <div class="breadcrumbs" style="max-width:820px;margin:0 auto 14px"><a href="/">Home</a> / <a href="../blog.html">Blog</a> / ${post.title}</div>
    <article class="post">
      <h1>${post.title}</h1>
      <div class="post-meta">${post.date} · AutomotiveCondos.com</div>
      ${fs.existsSync(path.join(ROOT,'assets','blog',post.slug+'.jpg')) ? `<img src="../assets/blog/${post.slug}.jpg" alt="${post.title}" style="width:100%;height:auto;border-radius:6px;margin:4px 0 14px">` : fs.existsSync(path.join(ROOT,'assets','blog',post.slug+'.svg')) ? `<img src="../assets/blog/${post.slug}.svg" alt="${post.title} — illustration" style="width:100%;height:auto;border-radius:6px;margin:4px 0 14px">` : ''}
      ${body}
      ${faqHtml}
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
