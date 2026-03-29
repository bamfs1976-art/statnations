import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';

/* ============================================================
   OLYMPICS STATNATIONS — Complete Analytics Dashboard
   ============================================================ */

// ── Focus Nations & Colors ──
var OL_FOCUS_NATIONS = ["USA","Great Britain","China","Russia","Germany","France","Australia","Japan","Italy","South Korea","Netherlands","Sweden","Brazil"];

var OL_COLORS = {
  USA:"#3C3B6E","United States":"#3C3B6E",
  "Great Britain":"#012169",GBR:"#012169",
  China:"#EE1C25",CHN:"#EE1C25",
  Russia:"#D52B1E",RUS:"#D52B1E",
  Germany:"#000000",GER:"#000000",
  France:"#0055A4",FRA:"#0055A4",
  Australia:"#00843D",AUS:"#00843D",
  Japan:"#BC002D",JPN:"#BC002D",
  Italy:"#009246",ITA:"#009246",
  "South Korea":"#003478",KOR:"#003478",
  Netherlands:"#FF6600",NED:"#FF6600",
  Sweden:"#006AA7",SWE:"#006AA7",
  Brazil:"#009C3B",BRA:"#009C3B",
  Canada:"#FF0000",CAN:"#FF0000",
  Norway:"#EF2B2D",NOR:"#EF2B2D",
  Hungary:"#477050",HUN:"#477050",
  Kenya:"#006600",KEN:"#006600",
  Cuba:"#002590",CUB:"#002590",
  Romania:"#002B7F",ROU:"#002B7F",
  Jamaica:"#009B3A",JAM:"#009B3A",
  Spain:"#AA151B",ESP:"#AA151B",
  "New Zealand":"#000000",NZL:"#000000",
  Poland:"#DC143C",POL:"#DC143C",
  Switzerland:"#FF0000",SUI:"#FF0000",
  Finland:"#003580",FIN:"#003580",
  Denmark:"#C60C30",DEN:"#C60C30",
  Austria:"#ED2939",AUT:"#ED2939",
  Ethiopia:"#009A44",ETH:"#009A44",
  Ukraine:"#005BBB",UKR:"#005BBB",
  "Czech Republic":"#11457E",CZE:"#11457E",
  Greece:"#0D5EAF",GRE:"#0D5EAF",
  Turkey:"#E30A17",TUR:"#E30A17",
  Argentina:"#75AADB",ARG:"#75AADB",
  Mexico:"#006847",MEX:"#006847",
  India:"#138808",IND:"#138808",
  "South Africa":"#007A4D",RSA:"#007A4D"
};

var OL_CODE_TO_COUNTRY = {
  USA:"United States",GBR:"Great Britain",CHN:"China",RUS:"Russia",GER:"Germany",
  FRA:"France",AUS:"Australia",JPN:"Japan",ITA:"Italy",KOR:"South Korea",
  NED:"Netherlands",SWE:"Sweden",BRA:"Brazil",CAN:"Canada",NOR:"Norway",
  HUN:"Hungary",KEN:"Kenya",CUB:"Cuba",ROU:"Romania",JAM:"Jamaica",
  ESP:"Spain",NZL:"New Zealand",POL:"Poland",SUI:"Switzerland",FIN:"Finland",
  DEN:"Denmark",AUT:"Austria",ETH:"Ethiopia",UKR:"Ukraine",CZE:"Czech Republic",
  GRE:"Greece",TUR:"Turkey",ARG:"Argentina",MEX:"Mexico",IND:"India",RSA:"South Africa",
  URS:"Soviet Union",GDR:"East Germany",FRG:"West Germany",YUG:"Yugoslavia",
  TCH:"Czechoslovakia",SCG:"Serbia and Montenegro",SRB:"Serbia",CRO:"Croatia",
  SLO:"Slovenia",BLR:"Belarus",KAZ:"Kazakhstan",UZB:"Uzbekistan",
  EGY:"Egypt",NGR:"Nigeria",MAR:"Morocco",TUN:"Tunisia",ALG:"Algeria",CMR:"Cameroon",
  COL:"Colombia",PER:"Peru",CHI:"Chile",VEN:"Venezuela",URU:"Uruguay",
  TPE:"Chinese Taipei",THA:"Thailand",PHI:"Philippines",INA:"Indonesia",MAS:"Malaysia",
  PAK:"Pakistan",IRI:"Iran",IRQ:"Iraq",ISR:"Israel",POR:"Portugal",BEL:"Belgium",
  IRL:"Ireland",BUL:"Bulgaria",LAT:"Latvia",LTU:"Lithuania",EST:"Estonia",
  CRC:"Costa Rica",PAN:"Panama",DOM:"Dominican Republic",PUR:"Puerto Rico",BAH:"Bahamas",
  TTO:"Trinidad and Tobago",BER:"Bermuda",BAR:"Barbados",GUY:"Guyana"
};

// ── Summer Olympics Host Cities ──
var SUMMER_OLYMPICS = [
  {year:1896,city:"Athens",country:"Greece"},{year:1900,city:"Paris",country:"France"},
  {year:1904,city:"St. Louis",country:"USA"},{year:1908,city:"London",country:"Great Britain"},
  {year:1912,city:"Stockholm",country:"Sweden"},{year:1920,city:"Antwerp",country:"Belgium"},
  {year:1924,city:"Paris",country:"France"},{year:1928,city:"Amsterdam",country:"Netherlands"},
  {year:1932,city:"Los Angeles",country:"USA"},{year:1936,city:"Berlin",country:"Germany"},
  {year:1948,city:"London",country:"Great Britain"},{year:1952,city:"Helsinki",country:"Finland"},
  {year:1956,city:"Melbourne",country:"Australia"},{year:1960,city:"Rome",country:"Italy"},
  {year:1964,city:"Tokyo",country:"Japan"},{year:1968,city:"Mexico City",country:"Mexico"},
  {year:1972,city:"Munich",country:"Germany"},{year:1976,city:"Montreal",country:"Canada"},
  {year:1980,city:"Moscow",country:"Russia"},{year:1984,city:"Los Angeles",country:"USA"},
  {year:1988,city:"Seoul",country:"South Korea"},{year:1992,city:"Barcelona",country:"Spain"},
  {year:1996,city:"Atlanta",country:"USA"},{year:2000,city:"Sydney",country:"Australia"},
  {year:2004,city:"Athens",country:"Greece"},{year:2008,city:"Beijing",country:"China"},
  {year:2012,city:"London",country:"Great Britain"},{year:2016,city:"Rio de Janeiro",country:"Brazil"},
  {year:2020,city:"Tokyo",country:"Japan"},{year:2024,city:"Paris",country:"France"}
];

var WINTER_OLYMPICS = [
  {year:1924,city:"Chamonix",country:"France"},{year:1928,city:"St. Moritz",country:"Switzerland"},
  {year:1932,city:"Lake Placid",country:"USA"},{year:1936,city:"Garmisch-Partenkirchen",country:"Germany"},
  {year:1948,city:"St. Moritz",country:"Switzerland"},{year:1952,city:"Oslo",country:"Norway"},
  {year:1956,city:"Cortina d'Ampezzo",country:"Italy"},{year:1960,city:"Squaw Valley",country:"USA"},
  {year:1964,city:"Innsbruck",country:"Austria"},{year:1968,city:"Grenoble",country:"France"},
  {year:1972,city:"Sapporo",country:"Japan"},{year:1976,city:"Innsbruck",country:"Austria"},
  {year:1980,city:"Lake Placid",country:"USA"},{year:1984,city:"Sarajevo",country:"Yugoslavia"},
  {year:1988,city:"Calgary",country:"Canada"},{year:1992,city:"Albertville",country:"France"},
  {year:1994,city:"Lillehammer",country:"Norway"},{year:1998,city:"Nagano",country:"Japan"},
  {year:2002,city:"Salt Lake City",country:"USA"},{year:2006,city:"Turin",country:"Italy"},
  {year:2010,city:"Vancouver",country:"Canada"},{year:2014,city:"Sochi",country:"Russia"},
  {year:2018,city:"Pyeongchang",country:"South Korea"},{year:2022,city:"Beijing",country:"China"},
  {year:2026,city:"Milano Cortina",country:"Italy"}
];

// ── Legendary Olympians data ──
var LEGENDARY_OLYMPIANS = [
  {name:"Michael Phelps",country:"USA",sport:"Swimming",gold:23,silver:3,bronze:2,years:"2000-2016"},
  {name:"Larisa Latynina",country:"Russia",sport:"Gymnastics",gold:9,silver:5,bronze:4,years:"1956-1964"},
  {name:"Paavo Nurmi",country:"Finland",sport:"Athletics",gold:9,silver:3,bronze:0,years:"1920-1928"},
  {name:"Mark Spitz",country:"USA",sport:"Swimming",gold:9,silver:1,bronze:1,years:"1968-1972"},
  {name:"Carl Lewis",country:"USA",sport:"Athletics",gold:9,silver:1,bronze:0,years:"1984-1996"},
  {name:"Usain Bolt",country:"Jamaica",sport:"Athletics",gold:8,silver:0,bronze:0,years:"2008-2016"},
  {name:"Birgit Fischer",country:"Germany",sport:"Canoeing",gold:8,silver:4,bronze:0,years:"1980-2004"},
  {name:"Jenny Thompson",country:"USA",sport:"Swimming",gold:8,silver:3,bronze:1,years:"1992-2004"},
  {name:"Ole Einar Bjorndalen",country:"Norway",sport:"Biathlon",gold:8,silver:4,bronze:1,years:"1998-2014"},
  {name:"Bjorn Daehlie",country:"Norway",sport:"Cross-Country Skiing",gold:8,silver:4,bronze:0,years:"1992-1998"},
  {name:"Ray Ewry",country:"USA",sport:"Athletics",gold:8,silver:0,bronze:0,years:"1900-1908"},
  {name:"Marit Bjorgen",country:"Norway",sport:"Cross-Country Skiing",gold:8,silver:4,bronze:3,years:"2002-2018"},
  {name:"Nadia Comaneci",country:"Romania",sport:"Gymnastics",gold:5,silver:3,bronze:1,years:"1976-1980"},
  {name:"Simone Biles",country:"USA",sport:"Gymnastics",gold:7,silver:1,bronze:2,years:"2016-2024"}
];

// ── CSS ──
var olCSS = `\n.ol-card{background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:24px;margin-bottom:16px;backdrop-filter:blur(12px);transition:border-color 0.2s ease-out,box-shadow 0.2s ease-out}
.ol-card:hover{border-color:rgba(0,133,199,0.2);box-shadow:0 8px 24px rgba(0,0,0,0.2)}\n.ol-card h3{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;display:flex;align-items:center;gap:8px}\n.ol-card h3 .icon{font-size:16px}\n.ol-sb{background:rgba(0,133,199,0.06);border:1px solid rgba(0,133,199,0.15);border-radius:12px;padding:16px;text-align:center}\n.ol-sb .val{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.1}\n.ol-sb .lbl{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}\n.ol-mt{width:100%;border-collapse:collapse;font-size:13px}\n.ol-mt th{padding:8px 6px;text-align:left;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;font-family:'Barlow Condensed',sans-serif}\n.ol-mt td{padding:8px 6px;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,0.03);font-family:'DM Sans',sans-serif}\n.ol-mt tr{transition:background 0.15s ease-out}
.ol-mt tr:hover td{background:rgba(0,133,199,0.05)}\n.ol-tab-nav{display:flex;gap:0;flex-wrap:wrap;margin-bottom:4px;background:rgba(15,23,42,0.4);border-radius:12px;padding:4px;border:1px solid rgba(255,255,255,0.04)}\n.ol-tab-btn{padding:8px 16px;font-size:12px;font-weight:600;color:rgba(248,250,252,0.55);background:transparent;border:none;cursor:pointer;border-radius:8px;transition:all 0.15s;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap}\n.ol-tab-btn:hover{color:rgba(248,250,252,0.7);background:rgba(0,133,199,0.06)}\n.ol-tab-btn.active{color:#f8fafc;background:rgba(0,133,199,0.15);box-shadow:0 1px 4px rgba(0,0,0,0.2)}\n.ol-search{width:100%;padding:10px 14px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#f8fafc;font-size:13px;font-family:'DM Sans',sans-serif;outline:none}\n.ol-search:focus{border-color:rgba(0,133,199,0.4)}\n.ol-select{padding:8px 12px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#f8fafc;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}\n.ol-btn{padding:8px 16px;background:rgba(0,133,199,0.15);border:1px solid rgba(0,133,199,0.3);border-radius:8px;color:#7ec8e3;font-size:12px;font-weight:600;cursor:pointer;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0.06em;transition:all 0.15s}\n.ol-btn:hover{background:rgba(0,133,199,0.25)}\n.ol-btn.active{background:rgba(0,133,199,0.3);color:#f8fafc}\n.ol-chip{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace}\n.ol-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}\n.ol-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}\n.ol-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}\n.ol-link{color:#7ec8e3;cursor:pointer;text-decoration:none;font-weight:600}\n.ol-link:hover{text-decoration:underline}\n.ol-page-btn{padding:6px 14px;background:rgba(0,133,199,0.1);border:1px solid rgba(0,133,199,0.2);border-radius:6px;color:#7ec8e3;font-size:11px;cursor:pointer;font-family:'Barlow Condensed',sans-serif}\n.ol-page-btn:hover{background:rgba(0,133,199,0.2)}\n.ol-page-btn:disabled{opacity:0.3;cursor:default}\n.ol-medal-gold{color:#F4C300;font-weight:800}\n.ol-medal-silver{color:#C0C0C0;font-weight:800}\n.ol-medal-bronze{color:#CD7F32;font-weight:800}\n@keyframes ol-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}\n.ol-shimmer{height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(0,133,199,0.1) 25%,rgba(0,133,199,0.3) 50%,rgba(0,133,199,0.1) 75%);background-size:200% 100%;animation:ol-shimmer 1.5s ease-in-out infinite;margin-top:16px;max-width:280px;margin-left:auto;margin-right:auto}\n@media(max-width:768px){\n  .ol-grid{grid-template-columns:repeat(2,1fr)}\n  .ol-grid-2{grid-template-columns:1fr}\n  .ol-grid-3{grid-template-columns:1fr}\n  .ol-tab-btn{padding:6px 10px;font-size:11px}\n  .ol-tab-nav{overflow-x:auto;-webkit-overflow-scrolling:touch}\n}\n@media(prefers-reduced-motion:reduce){\n  .ol-shimmer{animation:none!important}\n  .ol-tab-btn,.ol-btn,.ol-card{transition:none!important}\n}\n:focus-visible{outline:2px solid #F4C300;outline-offset:2px;border-radius:4px}\n`;

// ── Tooltip style ──
var olTTStyle = {background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"};

// ── Olympic Rings SVG ──
function OlympicRingsSVG(props) {
  var size = props.size || 80;
  var w = size;
  var h = size * 0.48;
  return React.createElement("svg", {width:w, height:h, viewBox:"0 0 500 240", style:{display:"inline-block"}},
    React.createElement("circle", {cx:100,cy:100,r:72,fill:"none",stroke:"#0085C7",strokeWidth:12}),
    React.createElement("circle", {cx:200,cy:100,r:72,fill:"none",stroke:"#000000",strokeWidth:12}),
    React.createElement("circle", {cx:300,cy:100,r:72,fill:"none",stroke:"#EE334E",strokeWidth:12}),
    React.createElement("circle", {cx:150,cy:160,r:72,fill:"none",stroke:"#F4C300",strokeWidth:12}),
    React.createElement("circle", {cx:250,cy:160,r:72,fill:"none",stroke:"#009F3D",strokeWidth:12})
  );
}

// ── Flag Component ──
function OLFlag(props) {
  var code = props.code || "";
  var size = props.size || 20;
  var h = size * 0.667;
  var countryColors = {
    USA:"#3C3B6E",GBR:"#012169",CHN:"#EE1C25",RUS:"#D52B1E",GER:"#000000",
    FRA:"#0055A4",AUS:"#00843D",JPN:"#BC002D",ITA:"#009246",KOR:"#003478",
    NED:"#FF6600",SWE:"#006AA7",BRA:"#009C3B",CAN:"#FF0000",NOR:"#EF2B2D",
    HUN:"#477050",KEN:"#006600",CUB:"#002590",ROU:"#002B7F",JAM:"#009B3A",
    ESP:"#AA151B",NZL:"#000000",POL:"#DC143C",SUI:"#FF0000",FIN:"#003580",
    DEN:"#C60C30",AUT:"#ED2939",ETH:"#009A44",UKR:"#005BBB",GRE:"#0D5EAF"
  };
  var c = countryColors[code] || "#94a3b8";
  var label = code ? code.substring(0,3).toUpperCase() : "???";
  return React.createElement("svg", {width:size, height:h, style:{borderRadius:3,flexShrink:0}},
    React.createElement("rect", {width:size, height:h, fill:c, rx:2}),
    React.createElement("text", {x:size/2, y:h/2+1, textAnchor:"middle", dominantBaseline:"middle", fill:"#fff", fontSize:size*0.28, fontWeight:"700", fontFamily:"'Barlow Condensed',sans-serif"}, label)
  );
}

function OLFlagBadge(props) {
  var code = props.code || "";
  var size = props.size || 28;
  return React.createElement("div", {style:{display:"inline-flex",padding:3,background:"rgba(255,255,255,0.06)",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)"}},
    React.createElement(OLFlag, {code:code, size:size})
  );
}

function OLCountryLabel(props) {
  var code = props.code || "";
  var name = props.name || code;
  var size = props.size || 16;
  var isFocus = OL_FOCUS_NATIONS.indexOf(name) >= 0;
  var handleClick = function() {
    if (isFocus) _olNavToTab("team", name);
  };
  return React.createElement("span", {
    onClick: handleClick,
    style: {display:"inline-flex",alignItems:"center",gap:6,cursor:isFocus?"pointer":"default",color:"#e2e8f0",fontWeight:600,fontSize:size*0.8,fontFamily:"'DM Sans',sans-serif",borderRadius:4,padding:"1px 3px",transition:"background 0.15s"},
    onMouseOver: isFocus ? function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; } : undefined,
    onMouseOut: isFocus ? function(e) { e.currentTarget.style.background = "transparent"; } : undefined
  },
    React.createElement(OLFlagBadge, {code:code, size:size}),
    React.createElement("span", null, name)
  );
}

function _olNavToTab(tab, param) {
  if (param) window.location.hash = "#/olympics/" + tab + "/" + encodeURIComponent(param);
  else window.location.hash = "#/olympics/" + tab;
}

// ── UI Primitives ──
function OLCard(props) {
  var title = props.title;
  var icon = props.icon;
  var children = props.children;
  var style = props.style || {};
  return React.createElement("div", {className:"ol-card", style:style},
    title && React.createElement("h3", null, React.createElement("span", {className:"icon"}, icon), title),
    children
  );
}

function OLSB(props) {
  var value = props.value;
  var label = props.label;
  var color = props.color;
  return React.createElement("div", {className:"ol-sb", style:color?{borderColor:color+"33",background:color+"0a"}:{}},
    React.createElement("div", {className:"val", style:color?{color}:{}}, value),
    React.createElement("div", {className:"lbl"}, label)
  );
}

function OLMT(props) {
  var headers = props.headers;
  var rows = props.rows;
  var alignRight = props.alignRight || [];
  return React.createElement("table", {className:"ol-mt"},
    React.createElement("thead", null,
      React.createElement("tr", null, headers.map(function(h,i) {
        return React.createElement("th", {key:i, style:alignRight.indexOf(i)>=0?{textAlign:"right"}:{}}, h);
      }))
    ),
    React.createElement("tbody", null, rows.map(function(r,ri) {
      return React.createElement("tr", {key:ri}, r.map(function(c,ci) {
        return React.createElement("td", {key:ci, style:alignRight.indexOf(ci)>=0?{textAlign:"right"}:{}}, c);
      }));
    }))
  );
}

// ── Medal chip helper ──
function MedalBadge(props) {
  var medal = props.medal;
  var colors = {Gold:"#F4C300",Silver:"#C0C0C0",Bronze:"#CD7F32"};
  var c = colors[medal] || "#94a3b8";
  return React.createElement("span", {className:"ol-chip", style:{background:c+"22",color:c,border:"1px solid "+c+"44"}}, medal);
}

// ── Helpers ──
function olGetColor(name) { return OL_COLORS[name] || "#94a3b8"; }

function resolveCountryName(code, countriesMap) {
  if (countriesMap && countriesMap[code]) return countriesMap[code];
  if (OL_CODE_TO_COUNTRY[code]) return OL_CODE_TO_COUNTRY[code];
  return code;
}

function getCountryCode(name, reverseMap) {
  if (reverseMap && reverseMap[name]) return reverseMap[name];
  var entries = Object.entries(OL_CODE_TO_COUNTRY);
  for (var i = 0; i < entries.length; i++) {
    if (entries[i][1] === name) return entries[i][0];
  }
  return name ? name.substring(0,3).toUpperCase() : "???";
}

// ── Tab: OLOverview ──
function OLOverview(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;
  var athletes = props.athletes;

  var stats = useMemo(function() {
    var allMedals = summerMedals.concat(winterMedals);
    var totalMedals = allMedals.length;
    var goldCount = allMedals.filter(function(m) { return m.medal === "Gold"; }).length;
    var silverCount = allMedals.filter(function(m) { return m.medal === "Silver"; }).length;
    var bronzeCount = allMedals.filter(function(m) { return m.medal === "Bronze"; }).length;

    var nations = {};
    allMedals.forEach(function(m) { nations[m.country || m.code] = true; });
    var nationCount = Object.keys(nations).length;

    var sports = {};
    allMedals.forEach(function(m) { if (m.sport) sports[m.sport] = true; });
    var sportCount = Object.keys(sports).length;

    var athleteNames = {};
    allMedals.forEach(function(m) { if (m.athlete) athleteNames[m.athlete] = true; });
    var athleteCount = Object.keys(athleteNames).length;

    // Medals by decade
    var decades = {};
    allMedals.forEach(function(m) {
      var dec = Math.floor(m.year / 10) * 10 + "s";
      if (!decades[dec]) decades[dec] = {decade:dec, gold:0, silver:0, bronze:0, total:0};
      decades[dec].total++;
      if (m.medal === "Gold") decades[dec].gold++;
      else if (m.medal === "Silver") decades[dec].silver++;
      else decades[dec].bronze++;
    });
    var decadeData = Object.values(decades).sort(function(a,b) { return a.decade.localeCompare(b.decade); });

    // Top 10 all-time medal table
    var countryMedals = {};
    allMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || getCountryCode(cn);
      if (!countryMedals[cn]) countryMedals[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countryMedals[cn].total++;
      if (m.medal === "Gold") countryMedals[cn].gold++;
      else if (m.medal === "Silver") countryMedals[cn].silver++;
      else countryMedals[cn].bronze++;
    });
    var top10 = Object.values(countryMedals).sort(function(a,b) {
      return b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze;
    }).slice(0, 10);

    // Summer vs Winter split
    var seasonSplit = [
      {name:"Summer", value:summerMedals.length, fill:"#0085C7"},
      {name:"Winter", value:winterMedals.length, fill:"#7ec8e3"}
    ];

    return {totalMedals:totalMedals, goldCount:goldCount, silverCount:silverCount, bronzeCount:bronzeCount,
            nationCount:nationCount, sportCount:sportCount, athleteCount:athleteCount,
            decadeData:decadeData, top10:top10, seasonSplit:seasonSplit};
  }, [summerMedals, winterMedals, countriesMap]);

  return React.createElement("div", null,
    // Hero banner
    React.createElement("div", {style:{textAlign:"center",padding:"20px 0",marginBottom:16}},
      React.createElement(OlympicRingsSVG, {size:120}),
      React.createElement("div", {style:{color:"#94a3b8",fontSize:12,marginTop:8}},
        SUMMER_OLYMPICS.length + " Summer Games \u00b7 " + WINTER_OLYMPICS.length + " Winter Games \u00b7 Since 1896"
      )
    ),

    // Stat boxes
    React.createElement("div", {className:"ol-grid", style:{marginBottom:16}},
      React.createElement(OLSB, {value:stats.totalMedals.toLocaleString(), label:"Total Medals"}),
      React.createElement(OLSB, {value:stats.goldCount.toLocaleString(), label:"Gold Medals", color:"#F4C300"}),
      React.createElement(OLSB, {value:stats.silverCount.toLocaleString(), label:"Silver Medals", color:"#C0C0C0"}),
      React.createElement(OLSB, {value:stats.bronzeCount.toLocaleString(), label:"Bronze Medals", color:"#CD7F32"}),
      React.createElement(OLSB, {value:stats.nationCount, label:"Nations"}),
      React.createElement(OLSB, {value:stats.sportCount, label:"Sports"})
    ),

    // Charts row
    React.createElement("div", {className:"ol-grid-2"},
      React.createElement(OLCard, {title:"Medals by Decade", icon:"\uD83C\uDFC5"},
        React.createElement(ResponsiveContainer, {width:"100%", height:280},
          React.createElement(BarChart, {data:stats.decadeData},
            React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
            React.createElement(XAxis, {dataKey:"decade", tick:{fill:"#94a3b8",fontSize:10}}),
            React.createElement(YAxis, {tick:{fill:"#94a3b8",fontSize:11}}),
            React.createElement(Tooltip, {contentStyle:olTTStyle}),
            React.createElement(Legend, null),
            React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300", radius:[0,0,0,0]}),
            React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
            React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32", radius:[4,4,0,0]})
          )
        )
      ),
      React.createElement(OLCard, {title:"Summer vs Winter", icon:"\u2744\uFE0F"},
        React.createElement(ResponsiveContainer, {width:"100%", height:280},
          React.createElement(PieChart, null,
            React.createElement(Pie, {data:stats.seasonSplit, cx:"50%", cy:"50%", outerRadius:90, innerRadius:45, dataKey:"value", label:function(entry) { return entry.name + ": " + entry.value.toLocaleString(); }},
              stats.seasonSplit.map(function(e,i) { return React.createElement(Cell, {key:i, fill:e.fill}); })
            ),
            React.createElement(Tooltip, {contentStyle:olTTStyle})
          )
        )
      )
    ),

    // Top 10 Medal Table
    React.createElement(OLCard, {title:"Top 10 All-Time Medal Table", icon:"\uD83C\uDFC6"},
      React.createElement(OLMT, {
        headers:["#","Nation","Gold","Silver","Bronze","Total"],
        alignRight:[2,3,4,5],
        rows:stats.top10.map(function(t,i) {
          return [
            i + 1,
            React.createElement(OLCountryLabel, {code:t.code, name:t.name, size:14}),
            React.createElement("span", {className:"ol-medal-gold"}, t.gold),
            React.createElement("span", {className:"ol-medal-silver"}, t.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, t.bronze),
            React.createElement("span", {style:{fontWeight:700,color:"#f8fafc",fontFamily:"'JetBrains Mono',monospace"}}, t.total)
          ];
        })
      })
    ),

    // Quick links
    React.createElement(OLCard, {title:"Quick Links", icon:"\uD83D\uDD17"},
      React.createElement("div", {style:{display:"flex",flexDirection:"column",gap:8}},
        [["summer","Summer Olympics"],["winter","Winter Olympics"],["athletics","Athletics & Records"],["medals","Full Medal Table"],["h2h","Head to Head"],["records","Record Breakers"]].map(function(item) {
          return React.createElement("span", {key:item[0], className:"ol-link", onClick:function() { _olNavToTab(item[0]); }}, item[1]);
        })
      )
    )
  );
}

// ── Tab: OLSummer ──
function OLSummer(props) {
  var summerMedals = props.summerMedals;
  var countriesMap = props.countriesMap;
  var selYear = props.selYear;
  var setSelYear = props.setSelYear;

  var _yearState = useState(selYear || null);
  var year = _yearState[0];
  var setYear = _yearState[1];

  var _sportFilter = useState("All");
  var sportFilter = _sportFilter[0];
  var setSportFilter = _sportFilter[1];

  var years = useMemo(function() {
    var ySet = {};
    summerMedals.forEach(function(m) { ySet[m.year] = true; });
    return Object.keys(ySet).map(Number).sort(function(a,b) { return b - a; });
  }, [summerMedals]);

  var sports = useMemo(function() {
    var sSet = {};
    summerMedals.forEach(function(m) { if (m.sport) sSet[m.sport] = true; });
    return Object.keys(sSet).sort();
  }, [summerMedals]);

  var yearMedals = useMemo(function() {
    if (!year) return [];
    var filtered = summerMedals.filter(function(m) { return m.year === year; });
    if (sportFilter !== "All") filtered = filtered.filter(function(m) { return m.sport === sportFilter; });
    return filtered;
  }, [year, summerMedals, sportFilter]);

  var yearTable = useMemo(function() {
    if (!yearMedals.length) return [];
    var countries = {};
    yearMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || "";
      if (!countries[cn]) countries[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    return Object.values(countries).sort(function(a,b) { return b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze; });
  }, [yearMedals, countriesMap]);

  var hostInfo = year ? SUMMER_OLYMPICS.find(function(o) { return o.year === year; }) : null;

  // Sports breakdown for selected year
  var sportBreakdown = useMemo(function() {
    if (!year) return [];
    var ym = summerMedals.filter(function(m) { return m.year === year; });
    var sp = {};
    ym.forEach(function(m) {
      if (!sp[m.sport]) sp[m.sport] = {sport:m.sport, gold:0, silver:0, bronze:0, total:0};
      sp[m.sport].total++;
      if (m.medal === "Gold") sp[m.sport].gold++;
      else if (m.medal === "Silver") sp[m.sport].silver++;
      else sp[m.sport].bronze++;
    });
    return Object.values(sp).sort(function(a,b) { return b.total - a.total; }).slice(0, 15);
  }, [year, summerMedals]);

  return React.createElement("div", null,
    // Host cities timeline
    React.createElement(OLCard, {title:"Summer Olympics Host Cities", icon:"\uD83C\uDFDF\uFE0F"},
      React.createElement("div", {style:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}},
        SUMMER_OLYMPICS.map(function(o,i) {
          return React.createElement("div", {
            key:i,
            onClick:function() { setYear(o.year); },
            style:{cursor:"pointer",padding:"6px 12px",borderRadius:8,
              background:year===o.year?"rgba(0,133,199,0.2)":"rgba(255,255,255,0.03)",
              border:"1px solid "+(year===o.year?"rgba(0,133,199,0.4)":"rgba(255,255,255,0.06)"),
              fontSize:11,textAlign:"center",minWidth:64,transition:"all 0.15s"}
          },
            React.createElement("div", {style:{fontWeight:700,color:"#F4C300",fontFamily:"'JetBrains Mono',monospace"}}, o.year),
            React.createElement("div", {style:{color:"#cbd5e1",fontSize:10,marginTop:2}}, o.city)
          );
        })
      )
    ),

    // Year detail
    year && React.createElement("div", null,
      hostInfo && React.createElement(OLCard, {title:year + " Summer Olympics", icon:"\uD83C\uDFC5"},
        React.createElement("div", {style:{display:"flex",alignItems:"center",gap:16,padding:8}},
          React.createElement(OlympicRingsSVG, {size:60}),
          React.createElement("div", null,
            React.createElement("div", {style:{fontSize:22,fontWeight:800,color:"#F4C300",fontFamily:"'Barlow Condensed',sans-serif"}}, hostInfo.city + " " + hostInfo.year),
            React.createElement("div", {style:{color:"#94a3b8",fontSize:13}}, "Host: " + hostInfo.country),
            React.createElement("div", {style:{color:"#64748b",fontSize:12}}, yearMedals.length + " medals awarded" + (sportFilter !== "All" ? " in " + sportFilter : ""))
          )
        )
      ),

      // Sport filter
      React.createElement(OLCard, {title:"Filter by Sport", icon:"\uD83C\uDFBD"},
        React.createElement("div", {style:{display:"flex",flexWrap:"wrap",gap:4}},
          React.createElement("button", {className:"ol-btn" + (sportFilter === "All" ? " active" : ""), onClick:function() { setSportFilter("All"); }}, "All Sports"),
          sports.filter(function(s) {
            return summerMedals.some(function(m) { return m.year === year && m.sport === s; });
          }).map(function(s) {
            return React.createElement("button", {key:s, className:"ol-btn" + (sportFilter === s ? " active" : ""), onClick:function() { setSportFilter(s); }}, s);
          })
        )
      ),

      // Medal table for year
      yearTable.length > 0 && React.createElement(OLCard, {title:year + " Medal Table" + (sportFilter !== "All" ? " (" + sportFilter + ")" : ""), icon:"\uD83E\uDD47"},
        React.createElement(OLMT, {
          headers:["#","Nation","Gold","Silver","Bronze","Total"],
          alignRight:[2,3,4,5],
          rows:yearTable.slice(0, 30).map(function(t,i) {
            return [
              i + 1,
              React.createElement(OLCountryLabel, {code:t.code, name:t.name, size:13}),
              React.createElement("span", {className:"ol-medal-gold"}, t.gold),
              React.createElement("span", {className:"ol-medal-silver"}, t.silver),
              React.createElement("span", {className:"ol-medal-bronze"}, t.bronze),
              React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, t.total)
            ];
          })
        })
      ),

      // Sports breakdown chart
      sportBreakdown.length > 0 && sportFilter === "All" && React.createElement(OLCard, {title:year + " Medals by Sport (Top 15)", icon:"\uD83D\uDCCA"},
        React.createElement(ResponsiveContainer, {width:"100%", height:360},
          React.createElement(BarChart, {data:sportBreakdown, layout:"vertical"},
            React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
            React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
            React.createElement(YAxis, {type:"category", dataKey:"sport", width:120, tick:{fill:"#cbd5e1",fontSize:10}}),
            React.createElement(Tooltip, {contentStyle:olTTStyle}),
            React.createElement(Legend, null),
            React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
            React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
            React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32"})
          )
        )
      )
    )
  );
}

// ── Tab: OLWinter ──
function OLWinter(props) {
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;

  var _yearState = useState(null);
  var year = _yearState[0];
  var setYear = _yearState[1];

  var yearMedals = useMemo(function() {
    if (!year) return [];
    return winterMedals.filter(function(m) { return m.year === year; });
  }, [year, winterMedals]);

  var yearTable = useMemo(function() {
    if (!yearMedals.length) return [];
    var countries = {};
    yearMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || "";
      if (!countries[cn]) countries[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    return Object.values(countries).sort(function(a,b) { return b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze; });
  }, [yearMedals, countriesMap]);

  var hostInfo = year ? WINTER_OLYMPICS.find(function(o) { return o.year === year; }) : null;

  // All-time winter table
  var allTimeWinter = useMemo(function() {
    var countries = {};
    winterMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || "";
      if (!countries[cn]) countries[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    return Object.values(countries).sort(function(a,b) { return b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze; }).slice(0, 20);
  }, [winterMedals, countriesMap]);

  // Sports breakdown
  var winterSports = useMemo(function() {
    var sp = {};
    winterMedals.forEach(function(m) {
      if (!sp[m.sport]) sp[m.sport] = {sport:m.sport, total:0, gold:0};
      sp[m.sport].total++;
      if (m.medal === "Gold") sp[m.sport].gold++;
    });
    return Object.values(sp).sort(function(a,b) { return b.total - a.total; });
  }, [winterMedals]);

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"Winter Olympics Host Cities", icon:"\u2744\uFE0F"},
      React.createElement("div", {style:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}},
        WINTER_OLYMPICS.map(function(o,i) {
          return React.createElement("div", {
            key:i,
            onClick:function() { setYear(o.year); },
            style:{cursor:"pointer",padding:"6px 12px",borderRadius:8,
              background:year===o.year?"rgba(0,133,199,0.2)":"rgba(255,255,255,0.03)",
              border:"1px solid "+(year===o.year?"rgba(0,133,199,0.4)":"rgba(255,255,255,0.06)"),
              fontSize:11,textAlign:"center",minWidth:64,transition:"all 0.15s"}
          },
            React.createElement("div", {style:{fontWeight:700,color:"#7ec8e3",fontFamily:"'JetBrains Mono',monospace"}}, o.year),
            React.createElement("div", {style:{color:"#cbd5e1",fontSize:10,marginTop:2}}, o.city)
          );
        })
      )
    ),

    year && hostInfo && React.createElement(OLCard, {title:year + " Winter Olympics - " + hostInfo.city, icon:"\u26F7\uFE0F"},
      React.createElement("div", {style:{color:"#94a3b8",fontSize:12,marginBottom:12}}, "Host: " + hostInfo.country + " \u00b7 " + yearMedals.length + " medals awarded"),
      yearTable.length > 0 && React.createElement(OLMT, {
        headers:["#","Nation","Gold","Silver","Bronze","Total"],
        alignRight:[2,3,4,5],
        rows:yearTable.slice(0, 30).map(function(t,i) {
          return [
            i + 1,
            React.createElement(OLCountryLabel, {code:t.code, name:t.name, size:13}),
            React.createElement("span", {className:"ol-medal-gold"}, t.gold),
            React.createElement("span", {className:"ol-medal-silver"}, t.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, t.bronze),
            React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, t.total)
          ];
        })
      })
    ),

    React.createElement(OLCard, {title:"All-Time Winter Medal Table (Top 20)", icon:"\uD83C\uDFC6"},
      React.createElement(OLMT, {
        headers:["#","Nation","Gold","Silver","Bronze","Total"],
        alignRight:[2,3,4,5],
        rows:allTimeWinter.map(function(t,i) {
          return [
            i + 1,
            React.createElement(OLCountryLabel, {code:t.code, name:t.name, size:13}),
            React.createElement("span", {className:"ol-medal-gold"}, t.gold),
            React.createElement("span", {className:"ol-medal-silver"}, t.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, t.bronze),
            React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, t.total)
          ];
        })
      })
    ),

    React.createElement(OLCard, {title:"Winter Sports Breakdown", icon:"\uD83C\uDFBF"},
      React.createElement(ResponsiveContainer, {width:"100%", height:Math.max(300, winterSports.length * 28)},
        React.createElement(BarChart, {data:winterSports, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"sport", width:140, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Bar, {dataKey:"total", name:"Total Medals", fill:"#7ec8e3", radius:[0,6,6,0]})
        )
      )
    )
  );
}

// ── Tab: OLAthletics ──
function OLAthletics(props) {
  var iaafRecords = props.iaafRecords;
  var summerMedals = props.summerMedals;

  var _genderFilter = useState("All");
  var genderFilter = _genderFilter[0];
  var setGenderFilter = _genderFilter[1];

  var _searchTerm = useState("");
  var searchTerm = _searchTerm[0];
  var setSearchTerm = _searchTerm[1];

  // Athletics medals from summer data
  var athleticsMedals = useMemo(function() {
    return summerMedals.filter(function(m) { return m.sport === "Athletics" || m.sport === "Track and Field"; });
  }, [summerMedals]);

  // Top athletics nations
  var athleticsNations = useMemo(function() {
    var countries = {};
    athleticsMedals.forEach(function(m) {
      var cn = m.country || m.code;
      if (!countries[cn]) countries[cn] = {name:cn, code:m.code||"", gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    return Object.values(countries).sort(function(a,b) { return b.gold - a.gold || b.total - a.total; }).slice(0, 15);
  }, [athleticsMedals]);

  // IAAF records filtered
  var filteredRecords = useMemo(function() {
    var records = iaafRecords;
    if (genderFilter !== "All") {
      records = records.filter(function(r) {
        if (genderFilter === "Men") return r.gender === "M" || r.gender === "Men";
        return r.gender === "W" || r.gender === "F" || r.gender === "Women";
      });
    }
    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      records = records.filter(function(r) {
        return (r.discipline && r.discipline.toLowerCase().indexOf(term) >= 0) ||
               (r.competitor && r.competitor.toLowerCase().indexOf(term) >= 0) ||
               (r.country && r.country.toLowerCase().indexOf(term) >= 0);
      });
    }
    return records.slice(0, 50);
  }, [iaafRecords, genderFilter, searchTerm]);

  // World records by type
  var recordTypes = useMemo(function() {
    var types = {};
    iaafRecords.forEach(function(r) {
      var rt = r.record_type || "Unknown";
      if (!types[rt]) types[rt] = 0;
      types[rt]++;
    });
    return Object.entries(types).map(function(e) { return {type:e[0], count:e[1]}; }).sort(function(a,b) { return b.count - a.count; }).slice(0, 10);
  }, [iaafRecords]);

  return React.createElement("div", null,
    React.createElement("div", {className:"ol-grid", style:{marginBottom:16}},
      React.createElement(OLSB, {value:athleticsMedals.length.toLocaleString(), label:"Athletics Medals"}),
      React.createElement(OLSB, {value:iaafRecords.length.toLocaleString(), label:"IAAF Records"}),
      React.createElement(OLSB, {value:athleticsNations.length, label:"Nations with Medals"})
    ),

    // Legendary Olympians
    React.createElement(OLCard, {title:"Legendary Olympians", icon:"\u2B50"},
      React.createElement(OLMT, {
        headers:["Athlete","Country","Sport","Gold","Silver","Bronze","Total","Years"],
        alignRight:[3,4,5,6],
        rows:LEGENDARY_OLYMPIANS.map(function(a) {
          return [
            React.createElement("span", {style:{fontWeight:700,color:"#f8fafc"}}, a.name),
            a.country,
            React.createElement("span", {style:{color:"#94a3b8",fontSize:11}}, a.sport),
            React.createElement("span", {className:"ol-medal-gold"}, a.gold),
            React.createElement("span", {className:"ol-medal-silver"}, a.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, a.bronze),
            React.createElement("span", {style:{fontWeight:700}}, a.gold + a.silver + a.bronze),
            React.createElement("span", {style:{color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}, a.years)
          ];
        })
      })
    ),

    // Top Athletics Nations
    React.createElement(OLCard, {title:"Top Athletics Nations", icon:"\uD83C\uDFC3"},
      React.createElement(ResponsiveContainer, {width:"100%", height:360},
        React.createElement(BarChart, {data:athleticsNations, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"name", width:100, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Legend, null),
          React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
          React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
          React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32"})
        )
      )
    ),

    // IAAF Records
    React.createElement(OLCard, {title:"IAAF World Records", icon:"\uD83D\uDCCB"},
      React.createElement("div", {style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}},
        React.createElement("input", {
          type:"text", className:"ol-search", placeholder:"Search records...",
          style:{maxWidth:300}, value:searchTerm,
          onChange:function(e) { setSearchTerm(e.target.value); }
        }),
        React.createElement("button", {className:"ol-btn"+(genderFilter==="All"?" active":""), onClick:function(){setGenderFilter("All");}}, "All"),
        React.createElement("button", {className:"ol-btn"+(genderFilter==="Men"?" active":""), onClick:function(){setGenderFilter("Men");}}, "Men"),
        React.createElement("button", {className:"ol-btn"+(genderFilter==="Women"?" active":""), onClick:function(){setGenderFilter("Women");}}, "Women")
      ),
      React.createElement("div", {style:{maxHeight:400,overflowY:"auto"}},
        React.createElement(OLMT, {
          headers:["Discipline","Performance","Athlete","Country","Year","Record Type"],
          rows:filteredRecords.map(function(r) {
            return [
              React.createElement("span", {style:{fontWeight:600,color:"#e2e8f0"}}, r.discipline),
              React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",color:"#F4C300",fontWeight:700}}, r.performance),
              r.competitor || "-",
              r.country || "-",
              React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}, r.year || "-"),
              React.createElement("span", {style:{color:"#94a3b8",fontSize:10}}, r.record_type || "-")
            ];
          })
        })
      )
    ),

    // Record types breakdown
    React.createElement(OLCard, {title:"Records by Type", icon:"\uD83D\uDCCA"},
      React.createElement(ResponsiveContainer, {width:"100%", height:260},
        React.createElement(BarChart, {data:recordTypes},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {dataKey:"type", tick:{fill:"#94a3b8",fontSize:9}, angle:-25, textAnchor:"end", height:60}),
          React.createElement(YAxis, {tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Bar, {dataKey:"count", name:"Records", fill:"#0085C7", radius:[6,6,0,0]})
        )
      )
    )
  );
}

// ── Tab: OLMedalTable ──
function OLMedalTable(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;

  var _mode = useState("combined");
  var mode = _mode[0];
  var setMode = _mode[1];

  var _sortBy = useState("gold");
  var sortBy = _sortBy[0];
  var setSortBy = _sortBy[1];

  var _search = useState("");
  var search = _search[0];
  var setSearch = _search[1];

  var tableData = useMemo(function() {
    var source = mode === "summer" ? summerMedals : mode === "winter" ? winterMedals : summerMedals.concat(winterMedals);
    var countries = {};
    source.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || getCountryCode(cn);
      if (!countries[cn]) countries[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    var arr = Object.values(countries);
    if (search) {
      var term = search.toLowerCase();
      arr = arr.filter(function(c) { return c.name.toLowerCase().indexOf(term) >= 0 || c.code.toLowerCase().indexOf(term) >= 0; });
    }
    arr.sort(function(a,b) {
      if (sortBy === "gold") return b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze;
      if (sortBy === "total") return b.total - a.total || b.gold - a.gold;
      if (sortBy === "silver") return b.silver - a.silver || b.gold - a.gold;
      if (sortBy === "bronze") return b.bronze - a.bronze || b.gold - a.gold;
      return b.gold - a.gold;
    });
    return arr;
  }, [summerMedals, winterMedals, mode, sortBy, search, countriesMap]);

  // Top 20 chart data
  var chartData = tableData.slice(0, 20).map(function(c) {
    return {name:c.code || c.name.substring(0,3).toUpperCase(), gold:c.gold, silver:c.silver, bronze:c.bronze};
  });

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"All-Time Olympic Medal Table", icon:"\uD83C\uDFC5"},
      React.createElement("div", {style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}},
        React.createElement("input", {
          type:"text", className:"ol-search", placeholder:"Search nation...",
          style:{maxWidth:260}, value:search,
          onChange:function(e) { setSearch(e.target.value); }
        }),
        React.createElement("button", {className:"ol-btn"+(mode==="combined"?" active":""), onClick:function(){setMode("combined");}}, "Combined"),
        React.createElement("button", {className:"ol-btn"+(mode==="summer"?" active":""), onClick:function(){setMode("summer");}}, "Summer"),
        React.createElement("button", {className:"ol-btn"+(mode==="winter"?" active":""), onClick:function(){setMode("winter");}}, "Winter"),
        React.createElement("span", {style:{color:"#64748b",fontSize:10,marginLeft:8}}, "Sort:"),
        React.createElement("button", {className:"ol-btn"+(sortBy==="gold"?" active":""), onClick:function(){setSortBy("gold");}}, "Gold"),
        React.createElement("button", {className:"ol-btn"+(sortBy==="total"?" active":""), onClick:function(){setSortBy("total");}}, "Total")
      ),
      React.createElement("div", {style:{color:"#94a3b8",fontSize:11,marginBottom:12}}, tableData.length + " nations found"),
      React.createElement("div", {style:{maxHeight:600,overflowY:"auto"}},
        React.createElement(OLMT, {
          headers:["#","Nation","Gold","Silver","Bronze","Total"],
          alignRight:[2,3,4,5],
          rows:tableData.map(function(t,i) {
            return [
              i + 1,
              React.createElement(OLCountryLabel, {code:t.code, name:t.name, size:13}),
              React.createElement("span", {className:"ol-medal-gold"}, t.gold),
              React.createElement("span", {className:"ol-medal-silver"}, t.silver),
              React.createElement("span", {className:"ol-medal-bronze"}, t.bronze),
              React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#f8fafc"}}, t.total)
            ];
          })
        })
      )
    ),

    // Chart
    chartData.length > 0 && React.createElement(OLCard, {title:"Top 20 Nations (Medal Count)", icon:"\uD83D\uDCCA"},
      React.createElement(ResponsiveContainer, {width:"100%", height:420},
        React.createElement(BarChart, {data:chartData, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"name", width:50, tick:{fill:"#cbd5e1",fontSize:11}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Legend, null),
          React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
          React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
          React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32"})
        )
      )
    )
  );
}

// ── Tab: OLHeadToHead ──
function OLHeadToHead(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;

  var _team1 = useState("USA");
  var team1 = _team1[0];
  var setTeam1 = _team1[1];

  var _team2 = useState("Great Britain");
  var team2 = _team2[0];
  var setTeam2 = _team2[1];

  var allMedals = useMemo(function() { return summerMedals.concat(winterMedals); }, [summerMedals, winterMedals]);

  var comparison = useMemo(function() {
    var t1 = {gold:0,silver:0,bronze:0,total:0,sports:{},decades:{}};
    var t2 = {gold:0,silver:0,bronze:0,total:0,sports:{},decades:{}};

    allMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var target = null;
      if (cn === team1) target = t1;
      else if (cn === team2) target = t2;
      if (!target) return;

      target.total++;
      if (m.medal === "Gold") target.gold++;
      else if (m.medal === "Silver") target.silver++;
      else target.bronze++;

      if (m.sport) {
        if (!target.sports[m.sport]) target.sports[m.sport] = 0;
        target.sports[m.sport]++;
      }

      var dec = Math.floor(m.year / 10) * 10 + "s";
      if (!target.decades[dec]) target.decades[dec] = 0;
      target.decades[dec]++;
    });

    // Combine decades
    var allDecs = {};
    Object.keys(t1.decades).forEach(function(d) { allDecs[d] = true; });
    Object.keys(t2.decades).forEach(function(d) { allDecs[d] = true; });
    var decadeCompare = Object.keys(allDecs).sort().map(function(d) {
      return {decade:d, team1:t1.decades[d]||0, team2:t2.decades[d]||0};
    });

    // Top sports
    var allSports = {};
    Object.keys(t1.sports).forEach(function(s) { allSports[s] = true; });
    Object.keys(t2.sports).forEach(function(s) { allSports[s] = true; });
    var sportCompare = Object.keys(allSports).map(function(s) {
      return {sport:s, team1:t1.sports[s]||0, team2:t2.sports[s]||0, diff:Math.abs((t1.sports[s]||0) - (t2.sports[s]||0))};
    }).sort(function(a,b) { return (b.team1+b.team2) - (a.team1+a.team2); }).slice(0, 12);

    return {t1:t1, t2:t2, decadeCompare:decadeCompare, sportCompare:sportCompare};
  }, [allMedals, team1, team2, countriesMap]);

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"Head to Head Comparison", icon:"\u2694\uFE0F"},
      React.createElement("div", {style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:16}},
        React.createElement("select", {className:"ol-select", value:team1, onChange:function(e){setTeam1(e.target.value);}},
          OL_FOCUS_NATIONS.map(function(n) { return React.createElement("option", {key:n, value:n}, n); })
        ),
        React.createElement("span", {style:{color:"#94a3b8",fontWeight:700,fontSize:14}}, "VS"),
        React.createElement("select", {className:"ol-select", value:team2, onChange:function(e){setTeam2(e.target.value);}},
          OL_FOCUS_NATIONS.map(function(n) { return React.createElement("option", {key:n, value:n}, n); })
        )
      ),

      // Summary comparison
      React.createElement("div", {className:"ol-grid-2"},
        React.createElement("div", {style:{textAlign:"center",padding:16,background:"rgba(0,133,199,0.06)",borderRadius:12,border:"1px solid rgba(0,133,199,0.15)"}},
          React.createElement(OLFlagBadge, {code:getCountryCode(team1), size:36}),
          React.createElement("div", {style:{fontSize:18,fontWeight:800,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",marginTop:8}}, team1),
          React.createElement("div", {style:{display:"flex",justifyContent:"center",gap:16,marginTop:8}},
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-gold",style:{fontSize:20}}, comparison.t1.gold), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "GOLD")),
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-silver",style:{fontSize:20}}, comparison.t1.silver), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "SILVER")),
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-bronze",style:{fontSize:20}}, comparison.t1.bronze), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "BRONZE"))
          ),
          React.createElement("div", {style:{fontSize:28,fontWeight:800,color:"#F4C300",fontFamily:"'JetBrains Mono',monospace",marginTop:8}}, comparison.t1.total)
        ),
        React.createElement("div", {style:{textAlign:"center",padding:16,background:"rgba(238,51,78,0.06)",borderRadius:12,border:"1px solid rgba(238,51,78,0.15)"}},
          React.createElement(OLFlagBadge, {code:getCountryCode(team2), size:36}),
          React.createElement("div", {style:{fontSize:18,fontWeight:800,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",marginTop:8}}, team2),
          React.createElement("div", {style:{display:"flex",justifyContent:"center",gap:16,marginTop:8}},
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-gold",style:{fontSize:20}}, comparison.t2.gold), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "GOLD")),
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-silver",style:{fontSize:20}}, comparison.t2.silver), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "SILVER")),
            React.createElement("div", null, React.createElement("span", {className:"ol-medal-bronze",style:{fontSize:20}}, comparison.t2.bronze), React.createElement("div", {style:{fontSize:9,color:"#94a3b8"}}, "BRONZE"))
          ),
          React.createElement("div", {style:{fontSize:28,fontWeight:800,color:"#F4C300",fontFamily:"'JetBrains Mono',monospace",marginTop:8}}, comparison.t2.total)
        )
      )
    ),

    // Decade comparison
    comparison.decadeCompare.length > 0 && React.createElement(OLCard, {title:"Medals by Decade", icon:"\uD83D\uDCCA"},
      React.createElement(ResponsiveContainer, {width:"100%", height:300},
        React.createElement(BarChart, {data:comparison.decadeCompare},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {dataKey:"decade", tick:{fill:"#94a3b8",fontSize:10}}),
          React.createElement(YAxis, {tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Legend, null),
          React.createElement(Bar, {dataKey:"team1", name:team1, fill:olGetColor(team1), radius:[6,6,0,0]}),
          React.createElement(Bar, {dataKey:"team2", name:team2, fill:olGetColor(team2) === "#000000" ? "#444444" : olGetColor(team2), radius:[6,6,0,0]})
        )
      )
    ),

    // Sport comparison
    comparison.sportCompare.length > 0 && React.createElement(OLCard, {title:"Top Sports Comparison", icon:"\uD83C\uDFBD"},
      React.createElement(ResponsiveContainer, {width:"100%", height:360},
        React.createElement(BarChart, {data:comparison.sportCompare, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"sport", width:100, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Legend, null),
          React.createElement(Bar, {dataKey:"team1", name:team1, fill:olGetColor(team1)}),
          React.createElement(Bar, {dataKey:"team2", name:team2, fill:olGetColor(team2) === "#000000" ? "#444444" : olGetColor(team2)})
        )
      )
    )
  );
}

// ── Tab: OLRecords ──
function OLRecords(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var athletes = props.athletes;
  var countriesMap = props.countriesMap;

  var allMedals = useMemo(function() { return summerMedals.concat(winterMedals); }, [summerMedals, winterMedals]);

  // Most decorated athletes (from medals data)
  var topAthletes = useMemo(function() {
    var ath = {};
    allMedals.forEach(function(m) {
      if (!m.athlete || m.athlete === "-") return;
      var key = m.athlete;
      if (!ath[key]) ath[key] = {name:m.athlete, country:m.country||m.code, gold:0, silver:0, bronze:0, total:0, sports:{}};
      ath[key].total++;
      if (m.medal === "Gold") ath[key].gold++;
      else if (m.medal === "Silver") ath[key].silver++;
      else ath[key].bronze++;
      if (m.sport) ath[key].sports[m.sport] = true;
    });
    return Object.values(ath).sort(function(a,b) { return b.total - a.total || b.gold - a.gold; }).slice(0, 25);
  }, [allMedals]);

  // Most gold medals by athlete
  var topGold = useMemo(function() {
    return topAthletes.slice().sort(function(a,b) { return b.gold - a.gold || b.total - a.total; }).slice(0, 15);
  }, [topAthletes]);

  // Records from athletes dataset
  var athleteRecords = useMemo(function() {
    if (!athletes || !athletes.length) return {youngest:[], oldest:[]};
    var medalists = athletes.filter(function(a) { return a.medal && a.medal !== "No Medal" && a.age; });
    var youngest = medalists.slice().sort(function(a,b) { return a.age - b.age; }).slice(0, 10);
    var oldest = medalists.slice().sort(function(a,b) { return b.age - a.age; }).slice(0, 10);
    return {youngest:youngest, oldest:oldest};
  }, [athletes]);

  // Nations with most consecutive games appearing
  var nationGames = useMemo(function() {
    var nations = {};
    allMedals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      if (!nations[cn]) nations[cn] = {name:cn, years:{}};
      nations[cn].years[m.year] = true;
    });
    return Object.values(nations).map(function(n) {
      return {name:n.name, games:Object.keys(n.years).length};
    }).sort(function(a,b) { return b.games - a.games; }).slice(0, 15);
  }, [allMedals, countriesMap]);

  return React.createElement("div", null,
    // Most decorated athletes
    React.createElement(OLCard, {title:"Most Decorated Athletes (All Time)", icon:"\uD83E\uDD47"},
      React.createElement("div", {style:{maxHeight:500,overflowY:"auto"}},
        React.createElement(OLMT, {
          headers:["#","Athlete","Nation","Sport(s)","Gold","Silver","Bronze","Total"],
          alignRight:[4,5,6,7],
          rows:topAthletes.map(function(a,i) {
            var sportList = Object.keys(a.sports).join(", ");
            return [
              i + 1,
              React.createElement("span", {style:{fontWeight:700,color:"#f8fafc"}}, a.name),
              a.country,
              React.createElement("span", {style:{color:"#94a3b8",fontSize:10}}, sportList),
              React.createElement("span", {className:"ol-medal-gold"}, a.gold),
              React.createElement("span", {className:"ol-medal-silver"}, a.silver),
              React.createElement("span", {className:"ol-medal-bronze"}, a.bronze),
              React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, a.total)
            ];
          })
        })
      )
    ),

    // Most Gold chart
    React.createElement(OLCard, {title:"Most Gold Medals (Individual Athletes)", icon:"\uD83E\uDD47"},
      React.createElement(ResponsiveContainer, {width:"100%", height:360},
        React.createElement(BarChart, {data:topGold, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"name", width:140, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Bar, {dataKey:"gold", name:"Gold Medals", fill:"#F4C300", radius:[0,6,6,0]})
        )
      )
    ),

    // Youngest/Oldest medalists (from athlete dataset)
    athleteRecords.youngest.length > 0 && React.createElement("div", {className:"ol-grid-2"},
      React.createElement(OLCard, {title:"Youngest Medalists", icon:"\uD83C\uDF1F"},
        React.createElement(OLMT, {
          headers:["Athlete","Age","Sport","Year","Medal"],
          rows:athleteRecords.youngest.map(function(a) {
            return [
              React.createElement("span", {style:{fontWeight:600,color:"#e2e8f0"}}, a.athlete_name),
              React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",color:"#F4C300"}}, a.age),
              React.createElement("span", {style:{color:"#94a3b8",fontSize:11}}, a.sport),
              a.year,
              React.createElement(MedalBadge, {medal:a.medal})
            ];
          })
        })
      ),
      React.createElement(OLCard, {title:"Oldest Medalists", icon:"\uD83C\uDFC6"},
        React.createElement(OLMT, {
          headers:["Athlete","Age","Sport","Year","Medal"],
          rows:athleteRecords.oldest.map(function(a) {
            return [
              React.createElement("span", {style:{fontWeight:600,color:"#e2e8f0"}}, a.athlete_name),
              React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",color:"#7ec8e3"}}, a.age),
              React.createElement("span", {style:{color:"#94a3b8",fontSize:11}}, a.sport),
              a.year,
              React.createElement(MedalBadge, {medal:a.medal})
            ];
          })
        })
      )
    ),

    // Nations with most games
    React.createElement(OLCard, {title:"Nations with Most Olympic Appearances", icon:"\uD83C\uDF0D"},
      React.createElement(ResponsiveContainer, {width:"100%", height:360},
        React.createElement(BarChart, {data:nationGames, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"name", width:100, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Bar, {dataKey:"games", name:"Games Attended", fill:"#0085C7", radius:[0,6,6,0]})
        )
      )
    )
  );
}

// ── Tab: OLHostCities ──
function OLHostCities(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;

  var _season = useState("summer");
  var season = _season[0];
  var setSeason = _season[1];

  var allMedals = useMemo(function() { return summerMedals.concat(winterMedals); }, [summerMedals, winterMedals]);

  // Home advantage analysis
  var homeAdvantage = useMemo(function() {
    var olympicsList = season === "summer" ? SUMMER_OLYMPICS : WINTER_OLYMPICS;
    var medals = season === "summer" ? summerMedals : winterMedals;

    return olympicsList.map(function(ol) {
      var yearMedals = medals.filter(function(m) { return m.year === ol.year; });
      var totalMedals = yearMedals.length;
      var hostMedals = yearMedals.filter(function(m) {
        var cn = m.country || resolveCountryName(m.code, countriesMap);
        return cn === ol.country;
      }).length;
      var hostGold = yearMedals.filter(function(m) {
        var cn = m.country || resolveCountryName(m.code, countriesMap);
        return cn === ol.country && m.medal === "Gold";
      }).length;
      var pct = totalMedals > 0 ? Math.round(hostMedals / totalMedals * 100) : 0;
      return {year:ol.year, city:ol.city, country:ol.country, total:totalMedals, hostMedals:hostMedals, hostGold:hostGold, pct:pct};
    }).filter(function(h) { return h.total > 0; });
  }, [season, summerMedals, winterMedals, countriesMap]);

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"Olympic Host Cities & Home Advantage", icon:"\uD83C\uDFDF\uFE0F"},
      React.createElement("div", {style:{display:"flex",gap:8,marginBottom:16}},
        React.createElement("button", {className:"ol-btn"+(season==="summer"?" active":""), onClick:function(){setSeason("summer");}}, "Summer"),
        React.createElement("button", {className:"ol-btn"+(season==="winter"?" active":""), onClick:function(){setSeason("winter");}}, "Winter")
      ),

      React.createElement(OLMT, {
        headers:["Year","City","Host Nation","Host Medals","Host Gold","% of Total"],
        alignRight:[3,4,5],
        rows:homeAdvantage.map(function(h) {
          return [
            React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#F4C300"}}, h.year),
            h.city,
            h.country,
            React.createElement("span", {style:{fontWeight:700}}, h.hostMedals),
            React.createElement("span", {className:"ol-medal-gold"}, h.hostGold),
            React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",color:h.pct>15?"#3ddc84":"#94a3b8"}}, h.pct + "%")
          ];
        })
      })
    ),

    // Home advantage chart
    homeAdvantage.length > 0 && React.createElement(OLCard, {title:"Host Nation Medal Percentage Over Time", icon:"\uD83D\uDCCA"},
      React.createElement(ResponsiveContainer, {width:"100%", height:300},
        React.createElement(AreaChart, {data:homeAdvantage},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {dataKey:"year", tick:{fill:"#94a3b8",fontSize:10}}),
          React.createElement(YAxis, {tick:{fill:"#94a3b8",fontSize:11}, unit:"%"}),
          React.createElement(Tooltip, {contentStyle:olTTStyle, formatter:function(val){return val+"%";}}),
          React.createElement(Area, {type:"monotone", dataKey:"pct", name:"Host Medal %", stroke:"#0085C7", fill:"rgba(0,133,199,0.15)", strokeWidth:2})
        )
      )
    ),

    // Timeline
    React.createElement(OLCard, {title:(season === "summer" ? "Summer" : "Winter") + " Olympics Timeline", icon:"\uD83D\uDCC5"},
      React.createElement("div", {style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}},
        (season === "summer" ? SUMMER_OLYMPICS : WINTER_OLYMPICS).map(function(o,i) {
          return React.createElement("div", {
            key:i,
            style:{padding:12,background:"rgba(255,255,255,0.03)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}
          },
            React.createElement("div", {style:{fontSize:20,fontWeight:800,color:"#F4C300",fontFamily:"'JetBrains Mono',monospace"}}, o.year),
            React.createElement("div", {style:{fontSize:13,fontWeight:700,color:"#f8fafc",marginTop:4}}, o.city),
            React.createElement("div", {style:{fontSize:11,color:"#94a3b8",marginTop:2}}, o.country)
          );
        })
      )
    )
  );
}

// ── Tab: OLAllResults ──
function OLAllResults(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;

  var _search = useState("");
  var search = _search[0];
  var setSearch = _search[1];

  var _seasonFilter = useState("all");
  var seasonFilter = _seasonFilter[0];
  var setSeasonFilter = _seasonFilter[1];

  var _medalFilter = useState("all");
  var medalFilter = _medalFilter[0];
  var setMedalFilter = _medalFilter[1];

  var _page = useState(0);
  var page = _page[0];
  var setPage = _page[1];

  var PAGE_SIZE = 50;

  var filteredResults = useMemo(function() {
    var allMedals = seasonFilter === "summer" ? summerMedals : seasonFilter === "winter" ? winterMedals : summerMedals.concat(winterMedals);
    if (medalFilter !== "all") {
      allMedals = allMedals.filter(function(m) { return m.medal === medalFilter; });
    }
    if (search) {
      var term = search.toLowerCase();
      allMedals = allMedals.filter(function(m) {
        return (m.athlete && m.athlete.toLowerCase().indexOf(term) >= 0) ||
               (m.country && m.country.toLowerCase().indexOf(term) >= 0) ||
               (m.code && m.code.toLowerCase().indexOf(term) >= 0) ||
               (m.sport && m.sport.toLowerCase().indexOf(term) >= 0) ||
               (m.event && m.event.toLowerCase().indexOf(term) >= 0) ||
               (m.city && m.city.toLowerCase().indexOf(term) >= 0);
      });
    }
    return allMedals;
  }, [summerMedals, winterMedals, seasonFilter, medalFilter, search]);

  var pageResults = filteredResults.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  var totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"All Medal Results", icon:"\uD83D\uDD0D"},
      React.createElement("div", {style:{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}},
        React.createElement("input", {
          type:"text", className:"ol-search", placeholder:"Search athlete, country, sport, event...",
          style:{maxWidth:340}, value:search,
          onChange:function(e) { setSearch(e.target.value); setPage(0); }
        }),
        React.createElement("button", {className:"ol-btn"+(seasonFilter==="all"?" active":""), onClick:function(){setSeasonFilter("all");setPage(0);}}, "All"),
        React.createElement("button", {className:"ol-btn"+(seasonFilter==="summer"?" active":""), onClick:function(){setSeasonFilter("summer");setPage(0);}}, "Summer"),
        React.createElement("button", {className:"ol-btn"+(seasonFilter==="winter"?" active":""), onClick:function(){setSeasonFilter("winter");setPage(0);}}, "Winter"),
        React.createElement("span", {style:{color:"#64748b",fontSize:10,marginLeft:4}}, "|"),
        React.createElement("button", {className:"ol-btn"+(medalFilter==="all"?" active":""), onClick:function(){setMedalFilter("all");setPage(0);}}, "All Medals"),
        React.createElement("button", {className:"ol-btn"+(medalFilter==="Gold"?" active":""), onClick:function(){setMedalFilter("Gold");setPage(0);}}, "Gold"),
        React.createElement("button", {className:"ol-btn"+(medalFilter==="Silver"?" active":""), onClick:function(){setMedalFilter("Silver");setPage(0);}}, "Silver"),
        React.createElement("button", {className:"ol-btn"+(medalFilter==="Bronze"?" active":""), onClick:function(){setMedalFilter("Bronze");setPage(0);}}, "Bronze")
      ),
      React.createElement("div", {style:{color:"#94a3b8",fontSize:11,marginBottom:8}}, filteredResults.length.toLocaleString() + " results \u00b7 Page " + (page+1) + " of " + Math.max(1,totalPages)),

      React.createElement("div", {style:{maxHeight:500,overflowY:"auto"}},
        React.createElement(OLMT, {
          headers:["Year","Athlete","Country","Sport","Event","Medal","City"],
          rows:pageResults.map(function(m) {
            return [
              React.createElement("span", {style:{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}, m.year),
              React.createElement("span", {style:{fontWeight:600,color:"#e2e8f0",fontSize:11}}, m.athlete || "-"),
              React.createElement("span", {style:{fontSize:11}}, m.country || m.code || "-"),
              React.createElement("span", {style:{color:"#94a3b8",fontSize:10}}, m.sport || "-"),
              React.createElement("span", {style:{color:"#94a3b8",fontSize:10}}, m.event || "-"),
              React.createElement(MedalBadge, {medal:m.medal}),
              React.createElement("span", {style:{color:"#64748b",fontSize:10}}, m.city || "-")
            ];
          })
        })
      ),

      // Pagination
      React.createElement("div", {style:{display:"flex",justifyContent:"center",gap:8,marginTop:12}},
        React.createElement("button", {className:"ol-page-btn", disabled:page===0, onClick:function(){setPage(Math.max(0,page-1));}}, "\u25C0 Prev"),
        React.createElement("span", {style:{color:"#94a3b8",fontSize:11,lineHeight:"30px"}}, (page+1) + " / " + Math.max(1,totalPages)),
        React.createElement("button", {className:"ol-page-btn", disabled:page>=totalPages-1, onClick:function(){setPage(Math.min(totalPages-1,page+1));}}, "Next \u25B6")
      )
    )
  );
}

// ── Tab: OLSports ──
function OLSports(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;

  var _selSport = useState(null);
  var selSport = _selSport[0];
  var setSelSport = _selSport[1];

  var allMedals = useMemo(function() { return summerMedals.concat(winterMedals); }, [summerMedals, winterMedals]);

  var sportsData = useMemo(function() {
    var sp = {};
    allMedals.forEach(function(m) {
      if (!m.sport) return;
      if (!sp[m.sport]) sp[m.sport] = {sport:m.sport, gold:0, silver:0, bronze:0, total:0, years:{}};
      sp[m.sport].total++;
      if (m.medal === "Gold") sp[m.sport].gold++;
      else if (m.medal === "Silver") sp[m.sport].silver++;
      else sp[m.sport].bronze++;
      sp[m.sport].years[m.year] = true;
    });
    return Object.values(sp).sort(function(a,b) { return b.total - a.total; });
  }, [allMedals]);

  var sportDetail = useMemo(function() {
    if (!selSport) return null;
    var medals = allMedals.filter(function(m) { return m.sport === selSport; });
    var countries = {};
    medals.forEach(function(m) {
      var cn = m.country || resolveCountryName(m.code, countriesMap);
      var cc = m.code || "";
      if (!countries[cn]) countries[cn] = {name:cn, code:cc, gold:0, silver:0, bronze:0, total:0};
      countries[cn].total++;
      if (m.medal === "Gold") countries[cn].gold++;
      else if (m.medal === "Silver") countries[cn].silver++;
      else countries[cn].bronze++;
    });
    var topCountries = Object.values(countries).sort(function(a,b) { return b.gold - a.gold || b.total - a.total; }).slice(0, 15);

    // Disciplines
    var disciplines = {};
    medals.forEach(function(m) {
      var d = m.discipline || m.event || "Unknown";
      if (!disciplines[d]) disciplines[d] = 0;
      disciplines[d]++;
    });
    var topDisciplines = Object.entries(disciplines).map(function(e) { return {name:e[0], count:e[1]}; }).sort(function(a,b) { return b.count - a.count; }).slice(0, 15);

    return {medals:medals.length, topCountries:topCountries, topDisciplines:topDisciplines};
  }, [selSport, allMedals, countriesMap]);

  return React.createElement("div", null,
    React.createElement(OLCard, {title:"Olympic Sports Breakdown", icon:"\uD83C\uDFBD"},
      React.createElement("div", {style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}},
        sportsData.slice(0, 30).map(function(s) {
          return React.createElement("button", {
            key:s.sport,
            className:"ol-btn" + (selSport === s.sport ? " active" : ""),
            onClick:function() { setSelSport(s.sport === selSport ? null : s.sport); },
            style:{fontSize:10}
          }, s.sport + " (" + s.total + ")");
        })
      ),

      React.createElement(OLMT, {
        headers:["Sport","Gold","Silver","Bronze","Total","Games"],
        alignRight:[1,2,3,4,5],
        rows:sportsData.slice(0, 25).map(function(s) {
          return [
            React.createElement("span", {
              style:{fontWeight:600,color:selSport===s.sport?"#0085C7":"#e2e8f0",cursor:"pointer"},
              onClick:function() { setSelSport(s.sport); }
            }, s.sport),
            React.createElement("span", {className:"ol-medal-gold"}, s.gold),
            React.createElement("span", {className:"ol-medal-silver"}, s.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, s.bronze),
            React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, s.total),
            React.createElement("span", {style:{color:"#94a3b8",fontSize:11}}, Object.keys(s.years).length)
          ];
        })
      })
    ),

    // Sport detail
    selSport && sportDetail && React.createElement("div", null,
      React.createElement(OLCard, {title:selSport + " - Dominant Nations", icon:"\uD83C\uDFC6"},
        React.createElement("div", {style:{color:"#94a3b8",fontSize:12,marginBottom:12}}, sportDetail.medals.toLocaleString() + " medals awarded"),
        React.createElement(ResponsiveContainer, {width:"100%", height:360},
          React.createElement(BarChart, {data:sportDetail.topCountries, layout:"vertical"},
            React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
            React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
            React.createElement(YAxis, {type:"category", dataKey:"name", width:100, tick:{fill:"#cbd5e1",fontSize:10}}),
            React.createElement(Tooltip, {contentStyle:olTTStyle}),
            React.createElement(Legend, null),
            React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
            React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
            React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32"})
          )
        )
      ),

      sportDetail.topDisciplines.length > 0 && React.createElement(OLCard, {title:selSport + " - Top Events/Disciplines", icon:"\uD83D\uDCCB"},
        React.createElement(OLMT, {
          headers:["Event/Discipline","Medals"],
          alignRight:[1],
          rows:sportDetail.topDisciplines.map(function(d) {
            return [
              d.name,
              React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, d.count)
            ];
          })
        })
      )
    )
  );
}

// ── Tab: OLTeam ──
function OLTeam(props) {
  var summerMedals = props.summerMedals;
  var winterMedals = props.winterMedals;
  var countriesMap = props.countriesMap;
  var countryData = props.countryData;
  var teamName = props.teamName;

  var allMedals = useMemo(function() { return summerMedals.concat(winterMedals); }, [summerMedals, winterMedals]);

  // Resolve teamName: could be a code like "GBR" or a full name like "Great Britain"
  var resolvedTeamName = useMemo(function() {
    // Check if teamName is a code by looking it up
    var resolved = resolveCountryName(teamName, countriesMap);
    if (resolved && resolved !== teamName) return resolved;
    // Check OL_CODE_TO_COUNTRY
    if (OL_CODE_TO_COUNTRY[teamName]) return OL_CODE_TO_COUNTRY[teamName];
    return teamName;
  }, [teamName, countriesMap]);

  var teamCode = getCountryCode(resolvedTeamName);

  var teamMedals = useMemo(function() {
    return allMedals.filter(function(m) {
      return m.code === teamCode || (m.country || resolveCountryName(m.code, countriesMap)) === resolvedTeamName;
    });
  }, [allMedals, resolvedTeamName, teamCode, countriesMap]);

  var teamSummerMedals = useMemo(function() {
    return summerMedals.filter(function(m) {
      return m.code === teamCode || (m.country || resolveCountryName(m.code, countriesMap)) === resolvedTeamName;
    });
  }, [summerMedals, resolvedTeamName, teamCode, countriesMap]);

  var teamWinterMedals = useMemo(function() {
    return winterMedals.filter(function(m) {
      return m.code === teamCode || (m.country || resolveCountryName(m.code, countriesMap)) === resolvedTeamName;
    });
  }, [winterMedals, resolvedTeamName, teamCode, countriesMap]);

  var stats = useMemo(function() {
    var gold = teamMedals.filter(function(m) { return m.medal === "Gold"; }).length;
    var silver = teamMedals.filter(function(m) { return m.medal === "Silver"; }).length;
    var bronze = teamMedals.filter(function(m) { return m.medal === "Bronze"; }).length;

    // By decade
    var decades = {};
    teamMedals.forEach(function(m) {
      var dec = Math.floor(m.year / 10) * 10 + "s";
      if (!decades[dec]) decades[dec] = {decade:dec, gold:0, silver:0, bronze:0, total:0};
      decades[dec].total++;
      if (m.medal === "Gold") decades[dec].gold++;
      else if (m.medal === "Silver") decades[dec].silver++;
      else decades[dec].bronze++;
    });
    var decadeData = Object.values(decades).sort(function(a,b) { return a.decade.localeCompare(b.decade); });

    // Top sports
    var sports = {};
    teamMedals.forEach(function(m) {
      if (!m.sport) return;
      if (!sports[m.sport]) sports[m.sport] = {sport:m.sport, gold:0, silver:0, bronze:0, total:0};
      sports[m.sport].total++;
      if (m.medal === "Gold") sports[m.sport].gold++;
      else if (m.medal === "Silver") sports[m.sport].silver++;
      else sports[m.sport].bronze++;
    });
    var topSports = Object.values(sports).sort(function(a,b) { return b.total - a.total; }).slice(0, 12);

    // Top athletes
    var athletes = {};
    teamMedals.forEach(function(m) {
      if (!m.athlete || m.athlete === "-") return;
      if (!athletes[m.athlete]) athletes[m.athlete] = {name:m.athlete, gold:0, silver:0, bronze:0, total:0, sport:m.sport};
      athletes[m.athlete].total++;
      if (m.medal === "Gold") athletes[m.athlete].gold++;
      else if (m.medal === "Silver") athletes[m.athlete].silver++;
      else athletes[m.athlete].bronze++;
    });
    var topAthletes = Object.values(athletes).sort(function(a,b) { return b.total - a.total || b.gold - a.gold; }).slice(0, 15);

    // Games attended
    var gamesYears = {};
    teamMedals.forEach(function(m) { gamesYears[m.year] = true; });
    var gamesAttended = Object.keys(gamesYears).length;

    return {gold:gold, silver:silver, bronze:bronze, total:teamMedals.length,
            summerTotal:teamSummerMedals.length, winterTotal:teamWinterMedals.length,
            decadeData:decadeData, topSports:topSports, topAthletes:topAthletes, gamesAttended:gamesAttended};
  }, [teamMedals, teamSummerMedals, teamWinterMedals]);

  var code = teamCode;
  var info = countryData ? countryData.find(function(c) { return c.country === resolvedTeamName || c.code === code; }) : null;

  return React.createElement("div", null,
    // Hero
    React.createElement("div", {style:{textAlign:"center",padding:"20px 0",marginBottom:16}},
      React.createElement(OLFlagBadge, {code:code, size:56}),
      React.createElement("div", {style:{fontSize:28,fontWeight:900,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",marginTop:8,textTransform:"uppercase"}}, resolvedTeamName),
      info && React.createElement("div", {style:{color:"#94a3b8",fontSize:11,marginTop:4}},
        "Population: " + (info.population ? Number(info.population).toLocaleString() : "N/A") +
        " \u00b7 GDP per Capita: $" + (info.gdp ? Number(info.gdp).toLocaleString(undefined,{maximumFractionDigits:0}) : "N/A")
      ),
      React.createElement("div", {style:{color:"#64748b",fontSize:11,marginTop:2}},
        stats.gamesAttended + " Olympic Games attended"
      )
    ),

    // Medal stats
    React.createElement("div", {className:"ol-grid", style:{marginBottom:16}},
      React.createElement(OLSB, {value:stats.total.toLocaleString(), label:"Total Medals"}),
      React.createElement(OLSB, {value:stats.gold, label:"Gold", color:"#F4C300"}),
      React.createElement(OLSB, {value:stats.silver, label:"Silver", color:"#C0C0C0"}),
      React.createElement(OLSB, {value:stats.bronze, label:"Bronze", color:"#CD7F32"}),
      React.createElement(OLSB, {value:stats.summerTotal, label:"Summer Medals", color:"#0085C7"}),
      React.createElement(OLSB, {value:stats.winterTotal, label:"Winter Medals", color:"#7ec8e3"})
    ),

    React.createElement("div", {className:"ol-grid-2"},
      // Medals by decade
      React.createElement(OLCard, {title:"Medals by Decade", icon:"\uD83D\uDCCA"},
        React.createElement(ResponsiveContainer, {width:"100%", height:280},
          React.createElement(BarChart, {data:stats.decadeData},
            React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
            React.createElement(XAxis, {dataKey:"decade", tick:{fill:"#94a3b8",fontSize:10}}),
            React.createElement(YAxis, {tick:{fill:"#94a3b8",fontSize:11}}),
            React.createElement(Tooltip, {contentStyle:olTTStyle}),
            React.createElement(Legend, null),
            React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
            React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
            React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32", radius:[4,4,0,0]})
          )
        )
      ),

      // Summer vs Winter
      React.createElement(OLCard, {title:"Summer vs Winter Split", icon:"\u2744\uFE0F"},
        React.createElement(ResponsiveContainer, {width:"100%", height:280},
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data:[{name:"Summer",value:stats.summerTotal,fill:"#0085C7"},{name:"Winter",value:stats.winterTotal,fill:"#7ec8e3"}],
              cx:"50%", cy:"50%", outerRadius:80, innerRadius:40, dataKey:"value",
              label:function(e) { return e.name + ": " + e.value; }
            },
              React.createElement(Cell, {fill:"#0085C7"}),
              React.createElement(Cell, {fill:"#7ec8e3"})
            ),
            React.createElement(Tooltip, {contentStyle:olTTStyle})
          )
        )
      )
    ),

    // Top sports
    React.createElement(OLCard, {title:"Top Sports for " + resolvedTeamName, icon:"\uD83C\uDFBD"},
      React.createElement(ResponsiveContainer, {width:"100%", height:320},
        React.createElement(BarChart, {data:stats.topSports, layout:"vertical"},
          React.createElement(CartesianGrid, {strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.04)"}),
          React.createElement(XAxis, {type:"number", tick:{fill:"#94a3b8",fontSize:11}}),
          React.createElement(YAxis, {type:"category", dataKey:"sport", width:100, tick:{fill:"#cbd5e1",fontSize:10}}),
          React.createElement(Tooltip, {contentStyle:olTTStyle}),
          React.createElement(Legend, null),
          React.createElement(Bar, {dataKey:"gold", name:"Gold", stackId:"a", fill:"#F4C300"}),
          React.createElement(Bar, {dataKey:"silver", name:"Silver", stackId:"a", fill:"#C0C0C0"}),
          React.createElement(Bar, {dataKey:"bronze", name:"Bronze", stackId:"a", fill:"#CD7F32"})
        )
      )
    ),

    // Best athletes
    React.createElement(OLCard, {title:"Top Athletes - " + resolvedTeamName, icon:"\u2B50"},
      React.createElement(OLMT, {
        headers:["#","Athlete","Sport","Gold","Silver","Bronze","Total"],
        alignRight:[3,4,5,6],
        rows:stats.topAthletes.map(function(a,i) {
          return [
            i + 1,
            React.createElement("span", {style:{fontWeight:700,color:"#f8fafc"}}, a.name),
            React.createElement("span", {style:{color:"#94a3b8",fontSize:11}}, a.sport),
            React.createElement("span", {className:"ol-medal-gold"}, a.gold),
            React.createElement("span", {className:"ol-medal-silver"}, a.silver),
            React.createElement("span", {className:"ol-medal-bronze"}, a.bronze),
            React.createElement("span", {style:{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}, a.total)
          ];
        })
      })
    )
  );
}

// ── Error Boundary ──
class OLErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error: error }; }
  componentDidCatch(error, info) { console.error("Olympics tab error:", error, info); }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", {className:"ol-card", style:{textAlign:"center",padding:40}},
        React.createElement("div", {style:{fontSize:48,marginBottom:12}}, "\u26A0\uFE0F"),
        React.createElement("div", {style:{color:"#ef4444",fontSize:16,fontWeight:700,marginBottom:8}}, "Something went wrong"),
        React.createElement("div", {style:{color:"#94a3b8",fontSize:13,marginBottom:16}}, this.state.error ? this.state.error.message : "An error occurred rendering this tab."),
        React.createElement("button", {className:"ol-btn", onClick:() => this.setState({hasError:false,error:null})}, "Try Again")
      );
    }
    return this.props.children;
  }
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
function OlympicsStatNations() {
  var _summerMedals = useState([]);
  var summerMedals = _summerMedals[0];
  var setSummerMedals = _summerMedals[1];

  var _winterMedals = useState([]);
  var winterMedals = _winterMedals[0];
  var setWinterMedals = _winterMedals[1];

  var _iaafRecords = useState([]);
  var iaafRecords = _iaafRecords[0];
  var setIaafRecords = _iaafRecords[1];

  var _countriesMap = useState({});
  var countriesMap = _countriesMap[0];
  var setCountriesMap = _countriesMap[1];

  var _countryData = useState([]);
  var countryData = _countryData[0];
  var setCountryData = _countryData[1];

  var _athletes = useState([]);
  var athletes = _athletes[0];
  var setAthletes = _athletes[1];

  var _olympicMedals = useState([]);
  var olympicMedals = _olympicMedals[0];
  var setOlympicMedals = _olympicMedals[1];

  var _loading = useState(true);
  var loading = _loading[0];
  var setLoading = _loading[1];

  var _loadProgress = useState("Downloading Olympic data...");
  var loadProgress = _loadProgress[0];
  var setLoadProgress = _loadProgress[1];

  var _error = useState(null);
  var error = _error[0];
  var setError = _error[1];

  var _activeTab = useState("overview");
  var activeTab = _activeTab[0];
  var setActiveTab = _activeTab[1];

  var _teamParam = useState("USA");
  var teamParam = _teamParam[0];
  var setTeamParam = _teamParam[1];

  var parseHash = useCallback(function() {
    var hash = window.location.hash || "";
    if (!hash.startsWith("#/olympics")) return;
    var parts = hash.replace("#/olympics/", "").replace("#/olympics", "").split("/");
    var tab = parts[0] || "overview";
    var param = parts[1] ? decodeURIComponent(parts[1]) : null;
    setActiveTab(tab);
    if (param) setTeamParam(param);
  }, []);

  useEffect(function() {
    parseHash();
    var onHash = function() { parseHash(); };
    window.addEventListener("hashchange", onHash);
    return function() { window.removeEventListener("hashchange", onHash); };
  }, [parseHash]);

  // Fetch pre-processed JSON files (replaces CSV parsing)
  useEffect(function() {
    async function loadData() {
      try {
        setLoadProgress("Loading Olympic JSON data...");
        var [summerRes, winterRes, countriesRes, iaafRes, olMedalsRes, athletesRes] = await Promise.all([
          fetch("/data/olympics-summer.json"),
          fetch("/data/olympics-winter.json"),
          fetch("/data/olympics-countries.json"),
          fetch("/data/athletics-records.json"),
          fetch("/data/olympics-medal-summary.json"),
          fetch("/data/olympics-athletes.json")
        ]);

        if (!summerRes.ok) throw new Error("Failed to load olympics-summer.json: " + summerRes.status);
        if (!winterRes.ok) throw new Error("Failed to load olympics-winter.json: " + winterRes.status);

        setLoadProgress("Parsing Olympic data...");
        var [summerData, winterData, countriesData, iaafData, olMedalsData, athletesData] = await Promise.all([
          summerRes.json(),
          winterRes.json(),
          countriesRes.json(),
          iaafRes.ok ? iaafRes.json() : Promise.resolve([]),
          olMedalsRes.ok ? olMedalsRes.json() : Promise.resolve([]),
          athletesRes.ok ? athletesRes.json() : Promise.resolve([])
        ]);

        // Build countries map: code → country name
        var cMap = {};
        var cData = [];
        (countriesData || []).forEach(function(row) {
          var country = row.country || row.NOC_country || '';
          var code = row.code || row.NOC || '';
          var population = row.population || '';
          var gdp = row.gdp || '';
          if (code && country) {
            cMap[code] = country;
            cData.push({country:country, code:code, population:population, gdp:gdp});
          }
        });
        setCountriesMap(cMap);
        setCountryData(cData);

        // Normalise Summer medals
        var summerParsed = (summerData || []).filter(function(r) {
          return r.medal && r.medal !== 'NA' && r.medal !== '';
        }).map(function(r) {
          var year = parseInt(r.year || r.Year);
          var city = r.city || r.City || '';
          var sport = r.sport || r.Sport || '';
          var discipline = r.discipline || r.Discipline || '';
          var athlete = r.athlete || r.Athlete || '';
          var code = r.code || r.Code || r.NOC || '';
          var gender = r.gender || r.Gender || '';
          var event = r.event || r.Event || '';
          var medal = (r.medal || r.Medal || '').trim();
          var country = r.country || r.Country || cMap[code] || code;
          return {year,city,sport,discipline,athlete,code,gender,event,medal,country,season:'Summer'};
        });
        setSummerMedals(summerParsed);

        // Normalise Winter medals
        var winterParsed = (winterData || []).filter(function(r) {
          return r.medal && r.medal !== 'NA' && r.medal !== '';
        }).map(function(r) {
          var year = parseInt(r.year || r.Year);
          var city = r.city || r.City || '';
          var sport = r.sport || r.Sport || '';
          var discipline = r.discipline || r.Discipline || '';
          var athlete = r.athlete || r.Athlete || '';
          var code = r.code || r.Code || r.NOC || '';
          var gender = r.gender || r.Gender || '';
          var event = r.event || r.Event || '';
          var medal = (r.medal || r.Medal || '').trim();
          var country = r.country || r.Country || cMap[code] || code;
          return {year,city,sport,discipline,athlete,code,gender,event,medal,country,season:'Winter'};
        });
        setWinterMedals(winterParsed);

        // IAAF athletics records
        setIaafRecords(iaafData || []);

        // Olympic medals summary
        setOlympicMedals(olMedalsData || []);

        // Athletes dataset
        setAthletes(athletesData || []);

        setLoadProgress("Done");
        setLoading(false);
      } catch(e) {
        console.error("Olympics data load error:", e);
        setError(e.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  var navTab = useCallback(function(tab, param) {
    if (param) {
      window.location.hash = "#/olympics/" + tab + "/" + encodeURIComponent(param);
    } else {
      window.location.hash = "#/olympics/" + tab;
    }
  }, []);

  // ── Loading state ──
  if (loading) {
    return React.createElement("div", {style:{maxWidth:1200,margin:"0 auto",padding:"60px 20px",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}},
      React.createElement("style", null, olCSS),
      React.createElement(OlympicRingsSVG, {size:100}),
      React.createElement("div", {style:{color:"#f8fafc",fontSize:18,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em",marginTop:16}}, "Loading Olympic Data..."),
      React.createElement("div", {style:{color:"#94a3b8",fontSize:12,marginTop:8,fontFamily:"'JetBrains Mono',monospace"}}, loadProgress),
      React.createElement("div", {className:"ol-shimmer", style:{width:280,margin:"20px auto"}})
    );
  }

  // ── Error state ──
  if (error) {
    return React.createElement("div", {style:{maxWidth:1200,margin:"0 auto",padding:"60px 20px",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}},
      React.createElement("style", null, olCSS),
      React.createElement("div", {style:{fontSize:48,marginBottom:16}}, "\u26A0\uFE0F"),
      React.createElement("div", {style:{color:"#ef4444",fontSize:18,fontWeight:700}}, "Error Loading Data"),
      React.createElement("div", {style:{color:"#94a3b8",fontSize:13,marginTop:8}}, error)
    );
  }

  // ── Tab definitions ──
  var COMP_TABS = [
    {key:"overview", label:"Overview"},
    {key:"summer", label:"Summer Olympics"},
    {key:"winter", label:"Winter Olympics"},
    {key:"athletics", label:"Athletics"},
    {key:"medals", label:"Medal Table"}
  ];
  var EXPLORE_TABS = [
    {key:"h2h", label:"Head to Head"},
    {key:"records", label:"Records"},
    {key:"hostcities", label:"Host Cities"},
    {key:"allresults", label:"All Results"},
    {key:"sports", label:"Sports"}
  ];

  var flagStrip = React.createElement("div", {style:{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginTop:8}},
    OL_FOCUS_NATIONS.map(function(t) {
      var code = getCountryCode(t);
      return React.createElement("span", {key:t, style:{cursor:"pointer"}, onClick:function() { navTab("team", t); }, title:t},
        React.createElement(OLFlag, {code:code, size:20})
      );
    })
  );

  function renderContent() {
    switch (activeTab) {
      case "overview": return React.createElement(OLOverview, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap, athletes:athletes});
      case "summer": return React.createElement(OLSummer, {summerMedals:summerMedals, countriesMap:countriesMap});
      case "winter": return React.createElement(OLWinter, {winterMedals:winterMedals, countriesMap:countriesMap});
      case "athletics": return React.createElement(OLAthletics, {iaafRecords:iaafRecords, summerMedals:summerMedals});
      case "medals": return React.createElement(OLMedalTable, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap});
      case "h2h": return React.createElement(OLHeadToHead, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap});
      case "records": return React.createElement(OLRecords, {summerMedals:summerMedals, winterMedals:winterMedals, athletes:athletes, countriesMap:countriesMap});
      case "hostcities": return React.createElement(OLHostCities, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap});
      case "allresults": return React.createElement(OLAllResults, {summerMedals:summerMedals, winterMedals:winterMedals});
      case "sports": return React.createElement(OLSports, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap});
      case "team": return React.createElement(OLTeam, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap, countryData:countryData, teamName:teamParam});
      default: return React.createElement(OLOverview, {summerMedals:summerMedals, winterMedals:winterMedals, countriesMap:countriesMap, athletes:athletes});
    }
  }

  return React.createElement("div", {style:{fontFamily:"'DM Sans',sans-serif",color:"#cbd5e1",minHeight:"100vh"}},
    React.createElement("style", null, olCSS),

    // Header
    React.createElement("div", {style:{background:"linear-gradient(135deg, rgba(0,133,199,0.12) 0%, rgba(15,23,42,0.95) 50%, rgba(244,195,0,0.06) 100%)",borderBottom:"1px solid rgba(0,133,199,0.15)",padding:"20px 0 16px"}},
      React.createElement("div", {style:{maxWidth:1200,margin:"0 auto",padding:"0 20px",textAlign:"center"}},
        React.createElement("div", {style:{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:6}},
          React.createElement(OlympicRingsSVG, {size:60}),
          React.createElement("h1", {style:{fontSize:26,fontWeight:900,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em",margin:0}},
            React.createElement("span", {style:{color:"#0085C7"}}, "OLYMPICS"),
            " ",
            React.createElement("span", {style:{color:"#F4C300"}}, "STAT"),
            "NATIONS"
          )
        ),
        React.createElement("div", {style:{color:"#94a3b8",fontSize:11,letterSpacing:"0.04em"}},
          (summerMedals.length + winterMedals.length).toLocaleString() + " Olympic medals \u00b7 Since 1896"
        ),
        flagStrip
      )
    ),

    // Tab Navigation
    React.createElement("nav", {style:{maxWidth:1200,margin:"0 auto",padding:"12px 20px 0"}, role:"navigation", "aria-label":"Olympics navigation"},
      React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}},
        React.createElement("span", {style:{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}, "COMPS"),
        React.createElement("div", {className:"ol-tab-nav", style:{flex:1}, role:"tablist", "aria-label":"Competition tabs"},
          COMP_TABS.map(function(t) {
            return React.createElement("button", {key:t.key, role:"tab", "aria-selected":activeTab===t.key,
              className:"ol-tab-btn"+(activeTab===t.key?" active":""),
              onClick:function() { navTab(t.key); }}, t.label);
          })
        )
      ),
      React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}},
        React.createElement("span", {style:{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}, "EXPLORE"),
        React.createElement("div", {className:"ol-tab-nav", style:{flex:1}, role:"tablist", "aria-label":"Explore tabs"},
          EXPLORE_TABS.map(function(t) {
            return React.createElement("button", {key:t.key, role:"tab", "aria-selected":activeTab===t.key,
              className:"ol-tab-btn"+(activeTab===t.key?" active":""),
              onClick:function() { navTab(t.key); }}, t.label);
          })
        )
      ),
      React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}},
        React.createElement("span", {style:{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}, "TEAMS"),
        React.createElement("div", {className:"ol-tab-nav", style:{flex:1}, role:"tablist", "aria-label":"Team pages"},
          OL_FOCUS_NATIONS.map(function(t) {
            var code = getCountryCode(t);
            return React.createElement("button", {key:t, role:"tab", "aria-selected":activeTab==="team"&&teamParam===t,
              "aria-label":t+" team page",
              className:"ol-tab-btn"+(activeTab==="team"&&teamParam===t?" active":""),
              onClick:function() { navTab("team", t); },
              style:{padding:"6px 10px"}},
              React.createElement(OLFlag, {code:code, size:12}),
              " ",
              React.createElement("span", {style:{fontSize:10}}, t)
            );
          })
        )
      )
    ),

    // Content
    React.createElement("div", {style:{maxWidth:1200,margin:"0 auto",padding:"0 20px 40px"}, role:"main", "aria-label":"Olympics content"},
      React.createElement(OLErrorBoundary, {key:activeTab+"|"+teamParam},
        renderContent()
      )
    ),

    // Footer
    React.createElement("div", {style:{background:"linear-gradient(180deg, rgba(0,133,199,0.06) 0%, rgba(15,23,42,0.95) 100%)",borderTop:"1px solid rgba(0,133,199,0.1)",padding:"24px 0",textAlign:"center"}},
      React.createElement(OlympicRingsSVG, {size:48}),
      React.createElement("div", {style:{color:"#64748b",fontSize:10,marginTop:8,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase"}},
        "Olympics StatNations \u00b7 Olympic Games Analytics"
      ),
      React.createElement("div", {style:{color:"#334155",fontSize:9,marginTop:4}},
        "Data from 1896 to present \u00b7 " + (summerMedals.length + winterMedals.length).toLocaleString() + " medals"
      )
    )
  );
}

window.OlympicsStatNations = OlympicsStatNations;
window._olympicsReady = true;

export default OlympicsStatNations;
