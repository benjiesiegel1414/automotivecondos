#!/usr/bin/env node
/* One-time: stamp approximate city lat/lng onto communities that lack them */
const fs = require('fs'); const path = require('path');
const F = path.join(__dirname, '..', 'data', 'communities.json');
const d = JSON.parse(fs.readFileSync(F, 'utf8'));
const C = {
"Tampa,FL":[27.95,-82.46],"Jupiter,FL":[26.93,-80.09],"Riviera Beach,FL":[26.78,-80.07],
"West Palm Beach,FL":[26.71,-80.05],"Doral,FL":[25.81,-80.36],"Bonita Springs,FL":[26.34,-81.78],
"Naples,FL":[26.14,-81.79],"Fort Pierce,FL":[27.45,-80.33],"Hobe Sound,FL":[27.06,-80.14],
"Jensen Beach,FL":[27.25,-80.23],"Fort Lauderdale,FL":[26.12,-80.14],"Fort Myers,FL":[26.64,-81.87],
"Cape Coral,FL":[26.56,-81.95],"Punta Gorda,FL":[26.93,-82.05],"Rotonda West,FL":[26.88,-82.26],
"Sarasota,FL":[27.34,-82.53],"St. Petersburg,FL":[27.77,-82.64],"Largo,FL":[27.91,-82.79],
"Sebring,FL":[27.50,-81.44],"Auburndale,FL":[28.07,-81.79],"Jacksonville,FL":[30.33,-81.66],
"Ponte Vedra,FL":[30.24,-81.39],"Daytona Beach,FL":[29.21,-81.02],"Vero Beach,FL":[27.64,-80.40],
"Santa Rosa Beach,FL":[30.37,-86.23],"Estero,FL":[26.44,-81.81],"Marco Island,FL":[25.94,-81.72],
"Leesburg,FL":[28.81,-81.88],
"Scottsdale,AZ":[33.49,-111.93],"Maricopa,AZ":[33.06,-112.05],
"Monterey,CA":[36.60,-121.89],"Thermal,CA":[33.64,-116.14],
"Dawsonville,GA":[34.42,-84.12],"Naperville,IL":[41.75,-88.15],"Joliet,IL":[41.53,-88.08],
"Pontiac,MI":[42.64,-83.29],"Chanhassen,MN":[44.86,-93.53],"Monticello,NY":[41.65,-74.69],
"Cresson,TX":[32.53,-97.61]
};
let missing = [];
for (const c of d.communities) {
  if (c.lat && c.lng) continue;
  const k = c.city + ',' + c.state;
  if (C[k]) { c.lat = C[k][0]; c.lng = C[k][1]; }
  else missing.push(k);
}
fs.writeFileSync(F, JSON.stringify(d, null, 1));
console.log('coords added; missing:', [...new Set(missing)].join('; ') || 'none');
