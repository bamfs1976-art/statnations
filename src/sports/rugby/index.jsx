import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useData } from '../../lib/useData.js';


var T5 = ["England","France","Ireland","Scotland","Wales"];
var T6 = ["England","France","Ireland","Italy","Scotland","Wales"];
var TA = ["England","France","Ireland","Italy","Scotland","Wales","Argentina","Australia","New Zealand","South Africa"];
var TC = {England:"#C8102E",France:"#002654",Ireland:"#169B62",Italy:"#0066CC",Scotland:"#003078",Wales:"#D4213D",Argentina:"#75AADB",Australia:"#FFB612","New Zealand":"#1A1A1A","South Africa":"#007A4D"};
var TC2 = {England:"#FFFFFF",France:"#ED2939",Ireland:"#FF883E",Italy:"#CE2B37",Scotland:"#CF142B",Wales:"#00AB39",Argentina:"#F5E51B",Australia:"#002B5C","New Zealand":"#FFFFFF","South Africa":"#FFB612"};
var TE = {England:"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f",France:"\ud83c\uddeb\ud83c\uddf7",Ireland:"\ud83c\uddee\ud83c\uddea",Italy:"\ud83c\uddee\ud83c\uddf9",Scotland:"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f",Wales:"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f",Argentina:"\ud83c\udde6\ud83c\uddf7",Australia:"\ud83c\udde6\ud83c\uddfa","New Zealand":"\ud83c\uddf3\ud83c\uddff","South Africa":"\ud83c\uddff\ud83c\udde6"};
var TN = {England:"The Red Rose",France:"Les Bleus",Ireland:"The Shamrocks",Italy:"Gli Azzurri",Scotland:"The Thistles",Wales:"The Dragons",Argentina:"Los Pumas",Australia:"The Wallabies","New Zealand":"The All Blacks","South Africa":"The Springboks"};

// SVG Flag components — crisp at any size
function Flag({team,size=28}){
  const s=size;
  const flags={
    England:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="40" fill="#fff"/><rect x="25" width="10" height="40" fill="#C8102E"/><rect y="15" width="60" height="10" fill="#C8102E"/></svg>),
    France:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>),
    Ireland:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="20" height="40" fill="#169B62"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#FF883E"/></svg>),
    Italy:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>),
    Scotland:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="40" fill="#003078"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="5"/></svg>),
    Wales:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="20" fill="#fff"/><rect y="20" width="60" height="20" fill="#00AB39"/><g transform="translate(14,6) scale(0.16)" fill="#D4213D"><path d="M100 10c-5 15-20 20-20 35s10 25 5 40c15-5 25-20 40-15 10-10 5-25 15-35-15 0-25 10-35 5 5-15 0-25-5-30z"/><path d="M80 55c-10 5-20 15-30 10 5 10 15 15 25 15 0-10 5-20 5-25z"/><path d="M140 35c5 5 15 5 20 0-5-5-15-5-20 0z"/><path d="M120 70c10 5 25 0 30-10-10 0-20 5-30 10z"/><path d="M75 85c-5 10 0 25 10 30 5-10 5-25-10-30z"/><path d="M95 90c5 10 15 20 25 15-5-10-15-15-25-15z"/><path d="M55 45l-20 5 10 10z"/></g></svg>),
    Argentina:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="13.3" fill="#75AADB"/><rect y="13.3" width="60" height="13.3" fill="#fff"/><rect y="26.6" width="60" height="13.4" fill="#75AADB"/><circle cx="30" cy="20" r="4" fill="#F5E51B"/></svg>),
    Australia:(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="40" fill="#002B5C"/><rect width="25" height="20" fill="#002B5C"/><path d="M0 0L25 20M25 0L0 20" stroke="#fff" strokeWidth="2"/><path d="M12.5 0V20M0 10H25" stroke="#C8102E" strokeWidth="1.2"/><polygon points="40,8 41,11 44,11 42,13 43,16 40,14 37,16 38,13 36,11 39,11" fill="#fff"/><polygon points="50,20 51,23 54,23 52,25 53,28 50,26 47,28 48,25 46,23 49,23" fill="#fff"/><polygon points="45,32 46,34 48,34 46.5,35.5 47,37 45,36 43,37 43.5,35.5 42,34 44,34" fill="#fff"/></svg>),
    "New Zealand":(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="40" fill="#00247D"/><rect width="25" height="20" fill="#00247D"/><path d="M0 0L25 20M25 0L0 20" stroke="#fff" strokeWidth="2.5"/><path d="M12.5 0V20M0 10H25" stroke="#C8102E" strokeWidth="1.5"/><polygon points="44,10 45,13 48,13 45.5,15 46.5,18 44,16 41.5,18 42.5,15 40,13 43,13" fill="#C8102E" stroke="#fff" strokeWidth="0.3"/><polygon points="50,22 51,24 53,24 51.5,25.5 52,27 50,26 48,27 48.5,25.5 47,24 49,24" fill="#C8102E" stroke="#fff" strokeWidth="0.3"/></svg>),
    "South Africa":(<svg viewBox="0 0 60 40" width={s} height={s*2/3} style={{borderRadius:3,display:"block"}}><rect width="60" height="13" fill="#DE3831"/><rect y="14.5" width="60" height="11" fill="#fff"/><rect y="27" width="60" height="13" fill="#002395"/><path d="M0 0L20 20L0 40Z" fill="#007A4D"/><path d="M0 5L15 20L0 35Z" fill="#FFB612"/></svg>)
  };
  return flags[team]||<span style={{fontSize:size*0.65}}>{TE[team]||""}</span>;
}

function FlagBadge({team,size=28}){
  return(<div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size+8,height:(size*2/3)+8,borderRadius:4,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",overflow:"hidden",flexShrink:0}}>
    <Flag team={team} size={size}/>
  </div>);
}

// Global navigation callback (set by App component)
var _navToTab=null;
function TeamLabel({team,size=22,showNick=false,noLink=false}){
  const isNavigable=!noLink&&T6.includes(team)&&_navToTab;
  return(<span className={isNavigable?"team-link":""} style={{display:"inline-flex",alignItems:"center",gap:8}} onClick={isNavigable?(e)=>{e.stopPropagation();_navToTab(team);}:undefined} role={isNavigable?"link":undefined} tabIndex={isNavigable?0:undefined} aria-label={isNavigable?"Go to "+team+" team page":undefined}>
    <FlagBadge team={team} size={size}/>
    <span style={{fontWeight:600,color:"#F5F7FA"}}>{team}</span>
    {showNick&&TN[team]&&<span style={{fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>{TN[team]}</span>}
  </span>);
}

// Styled components
var globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--rf-bg);font-family:'DM Sans',system-ui,sans-serif;}

/* ── Design Tokens ── */
:root{
  /* Colours — unified palette */
  --rf-bg:#0f172a;--rf-surface:#1e293b;--rf-surface2:#253349;
  --rf-pitch:#1a5f3a;--rf-pitch-dark:#0f3d25;--rf-pitch-light:#2a7a52;
  --rf-navy:#1e3a8a;--rf-gold:#d4a017;--rf-gold-light:#f0c850;
  --rf-win:#169B62;--rf-loss:#dc2626;--rf-draw:#d4a017;
  --rf-text:#f8fafc;--rf-text2:#C5CDD8;--rf-text-muted:#94a3b8;--rf-text-dim:#64748b;
  --rf-border:rgba(255,255,255,0.06);--rf-border2:rgba(255,255,255,0.1);
  /* Typography scale (1.2 minor third) */
  --fs-xs:11px;--fs-sm:12px;--fs-base:13px;--fs-md:14px;--fs-lg:18px;--fs-xl:24px;--fs-2xl:32px;
  --ff-head:'Barlow Condensed',system-ui,sans-serif;--ff-body:'DM Sans',system-ui,sans-serif;--ff-mono:'JetBrains Mono',monospace;
  /* Spacing (8pt grid) */
  --sp-1:4px;--sp-2:8px;--sp-3:12px;--sp-4:16px;--sp-5:24px;--sp-6:32px;--sp-8:48px;--sp-10:64px;
  /* Radii */
  --r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:16px;
  /* Easing */
  --ease-athletic:cubic-bezier(0.16,1,0.3,1);
}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}
::-webkit-scrollbar-thumb{background:rgba(26,95,58,0.3);border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:rgba(26,95,58,0.5);}

/* ── Animations ── */
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}

/* ── Component classes ── */
.card-hover{transition:all 0.25s var(--ease-athletic);border:1px solid var(--rf-border);}
.card-hover:hover{border-color:rgba(26,95,58,0.2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2),0 0 0 1px rgba(26,95,58,0.1);}
.tab-btn{position:relative;overflow:hidden;transition:all 0.15s ease-out;}
.tab-btn::after{content:'';position:absolute;bottom:0;left:50%;width:0;height:3px;background:var(--rf-gold);transition:all 0.25s var(--ease-athletic);transform:translateX(-50%);border-radius:3px 3px 0 0;}
.tab-btn:hover::after{width:60%;}
.tab-btn.active::after{width:100%;box-shadow:0 2px 8px rgba(212,160,23,0.25);}
.fade-in{animation:fadeSlideUp 0.4s var(--ease-athletic) both;}
.fade-in-1{animation-delay:0.06s}.fade-in-2{animation-delay:0.12s}.fade-in-3{animation-delay:0.18s}.fade-in-4{animation-delay:0.24s}.fade-in-5{animation-delay:0.30s}
.row-hover tr{transition:background 0.15s ease-out;}
.row-hover tr:hover{background:linear-gradient(90deg,rgba(26,95,58,0.04),transparent 70%)!important;}

/* ── Accessibility ── */
@media(prefers-reduced-motion:reduce){.fade-in,.fade-in-1,.fade-in-2,.fade-in-3,.fade-in-4,.fade-in-5{animation:none!important;opacity:1!important;}.card-hover{transition:none;}}
:focus-visible{outline:2px solid var(--rf-gold);outline-offset:2px;border-radius:var(--r-sm);}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

/* ── Clickable team labels ── */
.team-link{cursor:pointer;text-decoration:none;border-radius:var(--r-sm);padding:2px 4px;margin:-2px -4px;transition:background 0.15s ease-out;}
.team-link:hover{background:rgba(255,255,255,0.06);}

/* ── Responsive Grid Utilities ── */
.grid-auto{display:grid;gap:var(--sp-5);}
.grid-2{grid-template-columns:1fr 1fr;}
.grid-3{grid-template-columns:repeat(3,1fr);}
.grid-stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--sp-3);}

/* ── Responsive: Tablet (≤1024px) ── */
@media(max-width:1024px){
  .grid-2{grid-template-columns:1fr;}
  .grid-3{grid-template-columns:1fr 1fr;}
  .rf-header-inner{padding:0 var(--sp-4)!important;}
  .rf-main{padding:var(--sp-5) var(--sp-4) var(--sp-8)!important;}
  .grid-stat{grid-template-columns:repeat(auto-fit,minmax(120px,1fr));}
}

/* ── Responsive: Mobile (≤640px) ── */
@media(max-width:640px){
  .grid-2,.grid-3{grid-template-columns:1fr;}
  .grid-stat{grid-template-columns:repeat(2,1fr);}
  .rf-header-inner{padding:0 var(--sp-3)!important;}
  .rf-main{padding:var(--sp-4) var(--sp-3) var(--sp-6)!important;max-width:100vw!important;}
  .rf-brand-title{font-size:20px!important;}
  .rf-brand-sub{display:none!important;}
  .rf-flags-strip{display:none!important;}
  .rf-tab-row{gap:0!important;}
  .tab-btn{padding:8px 10px!important;font-size:10px!important;min-height:36px!important;}
  .rf-tab-label{display:none!important;}
  .rf-tab-row-label{font-size:8px!important;padding-left:4px!important;padding-right:2px!important;}
  .rf-hero-banner{padding:var(--sp-4) var(--sp-4)!important;gap:var(--sp-3)!important;}
  .rf-hero-title{font-size:22px!important;}
  .rf-hero-emoji{display:none!important;}
  .rf-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .rf-table-wrap table{min-width:600px;}
  .rf-card{padding:var(--sp-3)!important;}
  .rf-stat-box{padding:var(--sp-3)!important;}
  .rf-chart-wrap .recharts-wrapper{font-size:10px;}
  .rf-select{font-size:13px!important;padding:8px 12px!important;}
  .rf-sub-tabs{flex-wrap:wrap!important;}
  .rf-sub-tabs button{flex:1;min-width:0;padding:8px 12px!important;font-size:11px!important;}
}

/* ── Responsive: Small mobile (≤400px) ── */
@media(max-width:400px){
  .grid-stat{grid-template-columns:1fr 1fr;}
  .tab-btn{padding:6px 8px!important;font-size:11px!important;}
}

/* ── Empty state ── */
.rf-empty{text-align:center;padding:var(--sp-8) var(--sp-5);color:var(--rf-text-muted);}
.rf-empty-icon{font-size:48px;margin-bottom:var(--sp-3);opacity:0.3;}
.rf-empty-text{font-size:var(--fs-md);margin-bottom:var(--sp-2);}
.rf-empty-sub{font-size:var(--fs-sm);color:var(--rf-text-dim);}
`;

function Card({children,title,icon,style,className=""}){
  return(<div className={"card-hover fade-in "+className} style={{background:"rgba(30,41,59,0.5)",backdropFilter:"blur(12px)",borderRadius:14,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.04)",...style}}>
    {title&&<h3 style={{margin:"0 0 18px",fontSize:14,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",display:"flex",alignItems:"center",gap:8,fontFamily:"'Barlow Condensed',sans-serif"}}>
      {icon&&<span style={{fontSize:15}}>{icon}</span>}{title}
    </h3>}
    {children}
  </div>);
}

function SB({label,value,sub,color,icon}){
  return(<div className="card-hover fade-in" style={{textAlign:"center",padding:"20px 14px",background:"rgba(30,41,59,0.5)",backdropFilter:"blur(12px)",borderRadius:10,position:"relative",overflow:"hidden",borderTop:"3px solid "+(color||"#d4a017")}}>
    {icon&&<div style={{fontSize:18,marginBottom:6}}>{icon}</div>}
    <div style={{fontSize:28,fontWeight:700,color:color||"#f8fafc",letterSpacing:"-0.03em",fontFamily:"'JetBrains Mono',monospace"}}>{value}</div>
    <div style={{fontSize:11,color:"#94a3b8",marginTop:6,fontWeight:600,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:"#64748b",marginTop:3}}>{sub}</div>}
  </div>);
}

function MT({headers,rows}){
  return(<div className="rf-table-wrap" style={{overflowX:"auto"}}><table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
    <thead><tr>{headers.map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i===0?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
      {row.map((cell,ci)=><td key={ci} style={{padding:"12px 10px",textAlign:ci===0?"left":"right",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums"}}>{cell}</td>)}
    </tr>)}</tbody>
  </table></div>);
}

var ttStyle = {background:"rgba(30,41,59,0.95)",border:"1px solid rgba(26,95,58,0.2)",borderLeft:"3px solid #d4a017",borderRadius:10,color:"#e2e8f0",backdropFilter:"blur(12px)",boxShadow:"0 8px 24px rgba(0,0,0,0.3)"};

function RugbyStatNations() {
  // ── Async data loading via fetch (replaces inline CSV strings) ──────────────
  const { data: snRaw, loading: snLoading } = useData('rugby-sixnations.json');
  const { data: intlRaw, loading: intlLoading } = useData('rugby-intl.json');
  const { data: wcRaw, loading: wcLoading } = useData('rugby-worldcup.json');
  const { data: fnRaw } = useData('rugby-fivenations.json');
  const { data: rbRaw } = useData('rugby-raeburn.json');
  const { data: rbrRaw } = useData('rugby-raeburn-results.json');

  // Normalise types (JSON values are strings, component expects numbers)
  const sn = useMemo(() => (snRaw || []).map(r => ({
    ...r, year: +r.year, hb: +r.hb, ab: +r.ab, hs: +r.hs, as: +r.as,
  })), [snRaw]);
  const intl = useMemo(() => (intlRaw || []).map(r => ({
    ...r, hs: r.hs !== null && r.hs !== undefined ? +r.hs : null,
          as: r.as !== null && r.as !== undefined ? +r.as : null,
  })), [intlRaw]);
  const wc = useMemo(() => (wcRaw || []).map(r => ({
    ...r, year: +r.year, hs: r.hs !== null && r.hs !== '' ? +r.hs : null,
                         as: r.as !== null && r.as !== '' ? +r.as : null,
  })), [wcRaw]);
  const fn = useMemo(() => (fnRaw || []).map(r => ({
    ...r, year: +r.year, hs: +r.hs, as: +r.as,
  })), [fnRaw]);
  const rb = useMemo(() => rbRaw || [], [rbRaw]);
  const rbr = useMemo(() => (rbrRaw || []).map(r => ({
    ...r, hs: +r.hs, as: +r.as, run: +r.run,
  })), [rbrRaw]);

  // Hash-based routing
  const getHashTab=()=>{const h=window.location.hash.replace("#/","").split("/")[0];return h||"overview";};
  const [tab, setTabState] = useState(getHashTab);
  const setTab=(t)=>{setTabState(t);window.location.hash="#/"+t;};
  _navToTab=setTab; // Enable cross-tab linking from TeamLabel
  useState(()=>{
    const onHash=()=>setTabState(getHashTab());
    window.addEventListener("hashchange",onHash);
    return()=>window.removeEventListener("hashchange",onHash);
  });

  const sby = useMemo(()=>{
    const yrs=[...new Set(sn.map(m=>m.year))].sort();
    return yrs.map(year=>{
      const ms=sn.filter(m=>m.year===year);
      const t={};
      T6.forEach(x=>{t[x]={w:0,d:0,l:0,pf:0,pa:0,played:0};});
      ms.forEach(m=>{
        if(!t[m.home]||!t[m.away])return;
        t[m.home].pf+=m.hs;t[m.home].pa+=m.as;t[m.home].played++;
        t[m.away].pf+=m.as;t[m.away].pa+=m.hs;t[m.away].played++;
        if(m.hs>m.as){t[m.home].w++;t[m.away].l++;}
        else if(m.hs<m.as){t[m.away].w++;t[m.home].l++;}
        else{t[m.home].d++;t[m.away].d++;}
      });
      Object.keys(t).forEach(x=>{t[x].pts=t[x].w*2+t[x].d;t[x].pd=t[x].pf-t[x].pa;});
      const sorted=Object.entries(t).sort((a,b)=>b[1].pts-a[1].pts||b[1].pd-a[1].pd);
      return {year,table:sorted,matches:ms};
    });
  },[sn]);

  const champs=useMemo(()=>sby.map(s=>({year:s.year,winner:s.table[0][0],gs:s.table[0][1].w===5})),[sby]);

  // Five Nations standings by year
  const fnby = useMemo(()=>{
    const yrs=[...new Set(fn.map(m=>m.year))].sort();
    return yrs.map(year=>{
      const ms=fn.filter(m=>m.year===year);
      const t={};
      T5.forEach(x=>{t[x]={w:0,d:0,l:0,pf:0,pa:0,played:0};});
      ms.forEach(m=>{
        if(!t[m.home]||!t[m.away])return;
        t[m.home].pf+=m.hs;t[m.home].pa+=m.as;t[m.home].played++;
        t[m.away].pf+=m.as;t[m.away].pa+=m.hs;t[m.away].played++;
        if(m.hs>m.as){t[m.home].w++;t[m.away].l++;}
        else if(m.hs<m.as){t[m.away].w++;t[m.home].l++;}
        else{t[m.home].d++;t[m.away].d++;}
      });
      Object.keys(t).forEach(x=>{t[x].pts=t[x].w*2+t[x].d;t[x].pd=t[x].pf-t[x].pa;});
      const sorted=Object.entries(t).sort((a,b)=>b[1].pts-a[1].pts||b[1].pd-a[1].pd);
      return {year,table:sorted,matches:ms};
    });
  },[fn]);

  const fnChamps=useMemo(()=>fnby.map(s=>({year:s.year,winner:s.table[0][0],gs:s.table[0][1].w===4})),[fnby]);

  const tabs=[{id:"overview",label:"Overview",icon:"\ud83c\udfc9"},{id:"fixtures",label:"Fixtures",icon:"\ud83d\udcc6"},{id:"sixnations",label:"Six Nations",icon:"\ud83c\udfc6"},{id:"fivenations",label:"Five Nations",icon:"\ud83c\udfdf\ufe0f"},{id:"worldcup",label:"World Cup",icon:"\ud83c\udf0d"},{id:"rc",label:"RC / Tri Nations",icon:"\ud83c\udfc8"},{id:"nationschamp",label:"Nations Championship",icon:"\ud83c\udf0d"},{id:"nationscup",label:"Nations Cup",icon:"\ud83c\udf10"},{id:"rugbyeurope",label:"Rugby Europe",icon:"\ud83c\uddea\ud83c\uddfa"},{id:"autumn",label:"Autumn Intl",icon:"\ud83c\udf42"},{id:"tours",label:"Tours",icon:"\u2708\ufe0f"},{id:"lions",label:"B&I Lions",icon:"\ud83e\udd81"},{id:"raeburn",label:"Raeburn Shield",icon:"\ud83d\udee1\ufe0f"},{id:"h2h",label:"Head to Head",icon:"\u2694\ufe0f"},{id:"decades",label:"Decades",icon:"\ud83d\udcc5"},{id:"grandslams",label:"Grand Slams",icon:"\ud83d\udc51"},{id:"upsets",label:"Upsets",icon:"\ud83e\udd2f"},{id:"captains",label:"Captains",icon:"\ud83e\uddd1\u200d\ud83c\udfeb"},{id:"venues",label:"Venues",icon:"\ud83c\udfdf\ufe0f"},{id:"allresults",label:"All Results",icon:"\ud83d\udcca"},{id:"records",label:"Records",icon:"\ud83c\udfc5"},...T6.map(t=>({id:t,label:t,icon:null,team:t}))];

  // Tab groupings — reorganised for clarity
  // Row 1: Competitions (where results happen)
  const compTabs=["overview","fixtures","sixnations","fivenations","worldcup","rc","nationschamp","nationscup","rugbyeurope","autumn","tours"];
  // Row 2: Analysis & Reference (analytical features)
  const featureTabs=["lions","raeburn","h2h","grandslams","upsets","decades","captains","venues","allresults","records"];

  // Loading guard — after all hooks, safe to early-return now
  if (snLoading || intlLoading || wcLoading) {
    return (
      <div style={{minHeight:'100vh',background:'var(--rf-bg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:16}}>🏉</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em'}}>Loading Rugby Data…</div>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:"var(--rf-bg)",color:"#e2e8f0",fontFamily:"var(--ff-body)"}}>
      <style>{globalCSS}</style>

      {/* Atmospheric background — green/navy tones */}
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:"50%",height:"50%",background:"radial-gradient(ellipse,rgba(26,95,58,0.06) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"-10%",width:"40%",height:"40%",background:"radial-gradient(ellipse,rgba(30,58,138,0.08) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:"40%",left:"60%",width:"25%",height:"25%",background:"radial-gradient(ellipse,rgba(212,160,23,0.03) 0%,transparent 70%)"}}/>
      </div>

      {/* Header — green→navy gradient with pitch texture */}
      <header style={{position:"relative",zIndex:10,background:"linear-gradient(135deg,#0f3d25 0%,#1a5f3a 40%,#1e3a8a 100%)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(26,95,58,0.2)",padding:"0",overflow:"hidden"}} role="banner">
        {/* Pitch stripe texture overlay */}
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(255,255,255,0.015) 3px,rgba(255,255,255,0.015) 6px)",pointerEvents:"none"}}/>
        <div className="rf-header-inner" style={{maxWidth:1320,margin:"0 auto",padding:"0 28px",position:"relative"}}>
          {/* Top bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setTab("overview")}>
              {/* Rugby ball SVG icon */}
              <div style={{width:44,height:44,borderRadius:10,background:"rgba(212,160,23,0.15)",border:"1px solid rgba(212,160,23,0.3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(212,160,23,0.15)",flexShrink:0}}>
                <svg width="24" height="16" viewBox="0 0 26 18" aria-hidden="true"><ellipse cx="13" cy="9" rx="12" ry="8" fill="none" stroke="#d4a017" strokeWidth="1.5"/><path d="M7 9c2-4 6-6 12-7M7 9c2 4 6 6 12 7" stroke="#d4a017" strokeWidth="1" fill="none" opacity="0.5"/><line x1="13" y1="1" x2="13" y2="17" stroke="#d4a017" strokeWidth="0.8" opacity="0.4"/></svg>
              </div>
              <div>
                <h1 className="rf-brand-title" style={{margin:0,fontSize:22,fontWeight:700,letterSpacing:"0.02em",color:"#f8fafc",fontFamily:"var(--ff-head)",textTransform:"uppercase"}}>RUGBY <span style={{color:"var(--rf-gold)"}}>STAT</span>NATIONS</h1>
                <p className="rf-brand-sub" style={{margin:"2px 0 0",fontSize:10,color:"rgba(248,250,252,0.5)",letterSpacing:"0.06em",fontFamily:"var(--ff-head)",textTransform:"uppercase"}}>INTERNATIONAL ANALYTICS {"\u00b7"} 1871{"\u2013"}2026</p>
              </div>
            </div>
            {/* Mini flag strip */}
            <div className="rf-flags-strip" style={{display:"flex",gap:4,alignItems:"center"}}>
              {T6.map(t=><div key={t} style={{opacity:tab===t?1:0.4,transition:"opacity 0.2s ease-out",cursor:"pointer",padding:2,borderRadius:4,border:tab===t?"1px solid rgba(212,160,23,0.4)":"1px solid transparent"}} onClick={()=>setTab(t)} title={t+" team page"} role="button" aria-label={"Go to "+t+" team page"}><Flag team={t} size={22}/></div>)}
            </div>
          </div>
          {/* Tab bar — two rows: competitions, analysis + teams */}
          <nav style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:4}} role="tablist" aria-label="Main navigation">
            {/* Row 1: Competitions & Fixtures */}
            <div className="rf-tab-row" style={{display:"flex",gap:2,overflowX:"auto",paddingBottom:0,alignItems:"center"}}>
              <span className="rf-tab-row-label" style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"var(--ff-head)",paddingLeft:8,paddingRight:4,whiteSpace:"nowrap"}}>COMPS</span>
              {tabs.filter(t=>compTabs.includes(t.id)).map(t=>(
                <button key={t.id} className={"tab-btn"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)} role="tab" aria-selected={tab===t.id} aria-controls={"panel-"+t.id}
                  style={{padding:"10px 14px",fontSize:11,fontWeight:tab===t.id?600:500,color:tab===t.id?"#f8fafc":"rgba(248,250,252,0.45)",background:tab===t.id?"rgba(255,255,255,0.06)":"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s ease-out",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:5,borderRadius:"8px 8px 0 0",fontFamily:"var(--ff-head)",textTransform:"uppercase",minHeight:40}}>
                  {t.icon&&<span style={{fontSize:12,lineHeight:1}}>{t.icon}</span>}
                  <span className="rf-tab-label">{t.label}</span>
                </button>
              ))}
            </div>
            {/* Row 2: Analysis & Reference */}
            <div className="rf-tab-row" style={{display:"flex",gap:2,overflowX:"auto",borderTop:"1px solid rgba(255,255,255,0.03)",alignItems:"center"}}>
              <span className="rf-tab-row-label" style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"var(--ff-head)",paddingLeft:8,paddingRight:4,whiteSpace:"nowrap"}}>EXPLORE</span>
              {tabs.filter(t=>featureTabs.includes(t.id)).map(t=>(
                <button key={t.id} className={"tab-btn"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)} role="tab" aria-selected={tab===t.id}
                  style={{padding:"8px 12px",fontSize:10.5,fontWeight:tab===t.id?600:500,color:tab===t.id?"#f8fafc":"rgba(248,250,252,0.45)",background:tab===t.id?"rgba(255,255,255,0.06)":"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s ease-out",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:5,borderRadius:"8px 8px 0 0",fontFamily:"var(--ff-head)",textTransform:"uppercase",minHeight:36}}>
                  {t.icon&&<span style={{fontSize:11,lineHeight:1}}>{t.icon}</span>}
                  <span className="rf-tab-label">{t.label}</span>
                </button>
              ))}
              {/* Team tabs inline */}
              <span style={{width:1,height:20,background:"rgba(255,255,255,0.08)",margin:"0 4px",flexShrink:0}}/>
              <span className="rf-tab-row-label" style={{fontSize:9,color:"rgba(255,255,255,0.2)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"var(--ff-head)",paddingRight:4,whiteSpace:"nowrap"}}>TEAMS</span>
              {tabs.filter(t=>t.team).map(t=>(
                <button key={t.id} className={"tab-btn"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)} role="tab" aria-selected={tab===t.id}
                  style={{padding:"8px 12px",fontSize:10.5,fontWeight:tab===t.id?600:500,color:tab===t.id?"#f8fafc":"rgba(248,250,252,0.45)",background:tab===t.id?"rgba(255,255,255,0.06)":"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s ease-out",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:5,borderRadius:"8px 8px 0 0",fontFamily:"var(--ff-head)",textTransform:"uppercase",minHeight:36}}>
                  <Flag team={t.team} size={14}/>
                  <span className="rf-tab-label">{t.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="rf-main" style={{position:"relative",zIndex:1,maxWidth:1320,margin:"0 auto",padding:"36px 28px 64px"}} role="main" aria-label="Content area">
        {tab==="overview"&&<Overview intl={intl} sn={sn} champs={champs} setTab={setTab}/>}
        {tab==="sixnations"&&<SixN sn={sn} sby={sby} champs={champs}/>}
        {tab==="fivenations"&&<FiveN fn={fn} fnby={fnby} fnChamps={fnChamps}/>}
        {tab==="worldcup"&&<WorldCup wc={wc}/>}
        {tab==="rc"&&<RCTriNations intl={intl}/>}
        {tab==="nationschamp"&&<NationsChampionship/>}
        {tab==="nationscup"&&<NationsCup/>}
        {tab==="autumn"&&<AutumnIntl intl={intl}/>}
        {tab==="tours"&&<Tours intl={intl}/>}
        {tab==="raeburn"&&<Raeburn rb={rb} rbr={rbr}/>}
        {tab==="lions"&&<LionsTab/>}
        {tab==="rugbyeurope"&&<RugbyEuropeTab/>}
        {tab==="h2h"&&<HeadToHead intl={intl} sn={sn}/>}
        {tab==="decades"&&<Decades intl={intl} sn={sn}/>}
        {tab==="grandslams"&&<GrandSlams sn={sn} intl={intl} champs={champs}/>}
        {tab==="upsets"&&<Upsets intl={intl} sn={sn}/>}
        {tab==="captains"&&<CaptainsCoaches/>}
        {tab==="fixtures"&&<Fixtures intl={intl} sn={sn}/>}
        {tab==="venues"&&<Venues intl={intl}/>}
        {tab==="allresults"&&<AllResults intl={intl}/>}
        {tab==="records"&&<Records intl={intl}/>}
        {T6.includes(tab)&&<Team team={tab} sn={sn} intl={intl} sby={sby} champs={champs}/>}
      </main>

      {/* Footer — deep green with pitch centre-line motif */}
      <footer style={{position:"relative",zIndex:1,background:"#0f3d25",borderTop:"1px solid rgba(26,95,58,0.3)",padding:"24px 0",textAlign:"center",overflow:"hidden"}} role="contentinfo">
        {/* Centre-line decorative motif */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.06,pointerEvents:"none"}} aria-hidden="true">
          <svg width="200" height="40" viewBox="0 0 200 40"><line x1="0" y1="20" x2="80" y2="20" stroke="#f8fafc" strokeWidth="1"/><circle cx="100" cy="20" r="15" fill="none" stroke="#f8fafc" strokeWidth="1"/><line x1="120" y1="20" x2="200" y2="20" stroke="#f8fafc" strokeWidth="1"/></svg>
        </div>
        <p style={{fontSize:11,color:"rgba(248,250,252,0.35)",letterSpacing:"0.06em",fontFamily:"var(--ff-head)",textTransform:"uppercase",position:"relative"}}><span style={{color:"var(--rf-gold)"}}>RUGBY STAT</span>NATIONS {"\u00b7"} DATA FROM 1871{"\u2013"}2026 {"\u00b7"} {intl.length+sn.length} MATCHES {"\u00b7"} Last updated 16 Mar 2026</p>
      </footer>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   RUGBY CHAMPIONSHIP / TRI NATIONS
   ═══════════════════════════════════════════════ */
function RCTriNations({intl}){
  const RC_TEAMS=["New Zealand","Australia","South Africa","Argentina"];
  const matches=useMemo(()=>intl.filter(m=>m.cat==="RC"||m.cat==="TN").sort((a,b)=>a.date.localeCompare(b.date)),[intl]);
  const years=useMemo(()=>[...new Set(matches.map(m=>+m.date.slice(0,4)))].sort(),[matches]);
  const [selYear,setSelYear]=useState(years[years.length-1]||2023);

  // Standings by year
  const sby=useMemo(()=>{
    return years.map(year=>{
      const ym=matches.filter(m=>+m.date.slice(0,4)===year);
      const t={};
      RC_TEAMS.forEach(team=>{t[team]={p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0};});
      ym.forEach(m=>{
        if(!t[m.home])t[m.home]={p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0};
        if(!t[m.away])t[m.away]={p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0};
        t[m.home].p++;t[m.away].p++;
        t[m.home].pf+=m.hs;t[m.home].pa+=m.as;
        t[m.away].pf+=m.as;t[m.away].pa+=m.hs;
        if(m.hs>m.as){t[m.home].w++;t[m.away].l++;}
        else if(m.as>m.hs){t[m.away].w++;t[m.home].l++;}
        else{t[m.home].d++;t[m.away].d++;}
      });
      const table=Object.entries(t).map(([team,s])=>({team,...s,pts:s.w*4+s.d*2,pd:s.pf-s.pa})).sort((a,b)=>b.pts-a.pts||b.pd-a.pd);
      return {year,matches:ym,table,era:year<2012?"Tri Nations":"Rugby Championship"};
    });
  },[matches,years]);

  const selData=sby.find(s=>s.year===selYear);

  // All-time records
  const allTime=useMemo(()=>{
    const t={};
    matches.forEach(m=>{
      [m.home,m.away].forEach(team=>{if(!t[team])t[team]={team,p:0,w:0,d:0,l:0,pf:0,pa:0,titles:0};});
      t[m.home].p++;t[m.away].p++;
      t[m.home].pf+=m.hs;t[m.home].pa+=m.as;
      t[m.away].pf+=m.as;t[m.away].pa+=m.hs;
      if(m.hs>m.as){t[m.home].w++;t[m.away].l++;}
      else if(m.as>m.hs){t[m.away].w++;t[m.home].l++;}
      else{t[m.home].d++;t[m.away].d++;}
    });
    sby.forEach(s=>{if(s.table[0])t[s.table[0].team]&&(t[s.table[0].team].titles++);});
    return Object.values(t).map(s=>({...s,wp:s.p?+((s.w/s.p)*100).toFixed(1):0})).sort((a,b)=>b.w-a.w);
  },[matches,sby]);

  // Titles by team
  const titlesByTeam=useMemo(()=>{
    const t={};
    sby.forEach(s=>{if(s.table[0]){const w=s.table[0].team;t[w]=(t[w]||0)+1;}});
    return Object.entries(t).map(([team,count])=>({team,count})).sort((a,b)=>b.count-a.count);
  },[sby]);

  // Points per match by year
  const ptsPerYear=useMemo(()=>sby.map(s=>{
    const total=s.matches.reduce((a,m)=>a+m.hs+m.as,0);
    return {year:s.year,avg:s.matches.length?+(total/s.matches.length).toFixed(1):0,era:s.era};
  }),[sby]);

  // Wins per year
  const winsPerYear=useMemo(()=>{
    return sby.map(s=>{
      const r={year:s.year};
      RC_TEAMS.forEach(t=>{const f=s.table.find(x=>x.team===t);r[t]=f?f.w:0;});
      return r;
    });
  },[sby]);

  return(<div>
    <div style={{marginBottom:28}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Rugby Championship & Tri Nations</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Southern hemisphere championship {"\u00b7"} Tri Nations 1996{"\u2013"}2011 {"\u00b7"} Rugby Championship 2012{"\u2013"}present</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Matches" value={matches.length} icon={"\ud83c\udfc8"} sub="Since 1996"/>
      <SB label="Seasons" value={years.length} icon={"\ud83d\udcc5"}/>
      <SB label="Most Titles" value={titlesByTeam[0]?.team||"-"} sub={titlesByTeam[0]?.count+" titles"} color={TC[titlesByTeam[0]?.team]||"#d4a017"}/>
      <SB label="Avg Pts/Match" value={(matches.reduce((a,m)=>a+m.hs+m.as,0)/matches.length).toFixed(1)} icon={"\u26a1"}/>
    </div>

    {/* Year selector */}
    <Card title="Season Standings" icon={"\ud83c\udfc6"} style={{marginBottom:24}}>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>
        {years.map(y=><button key={y} onClick={()=>setSelYear(y)}
          style={{padding:"6px 14px",fontSize:12,fontWeight:selYear===y?700:400,color:selYear===y?"#f8fafc":"#94a3b8",background:selYear===y?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(selYear===y?"rgba(26,95,58,0.3)":"rgba(255,255,255,0.06)"),borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.03em"}}>{y}</button>)}
      </div>
      {selData&&<div>
        <p style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>{selData.era} {selYear} {"\u00b7"} {selData.matches.length} matches</p>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["#","Team","P","W","D","L","PF","PA","PD","Pts"].map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{selData.table.map((t,ri)=>(
            <tr key={t.team} style={{background:ri===0?"rgba(26,95,58,0.06)":"transparent"}}>
              <td style={{padding:"10px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
              <td style={{padding:"10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={18}/></td>
              {[t.p,t.w,t.d,t.l,t.pf,t.pa,t.pd>0?"+"+t.pd:t.pd,t.pts].map((v,ci)=>(
                <td key={ci} style={{padding:"10px",textAlign:"right",color:ci===7?"#d4a017":ci===6?(t.pd>0?"#2a7a52":"#dc2626"):"#C5CDD8",fontWeight:ci===7?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:ci>=2?"'JetBrains Mono',monospace":"inherit"}}>{v}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>

        {/* Season matches */}
        <div style={{marginTop:20}}>
          <MT headers={["Date","Home","Score","Away","Venue"]}
            rows={selData.matches.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#94a3b8",fontSize:11}}>{m.stadium}</span>])}/>
        </div>
      </div>}
    </Card>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="All-Time Records" icon={"\ud83d\udcca"}>
        <MT headers={["Team","P","W","D","L","Win%","Titles"]}
          rows={allTime.map(t=>[<TeamLabel team={t.team} size={14}/>,t.p,t.w,t.d,t.l,<span style={{color:t.wp>=50?"#2a7a52":"#dc2626",fontWeight:600}}>{t.wp}%</span>,<span style={{color:"#d4a017",fontWeight:700}}>{t.titles}</span>])}/>
      </Card>
      <Card title="Titles Won" icon={"\ud83c\udfc6"}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={titlesByTeam} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
            <YAxis dataKey="team" type="category" tick={{fill:"#C5CDD8",fontSize:11}} width={100}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="count" name="Titles" fill="#1a5f3a" radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Avg Total Points Per Match" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={ptsPerYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Area dataKey="avg" name="Avg Pts" stroke="#d4a017" fill="rgba(212,160,23,0.15)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Wins Per Season" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={winsPerYear}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            {RC_TEAMS.map(t=><Line key={t} dataKey={t} stroke={TC[t]||"#7A8BA8"} strokeWidth={2} dot={false}/>)}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════
   AUTUMN INTERNATIONALS
   ═══════════════════════════════════════════════ */
function AutumnIntl({intl}){
  const matches=useMemo(()=>intl.filter(m=>m.cat==="AI").sort((a,b)=>a.date.localeCompare(b.date)),[intl]);
  const years=useMemo(()=>[...new Set(matches.map(m=>+m.date.slice(0,4)))].sort(),[matches]);
  const [selYear,setSelYear]=useState(years[years.length-1]||2022);

  // NH = hosts, SH = visitors typically
  const NH=["England","France","Ireland","Italy","Scotland","Wales"];
  const SH=["Argentina","Australia","New Zealand","South Africa"];

  // Host records (NH teams hosting)
  const hostRecords=useMemo(()=>{
    const t={};
    NH.forEach(team=>{t[team]={team,p:0,w:0,d:0,l:0,pf:0,pa:0};});
    matches.forEach(m=>{
      if(t[m.home]){
        t[m.home].p++;t[m.home].pf+=m.hs;t[m.home].pa+=m.as;
        if(m.hs>m.as)t[m.home].w++;else if(m.as>m.hs)t[m.home].l++;else t[m.home].d++;
      }
    });
    return Object.values(t).filter(s=>s.p>0).map(s=>({...s,wp:s.p?+((s.w/s.p)*100).toFixed(1):0})).sort((a,b)=>b.wp-a.wp);
  },[matches]);

  // Visitor records (SH teams visiting)
  const visitorRecords=useMemo(()=>{
    const t={};
    SH.forEach(team=>{t[team]={team,p:0,w:0,d:0,l:0,pf:0,pa:0};});
    matches.forEach(m=>{
      if(t[m.away]){
        t[m.away].p++;t[m.away].pf+=m.as;t[m.away].pa+=m.hs;
        if(m.as>m.hs)t[m.away].w++;else if(m.hs>m.as)t[m.away].l++;else t[m.away].d++;
      }
      // SH can also be home if hosting NH
      if(t[m.home]&&!NH.includes(m.home)){
        t[m.home].p++;t[m.home].pf+=m.hs;t[m.home].pa+=m.as;
        if(m.hs>m.as)t[m.home].w++;else if(m.as>m.hs)t[m.home].l++;else t[m.home].d++;
      }
    });
    return Object.values(t).filter(s=>s.p>0).map(s=>({...s,wp:s.p?+((s.w/s.p)*100).toFixed(1):0})).sort((a,b)=>b.wp-a.wp);
  },[matches]);

  // NH vs SH win rate per year
  const nhVsSh=useMemo(()=>{
    return years.map(y=>{
      const ym=matches.filter(m=>+m.date.slice(0,4)===y);
      let nhW=0,shW=0,draws=0;
      ym.forEach(m=>{
        const homeNH=NH.includes(m.home);
        const awayNH=NH.includes(m.away);
        if(m.hs>m.as){if(homeNH||awayNH&&!homeNH)homeNH?nhW++:shW++;}
        else if(m.as>m.hs){if(awayNH||homeNH&&!awayNH)awayNH?nhW++:shW++;}
        else draws++;
      });
      return {year:y,NH:nhW,SH:shW,Draws:draws};
    });
  },[matches,years]);

  // Biggest upsets (big away wins)
  const biggestWins=useMemo(()=>[...matches].map(m=>({...m,margin:Math.abs(m.hs-m.as),total:m.hs+m.as})).filter(m=>m.margin>0).sort((a,b)=>b.margin-a.margin).slice(0,15),[matches]);

  const yearMatches=matches.filter(m=>+m.date.slice(0,4)===selYear);

  return(<div>
    <div style={{marginBottom:28}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Autumn Internationals</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>November test window {"\u00b7"} Northern hemisphere hosts southern visitors {"\u00b7"} 1997{"\u2013"}present</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Matches" value={matches.length} icon={"\ud83c\udf42"} sub="Since 1997"/>
      <SB label="Seasons" value={years.length} icon={"\ud83d\udcc5"}/>
      <SB label="Avg Pts/Match" value={(matches.reduce((a,m)=>a+m.hs+m.as,0)/matches.length).toFixed(1)} icon={"\u26a1"}/>
      <SB label="Home Win %" value={((matches.filter(m=>m.hs>m.as).length/matches.length)*100).toFixed(1)+"%"} icon={"\ud83c\udfe0"} color="#1a5f3a"/>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Northern Hemisphere Host Records" icon={"\ud83c\udfe0"}>
        <MT headers={["Team","P","W","D","L","Win%"]}
          rows={hostRecords.map(t=>[<TeamLabel team={t.team} size={14}/>,t.p,t.w,t.d,t.l,<span style={{color:t.wp>=50?"#2a7a52":"#dc2626",fontWeight:600}}>{t.wp}%</span>])}/>
      </Card>
      <Card title="Southern Hemisphere Visitor Records" icon={"\u2708\ufe0f"}>
        <MT headers={["Team","P","W","D","L","Win%"]}
          rows={visitorRecords.map(t=>[<TeamLabel team={t.team} size={14}/>,t.p,t.w,t.d,t.l,<span style={{color:t.wp>=50?"#2a7a52":"#dc2626",fontWeight:600}}>{t.wp}%</span>])}/>
      </Card>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="NH vs SH Wins by Year" icon={"\ud83c\udf0d"}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={nhVsSh}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="NH" name="NH Wins" stackId="a" fill="#1a5f3a" radius={[0,0,0,0]}/>
            <Bar dataKey="SH" name="SH Wins" stackId="a" fill="#1e3a8a" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Biggest Victories" icon={"\ud83d\udcaa"}>
        <MT headers={["Date","Home","Score","Away","Margin"]}
          rows={biggestWins.slice(0,10).map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#d4a017",fontWeight:600}}>+{m.margin}</span>])}/>
      </Card>
    </div>

    {/* Year results */}
    <Card title={`${selYear} Autumn Internationals (${yearMatches.length} matches)`} icon={"\ud83c\udfc9"}>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>
        {years.map(y=><button key={y} onClick={()=>setSelYear(y)}
          style={{padding:"6px 14px",fontSize:12,fontWeight:selYear===y?700:400,color:selYear===y?"#f8fafc":"#94a3b8",background:selYear===y?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(selYear===y?"rgba(26,95,58,0.3)":"rgba(255,255,255,0.06)"),borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif"}}>{y}</button>)}
      </div>
      <MT headers={["Date","Home","Score","Away","Venue"]}
        rows={yearMatches.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#94a3b8",fontSize:11}}>{m.stadium}</span>])}/>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   TOURS & SUMMER INTERNATIONALS
   ═══════════════════════════════════════════════ */
function Tours({intl}){
  const matches=useMemo(()=>intl.filter(m=>m.cat==="TO"||m.cat==="ST"||m.cat==="TM").sort((a,b)=>a.date.localeCompare(b.date)),[intl]);
  const [filterTeam,setFilterTeam]=useState("all");

  // All teams involved
  const allTeams=useMemo(()=>{
    const t=new Set();
    matches.forEach(m=>{t.add(m.home);t.add(m.away);});
    return [...t].sort();
  },[matches]);

  // Records by team
  const teamRecords=useMemo(()=>{
    const t={};
    matches.forEach(m=>{
      [m.home,m.away].forEach(team=>{if(!t[team])t[team]={team,p:0,w:0,d:0,l:0,pf:0,pa:0,homeP:0,homeW:0,awayP:0,awayW:0};});
      t[m.home].p++;t[m.home].homeP++;t[m.home].pf+=m.hs;t[m.home].pa+=m.as;
      t[m.away].p++;t[m.away].awayP++;t[m.away].pf+=m.as;t[m.away].pa+=m.hs;
      if(m.hs>m.as){t[m.home].w++;t[m.home].homeW++;t[m.away].l++;}
      else if(m.as>m.hs){t[m.away].w++;t[m.away].awayW++;t[m.home].l++;}
      else{t[m.home].d++;t[m.away].d++;}
    });
    return Object.values(t).map(s=>({...s,wp:s.p?+((s.w/s.p)*100).toFixed(1):0,awayWP:s.awayP?+((s.awayW/s.awayP)*100).toFixed(1):0})).sort((a,b)=>b.w-a.w);
  },[matches]);

  // Matches by decade
  const byDecade=useMemo(()=>{
    const d={};
    matches.forEach(m=>{
      const yr=+m.date.slice(0,4);
      const dec=Math.floor(yr/10)*10+"s";
      if(!d[dec])d[dec]={decade:dec,matches:0,totalPts:0};
      d[dec].matches++;d[dec].totalPts+=m.hs+m.as;
    });
    return Object.values(d).map(x=>({...x,avgPts:+(x.totalPts/x.matches).toFixed(1)})).sort((a,b)=>a.decade.localeCompare(b.decade));
  },[matches]);

  // H2H records for tours
  const h2h=useMemo(()=>{
    const pairs={};
    matches.forEach(m=>{
      const key=[m.home,m.away].sort().join(" v ");
      if(!pairs[key])pairs[key]={pair:key,t1:m.home<m.away?m.home:m.away,t2:m.home<m.away?m.away:m.home,t1w:0,t2w:0,draws:0,total:0};
      pairs[key].total++;
      const winner=m.hs>m.as?m.home:m.as>m.hs?m.away:null;
      if(winner===pairs[key].t1)pairs[key].t1w++;
      else if(winner===pairs[key].t2)pairs[key].t2w++;
      else pairs[key].draws++;
    });
    return Object.values(pairs).sort((a,b)=>b.total-a.total);
  },[matches]);

  // Touring records by host nation (who hosts the most tours)
  const hostNations=useMemo(()=>{
    const h={};
    matches.forEach(m=>{
      if(!h[m.home])h[m.home]={team:m.home,hosted:0,homeW:0};
      h[m.home].hosted++;
      if(m.hs>m.as)h[m.home].homeW++;
    });
    return Object.values(h).map(x=>({...x,homeWP:x.hosted?+((x.homeW/x.hosted)*100).toFixed(1):0})).sort((a,b)=>b.hosted-a.hosted);
  },[matches]);

  const filtered=filterTeam==="all"?matches:matches.filter(m=>m.home===filterTeam||m.away===filterTeam);

  return(<div>
    <div style={{marginBottom:28}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Tours & Summer Internationals</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>International tours, summer tests & bilateral series {"\u00b7"} {matches.length} matches {"\u00b7"} 1871{"\u2013"}2025</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Tour Matches" value={matches.length} icon={"\u2708\ufe0f"} sub="All tours & summer tests"/>
      <SB label="Home Win %" value={((matches.filter(m=>m.hs>m.as).length/matches.length)*100).toFixed(1)+"%"} icon={"\ud83c\udfe0"} color="#1a5f3a"/>
      <SB label="Away Win %" value={((matches.filter(m=>m.as>m.hs).length/matches.length)*100).toFixed(1)+"%"} icon={"\u2708\ufe0f"} color="#1e3a8a"/>
      <SB label="Draws" value={matches.filter(m=>m.hs===m.as).length} icon={"\ud83e\udd1d"}/>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="All-Time Tour Records" icon={"\ud83d\udcca"}>
        <MT headers={["Team","P","W","D","L","Win%","Away W%"]}
          rows={teamRecords.map(t=>[<TeamLabel team={t.team} size={14}/>,t.p,t.w,t.d,t.l,<span style={{color:t.wp>=50?"#2a7a52":"#dc2626",fontWeight:600}}>{t.wp}%</span>,<span style={{color:t.awayWP>=40?"#2a7a52":"#dc2626"}}>{t.awayWP}%</span>])}/>
      </Card>
      <Card title="Host Nation Records" icon={"\ud83c\udfe0"}>
        <MT headers={["Host","Matches Hosted","Home Wins","Home Win%"]}
          rows={hostNations.map(h=>[<TeamLabel team={h.team} size={14}/>,h.hosted,h.homeW,<span style={{color:h.homeWP>=50?"#2a7a52":"#dc2626",fontWeight:600}}>{h.homeWP}%</span>])}/>
      </Card>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Head-to-Head on Tour" icon={"\ud83e\udd3c"}>
        <MT headers={["Matchup","Matches","","W-D-W",""]}
          rows={h2h.slice(0,12).map(p=>[<span style={{fontWeight:600,fontSize:12}}>{p.pair}</span>,p.total,<TeamLabel team={p.t1} size={12}/>,<span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>{p.t1w}-{p.draws}-{p.t2w}</span>,<TeamLabel team={p.t2} size={12}/>])}/>
      </Card>
      <Card title="Tour Matches by Decade" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byDecade}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="matches" name="Matches" fill="#1e3a8a" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Filtered match list */}
    <Card title={"All Tour Matches ("+(filterTeam==="all"?"All Teams":filterTeam)+": "+filtered.length+")"} icon={"\ud83c\udfc9"}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <span style={{fontSize:12,color:"#94a3b8"}}>Filter:</span>
        <select value={filterTeam} onChange={e=>setFilterTeam(e.target.value)} style={{background:"#1e293b",color:"#e2e8f0",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:12}}>
          <option value="all">All Teams</option>
          {allTeams.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{fontSize:11,color:"#94a3b8"}}>{filtered.length} matches</span>
      </div>
      <div style={{overflowX:"auto",maxHeight:500,overflow:"auto"}}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Date","Home","Score","Away","Venue"].map((h,i)=><th key={i} style={{padding:"8px 8px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif",position:"sticky",top:0,background:"#0f172a",zIndex:1}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.slice(-200).reverse().map((m,ri)=>{
            const hw=m.hs>m.as,aw=m.as>m.hs;
            return(<tr key={ri} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
              <td style={{padding:"8px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)",whiteSpace:"nowrap"}}>{m.date}</td>
              <td style={{padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontWeight:hw?600:400,color:hw?"#f8fafc":"#94a3b8",display:"inline-flex",alignItems:"center",gap:4}}><Flag team={m.home} size={14}/>{m.home}</span></td>
              <td style={{padding:"8px",textAlign:"right",fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)",background:"rgba(26,95,58,0.05)",borderRadius:3}}>{m.hs} - {m.as}</td>
              <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontWeight:aw?600:400,color:aw?"#f8fafc":"#94a3b8",display:"inline-flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>{m.away}<Flag team={m.away} size={14}/></span></td>
              <td style={{padding:"8px",textAlign:"right",color:"#64748b",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.stadium}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>
      {filtered.length>200&&<p style={{fontSize:11,color:"#64748b",marginTop:8,textAlign:"center"}}>Showing most recent 200 of {filtered.length} matches</p>}
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   HEAD-TO-HEAD EXPLORER
   ═══════════════════════════════════════════════ */
function HeadToHead({intl,sn}){
  const all=useMemo(()=>[...intl,...sn],[intl,sn]);
  const [teamA,setTeamA]=useState("England");
  const [teamB,setTeamB]=useState("New Zealand");
  const ttStyle={background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"};

  const h2h=useMemo(()=>{
    const matches=all.filter(m=>(m.home===teamA&&m.away===teamB)||(m.home===teamB&&m.away===teamA))
      .sort((a,b)=>a.date.localeCompare(b.date));
    let aW=0,bW=0,draws=0,aPF=0,bPF=0;
    const byDecade={};
    const streakArr=[];
    matches.forEach(m=>{
      const aHome=m.home===teamA;
      const aScore=aHome?m.hs:m.as, bScore=aHome?m.as:m.hs;
      aPF+=aScore; bPF+=bScore;
      if(aScore>bScore){aW++;streakArr.push("A");}
      else if(bScore>aScore){bW++;streakArr.push("B");}
      else{draws++;streakArr.push("D");}
      const dec=m.date.slice(0,3)+"0s";
      if(!byDecade[dec])byDecade[dec]={decade:dec,aW:0,bW:0,d:0};
      if(aScore>bScore)byDecade[dec].aW++;
      else if(bScore>aScore)byDecade[dec].bW++;
      else byDecade[dec].d++;
    });
    // Current streak
    let streak="",streakCount=0;
    for(let i=streakArr.length-1;i>=0;i--){
      if(i===streakArr.length-1){streak=streakArr[i];streakCount=1;}
      else if(streakArr[i]===streak)streakCount++;
      else break;
    }
    const streakTeam=streak==="A"?teamA:streak==="B"?teamB:"Draw";
    // Biggest wins
    const withMargin=matches.map(m=>{
      const aHome=m.home===teamA;
      const aS=aHome?m.hs:m.as,bS=aHome?m.as:m.hs;
      return {...m,aS,bS,margin:Math.abs(aS-bS),winner:aS>bS?teamA:bS>aS?teamB:"Draw"};
    });
    const biggestA=[...withMargin].filter(m=>m.winner===teamA).sort((a,b)=>b.margin-a.margin).slice(0,3);
    const biggestB=[...withMargin].filter(m=>m.winner===teamB).sort((a,b)=>b.margin-a.margin).slice(0,3);
    return {matches,aW,bW,draws,aPF,bPF,byDecade:Object.values(byDecade),streakTeam,streakCount,biggestA,biggestB,withMargin};
  },[all,teamA,teamB]);

  const decadeChart=h2h.byDecade;
  // Recent form (last 10)
  const recent=h2h.withMargin.slice(-10);

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Head-to-Head Explorer</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Select any two teams to see their complete rivalry breakdown</p>
    </div>

    {/* Team selectors */}
    {(()=>{
      const allTeams=[...new Set([...all.map(m=>m.home),...all.map(m=>m.away)])].sort();
      return(
      <div style={{display:"flex",gap:16,marginBottom:28,alignItems:"center",flexWrap:"wrap"}}>
        <label className="sr-only" htmlFor="h2h-teamA">Select first team</label>
        <select className="rf-select" id="h2h-teamA" value={teamA} onChange={e=>setTeamA(e.target.value)} style={{padding:"10px 16px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#f8fafc",fontSize:14,fontFamily:"var(--ff-head)",cursor:"pointer"}}>
          {allTeams.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{fontSize:18,color:"var(--rf-gold)",fontWeight:700}} aria-hidden="true">vs</span>
        <label className="sr-only" htmlFor="h2h-teamB">Select second team</label>
        <select className="rf-select" id="h2h-teamB" value={teamB} onChange={e=>setTeamB(e.target.value)} style={{padding:"10px 16px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#f8fafc",fontSize:14,fontFamily:"var(--ff-head)",cursor:"pointer"}}>
          {allTeams.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{fontSize:12,color:"#94a3b8"}}>{h2h.matches.length} matches found</span>
      </div>);
    })()}

    {h2h.matches.length===0?<Card title="No Matches Found" icon={"\u26a0\ufe0f"}><p style={{color:"#94a3b8",fontSize:13}}>These two teams have not played each other in the dataset.</p></Card>:<>
    {/* Stat boxes */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Matches" value={h2h.matches.length} icon={"\ud83c\udfc9"}/>
      <SB label={teamA+" Wins"} value={h2h.aW} color="#1a5f3a"/>
      <SB label="Draws" value={h2h.draws} color="#d4a017"/>
      <SB label={teamB+" Wins"} value={h2h.bW} color="#dc2626"/>
      <SB label="Current Streak" value={h2h.streakCount+" ("+h2h.streakTeam+")"} color="#0ea5e9"/>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      {/* Wins by decade */}
      <Card title="Wins by Decade" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={decadeChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="aW" name={teamA} fill="#1a5f3a" stackId="a"/>
            <Bar dataKey="d" name="Draws" fill="#d4a017" stackId="a"/>
            <Bar dataKey="bW" name={teamB} fill="#dc2626" stackId="a" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Points summary */}
      <Card title="Points Comparison" icon={"\ud83d\udcca"}>
        <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,padding:16}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:"#1a5f3a",fontFamily:"'Barlow Condensed',sans-serif"}}>{h2h.aPF}</div>
            <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase"}}>{teamA} Total Points</div>
            <div style={{fontSize:13,color:"#C5CDD8",marginTop:4}}>{(h2h.aPF/h2h.matches.length).toFixed(1)} avg/game</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:"#dc2626",fontFamily:"'Barlow Condensed',sans-serif"}}>{h2h.bPF}</div>
            <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase"}}>{teamB} Total Points</div>
            <div style={{fontSize:13,color:"#C5CDD8",marginTop:4}}>{(h2h.bPF/h2h.matches.length).toFixed(1)} avg/game</div>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden"}}>
            <div style={{width:(h2h.aW/(h2h.matches.length||1)*100)+"%",background:"#1a5f3a"}}/>
            <div style={{width:(h2h.draws/(h2h.matches.length||1)*100)+"%",background:"#d4a017"}}/>
            <div style={{width:(h2h.bW/(h2h.matches.length||1)*100)+"%",background:"#dc2626"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:10,color:"#94a3b8"}}>
            <span>{teamA} {((h2h.aW/(h2h.matches.length||1))*100).toFixed(0)}%</span>
            <span>{teamB} {((h2h.bW/(h2h.matches.length||1))*100).toFixed(0)}%</span>
          </div>
        </div>
      </Card>
    </div>

    {/* Biggest wins */}
    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title={"Biggest "+teamA+" Wins"} icon={"\ud83d\udca5"}>
        {h2h.biggestA.length?<MT headers={["Date","Score","Margin"]} rows={h2h.biggestA.map(m=>[m.date,<span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{m.aS}-{m.bS}</span>,<span style={{color:"#d4a017",fontWeight:700}}>+{m.margin}</span>])}/>:<p style={{color:"#94a3b8",fontSize:12}}>No wins recorded</p>}
      </Card>
      <Card title={"Biggest "+teamB+" Wins"} icon={"\ud83d\udca5"}>
        {h2h.biggestB.length?<MT headers={["Date","Score","Margin"]} rows={h2h.biggestB.map(m=>[m.date,<span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{m.bS}-{m.aS}</span>,<span style={{color:"#d4a017",fontWeight:700}}>+{m.margin}</span>])}/>:<p style={{color:"#94a3b8",fontSize:12}}>No wins recorded</p>}
      </Card>
    </div>

    {/* Recent form (last 10) */}
    <Card title="Last 10 Meetings" icon={"\ud83d\udd1c"} style={{marginBottom:24}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {recent.map((m,i)=>(
          <div key={i} style={{padding:"8px 12px",borderRadius:8,background:m.winner===teamA?"rgba(26,95,58,0.1)":m.winner===teamB?"rgba(220,38,38,0.08)":"rgba(212,160,23,0.08)",border:"1px solid "+(m.winner===teamA?"rgba(26,95,58,0.2)":m.winner===teamB?"rgba(220,38,38,0.15)":"rgba(212,160,23,0.15)"),textAlign:"center",minWidth:70}}>
            <div style={{fontSize:10,color:"#94a3b8"}}>{m.date.slice(0,4)}</div>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:m.winner===teamA?"#2a7a52":m.winner===teamB?"#dc2626":"#d4a017"}}>{m.aS}-{m.bS}</div>
          </div>
        ))}
      </div>
    </Card>

    {/* Full results table */}
    <Card title={"All "+h2h.matches.length+" Matches"} icon={"\ud83d\udcdd"}>
      <div className="rf-table-wrap" style={{maxHeight:400,overflowY:"auto"}}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead style={{position:"sticky",top:0,background:"#0f172a",zIndex:2}}><tr>{["Date","Home","Score","Away","Venue"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i===2?"center":"left",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{[...h2h.matches].reverse().map((m,i)=>{
            const hw=m.hs>m.as;
            return(<tr key={i}>
              <td style={{padding:"8px",color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.date}</td>
              <td style={{padding:"8px",fontWeight:hw?700:400,color:hw?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={m.home} size={14}/></td>
              <td style={{padding:"8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:"rgba(26,95,58,0.08)",padding:"3px 10px",borderRadius:6}}>{m.hs} - {m.as}</span></td>
              <td style={{padding:"8px",fontWeight:!hw&&m.as>m.hs?700:400,color:!hw&&m.as>m.hs?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={m.away} size={14}/></td>
              <td style={{padding:"8px",color:"#64748b",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.stadium||""}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </Card>
    </>}
  </div>);
}

/* ═══════════════════════════════════════════════
   DECADE-BY-DECADE ANALYSIS
   ═══════════════════════════════════════════════ */
function Decades({intl,sn}){
  const all=useMemo(()=>[...intl,...sn],[intl,sn]);
  const ttStyle={background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"};

  const decades=useMemo(()=>{
    const d={};
    all.forEach(m=>{
      const yr=parseInt(m.date.slice(0,4));
      const dec=Math.floor(yr/10)*10+"s";
      if(!d[dec])d[dec]={decade:dec,matches:0,totalPts:0,homeWins:0,awayWins:0,draws:0,biggestMargin:0,biggestMatch:null,teamWins:{}};
      d[dec].matches++;
      d[dec].totalPts+=m.hs+m.as;
      if(m.hs>m.as){d[dec].homeWins++;const t=m.home;d[dec].teamWins[t]=(d[dec].teamWins[t]||0)+1;}
      else if(m.as>m.hs){d[dec].awayWins++;const t=m.away;d[dec].teamWins[t]=(d[dec].teamWins[t]||0)+1;}
      else d[dec].draws++;
      const margin=Math.abs(m.hs-m.as);
      if(margin>d[dec].biggestMargin){d[dec].biggestMargin=margin;d[dec].biggestMatch=m;}
    });
    return Object.values(d).sort((a,b)=>a.decade.localeCompare(b.decade)).map(dec=>{
      const topTeam=Object.entries(dec.teamWins).sort((a,b)=>b[1]-a[1])[0];
      return {...dec,avgPts:(dec.totalPts/dec.matches).toFixed(1),homeWinPct:((dec.homeWins/dec.matches)*100).toFixed(1),dominant:topTeam?topTeam[0]:"N/A",dominantWins:topTeam?topTeam[1]:0};
    });
  },[all]);

  // Chart data
  const ptsChart=decades.map(d=>({decade:d.decade,avg:parseFloat(d.avgPts)}));
  const matchesChart=decades.map(d=>({decade:d.decade,matches:d.matches}));

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Decade-by-Decade Analysis</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>How international rugby has evolved from 1871 to the 2020s</p>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Average Points Per Match by Decade" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={ptsChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:9}} angle={-30} textAnchor="end" height={45}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Area type="monotone" dataKey="avg" name="Avg Pts/Match" stroke="#3ddc84" fill="rgba(61,220,132,0.15)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Matches Played by Decade" icon={"\ud83d\udcca"}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={matchesChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:9}} angle={-30} textAnchor="end" height={45}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="matches" name="Matches" fill="#1a5f3a" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card title="Decade Summary" icon={"\ud83d\udcc5"}>
      <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{["Decade","Matches","Avg Pts","Home Win%","Dominant Team","Wins","Biggest Win"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
        <tbody>{decades.map((d,i)=>(
          <tr key={i}>
            <td style={{padding:"10px 8px",fontWeight:700,color:"#f8fafc",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.decade}</td>
            <td style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.matches}</td>
            <td style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#3ddc84",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.avgPts}</td>
            <td style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.homeWinPct}%</td>
            <td style={{padding:"10px 8px",textAlign:"right",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={d.dominant} size={14}/></td>
            <td style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#d4a017",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.dominantWins}</td>
            <td style={{padding:"10px 8px",textAlign:"right",fontSize:11,color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{d.biggestMatch?d.biggestMatch.home+" "+d.biggestMatch.hs+"-"+d.biggestMatch.as+" "+d.biggestMatch.away:"-"}</td>
          </tr>
        ))}</tbody>
      </table>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   GRAND SLAMS & TRIPLE CROWNS
   ═══════════════════════════════════════════════ */
function GrandSlams({sn,intl,champs}){
  // Compute Grand Slams and Triple Crowns from Six Nations data
  const homeNations=["England","Ireland","Scotland","Wales"];

  const gsData=useMemo(()=>{
    // Group SN matches by year, compute standings
    const years={};
    sn.forEach(m=>{
      const yr=m.date.slice(0,4);
      if(!years[yr])years[yr]=[];
      years[yr].push(m);
    });

    const grandSlams=[];
    const tripleCrowns=[];

    Object.entries(years).forEach(([yr,matches])=>{
      // Determine teams in competition
      const teams=new Set();
      matches.forEach(m=>{teams.add(m.home);teams.add(m.away);});
      const teamArr=[...teams];
      const numOpponents=teamArr.length-1;

      // Compute W/L per team
      const stats={};
      teamArr.forEach(t=>{stats[t]={w:0,l:0,d:0,played:0,beaten:new Set()};});
      matches.forEach(m=>{
        if(stats[m.home])stats[m.home].played++;
        if(stats[m.away])stats[m.away].played++;
        if(m.hs>m.as){if(stats[m.home])stats[m.home].w++;if(stats[m.home])stats[m.home].beaten.add(m.away);if(stats[m.away])stats[m.away].l++;}
        else if(m.as>m.hs){if(stats[m.away])stats[m.away].w++;if(stats[m.away])stats[m.away].beaten.add(m.home);if(stats[m.home])stats[m.home].l++;}
        else{if(stats[m.home])stats[m.home].d++;if(stats[m.away])stats[m.away].d++;}
      });

      // Grand Slam: beat all opponents
      teamArr.forEach(t=>{
        if(stats[t]&&stats[t].beaten.size===numOpponents&&stats[t].w===numOpponents){
          grandSlams.push({year:parseInt(yr),team:t});
        }
      });

      // Triple Crown: home nation beats all other home nations
      homeNations.forEach(t=>{
        if(!stats[t])return;
        const otherHN=homeNations.filter(h=>h!==t&&teams.has(h));
        if(otherHN.length>=3&&otherHN.every(h=>stats[t].beaten.has(h))){
          tripleCrowns.push({year:parseInt(yr),team:t});
        }
      });
    });

    return {grandSlams:grandSlams.sort((a,b)=>a.year-b.year),tripleCrowns:tripleCrowns.sort((a,b)=>a.year-b.year)};
  },[sn]);

  // Count by team
  const gsByTeam=useMemo(()=>{
    const t={};
    gsData.grandSlams.forEach(g=>{t[g.team]=(t[g.team]||0)+1;});
    return Object.entries(t).map(([team,count])=>({team,count})).sort((a,b)=>b.count-a.count);
  },[gsData]);

  const tcByTeam=useMemo(()=>{
    const t={};
    gsData.tripleCrowns.forEach(g=>{t[g.team]=(t[g.team]||0)+1;});
    return Object.entries(t).map(([team,count])=>({team,count})).sort((a,b)=>b.count-a.count);
  },[gsData]);

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Grand Slams & Triple Crowns</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Computed from match results {"\u00b7"} Six Nations / Five Nations / Home Nations era</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Grand Slams" value={gsData.grandSlams.length} icon={"\ud83d\udc51"} color="#d4a017"/>
      <SB label="Most Grand Slams" value={gsByTeam[0]?gsByTeam[0].team+" ("+gsByTeam[0].count+")":"N/A"} color="#1a5f3a"/>
      <SB label="Triple Crowns" value={gsData.tripleCrowns.length} icon={"\ud83d\udc51"}/>
      <SB label="Most Triple Crowns" value={tcByTeam[0]?tcByTeam[0].team+" ("+tcByTeam[0].count+")":"N/A"} color="#dc2626"/>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Grand Slams by Nation" icon={"\ud83d\udc51"}>
        <MT headers={["Nation","Grand Slams","Years"]}
          rows={gsByTeam.map(g=>[<TeamLabel team={g.team} size={16}/>,<span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{g.count}</span>,<span style={{fontSize:11,color:"#94a3b8"}}>{gsData.grandSlams.filter(s=>s.team===g.team).map(s=>s.year).join(", ")}</span>])}/>
      </Card>
      <Card title="Triple Crowns by Nation" icon={"\ud83d\udc51"}>
        <MT headers={["Nation","Triple Crowns","Years"]}
          rows={tcByTeam.map(g=>[<TeamLabel team={g.team} size={16}/>,<span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{g.count}</span>,<span style={{fontSize:11,color:"#94a3b8"}}>{gsData.tripleCrowns.filter(s=>s.team===g.team).map(s=>s.year).join(", ")}</span>])}/>
      </Card>
    </div>

    {/* Grand Slam timeline */}
    <Card title="Grand Slam Timeline" icon={"\ud83d\udcc5"}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {gsData.grandSlams.map((g,i)=>(
          <div key={i} style={{padding:"6px 12px",borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.15)",textAlign:"center",minWidth:65}}>
            <div style={{fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#d4a017"}}>{g.year}</div>
            <div style={{fontSize:10,color:"#C5CDD8",marginTop:2}}>{g.team}</div>
          </div>
        ))}
      </div>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   UPSET INDEX
   ═══════════════════════════════════════════════ */
function Upsets({intl,sn}){
  const all=useMemo(()=>[...intl,...sn],[intl,sn]);

  // Build historical win rates for each pair to calculate "upset probability"
  const upsets=useMemo(()=>{
    // First pass: build h2h records up to each match date
    const h2hRecord={};
    const sorted=[...all].sort((a,b)=>a.date.localeCompare(b.date));
    const upsetList=[];

    sorted.forEach(m=>{
      const keyAB=[m.home,m.away].sort().join("|");
      if(!h2hRecord[keyAB])h2hRecord[keyAB]={};
      const rec=h2hRecord[keyAB];
      if(!rec[m.home])rec[m.home]=0;
      if(!rec[m.away])rec[m.away]=0;

      const totalPrev=rec[m.home]+rec[m.away];
      const winner=m.hs>m.as?m.home:m.as>m.hs?m.away:null;
      if(winner&&totalPrev>=5){
        const winnerPrev=rec[winner];
        const winPct=winnerPrev/totalPrev;
        // If winner had <35% historical win rate and won, that's an upset
        if(winPct<0.35){
          const upsetScore=((1-winPct)*100*(Math.abs(m.hs-m.as)>10?1.5:1)).toFixed(0);
          upsetList.push({...m,winner,loser:winner===m.home?m.away:m.home,winnerHistPct:(winPct*100).toFixed(0),upsetScore:parseInt(upsetScore),totalPrev,margin:Math.abs(m.hs-m.as)});
        }
      }
      // Update record
      if(m.hs>m.as)rec[m.home]++;
      else if(m.as>m.hs)rec[m.away]++;
    });

    return upsetList.sort((a,b)=>b.upsetScore-a.upsetScore).slice(0,30);
  },[all]);

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Upset Index</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Biggest upsets based on historical head-to-head win rate {"\u00b7"} Min 5 previous meetings</p>
      <p style={{margin:"4px 0 0",fontSize:11,color:"#64748b"}}>Methodology: A match qualifies as an upset when the winner had a pre-match H2H win rate below 35%. Upset score = (1 - historical win %) × 100, with a 1.5× multiplier for winning margins over 10 points.</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Upsets Found" value={upsets.length} icon={"\ud83e\udd2f"} sub="Win rate < 35%"/>
      {upsets[0]&&<SB label="Biggest Upset" value={upsets[0].winner+" "+upsets[0].margin+"pts"} sub={upsets[0].date} color="#dc2626"/>}
      {upsets[0]&&<SB label="Upset Score" value={upsets[0].upsetScore} sub="Higher = more shocking" color="#d4a017"/>}
    </div>

    <Card title="Top 30 Biggest Upsets" icon={"\ud83e\udd2f"}>
      <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{["#","Date","Underdog","Score","Favourite","Hist Win%","Margin","Upset Score"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
        <tbody>{upsets.map((u,i)=>(
          <tr key={i}>
            <td style={{padding:"8px",fontWeight:700,color:i<3?"#d4a017":"#94a3b8",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{i+1}</td>
            <td style={{padding:"8px",color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{u.date}</td>
            <td style={{padding:"8px",fontWeight:700,color:"#3ddc84",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={u.winner} size={14}/></td>
            <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:"rgba(26,95,58,0.08)",padding:"3px 10px",borderRadius:6}}>{u.home===u.winner?u.hs+" - "+u.as:u.as+" - "+u.hs}</span></td>
            <td style={{padding:"8px",textAlign:"right",color:"#dc2626",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={u.loser} size={14}/></td>
            <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#ef4444",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{u.winnerHistPct}%</td>
            <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>+{u.margin}</td>
            <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#d4a017",background:"rgba(212,160,23,0.08)",padding:"3px 10px",borderRadius:6}}>{u.upsetScore}</span></td>
          </tr>
        ))}</tbody>
      </table>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   CAPTAINS & COACHES
   ═══════════════════════════════════════════════ */
function CaptainsCoaches(){
  const [sub,setSub]=useState("captains");

  // Most-capped captains (major nations)
  const captains=[
    {name:"Richie McCaw",team:"New Zealand",capsAsCpt:110,totalCaps:148,years:"2004–2015",highlights:"2× RWC winner, most wins as captain (131)"},
    {name:"Sergio Parisse",team:"Italy",capsAsCpt:96,totalCaps:142,years:"2008–2019",highlights:"Italy's greatest ever player, most 6N caps"},
    {name:"Brian O'Driscoll",team:"Ireland",capsAsCpt:83,totalCaps:141,years:"2003–2012",highlights:"Grand Slam 2009, Lions captain 2005"},
    {name:"Alun Wyn Jones",team:"Wales",capsAsCpt:74,totalCaps:170,years:"2009–2022",highlights:"Most capped player ever, 3× Grand Slam"},
    {name:"George Gregan",team:"Australia",capsAsCpt:59,totalCaps:139,years:"2001–2007",highlights:"RWC 1999 winner, most capped Wallaby (at time)"},
    {name:"John Smit",team:"South Africa",capsAsCpt:83,totalCaps:111,years:"2003–2011",highlights:"RWC 2007 winner, most capped SA captain"},
    {name:"Sam Warburton",team:"Wales",capsAsCpt:49,totalCaps:79,years:"2011–2017",highlights:"Lions captain 2013 & 2017, youngest Wales captain"},
    {name:"Rory Best",team:"Ireland",capsAsCpt:38,totalCaps:124,years:"2016–2019",highlights:"Grand Slam 2018, 3× Six Nations titles"},
    {name:"Martin Johnson",team:"England",capsAsCpt:39,totalCaps:84,years:"1998–2003",highlights:"RWC 2003 winner, Lions captain 1997 & 2001"},
    {name:"Thierry Dusautoir",team:"France",capsAsCpt:56,totalCaps:80,years:"2009–2015",highlights:"World Rugby Player of Year 2011, RWC finalist"},
    {name:"Greig Laidlaw",team:"Scotland",capsAsCpt:39,totalCaps:76,years:"2013–2019",highlights:"Scotland's most capped captain in modern era"},
    {name:"Siya Kolisi",team:"South Africa",capsAsCpt:68,totalCaps:85,years:"2018–2024",highlights:"2× RWC winner, first Black Springbok captain"},
    {name:"Sean Fitzpatrick",team:"New Zealand",capsAsCpt:51,totalCaps:92,years:"1992–1997",highlights:"RWC 1987 winner, dominated 1990s"},
    {name:"Willie John McBride",team:"Ireland",capsAsCpt:11,totalCaps:63,years:"1968–1975",highlights:"Lions captain 1974 (unbeaten), 17 Lions Tests"},
    {name:"Jason Leonard",team:"England",capsAsCpt:4,totalCaps:119,years:"1990–2004",highlights:"Most capped England forward, RWC 2003"},
  ].sort((a,b)=>b.capsAsCpt-a.capsAsCpt);

  // Head coaches by win record
  const coaches=[
    {name:"Steve Hansen",team:"New Zealand",years:"2012–2019",matches:107,wins:93,draws:4,losses:10,winPct:"86.9",highlights:"RWC 2015, 87% win rate"},
    {name:"Graham Henry",team:"New Zealand",years:"2004–2011",matches:103,wins:88,draws:2,losses:13,winPct:"85.4",highlights:"RWC 2011, 5× Coach of Year"},
    {name:"Rassie Erasmus",team:"South Africa",years:"2018–present",matches:35,wins:28,draws:0,losses:7,winPct:"80.0",highlights:"RWC 2019, transformed Boks"},
    {name:"Jake White",team:"South Africa",years:"2004–2007",matches:48,wins:36,draws:1,losses:11,winPct:"75.0",highlights:"RWC 2007 winner"},
    {name:"Sir Clive Woodward",team:"England",years:"1997–2004",matches:83,wins:59,draws:2,losses:22,winPct:"71.1",highlights:"RWC 2003, Grand Slam 2003"},
    {name:"Eddie Jones",team:"England",years:"2015–2022",matches:81,wins:54,draws:1,losses:26,winPct:"66.7",highlights:"Grand Slam 2016, RWC finalist 2019"},
    {name:"Warren Gatland",team:"Wales",years:"2007–2019, 2023–",matches:150,wins:90,draws:4,losses:56,winPct:"60.0",highlights:"3× Grand Slam, Lions coach 2013/2017/2021"},
    {name:"Joe Schmidt",team:"Ireland",years:"2013–2019",matches:70,wins:50,draws:0,losses:20,winPct:"71.4",highlights:"Grand Slam 2018, 3× Six Nations"},
    {name:"Andy Farrell",team:"Ireland",years:"2020–present",matches:60,wins:44,draws:0,losses:16,winPct:"73.3",highlights:"Grand Slam 2023, 2× Six Nations"},
    {name:"Fabien Galthié",team:"France",years:"2020–present",matches:55,wins:40,draws:1,losses:14,winPct:"72.7",highlights:"Grand Slam 2022, Six Nations 2025"},
    {name:"Gregor Townsend",team:"Scotland",years:"2017–present",matches:80,wins:41,draws:2,losses:37,winPct:"51.3",highlights:"Longest serving Scotland coach"},
    {name:"Gonzalo Quesada",team:"Italy",years:"2024–present",matches:18,wins:6,draws:0,losses:12,winPct:"33.3",highlights:"Italy's resurgence era"},
    {name:"Kitch Christie",team:"South Africa",years:"1994–1996",matches:14,wins:14,draws:0,losses:0,winPct:"100.0",highlights:"RWC 1995, unbeaten record"},
    {name:"John Hart",team:"New Zealand",years:"1996–1999",matches:41,wins:31,draws:1,losses:9,winPct:"75.6",highlights:"3× Tri-Nations, first SA series win"},
  ].sort((a,b)=>parseFloat(b.winPct)-parseFloat(a.winPct));

  // Current 2026 coaches & captains
  const current2026=[
    {team:"England",coach:"Steve Borthwick",captain:"Maro Itoje",coachSince:"2022",captainCaps:"100+"},
    {team:"France",coach:"Fabien Galthié",captain:"Antoine Dupont",coachSince:"2020",captainCaps:"70+"},
    {team:"Ireland",coach:"Andy Farrell",captain:"Caelan Doris",coachSince:"2020",captainCaps:"45+"},
    {team:"Scotland",coach:"Gregor Townsend",captain:"Sione Tuipulotu",coachSince:"2017",captainCaps:"30+"},
    {team:"Wales",coach:"Steve Tandy",captain:"Jac Morgan",coachSince:"2025",captainCaps:"25+"},
    {team:"Italy",coach:"Gonzalo Quesada",captain:"Michele Lamaro",coachSince:"2024",captainCaps:"50+"},
  ];

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Captains & Coaches</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Great leaders of the game — captaincy records, coaching win rates, and current appointments</p>
    </div>

    <div className="rf-sub-tabs" style={{display:"flex",gap:6,marginBottom:24}}>
      {[{id:"captains",label:"Top Captains",ic:"\u00a9\ufe0f"},{id:"coaches",label:"Head Coaches",ic:"\ud83e\uddd1\u200d\ud83c\udfeb"},{id:"current",label:"Current 2026",ic:"\ud83d\udcc6"}].map(t=>(
        <button key={t.id} onClick={()=>setSub(t.id)}
          style={{padding:"10px 20px",fontSize:12.5,fontWeight:sub===t.id?600:400,color:sub===t.id?"#F5F7FA":"#5A6A82",background:sub===t.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.02)",border:"1px solid "+(sub===t.id?"rgba(212,160,23,0.25)":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{t.ic}</span>{t.label}</button>
      ))}
    </div>

    {sub==="captains"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
        <SB label="Most Caps as Captain" value="R. McCaw (110)" icon={"\ud83c\udfc6"} color="#1a5f3a"/>
        <SB label="Most Wins as Captain" value="R. McCaw (131)" color="#d4a017"/>
        <SB label="2× RWC Winning Captain" value="McCaw & Kolisi"/>
      </div>
      <Card title="Most Capped Captains in International Rugby" icon={"\ud83c\udfc6"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Captain","Nation","Caps as Cpt","Total Caps","Years","Highlights"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{captains.map((c,i)=>(
            <tr key={i}>
              <td style={{padding:"8px",color:i<3?"#d4a017":"#94a3b8",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{i+1}</td>
              <td style={{padding:"8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.name}</td>
              <td style={{padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={c.team} size={14}/></td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#3ddc84",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.capsAsCpt}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.totalCaps}</td>
              <td style={{padding:"8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.years}</td>
              <td style={{padding:"8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)",maxWidth:200}}>{c.highlights}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>}

    {sub==="coaches"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
        <SB label="Highest Win Rate (14+ Tests)" value="Kitch Christie (100%)" icon={"\ud83c\udfc6"} color="#dc2626"/>
        <SB label="Best Modern Coach" value="S. Hansen (86.9%)" color="#1a5f3a"/>
        <SB label="Most Matches" value="W. Gatland (150+)" color="#d4a017"/>
      </div>
      <Card title="Head Coaches — Career Win Records" icon={"\ud83e\uddd1\u200d\ud83c\udfeb"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Coach","Nation","Years","M","W","D","L","Win %","Highlights"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{coaches.map((c,i)=>(
            <tr key={i}>
              <td style={{padding:"8px",color:i<3?"#d4a017":"#94a3b8",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{i+1}</td>
              <td style={{padding:"8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.name}</td>
              <td style={{padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={c.team} size={14}/></td>
              <td style={{padding:"8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.years}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.matches}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#3ddc84",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.wins}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#d4a017",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.draws}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#ef4444",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.losses}</td>
              <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{color:parseFloat(c.winPct)>=75?"#3ddc84":parseFloat(c.winPct)>=60?"#d4a017":"#C5CDD8"}}>{c.winPct}%</span></td>
              <td style={{padding:"8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)",maxWidth:200}}>{c.highlights}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>}

    {sub==="current"&&<div>
      <div style={{marginBottom:16}}>
        <p style={{fontSize:13,color:"#94a3b8"}}>Current appointments for the 2026 Six Nations Championship</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        {current2026.map((c,i)=>(
          <Card key={i} title={c.team} icon={""}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <Flag team={c.team} size={40}/>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase"}}>{c.team}</div>
              </div>
            </div>
            <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{padding:12,borderRadius:8,background:"rgba(26,95,58,0.06)",border:"1px solid rgba(26,95,58,0.15)"}}>
                <div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Head Coach</div>
                <div style={{fontSize:14,fontWeight:600,color:"#f8fafc"}}>{c.coach}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>Since {c.coachSince}</div>
              </div>
              <div style={{padding:12,borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.15)"}}>
                <div style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Captain</div>
                <div style={{fontSize:14,fontWeight:600,color:"#f8fafc"}}>{c.captain}</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{c.captainCaps} caps</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>}
  </div>);
}

/* ═══════════════════════════════════════════════
   FIXTURES & UPCOMING MATCHES
   ═══════════════════════════════════════════════ */
function Fixtures({intl,sn}){
  const [sub,setSub]=useState("6n2026");

  // 2026 Six Nations data
  const sn2026Results=[
    {round:1,date:"2026-02-05",home:"France",away:"Ireland",hs:36,as:14,venue:"Stade de France, Paris"},
    {round:1,date:"2026-02-07",home:"Italy",away:"Scotland",hs:18,as:15,venue:"Stadio Olimpico, Rome"},
    {round:1,date:"2026-02-07",home:"England",away:"Wales",hs:48,as:7,venue:"Allianz Stadium, Twickenham"},
    {round:2,date:"2026-02-14",home:"Ireland",away:"Italy",hs:20,as:13,venue:"Aviva Stadium, Dublin"},
    {round:2,date:"2026-02-14",home:"Scotland",away:"England",hs:31,as:20,venue:"Murrayfield, Edinburgh"},
    {round:2,date:"2026-02-15",home:"Wales",away:"France",hs:12,as:54,venue:"Principality Stadium, Cardiff"},
    {round:3,date:"2026-02-21",home:"England",away:"Ireland",hs:21,as:42,venue:"Allianz Stadium, Twickenham"},
    {round:3,date:"2026-02-21",home:"Wales",away:"Scotland",hs:23,as:26,venue:"Principality Stadium, Cardiff"},
    {round:3,date:"2026-02-22",home:"France",away:"Italy",hs:33,as:8,venue:"Decathlon Arena, Lille"},
    {round:4,date:"2026-03-06",home:"Ireland",away:"Wales",hs:27,as:17,venue:"Aviva Stadium, Dublin"},
    {round:4,date:"2026-03-07",home:"Scotland",away:"France",hs:50,as:40,venue:"Murrayfield, Edinburgh"},
    {round:4,date:"2026-03-07",home:"Italy",away:"England",hs:23,as:18,venue:"Stadio Olimpico, Rome"},
    {round:5,date:"2026-03-14",home:"Ireland",away:"Scotland",hs:43,as:21,venue:"Aviva Stadium, Dublin"},
    {round:5,date:"2026-03-14",home:"Wales",away:"Italy",hs:31,as:17,venue:"Principality Stadium, Cardiff"},
    {round:5,date:"2026-03-14",home:"France",away:"England",hs:48,as:46,venue:"Stade de France, Paris"},
  ];
  const sn2026Upcoming=[];

  // Build standings from results
  const snStandings=useMemo(()=>{
    const teams={};
    ["England","France","Ireland","Italy","Scotland","Wales"].forEach(t=>{teams[t]={team:t,p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0,pts:0};});
    sn2026Results.forEach(m=>{
      teams[m.home].p++;teams[m.away].p++;
      teams[m.home].pf+=m.hs;teams[m.home].pa+=m.as;
      teams[m.away].pf+=m.as;teams[m.away].pa+=m.hs;
      if(m.hs>m.as){teams[m.home].w++;teams[m.away].l++;teams[m.home].pts+=4;if(m.as>=m.hs-7)teams[m.away].bp++,teams[m.away].pts++;}
      else if(m.as>m.hs){teams[m.away].w++;teams[m.home].l++;teams[m.away].pts+=4;if(m.hs>=m.as-7)teams[m.home].bp++,teams[m.home].pts++;}
      else{teams[m.home].d++;teams[m.away].d++;teams[m.home].pts+=2;teams[m.away].pts+=2;}
    });
    return Object.values(teams).sort((a,b)=>b.pts-a.pts||(b.pf-b.pa)-(a.pf-a.pa)||b.pf-a.pf);
  },[]);

  // 2026 Nations Championship fixtures (July-November)
  const nc2026Rounds=[
    {round:"Round 1",date:"Sat 4 July",matches:[
      {home:"New Zealand",away:"France",venue:"One New Zealand Stadium, Christchurch"},
      {home:"Australia",away:"Ireland",venue:"Allianz Stadium, Sydney"},
      {home:"Japan",away:"Italy",venue:"Tokyo Chichibunomiya Stadium"},
      {home:"Fiji",away:"Wales",venue:"Cardiff City Stadium, Cardiff"},
      {home:"South Africa",away:"England",venue:"Ellis Park, Johannesburg"},
      {home:"Argentina",away:"Scotland",venue:"Estadio Mario Alberto Kempes, Córdoba"},
    ]},
    {round:"Round 2",date:"Sat 11 July",matches:[
      {home:"New Zealand",away:"Italy",venue:"Hnry Stadium, Wellington"},
      {home:"Australia",away:"France",venue:"Suncorp Stadium, Brisbane"},
      {home:"Japan",away:"Ireland",venue:"TBC, Tokyo"},
      {home:"Fiji",away:"England",venue:"Hill Dickinson Stadium, Liverpool"},
      {home:"South Africa",away:"Scotland",venue:"Loftus Versfeld, Pretoria"},
      {home:"Argentina",away:"Wales",venue:"Estadio San Juan del Bicentenario, San Juan"},
    ]},
    {round:"Round 3",date:"Sat 18 July",matches:[
      {home:"Japan",away:"France",venue:"Tokyo Nation Stadium"},
      {home:"New Zealand",away:"Ireland",venue:"Eden Park, Auckland"},
      {home:"Australia",away:"Italy",venue:"HBF Park, Perth"},
      {home:"Fiji",away:"Scotland",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"South Africa",away:"Wales",venue:"Hollywoodbets Kings Park, Durban"},
      {home:"Argentina",away:"England",venue:"Estadio Único Madre de Ciudades, Santiago del Estero"},
    ]},
    {round:"Round 4",date:"6–8 Nov",matches:[
      {home:"Ireland",away:"Argentina",venue:"Aviva Stadium, Dublin"},
      {home:"Italy",away:"South Africa",venue:"TBC, Italy"},
      {home:"Scotland",away:"New Zealand",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"Wales",away:"Japan",venue:"Principality Stadium, Cardiff"},
      {home:"France",away:"Fiji",venue:"TBC, France"},
      {home:"England",away:"Australia",venue:"Allianz Stadium, London"},
    ]},
    {round:"Round 5",date:"13–15 Nov",matches:[
      {home:"France",away:"South Africa",venue:"Stade de France, Paris"},
      {home:"Italy",away:"Argentina",venue:"TBC, Italy"},
      {home:"Wales",away:"New Zealand",venue:"Principality Stadium, Cardiff"},
      {home:"England",away:"Japan",venue:"Allianz Stadium, London"},
      {home:"Ireland",away:"Fiji",venue:"Aviva Stadium, Dublin"},
      {home:"Scotland",away:"Australia",venue:"Scottish Gas Murrayfield, Edinburgh"},
    ]},
    {round:"Round 6",date:"Sat 21 Nov",matches:[
      {home:"England",away:"New Zealand",venue:"Allianz Stadium, London"},
      {home:"Scotland",away:"Japan",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"Ireland",away:"South Africa",venue:"Aviva Stadium, Dublin"},
      {home:"Italy",away:"Fiji",venue:"TBC, Italy"},
      {home:"France",away:"Argentina",venue:"Stade de France, Paris"},
      {home:"Wales",away:"Australia",venue:"Principality Stadium, Cardiff"},
    ]},
  ];

  // Head-to-head context for upcoming matches
  const getH2H=(t1,t2)=>{
    const all=[...intl,...sn];
    const matches=all.filter(m=>(m.home===t1&&m.away===t2)||(m.home===t2&&m.away===t1));
    let w1=0,w2=0,d=0;
    matches.forEach(m=>{
      if((m.home===t1&&m.hs>m.as)||(m.away===t1&&m.as>m.hs))w1++;
      else if((m.home===t2&&m.hs>m.as)||(m.away===t2&&m.as>m.hs))w2++;
      else d++;
    });
    return{total:matches.length,w1,w2,d};
  };

  return(<div>
    <div style={{marginBottom:24}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Fixtures & Calendar</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>2026 Six Nations results, standings, and upcoming international fixtures</p>
    </div>

    <div className="rf-sub-tabs" style={{display:"flex",gap:6,marginBottom:24}}>
      {[{id:"6n2026",label:"2026 Six Nations",ic:"\ud83c\udfc6"},{id:"upcoming",label:"Upcoming",ic:"\ud83d\udcc6"},{id:"6n2027",label:"2027 Six Nations",ic:"\ud83d\udcc5"},{id:"nc2026",label:"Nations Championship",ic:"\ud83c\udf0d"}].map(t=>(
        <button key={t.id} onClick={()=>setSub(t.id)}
          style={{padding:"10px 20px",fontSize:12.5,fontWeight:sub===t.id?600:400,color:sub===t.id?"#F5F7FA":"#5A6A82",background:sub===t.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.02)",border:"1px solid "+(sub===t.id?"rgba(212,160,23,0.25)":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{t.ic}</span>{t.label}</button>
      ))}
    </div>

    {sub==="6n2026"&&<div>
      {/* Standings */}
      <Card title="2026 Six Nations — Final Standings" icon={"\ud83c\udfc6"} style={{marginBottom:24}}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Pos","Team","P","W","D","L","PF","PA","PD","BP","Pts"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{snStandings.map((t,i)=>(
            <tr key={t.team} style={{background:i===0?"rgba(26,95,58,0.06)":"transparent"}}>
              <td style={{padding:"10px 8px",fontWeight:700,color:i===0?"#d4a017":"#94a3b8",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{i+1}</td>
              <td style={{padding:"10px 8px",fontWeight:700,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={16}/></td>
              {[t.p,t.w,t.d,t.l,t.pf,t.pa,t.pf-t.pa,t.bp,t.pts].map((v,j)=>(
                <td key={j} style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:j===8?"#3ddc84":j===6?(v>0?"#3ddc84":v<0?"#ef4444":"#C5CDD8"):"#C5CDD8",fontWeight:j===8?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{j===6&&v>0?"+":""}{v}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </Card>

      {/* Results */}
      <Card title="All Results (Rounds 1–5)" icon={"\u2705"} style={{marginBottom:24}}>
        {[1,2,3,4,5].map(r=>(
          <div key={r} style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Round {r}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:8}}>
              {sn2026Results.filter(m=>m.round===r).map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{flex:1,textAlign:"right"}}><TeamLabel team={m.home} size={16}/></div>
                  <div style={{padding:"4px 16px",borderRadius:8,background:"rgba(26,95,58,0.08)",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:16,color:"#f8fafc",minWidth:70,textAlign:"center"}}>{m.hs} - {m.as}</div>
                  <div style={{flex:1}}><TeamLabel team={m.away} size={16}/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>}

    {sub==="upcoming"&&<div>
      <Card title="2026 Six Nations Champions: France" icon={"\ud83c\udfc6"} style={{marginBottom:24}}>
        <div style={{textAlign:"center",padding:16}}>
          <Flag team="France" size={48}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--rf-gold)",fontFamily:"var(--ff-head)",textTransform:"uppercase",marginTop:8}}>France — Back-to-Back Champions</div>
          <p style={{fontSize:13,color:"var(--rf-text-muted)",marginTop:8,maxWidth:600,margin:"8px auto 0"}}>France retained the Six Nations title with a dramatic 48-46 last-gasp victory over England in Paris. Thomas Ramos' penalty with the clock in the red sealed back-to-back championships for Les Bleus, denying Ireland who had beaten Scotland 43-21 earlier on Super Saturday to claim the Triple Crown.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:16,flexWrap:"wrap"}}>
            <div style={{padding:"8px 16px",borderRadius:8,background:"rgba(26,95,58,0.06)",fontSize:12,color:"var(--rf-text2)"}}>W4 L1 {"\u00b7"} Only loss: Scotland 50-40</div>
            <div style={{padding:"8px 16px",borderRadius:8,background:"rgba(212,160,23,0.06)",fontSize:12,color:"var(--rf-gold)"}}>Ireland: Triple Crown, runners-up</div>
            <div style={{padding:"8px 16px",borderRadius:8,background:"rgba(220,38,38,0.06)",fontSize:12,color:"#ef4444"}}>Italy beat England for first time ever</div>
          </div>
        </div>
      </Card>

      <Card title="2026 Nations Championship — Full Fixture List" icon={"\ud83c\udf0d"}>
        <p style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>North vs South · 6 rounds (July + November) · Finals Weekend 27–29 Nov at Allianz Stadium, Twickenham</p>
        {nc2026Rounds.map((r,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{r.round} — {r.date}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:6}}>
              {r.matches.map((m,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                  <div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.home}</div>
                  <div style={{padding:"3px 10px",borderRadius:6,background:"rgba(26,95,58,0.12)",fontSize:11,fontWeight:700,color:"#94a3b8",whiteSpace:"nowrap"}}>vs</div>
                  <div style={{flex:1,fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.away}</div>
                  <div style={{fontSize:10,color:"#64748b",whiteSpace:"nowrap",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis"}}>{m.venue.split(",")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{padding:"10px 14px",borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.15)",marginTop:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em"}}>Finals Weekend — 27–29 November · Allianz Stadium, Twickenham</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Teams ranked 1–6 in each conference play their North vs South counterpart. Grand Final: 1st North vs 1st South on Sunday 29 Nov.</div>
        </div>
      </Card>
    </div>}

    {sub==="6n2027"&&<div>
      <div style={{marginBottom:16}}>
        <p style={{fontSize:14,fontWeight:600,color:"var(--rf-text)"}}>2027 Guinness Men's Six Nations — 5 February to 13 March</p>
        <p style={{fontSize:12,color:"var(--rf-text-muted)",marginTop:4}}>Fixtures announced 9 March 2026 {"\u00b7"} Friday night openers, Valentine's Day Le Crunch, Super Saturday finale</p>
      </div>
      {[
        {round:1,title:"Round 1 — 5/6 February",matches:[{date:"Fri 5 Feb",home:"Ireland",away:"England",venue:"Aviva Stadium, Dublin",time:"8.10pm"},{date:"Sat 6 Feb",home:"Scotland",away:"Italy",venue:"Murrayfield, Edinburgh",time:"2.10pm"},{date:"Sat 6 Feb",home:"France",away:"Wales",venue:"Stade de France, Paris",time:"4.45pm"}]},
        {round:2,title:"Round 2 — 13/14 February",matches:[{date:"Sat 13 Feb",home:"Italy",away:"Ireland",venue:"Stadio Olimpico, Rome",time:"2.10pm"},{date:"Sat 13 Feb",home:"Scotland",away:"Wales",venue:"Murrayfield, Edinburgh",time:"4.40pm"},{date:"Sun 14 Feb",home:"England",away:"France",venue:"Allianz Stadium, Twickenham",time:"3.10pm"}]},
        {round:3,title:"Round 3 — 20/21 February",matches:[{date:"Sat 20 Feb",home:"Wales",away:"Ireland",venue:"Principality Stadium, Cardiff",time:"2.10pm"},{date:"Sat 20 Feb",home:"England",away:"Italy",venue:"Allianz Stadium, Twickenham",time:"4.40pm"},{date:"Sun 21 Feb",home:"France",away:"Scotland",venue:"Stade de France, Paris",time:"3.10pm"}]},
        {round:4,title:"Round 4 — 5/6 March (after fallow week)",matches:[{date:"Fri 5 Mar",home:"Scotland",away:"Ireland",venue:"Murrayfield, Edinburgh",time:"8.10pm"},{date:"Sat 6 Mar",home:"Italy",away:"France",venue:"Stadio Olimpico, Rome",time:"2.10pm"},{date:"Sat 6 Mar",home:"Wales",away:"England",venue:"Principality Stadium, Cardiff",time:"4.40pm"}]},
        {round:5,title:"Round 5 — Super Saturday 13 March",matches:[{date:"Sat 13 Mar",home:"Italy",away:"Wales",venue:"Stadio Olimpico, Rome",time:"2.10pm"},{date:"Sat 13 Mar",home:"England",away:"Scotland",venue:"Allianz Stadium, Twickenham",time:"4.40pm"},{date:"Sat 13 Mar",home:"Ireland",away:"France",venue:"Aviva Stadium, Dublin",time:"8.10pm"}]},
      ].map(r=>(
        <Card key={r.round} title={r.title} style={{marginBottom:16}}>
          <div style={{display:"grid",gap:8}}>
            {r.matches.map((m,i)=>{
              const h2h=getH2H(m.home,m.away);
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{flex:1,textAlign:"right"}}><TeamLabel team={m.home} size={16}/></div>
                  <div style={{textAlign:"center",minWidth:110}}>
                    <div style={{fontSize:11,color:"var(--rf-gold)",fontWeight:600}}>{m.date}</div>
                    <div style={{fontSize:16,fontWeight:800,color:"var(--rf-text)",margin:"2px 0"}}>vs</div>
                    <div style={{fontSize:10,color:"var(--rf-text-dim)"}}>{m.venue.split(",")[0]} {"\u00b7"} {m.time}</div>
                  </div>
                  <div style={{flex:1}}><TeamLabel team={m.away} size={16}/></div>
                  <div style={{padding:"6px 10px",borderRadius:8,background:"rgba(26,95,58,0.06)",textAlign:"center",minWidth:80}}>
                    <div style={{fontSize:9,color:"var(--rf-text-dim)",textTransform:"uppercase"}}>H2H</div>
                    <div style={{fontSize:10,fontFamily:"var(--ff-mono)",color:"var(--rf-text2)",marginTop:2}}>{h2h.w1}-{h2h.d}-{h2h.w2}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>}

    {sub==="nc2026"&&<div>
      <Card title="2026 Nations Championship" icon={"\ud83c\udf0d"} style={{marginBottom:24}}>
        <div style={{padding:16}}>
          <p style={{fontSize:14,color:"#f8fafc",marginBottom:16,fontWeight:600}}>Inaugural edition — the biggest change to international rugby in a generation</p>
          <p style={{fontSize:13,color:"#94a3b8",marginBottom:16}}>Twelve teams divided into two conferences play cross-conference round-robin matches, culminating in a grand final in London.</p>
          <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{padding:16,borderRadius:10,background:"rgba(26,95,58,0.06)",border:"1px solid rgba(26,95,58,0.15)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#3ddc84",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",marginBottom:10}}>European Conference (Six Nations)</div>
              {["England","France","Ireland","Italy","Scotland","Wales"].map(t=><div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}><Flag team={t} size={16}/><span style={{fontSize:12,color:"#C5CDD8"}}>{t}</span></div>)}
            </div>
            <div style={{padding:16,borderRadius:10,background:"rgba(220,38,38,0.06)",border:"1px solid rgba(220,38,38,0.12)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#ef4444",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",marginBottom:10}}>Rest of World Conference</div>
              {["New Zealand","South Africa","Australia","Argentina","Fiji","Japan"].map(t=><div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0"}}><Flag team={t} size={16}/><span style={{fontSize:12,color:"#C5CDD8"}}>{t}</span></div>)}
            </div>
          </div>
          <div style={{marginTop:16,padding:12,borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.15)"}}>
            <div style={{fontSize:11,color:"#d4a017",fontWeight:600,marginBottom:6}}>Key Dates</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>July 2026 — Rounds 1–3 (mid-year window)</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>November 2026 — Rounds 4–6 (autumn window)</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>27–29 November — Finals Weekend, Allianz Stadium, Twickenham</div>
          </div>
        </div>
      </Card>
      <Card title="Full Fixture Schedule — All 6 Rounds" icon={"\ud83d\udcc6"} style={{marginBottom:24}}>
        <p style={{color:"#94a3b8",fontSize:13,marginBottom:20}}>North vs South · Rounds 1–3 in July, Rounds 4–6 in November · Finals Weekend 27–29 Nov at Twickenham</p>
        {nc2026Rounds.map((r,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,paddingBottom:4,borderBottom:"1px solid rgba(212,160,23,0.1)"}}>{r.round} — {r.date}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:6}}>
              {r.matches.map((m,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                  <div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.home}</div>
                  <div style={{padding:"3px 10px",borderRadius:6,background:"rgba(26,95,58,0.12)",fontSize:11,fontWeight:700,color:"#94a3b8",whiteSpace:"nowrap"}}>vs</div>
                  <div style={{flex:1,fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.away}</div>
                  <div style={{fontSize:10,color:"#64748b",whiteSpace:"nowrap",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis"}}>{m.venue.split(",")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{padding:"10px 14px",borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.15)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em"}}>Finals Weekend — 27–29 November · Allianz Stadium, Twickenham</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Top team from each conference meet in the Grand Final (Sunday 29 Nov). First-ever Nations Championship champion crowned in London.</div>
        </div>
      </Card>
    </div>}
  </div>);
}

/* ═══════════════════════════════════════════════
   RUGBY EUROPE CHAMPIONSHIP DATA & COMPONENT
   ═══════════════════════════════════════════════ */

// Champions by year (modern era 2000+, plus historical FIRA/ENC)
var RE_CHAMPIONS=[
  {year:1952,winner:"France",era:"European Cup"},{year:1954,winner:"France",era:"European Cup"},
  {year:1966,winner:"France",era:"FIRA Nations Cup"},{year:1967,winner:"France",era:"FIRA Nations Cup"},{year:1968,winner:"France",era:"FIRA Nations Cup"},
  {year:1969,winner:"Romania",era:"FIRA Nations Cup"},{year:1970,winner:"France",era:"FIRA Nations Cup"},{year:1971,winner:"France",era:"FIRA Nations Cup"},
  {year:1972,winner:"France",era:"FIRA Nations Cup"},{year:1973,winner:"France",era:"FIRA Nations Cup"},
  {year:1974,winner:"France",era:"FIRA Trophy"},{year:1975,winner:"Romania",era:"FIRA Trophy"},{year:1976,winner:"France",era:"FIRA Trophy"},
  {year:1977,winner:"Romania",era:"FIRA Trophy"},{year:1978,winner:"France",era:"FIRA Trophy"},{year:1979,winner:"France",era:"FIRA Trophy"},
  {year:1980,winner:"France",era:"FIRA Trophy"},{year:1981,winner:"Romania",era:"FIRA Trophy"},{year:1982,winner:"France",era:"FIRA Trophy"},
  {year:1984,winner:"France",era:"FIRA Trophy"},{year:1985,winner:"France",era:"FIRA Trophy"},{year:1987,winner:"France",era:"FIRA Trophy"},
  {year:1989,winner:"France",era:"FIRA Trophy"},{year:1990,winner:"France A",era:"FIRA Trophy"},{year:1992,winner:"France A",era:"FIRA Trophy"},
  {year:1994,winner:"France A",era:"FIRA Trophy"},{year:1997,winner:"Italy",era:"FIRA Trophy"},
  {year:2000,winner:"Romania",era:"ENC"},{year:2001,winner:"Georgia",era:"ENC"},{year:2002,winner:"Romania",era:"ENC"},
  {year:2004,winner:"Portugal",era:"ENC"},{year:2006,winner:"Romania",era:"ENC"},{year:2008,winner:"Georgia",era:"ENC"},
  {year:2009,winner:"Georgia",era:"ENC"},{year:2010,winner:"Romania",era:"ENC"},{year:2011,winner:"Georgia",era:"ENC"},
  {year:2012,winner:"Georgia",era:"ENC"},{year:2013,winner:"Georgia",era:"ENC"},{year:2014,winner:"Georgia",era:"ENC"},
  {year:2015,winner:"Georgia",era:"ENC"},{year:2016,winner:"Georgia",era:"ENC"},
  {year:2017,winner:"Romania",era:"REC"},{year:2018,winner:"Georgia",era:"REC"},{year:2019,winner:"Georgia",era:"REC"},
  {year:2020,winner:"Georgia",era:"REC"},{year:2021,winner:"Georgia",era:"REC"},{year:2022,winner:"Georgia",era:"REC"},
  {year:2023,winner:"Georgia",era:"REC"},{year:2024,winner:"Georgia",era:"REC"},{year:2025,winner:"Georgia",era:"REC"},
  {year:2026,winner:"Portugal",era:"REC"},
];

// All-time Division 1 / Championship standings (from Wikipedia, updated through 2025)
var RE_ALLTIME=[
  {team:"Georgia",pld:130,w:112,d:5,l:13,pf:4304,pa:1467,titles:17},
  {team:"Romania",pld:130,w:88,d:2,l:40,pf:3336,pa:1992,titles:5},
  {team:"Spain",pld:120,w:49,d:4,l:66,pf:2695,pa:2780,titles:0},
  {team:"Portugal",pld:115,w:51,d:4,l:60,pf:2532,pa:2490,titles:2},
  {team:"Russia",pld:108,w:54,d:3,l:51,pf:2526,pa:2233,titles:0},
  {team:"Netherlands",pld:50,w:6,d:1,l:43,pf:629,pa:2153,titles:0},
  {team:"Germany",pld:45,w:12,d:1,l:32,pf:796,pa:1308,titles:0},
  {team:"Belgium",pld:40,w:9,d:0,l:31,pf:644,pa:1311,titles:0},
  {team:"Czech Republic",pld:29,w:6,d:0,l:23,pf:362,pa:1075,titles:0},
  {team:"Ukraine",pld:20,w:1,d:0,l:19,pf:201,pa:997,titles:0},
  {team:"Poland",pld:10,w:1,d:0,l:9,pf:126,pa:381,titles:0},
  {team:"Morocco",pld:5,w:3,d:0,l:2,pf:94,pa:69,titles:0},
  {team:"Switzerland",pld:5,w:1,d:0,l:4,pf:38,pa:281,titles:0},
];

// Season-by-season results (modern era, top division)
var RE_SEASONS=[
  {year:2000,teams:["Romania","Georgia","Portugal","Spain","Morocco","Netherlands"],results:[
    {h:"Romania",a:"Georgia",hs:35,as:22},{h:"Romania",a:"Portugal",hs:49,as:0},{h:"Romania",a:"Spain",hs:61,as:13},{h:"Romania",a:"Morocco",hs:62,as:9},{h:"Romania",a:"Netherlands",hs:69,as:12},
    {h:"Georgia",a:"Portugal",hs:26,as:14},{h:"Georgia",a:"Spain",hs:42,as:15},{h:"Georgia",a:"Morocco",hs:21,as:13},{h:"Georgia",a:"Netherlands",hs:51,as:3},
    {h:"Portugal",a:"Spain",hs:18,as:21},{h:"Portugal",a:"Morocco",hs:9,as:3},{h:"Portugal",a:"Netherlands",hs:22,as:3},
    {h:"Spain",a:"Morocco",hs:29,as:9},{h:"Spain",a:"Netherlands",hs:43,as:9},
    {h:"Morocco",a:"Netherlands",hs:17,as:10}]},
  {year:2025,teams:["Georgia","Spain","Netherlands","Switzerland","Portugal","Romania","Germany","Belgium"],results:[
    {h:"Georgia",a:"Switzerland",hs:110,as:0},{h:"Spain",a:"Netherlands",hs:41,as:10},{h:"Georgia",a:"Netherlands",hs:62,as:24},{h:"Switzerland",a:"Spain",hs:12,as:44},
    {h:"Spain",a:"Georgia",hs:15,as:40},{h:"Netherlands",a:"Switzerland",hs:26,as:30},
    {h:"Romania",a:"Germany",hs:47,as:12},{h:"Portugal",a:"Belgium",hs:40,as:22},{h:"Belgium",a:"Romania",hs:14,as:37},{h:"Portugal",a:"Germany",hs:53,as:14},
    {h:"Romania",a:"Portugal",hs:12,as:43},{h:"Germany",a:"Belgium",hs:13,as:24},
    {h:"Georgia",a:"Portugal",hs:46,as:28,note:"Final"},{h:"Spain",a:"Romania",hs:25,as:22,note:"Bronze"},
    {h:"Germany",a:"Netherlands",hs:22,as:21,note:"5th place"},{h:"Belgium",a:"Switzerland",hs:16,as:29,note:"7th place"}]},
  {year:2026,teams:["Georgia","Spain","Netherlands","Switzerland","Portugal","Romania","Germany","Belgium"],results:[
    {h:"Netherlands",a:"Spain",hs:33,as:51},{h:"Belgium",a:"Portugal",hs:17,as:47},{h:"Switzerland",a:"Georgia",hs:3,as:54},{h:"Germany",a:"Romania",hs:30,as:24},
    {h:"Germany",a:"Portugal",hs:12,as:68},{h:"Spain",a:"Switzerland",hs:53,as:14},{h:"Netherlands",a:"Georgia",hs:12,as:61},{h:"Romania",a:"Belgium",hs:23,as:6},
    {h:"Georgia",a:"Spain",hs:42,as:30},{h:"Belgium",a:"Germany",hs:18,as:3},{h:"Switzerland",a:"Netherlands",hs:29,as:23},{h:"Portugal",a:"Romania",hs:44,as:7},
    {h:"Switzerland",a:"Germany",hs:35,as:25,note:"5/6th SF"},{h:"Belgium",a:"Netherlands",hs:40,as:15,note:"7/8th SF"},
    {h:"Georgia",a:"Romania",hs:53,as:30,note:"Semi-final"},{h:"Portugal",a:"Spain",hs:26,as:7,note:"Semi-final"},
    {h:"Germany",a:"Netherlands",hs:7,as:76,note:"7th place"},{h:"Switzerland",a:"Belgium",hs:16,as:39,note:"5th place"},
    {h:"Romania",a:"Spain",hs:23,as:29,note:"Bronze"},{h:"Georgia",a:"Portugal",hs:17,as:19,note:"Final"}],
    note:"Portugal win! First title since 2004. Ends Georgia's 8-year, 43-match unbeaten run."},
];

// Key records
var RE_RECORDS={
  biggestWin:{match:"Georgia 110-0 Switzerland",year:2025},
  mostTitles:{team:"Georgia",count:17},
  longestWinStreak:{team:"Georgia",count:20,period:"2018-2021"},
  longestUnbeaten:{team:"Georgia",count:40,period:"2018-present"},
  homeUnbeaten:{team:"Georgia",count:56,period:"2004-present"},
  mostPtsInSeason:{team:"Romania",pts:389,year:"2005-06",games:10},
  fewestConceded:{team:"Georgia",pts:33,year:2016,games:5},
  mostConsecutiveTitles:{team:"Georgia",count:8,period:"2018-2025"},
};

// Color map for RE teams
var RE_COLORS={
  "Georgia":"#dc2626","Romania":"#fbbf24","Portugal":"#16a34a","Spain":"#ef4444",
  "Russia":"#1e40af","Netherlands":"#f97316","Germany":"#111827","Belgium":"#b91c1c",
  "Czech Republic":"#1d4ed8","Ukraine":"#2563eb","Poland":"#dc2626","Morocco":"#15803d",
  "Switzerland":"#dc2626","France":"#1e3a8a","Italy":"#0ea5e9","France A":"#3b82f6",
};

function RugbyEuropeTab(){
  const [view,setView]=useState("overview");

  // Titles by nation (all eras)
  const titlesByNation=useMemo(()=>{
    const t={};
    RE_CHAMPIONS.forEach(c=>{
      const n=c.winner==="France A"?"France":c.winner;
      t[n]=(t[n]||0)+1;
    });
    return Object.entries(t).map(([team,titles])=>({team,titles})).sort((a,b)=>b.titles-a.titles);
  },[]);

  // Titles by era
  const titlesByEra=useMemo(()=>{
    const eras={};
    RE_CHAMPIONS.forEach(c=>{
      const n=c.winner==="France A"?"France":c.winner;
      if(!eras[n])eras[n]={"European Cup":0,"FIRA Nations Cup":0,"FIRA Trophy":0,"ENC":0,"REC":0};
      eras[n][c.era]++;
    });
    return eras;
  },[]);

  // Modern era titles (2000+)
  const modernTitles=useMemo(()=>{
    const t={};
    RE_CHAMPIONS.filter(c=>c.year>=2000).forEach(c=>{t[c.winner]=(t[c.winner]||0)+1;});
    return Object.entries(t).map(([team,titles])=>({team,titles})).sort((a,b)=>b.titles-a.titles);
  },[]);

  // Champions timeline data for chart
  const champTimeline=useMemo(()=>{
    return RE_CHAMPIONS.filter(c=>c.year>=2000).map(c=>({year:c.year,winner:c.winner}));
  },[]);

  // Win% trend by team per year (modern era)
  const winTrend=useMemo(()=>{
    const byYear={};
    RE_SEASONS.forEach(s=>{
      const yr=s.year;
      const teamStats={};
      s.results.forEach(m=>{
        if(!teamStats[m.h])teamStats[m.h]={w:0,g:0};
        if(!teamStats[m.a])teamStats[m.a]={w:0,g:0};
        teamStats[m.h].g++;teamStats[m.a].g++;
        if(m.hs>m.as)teamStats[m.h].w++;
        else if(m.as>m.hs)teamStats[m.a].w++;
      });
      byYear[yr]=teamStats;
    });
    return byYear;
  },[]);

  // Dominance chart data
  const dominanceData=useMemo(()=>{
    return RE_ALLTIME.filter(t=>t.pld>=20).map(t=>({
      team:t.team,winPct:((t.w/t.pld)*100).toFixed(1),pld:t.pld,pd:t.pf-t.pa,avgPF:(t.pf/t.pld).toFixed(1)
    })).sort((a,b)=>b.winPct-a.winPct);
  },[]);

  // 2025 results
  const season2025=RE_SEASONS.find(s=>s.year===2025);
  const season2026=RE_SEASONS.find(s=>s.year===2026);

  const subViews=[
    {id:"overview",label:"Overview",icon:"\ud83c\udfc9"},
    {id:"standings",label:"All-Time Standings",icon:"\ud83d\udcca"},
    {id:"season2025",label:"2025 Season",icon:"\ud83c\udfc6"},
    {id:"season2026",label:"2026 Season",icon:"\ud83d\udfe2"},
    {id:"history",label:"Full History",icon:"\ud83d\udcdc"},
    {id:"records",label:"Records",icon:"\u2b50"},
  ];

  const ttStyle={background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"};

  return(<div>
    <div style={{marginBottom:20}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Rugby Europe Championship</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Europe's second-tier international competition {"\u00b7"} Formerly FIRA Trophy / European Nations Cup {"\u00b7"} Since 1952</p>
    </div>

    {/* Sub-navigation */}
    <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
      {subViews.map(v=>(
        <button key={v.id} onClick={()=>setView(v.id)} style={{padding:"6px 14px",borderRadius:20,border:view===v.id?"1px solid #2a7a52":"1px solid rgba(255,255,255,0.08)",background:view===v.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",color:view===v.id?"#3ddc84":"#94a3b8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.04em",textTransform:"uppercase"}}>{v.icon} {v.label}</button>
      ))}
    </div>

    {/* OVERVIEW */}
    {view==="overview"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
        <SB label="Total Editions" value={RE_CHAMPIONS.length} icon={"\ud83c\udfc6"} sub="Since 1952"/>
        <SB label="Most Titles (All)" value={"France (25)"} color="#1e3a8a"/>
        <SB label="Most Titles (Modern)" value={"Georgia (17)"} color="#dc2626"/>
        <SB label="Current Champion" value="Georgia" sub="8 in a row" color="#dc2626"/>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="All-Time Titles by Nation" icon={"\ud83c\udfc6"}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={titlesByNation} layout="vertical" margin={{left:70}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
              <YAxis dataKey="team" type="category" tick={{fill:"#C5CDD8",fontSize:11}} width={65}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="titles" name="Titles" radius={[0,6,6,0]}>
                {titlesByNation.map((e,i)=><Cell key={i} fill={RE_COLORS[e.team]||"#94a3b8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Modern Era Champions (2000–2025)" icon={"\ud83d\udcca"}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={modernTitles} layout="vertical" margin={{left:70}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}}/>
              <YAxis dataKey="team" type="category" tick={{fill:"#C5CDD8",fontSize:11}} width={65}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="titles" name="Titles" radius={[0,6,6,0]}>
                {modernTitles.map((e,i)=><Cell key={i} fill={RE_COLORS[e.team]||"#94a3b8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Georgia's Dominance — Win% Comparison (Min 20 matches)" icon={"\ud83d\udcaa"} style={{marginBottom:24}}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dominanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="team" tick={{fill:"#C5CDD8",fontSize:10,fontFamily:"'Barlow Condensed',sans-serif"}} angle={-25} textAnchor="end" height={50}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}} domain={[0,100]} unit="%"/>
            <Tooltip contentStyle={ttStyle} formatter={(v)=>v+"%"}/>
            <Bar dataKey="winPct" name="Win %" radius={[6,6,0,0]}>
              {dominanceData.map((e,i)=><Cell key={i} fill={RE_COLORS[e.team]||"#94a3b8"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Champions Timeline (2000–2025)" icon={"\ud83d\udcc5"}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:8}}>
          {champTimeline.map((c,i)=>(
            <div key={i} style={{textAlign:"center",padding:"8px 4px",borderRadius:8,background:c.winner==="Georgia"?"rgba(220,38,38,0.08)":c.winner==="Romania"?"rgba(251,191,36,0.08)":"rgba(22,163,100,0.08)",border:"1px solid "+(c.winner==="Georgia"?"rgba(220,38,38,0.2)":c.winner==="Romania"?"rgba(251,191,36,0.2)":"rgba(22,163,100,0.2)")}}>
              <div style={{fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#f8fafc"}}>{c.year}</div>
              <div style={{fontSize:10,color:RE_COLORS[c.winner]||"#94a3b8",fontWeight:600,marginTop:2}}>{c.winner}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>}

    {/* ALL-TIME STANDINGS */}
    {view==="standings"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="Teams in History" value={RE_ALLTIME.length} icon={"\ud83c\uddf3"}/>
        <SB label="Highest Win%" value="Georgia (86.2%)" color="#dc2626"/>
        <SB label="Most Matches" value="Georgia & Romania (130)" color="#94a3b8"/>
        <SB label="Best Points Diff" value={"Georgia (+"+RE_ALLTIME[0].pf+"/"+RE_ALLTIME[0].pa+")"} color="#1a5f3a"/>
      </div>
      <Card title="All-Time Championship Standings (Division 1, 2000–2025)" icon={"\ud83d\udcca"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["","Team","Pld","W","D","L","PF","PA","PD","Win%","Titles"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{RE_ALLTIME.map((t,ri)=>{
            const winPct=((t.w/t.pld)*100).toFixed(1);
            const pd=t.pf-t.pa;
            return(
            <tr key={ri}>
              <td style={{padding:"10px 8px",fontWeight:600,color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{ri+1}</td>
              <td style={{padding:"10px 8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-block",width:4,height:16,borderRadius:2,background:RE_COLORS[t.team]||"#94a3b8",marginRight:8,verticalAlign:"middle"}}/>{t.team}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8"}}>{t.pld}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontWeight:600,color:"#2a7a52"}}>{t.w}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"#94a3b8"}}>{t.d}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",color:"#dc2626"}}>{t.l}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8"}}>{t.pf}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8"}}>{t.pa}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:pd>0?"#2a7a52":"#dc2626"}}>{pd>0?"+":""}{pd}</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:parseFloat(winPct)>=50?"#2a7a52":"#dc2626"}}>{winPct}%</td>
              <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:t.titles>0?"#d4a017":"#64748b"}}>{t.titles||"-"}</td>
            </tr>);
          })}</tbody>
        </table>
      </Card>

      <Card title="Points For vs Points Against (All-Time)" icon={"\u2694\ufe0f"} style={{marginTop:24}}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={RE_ALLTIME.filter(t=>t.pld>=20)} margin={{bottom:40}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="team" tick={{fill:"#C5CDD8",fontSize:10,fontFamily:"'Barlow Condensed',sans-serif"}} angle={-25} textAnchor="end" height={60}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="pf" name="Points For" fill="#1a5f3a" radius={[4,4,0,0]}/>
            <Bar dataKey="pa" name="Points Against" fill="#dc2626" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>}

    {/* 2025 SEASON */}
    {view==="season2025"&&season2025&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="Champion" value="Georgia" icon={"\ud83c\udfc6"} color="#dc2626" sub="17th title"/>
        <SB label="Runner-up" value="Spain" color="#ef4444"/>
        <SB label="Bronze" value="Romania"/>
        <SB label="Biggest Win" value="Georgia 110-0 SUI" color="#d4a017" sub="Record margin"/>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Pool A (Final)" icon={"\ud83c\udde6"}>
          <MT headers={["Team","P","W","D","L","PF","PA","PD"]}
            rows={[
              ["Georgia",3,3,0,0,212,39,"+173"],
              ["Spain",3,2,0,1,100,64,"+36"],
              ["Netherlands",3,1,0,2,60,133,"-73"],
              ["Switzerland",3,0,0,3,42,178,"-136"],
            ].map(r=>[<span style={{fontWeight:600,color:"#f8fafc"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[r[0]]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{r[0]}</span>,...r.slice(1).map((v,i)=>i===6?<span style={{color:String(v).startsWith("+")?"#2a7a52":"#dc2626",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>)])}/>
        </Card>
        <Card title="Pool B (Final)" icon={"\ud83c\udde7"}>
          <MT headers={["Team","P","W","D","L","PF","PA","PD"]}
            rows={[
              ["Portugal",3,3,0,0,136,48,"+88"],
              ["Romania",3,2,0,1,96,69,"+27"],
              ["Belgium",3,1,0,2,60,94,"-34"],
              ["Germany",3,0,0,3,39,120,"-81"],
            ].map(r=>[<span style={{fontWeight:600,color:"#f8fafc"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[r[0]]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{r[0]}</span>,...r.slice(1).map((v,i)=>i===6?<span style={{color:String(v).startsWith("+")?"#2a7a52":"#dc2626",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>)])}/>
        </Card>
      </div>

      <Card title="2025 Results" icon={"\ud83d\udcdd"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Home","Score","Away","Note"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i===1?"center":"left",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{season2025.results.map((m,i)=>{
            const hw=m.hs>m.as,aw=m.as>m.hs;
            return(<tr key={i}>
              <td style={{padding:"8px",fontWeight:hw?700:400,color:hw?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[m.h]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{m.h}</td>
              <td style={{padding:"8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:"rgba(26,95,58,0.08)",padding:"3px 10px",borderRadius:6,color:"#f8fafc"}}>{m.hs} - {m.as}</span></td>
              <td style={{padding:"8px",fontWeight:aw?700:400,color:aw?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[m.a]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{m.a}</td>
              <td style={{padding:"8px",color:"#d4a017",fontSize:11,fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.note||""}</td>
            </tr>);
          })}</tbody>
        </table>
      </Card>
    </div>}

    {/* 2026 SEASON */}
    {view==="season2026"&&season2026&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="Status" value="In Progress" icon={"\ud83d\udfe2"} sub="Pool stage complete"/>
        <SB label="Pool A Leader" value="Georgia" color="#dc2626" sub="3W, +112 PD"/>
        <SB label="Pool B Leader" value="Portugal" color="#16a34a" sub="3W, +92 PD"/>
        <SB label="Surprise" value="Germany beat ROM" color="#111827" sub="30-24, Round 1"/>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Pool A Standings" icon={"\ud83c\udde6"}>
          <MT headers={["Team","P","W","L","PF","PA","PD"]}
            rows={[
              ["Georgia",3,3,0,157,45,"+112"],
              ["Spain",3,2,1,134,89,"+45"],
              ["Switzerland",3,1,2,46,100,"-54"],
              ["Netherlands",3,0,3,68,171,"-103"],
            ].map(r=>[<span style={{fontWeight:600,color:"#f8fafc"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[r[0]]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{r[0]}</span>,...r.slice(1).map((v,i)=>i===5?<span style={{color:String(v).startsWith("+")?"#2a7a52":"#dc2626",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>)])}/>
        </Card>
        <Card title="Pool B Standings" icon={"\ud83c\udde7"}>
          <MT headers={["Team","P","W","L","PF","PA","PD"]}
            rows={[
              ["Portugal",3,3,0,159,36,"+123"],
              ["Romania",3,1,2,54,91,"-37"],
              ["Belgium",3,1,2,41,73,"-32"],
              ["Germany",3,1,2,45,99,"-54"],
            ].map(r=>[<span style={{fontWeight:600,color:"#f8fafc"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[r[0]]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{r[0]}</span>,...r.slice(1).map((v,i)=>i===5?<span style={{color:String(v).startsWith("+")?"#2a7a52":"#dc2626",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>)])}/>
        </Card>
      </div>

      <Card title="2026 Results (Pool Stage)" icon={"\ud83d\udcdd"} style={{marginBottom:24}}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Round","Home","Score","Away"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i===2?"center":"left",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{season2026.results.map((m,i)=>{
            const rd=i<4?"R1":i<8?"R2":"R3";
            const hw=m.hs>m.as,aw=m.as>m.hs;
            return(<tr key={i}>
              <td style={{padding:"8px",color:"#94a3b8",fontSize:11,fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{rd}</td>
              <td style={{padding:"8px",fontWeight:hw?700:400,color:hw?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[m.h]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{m.h}</td>
              <td style={{padding:"8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:"rgba(26,95,58,0.08)",padding:"3px 10px",borderRadius:6,color:"#f8fafc"}}>{m.hs} - {m.as}</span></td>
              <td style={{padding:"8px",fontWeight:aw?700:400,color:aw?"#f8fafc":"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[m.a]||"#94a3b8",marginRight:6,verticalAlign:"middle"}}/>{m.a}</td>
            </tr>);
          })}</tbody>
        </table>
      </Card>

      <Card title="Upcoming Knockout Stage" icon={"\ud83d\udcc5"}>
        <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{padding:16,borderRadius:12,background:"rgba(26,95,58,0.06)",border:"1px solid rgba(26,95,58,0.15)"}}>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",marginBottom:8}}>Semi-Finals (7-8 Mar)</div>
            <div style={{fontSize:13,color:"#f8fafc",fontWeight:600,marginBottom:6}}>Georgia vs Romania</div>
            <div style={{fontSize:13,color:"#f8fafc",fontWeight:600}}>Portugal vs Spain</div>
          </div>
          <div style={{padding:16,borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",marginBottom:8}}>Ranking Semi-Finals (7 Mar)</div>
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:6}}>Switzerland vs Germany</div>
            <div style={{fontSize:13,color:"#94a3b8"}}>Belgium vs Netherlands</div>
          </div>
        </div>
        <div style={{marginTop:12,padding:12,borderRadius:8,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.12)",textAlign:"center"}}>
          <span style={{fontSize:11,color:"#d4a017",fontWeight:600}}>Finals Day: 15 March 2026 {"\u00b7"} Madrid, Spain</span>
        </div>
      </Card>
    </div>}

    {/* FULL HISTORY */}
    {view==="history"&&<div>
      <Card title="All Champions (1952–2025)" icon={"\ud83d\udcdc"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Year","Champion","Era/Format"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:"left",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{[...RE_CHAMPIONS].reverse().map((c,i)=>(
            <tr key={i}>
              <td style={{padding:"8px",fontWeight:600,fontFamily:"'JetBrains Mono',monospace",color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.year}</td>
              <td style={{padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <span style={{display:"inline-block",width:4,height:14,borderRadius:2,background:RE_COLORS[c.winner]||"#94a3b8",marginRight:8,verticalAlign:"middle"}}/>
                <span style={{fontWeight:600,color:RE_COLORS[c.winner]||"#f8fafc"}}>{c.winner}</span>
              </td>
              <td style={{padding:"8px",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{c.era}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>

      <Card title="Titles by Era" icon={"\ud83d\udcca"} style={{marginTop:24}}>
        <MT headers={["Nation","European Cup","FIRA NC","FIRA Trophy","ENC (2000-16)","REC (2017+)","Total"]}
          rows={titlesByNation.map(t=>{
            const e=titlesByEra[t.team]||{};
            return [
              <span style={{fontWeight:600,color:RE_COLORS[t.team]||"#f8fafc"}}>{t.team}</span>,
              e["European Cup"]||"-",e["FIRA Nations Cup"]||"-",e["FIRA Trophy"]||"-",e["ENC"]||"-",e["REC"]||"-",
              <span style={{fontWeight:700,color:"#d4a017",fontFamily:"'JetBrains Mono',monospace"}}>{t.titles}</span>
            ];
          })}/>
      </Card>
    </div>}

    {/* RECORDS */}
    {view==="records"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:24}}>
        {[
          {label:"Biggest Win",value:RE_RECORDS.biggestWin.match,sub:RE_RECORDS.biggestWin.year,color:"#dc2626",icon:"\ud83d\udca5"},
          {label:"Most Titles",value:RE_RECORDS.mostTitles.team+" ("+RE_RECORDS.mostTitles.count+")",sub:"All-time record",color:"#d4a017",icon:"\ud83c\udfc6"},
          {label:"Longest Win Streak",value:RE_RECORDS.longestWinStreak.count+" matches",sub:RE_RECORDS.longestWinStreak.team+" ("+RE_RECORDS.longestWinStreak.period+")",color:"#1a5f3a",icon:"\ud83d\udd25"},
          {label:"Current Unbeaten Run",value:RE_RECORDS.longestUnbeaten.count+" matches",sub:RE_RECORDS.longestUnbeaten.team+" ("+RE_RECORDS.longestUnbeaten.period+")",color:"#dc2626",icon:"\u26a1"},
          {label:"Home Unbeaten",value:RE_RECORDS.homeUnbeaten.count+" matches",sub:RE_RECORDS.homeUnbeaten.team+" ("+RE_RECORDS.homeUnbeaten.period+")",color:"#2563eb",icon:"\ud83c\udfe0"},
          {label:"Most Pts in a Season",value:RE_RECORDS.mostPtsInSeason.pts+" pts",sub:RE_RECORDS.mostPtsInSeason.team+" ("+RE_RECORDS.mostPtsInSeason.year+", "+RE_RECORDS.mostPtsInSeason.games+" games)",color:"#16a34a",icon:"\ud83c\udfc8"},
          {label:"Fewest Conceded (Season)",value:RE_RECORDS.fewestConceded.pts+" pts",sub:RE_RECORDS.fewestConceded.team+" ("+RE_RECORDS.fewestConceded.year+", "+RE_RECORDS.fewestConceded.games+" games)",color:"#0ea5e9",icon:"\ud83d\udee1\ufe0f"},
          {label:"Consecutive Titles",value:RE_RECORDS.mostConsecutiveTitles.count+" titles",sub:RE_RECORDS.mostConsecutiveTitles.team+" ("+RE_RECORDS.mostConsecutiveTitles.period+")",color:"#d4a017",icon:"\ud83d\udc51"},
        ].map((r,i)=>(
          <div key={i} style={{padding:16,borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderLeft:"4px solid "+(r.color||"#94a3b8")}}>
            <div style={{fontSize:10,color:"#94a3b8",fontWeight:600,textTransform:"uppercase",marginBottom:6}}>{r.icon} {r.label}</div>
            <div style={{fontSize:18,fontWeight:700,color:r.color||"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif"}}>{r.value}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{r.sub}</div>
          </div>
        ))}
      </div>

      <Card title="Notable Trophies within the Championship" icon={"\ud83c\udfc6"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {name:"Antim Cup",teams:"Romania vs Georgia",holder:"Georgia (2025)"},
            {name:"Viriato Cup",teams:"Portugal vs Spain",holder:"Spain (2025)"},
            {name:"Trophy of Two Iberias",teams:"Georgia vs Spain",holder:"Georgia (2025)"},
            {name:"Coltan Cup",teams:"Portugal vs Belgium",holder:"Portugal (2025)"},
            {name:"Trajan's Column",teams:"Spain vs Romania",holder:"Spain (2024)"},
            {name:"Kiseleff Cup",teams:"Romania vs Russia",holder:"Romania (2022)"},
          ].map((t,i)=>(
            <div key={i} style={{padding:12,borderRadius:10,background:"rgba(212,160,23,0.04)",border:"1px solid rgba(212,160,23,0.1)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#d4a017",marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:11,color:"#C5CDD8"}}>{t.teams}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>Holder: {t.holder}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>}
  </div>);
}

/* ═══════════════════════════════════════════════
   BRITISH & IRISH LIONS
   ═══════════════════════════════════════════════ */
function LionsTab(){
  const lionsVs=useMemo(()=>{
    const opp={};
    LIONS_SERIES.forEach(s=>{
      if(!opp[s.opponent])opp[s.opponent]={opp:s.opponent,series:0,w:0,d:0,l:0};
      opp[s.opponent].series++;
      if(s.result==="W")opp[s.opponent].w++;
      else if(s.result==="D")opp[s.opponent].d++;
      else opp[s.opponent].l++;
    });
    return Object.values(opp).sort((a,b)=>b.series-a.series);
  },[]);

  const lionsTotals=useMemo(()=>{
    let w=0,d=0,l=0;
    LIONS_SERIES.forEach(s=>{if(s.result==="W")w++;else if(s.result==="D")d++;else l++;});
    return {total:LIONS_SERIES.length,w,d,l};
  },[]);

  // Series by decade
  const byDecade=useMemo(()=>{
    const d={};
    LIONS_SERIES.forEach(s=>{
      const dec=Math.floor(s.year/10)*10+"s";
      if(!d[dec])d[dec]={decade:dec,w:0,d:0,l:0};
      if(s.result==="W")d[dec].w++;else if(s.result==="D")d[dec].d++;else d[dec].l++;
    });
    return Object.values(d).sort((a,b)=>a.decade.localeCompare(b.decade));
  },[]);

  return(<div>
    <div style={{marginBottom:28}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>British & Irish Lions</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>Combined team from England, Ireland, Scotland & Wales {"\u00b7"} Tours the southern hemisphere every four years {"\u00b7"} Since 1888</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Series" value={lionsTotals.total} icon={"\ud83e\udd81"} sub="Since 1891"/>
      <SB label="Series Won" value={lionsTotals.w} color="#1a5f3a"/>
      <SB label="Series Drawn" value={lionsTotals.d} color="#d4a017"/>
      <SB label="Series Lost" value={lionsTotals.l} color="#dc2626"/>
    </div>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Lions Record by Opponent" icon={"\ud83e\udd81"}>
        <MT headers={["Opponent","Series","Won","Drawn","Lost","Win%"]}
          rows={lionsVs.map(o=>[o.opp,o.series,<span style={{color:"#2a7a52",fontWeight:600}}>{o.w}</span>,o.d,<span style={{color:"#dc2626"}}>{o.l}</span>,<span style={{color:o.w/o.series>=0.5?"#2a7a52":"#dc2626",fontWeight:600}}>{((o.w/o.series)*100).toFixed(0)}%</span>])}/>
      </Card>
      <Card title="Series Results by Decade" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={byDecade}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
            <XAxis dataKey="decade" tick={{fill:"#94a3b8",fontSize:10}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="w" name="Won" stackId="a" fill="#1a5f3a"/>
            <Bar dataKey="d" name="Drawn" stackId="a" fill="#d4a017"/>
            <Bar dataKey="l" name="Lost" stackId="a" fill="#dc2626" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card title="Lions Key Facts" icon={"\ud83d\udcdd"} style={{marginBottom:24}}>
      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[
          ["1971","Only series win in New Zealand, led by Carwyn James. Barry John scored a tour-record 188 points."],
          ["1974","Legendary tour to South Africa: 21 straight wins before a draw in the final test prevented a clean sweep."],
          ["1966","Record test win of 31-0 vs Australia, which was the Wallabies' heaviest defeat at the time."],
          ["75%","Overall win rate across all tour matches \u2014 around 488 wins from 651 games played."],
          ["2017","Drew the series 1-1-1 in New Zealand. Owen Farrell\u2019s late penalty levelled the decider at 15-15."],
          ["2025","Won the series 2-1 in Australia, their first tour victory since 2013."],
        ].map(([highlight,text],i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{minWidth:48,padding:"4px 0",textAlign:"center",borderRadius:6,background:"rgba(26,95,58,0.12)",color:"#d4a017",fontWeight:700,fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>{highlight}</span>
            <p style={{fontSize:12,color:"#C5CDD8",lineHeight:1.6,margin:0}}>{text}</p>
          </div>
        ))}
      </div>
    </Card>

    <Card title="All Lions Test Series (1891\u20132025)" icon={"\ud83c\udfc6"}>
      <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{["Year","Opponent","Location","Result","Tests"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
        <tbody>{LIONS_SERIES.map((s,ri)=>(
          <tr key={ri} style={{background:s.result==="W"?"rgba(26,95,58,0.04)":s.result==="L"?"rgba(220,38,38,0.03)":"rgba(212,160,23,0.03)"}}>
            <td style={{padding:"10px 8px",fontWeight:600,fontFamily:"'JetBrains Mono',monospace",color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{s.year}</td>
            <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{s.opponent}</td>
            <td style={{padding:"10px 8px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{s.location}</td>
            <td style={{padding:"10px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <span style={{display:"inline-block",padding:"2px 10px",borderRadius:4,fontSize:11,fontWeight:600,borderLeft:"4px solid "+(s.result==="W"?"#1a5f3a":s.result==="L"?"#dc2626":"#d4a017"),background:s.result==="W"?"rgba(26,95,58,0.12)":s.result==="L"?"rgba(220,38,38,0.08)":"rgba(212,160,23,0.08)",color:s.result==="W"?"#2a7a52":s.result==="L"?"#dc2626":"#d4a017"}}>{s.result==="W"?"WON":s.result==="L"?"LOST":"DRAWN"}</span>
            </td>
            <td style={{padding:"10px 8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{s.tests}</td>
          </tr>
        ))}</tbody>
      </table>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════
   RECORDS & LEGENDS
   ═══════════════════════════════════════════════ */

// All-time top test point scorers (Tier 1)
var TOP_SCORERS=[
{rank:1,name:"Dan Carter",team:"New Zealand",pts:1598,caps:112,pos:"Fly-half",years:"2003-2015",tries:29,con:293,pen:281,dg:8},
{rank:2,name:"Owen Farrell",team:"England",pts:1227,caps:112,pos:"Fly-half",years:"2012-2023",tries:7,con:186,pen:242,dg:2},
{rank:3,name:"Jonny Wilkinson",team:"England",pts:1179,caps:97,pos:"Fly-half",years:"1998-2011",tries:7,con:162,pen:239,dg:36},
{rank:4,name:"Johnny Sexton",team:"Ireland",pts:1091,caps:118,pos:"Fly-half",years:"2009-2023",tries:10,con:170,pen:196,dg:9},
{rank:5,name:"Neil Jenkins",team:"Wales",pts:1049,caps:91,pos:"Fly-half",years:"1991-2002",tries:11,con:130,pen:218,dg:10},
{rank:6,name:"Ronan O'Gara",team:"Ireland",pts:1083,caps:130,pos:"Fly-half",years:"2000-2013",tries:16,con:176,pen:186,dg:15},
{rank:7,name:"Diego Dominguez",team:"Italy",pts:983,caps:76,pos:"Fly-half",years:"1989-2003",tries:3,con:109,pen:213,dg:18},
{rank:8,name:"Stephen Jones",team:"Wales",pts:970,caps:104,pos:"Fly-half",years:"2000-2011",tries:6,con:100,pen:222,dg:12},
{rank:9,name:"Andrew Mehrtens",team:"New Zealand",pts:967,caps:70,pos:"Fly-half",years:"1995-2004",tries:7,con:169,pen:178,dg:10},
{rank:10,name:"Michael Lynagh",team:"Australia",pts:911,caps:72,pos:"Fly-half",years:"1984-1995",tries:17,con:140,pen:177,dg:18},
{rank:11,name:"Percy Montgomery",team:"South Africa",pts:893,caps:102,pos:"Fullback",years:"1997-2008",tries:25,con:153,pen:129,dg:2},
{rank:12,name:"Handré Pollard",team:"South Africa",pts:858,caps:76,pos:"Fly-half",years:"2014-2025",tries:4,con:127,pen:174,dg:4},
{rank:13,name:"Beauden Barrett",team:"New Zealand",pts:831,caps:131,pos:"Fly-half",years:"2012-2025",tries:51,con:161,pen:73,dg:2},
{rank:14,name:"Chris Paterson",team:"Scotland",pts:809,caps:109,pos:"Fullback",years:"1999-2011",tries:22,con:102,pen:155,dg:4},
{rank:15,name:"Morné Steyn",team:"South Africa",pts:742,caps:68,pos:"Fly-half",years:"2009-2021",tries:1,con:93,pen:157,dg:11},
];

// All-time most capped players
var MOST_CAPPED=[
{rank:1,name:"Alun Wyn Jones",team:"Wales",caps:157,pos:"Lock",years:"2006-2022"},
{rank:2,name:"Richie McCaw",team:"New Zealand",caps:148,pos:"Flanker",years:"2001-2015"},
{rank:3,name:"Sergio Parisse",team:"Italy",caps:142,pos:"No.8",years:"2002-2019"},
{rank:4,name:"Brian O'Driscoll",team:"Ireland",caps:141,pos:"Centre",years:"1999-2014"},
{rank:5,name:"George Gregan",team:"Australia",caps:139,pos:"Scrum-half",years:"1994-2007"},
{rank:6,name:"Eben Etzebeth",team:"South Africa",caps:131,pos:"Lock",years:"2012-2025"},
{rank:7,name:"Beauden Barrett",team:"New Zealand",caps:131,pos:"Fly-half",years:"2012-2025"},
{rank:8,name:"Gethin Jenkins",team:"Wales",caps:134,pos:"Prop",years:"2002-2016"},
{rank:9,name:"Keven Mealamu",team:"New Zealand",caps:132,pos:"Hooker",years:"2002-2015"},
{rank:10,name:"Ronan O'Gara",team:"Ireland",caps:130,pos:"Fly-half",years:"2000-2013"},
{rank:11,name:"Stephen Moore",team:"Australia",caps:129,pos:"Hooker",years:"2005-2017"},
{rank:12,name:"Victor Matfield",team:"South Africa",caps:127,pos:"Lock",years:"2001-2015"},
{rank:13,name:"Kieran Read",team:"New Zealand",caps:127,pos:"No.8",years:"2008-2019"},
{rank:14,name:"Sam Whitelock",team:"New Zealand",caps:153,pos:"Lock",years:"2010-2023"},
{rank:15,name:"Jason Leonard",team:"England",caps:119,pos:"Prop",years:"1990-2004"},
];

// All-time top try scorers
var TOP_TRY_SCORERS=[
{rank:1,name:"Daisuke Ohata",team:"Japan",tries:69,caps:58,years:"1996-2006"},
{rank:2,name:"Bryan Habana",team:"South Africa",tries:67,caps:124,years:"2004-2016"},
{rank:3,name:"David Campese",team:"Australia",tries:64,caps:101,years:"1982-1996"},
{rank:4,name:"Shane Williams",team:"Wales",tries:60,caps:91,years:"2000-2011"},
{rank:5,name:"Doug Howlett",team:"New Zealand",tries:49,caps:62,years:"2000-2007"},
{rank:6,name:"Beauden Barrett",team:"New Zealand",tries:51,caps:131,years:"2012-2025"},
{rank:7,name:"Brian O'Driscoll",team:"Ireland",tries:46,caps:141,years:"1999-2014"},
{rank:8,name:"Rory Underwood",team:"England",tries:49,caps:85,years:"1984-1996"},
{rank:9,name:"Joe Rokocoko",team:"New Zealand",tries:46,caps:68,years:"2003-2010"},
{rank:10,name:"George North",team:"Wales",tries:45,caps:117,years:"2010-2024"},
];

// British & Irish Lions test series results
var LIONS_SERIES=[
{year:1891,opponent:"South Africa",result:"W",tests:"3-0",location:"South Africa"},
{year:1896,opponent:"South Africa",result:"W",tests:"3-1",location:"South Africa"},
{year:1899,opponent:"Australia",result:"W",tests:"3-1",location:"Australia"},
{year:1903,opponent:"South Africa",result:"L",tests:"0-1-2",location:"South Africa"},
{year:1904,opponent:"Australia",result:"W",tests:"3-0",location:"Australia"},
{year:1904,opponent:"New Zealand",result:"L",tests:"0-1",location:"New Zealand"},
{year:1908,opponent:"New Zealand",result:"L",tests:"0-2-1",location:"New Zealand"},
{year:1910,opponent:"South Africa",result:"L",tests:"1-2",location:"South Africa"},
{year:1924,opponent:"South Africa",result:"L",tests:"0-3-1",location:"South Africa"},
{year:1930,opponent:"New Zealand",result:"L",tests:"1-3",location:"New Zealand"},
{year:1930,opponent:"Australia",result:"W",tests:"1-0",location:"Australia"},
{year:1938,opponent:"South Africa",result:"L",tests:"1-2",location:"South Africa"},
{year:1950,opponent:"New Zealand",result:"L",tests:"0-3-1",location:"New Zealand"},
{year:1950,opponent:"Australia",result:"W",tests:"2-0",location:"Australia"},
{year:1955,opponent:"South Africa",result:"D",tests:"2-2",location:"South Africa"},
{year:1959,opponent:"Australia",result:"W",tests:"2-0",location:"Australia"},
{year:1959,opponent:"New Zealand",result:"L",tests:"1-3",location:"New Zealand"},
{year:1962,opponent:"South Africa",result:"L",tests:"0-3-1",location:"South Africa"},
{year:1966,opponent:"Australia",result:"W",tests:"2-0",location:"Australia"},
{year:1966,opponent:"New Zealand",result:"L",tests:"0-4",location:"New Zealand"},
{year:1968,opponent:"South Africa",result:"L",tests:"0-3-1",location:"South Africa"},
{year:1971,opponent:"New Zealand",result:"W",tests:"2-1-1",location:"New Zealand"},
{year:1974,opponent:"South Africa",result:"W",tests:"3-0-1",location:"South Africa"},
{year:1977,opponent:"New Zealand",result:"L",tests:"1-3",location:"New Zealand"},
{year:1980,opponent:"South Africa",result:"L",tests:"1-3",location:"South Africa"},
{year:1983,opponent:"New Zealand",result:"L",tests:"0-4",location:"New Zealand"},
{year:1989,opponent:"Australia",result:"W",tests:"2-1",location:"Australia"},
{year:1993,opponent:"New Zealand",result:"L",tests:"1-2",location:"New Zealand"},
{year:1997,opponent:"South Africa",result:"W",tests:"2-1",location:"South Africa"},
{year:2001,opponent:"Australia",result:"L",tests:"1-2",location:"Australia"},
{year:2005,opponent:"New Zealand",result:"L",tests:"0-3",location:"New Zealand"},
{year:2009,opponent:"South Africa",result:"L",tests:"1-2",location:"South Africa"},
{year:2013,opponent:"Australia",result:"W",tests:"2-1",location:"Australia"},
{year:2017,opponent:"New Zealand",result:"D",tests:"1-1-1",location:"New Zealand"},
{year:2021,opponent:"South Africa",result:"L",tests:"1-2",location:"South Africa"},
{year:2025,opponent:"Australia",result:"W",tests:"2-1",location:"Australia"},
];

// Six Nations all-time facts
var SIX_NATIONS_FACTS=[
"England hold the most Six Nations titles overall with 29 championships (including Five Nations)",
"France have won the Grand Slam 10 times across both Five and Six Nations formats",
"Wales hold the record for the most consecutive Six Nations Triple Crowns (3 from 2005-2008)",
"Italy joined the tournament in 2000 to form the Six Nations, having previously competed in FIRA",
"The highest score in Six Nations history is England 80-23 Italy in 2001",
"Brian O'Driscoll is the Six Nations all-time leading try scorer with 26 tries",
"Ronan O'Gara holds the Six Nations all-time points record with 557 points",
"The largest victory margin in Six Nations is 57 points (England 80-23 Italy, 2001)",
"Wales won 11 consecutive Six Nations matches from 2005-2006",
"Ireland achieved consecutive Grand Slams in 2023 and 2024",
];

function Records({intl}){
  const [subTab,setSubTab]=useState("scorers");

  // All-time head-to-head from intl data (biggest wins, closest games)
  const biggestWins=useMemo(()=>[...intl].map(m=>({...m,margin:Math.abs(m.hs-m.as),winner:m.hs>m.as?m.home:m.away,loser:m.hs>m.as?m.away:m.home,ws:Math.max(m.hs,m.as),ls:Math.min(m.hs,m.as)})).filter(m=>m.margin>0).sort((a,b)=>b.margin-a.margin).slice(0,15),[intl]);

  const highestScoring=useMemo(()=>[...intl].map(m=>({...m,total:m.hs+m.as})).sort((a,b)=>b.total-a.total).slice(0,15),[intl]);

  const closestGames=useMemo(()=>[...intl].filter(m=>m.hs!==m.as).map(m=>({...m,margin:Math.abs(m.hs-m.as)})).sort((a,b)=>a.margin-b.margin).slice(0,15),[intl]);

  const draws=useMemo(()=>intl.filter(m=>m.hs===m.as).sort((a,b)=>b.hs-a.hs).slice(0,15),[intl]);

  const subTabs=[
    {id:"scorers",label:"Top Scorers",icon:"\ud83c\udfc6"},
    {id:"caps",label:"Most Capped",icon:"\ud83e\udd47"},
    {id:"tries",label:"Top Try Scorers",icon:"\ud83c\udfc3"},
    {id:"biggest",label:"Biggest Wins",icon:"\ud83d\udca5"},
    {id:"highest",label:"High Scoring",icon:"\u26a1"},
    {id:"closest",label:"Closest Games",icon:"\ud83d\udca8"},
    {id:"facts",label:"6N Facts",icon:"\ud83d\udcdd"},
  ];

  return(<div>
    <div style={{marginBottom:28}}>
      <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc"}}>Records & Legends</h2>
      <p style={{margin:"6px 0 0",fontSize:13,color:"#94a3b8"}}>All-time test records {"\u00b7"} Top scorers {"\u00b7"} Most capped {"\u00b7"} British & Irish Lions {"\u00b7"} Six Nations facts</p>
    </div>

    {/* Sub-tabs */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
      {subTabs.map(t=><button key={t.id} onClick={()=>setSubTab(t.id)}
        style={{padding:"8px 16px",fontSize:12,fontWeight:subTab===t.id?700:500,color:subTab===t.id?"#f8fafc":"#94a3b8",background:subTab===t.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(subTab===t.id?"rgba(26,95,58,0.3)":"rgba(255,255,255,0.06)"),borderRadius:8,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.03em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:14}}>{t.icon}</span>{t.label}
      </button>)}
    </div>

    {/* TOP POINT SCORERS */}
    {subTab==="scorers"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="All-Time #1" value={TOP_SCORERS[0].name} sub={TOP_SCORERS[0].pts+" pts"} color={TC[TOP_SCORERS[0].team]||"#d4a017"}/>
        <SB label="Top NH Scorer" value="Jonny Wilkinson" sub="1,179 pts" color={TC["England"]||"#d4a017"}/>
        <SB label="Most Drop Goals" value="Jonny Wilkinson" sub="36 DG" icon={"\ud83e\uddb6"}/>
        <SB label="Best Avg/Game" value={TOP_SCORERS[0].name} sub={(TOP_SCORERS[0].pts/TOP_SCORERS[0].caps).toFixed(1)+" pts/gm"} icon={"\ud83d\udcc8"}/>
      </div>
      <Card title="All-Time Test Point Scorers" icon={"\ud83c\udfc6"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Player","Team","Pts","Caps","T","C","P","DG","Avg"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{TOP_SCORERS.map((p,ri)=>(
            <tr key={p.name} style={{background:ri===0?"rgba(212,160,23,0.06)":ri%2?"rgba(255,255,255,0.012)":"transparent"}}>
              <td style={{padding:"10px 8px",color:ri<3?"#d4a017":"#94a3b8",fontWeight:ri<3?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.rank}</td>
              <td style={{padding:"10px 8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.name}</td>
              <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={p.team} size={14}/></td>
              {[p.pts,p.caps,p.tries,p.con,p.pen,p.dg,(p.pts/p.caps).toFixed(1)].map((v,ci)=>(
                <td key={ci} style={{padding:"10px 8px",textAlign:"right",color:ci===0?"#d4a017":"#C5CDD8",fontWeight:ci===0?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)",fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>{v}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>}

    {/* MOST CAPPED */}
    {subTab==="caps"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="Most Capped" value="Alun Wyn Jones" sub="157 caps" color={TC["Wales"]||"#d4a017"}/>
        <SB label="Most NZ Caps" value="Sam Whitelock" sub="153 caps" color={TC["New Zealand"]}/>
        <SB label="Most Capped Captain" value="Richie McCaw" sub="110 as captain" icon={"\u00a9\ufe0f"}/>
        <SB label="Most Test Wins" value="Richie McCaw" sub="131 wins" icon={"\ud83c\udfc6"}/>
      </div>
      <Card title="All-Time Most Capped Players" icon={"\ud83e\udd47"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Player","Team","Caps","Position","Years"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{MOST_CAPPED.map((p,ri)=>(
            <tr key={p.name} style={{background:ri===0?"rgba(212,160,23,0.06)":ri%2?"rgba(255,255,255,0.012)":"transparent"}}>
              <td style={{padding:"10px 8px",color:ri<3?"#d4a017":"#94a3b8",fontWeight:ri<3?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.rank}</td>
              <td style={{padding:"10px 8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.name}</td>
              <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={p.team} size={14}/></td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#d4a017",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.caps}</td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.pos}</td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.years}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>}

    {/* TOP TRY SCORERS */}
    {subTab==="tries"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        <SB label="All-Time Leader" value="Daisuke Ohata" sub="69 tries" icon={"\ud83c\udfc3"}/>
        <SB label="Best Try Rate" value="Daisuke Ohata" sub={(69/58).toFixed(2)+" per game"} color="#d4a017"/>
        <SB label="Most Tier 1" value="Bryan Habana" sub="67 tries" color={TC["South Africa"]}/>
        <SB label="Most NH Tries" value="Shane Williams" sub="60 tries" color={TC["Wales"]}/>
      </div>
      <Card title="All-Time Test Try Scorers" icon={"\ud83c\udfc3"}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Player","Team","Tries","Caps","Rate","Years"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
          <tbody>{TOP_TRY_SCORERS.map((p,ri)=>(
            <tr key={p.name} style={{background:ri===0?"rgba(212,160,23,0.06)":ri%2?"rgba(255,255,255,0.012)":"transparent"}}>
              <td style={{padding:"10px 8px",color:ri<3?"#d4a017":"#94a3b8",fontWeight:ri<3?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.rank}</td>
              <td style={{padding:"10px 8px",fontWeight:600,color:"#f8fafc",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.name}</td>
              <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={p.team} size={14}/></td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#d4a017",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.tries}</td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#C5CDD8",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.caps}</td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#2a7a52",fontWeight:600,fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{(p.tries/p.caps).toFixed(2)}</td>
              <td style={{padding:"10px 8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{p.years}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>}

    {/* BIGGEST WINS */}
    {subTab==="biggest"&&<Card title="Biggest Victory Margins (Tier 1 vs Tier 1)" icon={"\ud83d\udca5"}>
      <MT headers={["Date","Winner","Score","Loser","Margin"]}
        rows={biggestWins.map(m=>[m.date,<TeamLabel team={m.winner} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.ws+" - "+m.ls}</span>,<TeamLabel team={m.loser} size={14}/>,<span style={{color:"#d4a017",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>+{m.margin}</span>])}/>
    </Card>}

    {/* HIGHEST SCORING */}
    {subTab==="highest"&&<div>
      <Card title="Highest Scoring Matches" icon={"\u26a1"} style={{marginBottom:24}}>
        <MT headers={["Date","Home","Score","Away","Total"]}
          rows={highestScoring.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#d4a017",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{m.total}</span>])}/>
      </Card>
      <Card title="Highest Scoring Draws" icon={"\ud83e\udd1d"}>
        <MT headers={["Date","Home","Score","Away","Total"]}
          rows={draws.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(212,160,23,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace"}}>{m.hs+m.as}</span>])}/>
      </Card>
    </div>}

    {/* CLOSEST GAMES */}
    {subTab==="closest"&&<Card title="Closest Finishes (1-point margins)" icon={"\ud83d\udca8"}>
      <MT headers={["Date","Home","Score","Away","Margin"]}
        rows={closestGames.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#dc2626",fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{m.margin}</span>])}/>
    </Card>}

    {/* SIX NATIONS FACTS */}
    {subTab==="facts"&&<div>
      <Card title="Six Nations Stats & Facts" icon={"\ud83d\udcdd"}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {SIX_NATIONS_FACTS.map((fact,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{minWidth:28,height:28,borderRadius:6,background:"rgba(26,95,58,0.12)",color:"#2a7a52",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{i+1}</span>
              <p style={{fontSize:13,color:"#C5CDD8",lineHeight:1.6,margin:0}}>{fact}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>}
  </div>);
}

function Raeburn({rb,rbr}){
  const current = rb[rb.length-1];
  const totalReigns = rb.length;
  const totalMatches = rbr.length;

  // Team aggregates from holder data
  const teamStats = useMemo(()=>{
    const tmap = {};
    rb.forEach(r=>{
      if(!tmap[r.holder])tmap[r.holder]={team:r.holder,reigns:0,days:0,matches:0,longest:0,longestFrom:"",mostDef:0,mostDefFrom:""};
      const t=tmap[r.holder];
      t.reigns++;
      t.days+=r.days;
      t.matches+=r.matches;
      if(r.days>t.longest){t.longest=r.days;t.longestFrom=r.gained;}
      if(r.matches>t.mostDef){t.mostDef=r.matches;t.mostDefFrom=r.gained;}
    });
    return Object.values(tmap).sort((a,b)=>b.reigns-a.reigns);
  },[rb]);

  // Match stats from results data
  const matchStats = useMemo(()=>{
    const tmap={};
    rbr.forEach(m=>{
      [m.home,m.away].forEach(t=>{if(!tmap[t])tmap[t]={team:t,p:0,w:0,d:0,l:0,pf:0,pa:0};});
      tmap[m.home].p++;tmap[m.away].p++;
      tmap[m.home].pf+=m.hs;tmap[m.home].pa+=m.as;
      tmap[m.away].pf+=m.as;tmap[m.away].pa+=m.hs;
      if(m.hs>m.as){tmap[m.home].w++;tmap[m.away].l++;}
      else if(m.as>m.hs){tmap[m.away].w++;tmap[m.home].l++;}
      else{tmap[m.home].d++;tmap[m.away].d++;}
    });
    return Object.values(tmap).map(t=>({...t,wp:t.p?+((t.w/t.p)*100).toFixed(1):0,pd:t.pf-t.pa})).sort((a,b)=>b.w-a.w);
  },[rbr]);

  // Biggest wins in shield matches
  const biggestWins = useMemo(()=>[...rbr].map(m=>({...m,margin:Math.abs(m.hs-m.as),winner:m.hs>m.as?m.home:m.away,loser:m.hs>m.as?m.away:m.home,ws:Math.max(m.hs,m.as),ls:Math.min(m.hs,m.as)})).filter(m=>m.margin>0).sort((a,b)=>b.margin-a.margin).slice(0,15),[rbr]);

  // Highest scoring shield matches
  const highestScoring = useMemo(()=>[...rbr].sort((a,b)=>(b.hs+b.as)-(a.hs+a.as)).slice(0,15),[rbr]);

  // Shield matches by decade
  const decadeMatchData = useMemo(()=>{
    const dmap={};
    rbr.forEach(m=>{
      const yr=+m.date.split('-')[0];
      const dec=Math.floor(yr/10)*10+"s";
      if(!dmap[dec])dmap[dec]={decade:dec,matches:0,totalPts:0,transfers:0,draws:0};
      dmap[dec].matches++;
      dmap[dec].totalPts+=m.hs+m.as;
      if(m.run===1)dmap[dec].transfers++;
      if(m.hs===m.as)dmap[dec].draws++;
    });
    return Object.values(dmap).map(d=>({...d,avgPts:+(d.totalPts/d.matches).toFixed(1)})).sort((a,b)=>a.decade.localeCompare(b.decade));
  },[rbr]);

  // Venue stats
  const venueStats = useMemo(()=>{
    const vmap={};
    rbr.forEach(m=>{
      if(!m.venue)return;
      if(!vmap[m.venue])vmap[m.venue]={venue:m.venue,matches:0,homeW:0,awayW:0,draws:0,transfers:0};
      vmap[m.venue].matches++;
      if(m.hs>m.as)vmap[m.venue].homeW++;else if(m.as>m.hs)vmap[m.venue].awayW++;else vmap[m.venue].draws++;
      if(m.run===1)vmap[m.venue].transfers++;
    });
    return Object.values(vmap).sort((a,b)=>b.matches-a.matches).slice(0,20);
  },[rbr]);

  // Timeline data: reigns over time grouped by decade
  const decadeData = useMemo(()=>{
    const decades = {};
    rb.forEach(r=>{
      const yr = +r.gained.split(/[-\s]/g).pop();
      if(isNaN(yr)) return;
      const dec = Math.floor(yr/10)*10+"s";
      if(!decades[dec])decades[dec]={decade:dec};
      if(!decades[dec][r.holder])decades[dec][r.holder]=0;
      decades[dec][r.holder]++;
    });
    return Object.values(decades).sort((a,b)=>a.decade.localeCompare(b.decade));
  },[rb]);

  // Longest single reigns
  const longestReigns = useMemo(()=>[...rb].filter(r=>r.days>0).sort((a,b)=>b.days-a.days).slice(0,15),[rb]);
  const mostDefences = useMemo(()=>[...rb].filter(r=>r.matches>0).sort((a,b)=>b.matches-a.matches).slice(0,15),[rb]);

  // Recent transfers
  const recentTransfers = useMemo(()=>[...rb].slice(-30),[rb]);

  // Avg reign length by team
  const avgReign = useMemo(()=>teamStats.map(t=>({team:t.team,avg:t.reigns?+(t.days/t.reigns).toFixed(0):0})).sort((a,b)=>b.avg-a.avg),[teamStats]);

  const [sub,setSub]=useState("overview");
  const [resultsPage,setResultsPage]=useState(0);
  const [resultsFilter,setResultsFilter]=useState("all");
  const PER_PAGE=50;

  const allTeams = teamStats.map(t=>t.team);

  // Filtered results for match list
  const filteredResults = useMemo(()=>{
    let r=[...rbr].reverse();
    if(resultsFilter!=="all")r=r.filter(m=>m.home===resultsFilter||m.away===resultsFilter);
    return r;
  },[rbr,resultsFilter]);

  const totalPages=Math.ceil(filteredResults.length/PER_PAGE);
  const pagedResults=filteredResults.slice(resultsPage*PER_PAGE,(resultsPage+1)*PER_PAGE);

  return(<div>
    {/* Header */}
    <div className="fade-in" style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
      <span style={{fontSize:32}}>{"\ud83d\udee1\ufe0f"}</span>
      <div>
        <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#F5F7FA"}}>The Raeburn Shield</h2>
        <p style={{margin:0,fontSize:12,color:"#94a3b8"}}>Lineal championship of international rugby {"\u00b7"} Since 1871</p>
      </div>
    </div>
    <p style={{fontSize:13,color:"#7A8BA8",marginBottom:28,maxWidth:800,lineHeight:1.6}}>The Raeburn Shield is rugby union's lineal championship. Scotland won the first ever international in 1871 and held the title. It passes to any team that defeats the current holder in a full international. Named after Raeburn Place in Edinburgh, where that first match took place.</p>

    {/* Current holder banner */}
    <div className="fade-in" style={{position:"relative",padding:"28px 32px",marginBottom:28,background:"linear-gradient(135deg,rgba(255,182,18,0.1) 0%,rgba(212,33,61,0.06) 50%,rgba(7,11,22,0.5) 100%)",borderRadius:16,border:"1px solid rgba(255,182,18,0.2)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#FFB612,#D4213D,transparent)"}}/>
      <div style={{fontSize:11,color:"#FFB612",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"\ud83d\udee1\ufe0f"} Current Holder</div>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <FlagBadge team={current.holder} size={48}/>
        <div>
          <div style={{fontSize:32,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:"#F5F7FA"}}>{current.holder}</div>
          <div style={{fontSize:13,color:"#7A8BA8",marginTop:2}}>Holder #{current.no} {"\u00b7"} Gained {current.gained}{current.matches>0?" \u00b7 "+current.matches+" successful defence"+(current.matches!==1?"s":""):""}</div>
        </div>
      </div>
    </div>

    {/* Key stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Shield Matches" value={totalMatches} icon={"\ud83c\udfc9"} sub="Since 1871"/>
      <SB label="Total Reigns" value={totalReigns} icon={"\ud83d\udee1\ufe0f"}/>
      <SB label="Different Holders" value={teamStats.length} icon={"\ud83c\udf0d"} sub={teamStats.length+" nations"}/>
      <SB label="Most Reigns" value={teamStats[0]?.team||"-"} sub={teamStats[0]?.reigns+" times"} color={TC[teamStats[0]?.team]||"#FFB612"}/>
      <SB label="Longest Reign" value={longestReigns[0]?.days+" days"} sub={longestReigns[0]?.holder} color="#169B62"/>
      <SB label="Most Defences" value={mostDefences[0]?.matches} sub={mostDefences[0]?.holder+" (single reign)"} color="#D4213D"/>
    </div>

    {/* Sub tabs */}
    <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
      {[{id:"overview",label:"Overview",ic:"\ud83d\udcca"},{id:"results",label:"Match Results",ic:"\ud83c\udfc9"},{id:"reigns",label:"All Reigns",ic:"\ud83d\udcc4"},{id:"records",label:"Records",ic:"\ud83c\udfc6"},{id:"timeline",label:"Timeline",ic:"\u23f3"}].map(t=>(
        <button key={t.id} onClick={()=>setSub(t.id)}
          style={{padding:"10px 18px",fontSize:12.5,fontWeight:sub===t.id?600:400,color:sub===t.id?"#F5F7FA":"#5A6A82",background:sub===t.id?"rgba(255,182,18,0.15)":"rgba(255,255,255,0.02)",border:"1px solid "+(sub===t.id?"rgba(255,182,18,0.3)":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{t.ic}</span>{t.label}</button>
      ))}
    </div>

    {sub==="overview"&&<div>
      {/* Team leaderboard */}
      <Card title="Raeburn Shield Leaderboard" icon={"\ud83d\udee1\ufe0f"} style={{marginBottom:24}}>
        <div style={{overflowX:"auto"}}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["#","Team","Reigns","Total Days","Avg Days","Total Defences","Longest Reign (days)","Most Defences (single)"].map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i<2?"left":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
            <tbody>{teamStats.map((t,ri)=>(
              <tr key={t.team} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
                <td style={{padding:"8px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={16}/></td>
                {[t.reigns,t.days.toLocaleString(),t.reigns?Math.round(t.days/t.reigns):0,t.matches,t.longest.toLocaleString(),t.mostDef].map((v,ci)=>(
                  <td key={ci} style={{padding:"8px 10px",textAlign:"right",color:ci===0?"#FFB612":"#C5CDD8",fontWeight:ci===0?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Number of Reigns by Team" icon={"\ud83d\udee1\ufe0f"}>
          <ResponsiveContainer width="100%" height={Math.max(200,teamStats.length*30)}>
            <BarChart data={teamStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="reigns" name="Reigns" radius={[0,4,4,0]}>
                {teamStats.map((e,i)=><Cell key={i} fill={TC[e.team]||"#7A8BA8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Total Days as Holder" icon={"\u23f3"}>
          <ResponsiveContainer width="100%" height={Math.max(200,teamStats.length*30)}>
            <BarChart data={[...teamStats].sort((a,b)=>b.days-a.days)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="days" name="Days" radius={[0,4,4,0]}>
                {[...teamStats].sort((a,b)=>b.days-a.days).map((e,i)=><Cell key={i} fill={TC[e.team]||"#7A8BA8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <Card title="Average Reign Length (Days)" icon={"\ud83d\udcca"}>
          <ResponsiveContainer width="100%" height={Math.max(200,avgReign.length*30)}>
            <BarChart data={avgReign} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="avg" name="Avg Days" fill="#FFB612" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Total Successful Defences" icon={"\u2694\ufe0f"}>
          <ResponsiveContainer width="100%" height={Math.max(200,teamStats.length*30)}>
            <BarChart data={[...teamStats].sort((a,b)=>b.matches-a.matches)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="matches" name="Defences" radius={[0,4,4,0]}>
                {[...teamStats].sort((a,b)=>b.matches-a.matches).map((e,i)=><Cell key={i} fill={TC[e.team]||"#7A8BA8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>}

    {sub==="results"&&<div>
      {/* Match performance table */}
      <Card title="Team Performance in Shield Matches" icon={"\ud83d\udcca"} style={{marginBottom:24}}>
        <div style={{overflowX:"auto"}}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["#","Team","P","W","D","L","Win%","PF","PA","PD"].map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i<2?"left":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
            <tbody>{matchStats.map((t,ri)=>(
              <tr key={t.team} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
                <td style={{padding:"8px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={16}/></td>
                {[t.p,t.w,t.d,t.l,t.wp+"%",t.pf,t.pa,t.pd>0?"+"+t.pd:t.pd].map((v,ci)=>(
                  <td key={ci} style={{padding:"8px 10px",textAlign:"right",color:ci===4?(t.wp>=50?"#169B62":"#C5CDD8"):ci===7?(t.pd>0?"#169B62":"#D4213D"):"#C5CDD8",fontWeight:ci===4?600:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{v}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Biggest Victories (by margin)" icon={"\ud83d\udcaa"}>
          <MT headers={["Date","Winner","Score","Loser","Margin"]}
            rows={biggestWins.map(m=>[m.date,<TeamLabel team={m.winner} size={14}/>,<span style={{fontWeight:700}}>{m.ws+"-"+m.ls}</span>,<TeamLabel team={m.loser} size={14}/>,<span style={{color:"#FFB612",fontWeight:600}}>+{m.margin}</span>])}/>
        </Card>
        <Card title="Highest Scoring Matches" icon={"\u26a1"}>
          <MT headers={["Date","Home","Score","Away","Total"]}
            rows={highestScoring.map(m=>[m.date,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:700}}>{m.hs+"-"+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{color:"#FFB612"}}>{m.hs+m.as}</span>])}/>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Scoring Evolution by Decade" icon={"\ud83d\udcc8"}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={decadeMatchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="avgPts" name="Avg Total Pts" fill="#D4213D" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Shield Transfers by Decade" icon={"\ud83d\udd04"}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={decadeMatchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="transfers" name="Transfers" fill="#FFB612" radius={[4,4,0,0]}/>
              <Bar dataKey="draws" name="Draws" fill="#7A8BA8" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top venues */}
      <Card title="Top Shield Venues" icon={"\ud83c\udfdf\ufe0f"} style={{marginBottom:24}}>
        <MT headers={["Venue","Matches","Home W","Away W","Draws","Transfers"]}
          rows={venueStats.map(v=>[<span style={{fontWeight:600}}>{v.venue}</span>,v.matches,v.homeW,v.awayW,v.draws,v.transfers>0?<span style={{color:"#FFB612",fontWeight:600}}>{v.transfers}</span>:"0"])}/>
      </Card>

      {/* Full match results */}
      <Card title={"All Shield Match Results ("+filteredResults.length+")"} icon={"\ud83c\udfc9"}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:"#5A6A82"}}>Filter:</span>
          <select value={resultsFilter} onChange={e=>{setResultsFilter(e.target.value);setResultsPage(0);}} style={{background:"#1e293b",color:"#E8ECF1",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:12}}>
            <option value="all">All Teams</option>
            {matchStats.map(t=><option key={t.team} value={t.team}>{t.team}</option>)}
          </select>
          <span style={{fontSize:11,color:"#94a3b8"}}>Page {resultsPage+1} of {totalPages}</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Date","Home","Score","Away","Tournament","Venue","Shield"].map((h,i)=><th key={i} style={{padding:"8px 8px",textAlign:i<2?"left":i===6?"center":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
            <tbody>{pagedResults.map((m,ri)=>{
              const hw=m.hs>m.as,aw=m.as>m.hs,draw=m.hs===m.as;
              return(<tr key={ri} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
                <td style={{padding:"8px 8px",color:"#7A8BA8",borderBottom:"1px solid rgba(255,255,255,0.03)",whiteSpace:"nowrap"}}>{m.date}</td>
                <td style={{padding:"8px 8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-flex",alignItems:"center",gap:5,fontWeight:hw?600:400,color:hw?"#F5F7FA":"#7A8BA8"}}><Flag team={m.home} size={14}/>{m.home}</span></td>
                <td style={{padding:"8px 8px",textAlign:"right",fontWeight:700,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",borderBottom:"1px solid rgba(255,255,255,0.03)",color:draw?"#7A8BA8":"#F5F7FA"}}>{m.hs} - {m.as}</td>
                <td style={{padding:"8px 8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-flex",alignItems:"center",gap:5,justifyContent:"flex-end",fontWeight:aw?600:400,color:aw?"#F5F7FA":"#7A8BA8"}}>{m.away}<Flag team={m.away} size={14}/></span></td>
                <td style={{padding:"8px 8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.tourn}</td>
                <td style={{padding:"8px 8px",textAlign:"right",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.venue}{m.neutral?" (N)":""}</td>
                <td style={{padding:"8px 8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.run===1?<span style={{padding:"2px 8px",borderRadius:10,background:"rgba(255,182,18,0.15)",color:"#FFB612",fontSize:10,fontWeight:700}}>TRANSFER</span>:draw?<span style={{color:"#94a3b8",fontSize:10}}>Draw</span>:<span style={{color:"#3A4A62",fontSize:10}}>Defended</span>}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
        {totalPages>1&&<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:16}}>
          <button onClick={()=>setResultsPage(0)} disabled={resultsPage===0} style={{padding:"6px 12px",fontSize:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,color:resultsPage===0?"#3A4A62":"#7A8BA8",cursor:resultsPage===0?"default":"pointer"}}>First</button>
          <button onClick={()=>setResultsPage(p=>Math.max(0,p-1))} disabled={resultsPage===0} style={{padding:"6px 12px",fontSize:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,color:resultsPage===0?"#3A4A62":"#7A8BA8",cursor:resultsPage===0?"default":"pointer"}}>Prev</button>
          <span style={{padding:"6px 12px",fontSize:11,color:"#7A8BA8"}}>{resultsPage+1} / {totalPages}</span>
          <button onClick={()=>setResultsPage(p=>Math.min(totalPages-1,p+1))} disabled={resultsPage>=totalPages-1} style={{padding:"6px 12px",fontSize:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,color:resultsPage>=totalPages-1?"#3A4A62":"#7A8BA8",cursor:resultsPage>=totalPages-1?"default":"pointer"}}>Next</button>
          <button onClick={()=>setResultsPage(totalPages-1)} disabled={resultsPage>=totalPages-1} style={{padding:"6px 12px",fontSize:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,color:resultsPage>=totalPages-1?"#3A4A62":"#7A8BA8",cursor:resultsPage>=totalPages-1?"default":"pointer"}}>Last</button>
        </div>}
      </Card>
    </div>}

    {sub==="reigns"&&<div>
      <Card title={"Complete Reign History ("+totalReigns+" reigns)"}>
        <div style={{overflowX:"auto",maxHeight:600,overflow:"auto"}}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["#","Holder","Gained","Days Held","Defences"].map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i<2?"left":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em",position:"sticky",top:0,background:"#0f172a",zIndex:1}}>{h}</th>)}</tr></thead>
            <tbody>{[...rb].reverse().map((r,ri)=>(
              <tr key={r.no} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
                <td style={{padding:"8px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{r.no}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={r.holder} size={16}/></td>
                <td style={{padding:"8px 10px",textAlign:"right",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{r.gained}</td>
                <td style={{padding:"8px 10px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{r.days?<span style={{color:r.days>=365?"#FFB612":r.days>=100?"#169B62":"#C5CDD8",fontWeight:r.days>=365?700:400}}>{r.days.toLocaleString()}</span>:<span style={{color:"#94a3b8"}}>current</span>}</td>
                <td style={{padding:"8px 10px",textAlign:"right",color:"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{r.matches||<span style={{color:"#94a3b8"}}>{"\u2014"}</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>}

    {sub==="records"&&<div>
      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Longest Reigns (Days)" icon={"\u23f3"}>
          <MT headers={["#","Holder","Gained","Days","Defences"]}
            rows={longestReigns.map((r,i)=>[i+1,<TeamLabel team={r.holder} size={16}/>,r.gained,<span style={{fontWeight:700,color:"#FFB612"}}>{r.days.toLocaleString()}</span>,r.matches])}/>
        </Card>
        <Card title="Most Defences (Single Reign)" icon={"\u2694\ufe0f"}>
          <MT headers={["#","Holder","Gained","Defences","Days"]}
            rows={mostDefences.map((r,i)=>[i+1,<TeamLabel team={r.holder} size={16}/>,r.gained,<span style={{fontWeight:700,color:"#D4213D"}}>{r.matches}</span>,r.days.toLocaleString()])}/>
        </Card>
      </div>
      {/* Shortest reigns */}
      <Card title="Shortest Reigns (Days)" icon={"\u26a1"}>
        <MT headers={["#","Holder","Gained","Days","Defences"]}
          rows={[...rb].filter(r=>r.days>0).sort((a,b)=>a.days-b.days).slice(0,15).map((r,i)=>[i+1,<TeamLabel team={r.holder} size={16}/>,r.gained,<span style={{fontWeight:700,color:"#D4213D"}}>{r.days}</span>,r.matches])}/>
      </Card>
    </div>}

    {sub==="timeline"&&<div>
      <Card title="Shield Holders by Decade" icon={"\u23f3"} style={{marginBottom:24}}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={decadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
            <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            {allTeams.filter(t=>teamStats.find(s=>s.team===t)?.reigns>=3).map(t=><Bar key={t} dataKey={t} fill={TC[t]||"#7A8BA8"} stackId="a"/>)}
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Recent transfers */}
      <Card title="Recent Shield Transfers (Last 30)" icon={"\ud83d\udd04"}>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[...recentTransfers].reverse().map((r,i)=>{
            const prev = i<recentTransfers.length-1?[...recentTransfers].reverse()[i+1]:null;
            return(<div key={r.no} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderBottom:"1px solid rgba(255,255,255,0.03)",background:i%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
              <span style={{fontSize:11,color:"#94a3b8",width:28,textAlign:"right",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>#{r.no}</span>
              <FlagBadge team={r.holder} size={20}/>
              <span style={{fontWeight:600,color:"#F5F7FA",minWidth:100}}>{r.holder}</span>
              <span style={{fontSize:11,color:"#7A8BA8"}}>{r.gained}</span>
              <span style={{marginLeft:"auto",fontSize:11,color:r.days>=365?"#FFB612":r.days>=100?"#169B62":"#7A8BA8",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{r.days?r.days+" days":"current"}</span>
              {r.matches>0&&<span style={{padding:"2px 8px",borderRadius:10,background:"rgba(212,33,61,0.12)",color:"#D4213D",fontSize:10,fontWeight:600}}>{r.matches} def</span>}
            </div>);
          })}
        </div>
      </Card>
    </div>}
  </div>);
}

function WorldCup({wc}){
  const years = [...new Set(wc.map(m=>m.year))].sort();
  const [selYear, setSelYear] = useState(years[years.length-1]||2027);
  const ym = wc.filter(m=>m.year===selYear);
  const played = ym.filter(m=>m.hs!==null);
  const upcoming = ym.filter(m=>m.hs===null);
  const pools = [...new Set(ym.filter(m=>m.group).map(m=>m.group))].sort();
  const knockouts = ym.filter(m=>!m.group || m.round==="Quarter Finals"||m.round==="Semi Finals"||m.round==="Finals");
  const koPlayed = knockouts.filter(m=>m.hs!==null);

  // Build pool tables
  const poolTables = useMemo(()=>{
    return pools.map(pool=>{
      const ms = ym.filter(m=>m.group===pool && m.hs!==null);
      const teams = {};
      ms.forEach(m=>{
        [m.home,m.away].forEach(t=>{if(!teams[t])teams[t]={team:t,p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0,pts:0};});
        teams[m.home].p++;teams[m.away].p++;
        teams[m.home].pf+=m.hs;teams[m.home].pa+=m.as;
        teams[m.away].pf+=m.as;teams[m.away].pa+=m.hs;
        if(m.hs>m.as){teams[m.home].w++;teams[m.away].l++;}
        else if(m.hs<m.as){teams[m.away].w++;teams[m.home].l++;}
        else{teams[m.home].d++;teams[m.away].d++;}
      });
      // Also add teams from unplayed matches
      ym.filter(m=>m.group===pool).forEach(m=>{
        [m.home,m.away].forEach(t=>{if(!teams[t])teams[t]={team:t,p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0,pts:0};});
      });
      Object.values(teams).forEach(t=>{t.pd=t.pf-t.pa;t.pts=t.w*4+t.d*2+t.bp;});
      const sorted = Object.values(teams).sort((a,b)=>b.pts-a.pts||b.pd-a.pd||b.pf-a.pf);
      return {pool,teams:sorted,matches:ms};
    });
  },[ym,pools]);

  // Team stats across all WC played matches
  const teamWCStats = useMemo(()=>{
    const allPlayed = wc.filter(m=>m.hs!==null);
    const tmap = {};
    allPlayed.forEach(m=>{
      [m.home,m.away].forEach(t=>{if(!tmap[t])tmap[t]={team:t,p:0,w:0,d:0,l:0,pf:0,pa:0};});
      tmap[m.home].p++;tmap[m.away].p++;
      tmap[m.home].pf+=m.hs;tmap[m.home].pa+=m.as;
      tmap[m.away].pf+=m.as;tmap[m.away].pa+=m.hs;
      if(m.hs>m.as){tmap[m.home].w++;tmap[m.away].l++;}
      else if(m.hs<m.as){tmap[m.away].w++;tmap[m.home].l++;}
      else{tmap[m.home].d++;tmap[m.away].d++;}
    });
    return Object.values(tmap).map(t=>({...t,pd:t.pf-t.pa,wp:t.p?+((t.w/t.p)*100).toFixed(1):0})).sort((a,b)=>b.wp-a.wp);
  },[wc]);

  // Venues for this tournament
  const venueStats = useMemo(()=>{
    const vmap={};
    played.forEach(m=>{
      if(!vmap[m.venue])vmap[m.venue]={venue:m.venue,matches:0,totalPts:0,homeW:0,awayW:0,draws:0};
      vmap[m.venue].matches++;vmap[m.venue].totalPts+=m.hs+m.as;
      if(m.hs>m.as)vmap[m.venue].homeW++;else if(m.as>m.hs)vmap[m.venue].awayW++;else vmap[m.venue].draws++;
    });
    return Object.values(vmap).sort((a,b)=>b.matches-a.matches);
  },[played]);

  // Finals results
  const finals = wc.filter(m=>m.round==="Finals"&&m.hs!==null);
  const winners = finals.map(m=>({year:m.year,winner:m.hs>m.as?m.home:m.away,loser:m.hs>m.as?m.away:m.home,score:Math.max(m.hs,m.as)+"-"+Math.min(m.hs,m.as)}));

  const [sub,setSub]=useState("pools");

  return(<div>
    {/* Year selector + header */}
    <div className="fade-in" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:28}}>{"\ud83c\udf0d"}</span>
        <div>
          <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#F5F7FA"}}>Rugby World Cup</h2>
          <p style={{margin:0,fontSize:12,color:"#94a3b8"}}>{played.length} matches played {upcoming.length>0?"\u00b7 "+upcoming.length+" upcoming":""}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {years.map(y=>(
          <button key={y} onClick={()=>setSelYear(y)}
            style={{padding:"8px 18px",fontSize:13,fontWeight:selYear===y?700:400,color:selYear===y?"#F5F7FA":"#5A6A82",background:selYear===y?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(selYear===y?"rgba(212,160,23,0.3)":"rgba(255,255,255,0.06)"),borderRadius:10,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.03em"}}>{y}</button>
        ))}
      </div>
    </div>

    {/* Key stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total WC Matches" value={played.length} icon={"\ud83c\udfc9"}/>
      <SB label={selYear+" Matches"} value={ym.length} sub={played.length>0?(played.length+" played"):(upcoming.length+" scheduled")}/>
      <SB label="Avg Points/Match" value={played.length?((played.reduce((s,m)=>s+m.hs+m.as,0))/played.length).toFixed(1):"-"} icon={"\ud83d\udcca"}/>
      <SB label="Venues" value={venueStats.length} sub={selYear+" tournament"}/>
    </div>

    {/* Sub tabs */}
    <div className="rf-sub-tabs" style={{display:"flex",gap:6,marginBottom:24}}>
      {[{id:"pools",label:"Pool Stage",ic:"\ud83c\udfc6"},{id:"knockouts",label:"Knockouts",ic:"\u2694\ufe0f"},{id:"alltime",label:"All-Time WC Stats",ic:"\ud83d\udcca"},{id:"wcvenues",label:"WC Venues",ic:"\ud83c\udfdf\ufe0f"}].map(t=>(
        <button key={t.id} onClick={()=>setSub(t.id)}
          style={{padding:"10px 18px",fontSize:12.5,fontWeight:sub===t.id?600:400,color:sub===t.id?"#F5F7FA":"#5A6A82",background:sub===t.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.02)",border:"1px solid "+(sub===t.id?"rgba(212,160,23,0.3)":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{t.ic}</span>{t.label}</button>
      ))}
    </div>

    {sub==="pools"&&<div>
      {poolTables.length===0?<Card title="No pool data available"><p style={{color:"#5A6A82"}}>Pool matches for {selYear} have not been played yet.</p></Card>:
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))",gap:20}}>
        {poolTables.map(pt=>(
          <Card key={pt.pool} title={pt.pool} icon={"\ud83c\udfc9"}>
            <MT headers={["#","Team","P","W","D","L","PF","PA","PD","Pts"]}
              rows={pt.teams.map((t,i)=>[i+1,<TeamLabel team={t.team} size={16}/>,t.p,t.w,t.d,t.l,t.pf,t.pa,<span style={{color:t.pd>0?"#169B62":t.pd<0?"#D4213D":"#7A8BA8"}}>{t.pd>0?"+":""}{t.pd}</span>,<span style={{fontWeight:700,color:i<2?"#FFB612":"#7A8BA8"}}>{t.pts}</span>])}/>
            {pt.matches.length>0&&<div style={{marginTop:12,fontSize:11,color:"#4A5A74"}}>{pt.matches.length} matches played</div>}
          </Card>
        ))}
      </div>}
      {/* Pool match results */}
      {played.filter(m=>m.group).length>0&&<Card title={"Pool Results \u2014 "+selYear} style={{marginTop:24}}>
        <MT headers={["Date","Pool","Home","Score","Away","Venue"]}
          rows={played.filter(m=>m.group).map(m=>[m.date.split(" ")[0],m.group,<TeamLabel team={m.home} size={14}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={14}/>,<span style={{fontSize:11,color:"#94a3b8"}}>{m.venue}</span>])}/>
      </Card>}
      {upcoming.filter(m=>m.group).length>0&&<Card title={"Upcoming Pool Matches \u2014 "+selYear} style={{marginTop:24}}>
        <MT headers={["Date","Pool","Home","vs","Away","Venue"]}
          rows={upcoming.filter(m=>m.group).map(m=>[m.date.split(" ")[0],m.group,<TeamLabel team={m.home} size={14}/>,<span style={{color:"#94a3b8"}}>vs</span>,<TeamLabel team={m.away} size={14}/>,<span style={{fontSize:11,color:"#94a3b8"}}>{m.venue}</span>])}/>
      </Card>}
    </div>}

    {sub==="knockouts"&&<div>
      {koPlayed.length===0?<Card title="Knockout Stage"><p style={{color:"#5A6A82"}}>Knockout matches for {selYear} have not been played yet.</p></Card>:
      <div>
        {winners.filter(w=>w.year===selYear).length>0&&<div className="fade-in" style={{textAlign:"center",padding:"32px 24px",marginBottom:24,background:"linear-gradient(135deg,rgba(255,182,18,0.08),rgba(212,33,61,0.08))",borderRadius:16,border:"1px solid rgba(255,182,18,0.15)"}}>
          <div style={{fontSize:13,color:"#FFB612",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{"\ud83c\udfc6"} {selYear} World Cup Champion</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            <FlagBadge team={winners.find(w=>w.year===selYear)?.winner} size={40}/>
            <span style={{fontSize:36,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:"#F5F7FA"}}>{winners.find(w=>w.year===selYear)?.winner}</span>
          </div>
          <div style={{fontSize:14,color:"#7A8BA8",marginTop:8}}>defeated {winners.find(w=>w.year===selYear)?.loser} {winners.find(w=>w.year===selYear)?.score}</div>
        </div>}
        <Card title={"Knockout Results \u2014 "+selYear}>
          <MT headers={["Round","Home","Score","Away","Venue"]}
            rows={koPlayed.filter(m=>m.year===selYear).map(m=>[<span style={{fontWeight:600,color:m.round==="Finals"?"#FFB612":"#C5CDD8"}}>{m.round}</span>,<TeamLabel team={m.home} size={16}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={16}/>,<span style={{fontSize:11,color:"#94a3b8"}}>{m.venue}</span>])}/>
        </Card>
      </div>}
      {/* All finals history */}
      {winners.length>0&&<Card title="World Cup Finals History" style={{marginTop:24}}>
        <MT headers={["Year","Champion","Runner-Up","Score"]}
          rows={winners.map(w=>[w.year,<TeamLabel team={w.winner} size={16}/>,<TeamLabel team={w.loser} size={16}/>,w.score])}/>
      </Card>}
    </div>}

    {sub==="alltime"&&<div>
      <Card title="All-Time World Cup Records (2019 & 2023)" style={{marginBottom:24}}>
        <div style={{overflowX:"auto"}}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["#","Team","P","W","D","L","Win%","PF","PA","PD"].map((h,i)=><th key={i} style={{padding:"10px 10px",textAlign:i<2?"left":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
            <tbody>{teamWCStats.filter(t=>t.p>=3).map((t,ri)=>(
              <tr key={t.team} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
                <td style={{padding:"8px 10px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={16}/></td>
                {[t.p,t.w,t.d,t.l,t.wp+"%",t.pf,t.pa,t.pd>0?"+"+t.pd:t.pd].map((v,ci)=>(
                  <td key={ci} style={{padding:"8px 10px",textAlign:"right",color:ci===4?(t.wp>=60?"#169B62":"#C5CDD8"):ci===7?(t.pd>0?"#169B62":"#D4213D"):"#C5CDD8",fontWeight:ci===4?600:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{v}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <Card title="WC Win Rate by Team (%)">
          <ResponsiveContainer width="100%" height={Math.max(200,teamWCStats.filter(t=>t.p>=3).length*30)}>
            <BarChart data={teamWCStats.filter(t=>t.p>=3)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" domain={[0,100]} tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
              <Bar dataKey="wp" name="Win %" radius={[0,4,4,0]}>
                {teamWCStats.filter(t=>t.p>=3).map((e,i)=><Cell key={i} fill={TC[e.team]||"#7A8BA8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Top WC Scorers (Points For)">
          <ResponsiveContainer width="100%" height={Math.max(200,teamWCStats.filter(t=>t.p>=3).length*30)}>
            <BarChart data={[...teamWCStats].filter(t=>t.p>=3).sort((a,b)=>b.pf-a.pf)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="pf" name="Points For" fill="#169B62" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>}

    {sub==="wcvenues"&&<div>
      <Card title={selYear+" Tournament Venues"}>
        {venueStats.length===0?<p style={{color:"#5A6A82"}}>No matches played yet at {selYear} venues.</p>:
        <MT headers={["Venue","Matches","Total Pts","Avg Pts","Home W","Away W","Draws"]}
          rows={venueStats.map(v=>[<span style={{fontWeight:600}}>{v.venue}</span>,v.matches,v.totalPts,(v.totalPts/v.matches).toFixed(1),v.homeW,v.awayW,v.draws])}/>}
      </Card>
    </div>}
  </div>);
}

function Venues({intl}){
  const [minMatches,setMinMatches]=useState(10);
  const venueData = useMemo(()=>{
    const vmap={};
    intl.forEach(m=>{
      if(!m.stadium) return;
      const v=m.stadium;
      if(!vmap[v])vmap[v]={venue:v,city:m.city||"",matches:0,pf:0,pa:0,homeW:0,awayW:0,draws:0,teams:new Set(),firstDate:"",lastDate:""};
      vmap[v].matches++;
      vmap[v].pf+=m.hs+m.as;
      vmap[v].teams.add(m.home);vmap[v].teams.add(m.away);
      if(!vmap[v].firstDate||m.date<vmap[v].firstDate)vmap[v].firstDate=m.date;
      if(!vmap[v].lastDate||m.date>vmap[v].lastDate)vmap[v].lastDate=m.date;
      if(m.hs>m.as)vmap[v].homeW++;else if(m.as>m.hs)vmap[v].awayW++;else vmap[v].draws++;
    });
    return Object.values(vmap).map(v=>({...v,avgPts:(v.pf/v.matches).toFixed(1),homePct:((v.homeW/v.matches)*100).toFixed(1),teamCount:v.teams.size})).sort((a,b)=>b.matches-a.matches);
  },[intl]);

  const filtered = venueData.filter(v=>v.matches>=minMatches);
  const totalVenues = venueData.length;
  const topVenue = filtered[0];
  const highestScoring = [...filtered].sort((a,b)=>b.avgPts-a.avgPts)[0];
  const bestHomeAdv = [...filtered].sort((a,b)=>b.homePct-a.homePct)[0];

  // City stats
  const cityData = useMemo(()=>{
    const cmap={};
    intl.forEach(m=>{
      if(!m.city) return;
      if(!cmap[m.city])cmap[m.city]={city:m.city,matches:0};
      cmap[m.city].matches++;
    });
    return Object.values(cmap).sort((a,b)=>b.matches-a.matches).slice(0,15);
  },[intl]);

  return(<div>
    <div className="fade-in" style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
      <span style={{fontSize:28}}>{"\ud83c\udfdf\ufe0f"}</span>
      <div>
        <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#F5F7FA"}}>Venues & Stadiums</h2>
        <p style={{margin:0,fontSize:12,color:"#94a3b8"}}>{totalVenues} unique venues across {intl.length} matches</p>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Venues" value={totalVenues} icon={"\ud83c\udfdf\ufe0f"}/>
      <SB label="Most Used" value={topVenue?.venue||"-"} sub={topVenue?.matches+" matches"} color="#D4213D"/>
      <SB label="Highest Scoring" value={highestScoring?.venue||"-"} sub={highestScoring?.avgPts+" avg pts"} color="#FFB612"/>
      <SB label="Best Home Advantage" value={bestHomeAdv?.venue||"-"} sub={bestHomeAdv?.homePct+"% home wins"} color="#169B62"/>
    </div>

    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      <span style={{fontSize:12,color:"#5A6A82"}}>Minimum matches:</span>
      {[5,10,20,30,50].map(n=>(
        <button key={n} onClick={()=>setMinMatches(n)}
          style={{padding:"5px 12px",fontSize:11,fontWeight:minMatches===n?600:400,color:minMatches===n?"#F5F7FA":"#5A6A82",background:minMatches===n?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.02)",border:"1px solid "+(minMatches===n?"rgba(212,160,23,0.25)":"rgba(255,255,255,0.05)"),borderRadius:6,cursor:"pointer"}}>{n}+</button>
      ))}
    </div>

    <Card title={"Venue Leaderboard ("+filtered.length+" venues with "+minMatches+"+ matches)"} style={{marginBottom:24}}>
      <div style={{overflowX:"auto"}}>
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["#","Venue","City","Matches","Total Pts","Avg Pts","Home W","Away W","Draws","Home %","Teams","Active"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#5A6A82",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((v,ri)=>(
            <tr key={v.venue} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.012)"}}>
              <td style={{padding:"8px 8px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
              <td style={{padding:"8px 8px",fontWeight:600,color:"#F5F7FA",borderBottom:"1px solid rgba(255,255,255,0.03)",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.venue}</td>
              <td style={{padding:"8px 8px",color:"#7A8BA8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{v.city}</td>
              {[v.matches,v.pf,v.avgPts,v.homeW,v.awayW,v.draws,v.homePct+"%",v.teamCount,v.firstDate.split("-")[0]+"\u2013"+v.lastDate.split("-")[0]].map((val,ci)=>(
                <td key={ci} style={{padding:"8px 8px",textAlign:"right",color:ci===5?(+v.homePct>=60?"#169B62":"#C5CDD8"):"#C5CDD8",borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{val}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>

    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Avg Points Per Match by Venue (Top 15)">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={[...filtered].sort((a,b)=>b.avgPts-a.avgPts).slice(0,15)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
            <YAxis type="category" dataKey="venue" tick={{fill:"#7A8BA8",fontSize:9}} width={130}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="avgPts" name="Avg Pts" fill="#D4213D" radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Home Win % by Venue (Top 15)">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={[...filtered].sort((a,b)=>b.homePct-a.homePct).slice(0,15)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis type="number" domain={[0,100]} tick={{fill:"#7A8BA8",fontSize:11}}/>
            <YAxis type="category" dataKey="venue" tick={{fill:"#7A8BA8",fontSize:9}} width={130}/>
            <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
            <Bar dataKey="homePct" name="Home Win %" radius={[0,4,4,0]}>
              {[...filtered].sort((a,b)=>b.homePct-a.homePct).slice(0,15).map((v,i)=><Cell key={i} fill={+v.homePct>=65?"#169B62":+v.homePct>=50?"#FFB612":"#D4213D"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card title="Top Cities by Match Count">
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={cityData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
          <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
          <YAxis type="category" dataKey="city" tick={{fill:"#7A8BA8",fontSize:10}} width={100}/>
          <Tooltip contentStyle={ttStyle}/>
          <Bar dataKey="matches" name="Matches" fill="#0066CC" radius={[0,4,4,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </Card>

    {/* Fortress Stats — Each Six Nations team's primary home ground */}
    <Card title="Fortress Stats — Home Ground Records" icon={"\ud83c\udff0"} style={{marginTop:24}}>
      <p style={{fontSize:12,color:"#94a3b8",marginBottom:16}}>Win records for each Six Nations team at their primary home venues (minimum 10 home matches at venue)</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
        {(()=>{
          const fortresses=[];
          const sixN=["England","France","Ireland","Italy","Scotland","Wales"];
          sixN.forEach(team=>{
            const homeMatches=intl.filter(m=>m.home===team&&m.stadium);
            const byVenue={};
            homeMatches.forEach(m=>{
              const v=m.stadium;
              if(!byVenue[v])byVenue[v]={venue:v,w:0,l:0,d:0,total:0,pf:0,pa:0,first:"",last:""};
              byVenue[v].total++;byVenue[v].pf+=m.hs;byVenue[v].pa+=m.as;
              if(m.hs>m.as)byVenue[v].w++;else if(m.as>m.hs)byVenue[v].l++;else byVenue[v].d++;
              if(!byVenue[v].first||m.date<byVenue[v].first)byVenue[v].first=m.date;
              if(!byVenue[v].last||m.date>byVenue[v].last)byVenue[v].last=m.date;
            });
            const top=Object.values(byVenue).filter(v=>v.total>=10).sort((a,b)=>b.total-a.total)[0];
            if(top)fortresses.push({team,...top,winPct:((top.w/top.total)*100).toFixed(1)});
          });
          return fortresses.map((f,i)=>(
            <div key={i} style={{padding:16,borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Flag team={f.team} size={24}/>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#f8fafc",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase"}}>{f.team}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{f.venue}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,textAlign:"center"}}>
                <div><div style={{fontSize:18,fontWeight:700,color:"#3ddc84",fontFamily:"'JetBrains Mono',monospace"}}>{f.winPct}%</div><div style={{fontSize:9,color:"#94a3b8"}}>WIN RATE</div></div>
                <div><div style={{fontSize:14,fontWeight:600,color:"#C5CDD8",fontFamily:"'JetBrains Mono',monospace"}}>{f.w}W</div><div style={{fontSize:9,color:"#94a3b8"}}>WINS</div></div>
                <div><div style={{fontSize:14,fontWeight:600,color:"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{f.l}L</div><div style={{fontSize:9,color:"#94a3b8"}}>LOSSES</div></div>
                <div><div style={{fontSize:14,fontWeight:600,color:"#C5CDD8",fontFamily:"'JetBrains Mono',monospace"}}>{f.total}</div><div style={{fontSize:9,color:"#94a3b8"}}>MATCHES</div></div>
              </div>
              <div style={{marginTop:8,display:"flex",height:6,borderRadius:3,overflow:"hidden"}}>
                <div style={{width:(f.w/f.total*100)+"%",background:"#169B62"}}/>
                <div style={{width:(f.d/f.total*100)+"%",background:"#d4a017"}}/>
                <div style={{width:(f.l/f.total*100)+"%",background:"#D4213D"}}/>
              </div>
              <div style={{fontSize:10,color:"#64748b",marginTop:6}}>{f.first.slice(0,4)}–{f.last.slice(0,4)}</div>
            </div>
          ));
        })()}
      </div>
    </Card>
  </div>);
}

function AllResults({intl}){
  const [page,setPage]=useState(0);
  const [teamFilter,setTeamFilter]=useState("All");
  const [sortDir,setSortDir]=useState("desc");
  const perPage=50;
  const filtered=useMemo(()=>{
    let d=intl;
    if(teamFilter!=="All")d=d.filter(m=>m.home===teamFilter||m.away===teamFilter);
    return sortDir==="desc"?[...d].reverse():d;
  },[intl,teamFilter,sortDir]);
  const totalPages=Math.ceil(filtered.length/perPage);
  const pageData=filtered.slice(page*perPage,(page+1)*perPage);
  const safeP=Math.min(page,totalPages-1);
  if(safeP!==page&&totalPages>0)setPage(safeP);

  // ── ANALYSIS ──
  const teamStats=useMemo(()=>{
    return TA.map(team=>{
      const ms=intl.filter(m=>m.home===team||m.away===team);
      let w=0,d=0,l=0,pf=0,pa=0,hw=0,aw=0,bigW=0,bigWOpp="",bigWDate="",maxStreak=0,curStreak=0,maxLStreak=0,lStreak=0;
      ms.forEach(m=>{
        const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;
        pf+=s;pa+=c;
        if(s>c){w++;if(isH)hw++;else aw++;curStreak++;if(curStreak>maxStreak)maxStreak=curStreak;lStreak=0;if(s-c>bigW){bigW=s-c;bigWOpp=isH?m.away:m.home;bigWDate=m.date;}}
        else if(s<c){l++;lStreak++;if(lStreak>maxLStreak)maxLStreak=lStreak;curStreak=0;}
        else{d++;curStreak=0;lStreak=0;}
      });
      return{team,played:ms.length,w,d,l,pf,pa,pd:pf-pa,wp:ms.length?+((w/ms.length)*100).toFixed(1):0,hw,aw,bigW,bigWOpp,bigWDate,maxStreak,maxLStreak,avgPF:ms.length?+(pf/ms.length).toFixed(1):0,avgPA:ms.length?+(pa/ms.length).toFixed(1):0};
    }).sort((a,b)=>b.wp-a.wp);
  },[intl]);

  const decadeData=useMemo(()=>{
    const decades={};
    intl.forEach(m=>{
      const yr=+m.date.split("-")[0];const dec=Math.floor(yr/10)*10;
      if(!decades[dec])decades[dec]={decade:dec+"s",matches:0,totalPts:0,homeW:0,awayW:0,draws:0};
      decades[dec].matches++;decades[dec].totalPts+=m.hs+m.as;
      if(m.hs>m.as)decades[dec].homeW++;else if(m.as>m.hs)decades[dec].awayW++;else decades[dec].draws++;
    });
    return Object.values(decades).sort((a,b)=>a.decade.localeCompare(b.decade)).map(d=>({...d,avgPts:+(d.totalPts/d.matches).toFixed(1),homePct:+(d.homeW/d.matches*100).toFixed(1)}));
  },[intl]);

  const topWins=useMemo(()=>[...intl].map(m=>({...m,margin:Math.abs(m.hs-m.as),winner:m.hs>m.as?m.home:m.away,loser:m.hs>m.as?m.away:m.home,wScore:Math.max(m.hs,m.as),lScore:Math.min(m.hs,m.as)})).filter(m=>m.margin>0).sort((a,b)=>b.margin-a.margin).slice(0,10),[intl]);
  const topScoring=useMemo(()=>[...intl].sort((a,b)=>(b.hs+b.as)-(a.hs+a.as)).slice(0,10),[intl]);
  const highestScores=useMemo(()=>{const sc=[];intl.forEach(m=>{sc.push({team:m.home,score:m.hs,opp:m.away,date:m.date});sc.push({team:m.away,score:m.as,opp:m.home,date:m.date});});return sc.sort((a,b)=>b.score-a.score).slice(0,10);},[intl]);

  const draws=intl.filter(m=>m.hs===m.as).length;
  const homeWins=intl.filter(m=>m.hs>m.as).length;
  const awayWins=intl.filter(m=>m.as>m.hs).length;
  const totalPts=intl.reduce((s,m)=>s+m.hs+m.as,0);

  const [view,setView]=useState("analysis");

  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:24}}>
      {[{id:"analysis",label:"\ud83d\udcca Analysis"},{id:"table",label:"\ud83d\udcdc Full Results Table"}].map(t=>(
        <button key={t.id} onClick={()=>setView(t.id)}
          style={{padding:"8px 20px",fontSize:13,fontWeight:view===t.id?600:400,color:view===t.id?"#F5F7FA":"#7A8BA8",background:view===t.id?"rgba(26,95,58,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(view===t.id?"rgba(212,160,23,0.3)":"rgba(255,255,255,0.06)"),borderRadius:8,cursor:"pointer"}}>{t.label}</button>
      ))}
    </div>

    {view==="analysis"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
        <SB label="Total Matches" value={intl.length} sub={"Since "+intl[0]?.date?.split("-")[0]}/>
        <SB label="Total Points Scored" value={totalPts.toLocaleString()} sub={"Avg "+(totalPts/intl.length).toFixed(1)+" per match"}/>
        <SB label="Home Wins" value={homeWins} sub={(homeWins/intl.length*100).toFixed(1)+"%"} color="#169B62"/>
        <SB label="Away Wins" value={awayWins} sub={(awayWins/intl.length*100).toFixed(1)+"%"} color="#D4213D"/>
        <SB label="Draws" value={draws} sub={(draws/intl.length*100).toFixed(1)+"%"}/>
      </div>

      <Card title="All-Time International Leaderboard" style={{marginBottom:24}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["#","Team","P","W","D","L","Win%","PF","PA","PD","Avg PF","Avg PA","Best Streak","Worst Streak"].map((h,i)=><th key={i} style={{padding:"8px 8px",textAlign:i<2?"left":"right",color:"#7A8BA8",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:11}}>{h}</th>)}</tr></thead>
            <tbody>{teamStats.map((t,ri)=>(
              <tr key={t.team} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
                <td style={{padding:"7px 8px",color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{ri+1}</td>
                <td style={{padding:"7px 8px",fontWeight:600,color:"#F5F7FA",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={18}/></td>
                {[t.played,t.w,t.d,t.l,t.wp+"%",t.pf,t.pa,t.pd>0?"+"+t.pd:t.pd,t.avgPF,t.avgPA,t.maxStreak+"W",t.maxLStreak+"L"].map((v,ci)=>(
                  <td key={ci} style={{padding:"7px 8px",textAlign:"right",color:ci===4?(t.wp>=60?"#169B62":t.wp>=50?"#C5CDD8":"#D4213D"):ci===7?(t.pd>0?"#169B62":"#D4213D"):"#C5CDD8",fontWeight:ci===4?600:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{v}</td>
                ))}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Win Rate Comparison (%)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={teamStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" domain={[0,100]} tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={90}/>
              <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
              <Bar dataKey="wp" name="Win %" radius={[0,4,4,0]}>
                {teamStats.map((e,i)=><Cell key={i} fill={TC[e.team]||"#7A8BA8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Home Wins vs Away Wins by Team">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={teamStats.map(t=>({team:t.team,home:t.hw,away:t.aw}))} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={90}/>
              <Tooltip contentStyle={ttStyle}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="home" name="Home Wins" fill="#169B62" stackId="a" barSize={14}/>
              <Bar dataKey="away" name="Away Wins" fill="#FFB612" stackId="a" barSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Most Losses (All-Time)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[...teamStats].sort((a,b)=>b.l-a.l)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={90}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="l" name="Losses" fill="#D4213D" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="All-Time Point Differential">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[...teamStats].sort((a,b)=>b.pd-a.pd)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis type="number" tick={{fill:"#7A8BA8",fontSize:11}}/>
              <YAxis type="category" dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}} width={90}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="pd" name="Point Diff" radius={[0,4,4,0]}>
                {[...teamStats].sort((a,b)=>b.pd-a.pd).map((e,i)=><Cell key={i} fill={e.pd>=0?"#169B62":"#D4213D"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Average Points Per Match by Decade">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={decadeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="avgPts" name="Avg Total Pts" fill="#D4213D" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Home Win % by Decade">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={decadeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}} domain={[0,100]}/>
              <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
              <Line type="monotone" dataKey="homePct" name="Home Win %" stroke="#169B62" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Biggest Victories of All Time">
          <MT headers={["Date","Winner","Loser","Score","Margin"]}
            rows={topWins.map(m=>[m.date,<TeamLabel team={m.winner} size={16}/>,<TeamLabel team={m.loser} size={16}/>,m.wScore+"-"+m.lScore,"+"+m.margin])}/>
        </Card>
        <Card title="Highest Scoring Matches">
          <MT headers={["Date","Home","Away","Score","Total"]}
            rows={topScoring.map(m=>[m.date,<TeamLabel team={m.home} size={16}/>,<TeamLabel team={m.away} size={16}/>,m.hs+"-"+m.as,m.hs+m.as])}/>
        </Card>
      </div>

      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Highest Individual Team Scores">
          <MT headers={["Team","Score","vs","Date"]}
            rows={highestScores.map(s=>[<TeamLabel team={s.team} size={16}/>,s.score,<TeamLabel team={s.opp} size={16}/>,s.date])}/>
        </Card>
        <Card title="Matches Played by Decade">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={decadeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="matches" name="Matches" fill="#0066CC" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>}

    {view==="table"&&<div>
    <Card title={"All International Results ("+intl.length+" matches)"}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:"#7A8BA8"}}>Filter by team:</span>
        <select value={teamFilter} onChange={e=>{setTeamFilter(e.target.value);setPage(0);}} style={{background:"#1e293b",color:"#E8ECF1",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:13}}>
          <option value="All">All Teams</option>
          {TA.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{fontSize:13,color:"#7A8BA8"}}>Sort:</span>
        <select value={sortDir} onChange={e=>{setSortDir(e.target.value);setPage(0);}} style={{background:"#1e293b",color:"#E8ECF1",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:13}}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <span style={{fontSize:13,color:"#94a3b8"}}>{filtered.length} matches</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr>{["Date","Home","Score","Away","Result"].map((h,i)=><th key={i} style={{padding:"8px 10px",textAlign:i===2?"center":"left",color:"#7A8BA8",fontWeight:500,borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:11,position:"sticky",top:0,background:"#0f172a"}}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pageData.map((m,ri)=>{
              const hw=m.hs>m.as;const aw=m.as>m.hs;const dr=m.hs===m.as;
              return(<tr key={ri} style={{background:ri%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
                <td style={{padding:"7px 10px",color:"#7A8BA8",borderBottom:"1px solid rgba(255,255,255,0.03)",whiteSpace:"nowrap"}}>{m.date}</td>
                <td style={{padding:"7px 10px",color:hw?"#F5F7FA":"#7A8BA8",fontWeight:hw?600:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><Flag team={m.home} size={16}/>{m.home}</span></td>
                <td style={{padding:"7px 10px",textAlign:"center",color:"#F5F7FA",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)",fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace"}}>{m.hs+" - "+m.as}</td>
                <td style={{padding:"7px 10px",color:aw?"#F5F7FA":"#7A8BA8",fontWeight:aw?600:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><Flag team={m.away} size={16}/>{m.away}</span></td>
                <td style={{padding:"7px 10px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,background:dr?"rgba(122,139,168,0.2)":hw?"rgba(22,155,98,0.15)":"rgba(212,33,61,0.15)",color:dr?"#7A8BA8":hw?"#169B62":"#D4213D"}}>{dr?"Draw":hw?"Home Win":"Away Win"}</span></td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      {totalPages>1&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:16}}>
        <button onClick={()=>setPage(0)} disabled={page===0} style={{padding:"6px 12px",fontSize:12,background:"rgba(255,255,255,0.05)",color:page===0?"#556B8A":"#C5CDD8",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,cursor:page===0?"default":"pointer"}}>{"\u00ab"}</button>
        <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} style={{padding:"6px 12px",fontSize:12,background:"rgba(255,255,255,0.05)",color:page===0?"#556B8A":"#C5CDD8",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,cursor:page===0?"default":"pointer"}}>{"\u2039 Prev"}</button>
        <span style={{fontSize:12,color:"#7A8BA8",padding:"0 8px"}}>Page {page+1} of {totalPages}</span>
        <button onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} style={{padding:"6px 12px",fontSize:12,background:"rgba(255,255,255,0.05)",color:page>=totalPages-1?"#556B8A":"#C5CDD8",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,cursor:page>=totalPages-1?"default":"pointer"}}>{"Next \u203a"}</button>
        <button onClick={()=>setPage(totalPages-1)} disabled={page>=totalPages-1} style={{padding:"6px 12px",fontSize:12,background:"rgba(255,255,255,0.05)",color:page>=totalPages-1?"#556B8A":"#C5CDD8",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,cursor:page>=totalPages-1?"default":"pointer"}}>{"\u00bb"}</button>
      </div>}
    </Card>
    </div>}
  </div>);
}

function Overview({intl,sn,champs,setTab}){
  const tc={};T6.forEach(t=>tc[t]=0);champs.forEach(c=>{if(tc[c.winner]!==undefined)tc[c.winner]++;});
  const gs=champs.filter(c=>c.gs);
  const io=TA.map(team=>{
    const ms=intl.filter(m=>m.home===team||m.away===team);
    let w=0,d=0,l=0;
    ms.forEach(m=>{const s=m.home===team?m.hs:m.as;const c=m.home===team?m.as:m.hs;if(s>c)w++;else if(s<c)l++;else d++;});
    return{team,played:ms.length,w,d,l,wp:ms.length?((w/ms.length)*100).toFixed(1):0};
  }).sort((a,b)=>b.wp-a.wp);

  // 2026 Six Nations live standings (computed from Fixtures data)
  const sn2026=[
    {home:"France",away:"Ireland",hs:36,as:14},{home:"Italy",away:"Scotland",hs:18,as:15},{home:"England",away:"Wales",hs:48,as:7},
    {home:"Ireland",away:"Italy",hs:20,as:13},{home:"Scotland",away:"England",hs:31,as:20},{home:"Wales",away:"France",hs:12,as:54},
    {home:"England",away:"Ireland",hs:21,as:42},{home:"Wales",away:"Scotland",hs:23,as:26},{home:"France",away:"Italy",hs:33,as:8},
    {home:"Ireland",away:"Wales",hs:27,as:17},{home:"Scotland",away:"France",hs:50,as:40},{home:"Italy",away:"England",hs:23,as:18},
    {home:"Ireland",away:"Scotland",hs:43,as:21},{home:"Wales",away:"Italy",hs:31,as:17},{home:"France",away:"England",hs:48,as:46},
  ];
  const liveStandings=useMemo(()=>{
    const t={};T6.forEach(x=>{t[x]={team:x,p:0,w:0,d:0,l:0,pf:0,pa:0,pts:0};});
    sn2026.forEach(m=>{
      t[m.home].p++;t[m.away].p++;t[m.home].pf+=m.hs;t[m.home].pa+=m.as;t[m.away].pf+=m.as;t[m.away].pa+=m.hs;
      if(m.hs>m.as){t[m.home].w++;t[m.away].l++;t[m.home].pts+=4;if(m.as>=m.hs-7)t[m.away].pts++;}
      else if(m.as>m.hs){t[m.away].w++;t[m.home].l++;t[m.away].pts+=4;if(m.hs>=m.as-7)t[m.home].pts++;}
      else{t[m.home].d++;t[m.away].d++;t[m.home].pts+=2;t[m.away].pts+=2;}
    });
    return Object.values(t).sort((a,b)=>b.pts-a.pts||(b.pf-b.pa)-(a.pf-a.pa));
  },[]);

  return(<div>
    {/* Live tournament banner */}
    <div className="fade-in" style={{padding:"20px 24px",borderRadius:12,background:"linear-gradient(135deg,rgba(26,95,58,0.12) 0%,rgba(30,58,138,0.08) 100%)",border:"1px solid rgba(26,95,58,0.2)",marginBottom:24,cursor:"pointer"}} onClick={()=>setTab("fixtures")}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:10,color:"var(--rf-gold)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"var(--ff-head)",marginBottom:4}}>2026 SIX NATIONS — COMPLETE</div>
          <div style={{fontSize:18,fontWeight:700,color:"var(--rf-text)",fontFamily:"var(--ff-head)",textTransform:"uppercase"}}>France retain title with last-gasp 48-46 win over England</div>
          <div style={{fontSize:12,color:"var(--rf-text-muted)",marginTop:4}}>Portugal stun Georgia 19-17 to win Rugby Europe Championship {"\u00b7"} 2027 Six Nations fixtures released →</div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {liveStandings.slice(0,3).map((t,i)=>(
            <div key={t.team} style={{padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,0.04)",textAlign:"center",minWidth:60}}>
              <Flag team={t.team} size={20}/>
              <div style={{fontSize:10,color:"var(--rf-text-muted)",marginTop:2}}>{t.pts} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quick stats */}
    <div className="grid-stat" style={{marginBottom:24}}>
      <SB label="International Matches" value={intl.length} sub="Since 1871"/>
      <SB label="Six Nations Matches" value={sn.length} sub={[...new Set(sn.map(m=>m.year))].length+" seasons"}/>
      <SB label="Grand Slams" value={gs.length} sub="Since 2000" color="#D4213D"/>
      <SB label="Oldest Match" value="1871" sub="Scotland v England"/>
    </div>

    {/* Quick links to key features */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:28}}>
      {[{id:"h2h",icon:"\u2694\ufe0f",label:"Head to Head",desc:"Compare any two teams"},{id:"grandslams",icon:"\ud83d\udc51",label:"Grand Slams",desc:"Computed from results"},{id:"upsets",icon:"\ud83e\udd2f",label:"Upset Index",desc:"Biggest shocks ever"},{id:"decades",icon:"\ud83d\udcc5",label:"Decades",desc:"150 years of data"},{id:"captains",icon:"\ud83e\uddd1\u200d\ud83c\udfeb",label:"Captains",desc:"Legendary leaders"},{id:"raeburn",icon:"\ud83d\udee1\ufe0f",label:"Raeburn Shield",desc:"Lineal championship"}].map(q=>(
        <div key={q.id} onClick={()=>setTab(q.id)} style={{padding:"14px 16px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid var(--rf-border)",cursor:"pointer",transition:"all 0.2s ease-out"}} className="card-hover">
          <span style={{fontSize:18}}>{q.icon}</span>
          <div style={{fontSize:12,fontWeight:600,color:"var(--rf-text)",marginTop:4,fontFamily:"var(--ff-head)",textTransform:"uppercase"}}>{q.label}</div>
          <div style={{fontSize:10,color:"var(--rf-text-muted)",marginTop:2}}>{q.desc}</div>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid-2 grid-auto" style={{marginBottom:24}}>
      <Card title={"Six Nations Titles (2000\u20132025)"}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={Object.entries(tc).map(([t,c])=>({team:t,titles:c})).sort((a,b)=>b.titles-a.titles)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="team" tick={{fill:"#94a3b8",fontSize:11}}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="titles" radius={[4,4,0,0]}>
              {Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t],i)=><Cell key={i} fill={TC[t]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="All-Time International Win Rate (%)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={io} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis type="number" tick={{fill:"#94a3b8",fontSize:11}} domain={[0,100]}/>
            <YAxis type="category" dataKey="team" tick={{fill:"#94a3b8",fontSize:11}} width={90}/>
            <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
            <Bar dataKey="wp" name="Win %" radius={[0,4,4,0]}>
              {io.map((e,i)=><Cell key={i} fill={TC[e.team]||"#94a3b8"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <div className="grid-2 grid-auto">
      <Card title="Grand Slams Since 2000">
        {gs.length===0?<div className="rf-empty"><div className="rf-empty-icon">{"\ud83c\udfc6"}</div><div className="rf-empty-text">No Grand Slams recorded</div></div>:
          <MT headers={["Year","Winner"]} rows={gs.map(g=>[g.year,<TeamLabel team={g.winner} size={18}/>])}/>}
      </Card>
      <Card title="2026 Six Nations Standings">
        <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["","Team","P","W","L","PD","Pts"].map((h,i)=><th key={i} style={{padding:"8px 6px",textAlign:i<2?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid var(--rf-border)",fontSize:10,textTransform:"uppercase",fontFamily:"var(--ff-head)"}}>{h}</th>)}</tr></thead>
          <tbody>{liveStandings.map((t,i)=>(
            <tr key={t.team}>
              <td style={{padding:"6px",fontWeight:700,color:i===0?"var(--rf-gold)":"#94a3b8",fontFamily:"var(--ff-mono)",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{i+1}</td>
              <td style={{padding:"6px",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={t.team} size={14}/></td>
              {[t.p,t.w,t.l,t.pf-t.pa,t.pts].map((v,j)=>(
                <td key={j} style={{padding:"6px",textAlign:"right",fontFamily:"var(--ff-mono)",color:j===4?"#3ddc84":j===3?(v>0?"#3ddc84":v<0?"#ef4444":"#C5CDD8"):"#C5CDD8",fontWeight:j===4?700:400,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{j===3&&v>0?"+":""}{v}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  </div>);
}

function FiveN({fn,fnby,fnChamps}){
  const [sy,setSy]=useState(fnby[fnby.length-1]?.year||1999);
  const yd=fnby.find(s=>s.year===sy);
  const yw=useMemo(()=>fnby.map(s=>{const r={year:s.year};s.table.forEach(([t,d])=>{r[t]=d.w;});return r;}),[fnby]);
  const avg=useMemo(()=>fnby.map(s=>{const tp=s.matches.reduce((sum,m)=>sum+m.hs+m.as,0);return{year:s.year,avg:+(tp/Math.max(s.matches.length,1)).toFixed(1)};}),[fnby]);
  const ha=useMemo(()=>{let hw=0,aw=0,dr=0;fn.forEach(m=>{if(m.hs>m.as)hw++;else if(m.hs<m.as)aw++;else dr++;});return[{name:"Home Wins",value:hw,color:"#169B62"},{name:"Away Wins",value:aw,color:"#D4213D"},{name:"Draws",value:dr,color:"#7A8BA8"}];},[fn]);
  const C5=["#C8102E","#002654","#169B62","#003078","#D4213D"];
  const ch=fnChamps.find(c=>c.year===sy);

  // Title counts
  const tc=useMemo(()=>{const r={};T5.forEach(t=>r[t]=0);fnChamps.forEach(c=>{if(r[c.winner]!==undefined)r[c.winner]++;});return r;},[fnChamps]);
  const gs=fnChamps.filter(c=>c.gs);

  // Top scoring matches
  const topScoring=useMemo(()=>[...fn].sort((a,b)=>(b.hs+b.as)-(a.hs+a.as)).slice(0,8),[fn]);

  // Decades data
  const decadeWins=useMemo(()=>{
    const decades={};
    fnby.forEach(s=>{
      const dec=Math.floor(s.year/10)*10+"s";
      if(!decades[dec])decades[dec]={decade:dec};
      T5.forEach(t=>{
        if(!decades[dec][t])decades[dec][t]=0;
        const td=s.table.find(([x])=>x===t);
        if(td)decades[dec][t]+=td[1].w;
      });
    });
    return Object.values(decades).sort((a,b)=>a.decade.localeCompare(b.decade));
  },[fnby]);

  return(<div>
    {/* Header */}
    <div className="fade-in" style={{display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
      <span style={{fontSize:28}}>{"\ud83c\udfdf\ufe0f"}</span>
      <div>
        <h2 style={{margin:0,fontSize:24,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#F5F7FA"}}>Five Nations Championship</h2>
        <p style={{margin:0,fontSize:12,color:"#94a3b8"}}>{fn.length} matches {"\u00b7"} 1910{"\u2013"}1999 {"\u00b7"} {fnby.length} seasons</p>
      </div>
    </div>

    {/* Key stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:28}}>
      <SB label="Total Matches" value={fn.length} icon={"\ud83c\udfc9"}/>
      <SB label="Seasons" value={fnby.length} sub="1910\u20131999"/>
      <SB label="Grand Slams" value={gs.length} color="#D4213D" icon={"\ud83c\udfc6"}/>
      <SB label="Total Points" value={fn.reduce((s,m)=>s+m.hs+m.as,0).toLocaleString()}/>
      <SB label="Avg Pts/Match" value={(fn.reduce((s,m)=>s+m.hs+m.as,0)/fn.length).toFixed(1)}/>
    </div>

    {/* Championship table */}
    <Card title="Championship Table" icon={"\ud83c\udfc6"} style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:"#5A6A82"}}>Season:</span>
        <select value={sy} onChange={e=>setSy(+e.target.value)} style={{background:"#1e293b",color:"#E8ECF1",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:13}}>
          {fnby.map(s=><option key={s.year} value={s.year}>{s.year}</option>)}
        </select>
        {ch&&<span style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span style={{color:"#FFB612"}}>{"\ud83c\udfc6"}</span><TeamLabel team={ch.winner} size={18}/>{ch.gs&&<span style={{padding:"2px 8px",borderRadius:12,background:"rgba(212,160,23,0.12)",color:"#D4213D",fontSize:10,fontWeight:600}}>Grand Slam</span>}</span>}
      </div>
      {yd&&<MT headers={["Pos","Team","P","W","D","L","PF","PA","PD","Pts"]}
        rows={yd.table.map(([team,d],i)=>[i+1,<TeamLabel team={team} size={18}/>,d.played,d.w,d.d,d.l,d.pf,d.pa,<span style={{color:d.pd>0?"#169B62":d.pd<0?"#D4213D":"#7A8BA8"}}>{d.pd>0?"+":""}{d.pd}</span>,<span style={{fontWeight:700}}>{d.pts}</span>])}/>}
    </Card>

    {/* Charts row 1 */}
    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Titles Won (1910\u20131999)" icon={"\ud83c\udfc6"}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={Object.entries(tc).map(([t,c])=>({team:t,titles:c})).sort((a,b)=>b.titles-a.titles)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis dataKey="team" tick={{fill:"#7A8BA8",fontSize:11}}/>
            <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Bar dataKey="titles" radius={[4,4,0,0]}>
              {Object.entries(tc).sort((a,b)=>b[1]-a[1]).map(([t],i)=><Cell key={i} fill={TC[t]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Home vs Away Advantage" icon={"\ud83c\udfe0"}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={ha} cx="50%" cy="50%" outerRadius={85} innerRadius={40} dataKey="value" label={({name,percent})=>name+" "+(percent*100).toFixed(0)+"%"} labelLine={{stroke:"#7A8BA8"}}>
              {ha.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip contentStyle={ttStyle}/>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Charts row 2 */}
    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Wins Per Season (1910\u20131999)" icon={"\ud83d\udcc8"}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={yw}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:9}} interval={4}/>
            <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            {T5.map((t,i)=><Line key={t} type="monotone" dataKey={t} stroke={C5[i]} strokeWidth={2} dot={false}/>)}
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Average Total Points Per Match By Year" icon={"\ud83d\udcca"}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={avg}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:9}} interval={4}/>
            <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Area type="monotone" dataKey="avg" stroke="#D4213D" fill="rgba(26,95,58,0.15)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Grand Slams + Highest scoring */}
    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title="Grand Slams" icon={"\ud83c\udfc6"}>
        {gs.length===0?<p style={{color:"#5A6A82"}}>No Grand Slams recorded</p>:
          <MT headers={["Year","Winner"]} rows={gs.map(g=>[g.year,<TeamLabel team={g.winner} size={18}/>])}/>}
      </Card>
      <Card title="Highest Scoring Matches" icon={"\u26a1"}>
        <MT headers={["Date","Match","Score","Total"]}
          rows={topScoring.map(m=>[m.date,<span style={{display:"inline-flex",alignItems:"center",gap:4}}><Flag team={m.home} size={14}/>{m.home} v <Flag team={m.away} size={14}/>{m.away}</span>,m.hs+"-"+m.as,m.hs+m.as])}/>
      </Card>
    </div>

    {/* Wins by decade */}
    <Card title="Total Wins By Decade" icon={"\ud83d\udcca"}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={decadeWins}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
          <XAxis dataKey="decade" tick={{fill:"#7A8BA8",fontSize:10}}/>
          <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Legend wrapperStyle={{fontSize:11}}/>
          {T5.map((t,i)=><Bar key={t} dataKey={t} fill={C5[i]} stackId="a"/>)}
        </BarChart>
      </ResponsiveContainer>
    </Card>

    {/* Match results for selected year */}
    <Card title={"Match Results \u2014 "+sy} style={{marginTop:24}}>
      {yd&&<MT headers={["Date","Home","Score","Away","Stadium"]}
        rows={yd.matches.map(m=>[m.date,<TeamLabel team={m.home} size={16}/>,<span style={{fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:"'JetBrains Mono',monospace",background:"rgba(26,95,58,0.08)",padding:"2px 8px",borderRadius:4}}>{m.hs+" - "+m.as}</span>,<TeamLabel team={m.away} size={16}/>,<span style={{fontSize:11,color:"#94a3b8"}}>{m.stadium}</span>])}/>}
    </Card>
  </div>);
}

function SixN({sn,sby,champs}){
  const [sy,setSy]=useState(sby[sby.length-1]?.year||2025);
  const yd=sby.find(s=>s.year===sy);
  const yw=useMemo(()=>sby.map(s=>{const r={year:s.year};s.table.forEach(([t,d])=>{r[t]=d.w;});return r;}),[sby]);
  const avg=useMemo(()=>sby.map(s=>{const tp=s.matches.reduce((sum,m)=>sum+m.hs+m.as,0);return{year:s.year,avg:+(tp/Math.max(s.matches.length,1)).toFixed(1)};}),[sby]);
  const ha=useMemo(()=>{let hw=0,aw=0,dr=0;sn.forEach(m=>{if(m.hs>m.as)hw++;else if(m.hs<m.as)aw++;else dr++;});return[{name:"Home Wins",value:hw,color:"#169B62"},{name:"Away Wins",value:aw,color:"#D4213D"},{name:"Draws",value:dr,color:"#7A8BA8"}];},[sn]);
  const C6=["#C8102E","#002654","#169B62","#0066CC","#003078","#D4213D"];
  const ch=champs.find(c=>c.year===sy);

  return(<div>
    <Card title="Championship Table" style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:"#7A8BA8"}}>Season:</span>
        <select value={sy} onChange={e=>setSy(+e.target.value)} style={{background:"#1e293b",color:"#E8ECF1",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 12px",fontSize:13}}>
          {sby.map(s=><option key={s.year} value={s.year}>{s.year}</option>)}
        </select>
        {ch&&<span style={{fontSize:13,color:"#D4213D",fontWeight:600}}>{"\ud83c\udfc6"} {ch.winner}{ch.gs?" (Grand Slam)":""}</span>}
      </div>
      {yd&&<MT headers={["Pos","Team","P","W","D","L","PF","PA","PD","Pts"]}
        rows={yd.table.map(([team,d],i)=>[i+1,<TeamLabel team={team} size={18}/>,d.played,d.w,d.d,d.l,d.pf,d.pa,d.pd>0?"+"+d.pd:d.pd,d.pts])}/>}
    </Card>
    <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
      <Card title={"Wins Per Season (2000\u20132025)"}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={yw}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:10}} interval={2}/>
            <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
            <Tooltip contentStyle={ttStyle}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            {T6.map((t,i)=><Line key={t} type="monotone" dataKey={t} stroke={C6[i]} strokeWidth={2} dot={false}/>)}
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Home vs Away Advantage">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={ha} cx="50%" cy="50%" outerRadius={95} innerRadius={45} dataKey="value" label={({name,percent})=>name+" "+(percent*100).toFixed(0)+"%"} labelLine={{stroke:"#7A8BA8"}}>
              {ha.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip contentStyle={ttStyle}/>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <Card title="Average Total Points Per Match By Year">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={avg}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
          <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:10}} interval={2}/>
          <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
          <Tooltip contentStyle={ttStyle}/>
          <Area type="monotone" dataKey="avg" stroke="#D4213D" fill="rgba(26,95,58,0.15)" strokeWidth={2}/>
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  </div>);
}

function Team({team,sn,intl,sby,champs}){
  const [sub,setSub]=useState("6n");
  const color=TC[team]||"#7A8BA8";
  const emoji=TE[team]||"";

  // 6N stats
  const s6=useMemo(()=>{
    const ms=sn.filter(m=>m.home===team||m.away===team);
    let w=0,d=0,l=0,pf=0,pa=0;
    ms.forEach(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;pf+=s;pa+=c;if(s>c)w++;else if(s<c)l++;else d++;});
    return{played:ms.length,w,d,l,pf,pa,pd:pf-pa,wp:ms.length?((w/ms.length)*100).toFixed(1):"0"};
  },[team,sn]);

  // Intl stats
  const si=useMemo(()=>{
    const ms=intl.filter(m=>m.home===team||m.away===team);
    let w=0,d=0,l=0,pf=0,pa=0;
    ms.forEach(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;pf+=s;pa+=c;if(s>c)w++;else if(s<c)l++;else d++;});
    return{played:ms.length,w,d,l,pf,pa,pd:pf-pa,wp:ms.length?((w/ms.length)*100).toFixed(1):"0",first:ms.length?ms[0].date:""};
  },[team,intl]);

  // H2H
  const h2h=useMemo(()=>{
    return TA.filter(t=>t!==team).map(opp=>{
      const all=intl.filter(m=>(m.home===team&&m.away===opp)||(m.home===opp&&m.away===team));
      const snm=sn.filter(m=>(m.home===team&&m.away===opp)||(m.home===opp&&m.away===team));
      let w=0,d=0,l=0;all.forEach(m=>{const s=m.home===team?m.hs:m.as;const c=m.home===team?m.as:m.hs;if(s>c)w++;else if(s<c)l++;else d++;});
      let sw=0,sd=0,sl=0;snm.forEach(m=>{const s=m.home===team?m.hs:m.as;const c=m.home===team?m.as:m.hs;if(s>c)sw++;else if(s<c)sl++;else sd++;});
      return{opp,total:all.length,w,d,l,snT:snm.length,sw,sd,sl};
    }).filter(h=>h.total>0).sort((a,b)=>b.total-a.total);
  },[team,intl,sn]);

  // Yearly performance
  const yearly=useMemo(()=>{
    return[...new Set(sn.map(m=>m.year))].sort().map(year=>{
      const ms=sn.filter(m=>m.year===year&&(m.home===team||m.away===team));
      let w=0,pf=0,pa=0;
      ms.forEach(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;pf+=s;pa+=c;if(s>c)w++;});
      const st=sby.find(s=>s.year===year);
      const pos=st?st.table.findIndex(([t])=>t===team)+1:0;
      return{year,wins:w,played:ms.length,pf,pa,avgPF:ms.length?+(pf/ms.length).toFixed(1):0,avgPA:ms.length?+(pa/ms.length).toFixed(1):0,pos};
    });
  },[team,sn,sby]);

  // Biggest wins/losses
  const bigW6=useMemo(()=>sn.filter(m=>m.home===team||m.away===team).map(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;return{date:m.date,opp:isH?m.away:m.home,s,c,mg:s-c};}).filter(r=>r.mg>0).sort((a,b)=>b.mg-a.mg).slice(0,5),[team,sn]);
  const bigL6=useMemo(()=>sn.filter(m=>m.home===team||m.away===team).map(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;return{date:m.date,opp:isH?m.away:m.home,s,c,mg:c-s};}).filter(r=>r.mg>0).sort((a,b)=>b.mg-a.mg).slice(0,5),[team,sn]);
  const bigWI=useMemo(()=>intl.filter(m=>m.home===team||m.away===team).map(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;return{date:m.date,opp:isH?m.away:m.home,s,c,mg:s-c};}).filter(r=>r.mg>0).sort((a,b)=>b.mg-a.mg).slice(0,5),[team,intl]);

  const titles=champs.filter(c=>c.winner===team);
  const grandSlams=titles.filter(c=>c.gs);

  return(<div>
    {/* Team hero banner */}
    <div className="fade-in" style={{position:"relative",display:"flex",alignItems:"center",gap:24,marginBottom:32,padding:"28px 32px",background:`linear-gradient(135deg,${color}18 0%,rgba(7,11,22,0.5) 60%,${color}08 100%)`,borderRadius:16,border:`1px solid ${color}30`,overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${color},${TC2[team]||color},transparent)`}}/>
      <div style={{position:"absolute",right:24,top:"50%",transform:"translateY(-50%)",opacity:0.04,fontSize:140,lineHeight:1,pointerEvents:"none"}}>{emoji}</div>
      <div style={{width:64,height:44,borderRadius:6,overflow:"hidden",boxShadow:`0 4px 20px ${color}40`,border:"2px solid rgba(255,255,255,0.15)",flexShrink:0}}><Flag team={team} size={64}/></div>
      <div>
        <div style={{display:"flex",alignItems:"baseline",gap:12}}>
          <h2 style={{margin:0,fontSize:32,fontWeight:700,color:"#F5F7FA",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"-0.01em"}}>{team}</h2>
          {TN[team]&&<span style={{fontSize:14,color:`${color}cc`,fontStyle:"italic",fontWeight:500}}>{TN[team]}</span>}
        </div>
        <p style={{margin:"6px 0 0",fontSize:13,color:"#7A8BA8",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {titles.length>0&&<span style={{padding:"2px 10px",borderRadius:20,background:"rgba(255,182,18,0.12)",border:"1px solid rgba(255,182,18,0.25)",color:"#FFB612",fontSize:11,fontWeight:600}}>{"\ud83c\udfc6"} {titles.length} Title{titles.length!==1?"s":""}</span>}
          {grandSlams.length>0&&<span style={{padding:"2px 10px",borderRadius:20,background:"rgba(212,33,61,0.12)",border:"1px solid rgba(212,33,61,0.25)",color:"#D4213D",fontSize:11,fontWeight:600}}>{grandSlams.length} Grand Slam{grandSlams.length!==1?"s":""}</span>}
          <span style={{color:"#94a3b8"}}>{si.played} international matches since {si.first?.split("-")[0]}</span>
        </p>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
      <SB label="6N Win Rate" value={s6.wp+"%"} color={color} icon={"\ud83c\udfc9"}/>
      <SB label="6N Played" value={s6.played} sub={s6.w+"W "+s6.d+"D "+s6.l+"L"}/>
      <SB label="6N Points For" value={s6.pf} sub={"Avg "+(s6.pf/Math.max(s6.played,1)).toFixed(1)}/>
      <SB label="6N Point Diff" value={s6.pd>0?"+"+s6.pd:s6.pd} color={s6.pd>0?"#169B62":"#D4213D"}/>
      <SB label="Intl Win Rate" value={si.wp+"%"} icon={"\ud83c\udf0d"}/>
      <SB label="Intl Played" value={si.played} sub={si.w+"W "+si.d+"D "+si.l+"L"}/>
    </div>
    <div className="rf-sub-tabs" style={{display:"flex",gap:6,marginBottom:24}}>
      {[{id:"6n",label:"Six Nations",ic:"\ud83c\udfc6"},{id:"intl",label:"International",ic:"\ud83c\udf0d"},{id:"h2h",label:"Head-to-Head",ic:"\u2694\ufe0f"},{id:"form",label:"Form & Momentum",ic:"\ud83d\udcc8"}].map(t=>(
        <button key={t.id} onClick={()=>setSub(t.id)}
          style={{padding:"10px 20px",fontSize:12.5,fontWeight:sub===t.id?600:400,color:sub===t.id?"#F5F7FA":"#5A6A82",background:sub===t.id?color+"25":"rgba(255,255,255,0.02)",border:"1px solid "+(sub===t.id?color+"50":"rgba(255,255,255,0.05)"),borderRadius:10,cursor:"pointer",transition:"all 0.2s",letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{t.ic}</span>{t.label}</button>
      ))}
    </div>

    {sub==="6n"&&<div>
      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        <Card title="Position by Year">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={yearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:10}} interval={2}/>
              <YAxis reversed domain={[1,6]} tick={{fill:"#7A8BA8",fontSize:11}} ticks={[1,2,3,4,5,6]}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="pos" name="Position" radius={[4,4,0,0]}>
                {yearly.map((e,i)=><Cell key={i} fill={e.pos===1?"#FFB612":e.pos<=3?color:"#94a3b8"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Avg Points Scored vs Conceded">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={yearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="year" tick={{fill:"#7A8BA8",fontSize:10}} interval={2}/>
              <YAxis tick={{fill:"#7A8BA8",fontSize:11}}/>
              <Tooltip contentStyle={ttStyle}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Line type="monotone" dataKey="avgPF" name="Avg Scored" stroke="#169B62" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="avgPA" name="Avg Conceded" stroke="#D4213D" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card title="Championship Titles" style={{marginBottom:24}}>
        {titles.length===0?<p style={{color:"#7A8BA8",fontSize:14}}>No Six Nations titles</p>:
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {titles.map(t=><div key={t.year} style={{padding:"8px 14px",borderRadius:8,background:t.gs?"rgba(255,182,18,0.15)":color+"22",border:"1px solid "+(t.gs?"rgba(255,182,18,0.3)":color+"44"),fontSize:13,fontWeight:600}}>
              {t.gs?"\ud83c\udfc6 ":""}{t.year}{t.gs?" (GS)":""}
            </div>)}
          </div>}
      </Card>
      <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <Card title="Biggest 6N Wins">
          <MT headers={["Date","vs","Score","Margin"]} rows={bigW6.map(m=>[m.date,<TeamLabel team={m.opp} size={16}/>,m.s+"-"+m.c,"+"+m.mg])}/>
        </Card>
        <Card title="Biggest 6N Defeats">
          <MT headers={["Date","vs","Score","Margin"]} rows={bigL6.map(m=>[m.date,<TeamLabel team={m.opp} size={16}/>,m.s+"-"+m.c,"-"+m.mg])}/>
        </Card>
      </div>
    </div>}

    {sub==="intl"&&<div>
      <Card title="Biggest International Victories" style={{marginBottom:24}}>
        <MT headers={["Date","vs","Score","Margin"]} rows={bigWI.map(m=>[m.date,<TeamLabel team={m.opp} size={16}/>,m.s+"-"+m.c,"+"+m.mg])}/>
      </Card>
      <Card title="Full International Record">
        <MT headers={["Stat","Value"]} rows={[
          ["Matches Played",si.played],["Wins",si.w],["Draws",si.d],["Losses",si.l],
          ["Win Rate",si.wp+"%"],["Points For",si.pf],["Points Against",si.pa],
          ["Point Difference",si.pd>0?"+"+si.pd:si.pd],["First Match",si.first]
        ]}/>
      </Card>
    </div>}

    {sub==="h2h"&&<div>
      <Card title="Head-to-Head Record" style={{marginBottom:24}}>
        <MT headers={["Opponent","P","W","D","L","6N P","6N W","6N D","6N L"]}
          rows={h2h.map(h=>[<TeamLabel team={h.opp} size={16}/>,h.total,h.w,h.d,h.l,h.snT,h.sw,h.sd,h.sl])}/>
      </Card>
      <Card title="Win Rate by Opponent (%)">
        <ResponsiveContainer width="100%" height={Math.max(200,h2h.length*35)}>
          <BarChart data={h2h.map(h=>({opp:h.opp,all:h.total?+((h.w/h.total)*100).toFixed(1):0,sixN:h.snT?+((h.sw/h.snT)*100).toFixed(1):0}))} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
            <XAxis type="number" domain={[0,100]} tick={{fill:"#7A8BA8",fontSize:11}}/>
            <YAxis type="category" dataKey="opp" tick={{fill:"#7A8BA8",fontSize:11}} width={100}/>
            <Tooltip contentStyle={ttStyle} formatter={v=>v+"%"}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            <Bar dataKey="all" name="All Intl %" fill={color} radius={[0,4,4,0]} barSize={12}/>
            <Bar dataKey="sixN" name="6N %" fill="#FFB612" radius={[0,4,4,0]} barSize={12}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>}

    {sub==="form"&&(()=>{
      const allMatches=[...intl,...sn].filter(m=>m.home===team||m.away===team);
      // Deduplicate by date+opponent (sn matches also in intl)
      const seen=new Set();
      const unique=allMatches.filter(m=>{const k=m.date+"|"+m.home+"|"+m.away;if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>a.date.localeCompare(b.date));
      const last20=unique.slice(-20).map(m=>{const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;return{...m,score:s,conceded:c,result:s>c?"W":s<c?"L":"D",opp:isH?m.away:m.home,margin:s-c};});
      const last10=last20.slice(-10);
      const l10W=last10.filter(m=>m.result==="W").length,l10D=last10.filter(m=>m.result==="D").length,l10L=last10.filter(m=>m.result==="L").length;
      const l20W=last20.filter(m=>m.result==="W").length,l20D=last20.filter(m=>m.result==="D").length;
      let streak="",streakCount=0;
      for(let i=last20.length-1;i>=0;i--){
        if(i===last20.length-1){streak=last20[i].result;streakCount=1;}
        else if(last20[i].result===streak)streakCount++;
        else break;
      }
      const rollingPts=last20.map((m,i)=>{
        const window=last20.slice(Math.max(0,i-4),i+1);
        return{date:m.date.slice(0,7),avgPF:+(window.reduce((s,x)=>s+x.score,0)/window.length).toFixed(1),avgPA:+(window.reduce((s,x)=>s+x.conceded,0)/window.length).toFixed(1)};
      });
      const yearForm={};
      unique.forEach(m=>{
        const yr=m.date.slice(0,4);const isH=m.home===team;const s=isH?m.hs:m.as;const c=isH?m.as:m.hs;
        if(!yearForm[yr])yearForm[yr]={year:yr,w:0,d:0,l:0,p:0};
        yearForm[yr].p++;if(s>c)yearForm[yr].w++;else if(s===c)yearForm[yr].d++;else yearForm[yr].l++;
      });
      const yearData=Object.values(yearForm).sort((a,b)=>a.year.localeCompare(b.year)).slice(-20).map(y=>({...y,wp:y.p?+((y.w/y.p)*100).toFixed(0):0}));

      return(<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
          <SB label="Last 10 Record" value={l10W+"W "+l10D+"D "+l10L+"L"} color={l10W>=7?"#169B62":l10W>=5?color:"#D4213D"} icon={"\ud83d\udcc8"}/>
          <SB label="Win Rate (Last 10)" value={((l10W/10)*100).toFixed(0)+"%"} color={l10W>=7?"#169B62":"#94a3b8"}/>
          <SB label="Current Streak" value={streakCount+" "+streak} color={streak==="W"?"#169B62":streak==="L"?"#D4213D":"#d4a017"}/>
          <SB label="Last 20 Record" value={l20W+"W "+l20D+"D "+(20-l20W-l20D)+"L"}/>
        </div>
        <Card title="Last 20 Results" icon={"\ud83d\udd1c"} style={{marginBottom:24}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
            {last20.map((m,i)=>(
              <div key={i} style={{padding:"6px 10px",borderRadius:8,background:m.result==="W"?"rgba(22,155,98,0.1)":m.result==="L"?"rgba(220,38,38,0.08)":"rgba(212,160,23,0.08)",border:"1px solid "+(m.result==="W"?"rgba(22,155,98,0.2)":m.result==="L"?"rgba(220,38,38,0.15)":"rgba(212,160,23,0.15)"),textAlign:"center",minWidth:52}}>
                <div style={{fontSize:15,fontWeight:800,color:m.result==="W"?"#3ddc84":m.result==="L"?"#ef4444":"#d4a017"}}>{m.result}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{m.score}-{m.conceded}</div>
                <div style={{fontSize:9,color:"#64748b"}}>{m.opp.slice(0,3).toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid-2 grid-auto" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
          <Card title="Rolling 5-Match Avg Points" icon={"\ud83d\udcca"}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rollingPts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="date" tick={{fill:"#94a3b8",fontSize:9}}/>
                <YAxis tick={{fill:"#94a3b8",fontSize:11}}/>
                <Tooltip contentStyle={{background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"}}/>
                <Line type="monotone" dataKey="avgPF" name="Avg Scored" stroke="#3ddc84" strokeWidth={2} dot={{r:3}}/>
                <Line type="monotone" dataKey="avgPA" name="Avg Conceded" stroke="#ef4444" strokeWidth={2} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Win Rate by Year (Last 20 Years)" icon={"\ud83d\udcc5"}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="year" tick={{fill:"#94a3b8",fontSize:9}} interval={1} angle={-30} textAnchor="end" height={40}/>
                <YAxis domain={[0,100]} tick={{fill:"#94a3b8",fontSize:11}}/>
                <Tooltip contentStyle={{background:"rgba(15,23,42,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"#f8fafc"}}/>
                <Bar dataKey="wp" name="Win %" radius={[4,4,0,0]}>
                  {yearData.map((e,i)=><Cell key={i} fill={e.wp>=70?"#169B62":e.wp>=50?color:e.wp>=30?"#d4a017":"#D4213D"}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card title="Last 20 Match Details" icon={"\ud83d\udcdd"}>
          <table className="row-hover" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>{["Date","Opponent","H/A","Score","Result","Margin"].map((h,i)=><th key={i} style={{padding:"10px 8px",textAlign:i<3?"left":"right",color:"#94a3b8",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>)}</tr></thead>
            <tbody>{[...last20].reverse().map((m,i)=>(
              <tr key={i}>
                <td style={{padding:"8px",color:"#94a3b8",fontFamily:"'JetBrains Mono',monospace",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.date}</td>
                <td style={{padding:"8px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><TeamLabel team={m.opp} size={14}/></td>
                <td style={{padding:"8px",color:"#94a3b8",fontSize:11,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.home===team?"H":"A"}</td>
                <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.score}-{m.conceded}</td>
                <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontWeight:800,color:m.result==="W"?"#3ddc84":m.result==="L"?"#ef4444":"#d4a017",background:m.result==="W"?"rgba(22,155,98,0.1)":m.result==="L"?"rgba(220,38,38,0.08)":"rgba(212,160,23,0.08)",padding:"2px 10px",borderRadius:6}}>{m.result}</span></td>
                <td style={{padding:"8px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace",color:m.margin>0?"#3ddc84":m.margin<0?"#ef4444":"#d4a017",fontWeight:600,borderBottom:"1px solid rgba(255,255,255,0.03)"}}>{m.margin>0?"+":""}{m.margin}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      </div>);
    })()}
  </div>);
}

/* ═══════════════════════════════════════════════
   WORLD RUGBY NATIONS CUP 2026
   ═══════════════════════════════════════════════ */
function NationsChampionship(){
  const NORTH=[
    {name:"England",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",conf:"Six Nations"},
    {name:"France",flag:"🇫🇷",conf:"Six Nations"},
    {name:"Ireland",flag:"🇮🇪",conf:"Six Nations"},
    {name:"Italy",flag:"🇮🇹",conf:"Six Nations"},
    {name:"Scotland",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",conf:"Six Nations"},
    {name:"Wales",flag:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",conf:"Six Nations"},
  ];
  const SOUTH=[
    {name:"New Zealand",flag:"🇳🇿",conf:"Rugby Championship"},
    {name:"South Africa",flag:"🇿🇦",conf:"Rugby Championship"},
    {name:"Australia",flag:"🇦🇺",conf:"Rugby Championship"},
    {name:"Argentina",flag:"🇦🇷",conf:"Rugby Championship"},
    {name:"Fiji",flag:"🇫🇯",conf:"Pacific"},
    {name:"Japan",flag:"🇯🇵",conf:"Asia"},
  ];
  const NC_ROUNDS=[
    {round:"Round 1",date:"Sat 4 July",window:"July",matches:[
      {home:"New Zealand",away:"France",venue:"One New Zealand Stadium, Christchurch"},
      {home:"Australia",away:"Ireland",venue:"Allianz Stadium, Sydney"},
      {home:"Japan",away:"Italy",venue:"Tokyo Chichibunomiya Stadium"},
      {home:"Fiji",away:"Wales",venue:"Cardiff City Stadium, Cardiff"},
      {home:"South Africa",away:"England",venue:"Ellis Park, Johannesburg"},
      {home:"Argentina",away:"Scotland",venue:"Estadio Mario Alberto Kempes, Córdoba"},
    ]},
    {round:"Round 2",date:"Sat 11 July",window:"July",matches:[
      {home:"New Zealand",away:"Italy",venue:"Hnry Stadium, Wellington"},
      {home:"Australia",away:"France",venue:"Suncorp Stadium, Brisbane"},
      {home:"Japan",away:"Ireland",venue:"TBC, Tokyo"},
      {home:"Fiji",away:"England",venue:"Hill Dickinson Stadium, Liverpool"},
      {home:"South Africa",away:"Scotland",venue:"Loftus Versfeld, Pretoria"},
      {home:"Argentina",away:"Wales",venue:"Estadio San Juan del Bicentenario, San Juan"},
    ]},
    {round:"Round 3",date:"Sat 18 July",window:"July",matches:[
      {home:"Japan",away:"France",venue:"Tokyo Nation Stadium"},
      {home:"New Zealand",away:"Ireland",venue:"Eden Park, Auckland"},
      {home:"Australia",away:"Italy",venue:"HBF Park, Perth"},
      {home:"Fiji",away:"Scotland",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"South Africa",away:"Wales",venue:"Hollywoodbets Kings Park, Durban"},
      {home:"Argentina",away:"England",venue:"Estadio Único Madre de Ciudades, Santiago del Estero"},
    ]},
    {round:"Round 4",date:"6–8 Nov",window:"November",matches:[
      {home:"Ireland",away:"Argentina",venue:"Aviva Stadium, Dublin"},
      {home:"Italy",away:"South Africa",venue:"TBC, Italy"},
      {home:"Scotland",away:"New Zealand",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"Wales",away:"Japan",venue:"Principality Stadium, Cardiff"},
      {home:"France",away:"Fiji",venue:"TBC, France"},
      {home:"England",away:"Australia",venue:"Allianz Stadium, London"},
    ]},
    {round:"Round 5",date:"13–15 Nov",window:"November",matches:[
      {home:"France",away:"South Africa",venue:"Stade de France, Paris"},
      {home:"Italy",away:"Argentina",venue:"TBC, Italy"},
      {home:"Wales",away:"New Zealand",venue:"Principality Stadium, Cardiff"},
      {home:"England",away:"Japan",venue:"Allianz Stadium, London"},
      {home:"Ireland",away:"Fiji",venue:"Aviva Stadium, Dublin"},
      {home:"Scotland",away:"Australia",venue:"Scottish Gas Murrayfield, Edinburgh"},
    ]},
    {round:"Round 6",date:"Sat 21 Nov",window:"November",matches:[
      {home:"England",away:"New Zealand",venue:"Allianz Stadium, London"},
      {home:"Scotland",away:"Japan",venue:"Scottish Gas Murrayfield, Edinburgh"},
      {home:"Ireland",away:"South Africa",venue:"Aviva Stadium, Dublin"},
      {home:"Italy",away:"Fiji",venue:"TBC, Italy"},
      {home:"France",away:"Argentina",venue:"Stade de France, Paris"},
      {home:"Wales",away:"Australia",venue:"Principality Stadium, Cardiff"},
    ]},
  ];
  const emptyTable=(teams)=>teams.map(t=>({...t,p:0,w:0,d:0,l:0,pf:0,pa:0,pts:0}));

  return(
    <div>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
          <div style={{width:48,height:48,borderRadius:10,background:"rgba(61,220,132,0.12)",border:"1px solid rgba(61,220,132,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌍</div>
          <div>
            <h2 style={{margin:0,fontSize:26,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc",letterSpacing:"0.02em"}}>World Rugby Nations Championship 2026</h2>
            <p style={{margin:"4px 0 0",fontSize:13,color:"#94a3b8"}}>Inaugural edition · July & November 2026 · 12 nations · North vs South · Grand Final at Twickenham</p>
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
          {[["🗓️","4 Jul – 29 Nov","Tournament window"],["🏆","Grand Final","29 Nov, Twickenham"],["🌍","12 Teams","6 North, 6 South"],["🔄","6 Rounds","Cross-conference only"],["🎯","Finals Weekend","27–29 November"],["⚡","Inaugural","First ever edition"]].map(([icon,val,lbl],i)=>(
            <div key={i} style={{padding:"8px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",alignItems:"center",minWidth:100}}>
              <span style={{fontSize:16}}>{icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#f8fafc",marginTop:2}}>{val}</span>
              <span style={{fontSize:10,color:"#64748b"}}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(61,220,132,0.05)",border:"1px solid rgba(61,220,132,0.15)",marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,color:"#3ddc84",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>What is the Nations Championship?</div>
        <p style={{fontSize:13,color:"#94a3b8",lineHeight:1.6,margin:0}}>The World Rugby Nations Championship is the biggest change to international rugby in a generation. The <strong style={{color:"#f8fafc"}}>top 12 nations</strong> are split into two conferences — the Six Nations (North) and a Rest of World conference featuring the Rugby Championship nations plus Fiji and Japan (South). Every team plays <strong style={{color:"#f8fafc"}}>six cross-conference matches</strong> across the July and November windows, with conference leaders meeting in a <strong style={{color:"#f8fafc"}}>Grand Final at Twickenham on 29 November 2026</strong>.</p>
      </div>

      {/* Format + Points */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:28}}>
        <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(26,95,58,0.08)",border:"1px solid rgba(26,95,58,0.2)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#3ddc84",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Format</div>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:13,color:"#94a3b8",lineHeight:2}}>
            <li>⚙️ 12 teams in 2 conferences of 6</li>
            <li>🔄 All cross-conference (North vs South only)</li>
            <li>📅 3 rounds in July, 3 rounds in November</li>
            <li>🏆 Conference winner goes to Grand Final</li>
            <li>🥇 Grand Final: 29 Nov at Twickenham</li>
          </ul>
        </div>
        <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(30,58,138,0.1)",border:"1px solid rgba(99,102,241,0.2)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#818cf8",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Points System</div>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:13,color:"#94a3b8",lineHeight:2}}>
            <li>✅ Win: <strong style={{color:"#f8fafc"}}>4 points</strong></li>
            <li>➖ Draw: <strong style={{color:"#f8fafc"}}>2 points</strong></li>
            <li>❌ Loss: <strong style={{color:"#f8fafc"}}>0 points</strong></li>
            <li>⚡ 4+ tries scored: <strong style={{color:"#d4a017"}}>+1 bonus point</strong></li>
            <li>💪 Loss by ≤7 points: <strong style={{color:"#d4a017"}}>+1 bonus point</strong></li>
          </ul>
        </div>
      </div>

      {/* Conference tables */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:28}}>
        {[
          {label:"North Conference — Six Nations",teams:NORTH,accent:"#3ddc84",border:"rgba(61,220,132,0.2)"},
          {label:"South Conference — Rest of World",teams:SOUTH,accent:"#f59e0b",border:"rgba(245,158,11,0.2)"},
        ].map(conf=>(
          <div key={conf.label} style={{borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid "+conf.border,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid "+conf.border}}>
              <div style={{fontSize:13,fontWeight:700,color:conf.accent,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em"}}>{conf.label}</div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  {["Team","P","W","D","L","PF","PA","Pts"].map((h,i)=><th key={i} style={{padding:"8px 10px",textAlign:i===0?"left":"center",color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {emptyTable(conf.teams).map(t=>(
                  <tr key={t.name} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                    <td style={{padding:"9px 10px",fontWeight:600,color:"#f8fafc"}}>{t.flag} {t.name}</td>
                    {[t.p,t.w,t.d,t.l,t.pf,t.pa,t.pts].map((v,j)=><td key={j} style={{padding:"9px 10px",textAlign:"center",color:j===6?"#d4a017":"#94a3b8",fontWeight:j===6?700:400,fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:"8px 12px",fontSize:10,color:"#475569",borderTop:"1px solid rgba(255,255,255,0.04)",fontStyle:"italic"}}>Tournament begins July 2026 — standings will update as matches are played</div>
          </div>
        ))}
      </div>

      {/* Fixtures by window */}
      {["July","November"].map(win=>(
        <div key={win} style={{marginBottom:28}}>
          <div style={{fontSize:18,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc",letterSpacing:"0.02em",marginBottom:4}}>{win} 2026 Window</div>
          <p style={{fontSize:13,color:"#94a3b8",marginBottom:20}}>{win==="July"?"Rounds 1–3 · North teams travel South across Australasia, Japan & the Americas":"Rounds 4–6 · South teams return legs in Europe"}</p>
          {NC_ROUNDS.filter(r=>r.window===win).map((round,ri)=>(
            <div key={ri} style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{round.round} — {round.date}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:6}}>
                {round.matches.map((m,mi)=>(
                  <div key={mi} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.home}</div>
                    <div style={{padding:"3px 10px",borderRadius:6,background:"rgba(26,95,58,0.1)",fontSize:10,fontWeight:700,color:"#94a3b8"}}>vs</div>
                    <div style={{flex:1,fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.away}</div>
                    <div style={{fontSize:10,color:"#64748b",whiteSpace:"nowrap",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>{m.venue.split(",")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Finals Weekend */}
      <div style={{padding:"20px 24px",borderRadius:12,background:"rgba(212,160,23,0.06)",border:"1px solid rgba(212,160,23,0.2)"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>🏟️ Finals Weekend — 27–29 November · Allianz Stadium, Twickenham</div>
        <p style={{fontSize:13,color:"#94a3b8",margin:0}}>The top team from the North Conference and the top team from the South Conference meet in the <strong style={{color:"#f8fafc"}}>Grand Final on Sunday 29 November</strong>. Support matches on 27 and 28 November settle final rankings within each conference. The first-ever Nations Championship champion will be crowned in London.</p>
      </div>
    </div>
  );
}

function NationsCup(){
  const POOL_A=[
    {name:"Canada",flag:"🇨🇦",conf:"Americas"},
    {name:"Chile",flag:"🇨🇱",conf:"Americas"},
    {name:"Samoa",flag:"🇼🇸",conf:"Pacific"},
    {name:"Tonga",flag:"🇹🇴",conf:"Pacific"},
    {name:"Uruguay",flag:"🇺🇾",conf:"Americas"},
    {name:"USA",flag:"🇺🇸",conf:"Americas"},
  ];
  const POOL_B=[
    {name:"Georgia",flag:"🇬🇪",conf:"Europe"},
    {name:"Hong Kong China",flag:"🇭🇰",conf:"Asia"},
    {name:"Portugal",flag:"🇵🇹",conf:"Europe"},
    {name:"Romania",flag:"🇷🇴",conf:"Europe"},
    {name:"Spain",flag:"🇪🇸",conf:"Europe"},
    {name:"Zimbabwe",flag:"🇿🇼",conf:"Africa"},
  ];

  const JULY_FIXTURES=[
    {date:"Sat 4 Jul",matches:[
      {home:"Uruguay 🇺🇾",away:"Georgia 🇬🇪",venue:"Montevideo",note:"Inaugural match"},
      {home:"USA 🇺🇸",away:"Portugal 🇵🇹",venue:"Cary, NC"},
      {home:"Canada 🇨🇦",away:"Spain 🇪🇸",venue:"Edmonton"},
      {home:"Chile 🇨🇱",away:"Romania 🇷🇴",venue:"Santiago"},
      {home:"Samoa 🇼🇸",away:"Zimbabwe 🇿🇼",venue:"Apia"},
      {home:"Tonga 🇹🇴",away:"Hong Kong China 🇭🇰",venue:"Nuku'alofa"},
    ]},
    {date:"Sat 11 Jul",matches:[
      {home:"Uruguay 🇺🇾",away:"Spain 🇪🇸",venue:"Montevideo"},
      {home:"USA 🇺🇸",away:"Romania 🇷🇴",venue:"Denver"},
      {home:"Canada 🇨🇦",away:"Georgia 🇬🇪",venue:"Winnipeg"},
      {home:"Chile 🇨🇱",away:"Hong Kong China 🇭🇰",venue:"Santiago"},
      {home:"Samoa 🇼🇸",away:"Portugal 🇵🇹",venue:"Apia"},
      {home:"Tonga 🇹🇴",away:"Zimbabwe 🇿🇼",venue:"Nuku'alofa"},
    ]},
    {date:"Sat 18 Jul",matches:[
      {home:"Uruguay 🇺🇾",away:"Romania 🇷🇴",venue:"Montevideo"},
      {home:"USA 🇺🇸",away:"Georgia 🇬🇪",venue:"Charlotte"},
      {home:"Canada 🇨🇦",away:"Portugal 🇵🇹",venue:"Edmonton"},
      {home:"Chile 🇨🇱",away:"Zimbabwe 🇿🇼",venue:"Santiago"},
      {home:"Samoa 🇼🇸",away:"Hong Kong China 🇭🇰",venue:"Apia"},
      {home:"Tonga 🇹🇴",away:"Spain 🇪🇸",venue:"Nuku'alofa"},
    ]},
  ];

  const emptyTable=(teams)=>teams.map(t=>({...t,p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0,pts:0}));

  return(
    <div>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
          <div style={{width:48,height:48,borderRadius:10,background:"rgba(212,160,23,0.12)",border:"1px solid rgba(212,160,23,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🌐</div>
          <div>
            <h2 style={{margin:0,fontSize:26,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc",letterSpacing:"0.02em"}}>World Rugby Nations Cup 2026</h2>
            <p style={{margin:"4px 0 0",fontSize:13,color:"#94a3b8"}}>Inaugural edition · July & November 2026 · 12 nations · All RWC 2027 qualified</p>
          </div>
        </div>

        {/* Key facts strip */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
          {[["🗓️","July 4 – Nov 21 2026","Tournament window"],["🏆","Biennial","Every 2 years"],["🌍","12 Teams","2 pools of 6"],["🎯","6 Matches","Per team"],["🔗","Nations Championship","Runs alongside"],["📺","RugbyPass TV","Global broadcast"]].map(([icon,val,lbl],i)=>(
            <div key={i} style={{padding:"8px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",alignItems:"center",minWidth:100}}>
              <span style={{fontSize:16}}>{icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#f8fafc",marginTop:2}}>{val}</span>
              <span style={{fontSize:10,color:"#64748b"}}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(212,160,23,0.05)",border:"1px solid rgba(212,160,23,0.15)",marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>What is the Nations Cup?</div>
        <p style={{fontSize:13,color:"#94a3b8",lineHeight:1.6,margin:0}}>The World Rugby Nations Cup is a new biennial competition for nations who qualified for the <strong style={{color:"#f8fafc"}}>Rugby World Cup 2027</strong> in Australia — but outside the 12 teams in the Nations Championship. It runs alongside the Nations Championship across the same July and November windows, providing competitive top-level rugby for the next tier of international nations. Promotion and relegation between the Nations Cup and Nations Championship will be examined from 2030.</p>
      </div>

      {/* Format */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:28}}>
        <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(26,95,58,0.08)",border:"1px solid rgba(26,95,58,0.2)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#3ddc84",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Format</div>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:13,color:"#94a3b8",lineHeight:2}}>
            <li>⚙️ 2 pools of 6 — geographically aligned</li>
            <li>📅 Round-robin across July and November</li>
            <li>🔄 Each team plays the opposite pool (6 matches)</li>
            <li>🏆 Pool champion = highest ranked team in each pool</li>
            <li>🎯 No finals day — table champion crowned</li>
          </ul>
        </div>
        <div style={{padding:"16px 20px",borderRadius:12,background:"rgba(30,58,138,0.1)",border:"1px solid rgba(99,102,241,0.2)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#818cf8",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Points System</div>
          <ul style={{listStyle:"none",padding:0,margin:0,fontSize:13,color:"#94a3b8",lineHeight:2}}>
            <li>✅ Win: <strong style={{color:"#f8fafc"}}>4 points</strong></li>
            <li>➖ Draw: <strong style={{color:"#f8fafc"}}>2 points</strong></li>
            <li>❌ Loss: <strong style={{color:"#f8fafc"}}>0 points</strong></li>
            <li>⚡ 4+ tries scored: <strong style={{color:"#d4a017"}}>+1 bonus point</strong></li>
            <li>💪 Loss by ≤7 points: <strong style={{color:"#d4a017"}}>+1 bonus point</strong></li>
          </ul>
        </div>
      </div>

      {/* Pools */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:28}}>
        {[{label:"Pool A — Americas & Pacific",teams:POOL_A,accent:"#3ddc84",border:"rgba(61,220,132,0.2)"},{label:"Pool B — Europe, Africa & Asia",teams:POOL_B,accent:"#818cf8",border:"rgba(129,140,248,0.2)"}].map(pool=>(
          <div key={pool.label} style={{borderRadius:12,background:"rgba(255,255,255,0.02)",border:"1px solid "+pool.border,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid "+pool.border}}>
              <div style={{fontSize:13,fontWeight:700,color:pool.accent,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em"}}>{pool.label}</div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  {["Team","Conf","P","W","D","L","Pts"].map((h,i)=><th key={i} style={{padding:"8px 10px",textAlign:i<2?"left":"center",color:"#64748b",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {emptyTable(pool.teams).map((t,i)=>(
                  <tr key={t.name} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                    <td style={{padding:"9px 10px",fontWeight:600,color:"#f8fafc"}}>{t.flag} {t.name}</td>
                    <td style={{padding:"9px 10px",fontSize:10,color:"#64748b"}}>{t.conf}</td>
                    {[t.p,t.w,t.d,t.l,t.pts].map((v,j)=><td key={j} style={{padding:"9px 10px",textAlign:"center",color:j===4?"#d4a017":"#94a3b8",fontWeight:j===4?700:400,fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:"8px 12px",fontSize:10,color:"#475569",borderTop:"1px solid rgba(255,255,255,0.04)",fontStyle:"italic"}}>Tournament begins July 2026 — standings will update live</div>
          </div>
        ))}
      </div>

      {/* July 2026 fixtures */}
      <div style={{marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",color:"#f8fafc",letterSpacing:"0.02em",marginBottom:4}}>July 2026 Fixtures</div>
        <p style={{fontSize:13,color:"#94a3b8",marginBottom:20}}>Inaugural window — Americas & Pacific host matches in Montevideo, Denver, Edmonton, Santiago, Charlotte, Winnipeg, Cary, Apia, and Nuku'alofa</p>
        {JULY_FIXTURES.map((round,ri)=>(
          <div key={ri} style={{marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,color:"#d4a017",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>
              Round {ri+1} — {round.date} {ri===0?"🌟 Inaugural round":""}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:6}}>
              {round.matches.map((m,mi)=>(
                <div key={mi} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,background:ri===0&&mi===0?"rgba(212,160,23,0.07)":"rgba(255,255,255,0.02)",border:"1px solid "+(ri===0&&mi===0?"rgba(212,160,23,0.25)":"rgba(255,255,255,0.05)")}}>
                  <div style={{flex:1,textAlign:"right",fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.home}</div>
                  <div style={{padding:"3px 10px",borderRadius:6,background:"rgba(26,95,58,0.1)",fontSize:10,fontWeight:700,color:"#94a3b8"}}>vs</div>
                  <div style={{flex:1,fontSize:12,fontWeight:600,color:"#f8fafc"}}>{m.away}</div>
                  <div style={{fontSize:10,color:"#64748b",whiteSpace:"nowrap"}}>{m.venue}{m.note?` · ${m.note}`:""}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",marginTop:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase",letterSpacing:"0.08em"}}>November 2026 Window</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Return fixtures hosted in Europe and Asia — 3 matches per team. Full schedule TBA. Tournament concludes 21 November 2026.</div>
        </div>
      </div>
    </div>
  );
}

window.RugbyStatNations = RugbyStatNations;
window._rugbyReady = true;

export default RugbyStatNations;
