/**
 * AutomotiveCondos.com listing submissions backend (Google Apps Script, sieges92@gmail.com).
 * Deployed as a Web App: Execute as "Me", access "Anyone".
 * The site form (submit-listing.html) POSTs JSON here, then sends the seller to Stripe checkout.
 * Run setup() once: it creates the "AutomotiveCondos Listings" sheet and photo folder.
 */
const NOTIFY = 'heydividendbusiness@gmail.com';
const HEADERS = ['Submitted', 'Listing ID', 'Status', 'Plan', 'Community slug', 'Community name', 'City', 'State',
  'For', 'Price', 'Price unit', 'Sq ft', 'Door (W x H)', 'Ceiling height', 'Features', 'Title', 'Description',
  'Contact name', 'Contact email', 'Contact phone', 'Website', 'Show contact on listing', 'Photo folder',
  'Photo file IDs', 'Notes'];

function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('AutomotiveCondos Listings');
    const sh = ss.getSheets()[0];
    sh.setName('Submissions');
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0054A6').setFontColor('#FFFFFF');
    props.setProperty('SHEET_ID', ss.getId());
  }
  if (!props.getProperty('FOLDER_ID')) {
    props.setProperty('FOLDER_ID', DriveApp.createFolder('AutomotiveCondos Listing Photos').getId());
  }
  // touch MailApp so its permission is granted during setup
  MailApp.getRemainingDailyQuota();
  Logger.log('Sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID'));
  Logger.log('Photos: https://drive.google.com/drive/folders/' + props.getProperty('FOLDER_ID'));
}

function clean(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, max || 500);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website_hp) return json({ ok: true }); // honeypot: bots fill hidden field
    const id = clean(d.id, 20) || ('AC' + Date.now().toString(36).toUpperCase());
    const props = PropertiesService.getScriptProperties();
    const sh = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheetByName('Submissions');
    const root = DriveApp.getFolderById(props.getProperty('FOLDER_ID'));
    const folder = root.createFolder(id + ' ' + clean(d.title, 60));
    const ids = [];
    (d.photos || []).slice(0, 10).forEach(function (p, i) {
      const m = String(p).match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
      if (!m) return;
      const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], id + '-' + (i + 1) + '.jpg');
      ids.push(folder.createFile(blob).getId());
    });
    sh.appendRow([new Date(), id, 'Awaiting payment', clean(d.plan, 20), clean(d.community_slug, 120),
      clean(d.community_name, 160), clean(d.city, 80), clean(d.state, 4), clean(d.offer, 10), clean(d.price, 20),
      clean(d.price_unit, 10), clean(d.sqft, 10), clean(d.door, 30), clean(d.ceiling, 20), clean(d.features, 300),
      clean(d.title, 120), clean(d.description, 3000), clean(d.contact_name, 100), clean(d.contact_email, 120),
      clean(d.contact_phone, 40), clean(d.website, 200), d.show_contact ? 'Yes' : 'No', folder.getUrl(),
      ids.join(','), '']);
    MailApp.sendEmail({
      to: NOTIFY,
      subject: 'New AutomotiveCondos listing submitted: ' + clean(d.title, 80) + ' (' + id + ')',
      body: 'A seller just submitted a listing and was sent to Stripe checkout.\n\n' +
        'Listing ID: ' + id + '\nPlan: ' + clean(d.plan, 20) + '\nCommunity: ' +
        (clean(d.community_name, 160) || clean(d.community_slug, 120)) + ' (' + clean(d.city, 80) + ', ' + clean(d.state, 4) + ')\n' +
        'Price: ' + clean(d.price, 20) + ' ' + clean(d.price_unit, 10) + '\nContact: ' + clean(d.contact_name, 100) + ', ' +
        clean(d.contact_email, 120) + '\nPhotos: ' + ids.length + ' (' + folder.getUrl() + ')\n\n' +
        'It goes live once the Stripe payment shows up. Sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID')
    });
    return json({ ok: true, id: id, photos: ids.length });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'automotivecondos-listings' });
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
