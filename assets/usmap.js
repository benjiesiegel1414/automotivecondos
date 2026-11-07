/* AutomotiveCondos custom US map: SVG states, hover tooltip, click -> state offer list */
(function () {
  var STATE_NAMES = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',DC:'Washington, D.C.',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
  function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function shade(n){
    if (!n) return '#E8ECF1';
    if (n <= 2) return '#BBD3EA';
    if (n <= 5) return '#7FACD9';
    if (n <= 10) return '#3B8EE2';
    if (n <= 30) return '#0054A6';
    return '#00386E';
  }
  function textColor(n){ return n > 5 ? '#FFFFFF' : '#1F2733'; }

  window.ACMap = {
    init: function (opts) {
      var mapEl = document.getElementById(opts.map);
      var panelEl = document.getElementById(opts.panel);
      var base = opts.base || '';
      Promise.all([
        fetch(base + 'assets/us-states-paths.svg.frag').then(function(r){return r.text();}),
        fetch(base + 'data/communities.json').then(function(r){return r.json();})
      ]).then(function (res) {
        var frag = res[0], data = res[1].communities;
        var byState = {};
        data.forEach(function(c){ (byState[c.state] = byState[c.state] || []).push(c); });

        mapEl.innerHTML =
          '<div class="acmap-wrap">' +
          '<svg class="acmap" viewBox="0 0 975 610" role="img" aria-label="US map of car condo communities by state">' + frag + '</svg>' +
          '<div class="acmap-tip" style="display:none"></div></div>' +
          '<div class="acmap-legend">' +
          '<span><i style="background:#E8ECF1"></i>0</span>' +
          '<span><i style="background:#BBD3EA"></i>1–2</span>' +
          '<span><i style="background:#7FACD9"></i>3–5</span>' +
          '<span><i style="background:#3B8EE2"></i>6–10</span>' +
          '<span><i style="background:#0054A6"></i>11–30</span>' +
          '<span><i style="background:#00386E"></i>31+ communities</span></div>';

        var tip = mapEl.querySelector('.acmap-tip');
        var svg = mapEl.querySelector('svg.acmap');
        var selected = null;

        svg.querySelectorAll('path[data-state]').forEach(function (p) {
          var st = p.getAttribute('data-state');
          var n = (byState[st] || []).length;
          p.style.fill = shade(n);
          p.style.stroke = '#FFFFFF';
          p.style.strokeWidth = '1';
          p.style.cursor = n ? 'pointer' : 'default';
          p.addEventListener('mousemove', function (e) {
            tip.style.display = 'block';
            tip.innerHTML = '<strong>' + STATE_NAMES[st] + '</strong> — ' + (n ? n + ' communit' + (n === 1 ? 'y' : 'ies') : 'none tracked yet');
            var r = mapEl.getBoundingClientRect();
            tip.style.left = (e.clientX - r.left + 14) + 'px';
            tip.style.top = (e.clientY - r.top - 12) + 'px';
          });
          p.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
          p.addEventListener('mouseenter', function () { if (p !== selected) { p.style.strokeWidth = '2'; p.style.stroke = '#212121'; } });
          p.addEventListener('mouseout', function () { if (p !== selected) { p.style.strokeWidth = '1'; p.style.stroke = '#FFFFFF'; } });
          p.addEventListener('click', function () {
            if (!n) return;
            if (selected) { selected.style.stroke = '#FFFFFF'; selected.style.strokeWidth = '1'; }
            selected = p; p.style.stroke = '#212121'; p.style.strokeWidth = '2.5';
            window.ACMap._renderPanel(panelEl, st, byState[st], opts);
            panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        });

        // preselect biggest state so panel isn't empty
        var biggest = Object.keys(byState).sort(function(a,b){ return byState[b].length - byState[a].length; })[0];
        if (biggest) window.ACMap._renderPanel(panelEl, biggest, byState[biggest], opts);
        window.ACMap._opts = opts; window.ACMap._byState = byState; window.ACMap._panelEl = panelEl;
        window.ACMap._current = biggest;
      });
    },
    refresh: function () {
      var st = window.ACMap._current;
      if (st) window.ACMap._renderPanel(window.ACMap._panelEl, st, window.ACMap._byState[st], window.ACMap._opts);
    },
    _renderPanel: function (panelEl, st, list, opts) {
      window.ACMap._current = st;
      var base = opts.base || '';
      var status = opts.statusSel ? document.getElementById(opts.statusSel).value : '';
      var offer = opts.offerSel ? document.getElementById(opts.offerSel).value : '';
      var shown = list.filter(function (c) {
        if (status && c.status !== status) return false;
        var o = c.offer || 'buy';
        if (offer === 'buy' && !(o === 'buy' || o === 'both')) return false;
        if (offer === 'rent' && o !== 'both') return false;
        return true;
      });
      var name = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'}[st] || st;
      var max = opts.limit || 0;
      var items = max ? shown.slice(0, max) : shown;
      var cards = items.map(function (c) {
        var badge = (c.offer === 'both') ? '<span class="tag" style="background:#0E7A4E">Buy or Rent</span> ' : '';
        return '<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h3 style="font-size:15px;margin:0">' + esc(c.name) + '</h3>' + badge + '</div>' +
          '<div class="meta">' + esc(c.city) + ', ' + st + ' · ' + esc(c.status) + (c.units ? ' · ' + c.units + ' units' : '') + '</div>' +
          ((c.priceNote && c.priceNote !== 'Inquire') ? '<div class="price">' + esc(c.priceNote) + '</div>' : '') +
          '<a style="font-size:13px;font-weight:600" href="mailto:contact@automotivecondos.com?subject=Inquiry: ' + encodeURIComponent(c.name) + ' (' + st + ')">Inquire →</a></div>';
      }).join('');
      panelEl.innerHTML =
        '<div class="sec-head" style="margin-top:22px"><h2 style="font-size:22px">' + name + ' <span class="blue">· ' + shown.length + ' communit' + (shown.length === 1 ? 'y' : 'ies') + '</span></h2>' +
        '<div class="sub"><a href="' + base + 'states/' + slug(name) + '.html">Full ' + name + ' directory →</a></div></div>' +
        (shown.length ? '<div class="grid c3">' + cards + '</div>' : '<p style="color:var(--muted)">No communities match these filters in ' + name + ' yet.</p>') +
        (max && shown.length > max ? '<p style="margin-top:12px"><a href="' + base + 'states/' + slug(name) + '.html">See all ' + shown.length + ' in the ' + name + ' directory →</a></p>' : '');
    }
  };
})();
