#!/usr/bin/env python3
"""Publish (or update) a paid unit listing.

Usage:
  python3 scripts/publish-listing.py ROW.json PHOTO1.jpg [PHOTO2.jpg ...]

ROW.json is one row from the "AutomotiveCondos Listings" sheet (Submissions tab) as an
object keyed by the sheet headers (Listing ID, Community slug, Title, Price, ...).
Photos are the files from that row's Drive folder, in order (first = cover).
The script resizes photos into assets/listings/, upserts data/listings.json, and
prints the listing URL. Then run: node scripts/generate.js
"""
import json, os, sys, re, datetime
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
row = json.load(open(sys.argv[1]))
photos_in = sys.argv[2:]
lid = re.sub(r'[^A-Za-z0-9]', '', row['Listing ID'])
os.makedirs(os.path.join(ROOT, 'assets', 'listings'), exist_ok=True)
photos = []
for i, src in enumerate(photos_in[:10], 1):
    im = Image.open(src)
    im = im.convert('RGB')
    im.thumbnail((1600, 1600))
    rel = f'assets/listings/{lid.lower()}-{i}.jpg'
    im.save(os.path.join(ROOT, rel), 'JPEG', quality=80, optimize=True, progressive=True)
    photos.append(rel)

path = os.path.join(ROOT, 'data', 'listings.json')
data = json.load(open(path)) if os.path.exists(path) else {'listings': []}
g = lambda k: str(row.get(k, '') or '').strip()
entry = {
    'id': lid, 'status': 'active', 'plan': g('Plan'),
    'community_slug': g('Community slug'), 'community_name': g('Community name'),
    'city': g('City'), 'state': g('State').upper(), 'offer': 'rent' if g('For') == 'rent' else 'sale',
    'price': re.sub(r'[^0-9.]', '', g('Price')), 'sqft': re.sub(r'[^0-9]', '', g('Sq ft')),
    'door': g('Door (W x H)'), 'ceiling': g('Ceiling height'), 'features': g('Features'),
    'title': g('Title'), 'description': g('Description'),
    'contact_name': g('Contact name'), 'contact_email': g('Contact email'),
    'contact_phone': g('Contact phone'), 'website': g('Website'),
    'photos': photos, 'published': datetime.date.today().isoformat(),
}
old = next((l for l in data['listings'] if l['id'] == lid), None)
if old:
    entry['published'] = old.get('published', entry['published'])
    if not photos:
        entry['photos'] = old.get('photos', [])
    data['listings'][data['listings'].index(old)] = entry
else:
    data['listings'].append(entry)
json.dump(data, open(path, 'w'), indent=1, ensure_ascii=False)
slug = re.sub(r'[^a-z0-9]+', '-', entry['title'].lower()).strip('-')[:60].rstrip('-') + '-' + lid.lower()
print(f'https://automotivecondos.com/listings/{slug}.html')
