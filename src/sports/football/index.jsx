import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';
import { WC_DATA } from './wc-data.js';

/* ============================================================
   FOOTBALL STATNATIONS — Complete Analytics Dashboard
   ============================================================ */

// ── Focus Teams & Colors ──
var FOCUS_TEAMS = ["England","France","Germany","Spain","Italy","Brazil","Argentina","Netherlands","Portugal","Belgium","Wales","Scotland","Northern Ireland"];

var FT_COLORS = {
  England:"#CF081F",France:"#0055A4",Germany:"#000000",Spain:"#AA151B",Italy:"#0066CC",
  Brazil:"#009C3B",Argentina:"#75AADB",Netherlands:"#FF6600",Portugal:"#006600",
  Belgium:"#ED2939",Wales:"#D21034",Scotland:"#005EB8","Northern Ireland":"#DA291C",
  Ireland:"#169B62",Croatia:"#0066CC",Japan:"#BC002D",Morocco:"#C1272D",
  "United States":"#3C3B6E",USA:"#3C3B6E",Denmark:"#C60C30",Switzerland:"#FF0000",
  Uruguay:"#5CBEFF",Colombia:"#FFCD00",Poland:"#DC143C",Australia:"#00843D",
  Mexico:"#006847",Sweden:"#006AA7",Turkey:"#E30A17","South Korea":"#003478",
  Chile:"#0039A6",Peru:"#D91023",Serbia:"#C6363C",Austria:"#ED2939",
  Russia:"#D52B1E",Ukraine:"#005BBB",Cameroon:"#007A5E",Nigeria:"#008753",
  Ghana:"#006B3F","South Africa":"#007A4D","Ivory Coast":"#F77F00",
  Senegal:"#009639",Egypt:"#000000",Hungary:"#477050",Romania:"#002B7F",
  "Czech Republic":"#11457E",Greece:"#0D5EAF",Norway:"#EF2B2D",Finland:"#003580",
  Paraguay:"#DA121A",Ecuador:"#FFD100",Bolivia:"#007A33",Venezuela:"#FFB800",
  "Costa Rica":"#002B7F",Honduras:"#0073CF",Panama:"#005EB8",Canada:"#FF0000",
  "Saudi Arabia":"#006C35",Iran:"#239F40",Iraq:"#CE1126",Qatar:"#8A1538",
  China:"#EE1C25",India:"#138808",Tunisia:"#E70013",Algeria:"#006233",
  "New Zealand":"#000000",Iceland:"#003897"
};

var TEAM_NICKNAMES = {
  England:"The Three Lions",France:"Les Bleus",Germany:"Die Mannschaft",Spain:"La Roja",
  Italy:"Gli Azzurri",Brazil:"A Selecao",Argentina:"La Albiceleste",Netherlands:"Oranje",
  Portugal:"A Selecao das Quinas",Belgium:"Red Devils",Wales:"The Dragons",
  Scotland:"The Tartan Army","Northern Ireland":"Green & White Army",
  Ireland:"Boys in Green",Croatia:"The Blazers",Japan:"Samurai Blue",
  Morocco:"Atlas Lions",Uruguay:"La Celeste",Colombia:"Los Cafeteros"
};

// ── Historical Data ──
var WC_WINNERS = [
  {year:1930,host:"Uruguay",winner:"Uruguay",runnerUp:"Argentina"},
  {year:1934,host:"Italy",winner:"Italy",runnerUp:"Czechoslovakia"},
  {year:1938,host:"France",winner:"Italy",runnerUp:"Hungary"},
  {year:1950,host:"Brazil",winner:"Uruguay",runnerUp:"Brazil"},
  {year:1954,host:"Switzerland",winner:"Germany",runnerUp:"Hungary"},
  {year:1958,host:"Sweden",winner:"Brazil",runnerUp:"Sweden"},
  {year:1962,host:"Chile",winner:"Brazil",runnerUp:"Czechoslovakia"},
  {year:1966,host:"England",winner:"England",runnerUp:"Germany"},
  {year:1970,host:"Mexico",winner:"Brazil",runnerUp:"Italy"},
  {year:1974,host:"Germany",winner:"Germany",runnerUp:"Netherlands"},
  {year:1978,host:"Argentina",winner:"Argentina",runnerUp:"Netherlands"},
  {year:1982,host:"Spain",winner:"Italy",runnerUp:"Germany"},
  {year:1986,host:"Mexico",winner:"Argentina",runnerUp:"Germany"},
  {year:1990,host:"Italy",winner:"Germany",runnerUp:"Argentina"},
  {year:1994,host:"United States",winner:"Brazil",runnerUp:"Italy"},
  {year:1998,host:"France",winner:"France",runnerUp:"Brazil"},
  {year:2002,host:"South Korea/Japan",winner:"Brazil",runnerUp:"Germany"},
  {year:2006,host:"Germany",winner:"Italy",runnerUp:"France"},
  {year:2010,host:"South Africa",winner:"Spain",runnerUp:"Netherlands"},
  {year:2014,host:"Brazil",winner:"Germany",runnerUp:"Argentina"},
  {year:2018,host:"Russia",winner:"France",runnerUp:"Croatia"},
  {year:2022,host:"Qatar",winner:"Argentina",runnerUp:"France"}
];

var EURO_WINNERS = [
  {year:1960,winner:"Soviet Union",runnerUp:"Yugoslavia"},
  {year:1964,winner:"Spain",runnerUp:"Soviet Union"},
  {year:1968,winner:"Italy",runnerUp:"Yugoslavia"},
  {year:1972,winner:"Germany",runnerUp:"Soviet Union"},
  {year:1976,winner:"Czechoslovakia",runnerUp:"Germany"},
  {year:1980,winner:"Germany",runnerUp:"Belgium"},
  {year:1984,winner:"France",runnerUp:"Spain"},
  {year:1988,winner:"Netherlands",runnerUp:"Soviet Union"},
  {year:1992,winner:"Denmark",runnerUp:"Germany"},
  {year:1996,winner:"Germany",runnerUp:"Czech Republic"},
  {year:2000,winner:"France",runnerUp:"Italy"},
  {year:2004,winner:"Greece",runnerUp:"Portugal"},
  {year:2008,winner:"Spain",runnerUp:"Germany"},
  {year:2012,winner:"Spain",runnerUp:"Italy"},
  {year:2016,winner:"Portugal",runnerUp:"France"},
  {year:2020,winner:"Italy",runnerUp:"England"},
  {year:2024,winner:"Spain",runnerUp:"England"}
];

var COPA_WINNERS = [
  {year:1916,winner:"Uruguay"},{year:1917,winner:"Uruguay"},{year:1919,winner:"Brazil"},
  {year:1920,winner:"Uruguay"},{year:1921,winner:"Argentina"},{year:1922,winner:"Brazil"},
  {year:1923,winner:"Uruguay"},{year:1924,winner:"Uruguay"},{year:1925,winner:"Argentina"},
  {year:1926,winner:"Uruguay"},{year:1927,winner:"Argentina"},{year:1929,winner:"Argentina"},
  {year:1935,winner:"Uruguay"},{year:1937,winner:"Argentina"},{year:1939,winner:"Peru"},
  {year:1941,winner:"Argentina"},{year:1942,winner:"Uruguay"},{year:1945,winner:"Argentina"},
  {year:1946,winner:"Argentina"},{year:1947,winner:"Argentina"},{year:1949,winner:"Brazil"},
  {year:1953,winner:"Paraguay"},{year:1955,winner:"Argentina"},{year:1956,winner:"Uruguay"},
  {year:1957,winner:"Argentina"},{year:1959,winner:"Argentina"},{year:1963,winner:"Bolivia"},
  {year:1967,winner:"Uruguay"},{year:1975,winner:"Peru"},{year:1979,winner:"Paraguay"},
  {year:1983,winner:"Uruguay"},{year:1987,winner:"Uruguay"},{year:1989,winner:"Brazil"},
  {year:1991,winner:"Argentina"},{year:1993,winner:"Argentina"},{year:1995,winner:"Uruguay"},
  {year:1997,winner:"Brazil"},{year:1999,winner:"Brazil"},{year:2001,winner:"Colombia"},
  {year:2004,winner:"Brazil"},{year:2007,winner:"Brazil"},{year:2011,winner:"Uruguay"},
  {year:2015,winner:"Chile"},{year:2016,winner:"Chile"},{year:2019,winner:"Brazil"},
  {year:2021,winner:"Argentina"},{year:2024,winner:"Argentina"}
];

var TOP_INTL_SCORERS = [
  {player:"Cristiano Ronaldo",country:"Portugal",goals:135,caps:217},
  {player:"Ali Daei",country:"Iran",goals:108,caps:148},
  {player:"Lionel Messi",country:"Argentina",goals:109,caps:191},
  {player:"Sunil Chhetri",country:"India",goals:94,caps:151},
  {player:"Mokhtar Dahari",country:"Malaysia",goals:89,caps:142},
  {player:"Ali Mabkhout",country:"UAE",goals:85,caps:112},
  {player:"Robert Lewandowski",country:"Poland",goals:84,caps:157}
];

var WC_GOLDEN_BOOTS = [
  {year:2022,player:"Kylian Mbappe",country:"France",goals:8},
  {year:2018,player:"Harry Kane",country:"England",goals:6},
  {year:2014,player:"James Rodriguez",country:"Colombia",goals:6},
  {year:2010,player:"Thomas Muller",country:"Germany",goals:5},
  {year:2006,player:"Miroslav Klose",country:"Germany",goals:5},
  {year:2002,player:"Ronaldo",country:"Brazil",goals:8},
  {year:1998,player:"Davor Suker",country:"Croatia",goals:6},
  {year:1994,player:"Oleg Salenko/Hristo Stoichkov",country:"Russia/Bulgaria",goals:6},
  {year:1990,player:"Salvatore Schillaci",country:"Italy",goals:6},
  {year:1986,player:"Gary Lineker",country:"England",goals:6},
  {year:1982,player:"Paolo Rossi",country:"Italy",goals:6},
  {year:1978,player:"Mario Kempes",country:"Argentina",goals:6}
];

// ── Tournament detection ──
function isWorldCup(t) { return t === "World Cup" || t === "FIFA World Cup"; }
function isEuros(t) { return t === "UEFA Euro" || t === "UEFA Euro qualification" || t === "European Championship" || (t && t.startsWith("UEFA Euro")); }
function isEurosFinals(t) { return t === "UEFA Euro" || t === "European Championship"; }
function isCopa(t) { return t === "Copa Am\u00e9rica" || t === "Copa America"; }
function isNationsLeague(t) { return t === "UEFA Nations League" || (t && (t.startsWith("European Nations League") || t.startsWith("UEFA Nations League"))); }
function isBritishChamp(t) { return t === "British Championship"; }

// ── CSS ──
var fbCSS = `
.fb-card{background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:24px;margin-bottom:16px;backdrop-filter:blur(12px);transition:border-color 0.2s ease-out,box-shadow 0.2s ease-out}
.fb-card:hover{border-color:rgba(26,86,219,0.2);box-shadow:0 8px 24px rgba(0,0,0,0.2)}
.fb-card h3{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#f8fafc;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.fb-card h3 .icon{font-size:16px}
.fb-sb{background:rgba(26,86,219,0.06);border:1px solid rgba(26,86,219,0.15);border-radius:12px;padding:16px;text-align:center}
.fb-sb .val{font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:800;color:#f8fafc;line-height:1.1}
.fb-sb .lbl{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
.fb-mt{width:100%;border-collapse:collapse;font-size:13px}
.fb-mt th{padding:8px 6px;text-align:left;color:#94a3b8;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.08);font-size:11px;text-transform:uppercase;letter-spacing:0.06em;font-family:'Barlow Condensed',sans-serif}
.fb-mt td{padding:8px 6px;color:#cbd5e1;border-bottom:1px solid rgba(255,255,255,0.03);font-family:'DM Sans',sans-serif}
.fb-mt tr{transition:background 0.15s ease-out}
.fb-mt tr:hover td{background:rgba(26,86,219,0.05)}
.fb-tab-nav{display:flex;gap:0;flex-wrap:wrap;margin-bottom:4px;background:rgba(15,23,42,0.4);border-radius:12px;padding:4px;border:1px solid rgba(255,255,255,0.04)}
.fb-tab-btn{padding:8px 16px;font-size:12px;font-weight:600;color:rgba(248,250,252,0.55);background:transparent;border:none;cursor:pointer;border-radius:8px;transition:all 0.15s;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap}
.fb-tab-btn:hover{color:rgba(248,250,252,0.7);background:rgba(26,86,219,0.06)}
.fb-tab-btn.active{color:#f8fafc;background:rgba(26,86,219,0.15);box-shadow:0 1px 4px rgba(0,0,0,0.2)}
.fb-search{width:100%;padding:10px 14px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#f8fafc;font-size:13px;font-family:'DM Sans',sans-serif;outline:none}
.fb-search:focus{border-color:rgba(26,86,219,0.4)}
.fb-select{padding:8px 12px;background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#f8fafc;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
.fb-btn{padding:8px 16px;background:rgba(26,86,219,0.15);border:1px solid rgba(26,86,219,0.3);border-radius:8px;color:#93bbfc;font-size:12px;font-weight:600;cursor:pointer;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0.06em;transition:all 0.15s}
.fb-btn:hover{background:rgba(26,86,219,0.25)}
.fb-btn.active{background:rgba(26,86,219,0.3);color:#f8fafc}
.fb-chip{display:inline-block;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace}
.fb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
.fb-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.fb-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.fb-link{color:#93bbfc;cursor:pointer;text-decoration:none;font-weight:600}
.fb-link:hover{text-decoration:underline}
.fb-page-btn{padding:6px 14px;background:rgba(26,86,219,0.1);border:1px solid rgba(26,86,219,0.2);border-radius:6px;color:#93bbfc;font-size:11px;cursor:pointer;font-family:'Barlow Condensed',sans-serif}
.fb-page-btn:hover{background:rgba(26,86,219,0.2)}
.fb-page-btn:disabled{opacity:0.3;cursor:default}
@keyframes fb-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fb-shimmer{height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(26,86,219,0.1) 25%,rgba(26,86,219,0.3) 50%,rgba(26,86,219,0.1) 75%);background-size:200% 100%;animation:fb-shimmer 1.5s ease-in-out infinite;margin-top:16px;max-width:280px;margin-left:auto;margin-right:auto}
@media(max-width:768px){
  .fb-grid{grid-template-columns:repeat(2,1fr)}
  .fb-grid-2{grid-template-columns:1fr}
  .fb-grid-3{grid-template-columns:1fr}
  .fb-tab-btn{padding:6px 10px;font-size:11px}
  .fb-tab-nav{overflow-x:auto;-webkit-overflow-scrolling:touch}
}
@media(prefers-reduced-motion:reduce){
  .fb-shimmer{animation:none!important}
  .fb-tab-btn,.fb-btn,.fb-card{transition:none!important}
}
:focus-visible{outline:2px solid #d4a017;outline-offset:2px;border-radius:4px}
`;

// ── Tooltip style ──
var ttStyle = {background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"};

// ── SVG Flags ──
function FBFlag({team,size=20}) {
  const s = size, h = s*0.667;
  const flags = {
    England: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#CF081F"/><rect y="8" width="30" height="4" fill="#CF081F"/></svg>,
    France: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>,
    Germany: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCC00"/></svg>,
    Spain: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/></svg>,
    Italy: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>,
    Brazil: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#009C3B"/><polygon points="15,2 28,10 15,18 2,10" fill="#FFDF00"/><circle cx="15" cy="10" r="4" fill="#002776"/></svg>,
    Argentina: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#74ACDF"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/></svg>,
    Netherlands: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#AE1C28"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468B"/></svg>,
    Portugal: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#FF0000"/><circle cx="12" cy="10" r="3.5" fill="#FFCC00"/></svg>,
    Belgium: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#FFD700"/><rect x="20" width="10" height="20" fill="#FF0000"/></svg>,
    Wales: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#00AB39"/></svg>,
    Scotland: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#005EB8"/><line x1="0" y1="0" x2="30" y2="20" stroke="#fff" strokeWidth="3"/><line x1="30" y1="0" x2="0" y2="20" stroke="#fff" strokeWidth="3"/></svg>,
    "Northern Ireland": <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#DA291C"/><rect y="8" width="30" height="4" fill="#DA291C"/></svg>,
    Ireland: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="10" height="20" fill="#169B62"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#FF883E"/></svg>,
    Croatia: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#FF0000"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#171796"/></svg>,
    Japan: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#BC002D"/></svg>,
    Morocco: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#C1272D"/><polygon points="15,5 16.5,9.5 21,9.5 17.3,12.2 18.5,17 15,14 11.5,17 12.7,12.2 9,9.5 13.5,9.5" fill="none" stroke="#006233" strokeWidth="1"/></svg>,
    "United States": <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#B22234"/><rect y="1.54" width="30" height="1.54" fill="#fff"/><rect y="4.62" width="30" height="1.54" fill="#fff"/><rect y="7.69" width="30" height="1.54" fill="#fff"/><rect y="10.77" width="30" height="1.54" fill="#fff"/><rect y="13.85" width="30" height="1.54" fill="#fff"/><rect y="16.92" width="30" height="1.54" fill="#fff"/><rect width="12" height="10.77" fill="#3C3B6E"/></svg>,
    Denmark: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#C60C30"/><rect x="8" width="4" height="20" fill="#fff"/><rect y="8" width="30" height="4" fill="#fff"/></svg>,
    Switzerland: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#FF0000"/><rect x="12.5" y="5" width="5" height="10" fill="#fff"/><rect x="10" y="7.5" width="10" height="5" fill="#fff"/></svg>,
    Uruguay: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="0" width="30" height="2.22" fill="#0038A8"/><rect y="4.44" width="30" height="2.22" fill="#0038A8"/><rect y="8.88" width="30" height="2.22" fill="#0038A8"/><rect y="13.33" width="30" height="2.22" fill="#0038A8"/><rect y="17.78" width="30" height="2.22" fill="#0038A8"/><rect width="10" height="10" fill="#fff"/><circle cx="5" cy="5" r="3" fill="#FFD700"/></svg>,
    Colombia: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="10" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/></svg>,
    Poland: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#DC143C"/></svg>,
    Australia: <svg width={s} height={h} viewBox="0 0 30 20"><rect width="30" height="20" fill="#00008B"/><rect width="10" height="10" fill="#00008B"/><line x1="0" y1="0" x2="10" y2="10" stroke="#fff" strokeWidth="1.5"/><line x1="10" y1="0" x2="0" y2="10" stroke="#fff" strokeWidth="1.5"/><rect x="4" width="2" height="10" fill="#fff"/><rect y="4" width="10" height="2" fill="#fff"/><rect x="4.3" width="1.4" height="10" fill="#CF081F"/><rect y="4.3" width="10" height="1.4" fill="#CF081F"/></svg>
  };
  if (flags[team]) return <span style={{display:"inline-flex",borderRadius:3,overflow:"hidden",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}>{flags[team]}</span>;
  const c = FT_COLORS[team] || "#94a3b8";
  const code = team ? team.substring(0,3).toUpperCase() : "???";
  return <svg width={s} height={h} style={{borderRadius:3,flexShrink:0}}><rect width={s} height={h} fill={c} rx="2"/><text x={s/2} y={h/2+1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={s*0.28} fontWeight="700" fontFamily="'Barlow Condensed',sans-serif">{code}</text></svg>;
}

function FBFlagBadge({team,size=28}) {
  return <div style={{display:"inline-flex",padding:3,background:"rgba(255,255,255,0.06)",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)"}}><FBFlag team={team} size={size}/></div>;
}

function FBTeamLabel({team,size=16,onClick}) {
  const isFocus = FOCUS_TEAMS.includes(team);
  const handleClick = () => {
    if(isFocus && onClick) onClick();
    else if(isFocus) _fbNavToTab("team",team);
  };
  return <span onClick={handleClick} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:isFocus?"pointer":"default",color:"#e2e8f0",fontWeight:600,fontSize:size*0.8,fontFamily:"'DM Sans',sans-serif",borderRadius:4,padding:"1px 3px",transition:"background 0.15s"}} onMouseOver={isFocus?function(e){e.currentTarget.style.background="rgba(255,255,255,0.06)";}:undefined} onMouseOut={isFocus?function(e){e.currentTarget.style.background="transparent";}:undefined}>
    <FBFlagBadge team={team} size={size}/>
    <span>{team}</span>
  </span>;
}

function _fbNavToTab(tab, team) {
  if(team) window.location.hash = "#/football/" + tab + "/" + encodeURIComponent(team);
  else window.location.hash = "#/football/" + tab;
}

// ── UI Primitives ──
function FBCard({title,icon,children,style={}}) {
  return <div className="fb-card" style={style}>
    {title && <h3><span className="icon">{icon}</span>{title}</h3>}
    {children}
  </div>;
}

function FBSB({value,label,color}) {
  return <div className="fb-sb" style={color?{borderColor:color+"33",background:color+"0a"}:{}}>
    <div className="val" style={color?{color}:{}}>{value}</div>
    <div className="lbl">{label}</div>
  </div>;
}

function FBMT({headers,rows,alignRight=[]}) {
  return <table className="fb-mt">
    <thead><tr>{headers.map((h,i)=><th key={i} style={alignRight.includes(i)?{textAlign:"right"}:{}}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r,ri)=><tr key={ri}>{r.map((c,ci)=><td key={ci} style={alignRight.includes(ci)?{textAlign:"right"}:{}}>{c}</td>)}</tr>)}</tbody>
  </table>;
}

// ── Helpers ──
function fbGetTeamColor(team) { return FT_COLORS[team] || "#94a3b8"; }
function fbWinPct(w,total) { return total===0 ? 0 : Math.round(w/total*100); }

function computeTeamStats(matches, team) {
  var w=0,d=0,l=0,gf=0,ga=0;
  matches.forEach(function(m) {
    var isHome = m.home_team===team;
    var isAway = m.away_team===team;
    if(!isHome && !isAway) return;
    var scored = isHome ? m.home_score : m.away_score;
    var conceded = isHome ? m.away_score : m.home_score;
    gf+=scored; ga+=conceded;
    if(scored>conceded) w++;
    else if(scored===conceded) d++;
    else l++;
  });
  return {played:w+d+l,w:w,d:d,l:l,gf:gf,ga:ga,gd:gf-ga};
}

function getH2HMatches(matches, t1, t2) {
  return matches.filter(function(m) { return (m.home_team===t1 && m.away_team===t2) || (m.home_team===t2 && m.away_team===t1); });
}

function getTeamMatches(matches, team) {
  return matches.filter(function(m) { return m.home_team===team || m.away_team===team; });
}

function getMatchScoreForTeam(m, team) {
  var isHome = m.home_team===team;
  return { scored: isHome?m.home_score:m.away_score, conceded: isHome?m.away_score:m.home_score };
}

function getOpponent(m, team) {
  return m.home_team===team ? m.away_team : m.home_team;
}

// ── UFWC Computation ──
function computeUFWC(matches) {
  if(!matches.length) return {holder:null,history:[]};
  var holder = "Scotland"; // Scotland starts as holder from first match 1872-11-30
  var history = [];
  matches.forEach(function(m) {
    var homeIsHolder = m.home_team===holder;
    var awayIsHolder = m.away_team===holder;
    if(!homeIsHolder && !awayIsHolder) return;
    var challenger = homeIsHolder ? m.away_team : m.home_team;
    var holderScored = homeIsHolder ? m.home_score : m.away_score;
    var challengerScored = homeIsHolder ? m.away_score : m.home_score;
    var retained = holderScored >= challengerScored; // draw = retained
    history.push({date:m.date,holder:holder,challenger:challenger,holderScore:holderScored,challengerScore:challengerScored,tournament:m.tournament,retained:retained});
    if(!retained) holder = challenger;
  });
  return {holder:holder,history:history};
}

// ── Tab: FBOverview ──
function FBOverview({matches,ufwc}) {
  const stats = useMemo(function(){
    var total = matches.length;
    var totalGoals = matches.reduce(function(s,m){return s+m.home_score+m.away_score;},0);
    var avgGoals = total ? (totalGoals/total).toFixed(2) : 0;
    var homeWins = matches.filter(function(m){return m.home_score>m.away_score;}).length;
    var draws = matches.filter(function(m){return m.home_score===m.away_score;}).length;
    var teams = new Set();
    matches.forEach(function(m){teams.add(m.home_team);teams.add(m.away_team);});
    var tournaments = new Set(matches.map(function(m){return m.tournament;})).size;
    var wcMatches = matches.filter(function(m){return isWorldCup(m.tournament);}).length;

    // WC wins count
    var wcWinCounts = {};
    WC_WINNERS.forEach(function(w){ wcWinCounts[w.winner]=(wcWinCounts[w.winner]||0)+1; });
    var wcWinData = Object.entries(wcWinCounts).map(function(e){return {team:e[0],wins:e[1],fill:fbGetTeamColor(e[0])};}).sort(function(a,b){return b.wins-a.wins;});

    // Goals by decade
    var decades = {};
    matches.forEach(function(m){
      var yr = parseInt(m.date.substring(0,4));
      var dec = Math.floor(yr/10)*10+"s";
      if(!decades[dec]) decades[dec]={decade:dec,goals:0,matches:0};
      decades[dec].goals+=m.home_score+m.away_score;
      decades[dec].matches++;
    });
    var decadeData = Object.values(decades).sort(function(a,b){return a.decade.localeCompare(b.decade);});
    decadeData.forEach(function(d){ d.avg = d.matches ? +(d.goals/d.matches).toFixed(2) : 0; });

    var recent = matches.slice(-20).reverse();

    return {total:total,totalGoals:totalGoals,avgGoals:avgGoals,homeWins:homeWins,draws:draws,teams:teams.size,tournaments:tournaments,wcMatches:wcMatches,wcWinData:wcWinData,decadeData:decadeData,recent:recent};
  },[matches]);

  return <div>
    <div className="fb-grid" style={{marginBottom:16}}>
      <FBSB value={stats.total.toLocaleString()} label="Total Matches"/>
      <FBSB value={stats.totalGoals.toLocaleString()} label="Total Goals"/>
      <FBSB value={stats.avgGoals} label="Avg Goals/Match"/>
      <FBSB value={stats.teams} label="Nations"/>
      <FBSB value={stats.tournaments} label="Tournaments"/>
      <FBSB value={stats.wcMatches.toLocaleString()} label="World Cup Matches"/>
    </div>

    <div className="fb-grid-2">
      <FBCard title="World Cup Wins" icon={"\uD83C\uDFC6"}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.wcWinData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
            <YAxis type="category" dataKey="team" width={80} tick={{fill:"#cbd5e1",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="wins" name="Wins" radius={[0,6,6,0]}>
              {stats.wcWinData.map(function(e,i){return <Cell key={i} fill={e.fill}/>;} )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </FBCard>
      <FBCard title="Goals per Decade" icon={"\u26BD"}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Area type="monotone" dataKey="goals" name="Total Goals" stroke="#1a56db" fill="rgba(26,86,219,0.15)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </FBCard>
    </div>

    <div className="fb-grid-3" style={{marginTop:8}}>
      <FBCard title="Quick Links" icon={"\uD83D\uDD17"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["worldcup","World Cup History"],["euros","European Championship"],["copa","Copa Am\u00e9rica"],["ufwc","UFWC Title"],["h2h","Head to Head"],["records","Records"]].map(function(item){
            return <span key={item[0]} className="fb-link" onClick={function(){_fbNavToTab(item[0]);}}>{item[1]}</span>;
          })}
        </div>
      </FBCard>
      <FBCard title="UFWC Current Holder" icon={"\uD83D\uDC51"}>
        <div style={{textAlign:"center",padding:12}}>
          <FBFlagBadge team={ufwc.holder} size={48}/>
          <div style={{marginTop:8,fontSize:20,fontWeight:800,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif"}}>{ufwc.holder}</div>
          <div style={{color:"#94a3b8",fontSize:11,marginTop:4}}>Unofficial Football World Champion</div>
        </div>
      </FBCard>
      <FBCard title="Recent Results" icon={"\uD83D\uDCCB"}>
        <div style={{maxHeight:220,overflowY:"auto"}}>
          {stats.recent.map(function(m,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:11}}>
            <span style={{color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",fontSize:10,width:72,flexShrink:0}}>{m.date}</span>
            <span style={{flex:1,textAlign:"center",color:"#cbd5e1"}}><FBTeamLabel team={m.home_team} size={12}/> <span style={{fontWeight:700,color:"#f8fafc",fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span> <FBTeamLabel team={m.away_team} size={12}/></span>
          </div>;})}
        </div>
      </FBCard>
    </div>
  </div>;
}

// ── WC Group Stage ──
function WCGroupStage({groups, yearMatches, year}) {
  var ptsForWin = year >= 1994 ? 3 : 2;
  return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12,marginBottom:12}}>
    {Object.entries(groups).map(function([groupName,teams]){
      var st = {};
      teams.forEach(function(t){st[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};});
      yearMatches.forEach(function(m){
        var h=m.home_team, a=m.away_team;
        if(!st[h]||!st[a]) return;
        st[h].p++; st[h].gf+=m.home_score; st[h].ga+=m.away_score;
        st[a].p++; st[a].gf+=m.away_score; st[a].ga+=m.home_score;
        if(m.home_score>m.away_score){st[h].w++;st[a].l++;}
        else if(m.home_score<m.away_score){st[h].l++;st[a].w++;}
        else{st[h].d++;st[a].d++;}
      });
      var rows = Object.values(st).sort(function(a,b){
        var pa=a.w*ptsForWin+a.d, pb=b.w*ptsForWin+b.d;
        return pb-pa || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf;
      });
      return <div key={groupName} className="fb-card" style={{padding:"10px 12px"}}>
        <div style={{fontWeight:700,color:"#d4a017",fontSize:12,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{groupName}</div>
        <table className="fb-mt" style={{width:"100%"}}>
          <thead><tr>
            <th style={{textAlign:"left",fontWeight:600,color:"#94a3b8",fontSize:10}}>Team</th>
            {["P","W","D","L","GD","Pts"].map(function(h){return <th key={h} style={{textAlign:"right",fontWeight:600,color:"#94a3b8",fontSize:10}}>{h}</th>;})}
          </tr></thead>
          <tbody>{rows.map(function(t,i){
            var pts=t.w*ptsForWin+t.d, gd=t.gf-t.ga;
            return <tr key={t.team} style={{background:i<2?"rgba(61,220,132,0.04)":"transparent"}}>
              <td style={{fontSize:11}}><FBTeamLabel team={t.team} size={11}/></td>
              <td style={{textAlign:"right",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>{t.p}</td>
              <td style={{textAlign:"right",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>{t.w}</td>
              <td style={{textAlign:"right",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>{t.d}</td>
              <td style={{textAlign:"right",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>{t.l}</td>
              <td style={{textAlign:"right",fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:gd>0?"#3ddc84":gd<0?"#ef4444":"#94a3b8"}}>{gd>0?"+":""}{gd}</td>
              <td style={{textAlign:"right",fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#f8fafc"}}>{pts}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>;
    })}
  </div>;
}

// ── WC Knockout Stage ──
function WCKnockout({knockout}) {
  var rounds={}, roundOrder=[];
  knockout.forEach(function(m){
    if(!rounds[m.round]){rounds[m.round]=[];roundOrder.push(m.round);}
    rounds[m.round].push(m);
  });
  return <div className="fb-card" style={{marginBottom:12}}>
    <h3><span className="icon">🏆</span>Knockout Stage</h3>
    {roundOrder.map(function(round){
      return <div key={round} style={{marginBottom:14}}>
        <div style={{fontWeight:700,color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,paddingBottom:4,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{round}</div>
        {rounds[round].map(function(m,i){
          var hw=m.hs>m.as, aw=m.as>m.hs;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
            <span style={{flex:1,textAlign:"right",fontSize:12,fontWeight:hw?700:400,color:hw?"#f8fafc":"#94a3b8"}}><FBTeamLabel team={m.home} size={12}/></span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,minWidth:44,textAlign:"center",color:"#cbd5e1"}}>{m.hs}–{m.as}</span>
            <span style={{flex:1,fontSize:12,fontWeight:aw?700:400,color:aw?"#f8fafc":"#94a3b8"}}><FBTeamLabel team={m.away} size={12}/></span>
            {m.note&&<span style={{color:"#475569",fontSize:10,minWidth:90,textAlign:"right",fontStyle:"italic"}}>{m.note}</span>}
          </div>;
        })}
      </div>;
    })}
  </div>;
}

// ── Tab: TournamentTab (reusable) ──
function TournamentTab({matches,tournamentFilter,winners,title,icon,wcData}) {
  const [selYear,setSelYear] = useState(null);
  const tMatches = useMemo(function(){return matches.filter(function(m){return tournamentFilter(m.tournament);});},[matches,tournamentFilter]);
  const years = useMemo(function(){return [...new Set(tMatches.map(function(m){return parseInt(m.date.substring(0,4));}))].sort(function(a,b){return b-a;});},[tMatches]);
  const yearMatches = useMemo(function(){return selYear ? tMatches.filter(function(m){return m.date.startsWith(String(selYear));}) : [];},[selYear,tMatches]);

  const allTimeTable = useMemo(function(){
    var teams = {};
    tMatches.forEach(function(m){
      [m.home_team,m.away_team].forEach(function(t){
        if(!teams[t]) teams[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};
        var isHome = t===m.home_team;
        var sc = isHome?m.home_score:m.away_score;
        var cc = isHome?m.away_score:m.home_score;
        teams[t].p++; teams[t].gf+=sc; teams[t].ga+=cc;
        if(sc>cc) teams[t].w++;
        else if(sc===cc) teams[t].d++;
        else teams[t].l++;
      });
    });
    return Object.values(teams).sort(function(a,b){return (b.w*3+b.d)-(a.w*3+a.d) || (b.gf-b.ga)-(a.gf-a.ga);}).slice(0,30);
  },[tMatches]);

  const yearStandings = useMemo(function(){
    if(!selYear) return [];
    var teams = {};
    yearMatches.forEach(function(m){
      [m.home_team,m.away_team].forEach(function(t){
        if(!teams[t]) teams[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};
        var isHome = t===m.home_team;
        var sc = isHome?m.home_score:m.away_score;
        var cc = isHome?m.away_score:m.home_score;
        teams[t].p++; teams[t].gf+=sc; teams[t].ga+=cc;
        if(sc>cc) teams[t].w++;
        else if(sc===cc) teams[t].d++;
        else teams[t].l++;
      });
    });
    return Object.values(teams).sort(function(a,b){return (b.w*3+b.d)-(a.w*3+a.d) || (b.gf-b.ga)-(a.gf-a.ga);});
  },[selYear,yearMatches]);

  var winnerEntry = selYear && winners ? winners.find(function(w){return w.year===selYear;}) : null;

  return <div>
    {winners && winners.length > 0 && <FBCard title={title + " Winners"} icon={icon}>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
        {winners.map(function(w,i){return <div key={i} onClick={function(){setSelYear(w.year);}} style={{cursor:"pointer",padding:"6px 12px",borderRadius:8,background:selYear===w.year?"rgba(26,86,219,0.2)":"rgba(255,255,255,0.03)",border:"1px solid "+(selYear===w.year?"rgba(26,86,219,0.4)":"rgba(255,255,255,0.06)"),fontSize:11,textAlign:"center",minWidth:64,transition:"all 0.15s"}}>
          <div style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{w.year}</div>
          <div style={{color:"#cbd5e1",fontSize:10,marginTop:2}}><FBFlag team={w.winner} size={12}/> {w.winner}</div>
        </div>;})}
      </div>
    </FBCard>}

    <FBCard title="Select Year" icon={"\uD83D\uDCC5"}>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {years.map(function(y){return <button key={y} className={"fb-page-btn"+(selYear===y?" active":"")} style={selYear===y?{background:"rgba(26,86,219,0.25)",color:"#f8fafc"}:{}} onClick={function(){setSelYear(y);}}>{y}</button>;})}
      </div>
    </FBCard>

    {selYear && <div>
      {winnerEntry && <FBCard title={selYear + " " + title} icon={"\uD83C\uDFC6"}>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:8}}>
          <FBFlagBadge team={winnerEntry.winner} size={40}/>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif"}}>{winnerEntry.winner}</div>
            {winnerEntry.runnerUp && <div style={{color:"#94a3b8",fontSize:12}}>Runner-up: {winnerEntry.runnerUp}</div>}
            {winnerEntry.host && <div style={{color:"#64748b",fontSize:11}}>Host: {winnerEntry.host}</div>}
          </div>
        </div>
      </FBCard>}

      {wcData && wcData[selYear] && wcData[selYear].groups && <div>
        <h3 style={{color:"#94a3b8",fontSize:13,fontWeight:700,margin:"12px 0 8px",textTransform:"uppercase",letterSpacing:"0.06em"}}>📋 Group Stage</h3>
        <WCGroupStage groups={wcData[selYear].groups} yearMatches={yearMatches} year={selYear}/>
      </div>}

      {wcData && wcData[selYear] && wcData[selYear].knockout && wcData[selYear].knockout.length > 0 &&
        <WCKnockout knockout={wcData[selYear].knockout}/>}

      <FBCard title={selYear + " All Matches"} icon={"\u26BD"}>
        <div style={{maxHeight:400,overflowY:"auto"}}>
          <FBMT headers={["Date","Home","Score","Away","Tournament"]} alignRight={[2]}
            rows={yearMatches.map(function(m){return [
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
              <FBTeamLabel team={m.home_team} size={13}/>,
              <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
              <FBTeamLabel team={m.away_team} size={13}/>,
              <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
            ];})}/>
        </div>
      </FBCard>

      {yearStandings.length>0 && <FBCard title={selYear + " Standings"} icon={"\uD83D\uDCCA"}>
        <FBMT headers={["#","Team","P","W","D","L","GF","GA","GD","Pts"]} alignRight={[2,3,4,5,6,7,8,9]}
          rows={yearStandings.map(function(t,i){return [
            i+1,
            <FBTeamLabel team={t.team} size={13}/>,
            t.p,t.w,t.d,t.l,t.gf,t.ga,
            <span style={{color:t.gf-t.ga>0?"#3ddc84":t.gf-t.ga<0?"#ef4444":"#94a3b8"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</span>,
            <span style={{fontWeight:700,color:"#d4a017"}}>{t.w*3+t.d}</span>
          ];})}/>
      </FBCard>}
    </div>}

    <FBCard title={"All-Time " + title + " Table (Top 30)"} icon={"\uD83C\uDFC5"}>
      <FBMT headers={["#","Team","P","W","D","L","GF","GA","GD","Pts"]} alignRight={[2,3,4,5,6,7,8,9]}
        rows={allTimeTable.map(function(t,i){return [
          i+1,
          <FBTeamLabel team={t.team} size={13}/>,
          t.p,t.w,t.d,t.l,t.gf,t.ga,
          <span style={{color:t.gf-t.ga>0?"#3ddc84":t.gf-t.ga<0?"#ef4444":"#94a3b8"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</span>,
          <span style={{fontWeight:700,color:"#d4a017"}}>{t.w*3+t.d}</span>
        ];})}/>
    </FBCard>
  </div>;
}

// ── Tab: FBBritishChamp ──
function FBBritishChamp({matches}) {
  const [selYear,setSelYear] = useState(null);
  const bhcMatches = useMemo(function(){return matches.filter(function(m){return isBritishChamp(m.tournament);});},[matches]);
  const years = useMemo(function(){return [...new Set(bhcMatches.map(function(m){return parseInt(m.date.substring(0,4));}))].sort(function(a,b){return b-a;});},[bhcMatches]);
  const yearMatches = useMemo(function(){return selYear?bhcMatches.filter(function(m){return m.date.startsWith(String(selYear));}):[];},[selYear,bhcMatches]);

  const yearStandings = useMemo(function(){
    if(!selYear) return [];
    var teams = {};
    yearMatches.forEach(function(m){
      [m.home_team,m.away_team].forEach(function(t){
        if(!teams[t]) teams[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};
        var isHome = t===m.home_team;
        var sc = isHome?m.home_score:m.away_score;
        var cc = isHome?m.away_score:m.home_score;
        teams[t].p++; teams[t].gf+=sc; teams[t].ga+=cc;
        if(sc>cc) teams[t].w++;
        else if(sc===cc) teams[t].d++;
        else teams[t].l++;
      });
    });
    return Object.values(teams).sort(function(a,b){return (b.w*3+b.d)-(a.w*3+a.d) || (b.gf-b.ga)-(a.gf-a.ga);});
  },[selYear,yearMatches]);

  const titlesByNation = useMemo(function(){
    var titles = {};
    years.forEach(function(y){
      var ym = bhcMatches.filter(function(m){return m.date.startsWith(String(y));});
      var teams = {};
      ym.forEach(function(m){
        [m.home_team,m.away_team].forEach(function(t){
          if(!teams[t]) teams[t]={w:0,d:0,l:0};
          var isHome = t===m.home_team;
          var sc = isHome?m.home_score:m.away_score;
          var cc = isHome?m.away_score:m.home_score;
          if(sc>cc) teams[t].w++;
          else if(sc===cc) teams[t].d++;
          else teams[t].l++;
        });
      });
      var sorted = Object.entries(teams).sort(function(a,b){return (b[1].w*3+b[1].d)-(a[1].w*3+a[1].d);});
      if(sorted.length>0) {
        var winner = sorted[0][0];
        titles[winner]=(titles[winner]||0)+1;
      }
    });
    return Object.entries(titles).map(function(e){return {team:e[0],titles:e[1],fill:fbGetTeamColor(e[0])};}).sort(function(a,b){return b.titles-a.titles;});
  },[years,bhcMatches]);

  const allTimeTable = useMemo(function(){
    var teams = {};
    bhcMatches.forEach(function(m){
      [m.home_team,m.away_team].forEach(function(t){
        if(!teams[t]) teams[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};
        var isHome = t===m.home_team;
        var sc = isHome?m.home_score:m.away_score;
        var cc = isHome?m.away_score:m.home_score;
        teams[t].p++; teams[t].gf+=sc; teams[t].ga+=cc;
        if(sc>cc) teams[t].w++;
        else if(sc===cc) teams[t].d++;
        else teams[t].l++;
      });
    });
    return Object.values(teams).sort(function(a,b){return (b.w*3+b.d)-(a.w*3+a.d);});
  },[bhcMatches]);

  return <div>
    <FBCard title="British Home Championship Titles" icon={"\uD83C\uDFC6"}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={titlesByNation}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
          <XAxis dataKey="team" tick={{fill:"#cbd5e1",fontSize:11}}/>
          <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Bar dataKey="titles" name="Titles" radius={[6,6,0,0]}>
            {titlesByNation.map(function(e,i){return <Cell key={i} fill={e.fill}/>;})}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </FBCard>

    <FBCard title="Select Year" icon={"\uD83D\uDCC5"}>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {years.map(function(y){return <button key={y} className={"fb-page-btn"+(selYear===y?" active":"")} style={selYear===y?{background:"rgba(26,86,219,0.25)",color:"#f8fafc"}:{}} onClick={function(){setSelYear(y);}}>{y}</button>;})}
      </div>
    </FBCard>

    {selYear && <div>
      {yearStandings.length>0 && <FBCard title={selYear + " Standings"} icon={"\uD83D\uDCCA"}>
        <FBMT headers={["#","Team","P","W","D","L","GF","GA","GD","Pts"]} alignRight={[2,3,4,5,6,7,8,9]}
          rows={yearStandings.map(function(t,i){return [
            i+1,<FBTeamLabel team={t.team} size={13}/>,t.p,t.w,t.d,t.l,t.gf,t.ga,
            <span style={{color:t.gf-t.ga>0?"#3ddc84":t.gf-t.ga<0?"#ef4444":"#94a3b8"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</span>,
            <span style={{fontWeight:700,color:"#d4a017"}}>{t.w*3+t.d}</span>
          ];})}/>
      </FBCard>}
      <FBCard title={selYear + " Results"} icon={"\u26BD"}>
        <FBMT headers={["Date","Home","Score","Away"]} alignRight={[2]}
          rows={yearMatches.map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.home_team} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
            <FBTeamLabel team={m.away_team} size={13}/>
          ];})}/>
      </FBCard>
    </div>}

    <FBCard title="All-Time Table" icon={"\uD83C\uDFC5"}>
      <FBMT headers={["#","Team","P","W","D","L","GF","GA","GD","Pts"]} alignRight={[2,3,4,5,6,7,8,9]}
        rows={allTimeTable.map(function(t,i){return [
          i+1,<FBTeamLabel team={t.team} size={13}/>,t.p,t.w,t.d,t.l,t.gf,t.ga,
          <span style={{color:t.gf-t.ga>0?"#3ddc84":t.gf-t.ga<0?"#ef4444":"#94a3b8"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</span>,
          <span style={{fontWeight:700,color:"#d4a017"}}>{t.w*3+t.d}</span>
        ];})}/>
    </FBCard>
  </div>;
}

// ── Tab: FBUFWCTab ──
function FBUFWCTab({ufwc}) {
  const [page,setPage] = useState(0);
  var PER_PAGE = 50;
  const reversed = useMemo(function(){return ufwc.history.slice().reverse();},[ufwc.history]);
  var totalPages = Math.ceil(reversed.length/PER_PAGE);
  var pageData = reversed.slice(page*PER_PAGE,(page+1)*PER_PAGE);

  const holderCounts = useMemo(function(){
    var held = {};
    var cur = "Scotland";
    ufwc.history.forEach(function(h){
      held[cur]=(held[cur]||0)+1;
      if(!h.retained) cur=h.challenger;
    });
    return Object.entries(held).map(function(e){return {team:e[0],times:e[1],fill:fbGetTeamColor(e[0])};}).sort(function(a,b){return b.times-a.times;}).slice(0,20);
  },[ufwc.history]);

  const holderRecords = useMemo(function(){
    var streaks = [];
    var cur = "Scotland", count = 0, start = null;
    ufwc.history.forEach(function(h){
      if(!start) start = h.date;
      count++;
      if(!h.retained) {
        streaks.push({team:cur,matches:count,from:start,to:h.date});
        cur = h.challenger; count = 0; start = null;
      }
    });
    if(count>0) streaks.push({team:cur,matches:count,from:start,to:"present"});
    return streaks.sort(function(a,b){return b.matches-a.matches;}).slice(0,15);
  },[ufwc.history]);

  return <div>
    <FBCard title="Current UFWC Holder" icon={"\uD83D\uDC51"}>
      <div style={{display:"flex",alignItems:"center",gap:20,padding:12}}>
        <FBFlagBadge team={ufwc.holder} size={56}/>
        <div>
          <div style={{fontSize:24,fontWeight:800,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif"}}>{ufwc.holder}</div>
          <div style={{color:"#94a3b8",fontSize:12}}>Unofficial Football World Champion</div>
          <div style={{color:"#64748b",fontSize:11,marginTop:4}}>Title defences tracked: {ufwc.history.length.toLocaleString()}</div>
        </div>
      </div>
    </FBCard>

    <FBCard title="Title Matches" icon={"\u26BD"}>
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
        <button className="fb-page-btn" disabled={page===0} onClick={function(){setPage(function(p){return p-1;});}}>Prev</button>
        <span style={{color:"#94a3b8",fontSize:11}}>Page {page+1} of {totalPages}</span>
        <button className="fb-page-btn" disabled={page>=totalPages-1} onClick={function(){setPage(function(p){return p+1;});}}>Next</button>
      </div>
      <div style={{maxHeight:500,overflowY:"auto"}}>
        <FBMT headers={["Date","Holder","Score","Challenger","Result","Tourn."]} alignRight={[2]}
          rows={pageData.map(function(h){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{h.date}</span>,
            <FBTeamLabel team={h.holder} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h.holderScore}-{h.challengerScore}</span>,
            <FBTeamLabel team={h.challenger} size={13}/>,
            <span className="fb-chip" style={{background:h.retained?"rgba(59,130,246,0.1)":"rgba(239,68,68,0.1)",color:h.retained?"#60a5fa":"#ef4444"}}>{h.retained?"Retained":"Lost"}</span>,
            <span style={{color:"#94a3b8",fontSize:10}}>{h.tournament}</span>
          ];})}/>
      </div>
    </FBCard>

    <FBCard title="Most Times Holder (Top 20)" icon={"\uD83D\uDCCA"}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={holderCounts} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
          <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
          <YAxis type="category" dataKey="team" width={100} tick={{fill:"#cbd5e1",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Bar dataKey="times" name="Title Matches" radius={[0,6,6,0]}>
            {holderCounts.map(function(e,i){return <Cell key={i} fill={e.fill}/>;})}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </FBCard>

    <FBCard title="Longest Holder Streaks" icon={"\uD83D\uDD25"}>
      <FBMT headers={["#","Team","Matches","From","To"]} alignRight={[2]}
        rows={holderRecords.map(function(r,i){return [
          i+1,
          <FBTeamLabel team={r.team} size={13}/>,
          <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{r.matches}</span>,
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{r.from}</span>,
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{r.to}</span>
        ];})}/>
    </FBCard>
  </div>;
}

// ── Tab: FBHeadToHead ──
function FBHeadToHead({matches}) {
  const allTeams = useMemo(function(){
    var s = new Set();
    matches.forEach(function(m){s.add(m.home_team);s.add(m.away_team);});
    return [...s].sort();
  },[matches]);

  const [team1,setTeam1] = useState("England");
  const [team2,setTeam2] = useState("Germany");

  const h2h = useMemo(function(){
    var ms = getH2HMatches(matches,team1,team2);
    var t1w=0,t2w=0,dr=0,t1g=0,t2g=0;
    ms.forEach(function(m){
      var r = getMatchScoreForTeam(m,team1);
      t1g+=r.scored; t2g+=r.conceded;
      if(r.scored>r.conceded) t1w++;
      else if(r.scored<r.conceded) t2w++;
      else dr++;
    });

    var byComp = {};
    ms.forEach(function(m){
      var comp = m.tournament;
      if(!byComp[comp]) byComp[comp]={comp:comp,p:0,t1w:0,t2w:0,d:0};
      byComp[comp].p++;
      var r = getMatchScoreForTeam(m,team1);
      if(r.scored>r.conceded) byComp[comp].t1w++;
      else if(r.scored<r.conceded) byComp[comp].t2w++;
      else byComp[comp].d++;
    });

    var pieData = [
      {name:team1+" Wins",value:t1w,fill:fbGetTeamColor(team1)},
      {name:"Draws",value:dr,fill:"#94a3b8"},
      {name:team2+" Wins",value:t2w,fill:fbGetTeamColor(team2)}
    ].filter(function(d){return d.value>0;});

    return {matches:ms,t1w:t1w,t2w:t2w,dr:dr,t1g:t1g,t2g:t2g,total:ms.length,byComp:Object.values(byComp).sort(function(a,b){return b.p-a.p;}),pieData:pieData};
  },[matches,team1,team2]);

  return <div>
    <FBCard title="Head to Head" icon={"\u2694\uFE0F"}>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <FBFlagBadge team={team1} size={32}/>
          <select className="fb-select" value={team1} onChange={function(e){setTeam1(e.target.value);}}>
            {allTeams.map(function(t){return <option key={t} value={t}>{t}</option>;})}
          </select>
        </div>
        <span style={{color:"#d4a017",fontWeight:800,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif"}}>VS</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <select className="fb-select" value={team2} onChange={function(e){setTeam2(e.target.value);}}>
            {allTeams.map(function(t){return <option key={t} value={t}>{t}</option>;})}
          </select>
          <FBFlagBadge team={team2} size={32}/>
        </div>
      </div>

      <div className="fb-grid" style={{marginBottom:16}}>
        <FBSB value={h2h.total} label="Matches" color="#1a56db"/>
        <FBSB value={h2h.t1w} label={team1+" Wins"} color={fbGetTeamColor(team1)}/>
        <FBSB value={h2h.dr} label="Draws" color="#94a3b8"/>
        <FBSB value={h2h.t2w} label={team2+" Wins"} color={fbGetTeamColor(team2)}/>
        <FBSB value={h2h.t1g} label={team1+" Goals"} color={fbGetTeamColor(team1)}/>
        <FBSB value={h2h.t2g} label={team2+" Goals"} color={fbGetTeamColor(team2)}/>
      </div>

      {h2h.pieData.length>0 && <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <ResponsiveContainer width={280} height={200}>
          <PieChart>
            <Pie data={h2h.pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={function(entry){return entry.name+": "+entry.value;}} labelLine={false}>
              {h2h.pieData.map(function(e,i){return <Cell key={i} fill={e.fill}/>;})}
            </Pie>
            <Tooltip contentStyle={ttStyle}/>
          </PieChart>
        </ResponsiveContainer>
      </div>}
    </FBCard>

    {h2h.byComp.length>0 && <FBCard title="By Competition" icon={"\uD83C\uDFC6"}>
      <FBMT headers={["Tournament","P",team1+" W","D",team2+" W"]} alignRight={[1,2,3,4]}
        rows={h2h.byComp.map(function(c){return [c.comp,c.p,c.t1w,c.d,c.t2w];})}/>
    </FBCard>}

    <FBCard title="All Matches" icon={"\uD83D\uDCCB"}>
      <div style={{maxHeight:500,overflowY:"auto"}}>
        <FBMT headers={["Date","Home","Score","Away","Tournament"]} alignRight={[2]}
          rows={h2h.matches.slice().reverse().map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.home_team} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
            <FBTeamLabel team={m.away_team} size={13}/>,
            <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
          ];})}/>
      </div>
    </FBCard>
  </div>;
}

// ── Tab: FBDecades ──
function FBDecades({matches}) {
  const data = useMemo(function(){
    var decades = {};
    matches.forEach(function(m){
      var yr = parseInt(m.date.substring(0,4));
      var dec = Math.floor(yr/10)*10+"s";
      if(!decades[dec]) decades[dec]={decade:dec,matches:0,goals:0,homeWins:0,draws:0,awayWins:0};
      var d = decades[dec];
      d.matches++; d.goals+=m.home_score+m.away_score;
      if(m.home_score>m.away_score) d.homeWins++;
      else if(m.home_score===m.away_score) d.draws++;
      else d.awayWins++;
    });
    var arr = Object.values(decades).sort(function(a,b){return a.decade.localeCompare(b.decade);});
    arr.forEach(function(d){
      d.avgGoals = d.matches ? +(d.goals/d.matches).toFixed(2) : 0;
      d.homeWinPct = d.matches ? Math.round(d.homeWins/d.matches*100) : 0;
    });
    return arr;
  },[matches]);

  return <div>
    <FBCard title="Matches & Average Goals by Decade" icon={"\uD83D\uDCCA"}>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
          <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:11}}/>
          <YAxis yAxisId="left" tick={{fill:"#94a3b8",fontSize:11}}/>
          <YAxis yAxisId="right" orientation="right" tick={{fill:"#94a3b8",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Legend/>
          <Bar yAxisId="left" dataKey="matches" name="Matches" fill="rgba(26,86,219,0.4)" radius={[4,4,0,0]}/>
          <Line yAxisId="right" type="monotone" dataKey="avgGoals" name="Avg Goals" stroke="#d4a017" strokeWidth={2} dot={{r:4,fill:"#d4a017"}}/>
        </ComposedChart>
      </ResponsiveContainer>
    </FBCard>

    <FBCard title="Decade Summary" icon={"\uD83D\uDCC5"}>
      <FBMT headers={["Decade","Matches","Goals","Avg Goals","Home Win%","Draw%","Away Win%"]} alignRight={[1,2,3,4,5,6]}
        rows={data.map(function(d){return [
          d.decade,
          d.matches.toLocaleString(),
          d.goals.toLocaleString(),
          d.avgGoals,
          d.homeWinPct+"%",
          (d.matches?Math.round(d.draws/d.matches*100):0)+"%",
          (d.matches?Math.round(d.awayWins/d.matches*100):0)+"%"
        ];})}/>
    </FBCard>
  </div>;
}

// ── Tab: FBRecords ──
function FBRecords({matches}) {
  const records = useMemo(function(){
    var teamStats = {};
    matches.forEach(function(m){
      [m.home_team,m.away_team].forEach(function(t){
        if(!teamStats[t]) teamStats[t]={team:t,p:0,w:0,d:0,l:0,gf:0,ga:0};
        var isHome = t===m.home_team;
        var sc = isHome?m.home_score:m.away_score;
        var cc = isHome?m.away_score:m.home_score;
        teamStats[t].p++; teamStats[t].gf+=sc; teamStats[t].ga+=cc;
        if(sc>cc) teamStats[t].w++;
        else if(sc===cc) teamStats[t].d++;
        else teamStats[t].l++;
      });
    });
    var winRates = Object.values(teamStats).filter(function(t){return t.p>=100;}).map(function(t){return Object.assign({},t,{winPct:fbWinPct(t.w,t.p)});}).sort(function(a,b){return b.winPct-a.winPct;}).slice(0,20);

    var biggestWins = matches.slice().map(function(m){return Object.assign({},m,{margin:Math.abs(m.home_score-m.away_score),totalGoals:m.home_score+m.away_score});}).sort(function(a,b){return b.margin-a.margin || b.totalGoals-a.totalGoals;}).slice(0,15);

    var highestScoring = matches.slice().sort(function(a,b){return (b.home_score+b.away_score)-(a.home_score+a.away_score);}).slice(0,15);

    return {winRates:winRates,biggestWins:biggestWins,highestScoring:highestScoring};
  },[matches]);

  return <div>
    <FBCard title="Top International Scorers (All Time)" icon={"\u26BD"}>
      <FBMT headers={["#","Player","Country","Goals","Caps"]} alignRight={[3,4]}
        rows={TOP_INTL_SCORERS.map(function(p,i){return [
          i+1,
          <span style={{fontWeight:600,color:"#f8fafc"}}>{p.player}</span>,
          <FBTeamLabel team={p.country} size={13}/>,
          <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{p.goals}</span>,
          p.caps
        ];})}/>
    </FBCard>

    <FBCard title="World Cup Golden Boots" icon={"\uD83E\uDD47"}>
      <FBMT headers={["Year","Player","Country","Goals"]} alignRight={[0,3]}
        rows={WC_GOLDEN_BOOTS.map(function(b){return [
          <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#d4a017"}}>{b.year}</span>,
          <span style={{fontWeight:600,color:"#f8fafc"}}>{b.player}</span>,
          <span style={{color:"#cbd5e1"}}>{b.country}</span>,
          <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{b.goals}</span>
        ];})}/>
    </FBCard>

    <FBCard title="Highest Win Rate (min 100 matches)" icon={"\uD83D\uDCCA"}>
      <FBMT headers={["#","Team","P","W","D","L","Win%"]} alignRight={[2,3,4,5,6]}
        rows={records.winRates.map(function(t,i){return [
          i+1,
          <FBTeamLabel team={t.team} size={13}/>,
          t.p,t.w,t.d,t.l,
          <span style={{fontWeight:700,color:t.winPct>=60?"#3ddc84":t.winPct>=45?"#d4a017":"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{t.winPct}%</span>
        ];})}/>
    </FBCard>

    <FBCard title="Biggest Victories" icon={"\uD83D\uDCA5"}>
      <FBMT headers={["Date","Home","Score","Away","Margin","Tournament"]} alignRight={[2,4]}
        rows={records.biggestWins.map(function(m){return [
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
          <FBTeamLabel team={m.home_team} size={13}/>,
          <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
          <FBTeamLabel team={m.away_team} size={13}/>,
          <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{m.margin}</span>,
          <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
        ];})}/>
    </FBCard>

    <FBCard title="Highest Scoring Matches" icon={"\uD83D\uDD25"}>
      <FBMT headers={["Date","Home","Score","Away","Total","Tournament"]} alignRight={[2,4]}
        rows={records.highestScoring.map(function(m){return [
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
          <FBTeamLabel team={m.home_team} size={13}/>,
          <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
          <FBTeamLabel team={m.away_team} size={13}/>,
          <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score+m.away_score}</span>,
          <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
        ];})}/>
    </FBCard>
  </div>;
}

// ── Tab: FBVenues ──
function FBVenues({matches}) {
  const data = useMemo(function(){
    var countries = {};
    matches.forEach(function(m){
      var c = m.country || "Unknown";
      if(!countries[c]) countries[c]={country:c,matches:0,goals:0};
      countries[c].matches++;
      countries[c].goals+=m.home_score+m.away_score;
    });
    var arr = Object.values(countries).sort(function(a,b){return b.matches-a.matches;});
    arr.forEach(function(d){d.avgGoals = d.matches ? +(d.goals/d.matches).toFixed(2) : 0;});
    return arr;
  },[matches]);

  var chartData = data.slice(0,25);

  return <div>
    <FBCard title="Matches by Host Country (Top 25)" icon={"\uD83C\uDFDF\uFE0F"}>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
          <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
          <YAxis type="category" dataKey="country" width={110} tick={{fill:"#cbd5e1",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Bar dataKey="matches" name="Matches" fill="rgba(26,86,219,0.5)" radius={[0,6,6,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </FBCard>

    <FBCard title="All Host Countries" icon={"\uD83D\uDCCB"}>
      <div style={{maxHeight:500,overflowY:"auto"}}>
        <FBMT headers={["#","Country","Matches","Goals","Avg Goals/Match"]} alignRight={[2,3,4]}
          rows={data.map(function(d,i){return [
            i+1,
            <FBTeamLabel team={d.country} size={13}/>,
            d.matches.toLocaleString(),
            d.goals.toLocaleString(),
            d.avgGoals
          ];})}/>
      </div>
    </FBCard>
  </div>;
}

// ── Tab: FBFixtures ──
function FBFixtures({matches}) {
  const [filter,setFilter] = useState("all");
  const recentData = useMemo(function(){
    // Get matches from last 6 months and any future-dated matches
    var cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    var cutoffStr = cutoff.toISOString().substring(0,10);
    var recent = matches.filter(function(m){ return m.date >= cutoffStr; });

    // Group by tournament
    var byTournament = {};
    recent.forEach(function(m){
      if(!byTournament[m.tournament]) byTournament[m.tournament] = [];
      byTournament[m.tournament].push(m);
    });

    // Get tournament list sorted by count
    var tournamentList = Object.keys(byTournament).sort(function(a,b){ return byTournament[b].length - byTournament[a].length; });

    return { recent: recent, byTournament: byTournament, tournamentList: tournamentList, cutoffStr: cutoffStr };
  },[matches]);

  var filtered = filter === "all" ? recentData.recent : recentData.recent.filter(function(m){ return m.tournament === filter; });
  var reversed = filtered.slice().reverse();

  // Group by month
  var byMonth = {};
  reversed.forEach(function(m){
    var month = m.date.substring(0,7);
    if(!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(m);
  });
  var months = Object.keys(byMonth).sort().reverse();

  return <div>
    <FBCard title="Recent & Upcoming Fixtures" icon={"\uD83D\uDCC6"}>
      <div style={{color:"#94a3b8",fontSize:12,marginBottom:16}}>
        Showing matches from {recentData.cutoffStr} onwards ({filtered.length.toLocaleString()} matches)
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <button className={"fb-btn"+(filter==="all"?" active":"")} onClick={function(){setFilter("all");}}>All ({recentData.recent.length})</button>
        {recentData.tournamentList.slice(0,8).map(function(t){
          return <button key={t} className={"fb-btn"+(filter===t?" active":"")} onClick={function(){setFilter(t);}} style={{fontSize:10}}>{t} ({recentData.byTournament[t].length})</button>;
        })}
      </div>
    </FBCard>

    {months.map(function(month){
      var monthName = new Date(month+"-01").toLocaleDateString("en-US",{year:"numeric",month:"long"});
      return <FBCard key={month} title={monthName} icon={"\uD83D\uDCC5"}>
        <FBMT headers={["Date","Home","Score","Away","Tournament"]} alignRight={[2]}
          rows={byMonth[month].map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.home_team} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
            <FBTeamLabel team={m.away_team} size={13}/>,
            <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
          ];})}/>
      </FBCard>;
    })}
  </div>;
}

// ── Tab: FBAllResults ──
function FBAllResults({matches}) {
  const [search,setSearch] = useState("");
  const [tournament,setTournament] = useState("all");
  const [page,setPage] = useState(0);
  var PER_PAGE = 100;

  const tournaments = useMemo(function(){
    var s = new Set(matches.map(function(m){return m.tournament;}));
    return ["all"].concat([...s].sort());
  },[matches]);

  const filtered = useMemo(function(){
    var f = matches.slice().reverse();
    if(tournament!=="all") f = f.filter(function(m){return m.tournament===tournament;});
    if(search.trim()) {
      var q = search.toLowerCase();
      f = f.filter(function(m){return m.home_team.toLowerCase().indexOf(q)!==-1||m.away_team.toLowerCase().indexOf(q)!==-1||m.date.indexOf(q)!==-1||m.tournament.toLowerCase().indexOf(q)!==-1;});
    }
    return f;
  },[matches,tournament,search]);

  useEffect(function(){setPage(0);},[search,tournament]);

  var totalPages = Math.ceil(filtered.length/PER_PAGE);
  var pageData = filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);

  return <div>
    <FBCard title="All Results" icon={"\uD83D\uDCCB"}>
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input className="fb-search" placeholder="Search team, date, tournament..." value={search} onChange={function(e){setSearch(e.target.value);}} style={{maxWidth:320}}/>
        <select className="fb-select" value={tournament} onChange={function(e){setTournament(e.target.value);}}>
          {tournaments.map(function(t){return <option key={t} value={t}>{t==="all"?"All Tournaments":t}</option>;})}
        </select>
        <span style={{color:"#94a3b8",fontSize:11}}>{filtered.length.toLocaleString()} matches</span>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center"}}>
        <button className="fb-page-btn" disabled={page===0} onClick={function(){setPage(function(p){return p-1;});}}>Prev</button>
        <span style={{color:"#94a3b8",fontSize:11}}>Page {page+1} of {totalPages || 1}</span>
        <button className="fb-page-btn" disabled={page>=totalPages-1} onClick={function(){setPage(function(p){return p+1;});}}>Next</button>
      </div>

      <div style={{overflowX:"auto"}}>
        <FBMT headers={["Date","Home","Score","Away","Tournament","Country"]} alignRight={[2]}
          rows={pageData.map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.home_team} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
            <FBTeamLabel team={m.away_team} size={13}/>,
            <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>,
            <span style={{color:"#64748b",fontSize:10}}>{m.country}</span>
          ];})}/>
      </div>
    </FBCard>
  </div>;
}

// ── Tab: FBTeam ──
function FBTeam({matches,teamName,ufwc}) {
  const [subTab,setSubTab] = useState("overview");
  var team = teamName;
  var color = fbGetTeamColor(team);
  var nickname = TEAM_NICKNAMES[team] || "";

  const teamMatches = useMemo(function(){return getTeamMatches(matches,team);},[matches,team]);
  const stats = useMemo(function(){return computeTeamStats(matches,team);},[matches,team]);

  const badges = useMemo(function(){
    var b = [];
    var wcWins = WC_WINNERS.filter(function(w){return w.winner===team;}).length;
    if(wcWins) b.push({label:wcWins+"x WC Winner",color:"#d4a017"});
    var euroWins = EURO_WINNERS.filter(function(w){return w.winner===team;}).length;
    if(euroWins) b.push({label:euroWins+"x Euro Winner",color:"#1a56db"});
    var copaWins = COPA_WINNERS.filter(function(w){return w.winner===team;}).length;
    if(copaWins) b.push({label:copaWins+"x Copa Winner",color:"#009C3B"});
    if(ufwc.holder===team) b.push({label:"UFWC Holder",color:"#d4a017"});
    return b;
  },[team,ufwc.holder]);

  const yearlyData = useMemo(function(){
    var years = {};
    teamMatches.forEach(function(m){
      var yr = parseInt(m.date.substring(0,4));
      if(!years[yr]) years[yr]={year:yr,p:0,w:0,d:0,l:0,gf:0,ga:0};
      var y = years[yr];
      var r = getMatchScoreForTeam(m,team);
      y.p++; y.gf+=r.scored; y.ga+=r.conceded;
      if(r.scored>r.conceded) y.w++;
      else if(r.scored===r.conceded) y.d++;
      else y.l++;
    });
    var arr = Object.values(years).sort(function(a,b){return a.year-b.year;});
    arr.forEach(function(y){
      y.winPct = y.p ? Math.round(y.w/y.p*100) : 0;
      y.avgGF = y.p ? +(y.gf/y.p).toFixed(2) : 0;
      y.avgGA = y.p ? +(y.ga/y.p).toFixed(2) : 0;
    });
    return arr.slice(-40);
  },[teamMatches,team]);

  const extremes = useMemo(function(){
    var withMargin = teamMatches.map(function(m){
      var r = getMatchScoreForTeam(m,team);
      return Object.assign({},m,{scored:r.scored,conceded:r.conceded,margin:r.scored-r.conceded});
    });
    var bigWins = withMargin.slice().sort(function(a,b){return b.margin-a.margin;}).slice(0,5);
    var bigLosses = withMargin.slice().sort(function(a,b){return a.margin-b.margin;}).slice(0,5);
    return {bigWins:bigWins,bigLosses:bigLosses};
  },[teamMatches,team]);

  const h2hFocus = useMemo(function(){
    return FOCUS_TEAMS.filter(function(t){return t!==team;}).map(function(t){
      var ms = getH2HMatches(matches,team,t);
      var s = computeTeamStats(ms,team);
      return Object.assign({opponent:t},s);
    }).filter(function(h){return h.played>0;}).sort(function(a,b){return b.played-a.played;});
  },[matches,team]);

  const last20 = useMemo(function(){
    var ms = teamMatches.slice(-20);
    return ms.map(function(m){
      var r = getMatchScoreForTeam(m,team);
      var result = r.scored>r.conceded?"W":r.scored<r.conceded?"L":"D";
      var opp = getOpponent(m,team);
      return {date:m.date,opp:opp,scored:r.scored,conceded:r.conceded,result:result,tournament:m.tournament,home:m.home_team===team};
    });
  },[teamMatches,team]);

  const wcHistory = useMemo(function(){
    return WC_WINNERS.map(function(w){
      var isWinner = w.winner===team;
      var isRunnerUp = w.runnerUp===team;
      var wcM = teamMatches.filter(function(m){return isWorldCup(m.tournament) && m.date.startsWith(String(w.year));});
      return Object.assign({},w,{participated:wcM.length>0||isWinner||isRunnerUp,matchCount:wcM.length,isWinner:isWinner,isRunnerUp:isRunnerUp});
    });
  },[team,teamMatches]);

  const wcMatches = useMemo(function(){return teamMatches.filter(function(m){return isWorldCup(m.tournament);});},[teamMatches]);

  return <div>
    {/* Hero banner */}
    <div style={{background:"linear-gradient(135deg, "+color+"22 0%, rgba(15,23,42,0.8) 60%)",border:"1px solid "+color+"33",borderRadius:16,padding:24,marginBottom:16,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <FBFlagBadge team={team} size={64}/>
      <div>
        <div style={{fontSize:28,fontWeight:900,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.02em"}}>{team}</div>
        {nickname && <div style={{color:color+"cc",fontSize:13,fontStyle:"italic",marginTop:2}}>{nickname}</div>}
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {badges.map(function(b,i){return <span key={i} style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:b.color+"15",border:"1px solid "+b.color+"33",color:b.color,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.04em"}}>{b.label}</span>;})}
        </div>
      </div>
    </div>

    <div className="fb-grid" style={{marginBottom:16}}>
      <FBSB value={stats.played} label="Matches" color={color}/>
      <FBSB value={stats.w} label="Wins"/>
      <FBSB value={stats.d} label="Draws"/>
      <FBSB value={stats.l} label="Losses"/>
      <FBSB value={stats.gf} label="Goals For" color="#3ddc84"/>
      <FBSB value={fbWinPct(stats.w,stats.played)+"%"} label="Win Rate" color="#d4a017"/>
    </div>

    <div className="fb-tab-nav" style={{marginBottom:16}}>
      {[["overview","Overview"],["h2h","H2H"],["form","Form"],["worldcup","World Cup"]].map(function(item){
        return <button key={item[0]} className={"fb-tab-btn"+(subTab===item[0]?" active":"")} onClick={function(){setSubTab(item[0]);}}>{item[1]}</button>;
      })}
    </div>

    {subTab==="overview" && <div>
      <div className="fb-grid-2">
        <FBCard title="Win % by Year" icon={"\uD83D\uDCCA"}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:9}} interval={3} angle={-30} textAnchor="end" height={40}/>
              <YAxis domain={[0,100]} tick={{fill:"#94a3b8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="winPct" name="Win %" radius={[4,4,0,0]}>
                {yearlyData.map(function(e,i){return <Cell key={i} fill={e.winPct>=70?"#3ddc84":e.winPct>=50?color:e.winPct>=30?"#d4a017":"#ef4444"}/>;})}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </FBCard>
        <FBCard title="Avg Goals per Match" icon={"\u26BD"}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:9}} interval={3} angle={-30} textAnchor="end" height={40}/>
              <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Line type="monotone" dataKey="avgGF" name="Avg Scored" stroke="#3ddc84" strokeWidth={2} dot={{r:2}}/>
              <Line type="monotone" dataKey="avgGA" name="Avg Conceded" stroke="#ef4444" strokeWidth={2} dot={{r:2}}/>
            </LineChart>
          </ResponsiveContainer>
        </FBCard>
      </div>

      <div className="fb-grid-2">
        <FBCard title="Biggest Wins" icon={"\uD83D\uDCA5"}>
          <FBMT headers={["Date","Opponent","Score","Margin"]} alignRight={[2,3]}
            rows={extremes.bigWins.map(function(m){return [
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
              <FBTeamLabel team={getOpponent(m,team)} size={13}/>,
              <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.scored}-{m.conceded}</span>,
              <span style={{fontWeight:700,color:"#3ddc84",fontFamily:"'JetBrains Mono',monospace"}}>+{m.margin}</span>
            ];})}/>
        </FBCard>
        <FBCard title="Biggest Losses" icon={"\uD83D\uDE1E"}>
          <FBMT headers={["Date","Opponent","Score","Margin"]} alignRight={[2,3]}
            rows={extremes.bigLosses.map(function(m){return [
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
              <FBTeamLabel team={getOpponent(m,team)} size={13}/>,
              <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.scored}-{m.conceded}</span>,
              <span style={{fontWeight:700,color:"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{m.margin}</span>
            ];})}/>
        </FBCard>
      </div>
    </div>}

    {subTab==="h2h" && <FBCard title={team + " vs Focus Teams"} icon={"\u2694\uFE0F"}>
      <FBMT headers={["Opponent","P","W","D","L","GF","GA","Win%"]} alignRight={[1,2,3,4,5,6,7]}
        rows={h2hFocus.map(function(h){return [
          <FBTeamLabel team={h.opponent} size={13}/>,
          h.played,h.w,h.d,h.l,h.gf,h.ga,
          <span style={{fontWeight:700,color:fbWinPct(h.w,h.played)>=50?"#3ddc84":"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{fbWinPct(h.w,h.played)}%</span>
        ];})}/>
    </FBCard>}

    {subTab==="form" && <div>
      <FBCard title="Last 20 Results" icon={"\uD83D\uDCCA"}>
        <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
          {last20.map(function(m,i){return <span key={i} className="fb-chip" style={{background:m.result==="W"?"rgba(61,220,132,0.15)":m.result==="L"?"rgba(239,68,68,0.15)":"rgba(212,160,23,0.15)",color:m.result==="W"?"#3ddc84":m.result==="L"?"#ef4444":"#d4a017",minWidth:28,textAlign:"center"}} title={m.date+": vs "+m.opp+" "+m.scored+"-"+m.conceded}>{m.result}</span>;})}
        </div>
        <FBMT headers={["Date","Opponent","H/A","Score","Result","Tournament"]} alignRight={[3]}
          rows={last20.slice().reverse().map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.opp} size={13}/>,
            <span style={{color:"#94a3b8",fontSize:11}}>{m.home?"H":"A"}</span>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.scored}-{m.conceded}</span>,
            <span className="fb-chip" style={{background:m.result==="W"?"rgba(61,220,132,0.1)":m.result==="L"?"rgba(239,68,68,0.1)":"rgba(212,160,23,0.1)",color:m.result==="W"?"#3ddc84":m.result==="L"?"#ef4444":"#d4a017"}}>{m.result}</span>,
            <span style={{color:"#94a3b8",fontSize:10}}>{m.tournament}</span>
          ];})}/>
      </FBCard>
    </div>}

    {subTab==="worldcup" && <div>
      <FBCard title={team + " World Cup History"} icon={"\uD83C\uDFC6"}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {wcHistory.map(function(w,i){return <div key={i} style={{padding:"6px 12px",borderRadius:8,background:w.isWinner?"rgba(212,160,23,0.15)":w.isRunnerUp?"rgba(192,192,192,0.1)":w.participated?"rgba(26,86,219,0.06)":"rgba(255,255,255,0.02)",border:"1px solid "+(w.isWinner?"rgba(212,160,23,0.3)":w.participated?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)"),fontSize:11,textAlign:"center",minWidth:48,opacity:w.participated?1:0.3}}>
            <div style={{fontWeight:700,color:w.isWinner?"#d4a017":w.isRunnerUp?"#c0c0c0":"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>{w.year}</div>
            {w.isWinner && <div style={{fontSize:9,color:"#d4a017"}}>WINNER</div>}
            {w.isRunnerUp && <div style={{fontSize:9,color:"#c0c0c0"}}>Runner-up</div>}
          </div>;})}
        </div>
      </FBCard>

      <FBCard title={team + " World Cup Matches"} icon={"\u26BD"}>
        <div style={{maxHeight:500,overflowY:"auto"}}>
          <FBMT headers={["Date","Opponent","H/A","Score","Result"]} alignRight={[3]}
            rows={wcMatches.map(function(m){
              var r = getMatchScoreForTeam(m,team);
              var result = r.scored>r.conceded?"W":r.scored<r.conceded?"L":"D";
              return [
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
                <FBTeamLabel team={getOpponent(m,team)} size={13}/>,
                <span style={{color:"#94a3b8",fontSize:11}}>{m.home_team===team?"H":"A"}</span>,
                <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{r.scored}-{r.conceded}</span>,
                <span className="fb-chip" style={{background:result==="W"?"rgba(61,220,132,0.1)":result==="L"?"rgba(239,68,68,0.1)":"rgba(212,160,23,0.1)",color:result==="W"?"#3ddc84":result==="L"?"#ef4444":"#d4a017"}}>{result}</span>
              ];
            })}/>
        </div>
      </FBCard>
    </div>}
  </div>;
}

// ── Football SVG Icon (globe with seams) ──
function FootballIcon({size=32}) {
  return <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="none" stroke="#93bbfc" strokeWidth="1.5"/>
    <ellipse cx="16" cy="16" rx="14" ry="14" fill="none" stroke="rgba(147,187,252,0.2)" strokeWidth="0.5"/>
    <path d="M16 2 C16 2 10 10 10 16 C10 22 16 30 16 30" fill="none" stroke="rgba(147,187,252,0.3)" strokeWidth="0.8"/>
    <path d="M16 2 C16 2 22 10 22 16 C22 22 16 30 16 30" fill="none" stroke="rgba(147,187,252,0.3)" strokeWidth="0.8"/>
    <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="rgba(147,187,252,0.3)" strokeWidth="0.8"/>
    <path d="M16 7 L20 11 L18 16 L14 16 L12 11 Z" fill="rgba(26,86,219,0.3)" stroke="#93bbfc" strokeWidth="0.8"/>
  </svg>;
}

// ── Centre Circle SVG (footer motif) ──
function CentreCircleSVG({size=60}) {
  return <svg width={size} height={size} viewBox="0 0 60 60" style={{opacity:0.15}}>
    <circle cx="30" cy="30" r="28" fill="none" stroke="#93bbfc" strokeWidth="1"/>
    <circle cx="30" cy="30" r="3" fill="#93bbfc"/>
    <line x1="0" y1="30" x2="60" y2="30" stroke="#93bbfc" strokeWidth="0.8"/>
  </svg>;
}

// ── Error Boundary ──
class FBErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error: error }; }
  componentDidCatch(error, info) { console.error("Football tab error:", error, info); }
  render() {
    if (this.state.hasError) {
      return <div className="fb-card" style={{textAlign:"center",padding:40}}>
        <div style={{fontSize:48,marginBottom:12}}>{"\u26A0\uFE0F"}</div>
        <div style={{color:"#ef4444",fontSize:16,fontWeight:700,marginBottom:8}}>Something went wrong</div>
        <div style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>{this.state.error ? this.state.error.message : "An error occurred rendering this tab."}</div>
        <button className="fb-btn" onClick={()=>this.setState({hasError:false,error:null})}>Try Again</button>
      </div>;
    }
    return this.props.children;
  }
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
function FootballStatNations() {
  const [matches,setMatches] = useState([]);
  const [nameMap,setNameMap] = useState({});
  const [loading,setLoading] = useState(true);
  const [loadProgress,setLoadProgress] = useState("Downloading match data...");
  const [error,setError] = useState(null);
  const [activeTab,setActiveTab] = useState("overview");
  const [teamParam,setTeamParam] = useState("England");

  const parseHash = useCallback(function(){
    var hash = window.location.hash || "";
    if(!hash.startsWith("#/football")) return;
    var parts = hash.replace("#/football/","").replace("#/football","").split("/");
    var tab = parts[0] || "overview";
    var param = parts[1] ? decodeURIComponent(parts[1]) : null;
    setActiveTab(tab);
    if(param) setTeamParam(param);
  },[]);

  useEffect(function(){
    parseHash();
    var onHash = function(){parseHash();};
    window.addEventListener("hashchange",onHash);
    return function(){window.removeEventListener("hashchange",onHash);};
  },[parseHash]);

  // Fetch pre-processed JSON (replaces CSV parsing)
  useEffect(function(){
    async function loadData() {
      try {
        setLoadProgress("Fetching match data...");
        var [matchRes, nameRes] = await Promise.all([
          fetch("/data/football-all.json"),
          fetch("/data/football-countries.json")
        ]);
        if(!matchRes.ok) throw new Error("Failed to load football-all.json: " + matchRes.status);

        setLoadProgress("Parsing JSON...");
        var [matchData, nameData] = await Promise.all([matchRes.json(), nameRes.json()]);

        // Build name map from countries JSON
        var nm = {};
        (nameData || []).forEach(function(row){
          var keys = Object.keys(row);
          if(keys.length>=2 && row[keys[0]] && row[keys[1]]) {
            nm[row[keys[0]].trim()] = row[keys[1]].trim();
          }
        });
        setNameMap(nm);

        // Normalise field names and types (JSON uses snake_case from CSV headers)
        var parsed = (matchData || []).map(function(r){
          var home_team = (r.home_team || r.home || '').trim();
          var away_team = (r.away_team || r.away || '').trim();
          var home_score = parseInt(r.home_score || r.hs);
          var away_score = parseInt(r.away_score || r.as);
          var date = (r.date || '').trim();
          var tournament = (r.tournament || r.Tournament || '').trim();
          var country = (r.country || '').trim();
          var neutral = r.neutral === true || r.neutral === 'True' || r.neutral === 'true';
          if(nm[home_team]) home_team = nm[home_team];
          if(nm[away_team]) away_team = nm[away_team];
          if(!date || isNaN(home_score) || isNaN(away_score)) return null;
          return {date,home_team,away_team,home_score,away_score,tournament,country,neutral};
        }).filter(Boolean);

        parsed.sort(function(a,b){return a.date.localeCompare(b.date);});
        setMatches(parsed);
        setLoading(false);
      } catch(e) {
        console.error("Football data load error:",e);
        setError(e.message);
        setLoading(false);
      }
    }
    loadData();
  },[]);

  // Compute UFWC
  const ufwc = useMemo(function(){return computeUFWC(matches);},[matches]);

  const navTab = useCallback(function(tab,param){
    if(param) {
      window.location.hash = "#/football/"+tab+"/"+encodeURIComponent(param);
    } else {
      window.location.hash = "#/football/"+tab;
    }
  },[]);

  // ── Loading state ──
  if(loading) {
    return <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 20px",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{fbCSS}</style>
      <div style={{fontSize:48,marginBottom:16}}>{"\u26BD"}</div>
      <div style={{color:"#f8fafc",fontSize:18,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>Loading Football Data...</div>
      <div style={{color:"#94a3b8",fontSize:12,marginTop:8,fontFamily:"'JetBrains Mono',monospace"}}>{loadProgress}</div>
      <div className="fb-shimmer" style={{width:280,margin:"20px auto"}}></div>
    </div>;
  }

  // ── Error state ──
  if(error) {
    return <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 20px",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{fbCSS}</style>
      <div style={{fontSize:48,marginBottom:16}}>{"\u26A0\uFE0F"}</div>
      <div style={{color:"#ef4444",fontSize:18,fontWeight:700}}>Error Loading Data</div>
      <div style={{color:"#94a3b8",fontSize:13,marginTop:8}}>{error}</div>
    </div>;
  }

  // ── Tab definitions ──
  var COMP_TABS = [
    {key:"overview",label:"Overview"},
    {key:"fixtures",label:"Fixtures"},
    {key:"worldcup",label:"World Cup"},
    {key:"euros",label:"Euros"},
    {key:"copa",label:"Copa Am\u00e9rica"},
    {key:"nationsleague",label:"Nations League"},
    {key:"bhc",label:"British Champ"}
  ];
  var EXPLORE_TABS = [
    {key:"ufwc",label:"UFWC"},
    {key:"h2h",label:"Head to Head"},
    {key:"decades",label:"Decades"},
    {key:"records",label:"Records"},
    {key:"venues",label:"Venues"},
    {key:"allresults",label:"All Results"}
  ];

  var flagStrip = <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginTop:8}}>
    {FOCUS_TEAMS.map(function(t){return <span key={t} style={{cursor:"pointer"}} onClick={function(){navTab("team",t);}} title={t}><FBFlag team={t} size={20}/></span>;})}
  </div>;

  function renderContent() {
    switch(activeTab) {
      case "overview": return <FBOverview matches={matches} ufwc={ufwc}/>;
      case "fixtures": return <FBFixtures matches={matches}/>;
      case "worldcup": return <TournamentTab matches={matches} tournamentFilter={isWorldCup} winners={WC_WINNERS} title="World Cup" icon={"\uD83C\uDFC6"} wcData={WC_DATA}/>;
      case "euros": return <TournamentTab matches={matches} tournamentFilter={isEurosFinals} winners={EURO_WINNERS} title="European Championship" icon={"\uD83C\uDFC6"}/>;
      case "copa": return <TournamentTab matches={matches} tournamentFilter={isCopa} winners={COPA_WINNERS} title="Copa Am\u00e9rica" icon={"\uD83C\uDFC6"}/>;
      case "nationsleague": return <TournamentTab matches={matches} tournamentFilter={isNationsLeague} winners={[]} title="Nations League" icon={"\uD83C\uDFC6"}/>;
      case "bhc": return <FBBritishChamp matches={matches}/>;
      case "ufwc": return <FBUFWCTab ufwc={ufwc}/>;
      case "h2h": return <FBHeadToHead matches={matches}/>;
      case "decades": return <FBDecades matches={matches}/>;
      case "records": return <FBRecords matches={matches}/>;
      case "venues": return <FBVenues matches={matches}/>;
      case "allresults": return <FBAllResults matches={matches}/>;
      case "team": return <FBTeam matches={matches} teamName={teamParam} ufwc={ufwc}/>;
      default: return <FBOverview matches={matches} ufwc={ufwc}/>;
    }
  }

  return <div style={{fontFamily:"'DM Sans',sans-serif",color:"#cbd5e1",minHeight:"100vh"}}>
    <style>{fbCSS}</style>

    {/* Header */}
    <div style={{background:"linear-gradient(135deg, rgba(26,86,219,0.12) 0%, rgba(15,23,42,0.95) 50%, rgba(212,160,23,0.06) 100%)",borderBottom:"1px solid rgba(26,86,219,0.15)",padding:"20px 0 16px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:6}}>
          <FootballIcon size={36}/>
          <h1 style={{fontSize:26,fontWeight:900,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em",margin:0}}>
            <span style={{color:"#1a56db"}}>FOOTBALL</span> <span style={{color:"#d4a017"}}>STAT</span>NATIONS
          </h1>
        </div>
        <div style={{color:"#94a3b8",fontSize:11,letterSpacing:"0.04em"}}>
          {matches.length.toLocaleString()} international matches &middot; Since 1872
        </div>
        {flagStrip}
      </div>
    </div>

    {/* Tab Navigation */}
    <nav style={{maxWidth:1200,margin:"0 auto",padding:"12px 20px 0"}} role="navigation" aria-label="Football navigation">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}>COMPS</span>
        <div className="fb-tab-nav" style={{flex:1}} role="tablist" aria-label="Competition tabs">
          {COMP_TABS.map(function(t){return <button key={t.key} role="tab" aria-selected={activeTab===t.key} className={"fb-tab-btn"+(activeTab===t.key?" active":"")} onClick={function(){navTab(t.key);}}>{t.label}</button>;})}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}>EXPLORE</span>
        <div className="fb-tab-nav" style={{flex:1}} role="tablist" aria-label="Explore tabs">
          {EXPLORE_TABS.map(function(t){return <button key={t.key} role="tab" aria-selected={activeTab===t.key} className={"fb-tab-btn"+(activeTab===t.key?" active":"")} onClick={function(){navTab(t.key);}}>{t.label}</button>;})}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{color:"#64748b",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",minWidth:48}}>TEAMS</span>
        <div className="fb-tab-nav" style={{flex:1}} role="tablist" aria-label="Team pages">
          {FOCUS_TEAMS.map(function(t){return <button key={t} role="tab" aria-selected={activeTab==="team"&&teamParam===t} aria-label={t+" team page"} className={"fb-tab-btn"+(activeTab==="team"&&teamParam===t?" active":"")} onClick={function(){navTab("team",t);}} style={{padding:"6px 10px"}}>
            <FBFlag team={t} size={12}/> <span style={{fontSize:10}}>{t}</span>
          </button>;})}
        </div>
      </div>
    </nav>

    {/* Content */}
    <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px 40px"}} role="main" aria-label="Football content">
      <FBErrorBoundary key={activeTab+"|"+teamParam}>
        {renderContent()}
      </FBErrorBoundary>
    </div>

    {/* Footer */}
    <div style={{background:"linear-gradient(180deg, rgba(26,86,219,0.06) 0%, rgba(15,23,42,0.95) 100%)",borderTop:"1px solid rgba(26,86,219,0.1)",padding:"24px 0",textAlign:"center"}}>
      <CentreCircleSVG size={48}/>
      <div style={{color:"#64748b",fontSize:10,marginTop:8,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase"}}>
        Football StatNations &middot; International Football Analytics
      </div>
      <div style={{color:"#334155",fontSize:9,marginTop:4}}>
        Data from 1872 to present &middot; {matches.length.toLocaleString()} matches
      </div>
    </div>
  </div>;
}

window.FootballStatNations = FootballStatNations;
window._footballReady = true;

export default FootballStatNations;
