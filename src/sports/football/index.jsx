import React, { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { WC_DATA } from './wc-data.js';
import { FIXTURES_2026 } from './fixtures-2026.js';
import {
  Trophy, Goal, Crown, ListOrdered, Search, Globe2, Compass, Calendar, Users,
  ChevronDown, ChevronRight, ArrowRight, BarChart3, Swords, MapPin, Layers,
  AlertTriangle, RefreshCw, CalendarOff, X, Link2, Download,
  Medal, Flame, ClipboardList, Award, Zap, CalendarDays, TrendingDown,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import Flag, { FlagSprite } from '../../components/flags.jsx';

// Charts are fetched after the first paint — recharts and its d3 dependencies are
// the largest thing on the page and nothing above the fold needs them.
const OverviewChart = lazy(() => import('./OverviewCharts.jsx'));
const ViewChart = lazy(() => import('./ViewCharts.jsx'));
const CHART_H = 280;
const ChartSkeleton = ({height=CHART_H}) => <div className="sn-skel" style={{height,borderRadius:"var(--r-md)"}}/>;

/** Chart for a secondary view: the charting stack arrives with the view itself. */
function FBLazyChart(props) {
  return <Suspense fallback={<ChartSkeleton height={props.height}/>}>
    <ViewChart {...props}/>
  </Suspense>;
}

/**
 * Renders its children only once the slot is close to the viewport. Lazily
 * *importing* the charts still left the browser fetching, parsing and executing
 * 300 KB of charting code during the initial load; this holds it back until the
 * panel is actually about to be seen. The placeholder reserves the full chart
 * height, so nothing below it moves when the real chart arrives.
 */
function FBWhenVisible(props) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(function(){
    if(shown) return undefined;
    var el = ref.current;
    if(!el) return undefined;
    if(typeof IntersectionObserver === "undefined") { setShown(true); return undefined; }
    var io = new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++) if(entries[i].isIntersecting) { setShown(true); io.disconnect(); return; }
    }, {rootMargin:"250px"});
    io.observe(el);
    return function(){ io.disconnect(); };
  },[shown]);
  return <div ref={ref}>{shown ? props.children : <ChartSkeleton/>}</div>;
}
import Logo from '../../components/Logo.jsx';

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
  {year:2022,host:"Qatar",winner:"Argentina",runnerUp:"France"},
  {year:2026,host:"USA/Canada/Mexico",winner:"Spain",runnerUp:"Argentina"}
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

// Career totals current to 9 August 2026 (post FIFA World Cup 2026)
var TOP_INTL_SCORERS = [
  {player:"Cristiano Ronaldo",country:"Portugal",goals:146,caps:233},
  {player:"Lionel Messi",country:"Argentina",goals:125,caps:207},
  {player:"Ali Daei",country:"Iran",goals:108,caps:148},
  {player:"Sunil Chhetri",country:"India",goals:94,caps:151},
  {player:"Mokhtar Dahari",country:"Malaysia",goals:89,caps:142},
  {player:"Ali Mabkhout",country:"UAE",goals:85,caps:112},
  {player:"Robert Lewandowski",country:"Poland",goals:84,caps:157}
];

var WC_GOLDEN_BOOTS = [
  {year:2026,player:"Kylian Mbappe",country:"France",goals:10},
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
function isEurosFinals(t) { return t === "UEFA Euro" || t === "European Championship"; }
function isCopa(t) { return t === "Copa Am\u00e9rica" || t === "Copa America"; }
function isNationsLeague(t) { return t === "UEFA Nations League" || (t && (t.startsWith("European Nations League") || t.startsWith("UEFA Nations League"))); }
function isBritishChamp(t) { return t === "British Championship"; }

// ── CSS ──
// Every value here resolves to a design token from src/styles/tokens.css.
var fbCSS = `
.fb-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--sp-5);margin-bottom:var(--sp-4);box-shadow:var(--elev-1);transition:border-color var(--dur-normal) var(--ease-out),box-shadow var(--dur-normal) var(--ease-out)}
.fb-card:hover{border-color:var(--line-strong);box-shadow:var(--elev-2)}
.fb-card h3{font-family:var(--font-display);font-size:var(--fs-md);font-weight:600;color:var(--text);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:var(--sp-4);display:flex;align-items:center;gap:var(--sp-2);flex-wrap:wrap}
.fb-card h3 .icon{display:inline-flex;color:var(--accent)}
.fb-sb{background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--sp-4);text-align:left;box-shadow:var(--elev-1)}
.fb-sb .val{font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:600;color:var(--text);line-height:1.05;font-variant-numeric:tabular-nums}
.fb-sb .lbl{font-family:var(--font-display);font-size:var(--fs-2xs);font-weight:500;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-top:var(--sp-1)}
.fb-mt{width:100%;border-collapse:collapse;font-size:var(--fs-sm)}
.fb-mt th{padding:var(--sp-2) var(--sp-2);text-align:left;color:var(--text-muted);font-weight:600;border-bottom:1px solid var(--line);font-size:var(--fs-2xs);text-transform:uppercase;letter-spacing:0.06em;font-family:var(--font-display)}
.fb-mt td{padding:var(--sp-2) var(--sp-2);color:var(--text-muted);border-bottom:1px solid var(--line);font-family:var(--font-body)}
.fb-mt tr{transition:background var(--dur-fast) var(--ease-out)}
.fb-mt tr:hover td{background:var(--surface-raised)}
.fb-tab-nav{display:flex;gap:2px;align-items:center;background:var(--surface);border-radius:var(--r-full);padding:4px;border:1px solid var(--line);min-width:max-content}
.fb-tab-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;font-size:var(--fs-2xs);font-weight:600;color:var(--text-muted);background:transparent;border:none;cursor:pointer;border-radius:var(--r-full);transition:background var(--dur-fast) var(--ease-out),color var(--dur-fast) var(--ease-out);font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;min-height:36px}
.fb-tab-btn:hover{color:var(--text);background:var(--surface-raised)}
.fb-tab-btn.active{color:var(--text);background:color-mix(in srgb,var(--accent) 20%,transparent);box-shadow:inset 0 -2px 0 var(--accent)}
.fb-search{width:100%;padding:12px 14px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-md);color:var(--text);font-size:var(--fs-base);font-family:var(--font-body);outline:none}
.fb-search::placeholder{color:var(--text-faint)}
.fb-search:focus{border-color:var(--accent)}
.fb-select{padding:9px 12px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);color:var(--text);font-size:var(--fs-sm);font-family:var(--font-body);outline:none;cursor:pointer}
.fb-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-md);color:var(--text-muted);font-size:var(--fs-2xs);font-weight:600;cursor:pointer;font-family:var(--font-display);text-transform:uppercase;letter-spacing:0.06em;transition:all var(--dur-fast) var(--ease-out);min-height:36px}
.fb-btn:hover{background:var(--surface-raised);color:var(--text)}
.fb-btn.active{background:color-mix(in srgb,var(--accent) 18%,transparent);border-color:var(--accent);color:var(--text)}
.fb-chip{display:inline-block;padding:3px 8px;border-radius:var(--r-sm);font-size:var(--fs-2xs);font-weight:700;font-family:var(--font-mono)}
.fb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:var(--sp-3)}
.fb-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4)}
.fb-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--sp-4)}
/* Grid items default to min-width:auto, so one long unbreakable row inside a card
   widens the whole track and the page scrolls sideways on a phone. */
.fb-grid>*,.fb-grid-2>*,.fb-grid-3>*{min-width:0}
.fb-link{color:var(--accent);cursor:pointer;text-decoration:none;font-weight:600}
.fb-link:hover{text-decoration:underline}
.fb-page-btn{padding:7px 14px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);color:var(--text-muted);font-size:var(--fs-2xs);cursor:pointer;font-family:var(--font-display);min-height:34px}
.fb-page-btn:hover{background:var(--surface-raised);color:var(--text)}
.fb-page-btn:disabled{opacity:0.35;cursor:default}
.fb-hero{background:radial-gradient(120% 140% at 12% 0%,color-mix(in srgb,var(--accent) 14%,transparent) 0%,transparent 60%),var(--pitch);border-bottom:1px solid var(--line)}
.fb-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:var(--z-dropdown);background:var(--surface-raised);border:1px solid var(--line-strong);border-radius:var(--r-md);box-shadow:var(--elev-3);padding:var(--sp-1);min-width:220px}
.fb-menu button{display:flex;width:100%;align-items:center;gap:var(--sp-2);padding:9px 12px;border-radius:var(--r-sm);background:transparent;border:none;color:var(--text-muted);font-size:var(--fs-sm);font-family:var(--font-body);cursor:pointer;text-align:left}
.fb-menu button:hover,.fb-menu button[aria-current="true"]{background:var(--surface);color:var(--text)}
.fb-results-scroll{max-height:420px;overflow-y:auto}
.fb-date-head{position:sticky;top:0;z-index:1;background:var(--surface);padding:var(--sp-2) var(--sp-2);font-family:var(--font-display);font-size:var(--fs-2xs);text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);border-bottom:1px solid var(--line)}
.fb-result{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto;align-items:center;gap:var(--sp-3);width:100%;padding:10px var(--sp-2);background:transparent;border:none;border-bottom:1px solid var(--line);cursor:pointer;text-align:left;min-height:44px}
.fb-result:hover{background:var(--surface-raised)}
.fb-result .home{display:flex;align-items:center;gap:8px;justify-content:flex-end;min-width:0}
.fb-result .away{display:flex;align-items:center;gap:8px;min-width:0}
.fb-result .name{color:var(--text);font-size:var(--fs-sm);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fb-result .score{font-family:var(--font-mono);font-weight:700;color:var(--text);font-size:var(--fs-base);min-width:52px;text-align:center;font-variant-numeric:tabular-nums}
.fb-chart-scroll{overflow-x:auto}
@media(max-width:768px){
  .fb-grid{grid-template-columns:repeat(2,1fr)}
  .fb-grid-2{grid-template-columns:1fr}
  .fb-grid-3{grid-template-columns:1fr}
}
@media(max-width:640px){
  /* One match per card: names get a full line each, the score sits between them,
     and every row stays a 44px tap target. */
  .fb-result{grid-template-columns:1fr;gap:var(--sp-1);padding:var(--sp-3) var(--sp-2);border:1px solid var(--line);border-radius:var(--r-md);margin-bottom:6px;background:var(--surface-raised)}
  .fb-result .home{justify-content:flex-start}
  .fb-result .score{text-align:left;min-width:0;font-size:var(--fs-md)}
  .fb-result .name{white-space:normal}
  /* KPI tiles become one scroll-snap row so they cost far less height */
  .fb-grid.fb-kpis{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:var(--sp-2);scrollbar-width:none}
  .fb-grid.fb-kpis::-webkit-scrollbar{display:none}
  .fb-grid.fb-kpis>*{scroll-snap-align:start;min-width:62vw;flex:0 0 auto}
  /* Charts scroll horizontally rather than squashing */
  .fb-chart-scroll>div{min-width:520px}
}
@media(prefers-reduced-motion:reduce){
  .fb-tab-btn,.fb-btn,.fb-card{transition:none!important}
}
`;

// ── Flags ──
/**
 * Flags come from the application-wide sprite; this wrapper only supplies the
 * tint the placeholder disc uses when the sprite has no artwork for a nation.
 */
function FBFlag({team,size=20}) {
  return <Flag team={team} size={size} tint={FT_COLORS[team]}/>;
}

function FBFlagBadge({team,size=28}) {
  return <div style={{display:"inline-flex",padding:3,background:"var(--surface-raised)",borderRadius:"var(--r-sm)",border:"1px solid var(--line)"}}><FBFlag team={team} size={size}/></div>;
}

function FBTeamLabel({team,size=16,onClick}) {
  const isFocus = FOCUS_TEAMS.includes(team);
  const handleClick = () => {
    if(isFocus && onClick) onClick();
    else if(isFocus) _fbNavToTab("team",team);
  };
  return <span onClick={handleClick} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:isFocus?"pointer":"default",color:"var(--text)",fontWeight:600,fontSize:Math.max(13,size*0.85),fontFamily:"var(--font-body)",borderRadius:4,padding:"1px 3px",transition:"background var(--dur-fast) var(--ease-out)"}} onMouseOver={isFocus?function(e){e.currentTarget.style.background="var(--surface-raised)";}:undefined} onMouseOut={isFocus?function(e){e.currentTarget.style.background="transparent";}:undefined}>
    <FBFlagBadge team={team} size={size}/>
    <span>{team}</span>
  </span>;
}

function _fbNavToTab(tab, team) {
  if(team) window.location.hash = "#/football/" + tab + "/" + encodeURIComponent(team);
  else window.location.hash = "#/football/" + tab;
}

// ── UI Primitives ──
function FBCard({title,icon,children,style={},action}) {
  return <section className="fb-card" style={style}>
    {title && <h3 style={action?{justifyContent:"space-between"}:undefined}>
      <span style={{display:"inline-flex",alignItems:"center",gap:"var(--sp-2)"}}>
        {icon && <span className="icon">{icon}</span>}{title}
      </span>
      {action && <span style={{display:"inline-flex",gap:4,flexWrap:"wrap"}}>{action}</span>}
    </h3>}
    {children}
  </section>;
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
function fbGetTeamColor(team) { return FT_COLORS[team] || "var(--surface-raised)"; }

// Chart colours come from tokens, not team kits: several national colours are
// pure black, which disappears against the near-black page.
var FB_CHART_SERIES = [
  "var(--accent)", "var(--accent-warn)", "var(--accent-tennis)", "var(--accent-elections)",
  "var(--accent-eurovision)", "var(--accent-demographics)", "var(--accent-cycling)", "var(--accent-athletics)",
];
function fbSeriesColor(i) { return FB_CHART_SERIES[i % FB_CHART_SERIES.length]; }

// ── Tiny inline sparkline (no extra chart library) ──
function FBSpark({values, width=72, height=22, color="var(--accent)"}) {
  if(!values || values.length < 2) return null;
  var max = Math.max.apply(null, values), min = Math.min.apply(null, values);
  var span = max - min || 1;
  var pts = values.map(function(v,i){
    var x = (i/(values.length-1))*width;
    var y = height - ((v-min)/span)*(height-2) - 1;
    return x.toFixed(1)+","+y.toFixed(1);
  }).join(" ");
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false" style={{display:"block"}}>
    <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
  </svg>;
}

// ── Visually hidden data table so charts are readable by screen readers ──
function FBChartTable({caption, columns, rows}) {
  return <table className="sr-only">
    <caption>{caption}</caption>
    <thead><tr>{columns.map(function(c,i){return <th key={i} scope="col">{c}</th>;})}</tr></thead>
    <tbody>{rows.map(function(r,i){return <tr key={i}>{r.map(function(c,j){return j===0?<th key={j} scope="row">{c}</th>:<td key={j}>{c}</td>;})}</tr>;})}</tbody>
  </table>;
}
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
  // The same shape the precomputed summary uses, so the overview reads identically
  // whether it is running off the summary or off the full archive.
  var changes = history.filter(function(h){return !h.retained;});
  var defences = 0;
  for(var i=history.length-1;i>=0 && history[i].retained;i--) defences++;
  return {
    holder:holder, history:history, defences:defences,
    titleMatches:history.length, changes:changes.slice(-5).reverse(),
  };
}

// ── Overview building blocks ──────────────────────────────────────────────────

/** KPI tile: a link to the view that explains it, plus a trend and a tooltip. */
function FBKpi(props) {
  var value=props.value, label=props.label, hint=props.hint, delta=props.delta, spark=props.spark, onClick=props.onClick;
  return <button
    className="fb-sb"
    onClick={onClick}
    title={hint}
    aria-describedby={props.hintId}
    style={{cursor:onClick?"pointer":"default",width:"100%",border:"1px solid var(--line)"}}
  >
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"var(--sp-3)"}}>
      <div style={{minWidth:0,flex:1}}>
        <div className="val tabular" style={{whiteSpace:"nowrap"}}>{value}</div>
        <div className="lbl">{label}</div>
      </div>
      {props.Icon && <props.Icon size={16} aria-hidden="true" style={{color:"var(--accent)",flexShrink:0,marginTop:4}}/>}
    </div>
    {hint && <span id={props.hintId} className="sr-only">{hint}</span>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:10,minHeight:22}}>
      {delta && <span style={{fontSize:"var(--fs-2xs)",color:"var(--accent)",fontWeight:600,whiteSpace:"nowrap"}}>{delta}</span>}
      {spark && <FBSpark values={spark}/>}
    </div>
  </button>;
}

/** Card used by the explore grid — icon, title, one line, count. */
function FBExploreCard(props) {
  var title=props.title, blurb=props.blurb, count=props.count, onClick=props.onClick;
  return <button className="fb-card" onClick={onClick} style={{textAlign:"left",cursor:"pointer",margin:0,width:"100%",display:"flex",gap:"var(--sp-3)",alignItems:"flex-start"}}>
    <span style={{display:"inline-flex",padding:9,borderRadius:"var(--r-md)",background:"color-mix(in srgb,var(--accent) 14%,transparent)",color:"var(--accent)",flexShrink:0}}>
      <props.Icon size={18} aria-hidden="true"/>
    </span>
    <span style={{minWidth:0,flex:1}}>
      <span style={{display:"flex",alignItems:"center",gap:6,fontFamily:"var(--font-display)",fontSize:"var(--fs-md)",fontWeight:600,color:"var(--text)",textTransform:"uppercase",letterSpacing:"0.04em"}}>
        {title}<ArrowRight size={14} aria-hidden="true" style={{opacity:0.5}}/>
      </span>
      <span style={{display:"block",fontSize:"var(--fs-sm)",color:"var(--text-muted)",marginTop:4}}>{blurb}</span>
      {count!=null && <span className="tabular" style={{display:"block",fontSize:"var(--fs-2xs)",color:"var(--text-faint)",marginTop:6,fontFamily:"var(--font-mono)"}}>{count}</span>}
    </span>
  </button>;
}

/** Grouped, date-headed results list with a fade mask and a "view all" footer. */
// 20 rows fill the scroller several times over; rendering more only cost main-thread
// time on load. Everything else is a click away behind "View all results".
function FBResultsList({matches, limit=20, onViewAll}) {
  var groups = useMemo(function(){
    var byDate = {};
    matches.slice(0, limit).forEach(function(m){ (byDate[m.date] = byDate[m.date] || []).push(m); });
    return Object.keys(byDate).sort().reverse().map(function(d){ return {date:d, rows:byDate[d]}; });
  },[matches, limit]);

  if(!groups.length) return <FBEmpty
    title="No results in this window"
    body="Try widening the date range, or browse the full archive."
    actionLabel="Open all results"
    onAction={onViewAll}
  />;

  return <div>
    <div className="fb-results-scroll sn-fade-bottom">
      {groups.map(function(g){
        return <div key={g.date}>
          <div className="fb-date-head">{fbLongDate(g.date)}</div>
          {g.rows.map(function(m,i){
            // No aria-label: the row's visible text already names it, and an
            // aria-label that does not contain that text breaks voice control.
            return <button key={i} className="fb-result" onClick={function(){ _fbNavToTab("h2h", m.home_team); }}>
              <span className="home">
                <span className="name">{m.home_team}</span>
                <FBFlag team={m.home_team} size={20}/>
              </span>
              <span className="score">{m.home_score}–{m.away_score}</span>
              <span className="away">
                <FBFlag team={m.away_team} size={20}/>
                <span className="name">{m.away_team}</span>
              </span>
              <span className="fb-chip" style={{background:"var(--surface)",color:"var(--text-faint)",fontFamily:"var(--font-body)",fontWeight:600,whiteSpace:"nowrap"}}>{m.tournament}</span>
            </button>;
          })}
        </div>;
      })}
    </div>
    <button className="fb-link" onClick={onViewAll} style={{marginTop:"var(--sp-3)",display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",padding:0}}>
      View all results <ArrowRight size={14} aria-hidden="true"/>
    </button>
  </div>;
}

function fbLongDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if(isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, {weekday:"short", day:"numeric", month:"long", year:"numeric"});
}

/** Illustrated empty state with a way forward. */
function FBEmpty(props) {
  var title=props.title, body=props.body, actionLabel=props.actionLabel, onAction=props.onAction;
  var EmptyIcon = props.Icon || CalendarOff;
  return <div style={{textAlign:"center",padding:"var(--sp-8) var(--sp-4)"}}>
    <EmptyIcon size={34} aria-hidden="true" style={{color:"var(--text-faint)"}}/>
    <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-lg)",color:"var(--text)",marginTop:"var(--sp-3)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{title}</div>
    <p style={{fontSize:"var(--fs-sm)",color:"var(--text-muted)",maxWidth:420,margin:"var(--sp-2) auto 0"}}>{body}</p>
    {onAction && <button className="fb-btn" style={{marginTop:"var(--sp-4)"}} onClick={onAction}>{actionLabel}</button>}
  </div>;
}

// ── Tab: FBOverview ──
function FBOverview({summary,ufwc}) {
  const [wcMetric,setWcMetric] = useState("wins");
  const [goalMetric,setGoalMetric] = useState("total");

  const stats = useMemo(function(){
    var t = summary.totals;

    // World Cup honours — wins and finals come from the honours list, tournament
    // appearances from the precomputed counts.
    var honours = {};
    WC_WINNERS.forEach(function(w){
      honours[w.winner] = honours[w.winner] || {team:w.winner,wins:0,finals:0};
      honours[w.runnerUp] = honours[w.runnerUp] || {team:w.runnerUp,wins:0,finals:0};
      honours[w.winner].wins++; honours[w.winner].finals++; honours[w.runnerUp].finals++;
    });
    Object.keys(honours).forEach(function(k){ honours[k].appearances = summary.wcAppearances[k] || 0; });

    var years = Object.keys(summary.perYear).sort();
    var spark = years.slice(-24).map(function(y){return summary.perYear[y];});
    var playedThisYear = summary.perYear[String(new Date().getFullYear())] || 0;
    var today = new Date().toISOString().substring(0,10);

    return {
      total:t.matches, totalGoals:t.goals, avgGoals:t.avgGoals, teams:t.nations,
      tournaments:t.tournaments, wcMatches:t.wcMatches,
      wcHonours:Object.values(honours), decadeData:summary.decades,
      recent:summary.recent, spark:spark, playedThisYear:playedThisYear,
      upcoming: FIXTURES_2026.filter(function(f){ return f.date >= today; }).slice(0,4),
    };
  },[summary]);

  const wcChart = useMemo(function(){
    var key = wcMetric;
    return stats.wcHonours.slice()
      .filter(function(d){return d[key] > 0;})
      .sort(function(a,b){return b[key]-a[key] || b.wins-a.wins;}).slice(0,10)
      .map(function(d,i){return Object.assign({},d,{value:d[key],fill:fbSeriesColor(i)});});
  },[stats.wcHonours,wcMetric]);

  const ufwcRecent = ufwc.changes || [];
  const defences = ufwc.defences || 0;
  const titleMatches = ufwc.titleMatches || ufwc.history.length;

  return <div>
    {/* 1 · Hero */}
    <section className="fb-card sn-anim-in" style={{padding:"var(--sp-6)",marginBottom:"var(--sp-4)"}} aria-labelledby="fb-hero-h">
      <h2 id="fb-hero-h" style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xl)",color:"var(--text)",textTransform:"uppercase",letterSpacing:"0.03em",margin:0,fontWeight:600}}>
        Every international, since 1872
      </h2>
      <p style={{fontSize:"var(--fs-base)",color:"var(--text-muted)",maxWidth:640,marginTop:"var(--sp-2)"}}>
        {stats.total.toLocaleString()} sanctioned men&rsquo;s internationals across {stats.tournaments} competitions and {stats.teams} nations —
        head-to-heads, tournament histories and the unofficial world championship lineage.
      </p>
      <button
        onClick={function(){ window.dispatchEvent(new CustomEvent("sn:open-search")); }}
        className="fb-search"
        style={{marginTop:"var(--sp-4)",display:"flex",alignItems:"center",gap:"var(--sp-2)",textAlign:"left",color:"var(--text-faint)",maxWidth:520,cursor:"pointer"}}
      >
        <Search size={16} aria-hidden="true"/>
        Search any nation, fixture or tournament
        <kbd style={{marginLeft:"auto",padding:"2px 6px",background:"var(--surface-raised)",borderRadius:4,fontSize:12,fontFamily:"var(--font-mono)"}}>⌘K</kbd>
      </button>
    </section>

    {/* 2 · KPI bar */}
    <h2 className="sr-only">Key numbers</h2>
    <div className="fb-grid fb-kpis" style={{marginBottom:"var(--sp-4)"}}>
      <FBKpi value={stats.total.toLocaleString()} label="Total matches" hintId={"kpi-"+'total-matches'} Icon={ListOrdered}
             hint="Every sanctioned men's international in the archive, from 1872 to today."
             delta={stats.playedThisYear ? `+${stats.playedThisYear.toLocaleString()} in ${new Date().getFullYear()}` : null}
             spark={stats.spark} onClick={function(){_fbNavToTab("allresults");}}/>
      <FBKpi value={stats.totalGoals.toLocaleString()} label="Total goals" hintId={"kpi-"+'total-goals'} Icon={Goal}
             hint="Goals scored in those matches, excluding penalty shoot-outs."
             onClick={function(){_fbNavToTab("decades");}}/>
      <FBKpi value={stats.avgGoals} label="Avg goals/match" hintId={"kpi-"+'avg-goals-match'} Icon={BarChart3}
             hint="Average goals per match across all sanctioned internationals since 1872."
             onClick={function(){_fbNavToTab("decades");}}/>
      <FBKpi value={stats.teams} label="Nations" hintId={"kpi-"+'nations'} Icon={Globe2}
             hint="Nations and territories with at least one international on record."
             onClick={function(){_fbNavToTab("teams");}}/>
      <FBKpi value={stats.tournaments} label="Competitions" hintId={"kpi-"+'competitions'} Icon={Layers}
             hint="Distinct competitions represented, from friendlies to the World Cup."
             onClick={function(){_fbNavToTab("worldcup");}}/>
      <FBKpi value={stats.wcMatches.toLocaleString()} label="World Cup matches" hintId={"kpi-"+'world-cup-matches'} Icon={Trophy}
             hint="Matches played at World Cup finals tournaments, 1930–2026."
             onClick={function(){_fbNavToTab("worldcup");}}/>
    </div>

    {/* 3 · Featured: fixtures + UFWC lineage */}
    <div className="fb-grid-2" style={{marginBottom:"var(--sp-4)"}}>
      <FBCard title="Next fixtures" icon={<Calendar size={16}/>}>
        {stats.upcoming.length === 0
          ? <FBEmpty title="No fixtures scheduled" body="The international calendar is empty right now — the next window opens in September." actionLabel="See the full schedule" onAction={function(){_fbNavToTab("fixtures");}}/>
          : <div>
              {stats.upcoming.map(function(f,i){
                return <div key={i} style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",padding:"10px 0",borderBottom:"1px solid var(--line)"}}>
                  <span className="tabular" style={{fontFamily:"var(--font-mono)",fontSize:"var(--fs-2xs)",color:"var(--text-faint)",width:96,flexShrink:0}}>
                    {new Date(f.date+"T00:00:00").toLocaleDateString(undefined,{day:"numeric",month:"short"})}
                  </span>
                  <span style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}>
                    <FBFlag team={f.home} size={18}/>
                    <span style={{fontSize:"var(--fs-sm)",color:"var(--text)",fontWeight:600}}>{f.home}</span>
                    <span style={{color:"var(--text-faint)",fontSize:"var(--fs-2xs)"}}>v</span>
                    <FBFlag team={f.away} size={18}/>
                    <span style={{fontSize:"var(--fs-sm)",color:"var(--text)",fontWeight:600}}>{f.away}</span>
                  </span>
                  <span style={{fontSize:"var(--fs-2xs)",color:"var(--text-faint)",whiteSpace:"nowrap"}}>{f.venue || f.city}</span>
                </div>;
              })}
              <div style={{fontSize:"var(--fs-2xs)",color:"var(--text-faint)",marginTop:"var(--sp-2)"}}>
                Dates shown in your local time zone · kick-off times to be confirmed
              </div>
              <button className="fb-link" onClick={function(){_fbNavToTab("fixtures");}} style={{marginTop:"var(--sp-3)",display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",padding:0}}>
                All fixtures <ArrowRight size={14} aria-hidden="true"/>
              </button>
            </div>}
      </FBCard>

      <FBCard title="Unofficial World Champion" icon={<Crown size={16}/>}>
        <div style={{display:"flex",alignItems:"center",gap:"var(--sp-4)",flexWrap:"wrap"}}>
          <FBFlagBadge team={ufwc.holder} size={44}/>
          <div style={{minWidth:0}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xl)",fontWeight:600,color:"var(--text)",lineHeight:1.1}}>{ufwc.holder}</div>
            <div style={{fontSize:"var(--fs-sm)",color:"var(--text-muted)"}}>
              <span className="tabular">{defences}</span> successful {defences===1?"defence":"defences"} · {titleMatches.toLocaleString()} title matches all-time
            </div>
          </div>
        </div>
        <div style={{marginTop:"var(--sp-4)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xs)",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-muted)",marginBottom:"var(--sp-2)"}}>Last five title changes</div>
          {ufwcRecent.map(function(h,i){
            return <div key={i} style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",padding:"7px 0",borderBottom:"1px solid var(--line)"}}>
              <span className="tabular" style={{fontFamily:"var(--font-mono)",fontSize:"var(--fs-2xs)",color:"var(--text-faint)",width:82,flexShrink:0}}>{h.date}</span>
              <FBFlag team={h.challenger} size={18}/>
              <span style={{fontSize:"var(--fs-sm)",color:"var(--text)",fontWeight:600}}>{h.challenger}</span>
              <span style={{fontSize:"var(--fs-2xs)",color:"var(--text-muted)"}}>beat {h.holder}</span>
              <span className="tabular" style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:"var(--fs-2xs)",color:"var(--text-muted)"}}>{h.challengerScore}–{h.holderScore}</span>
            </div>;
          })}
          <button className="fb-link" onClick={function(){_fbNavToTab("ufwc");}} style={{marginTop:"var(--sp-3)",display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",padding:0}}>
            Full UFWC lineage <ArrowRight size={14} aria-hidden="true"/>
          </button>
        </div>
      </FBCard>
    </div>

    {/* 4 · Charts — each panel fails on its own, the rest of the page survives */}
    <div className="fb-grid-2">
      <FBErrorBoundary label="World Cup honours">
      <FBCard title="World Cup honours" icon={<Trophy size={16}/>}
        action={<div role="group" aria-label="World Cup metric" style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {[["wins","Wins"],["finals","Finals"],["appearances","Appearances"]].map(function(o){
            return <button key={o[0]} className={"fb-btn"+(wcMetric===o[0]?" active":"")} onClick={function(){setWcMetric(o[0]);}} aria-pressed={wcMetric===o[0]}>{o[1]}</button>;
          })}
          <FBDownloadChart targetId="fb-chart-wc" filename={"world-cup-"+wcMetric}/>
        </div>}>
        <div id="fb-chart-wc" className="fb-chart-scroll" style={{minHeight:CHART_H}} role="img" aria-label={`Top nations by World Cup ${wcMetric}`}>
          <FBWhenVisible>
            <Suspense fallback={<ChartSkeleton/>}>
              <OverviewChart kind="worldcup" data={wcChart} metric={wcMetric}/>
            </Suspense>
          </FBWhenVisible>
        </div>
        <FBChartTable caption={`World Cup ${wcMetric} by nation`} columns={["Nation", wcMetric]} rows={wcChart.map(function(d){return [d.team, String(d.value)];})}/>
      </FBCard>
      </FBErrorBoundary>

      <FBErrorBoundary label="Goals per decade">

      <FBCard title="Goals per decade" icon={<Goal size={16}/>}
        action={<div role="group" aria-label="Goals metric" style={{display:"flex",gap:4}}>
          {[["total","Total goals"],["per","Goals per match"]].map(function(o){
            return <button key={o[0]} className={"fb-btn"+(goalMetric===o[0]?" active":"")} onClick={function(){setGoalMetric(o[0]);}} aria-pressed={goalMetric===o[0]}>{o[1]}</button>;
          })}
          <FBDownloadChart targetId="fb-chart-goals" filename={"goals-per-decade-"+goalMetric}/>
        </div>}>
        <div id="fb-chart-goals" className="fb-chart-scroll" style={{minHeight:CHART_H}} role="img"
             aria-label={`${goalMetric==="total"?"Total goals":"Goals per match"} by decade, ${stats.decadeData[0]?.decade} to ${stats.decadeData[stats.decadeData.length-1]?.decade}`}>
          <FBWhenVisible>
            <Suspense fallback={<ChartSkeleton/>}>
              <OverviewChart kind="goals" data={stats.decadeData} metric={goalMetric}/>
            </Suspense>
          </FBWhenVisible>
        </div>
        <FBChartTable caption="Goals by decade" columns={["Decade","Goals","Matches","Goals per match"]}
          rows={stats.decadeData.map(function(d){return [d.decade, d.goals.toLocaleString(), d.matches.toLocaleString(), String(d.perMatch)];})}/>
      </FBCard>
      </FBErrorBoundary>
    </div>

    {/* 5 · Recent results, full width */}
    <FBErrorBoundary label="Recent results">
      <FBCard title="Recent results" icon={<ListOrdered size={16}/>} action={<FBShareButton/>}>
        <FBResultsList matches={stats.recent} onViewAll={function(){_fbNavToTab("allresults");}}/>
      </FBCard>
    </FBErrorBoundary>

    {/* 6 · Explore grid */}
    <h2 style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-lg)",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text-muted)",margin:"var(--sp-6) 0 var(--sp-3)"}}>Explore</h2>
    <div className="fb-grid-3">
      <FBExploreCard Icon={Trophy} title="World Cup" blurb="Every tournament from 1930 to 2026, group by group." count={`${stats.wcMatches.toLocaleString()} matches`} onClick={function(){_fbNavToTab("worldcup");}}/>
      <FBExploreCard Icon={Trophy} title="Euros" blurb="European Championship winners, finals and records." count={`${EURO_WINNERS.length} tournaments`} onClick={function(){_fbNavToTab("euros");}}/>
      <FBExploreCard Icon={Trophy} title="Copa América" blurb="South America's championship, 1916 to today." count={`${COPA_WINNERS.length} tournaments`} onClick={function(){_fbNavToTab("copa");}}/>
      <FBExploreCard Icon={Crown} title="UFWC" blurb="The unofficial title, defended match by match." count={`${titleMatches.toLocaleString()} title matches`} onClick={function(){_fbNavToTab("ufwc");}}/>
      <FBExploreCard Icon={Swords} title="Head to head" blurb="Compare any two nations across their whole history." count={`${stats.teams} nations`} onClick={function(){_fbNavToTab("h2h");}}/>
      <FBExploreCard Icon={ListOrdered} title="Records" blurb="Biggest wins, highest scoring games, best win rates." count="All-time" onClick={function(){_fbNavToTab("records");}}/>
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
    <h3><span className="icon"><Trophy size={16}/></span>Knockout Stage</h3>
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

    <FBCard title="Select Year" icon={<Calendar size={16}/>}>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {years.map(function(y){return <button key={y} className={"fb-page-btn"+(selYear===y?" active":"")} style={selYear===y?{background:"rgba(26,86,219,0.25)",color:"#f8fafc"}:{}} onClick={function(){setSelYear(y);}}>{y}</button>;})}
      </div>
    </FBCard>

    {selYear && <div>
      {winnerEntry && <FBCard title={selYear + " " + title} icon={<Trophy size={16}/>}>
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
        <h3 style={{color:"#94a3b8",fontSize:13,fontWeight:700,margin:"12px 0 8px",textTransform:"uppercase",letterSpacing:"0.06em"}}><ClipboardList size={14} aria-hidden="true" style={{verticalAlign:"-2px",marginRight:6}}/>Group Stage</h3>
        <WCGroupStage groups={wcData[selYear].groups} yearMatches={yearMatches} year={selYear}/>
      </div>}

      {wcData && wcData[selYear] && wcData[selYear].knockout && wcData[selYear].knockout.length > 0 &&
        <WCKnockout knockout={wcData[selYear].knockout}/>}

      <FBCard title={selYear + " All Matches"} icon={<Goal size={16}/>}>
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

      {yearStandings.length>0 && <FBCard title={selYear + " Standings"} icon={<BarChart3 size={16}/>}>
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

    <FBCard title={"All-Time " + title + " Table (Top 30)"} icon={<Medal size={16}/>}>
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
    <FBCard title="British Home Championship Titles" icon={<Trophy size={16}/>}>
      <FBLazyChart kind="bhc-titles" data={titlesByNation} height={200}/>
    </FBCard>

    <FBCard title="Select Year" icon={<Calendar size={16}/>}>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {years.map(function(y){return <button key={y} className={"fb-page-btn"+(selYear===y?" active":"")} style={selYear===y?{background:"rgba(26,86,219,0.25)",color:"#f8fafc"}:{}} onClick={function(){setSelYear(y);}}>{y}</button>;})}
      </div>
    </FBCard>

    {selYear && <div>
      {yearStandings.length>0 && <FBCard title={selYear + " Standings"} icon={<BarChart3 size={16}/>}>
        <FBMT headers={["#","Team","P","W","D","L","GF","GA","GD","Pts"]} alignRight={[2,3,4,5,6,7,8,9]}
          rows={yearStandings.map(function(t,i){return [
            i+1,<FBTeamLabel team={t.team} size={13}/>,t.p,t.w,t.d,t.l,t.gf,t.ga,
            <span style={{color:t.gf-t.ga>0?"#3ddc84":t.gf-t.ga<0?"#ef4444":"#94a3b8"}}>{t.gf-t.ga>0?"+":""}{t.gf-t.ga}</span>,
            <span style={{fontWeight:700,color:"#d4a017"}}>{t.w*3+t.d}</span>
          ];})}/>
      </FBCard>}
      <FBCard title={selYear + " Results"} icon={<Goal size={16}/>}>
        <FBMT headers={["Date","Home","Score","Away"]} alignRight={[2]}
          rows={yearMatches.map(function(m){return [
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
            <FBTeamLabel team={m.home_team} size={13}/>,
            <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.home_score}-{m.away_score}</span>,
            <FBTeamLabel team={m.away_team} size={13}/>
          ];})}/>
      </FBCard>
    </div>}

    <FBCard title="All-Time Table" icon={<Medal size={16}/>}>
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
    <FBCard title="Current UFWC Holder" icon={<Crown size={16}/>}>
      <div style={{display:"flex",alignItems:"center",gap:20,padding:12}}>
        <FBFlagBadge team={ufwc.holder} size={56}/>
        <div>
          <div style={{fontSize:24,fontWeight:800,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif"}}>{ufwc.holder}</div>
          <div style={{color:"#94a3b8",fontSize:12}}>Unofficial Football World Champion</div>
          <div style={{color:"#64748b",fontSize:11,marginTop:4}}>Title defences tracked: {ufwc.history.length.toLocaleString()}</div>
        </div>
      </div>
    </FBCard>

    <FBCard title="Title Matches" icon={<Goal size={16}/>}>
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

    <FBCard title="Most Times Holder (Top 20)" icon={<BarChart3 size={16}/>}>
      <FBLazyChart kind="ufwc-holders" data={holderCounts} height={400}/>
    </FBCard>

    <FBCard title="Longest Holder Streaks" icon={<Flame size={16}/>}>
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
      {name:team1+" Wins",value:t1w,fill:"var(--accent)"},
      {name:"Draws",value:dr,fill:"var(--text-faint)"},
      {name:team2+" Wins",value:t2w,fill:"var(--accent-warn)"}
    ].filter(function(d){return d.value>0;});

    return {matches:ms,t1w:t1w,t2w:t2w,dr:dr,t1g:t1g,t2g:t2g,total:ms.length,byComp:Object.values(byComp).sort(function(a,b){return b.p-a.p;}),pieData:pieData};
  },[matches,team1,team2]);

  const biggest = useMemo(function(){
    var best1=null,best2=null;
    h2h.matches.forEach(function(m){
      var r = getMatchScoreForTeam(m,team1);
      var margin = r.scored - r.conceded;
      if(margin>0 && (!best1 || margin>best1.margin)) best1={m:m,margin:margin};
      if(margin<0 && (!best2 || -margin>best2.margin)) best2={m:m,margin:-margin};
    });
    return {best1:best1,best2:best2};
  },[h2h.matches,team1]);

  function swap(){ setTeam1(team2); setTeam2(team1); }

  return <div>
    <FBCard title="Head to head" icon={<Swords size={16}/>} action={<FBShareButton/>}>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"var(--sp-3)",alignItems:"center",marginBottom:"var(--sp-5)"}}>
        <label style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",minWidth:0}}>
          <span className="sr-only">First nation</span>
          <FBFlagBadge team={team1} size={30}/>
          <select className="fb-select" style={{flex:1,minWidth:0}} value={team1} onChange={function(e){setTeam1(e.target.value);}}>
            {allTeams.map(function(t){return <option key={t} value={t}>{t}</option>;})}
          </select>
        </label>
        <button className="fb-btn" onClick={swap} aria-label={`Swap ${team1} and ${team2}`} title="Swap sides">
          <RefreshCw size={14} aria-hidden="true"/>
        </button>
        <label style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",minWidth:0,justifyContent:"flex-end"}}>
          <span className="sr-only">Second nation</span>
          <select className="fb-select" style={{flex:1,minWidth:0}} value={team2} onChange={function(e){setTeam2(e.target.value);}}>
            {allTeams.map(function(t){return <option key={t} value={t}>{t}</option>;})}
          </select>
          <FBFlagBadge team={team2} size={30}/>
        </label>
      </div>

      <div className="fb-grid" style={{marginBottom:"var(--sp-4)"}}>
        <FBSB value={h2h.total} label="Matches"/>
        <FBSB value={h2h.t1w} label={team1+" wins"}/>
        <FBSB value={h2h.dr} label="Draws"/>
        <FBSB value={h2h.t2w} label={team2+" wins"}/>
        <FBSB value={(h2h.t1g-h2h.t2g>0?"+":"")+(h2h.t1g-h2h.t2g)} label={"Goal difference ("+team1+")"}/>
        <FBSB value={h2h.t1g+"–"+h2h.t2g} label="Goals for and against"/>
      </div>

      <div className="fb-grid-2" style={{marginBottom:"var(--sp-4)"}}>
        {[[biggest.best1,team1],[biggest.best2,team2]].map(function(pair,i){
          var b = pair[0];
          return <div key={i} style={{padding:"var(--sp-3)",background:"var(--surface-raised)",borderRadius:"var(--r-md)",border:"1px solid var(--line)"}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xs)",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-muted)"}}>Biggest {pair[1]} win</div>
            {b
              ? <div style={{marginTop:6,color:"var(--text)",fontSize:"var(--fs-sm)"}}>
                  <span className="tabular" style={{fontFamily:"var(--font-mono)",fontWeight:700}}>{b.m.home_score}–{b.m.away_score}</span>
                  {" "}{b.m.home_team} v {b.m.away_team}
                  <span style={{color:"var(--text-faint)"}}> · {b.m.date}</span>
                </div>
              : <div style={{marginTop:6,color:"var(--text-faint)",fontSize:"var(--fs-sm)"}}>No win on record</div>}
          </div>;
        })}
      </div>

      {h2h.pieData.length>0 && <div style={{display:"flex",justifyContent:"center",marginBottom:"var(--sp-4)"}}>
        <FBLazyChart kind="h2h-pie" data={h2h.pieData} height={200} width={280}/>
      </div>}
    </FBCard>

    {h2h.byComp.length>0 && <FBCard title="By competition" icon={<Trophy size={16}/>}>
      <FBMT headers={["Tournament","P",team1+" W","D",team2+" W"]} alignRight={[1,2,3,4]}
        rows={h2h.byComp.map(function(c){return [c.comp,c.p,c.t1w,c.d,c.t2w];})}/>
    </FBCard>}

    <FBCard title="All Matches" icon={<ClipboardList size={16}/>}>
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
    <FBCard title="Matches & Average Goals by Decade" icon={<BarChart3 size={16}/>}>
      <FBLazyChart kind="decades" data={data} height={320}/>
    </FBCard>

    <FBCard title="Decade Summary" icon={<Calendar size={16}/>}>
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
    <FBCard title="Top International Scorers (All Time, to 9 Aug 2026)" icon={<Goal size={16}/>}>
      <FBMT headers={["#","Player","Country","Goals","Caps"]} alignRight={[3,4]}
        rows={TOP_INTL_SCORERS.map(function(p,i){return [
          i+1,
          <span style={{fontWeight:600,color:"#f8fafc"}}>{p.player}</span>,
          <FBTeamLabel team={p.country} size={13}/>,
          <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{p.goals}</span>,
          p.caps
        ];})}/>
    </FBCard>

    <FBCard title="World Cup Golden Boots" icon={<Award size={16}/>}>
      <FBMT headers={["Year","Player","Country","Goals"]} alignRight={[0,3]}
        rows={WC_GOLDEN_BOOTS.map(function(b){return [
          <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#d4a017"}}>{b.year}</span>,
          <span style={{fontWeight:600,color:"#f8fafc"}}>{b.player}</span>,
          <span style={{color:"#cbd5e1"}}>{b.country}</span>,
          <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{b.goals}</span>
        ];})}/>
    </FBCard>

    <FBCard title="Highest Win Rate (min 100 matches)" icon={<BarChart3 size={16}/>}>
      <FBMT headers={["#","Team","P","W","D","L","Win%"]} alignRight={[2,3,4,5,6]}
        rows={records.winRates.map(function(t,i){return [
          i+1,
          <FBTeamLabel team={t.team} size={13}/>,
          t.p,t.w,t.d,t.l,
          <span style={{fontWeight:700,color:t.winPct>=60?"#3ddc84":t.winPct>=45?"#d4a017":"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{t.winPct}%</span>
        ];})}/>
    </FBCard>

    <FBCard title="Biggest Victories" icon={<Zap size={16}/>}>
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

    <FBCard title="Highest Scoring Matches" icon={<Flame size={16}/>}>
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
    <FBCard title="Matches by Host Country (Top 25)" icon={<MapPin size={16}/>}>
      <FBLazyChart kind="venues" data={chartData} height={500}/>
    </FBCard>

    <FBCard title="All Host Countries" icon={<ClipboardList size={16}/>}>
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

// ── Sharing ──────────────────────────────────────────────────────────────────

/** Copies the current URL — every view already encodes its state in the hash. */
function FBShareButton({label="Share this view"}) {
  const [done,setDone] = useState(false);
  return <button className="fb-btn" title={label} aria-label={label}
    onClick={function(){
      var url = window.location.href;
      var ok = function(){ setDone(true); setTimeout(function(){setDone(false);},1600); };
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, ok);
      else ok();
    }}>
    <Link2 size={14} aria-hidden="true"/>{done ? "Link copied" : "Share"}
  </button>;
}

/** Renders an SVG chart node to a PNG the reader can keep. */
function FBDownloadChart({targetId, filename}) {
  return <button className="fb-btn" aria-label="Download this chart as a PNG"
    onClick={function(){
      var host = document.getElementById(targetId);
      var svg = host && host.querySelector("svg");
      if(!svg) return;
      var clone = svg.cloneNode(true);
      var box = svg.getBoundingClientRect();
      clone.setAttribute("width", box.width);
      clone.setAttribute("height", box.height);
      // Inline the computed token colours: the CSS variables do not survive
      // serialisation into a standalone image.
      var srcNodes = svg.querySelectorAll("*"), outNodes = clone.querySelectorAll("*");
      for(var i=0;i<srcNodes.length;i++){
        var cs = window.getComputedStyle(srcNodes[i]);
        ["fill","stroke","color"].forEach(function(prop){
          var v = cs.getPropertyValue(prop);
          if(v && v !== "none") outNodes[i].setAttribute(prop, v);
        });
      }
      var data = new XMLSerializer().serializeToString(clone);
      var img = new Image();
      img.onload = function(){
        var canvas = document.createElement("canvas");
        var scale = 2;
        canvas.width = box.width*scale; canvas.height = box.height*scale;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--surface") || "#151f33";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.setTransform(scale,0,0,scale,0,0);
        ctx.drawImage(img,0,0);
        var a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = (filename||"statnations-chart")+".png";
        a.click();
      };
      img.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(data)));
    }}>
    <Download size={14} aria-hidden="true"/>PNG
  </button>;
}

// ── Navigation: dropdown tab, team picker, breadcrumbs ───────────────────────

/** A primary tab that opens a menu of sub-views (Competitions, Explore). */
function FBMenuTab(props) {
  var label=props.label, items=props.items, activeKey=props.activeKey, onPick=props.onPick;
  var TabIcon = props.Icon;
  const [open,setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = items.some(function(i){return i.key===activeKey;});

  useEffect(function(){
    if(!open) return;
    function onDoc(e){ if(ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e){ if(e.key==="Escape") setOpen(false); }
    document.addEventListener("mousedown",onDoc);
    document.addEventListener("keydown",onKey);
    return function(){ document.removeEventListener("mousedown",onDoc); document.removeEventListener("keydown",onKey); };
  },[open]);

  return <div ref={ref} style={{position:"relative"}}>
    <button className={"fb-tab-btn"+(isActive?" active":"")} onClick={function(){setOpen(!open);}}
            aria-expanded={open} aria-haspopup="menu">
      <TabIcon size={14} aria-hidden="true"/>{label}<ChevronDown size={13} aria-hidden="true"/>
    </button>
    {open && <div className="fb-menu" role="menu">
      {items.map(function(i){
        return <button key={i.key} role="menuitem" aria-current={activeKey===i.key}
          onClick={function(){ setOpen(false); onPick(i.key); }}>
          <ChevronRight size={13} aria-hidden="true" style={{opacity:0.5}}/>{i.label}
        </button>;
      })}
    </div>}
  </div>;
}

/** Command-palette style picker over every nation in the dataset. */
function FBTeamPicker({open, onClose, teams, recent, onPick}) {
  const [q,setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(function(){
    if(open) { setQ(""); setTimeout(function(){ inputRef.current && inputRef.current.focus(); },10); }
  },[open]);

  useEffect(function(){
    if(!open) return;
    function onKey(e){ if(e.key==="Escape") onClose(); }
    document.addEventListener("keydown",onKey);
    return function(){ document.removeEventListener("keydown",onKey); };
  },[open,onClose]);

  const list = useMemo(function(){
    var needle = q.trim().toLowerCase();
    if(!needle) return teams.slice(0,120);
    return teams.filter(function(t){return t.toLowerCase().indexOf(needle)>=0;}).slice(0,120);
  },[q,teams]);

  if(!open) return null;

  return <div role="dialog" aria-modal="true" aria-label="Choose a nation"
    onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}
    style={{position:"fixed",inset:0,zIndex:"var(--z-modal)",background:"rgba(3,7,16,0.72)",
            backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"10vh var(--sp-4) var(--sp-4)"}}>
    <div style={{background:"var(--surface)",border:"1px solid var(--line-strong)",borderRadius:"var(--r-lg)",
                 boxShadow:"var(--elev-3)",width:"min(620px,100%)",maxHeight:"70vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",padding:"var(--sp-3)",borderBottom:"1px solid var(--line)"}}>
        <Search size={16} aria-hidden="true" style={{color:"var(--text-faint)"}}/>
        <input ref={inputRef} value={q} onChange={function(e){setQ(e.target.value);}}
               placeholder={`Search ${teams.length} nations…`}
               aria-label="Search nations"
               style={{flex:1,background:"transparent",border:"none",outline:"none",color:"var(--text)",fontSize:"var(--fs-base)",fontFamily:"var(--font-body)"}}/>
        <button onClick={onClose} aria-label="Close" style={{display:"flex",background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer"}}>
          <X size={16} aria-hidden="true"/>
        </button>
      </div>
      {!q && recent.length>0 && <div style={{padding:"var(--sp-3) var(--sp-3) 0"}}>
        <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xs)",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-faint)",marginBottom:"var(--sp-2)"}}>Recently viewed</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {recent.map(function(t){
            return <button key={t} className="fb-btn" onClick={function(){onPick(t);}} style={{textTransform:"none",letterSpacing:0}}>
              <FBFlag team={t} size={16}/>{t}
            </button>;
          })}
        </div>
      </div>}
      <div style={{overflowY:"auto",padding:"var(--sp-2)"}}>
        {list.length===0 && <div style={{padding:"var(--sp-6)",textAlign:"center",color:"var(--text-muted)",fontSize:"var(--fs-sm)"}}>No nation matches “{q}”.</div>}
        {list.map(function(t){
          return <button key={t} onClick={function(){onPick(t);}}
            style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",width:"100%",padding:"10px var(--sp-3)",
                    background:"transparent",border:"none",borderRadius:"var(--r-sm)",cursor:"pointer",
                    color:"var(--text)",fontSize:"var(--fs-sm)",textAlign:"left",minHeight:44}}
            onMouseOver={function(e){e.currentTarget.style.background="var(--surface-raised)";}}
            onMouseOut={function(e){e.currentTarget.style.background="transparent";}}>
            <FBFlag team={t} size={22}/>{t}
          </button>;
        })}
      </div>
    </div>
  </div>;
}

/** Breadcrumb + a persistent way back to the overview on every sub-page. */
function FBCrumbs({tab, label, onHome}) {
  if(tab === "overview") return null;
  return <nav aria-label="Breadcrumb" style={{display:"flex",alignItems:"center",gap:6,marginBottom:"var(--sp-3)",fontSize:"var(--fs-sm)"}}>
    <button onClick={onHome} className="fb-link" style={{background:"none",border:"none",padding:0,display:"inline-flex",alignItems:"center",gap:4}}>
      <ChevronRight size={13} aria-hidden="true" style={{transform:"rotate(180deg)"}}/> Football overview
    </button>
    <span style={{color:"var(--text-faint)"}}>/</span>
    <span style={{color:"var(--text-muted)"}}>{label}</span>
  </nav>;
}

// ── Tab: FBFixtures ──
function FBFixtures({matches}) {
  var today = new Date().toISOString().substring(0,10);
  const [view,setView] = useState("upcoming"); // "upcoming" | "recent"

  // ── Upcoming fixtures from FIXTURES_2026 (future dates only) ──
  var upcomingFixtures = useMemo(function(){
    var future = FIXTURES_2026.filter(function(f){ return f.date > today; });
    // Group by month
    var byMonth = {};
    future.forEach(function(f){
      var month = f.date.substring(0,7);
      if(!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(f);
    });
    return { list: future, byMonth: byMonth, months: Object.keys(byMonth).sort() };
  },[today]);

  // ── Recent results (last 6 months) ──
  const recentData = useMemo(function(){
    var cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);
    var cutoffStr = cutoff.toISOString().substring(0,10);
    var recent = matches.filter(function(m){ return m.date >= cutoffStr && m.date <= today; });
    var byMonth = {};
    recent.slice().reverse().forEach(function(m){
      var month = m.date.substring(0,7);
      if(!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(m);
    });
    return { list: recent, byMonth: byMonth, months: Object.keys(byMonth).sort().reverse(), cutoffStr: cutoffStr };
  },[matches, today]);

  return <div>
    <FBCard title="Fixtures & Results" icon={<CalendarDays size={16}/>}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button className={"fb-btn"+(view==="upcoming"?" active":"")} onClick={function(){setView("upcoming");}}>
          Upcoming ({upcomingFixtures.list.length})
        </button>
        <button className={"fb-btn"+(view==="recent"?" active":"")} onClick={function(){setView("recent");}}>
          Recent Results ({recentData.list.length})
        </button>
      </div>
      {view==="upcoming" && upcomingFixtures.list.length===0 &&
        <div style={{color:"#94a3b8",fontSize:13}}>No upcoming fixtures scheduled.</div>}
      {view==="recent" &&
        <div style={{color:"#94a3b8",fontSize:12,marginBottom:8}}>
          Showing results from {recentData.cutoffStr} onwards
        </div>}
    </FBCard>

    {view==="upcoming" && upcomingFixtures.months.map(function(month){
      var monthName = new Date(month+"-01").toLocaleDateString("en-US",{year:"numeric",month:"long"});
      return <FBCard key={month} title={monthName} icon={<Calendar size={16}/>}>
        <FBMT headers={["Date","Home","","Away","Group / Round","Venue"]} alignRight={[]}
          rows={upcomingFixtures.byMonth[month].map(function(f){
            var isTBD = f.home==="TBD";
            return [
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{f.date}</span>,
              isTBD ? <span style={{color:"#64748b",fontSize:12}}>TBD</span> : <FBTeamLabel team={f.home} size={13}/>,
              <span style={{fontWeight:700,color:"#64748b",fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>vs</span>,
              isTBD ? <span style={{color:"#64748b",fontSize:12}}>TBD</span> : <FBTeamLabel team={f.away} size={13}/>,
              <span style={{color:"#94a3b8",fontSize:10}}>{f.group||f.tournament}</span>,
              <span style={{color:"#64748b",fontSize:10}}>{f.city}</span>
            ];
          })}/>
      </FBCard>;
    })}

    {view==="recent" && recentData.months.map(function(month){
      var monthName = new Date(month+"-01").toLocaleDateString("en-US",{year:"numeric",month:"long"});
      return <FBCard key={month} title={monthName} icon={<Calendar size={16}/>}>
        <FBMT headers={["Date","Home","Score","Away","Tournament"]} alignRight={[2]}
          rows={recentData.byMonth[month].map(function(m){return [
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
// Filter state lives in the query string so a filtered view can be linked and
// survives a refresh.
function useUrlFilters(defaults) {
  const [state,setState] = useState(function(){
    var params = new URLSearchParams(window.location.search);
    var out = Object.assign({},defaults);
    Object.keys(defaults).forEach(function(k){ if(params.get(k)!==null) out[k]=params.get(k); });
    return out;
  });
  const set = useCallback(function(key,value){
    setState(function(prev){
      var next = Object.assign({},prev); next[key]=value;
      var params = new URLSearchParams(window.location.search);
      Object.keys(next).forEach(function(k){
        if(next[k] && next[k] !== defaults[k]) params.set(k,next[k]); else params.delete(k);
      });
      var qs = params.toString();
      window.history.replaceState(null,"",window.location.pathname + (qs?"?"+qs:"") + window.location.hash);
      return next;
    });
  // defaults is a literal recreated each render; its keys are what matter
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return [state,set];
}

function FBAllResults({matches}) {
  const [filters,setFilter] = useUrlFilters({q:"",comp:"all",from:"",to:""});
  const search = filters.q, tournament = filters.comp;
  const [page,setPage] = useState(0);
  var PER_PAGE = 100;

  const tournaments = useMemo(function(){
    var s = new Set(matches.map(function(m){return m.tournament;}));
    return ["all"].concat([...s].sort());
  },[matches]);

  const filtered = useMemo(function(){
    var f = matches.slice().reverse();
    if(tournament!=="all") f = f.filter(function(m){return m.tournament===tournament;});
    if(filters.from) f = f.filter(function(m){return m.date >= filters.from;});
    if(filters.to) f = f.filter(function(m){return m.date <= filters.to;});
    if(search.trim()) {
      var q = search.toLowerCase();
      f = f.filter(function(m){return m.home_team.toLowerCase().indexOf(q)!==-1||m.away_team.toLowerCase().indexOf(q)!==-1||m.date.indexOf(q)!==-1||m.tournament.toLowerCase().indexOf(q)!==-1;});
    }
    return f;
  },[matches,tournament,search,filters.from,filters.to]);

  useEffect(function(){setPage(0);},[search,tournament,filters.from,filters.to]);

  var totalPages = Math.ceil(filtered.length/PER_PAGE);
  var pageData = filtered.slice(page*PER_PAGE,(page+1)*PER_PAGE);

  return <div>
    <FBCard title="All results" icon={<ListOrdered size={16}/>} action={<FBShareButton/>}>
      <div style={{display:"flex",gap:"var(--sp-3)",marginBottom:"var(--sp-4)",flexWrap:"wrap",alignItems:"center"}}>
        <input className="fb-search" placeholder="Search team, date or competition…" value={search}
               aria-label="Search results"
               onChange={function(e){setFilter("q",e.target.value);}} style={{maxWidth:320}}/>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:"var(--fs-sm)",color:"var(--text-muted)"}}>
          <span className="sr-only">Competition</span>
          <select className="fb-select" value={tournament} onChange={function(e){setFilter("comp",e.target.value);}}>
            {tournaments.map(function(t){return <option key={t} value={t}>{t==="all"?"All competitions":t}</option>;})}
          </select>
        </label>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:"var(--fs-sm)",color:"var(--text-muted)"}}>
          From <input type="date" className="fb-select" value={filters.from} onChange={function(e){setFilter("from",e.target.value);}} aria-label="From date"/>
        </label>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:"var(--fs-sm)",color:"var(--text-muted)"}}>
          To <input type="date" className="fb-select" value={filters.to} onChange={function(e){setFilter("to",e.target.value);}} aria-label="To date"/>
        </label>
        <span className="tabular" style={{color:"var(--text-muted)",fontSize:"var(--fs-sm)"}}>{filtered.length.toLocaleString()} matches</span>
      </div>

      <div style={{display:"flex",gap:"var(--sp-2)",marginBottom:"var(--sp-3)",alignItems:"center"}}>
        <button className="fb-page-btn" disabled={page===0} onClick={function(){setPage(function(p){return p-1;});}}>Previous</button>
        <span className="tabular" style={{color:"var(--text-muted)",fontSize:"var(--fs-sm)"}}>Page {page+1} of {totalPages || 1}</span>
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
        <FBCard title="Win % by Year" icon={<BarChart3 size={16}/>}>
          <FBLazyChart kind="team-winpct" data={yearlyData} accent={color} height={220}/>
        </FBCard>
        <FBCard title="Avg Goals per Match" icon={<Goal size={16}/>}>
          <FBLazyChart kind="team-goals" data={yearlyData} height={220}/>
        </FBCard>
      </div>

      <div className="fb-grid-2">
        <FBCard title="Biggest Wins" icon={<Zap size={16}/>}>
          <FBMT headers={["Date","Opponent","Score","Margin"]} alignRight={[2,3]}
            rows={extremes.bigWins.map(function(m){return [
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{m.date}</span>,
              <FBTeamLabel team={getOpponent(m,team)} size={13}/>,
              <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.scored}-{m.conceded}</span>,
              <span style={{fontWeight:700,color:"#3ddc84",fontFamily:"'JetBrains Mono',monospace"}}>+{m.margin}</span>
            ];})}/>
        </FBCard>
        <FBCard title="Biggest Losses" icon={<TrendingDown size={16}/>}>
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

    {subTab==="h2h" && <FBCard title={team + " vs Focus Teams"} icon={<Swords size={16}/>}>
      <FBMT headers={["Opponent","P","W","D","L","GF","GA","Win%"]} alignRight={[1,2,3,4,5,6,7]}
        rows={h2hFocus.map(function(h){return [
          <FBTeamLabel team={h.opponent} size={13}/>,
          h.played,h.w,h.d,h.l,h.gf,h.ga,
          <span style={{fontWeight:700,color:fbWinPct(h.w,h.played)>=50?"#3ddc84":"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{fbWinPct(h.w,h.played)}%</span>
        ];})}/>
    </FBCard>}

    {subTab==="form" && <div>
      <FBCard title="Last 20 Results" icon={<BarChart3 size={16}/>}>
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
      <FBCard title={team + " World Cup History"} icon={<Trophy size={16}/>}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {wcHistory.map(function(w,i){return <div key={i} style={{padding:"6px 12px",borderRadius:8,background:w.isWinner?"rgba(212,160,23,0.15)":w.isRunnerUp?"rgba(192,192,192,0.1)":w.participated?"rgba(26,86,219,0.06)":"rgba(255,255,255,0.02)",border:"1px solid "+(w.isWinner?"rgba(212,160,23,0.3)":w.participated?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)"),fontSize:11,textAlign:"center",minWidth:48,opacity:w.participated?1:0.3}}>
            <div style={{fontWeight:700,color:w.isWinner?"#d4a017":w.isRunnerUp?"#c0c0c0":"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>{w.year}</div>
            {w.isWinner && <div style={{fontSize:9,color:"#d4a017"}}>WINNER</div>}
            {w.isRunnerUp && <div style={{fontSize:9,color:"#c0c0c0"}}>Runner-up</div>}
          </div>;})}
        </div>
      </FBCard>

      <FBCard title={team + " World Cup Matches"} icon={<Goal size={16}/>}>
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
      return <div className="fb-card" style={{textAlign:"center",padding:"var(--sp-8)"}} role="alert">
        <AlertTriangle size={30} aria-hidden="true" style={{color:"var(--error)"}}/>
        <div style={{color:"var(--text)",fontSize:"var(--fs-lg)",fontWeight:600,margin:"var(--sp-3) 0 var(--sp-2)",fontFamily:"var(--font-display)",textTransform:"uppercase",letterSpacing:"0.04em"}}>
          {this.props.label ? this.props.label + " could not be shown" : "Something went wrong"}
        </div>
        <p style={{color:"var(--text-muted)",fontSize:"var(--fs-sm)",marginBottom:"var(--sp-4)"}}>{this.state.error ? this.state.error.message : "An error occurred rendering this panel."}</p>
        <button className="fb-btn" onClick={()=>this.setState({hasError:false,error:null})}>
          <RefreshCw size={14} aria-hidden="true"/> Try again
        </button>
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
  const [summary,setSummary] = useState(null);
  const [archiveError,setArchiveError] = useState(null);
  const [loading,setLoading] = useState(true);
  const [loadProgress,setLoadProgress] = useState("Downloading match data...");
  const [error,setError] = useState(null);
  const [activeTab,setActiveTab] = useState("overview");
  const [teamParam,setTeamParam] = useState("England");
  const [pickerOpen,setPickerOpen] = useState(false);
  // Six most recently viewed nations, kept in this browser only.
  const [recentTeams,setRecentTeams] = useState(function(){
    try { return JSON.parse(localStorage.getItem("sn.football.recentTeams") || "[]").slice(0,6); }
    catch { return []; }
  });

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

  useEffect(function(){
    if(activeTab !== "team" || !teamParam) return;
    setRecentTeams(function(prev){
      var next = [teamParam].concat(prev.filter(function(t){return t!==teamParam;})).slice(0,6);
      try { localStorage.setItem("sn.football.recentTeams", JSON.stringify(next)); } catch { /* private mode */ }
      return next;
    });
  },[activeTab,teamParam]);

  // ⌘K / the hero search button both open the global palette.
  useEffect(function(){
    function openSearch(){ window.dispatchEvent(new KeyboardEvent("keydown",{key:"k",metaKey:true})); }
    window.addEventListener("sn:open-search",openSearch);
    return function(){ window.removeEventListener("sn:open-search",openSearch); };
  },[]);

  // Data loads in two stages so the overview can paint immediately:
  //   1. football-summary.json (~15 KB) — precomputed aggregates, the last 60
  //      results and the UFWC lineage: everything the overview shows.
  //   2. football-all.json (~7 MB) — the full archive, fetched in the background
  //      and awaited only by views that need match-level data.
  useEffect(function(){
    var cancelled = false;
    async function loadSummary() {
      try {
        var res = await fetch("/data/football-summary.json");
        if(!res.ok) throw new Error("Failed to load football-summary.json: " + res.status);
        var data = await res.json();
        if(cancelled) return;
        setSummary(data);
        setLoading(false);
      } catch(e) {
        if(!cancelled) { setError(e.message); setLoading(false); }
      }
    }
    async function loadArchive() {
      try {
        setLoadProgress("Loading the full match archive…");
        var [matchRes, nameRes] = await Promise.all([
          fetch("/data/football-all.json"),
          fetch("/data/football-countries.json"),
        ]);
        if(!matchRes.ok) throw new Error("Failed to load football-all.json: " + matchRes.status);
        var [matchData, nameData] = await Promise.all([matchRes.json(), nameRes.ok ? nameRes.json() : []]);
        if(cancelled) return;

        var nm = {};
        (nameData || []).forEach(function(row){
          var keys = Object.keys(row);
          if(keys.length>=2 && row[keys[0]] && row[keys[1]]) nm[row[keys[0]].trim()] = row[keys[1]].trim();
        });

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
        if(!cancelled) setMatches(parsed);
      } catch(e) {
        console.error("Football archive load error:",e);
        if(!cancelled) setArchiveError(e.message);
      }
    }
    loadSummary();
    // Hold the 7 MB archive until the page has painted and the browser is idle,
    // so it never competes with the first render for bandwidth.
    var idle = null, t = null;
    function schedule(){
      if(window.requestIdleCallback) idle = window.requestIdleCallback(loadArchive, {timeout:4000});
      else t = setTimeout(loadArchive, 1200);
    }
    if(document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, {once:true});
    return function(){
      cancelled = true;
      window.removeEventListener("load", schedule);
      if(idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
      if(t) clearTimeout(t);
    };
  },[]);

  // UFWC comes from the summary until the archive arrives, then from the archive.
  const ufwc = useMemo(function(){
    if(matches.length) return computeUFWC(matches);
    if(summary) return {
      holder: summary.ufwc.holder,
      defences: summary.ufwc.defences,
      history: [],
      titleMatches: summary.ufwc.titleMatches,
      changes: summary.ufwc.changes,
    };
    return {holder:null,history:[]};
  },[matches,summary]);

  const navTab = useCallback(function(tab,param){
    if(param) {
      window.location.hash = "#/football/"+tab+"/"+encodeURIComponent(param);
    } else {
      window.location.hash = "#/football/"+tab;
    }
  },[]);

  // The hero and navigation are static chrome, so they render straight away and
  // only the content region shows a skeleton. Nothing below them can then shift.
  var contentSkeleton = <div aria-busy="true" aria-live="polite" style={{minHeight:"150vh"}}>
    <span className="sr-only">{loadProgress}</span>
    <div className="sn-skel" style={{height:196,borderRadius:"var(--r-lg)",marginBottom:"var(--sp-4)"}}/>
    <div className="fb-grid" style={{marginBottom:"var(--sp-4)"}}>
      {[0,1,2,3,4,5].map(function(i){return <div key={i} className="sn-skel" style={{height:132,borderRadius:"var(--r-lg)"}}/>;})}
    </div>
    <div className="fb-grid-2" style={{marginBottom:"var(--sp-4)"}}>
      <div className="sn-skel" style={{height:352,borderRadius:"var(--r-lg)"}}/>
      <div className="sn-skel" style={{height:352,borderRadius:"var(--r-lg)"}}/>
    </div>
    <div className="fb-grid-2" style={{marginBottom:"var(--sp-4)"}}>
      <div className="sn-skel" style={{height:392,borderRadius:"var(--r-lg)"}}/>
      <div className="sn-skel" style={{height:392,borderRadius:"var(--r-lg)"}}/>
    </div>
    <div className="sn-skel" style={{height:480,borderRadius:"var(--r-lg)"}}/>
  </div>;

  // ── Error state ──
  if(error) {
    return <div style={{maxWidth:720,margin:"0 auto",padding:"var(--sp-10) var(--sp-5)"}}>
      <style>{fbCSS}</style>
      <div className="fb-card" style={{textAlign:"center"}} role="alert">
        <AlertTriangle size={30} aria-hidden="true" style={{color:"var(--error)"}}/>
        <h1 style={{fontSize:"var(--fs-xl)",color:"var(--text)",margin:"var(--sp-3) 0 var(--sp-2)"}}>Football data could not be loaded</h1>
        <p style={{color:"var(--text-muted)",fontSize:"var(--fs-sm)",marginBottom:"var(--sp-4)"}}>{error}</p>
        <button className="fb-btn" onClick={function(){window.location.reload();}}>
          <RefreshCw size={14} aria-hidden="true"/> Retry
        </button>
      </div>
    </div>;
  }

  // ── Information architecture ──
  // One primary row. Competitions and Explore collapse into menus so the page no
  // longer opens with thirty chips above the fold.
  var COMPETITIONS = [
    {key:"worldcup",label:"World Cup"},
    {key:"euros",label:"European Championship"},
    {key:"copa",label:"Copa América"},
    {key:"nationsleague",label:"Nations League"},
    {key:"bhc",label:"British Championship"},
  ];
  var EXPLORE = [
    {key:"ufwc",label:"UFWC lineage"},
    {key:"h2h",label:"Head to head"},
    {key:"decades",label:"Decades"},
    {key:"venues",label:"Venues"},
    {key:"allresults",label:"All results"},
  ];
  var PRIMARY = [
    {key:"overview",label:"Overview",Icon:Compass},
    {key:"fixtures",label:"Fixtures",Icon:Calendar},
    {key:"records",label:"Records",Icon:ListOrdered},
  ];

  var ALL_LABELS = {};
  PRIMARY.concat(COMPETITIONS,EXPLORE).forEach(function(t){ ALL_LABELS[t.key]=t.label; });
  ALL_LABELS.teams = "Teams";
  ALL_LABELS.team = teamParam;

  var allTeams = matches.length
    ? Array.from(new Set(matches.flatMap(function(m){return [m.home_team,m.away_team];}))).sort()
    : ((summary && summary.nationList) || []);

  function renderContent() {
    if(loading || !summary) return contentSkeleton;
    // Everything except the overview needs the full archive.
    if(activeTab !== "overview" && !matches.length) {
      if(archiveError) return <div className="fb-card" role="alert" style={{textAlign:"center",padding:"var(--sp-8)"}}>
        <AlertTriangle size={26} aria-hidden="true" style={{color:"var(--error)"}}/>
        <p style={{color:"var(--text-muted)",fontSize:"var(--fs-sm)",margin:"var(--sp-3) 0"}}>The match archive could not be loaded: {archiveError}</p>
        <button className="fb-btn" onClick={function(){window.location.reload();}}><RefreshCw size={14} aria-hidden="true"/> Retry</button>
      </div>;
      return <div aria-busy="true" aria-live="polite">
        <span className="sr-only">{loadProgress}</span>
        <div className="sn-skel" style={{height:120,borderRadius:"var(--r-lg)",marginBottom:"var(--sp-3)"}}/>
        <div className="sn-skel" style={{height:320,borderRadius:"var(--r-lg)"}}/>
      </div>;
    }
    switch(activeTab) {
      case "overview": return <FBOverview summary={summary} ufwc={ufwc}/>;
      case "fixtures": return <FBFixtures matches={matches}/>;
      case "worldcup": return <TournamentTab matches={matches} tournamentFilter={isWorldCup} winners={WC_WINNERS} title="World Cup" icon={<Trophy size={16}/>} wcData={WC_DATA}/>;
      case "euros": return <TournamentTab matches={matches} tournamentFilter={isEurosFinals} winners={EURO_WINNERS} title="European Championship" icon={<Trophy size={16}/>}/>;
      case "copa": return <TournamentTab matches={matches} tournamentFilter={isCopa} winners={COPA_WINNERS} title="Copa América" icon={<Trophy size={16}/>}/>;
      case "nationsleague": return <TournamentTab matches={matches} tournamentFilter={isNationsLeague} winners={[]} title="Nations League" icon={<Trophy size={16}/>}/>;
      case "bhc": return <FBBritishChamp matches={matches}/>;
      case "ufwc": return <FBUFWCTab ufwc={ufwc}/>;
      case "h2h": return <FBHeadToHead matches={matches}/>;
      case "decades": return <FBDecades matches={matches}/>;
      case "records": return <FBRecords matches={matches}/>;
      case "venues": return <FBVenues matches={matches}/>;
      case "allresults": return <FBAllResults matches={matches}/>;
      case "teams": return <FBTeamsIndex teams={allTeams} recent={recentTeams} onPick={function(t){navTab("team",t);}}/>;
      case "team": return <FBTeam matches={matches} teamName={teamParam} ufwc={ufwc}/>;
      default: return <FBOverview summary={summary} ufwc={ufwc}/>;
    }
  }

  var pageTitle = activeTab === "overview"
    ? "Football — International Match Stats Since 1872 | StatNations"
    : `${ALL_LABELS[activeTab] || "Football"} — Football | StatNations`;

  return <div style={{fontFamily:"var(--font-body)",color:"var(--text-muted)"}}>
    <style>{fbCSS}</style>
    <SEO
      title={pageTitle}
      description={`International football analytics: ${(summary ? summary.totals.matches : 51778).toLocaleString()} men's internationals since 1872, every World Cup, Euros and Copa América, head-to-head records and the UFWC lineage.`}
      path={"/football"}
      jsonLd={activeTab === "fixtures" ? {
        "@context":"https://schema.org",
        "@graph": FIXTURES_2026.slice(0,20).map(function(f){
          return {
            "@type":"SportsEvent",
            name: f.home + " v " + f.away,
            startDate: f.date,
            eventStatus: "https://schema.org/EventScheduled",
            sport: "Association football",
            competitor: [
              {"@type":"SportsTeam", name: f.home},
              {"@type":"SportsTeam", name: f.away},
            ],
            location: f.venue || f.city
              ? {"@type":"Place", name: f.venue || f.city, address: f.city}
              : undefined,
            superEvent: {"@type":"SportsOrganization", name: f.tournament},
          };
        }),
      } : {
        "@context":"https://schema.org",
        "@type":"Dataset",
        name:"International football results, 1872–present",
        description:`${(summary ? summary.totals.matches : 51778).toLocaleString()} men's international football matches with scores, competitions and venues.`,
        temporalCoverage:"1872/..",
        creator:{"@type":"Organization",name:"StatNations"},
        license:"https://opendatacommons.org/licenses/odbl/",
      }}
    />

    {/* Every <FBFlag> on the page is a <use> of this sheet. */}
    <FlagSprite/>

    {/* Hero band */}
    <div className="fb-hero">
      <div style={{maxWidth:1200,margin:"0 auto",padding:"var(--sp-6) var(--sp-5) var(--sp-4)"}}>
        <h1 style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",flexWrap:"wrap",margin:0,fontSize:"var(--fs-2xl)"}}>
          <Logo size={30} sport="Football" textSize={22} accent="var(--accent-football)"/>
        </h1>
        <p style={{fontSize:"var(--fs-sm)",color:"var(--text-muted)",marginTop:"var(--sp-2)"}}>
          <span className="tabular">{summary ? summary.totals.matches.toLocaleString() : "51,500+"}</span> international matches · since 1872
        </p>
      </div>
    </div>

    {/* Primary navigation */}
    <div style={{borderBottom:"1px solid var(--line)",background:"var(--pitch)"}}>
      <nav aria-label="Football sections" style={{maxWidth:1200,margin:"0 auto",padding:"var(--sp-3) var(--sp-5)"}}>
        <div className="sn-scroll-x">
          {/* Not role="tablist": these controls change the URL rather than swap a
              panel in place, and two of them open menus — which a tablist may not
              contain. Arrow-key roving focus is kept, since that is the part that
              actually helps keyboard users. */}
          <div className="fb-tab-nav"
            onKeyDown={function(e){
              if(["ArrowRight","ArrowLeft","Home","End"].indexOf(e.key)<0) return;
              var tabs = Array.prototype.slice.call(e.currentTarget.querySelectorAll('.fb-tab-btn'));
              var i = tabs.indexOf(document.activeElement);
              if(i<0) return;
              e.preventDefault();
              var next = e.key==="Home" ? 0
                : e.key==="End" ? tabs.length-1
                : e.key==="ArrowRight" ? (i+1)%tabs.length
                : (i-1+tabs.length)%tabs.length;
              tabs[next].focus();
            }}>
            {PRIMARY.map(function(t){
              return <button key={t.key} aria-current={activeTab===t.key?"page":undefined}
                className={"fb-tab-btn"+(activeTab===t.key?" active":"")}
                onClick={function(){navTab(t.key);}}>
                <t.Icon size={14} aria-hidden="true"/>{t.label}
              </button>;
            })}
            <FBMenuTab label="Competitions" Icon={Trophy} items={COMPETITIONS} activeKey={activeTab} onPick={function(k){navTab(k);}}/>
            <button aria-current={(activeTab==="teams"||activeTab==="team")?"page":undefined}
              className={"fb-tab-btn"+((activeTab==="teams"||activeTab==="team")?" active":"")}
              onClick={function(){setPickerOpen(true);}}>
              <Users size={14} aria-hidden="true"/>Teams
            </button>
            <FBMenuTab label="Explore" Icon={Compass} items={EXPLORE} activeKey={activeTab} onPick={function(k){navTab(k);}}/>
          </div>
        </div>

        {recentTeams.length>0 && <div className="sn-scroll-x" style={{marginTop:"var(--sp-2)"}}>
          <div style={{display:"flex",gap:6,alignItems:"center",minWidth:"max-content"}}>
            <span style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xs)",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-faint)"}}>Recent</span>
            {recentTeams.map(function(t){
              return <button key={t} className={"fb-btn"+(activeTab==="team"&&teamParam===t?" active":"")}
                onClick={function(){navTab("team",t);}} style={{textTransform:"none",letterSpacing:0}}>
                <FBFlag team={t} size={16}/>{t}
              </button>;
            })}
          </div>
        </div>}
      </nav>
    </div>

    {/* Content */}
    <div style={{maxWidth:1200,margin:"0 auto",padding:"var(--sp-5) var(--sp-5) var(--sp-10)"}}>
      <FBCrumbs tab={activeTab} label={ALL_LABELS[activeTab] || "Football"} onHome={function(){navTab("overview");}}/>
      <FBErrorBoundary key={activeTab+"|"+teamParam}>
        {renderContent()}
      </FBErrorBoundary>
    </div>

    <FBTeamPicker
      open={pickerOpen}
      onClose={function(){setPickerOpen(false);}}
      teams={allTeams}
      recent={recentTeams}
      onPick={function(t){ setPickerOpen(false); navTab("team",t); }}
    />
  </div>;
}

/** Simple index of every nation, used when Teams is opened without the palette. */
function FBTeamsIndex({teams, recent, onPick}) {
  const [q,setQ] = useState("");
  const list = teams.filter(function(t){return t.toLowerCase().indexOf(q.trim().toLowerCase())>=0;});
  return <div>
    <FBCard title="Teams" icon={<Users size={16}/>}>
      <input className="fb-search" value={q} onChange={function(e){setQ(e.target.value);}}
             placeholder={`Search ${teams.length} nations…`} aria-label="Search nations"/>
      {recent.length>0 && !q && <div style={{marginTop:"var(--sp-3)"}}>
        <div style={{fontFamily:"var(--font-display)",fontSize:"var(--fs-2xs)",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-faint)",marginBottom:"var(--sp-2)"}}>Recently viewed</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {recent.map(function(t){return <button key={t} className="fb-btn" style={{textTransform:"none",letterSpacing:0}} onClick={function(){onPick(t);}}><FBFlag team={t} size={16}/>{t}</button>;})}
        </div>
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,marginTop:"var(--sp-4)"}}>
        {list.map(function(t){
          return <button key={t} onClick={function(){onPick(t);}}
            style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",padding:"10px var(--sp-3)",minHeight:44,
                    background:"var(--surface-raised)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",
                    color:"var(--text)",fontSize:"var(--fs-sm)",cursor:"pointer",textAlign:"left"}}>
            <FBFlag team={t} size={20}/>{t}
          </button>;
        })}
      </div>
      {list.length===0 && <FBEmpty title="No nation found" body={`Nothing matches “${q}”. Try a different spelling.`} Icon={Search}/>}
    </FBCard>
  </div>;
}

window.FootballStatNations = FootballStatNations;
window._footballReady = true;

export default FootballStatNations;
