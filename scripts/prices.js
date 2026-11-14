// Parse community priceNote strings into numbers. Shared by generate.js and price-index.js.
function parsePrice(note) {
  if (!note) return null;
  const s = String(note).replace(/–|—/g, '-');
  const vals = []; let perSf = null, rent = null;
  const re = /\$\s?([\d,]+(?:\.\d+)?)\s*(K|M|k|m)?(\s*(?:\/|per\s)\s*(?:mo|month|SF|sq ?ft|sf))?/g;
  let m;
  while ((m = re.exec(s))) {
    let v = parseFloat(m[1].replace(/,/g, ''));
    const u = (m[2] || '').toUpperCase();
    if (u === 'K') v *= 1e3; else if (u === 'M') v *= 1e6;
    const suf = (m[3] || '').toLowerCase();
    if (/mo/.test(suf)) { rent = rent || v; continue; }
    if (/sf|sq/.test(suf)) { perSf = perSf || v; continue; }
    // "$1.2-1.5M" style: bare second number after a dash with unit
    if (v < 20000) continue; // deposits, fees
    vals.push(v);
  }
  // ranges like "$300K-$340K" are caught above; "$250-400K" (first missing unit)
  const r2 = s.match(/\$([\d.]+)\s*-\s*\$?([\d.]+)\s*(K|M)/i);
  if (r2 && vals.length < 2) {
    const mult = r2[3].toUpperCase() === 'M' ? 1e6 : 1e3;
    const a = parseFloat(r2[1]) * (parseFloat(r2[1]) < 20 && mult === 1e3 ? 1 : 1), b = parseFloat(r2[2]) * mult;
    const av = a < 1000 ? a * mult : a;
    if (av >= 20000) vals.splice(0, vals.length, av, b);
  }
  const hs = s.match(/\$(\d{3})s\b/); if (hs && !vals.length) vals.push(parseInt(hs[1]) * 1000);
  if (!vals.length && !perSf) return rent ? { rent } : null;
  const low = vals.length ? Math.min(...vals) : null, high = vals.length ? Math.max(...vals) : null;
  const resale = /resale/i.test(s);
  return { low, high, perSf, rent, resale };
}
module.exports = { parsePrice };
