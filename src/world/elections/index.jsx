import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend
} from 'recharts';

const ACCENT = '#6366f1';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURF2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const CSS = `
  .ele-root {
    background: ${BG};
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: ${TEXT1};
    padding: 0 0 60px 0;
  }
  .ele-header {
    background: linear-gradient(135deg,#0f0a2e 0%,#1e1b4b 60%,#0f0a2e 100%);
    padding: 48px 32px 40px;
    border-bottom: 1px solid ${BORDER};
    position: relative;
    overflow: hidden;
  }
  .ele-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .ele-header-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .ele-header-tag {
    display: inline-block;
    background: rgba(99,102,241,0.18);
    color: ${ACCENT};
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 14px;
    margin-bottom: 16px;
  }
  .ele-header h1 {
    font-size: 2.4rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 10px 0;
    color: ${TEXT1};
  }
  .ele-header-sub {
    color: ${TEXT2};
    font-size: 1rem;
    margin: 0;
    max-width: 580px;
    line-height: 1.6;
  }
  .ele-stats-row {
    display: flex;
    gap: 20px;
    margin-top: 28px;
    flex-wrap: wrap;
  }
  .ele-stat-pill {
    background: rgba(255,255,255,0.06);
    border: 1px solid ${BORDER};
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ele-stat-pill-num {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${ACCENT};
  }
  .ele-stat-pill-label {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .ele-tabs {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .ele-tab-bar {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid ${BORDER};
    margin-bottom: 32px;
    padding-top: 28px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ele-tab-bar::-webkit-scrollbar { display: none; }
  .ele-tab-btn {
    background: none;
    border: none;
    color: ${TEXT3};
    font-size: 0.88rem;
    font-weight: 500;
    padding: 10px 18px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color 0.18s, border-color 0.18s;
    font-family: inherit;
    border-radius: 6px 6px 0 0;
  }
  .ele-tab-btn:hover { color: ${TEXT2}; }
  .ele-tab-btn.ele-active {
    color: ${ACCENT};
    border-bottom-color: ${ACCENT};
    background: rgba(99,102,241,0.07);
  }
  .ele-section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 6px 0;
  }
  .ele-section-sub {
    font-size: 0.85rem;
    color: ${TEXT2};
    margin: 0 0 24px 0;
  }
  .ele-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .ele-card-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${TEXT1};
    margin: 0 0 4px 0;
  }
  .ele-card-sub {
    font-size: 0.78rem;
    color: ${TEXT3};
    margin: 0 0 20px 0;
  }
  .ele-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .ele-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  .ele-kpi {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px 22px;
  }
  .ele-kpi-label {
    font-size: 0.75rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 6px;
  }
  .ele-kpi-value {
    font-size: 1.7rem;
    font-weight: 800;
    color: ${ACCENT};
  }
  .ele-kpi-detail {
    font-size: 0.78rem;
    color: ${TEXT2};
    margin-top: 3px;
  }
  .ele-table-wrap {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid ${BORDER};
  }
  .ele-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.83rem;
  }
  .ele-table thead tr {
    background: ${SURF2};
  }
  .ele-table th {
    padding: 10px 14px;
    text-align: left;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${TEXT3};
    font-weight: 600;
    white-space: nowrap;
    border-bottom: 1px solid ${BORDER};
  }
  .ele-table td {
    padding: 10px 14px;
    color: ${TEXT2};
    border-bottom: 1px solid ${BORDER};
    white-space: nowrap;
  }
  .ele-table tbody tr:last-child td { border-bottom: none; }
  .ele-table tbody tr:hover td { background: rgba(255,255,255,0.025); }
  .ele-table .ele-bold { color: ${TEXT1}; font-weight: 600; }
  .ele-badge {
    display: inline-block;
    padding: 2px 9px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .ele-badge-dem { background: rgba(59,130,246,0.18); color: #60a5fa; }
  .ele-badge-rep { background: rgba(239,68,68,0.18); color: #f87171; }
  .ele-badge-other { background: rgba(99,102,241,0.18); color: #a5b4fc; }
  .ele-badge-yes { background: rgba(34,197,94,0.18); color: #4ade80; }
  .ele-badge-no { background: rgba(239,68,68,0.18); color: #f87171; }
  .ele-badge-comp { background: rgba(234,179,8,0.18); color: #facc15; }
  .ele-badge-vol { background: rgba(148,163,184,0.14); color: ${TEXT2}; }
  .ele-filter-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    align-items: center;
  }
  .ele-filter-label {
    font-size: 0.8rem;
    color: ${TEXT3};
    margin-right: 4px;
  }
  .ele-filter-btn {
    background: ${SURF2};
    border: 1px solid ${BORDER};
    border-radius: 8px;
    color: ${TEXT2};
    font-size: 0.8rem;
    padding: 6px 14px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
  }
  .ele-filter-btn:hover { border-color: ${ACCENT}; color: ${TEXT1}; }
  .ele-filter-btn.ele-filter-active {
    background: rgba(99,102,241,0.18);
    border-color: ${ACCENT};
    color: ${ACCENT};
    font-weight: 600;
  }
  .ele-progress-bar {
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
    width: 80px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }
  .ele-progress-fill {
    height: 100%;
    border-radius: 3px;
  }
  .ele-ref-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: border-color 0.18s;
  }
  .ele-ref-card:hover { border-color: rgba(99,102,241,0.3); }
  .ele-ref-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .ele-ref-country {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin-bottom: 4px;
  }
  .ele-ref-question {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${TEXT1};
    line-height: 1.4;
  }
  .ele-ref-year {
    font-size: 0.78rem;
    color: ${TEXT3};
    background: ${SURF2};
    border-radius: 6px;
    padding: 3px 10px;
    white-space: nowrap;
  }
  .ele-ref-bars {
    margin: 12px 0 8px;
  }
  .ele-ref-bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    font-size: 0.8rem;
  }
  .ele-ref-bar-label {
    width: 28px;
    color: ${TEXT2};
    font-weight: 600;
  }
  .ele-ref-bar-track {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.07);
    border-radius: 4px;
    overflow: hidden;
  }
  .ele-ref-bar-fill-yes { height: 100%; border-radius: 4px; background: #22c55e; }
  .ele-ref-bar-fill-no { height: 100%; border-radius: 4px; background: #ef4444; }
  .ele-ref-bar-pct {
    width: 38px;
    text-align: right;
    color: ${TEXT2};
    font-size: 0.8rem;
  }
  .ele-ref-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    font-size: 0.78rem;
  }
  .ele-ref-outcome {
    color: ${TEXT3};
    font-style: italic;
  }
  .ele-ref-turnout {
    color: ${TEXT2};
  }
  .ele-turnout-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid ${BORDER};
    font-size: 0.83rem;
  }
  .ele-turnout-item:last-child { border-bottom: none; }
  .ele-turnout-country {
    width: 110px;
    color: ${TEXT1};
    font-weight: 500;
    flex-shrink: 0;
  }
  .ele-turnout-track {
    flex: 1;
    height: 10px;
    background: rgba(255,255,255,0.06);
    border-radius: 5px;
    overflow: hidden;
  }
  .ele-turnout-fill {
    height: 100%;
    border-radius: 5px;
  }
  .ele-turnout-pct {
    width: 44px;
    text-align: right;
    color: ${TEXT2};
    font-weight: 600;
  }
  .ele-custom-tooltip {
    background: #1a2540;
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: ${TEXT1};
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .ele-custom-tooltip-label {
    font-weight: 700;
    margin-bottom: 5px;
    color: ${TEXT1};
  }
  .ele-custom-tooltip-row {
    color: ${TEXT2};
    margin: 2px 0;
  }
  .ele-empty {
    text-align: center;
    padding: 40px;
    color: ${TEXT3};
    font-size: 0.9rem;
  }
  @media (max-width: 768px) {
    .ele-grid-2 { grid-template-columns: 1fr; }
    .ele-grid-3 { grid-template-columns: 1fr 1fr; }
    .ele-header { padding: 32px 18px 28px; }
    .ele-tabs { padding: 0 16px; }
    .ele-header h1 { font-size: 1.7rem; }
  }
  @media (max-width: 480px) {
    .ele-grid-3 { grid-template-columns: 1fr; }
  }
`;

const PRESIDENTIAL_ELECTIONS = [
  {country:'USA',year:2024,winner:'Donald Trump',party:'Republican',pct:49.9,runner_up:'Kamala Harris',runner_pct:48.4,turnout:63.9},
  {country:'USA',year:2020,winner:'Joe Biden',party:'Democrat',pct:51.3,runner_up:'Donald Trump',runner_pct:46.9,turnout:66.7},
  {country:'USA',year:2016,winner:'Donald Trump',party:'Republican',pct:46.1,runner_up:'Hillary Clinton',runner_pct:48.2,turnout:59.2},
  {country:'USA',year:2012,winner:'Barack Obama',party:'Democrat',pct:51.1,runner_up:'Mitt Romney',runner_pct:47.2,turnout:58.6},
  {country:'USA',year:2008,winner:'Barack Obama',party:'Democrat',pct:52.9,runner_up:'John McCain',runner_pct:45.7,turnout:61.6},
  {country:'France',year:2022,winner:'Emmanuel Macron',party:'En Marche',pct:58.5,runner_up:'Marine Le Pen',runner_pct:41.5,turnout:72.0},
  {country:'France',year:2017,winner:'Emmanuel Macron',party:'En Marche',pct:66.1,runner_up:'Marine Le Pen',runner_pct:33.9,turnout:74.6},
  {country:'France',year:2012,winner:'François Hollande',party:'Socialist',pct:51.6,runner_up:'Nicolas Sarkozy',runner_pct:48.4,turnout:80.3},
  {country:'Brazil',year:2022,winner:'Luiz Inácio Lula da Silva',party:'PT',pct:50.9,runner_up:'Jair Bolsonaro',runner_pct:49.1,turnout:79.0},
  {country:'Brazil',year:2018,winner:'Jair Bolsonaro',party:'PSL',pct:55.1,runner_up:'Fernando Haddad',runner_pct:44.9,turnout:78.7},
  {country:'Mexico',year:2024,winner:'Claudia Sheinbaum',party:'Morena',pct:59.4,runner_up:'Xóchitl Gálvez',runner_pct:28.1,turnout:61.0},
  {country:'Mexico',year:2018,winner:'Andrés Manuel López Obrador',party:'Morena',pct:53.2,runner_up:'Ricardo Anaya',runner_pct:22.3,turnout:63.4},
  {country:'Argentina',year:2023,winner:'Javier Milei',party:'La Libertad Avanza',pct:55.7,runner_up:'Sergio Massa',runner_pct:44.3,turnout:76.4},
  {country:'South Korea',year:2022,winner:'Yoon Suk-yeol',party:'PPP',pct:48.6,runner_up:'Lee Jae-myung',runner_pct:47.8,turnout:77.1},
  {country:'Taiwan',year:2024,winner:'Lai Ching-te',party:'DPP',pct:40.1,runner_up:'Hou Yu-ih',runner_pct:33.5,turnout:71.9},
  {country:'Poland',year:2020,winner:'Andrzej Duda',party:'PiS',pct:51.0,runner_up:'Rafał Trzaskowski',runner_pct:49.0,turnout:68.2},
];

const PARLIAMENTARY_ELECTIONS = [
  {country:'UK',year:2024,winner:'Labour',seats:412,total:650,pct:33.7,runner_up:'Conservative',runner_seats:121,system:'FPTP',turnout:59.9},
  {country:'UK',year:2019,winner:'Conservative',seats:365,total:650,pct:43.6,runner_up:'Labour',runner_seats:202,system:'FPTP',turnout:67.3},
  {country:'Germany',year:2025,winner:'CDU/CSU',seats:208,total:630,pct:28.6,runner_up:'AFD',runner_seats:152,system:'MMP',turnout:83.0},
  {country:'Germany',year:2021,winner:'SPD',seats:206,total:736,pct:25.7,runner_up:'CDU/CSU',runner_seats:197,system:'MMP',turnout:76.6},
  {country:'Italy',year:2022,winner:"Fratelli d'Italia",seats:119,total:400,pct:26.0,runner_up:'PD',runner_seats:69,system:'Mixed',turnout:63.9},
  {country:'Canada',year:2025,winner:'Liberal',seats:169,total:343,pct:43.7,runner_up:'Conservative',runner_seats:144,system:'FPTP',turnout:68.0},
  {country:'Canada',year:2021,winner:'Liberal',seats:159,total:338,pct:32.6,runner_up:'Conservative',runner_seats:119,system:'FPTP',turnout:62.2},
  {country:'Australia',year:2022,winner:'ALP',seats:77,total:151,pct:32.6,runner_up:'Coalition',runner_seats:58,system:'AV',turnout:89.8},
  {country:'Spain',year:2023,winner:'PSOE',seats:122,total:350,pct:31.7,runner_up:'PP',runner_seats:137,system:'PR',turnout:70.4},
  {country:'Netherlands',year:2023,winner:'PVV',seats:37,total:150,pct:23.5,runner_up:'PvdA/GL',runner_seats:25,system:'PR',turnout:77.7},
  {country:'India',year:2024,winner:'BJP',seats:240,total:543,pct:36.6,runner_up:'INC',runner_seats:99,system:'FPTP',turnout:66.1},
  {country:'Japan',year:2024,winner:'LDP',seats:191,total:465,pct:26.7,runner_up:'CDP',runner_seats:148,system:'Mixed',turnout:53.9},
  {country:'South Africa',year:2024,winner:'ANC',seats:159,total:400,pct:40.2,runner_up:'DA',runner_seats:87,system:'PR',turnout:58.6},
  {country:'Sweden',year:2022,winner:'SD',seats:73,total:349,pct:20.5,runner_up:'SAP',runner_seats:107,system:'PR',turnout:84.2},
];

const REFERENDA = [
  {country:'UK',year:2016,question:'Should the UK remain a member of the EU?',result:'Leave',yes_pct:51.9,no_pct:48.1,turnout:72.2,outcome:'Brexit triggered'},
  {country:'Scotland',year:2014,question:'Should Scotland be an independent country?',result:'No',yes_pct:44.7,no_pct:55.3,turnout:84.6,outcome:'Scotland remained in UK'},
  {country:'Ireland',year:2018,question:'Repeal the 8th Amendment (abortion ban)?',result:'Yes',yes_pct:66.4,no_pct:33.6,turnout:64.1,outcome:'Abortion legalised'},
  {country:'Ireland',year:2015,question:'Same-sex marriage?',result:'Yes',yes_pct:62.1,no_pct:37.9,turnout:60.5,outcome:'Marriage equality enacted'},
  {country:'Switzerland',year:2021,question:'Ban on full face coverings in public?',result:'Yes',yes_pct:51.2,no_pct:48.8,turnout:51.4,outcome:'Partial ban enacted'},
  {country:'Chile',year:2022,question:'Adopt new constitution?',result:'No',yes_pct:38.1,no_pct:61.9,turnout:85.9,outcome:'Existing constitution retained'},
  {country:'Australia',year:2023,question:'Indigenous Voice to Parliament?',result:'No',yes_pct:39.9,no_pct:60.1,turnout:91.6,outcome:'Voice not established'},
  {country:'Turkey',year:2017,question:'Presidential system of government?',result:'Yes',yes_pct:51.4,no_pct:48.6,turnout:85.4,outcome:'Presidential system adopted'},
  {country:'New Zealand',year:2020,question:'Legalise recreational cannabis?',result:'No',yes_pct:46.1,no_pct:53.9,turnout:82.6,outcome:'Cannabis remained illegal'},
  {country:'Colombia',year:2016,question:'FARC peace deal?',result:'No',yes_pct:49.8,no_pct:50.2,turnout:37.4,outcome:'Revised deal later signed'},
  {country:'Italy',year:2020,question:'Reduce parliament size?',result:'Yes',yes_pct:69.6,no_pct:30.4,turnout:53.8,outcome:'Parliament reduced by 1/3'},
];

const PARTY_VOTE_TRENDS = {
  USA: [
    {year:2008,dem:52.9,rep:45.7},{year:2012,dem:51.1,rep:47.2},{year:2016,dem:48.2,rep:46.1},
    {year:2020,dem:51.3,rep:46.9},{year:2024,dem:48.4,rep:49.9},
  ],
  UK: [
    {year:2010,lab:29.0,con:36.1},{year:2015,lab:30.4,con:36.9},{year:2017,lab:40.0,con:42.4},
    {year:2019,lab:32.1,con:43.6},{year:2024,lab:33.7,con:23.7},
  ],
  France: [
    {year:2007,left:25.9,right:31.2},{year:2012,left:28.6,right:27.2},{year:2017,left:6.4,right:20.0},
    {year:2022,left:22.0,right:4.8},
  ],
};

const TURNOUT_DATA = [
  {country:'Belgium',turnout:88.4,compulsory:true},
  {country:'Australia',turnout:89.8,compulsory:true},
  {country:'Luxembourg',turnout:89.6,compulsory:true},
  {country:'Sweden',turnout:84.2,compulsory:false},
  {country:'Denmark',turnout:84.6,compulsory:false},
  {country:'Germany',turnout:83.0,compulsory:false},
  {country:'Norway',turnout:77.2,compulsory:false},
  {country:'Netherlands',turnout:77.7,compulsory:false},
  {country:'New Zealand',turnout:78.2,compulsory:false},
  {country:'Finland',turnout:72.8,compulsory:false},
  {country:'France',turnout:72.0,compulsory:false},
  {country:'Canada',turnout:68.0,compulsory:false},
  {country:'Spain',turnout:70.4,compulsory:false},
  {country:'Austria',turnout:75.4,compulsory:false},
  {country:'UK',turnout:59.9,compulsory:false},
  {country:'USA',turnout:63.9,compulsory:false},
  {country:'Japan',turnout:53.9,compulsory:false},
  {country:'Switzerland',turnout:46.4,compulsory:false},
  {country:'India',turnout:66.1,compulsory:false},
];

const PARTY_COLORS = {
  dem: '#3b82f6',
  rep: '#ef4444',
  lab: '#ef4444',
  con: '#3b82f6',
  left: '#ef4444',
  right: '#3b82f6',
};

const TABS = ['Overview', 'Presidential', 'Parliamentary', 'Referenda', 'Party Trends', 'Turnout'];

function partyBadgeClass(party) {
  const p = party.toLowerCase();
  if (p.includes('democrat') || p.includes('labour') || p.includes('labor') || p.includes('socialist') || p.includes('pt') || p.includes('morena') || p.includes('spd') || p.includes('psoe') || p.includes('alp') || p.includes('liberal') || p.includes('anc') || p.includes('inc') || p.includes('cdp')) return 'ele-badge ele-badge-dem';
  if (p.includes('republican') || p.includes('conservative') || p.includes('psl') || p.includes('ppp') || p.includes('pis') || p.includes('afd') || p.includes('pvv') || p.includes('bjp') || p.includes('ldp') || p.includes('sd') || p.includes('fratelli')) return 'ele-badge ele-badge-rep';
  return 'ele-badge ele-badge-other';
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="ele-custom-tooltip">
      <div className="ele-custom-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="ele-custom-tooltip-row" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
          {p.name && (p.name.toLowerCase().includes('pct') || p.name.toLowerCase().includes('turnout') || p.name.toLowerCase().includes('%') || ['dem','rep','lab','con','left','right'].includes(p.name)) ? '%' : ''}
        </div>
      ))}
    </div>
  );
}

function OverviewTab() {
  const totalElections = PRESIDENTIAL_ELECTIONS.length + PARLIAMENTARY_ELECTIONS.length;
  const avgTurnout = (TURNOUT_DATA.reduce((s, d) => s + d.turnout, 0) / TURNOUT_DATA.length).toFixed(1);
  const highestTurnout = [...TURNOUT_DATA].sort((a, b) => b.turnout - a.turnout)[0];
  const lowestTurnout = [...TURNOUT_DATA].sort((a, b) => a.turnout - b.turnout)[0];

  const recentElections = [...PRESIDENTIAL_ELECTIONS, ...PARLIAMENTARY_ELECTIONS]
    .sort((a, b) => b.year - a.year)
    .slice(0, 8);

  const turnoutChartData = [...TURNOUT_DATA].sort((a, b) => b.turnout - a.turnout).slice(0, 10);

  const systemCounts = PARLIAMENTARY_ELECTIONS.reduce((acc, e) => {
    acc[e.system] = (acc[e.system] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(systemCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = [ACCENT, '#22d3ee', '#f472b6', '#fb923c', '#a3e635'];

  return (
    <div>
      <p className="ele-section-sub">Global election statistics, results, and trends across presidential, parliamentary, and referendum votes.</p>
      <div className="ele-grid-3">
        <div className="ele-kpi">
          <div className="ele-kpi-label">Total Elections Tracked</div>
          <div className="ele-kpi-value">{totalElections}</div>
          <div className="ele-kpi-detail">{PRESIDENTIAL_ELECTIONS.length} presidential · {PARLIAMENTARY_ELECTIONS.length} parliamentary</div>
        </div>
        <div className="ele-kpi">
          <div className="ele-kpi-label">Avg Voter Turnout</div>
          <div className="ele-kpi-value">{avgTurnout}%</div>
          <div className="ele-kpi-detail">Across {TURNOUT_DATA.length} tracked nations</div>
        </div>
        <div className="ele-kpi">
          <div className="ele-kpi-label">Referenda Tracked</div>
          <div className="ele-kpi-value">{REFERENDA.length}</div>
          <div className="ele-kpi-detail">{REFERENDA.filter(r => r.result === 'Yes').length} passed · {REFERENDA.filter(r => r.result !== 'Yes').length} failed/leave</div>
        </div>
      </div>
      <div className="ele-grid-2">
        <div className="ele-card">
          <div className="ele-card-title">Top 10 Voter Turnout Countries</div>
          <div className="ele-card-sub">Latest available general election data</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={turnoutChartData} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis dataKey="country" type="category" tick={{ fill: TEXT2, fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="turnout" name="Turnout %" radius={[0, 4, 4, 0]}>
                {turnoutChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.compulsory ? '#f59e0b' : ACCENT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: '0.75rem', color: TEXT3, marginTop: 8 }}>
            <span style={{ color: '#f59e0b' }}>■</span> Compulsory voting &nbsp;
            <span style={{ color: ACCENT }}>■</span> Voluntary
          </div>
        </div>
        <div className="ele-card">
          <div className="ele-card-title">Electoral Systems Distribution</div>
          <div className="ele-card-sub">Parliamentary elections by voting system</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: TEXT3 }} fontSize={11}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <span key={d.name} style={{ fontSize: '0.75rem', color: TEXT2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], display: 'inline-block' }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Recent Elections</div>
        <div className="ele-card-sub">Most recently held elections across all tracked nations</div>
        <div className="ele-table-wrap">
          <table className="ele-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Year</th>
                <th>Type</th>
                <th>Winner</th>
                <th>Party / Alliance</th>
                <th>Vote %</th>
                <th>Turnout</th>
              </tr>
            </thead>
            <tbody>
              {recentElections.map((e, i) => {
                const isParl = 'seats' in e;
                return (
                  <tr key={i}>
                    <td className="ele-bold">{e.country}</td>
                    <td>{e.year}</td>
                    <td>
                      <span className="ele-badge ele-badge-other" style={{ fontSize: '0.68rem' }}>
                        {isParl ? 'Parliamentary' : 'Presidential'}
                      </span>
                    </td>
                    <td className="ele-bold">{e.winner}</td>
                    <td>
                      <span className={isParl ? partyBadgeClass(e.winner) : partyBadgeClass(e.party)}>
                        {isParl ? e.winner : e.party}
                      </span>
                    </td>
                    <td>{e.pct}%</td>
                    <td>{e.turnout}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ele-grid-2">
        <div className="ele-kpi" style={{ padding: '18px 22px' }}>
          <div className="ele-kpi-label">Highest Turnout</div>
          <div className="ele-kpi-value">{highestTurnout.turnout}%</div>
          <div className="ele-kpi-detail">{highestTurnout.country} {highestTurnout.compulsory ? '(compulsory voting)' : ''}</div>
        </div>
        <div className="ele-kpi" style={{ padding: '18px 22px' }}>
          <div className="ele-kpi-label">Lowest Turnout</div>
          <div className="ele-kpi-value">{lowestTurnout.turnout}%</div>
          <div className="ele-kpi-detail">{lowestTurnout.country}</div>
        </div>
      </div>
    </div>
  );
}

function PresidentialTab() {
  const [filterCountry, setFilterCountry] = useState('All');
  const countries = useMemo(() => ['All', ...Array.from(new Set(PRESIDENTIAL_ELECTIONS.map(e => e.country)))], []);
  const filtered = useMemo(() =>
    filterCountry === 'All' ? PRESIDENTIAL_ELECTIONS : PRESIDENTIAL_ELECTIONS.filter(e => e.country === filterCountry),
    [filterCountry]
  );

  const chartData = useMemo(() =>
    [...filtered].sort((a, b) => a.year - b.year).map(e => ({
      name: `${e.country} '${String(e.year).slice(2)}`,
      winner: e.pct,
      runner: e.runner_pct,
      turnout: e.turnout,
    })),
    [filtered]
  );

  const margins = useMemo(() =>
    filtered.map(e => ({
      name: e.winner.split(' ').slice(-1)[0],
      year: e.year,
      country: e.country,
      margin: +(e.pct - e.runner_pct).toFixed(1),
    })).sort((a, b) => b.margin - a.margin),
    [filtered]
  );

  return (
    <div>
      <p className="ele-section-sub">Presidential election results including vote shares, runner-up performance, and turnout data.</p>
      <div className="ele-filter-row">
        <span className="ele-filter-label">Country:</span>
        {countries.map(c => (
          <button
            key={c}
            className={`ele-filter-btn${filterCountry === c ? ' ele-filter-active' : ''}`}
            onClick={() => setFilterCountry(c)}
          >{c}</button>
        ))}
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Vote Share: Winner vs Runner-Up</div>
        <div className="ele-card-sub">Percentage of vote received in second round or general vote</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left: 0, right: 10, top: 4, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" interval={0} />
            <YAxis domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.8rem', paddingTop: 8 }} />
            <Bar dataKey="winner" name="Winner %" fill={ACCENT} radius={[3, 3, 0, 0]} />
            <Bar dataKey="runner" name="Runner-Up %" fill={SURF2} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="ele-grid-2">
        <div className="ele-card">
          <div className="ele-card-title">Victory Margins</div>
          <div className="ele-card-sub">Percentage point difference between winner and runner-up</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={margins} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="pp" />
              <YAxis dataKey="name" type="category" tick={{ fill: TEXT2, fontSize: 11 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="margin" name="Margin (pp)" radius={[0, 4, 4, 0]}>
                {margins.map((entry, i) => (
                  <Cell key={i} fill={entry.margin < 3 ? '#f59e0b' : entry.margin < 10 ? ACCENT : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="ele-card">
          <div className="ele-card-title">Voter Turnout by Election</div>
          <div className="ele-card-sub">Registered voter participation rate</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ left: 0, right: 10, top: 4, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis domain={[40, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="turnout" name="Turnout %" fill="#22d3ee" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Full Results Table</div>
        <div className="ele-card-sub">{filtered.length} elections shown</div>
        <div className="ele-table-wrap">
          <table className="ele-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Year</th>
                <th>Winner</th>
                <th>Party</th>
                <th>Winner %</th>
                <th>Runner-Up</th>
                <th>Runner %</th>
                <th>Margin</th>
                <th>Turnout</th>
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a, b) => b.year - a.year).map((e, i) => (
                <tr key={i}>
                  <td className="ele-bold">{e.country}</td>
                  <td>{e.year}</td>
                  <td className="ele-bold">{e.winner}</td>
                  <td><span className={partyBadgeClass(e.party)}>{e.party}</span></td>
                  <td>{e.pct}%</td>
                  <td>{e.runner_up}</td>
                  <td>{e.runner_pct}%</td>
                  <td style={{ color: (e.pct - e.runner_pct) < 3 ? '#f59e0b' : '#4ade80', fontWeight: 600 }}>
                    +{(e.pct - e.runner_pct).toFixed(1)}pp
                  </td>
                  <td>{e.turnout}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ParliamentaryTab() {
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterSystem, setFilterSystem] = useState('All');

  const countries = useMemo(() => ['All', ...Array.from(new Set(PARLIAMENTARY_ELECTIONS.map(e => e.country)))], []);
  const systems = useMemo(() => ['All', ...Array.from(new Set(PARLIAMENTARY_ELECTIONS.map(e => e.system)))], []);

  const filtered = useMemo(() => PARLIAMENTARY_ELECTIONS.filter(e =>
    (filterCountry === 'All' || e.country === filterCountry) &&
    (filterSystem === 'All' || e.system === filterSystem)
  ), [filterCountry, filterSystem]);

  const seatsData = useMemo(() =>
    [...filtered].sort((a, b) => b.year - a.year).slice(0, 10).map(e => ({
      name: `${e.country} '${String(e.year).slice(2)}`,
      winner: e.seats,
      runner: e.runner_seats,
      other: e.total - e.seats - e.runner_seats,
    })),
    [filtered]
  );

  return (
    <div>
      <p className="ele-section-sub">Parliamentary election results including seat allocations, vote shares, and electoral systems.</p>
      <div className="ele-filter-row">
        <span className="ele-filter-label">Country:</span>
        {countries.map(c => (
          <button key={c} className={`ele-filter-btn${filterCountry === c ? ' ele-filter-active' : ''}`} onClick={() => setFilterCountry(c)}>{c}</button>
        ))}
      </div>
      <div className="ele-filter-row">
        <span className="ele-filter-label">System:</span>
        {systems.map(s => (
          <button key={s} className={`ele-filter-btn${filterSystem === s ? ' ele-filter-active' : ''}`} onClick={() => setFilterSystem(s)}>{s}</button>
        ))}
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Seat Distribution: Winner vs Runner-Up vs Other</div>
        <div className="ele-card-sub">Stacked seat allocations across parliaments (top 10 shown)</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={seatsData} margin={{ left: 0, right: 10, top: 4, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.8rem', paddingTop: 8 }} />
            <Bar dataKey="winner" name="Winner Seats" stackId="a" fill={ACCENT} />
            <Bar dataKey="runner" name="Runner-Up Seats" stackId="a" fill="#f472b6" />
            <Bar dataKey="other" name="Other Seats" stackId="a" fill={SURF2} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Full Results Table</div>
        <div className="ele-card-sub">{filtered.length} elections shown</div>
        <div className="ele-table-wrap">
          <table className="ele-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Year</th>
                <th>Winner</th>
                <th>Seats</th>
                <th>Total Seats</th>
                <th>Seat %</th>
                <th>Vote %</th>
                <th>Runner-Up</th>
                <th>System</th>
                <th>Turnout</th>
              </tr>
            </thead>
            <tbody>
              {[...filtered].sort((a, b) => b.year - a.year).map((e, i) => (
                <tr key={i}>
                  <td className="ele-bold">{e.country}</td>
                  <td>{e.year}</td>
                  <td className="ele-bold">{e.winner}</td>
                  <td>{e.seats}</td>
                  <td>{e.total}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="ele-progress-bar">
                        <div className="ele-progress-fill" style={{ width: `${(e.seats / e.total * 100)}%`, background: ACCENT }} />
                      </div>
                      {(e.seats / e.total * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td>{e.pct}%</td>
                  <td>{e.runner_up} ({e.runner_seats})</td>
                  <td><span className="ele-badge ele-badge-other">{e.system}</span></td>
                  <td>{e.turnout}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReferendaTab() {
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(() => {
    if (filter === 'All') return REFERENDA;
    if (filter === 'Passed') return REFERENDA.filter(r => r.result === 'Yes');
    if (filter === 'Failed') return REFERENDA.filter(r => r.result !== 'Yes');
    return REFERENDA;
  }, [filter]);

  const chartData = useMemo(() =>
    [...REFERENDA].sort((a, b) => b.yes_pct - a.yes_pct).map(r => ({
      name: `${r.country} '${String(r.year).slice(2)}`,
      yes: r.yes_pct,
      no: r.no_pct,
    })),
    []
  );

  const turnoutChart = useMemo(() =>
    [...REFERENDA].sort((a, b) => b.turnout - a.turnout).map(r => ({
      name: `${r.country} '${String(r.year).slice(2)}`,
      turnout: r.turnout,
      passed: r.result === 'Yes' || r.result === 'Leave',
    })),
    []
  );

  return (
    <div>
      <p className="ele-section-sub">National referenda results covering constitutional, social, and political questions worldwide.</p>
      <div className="ele-filter-row">
        <span className="ele-filter-label">Filter:</span>
        {['All', 'Passed', 'Failed'].map(f => (
          <button key={f} className={`ele-filter-btn${filter === f ? ' ele-filter-active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="ele-grid-2">
        <div className="ele-card">
          <div className="ele-card-title">Yes/No Vote Shares</div>
          <div className="ele-card-sub">All tracked referenda sorted by Yes vote</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ left: 0, right: 10, top: 4, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 9 }} tickLine={false} axisLine={false} angle={-40} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.8rem', paddingTop: 8 }} />
              <Bar dataKey="yes" name="Yes %" stackId="a" fill="#22c55e" />
              <Bar dataKey="no" name="No %" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="ele-card">
          <div className="ele-card-title">Referendum Turnout</div>
          <div className="ele-card-sub">Voter participation rate per referendum</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={turnoutChart} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fill: TEXT2, fontSize: 10 }} tickLine={false} axisLine={false} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="turnout" name="Turnout %" radius={[0, 4, 4, 0]}>
                {turnoutChart.map((entry, i) => (
                  <Cell key={i} fill={entry.passed ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <span className="ele-section-title" style={{ fontSize: '0.95rem' }}>Referendum Details</span>
        <p className="ele-section-sub" style={{ marginBottom: 12 }}>{filtered.length} referenda shown</p>
      </div>
      {filtered.sort((a, b) => b.year - a.year).map((r, i) => (
        <div className="ele-ref-card" key={i}>
          <div className="ele-ref-header">
            <div>
              <div className="ele-ref-country">{r.country}</div>
              <div className="ele-ref-question">{r.question}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <span className="ele-ref-year">{r.year}</span>
              <span className={`ele-badge ${(r.result === 'Yes' || r.result === 'Leave') ? 'ele-badge-yes' : 'ele-badge-no'}`}>
                {r.result}
              </span>
            </div>
          </div>
          <div className="ele-ref-bars">
            <div className="ele-ref-bar-row">
              <div className="ele-ref-bar-label">Yes</div>
              <div className="ele-ref-bar-track">
                <div className="ele-ref-bar-fill-yes" style={{ width: `${r.yes_pct}%` }} />
              </div>
              <div className="ele-ref-bar-pct">{r.yes_pct}%</div>
            </div>
            <div className="ele-ref-bar-row">
              <div className="ele-ref-bar-label">No</div>
              <div className="ele-ref-bar-track">
                <div className="ele-ref-bar-fill-no" style={{ width: `${r.no_pct}%` }} />
              </div>
              <div className="ele-ref-bar-pct">{r.no_pct}%</div>
            </div>
          </div>
          <div className="ele-ref-footer">
            <div className="ele-ref-outcome">{r.outcome}</div>
            <div className="ele-ref-turnout">Turnout: {r.turnout}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PartyTrendsTab() {
  const [country, setCountry] = useState('USA');
  const data = PARTY_VOTE_TRENDS[country];

  const lineKeys = useMemo(() => {
    if (!data || !data.length) return [];
    return Object.keys(data[0]).filter(k => k !== 'year');
  }, [data]);

  const colorMap = { dem: '#3b82f6', rep: '#ef4444', lab: '#ef4444', con: '#3b82f6', left: '#ef4444', right: '#3b82f6' };
  const labelMap = {
    dem: 'Democrats', rep: 'Republicans',
    lab: 'Labour', con: 'Conservative',
    left: 'Left bloc', right: 'Right bloc',
  };

  const chartData = useMemo(() => (data || []).map(d => ({ ...d, name: String(d.year) })), [data]);

  const dominantParty = useMemo(() => {
    if (!data || !data.length || !lineKeys.length) return null;
    const wins = {};
    lineKeys.forEach(k => { wins[k] = 0; });
    data.forEach(d => {
      const top = lineKeys.reduce((a, b) => d[a] > d[b] ? a : b);
      wins[top]++;
    });
    return Object.entries(wins).sort((a, b) => b[1] - a[1])[0];
  }, [data, lineKeys]);

  const avgShares = useMemo(() => {
    if (!data || !data.length || !lineKeys.length) return {};
    return lineKeys.reduce((acc, k) => {
      acc[k] = (data.reduce((s, d) => s + (d[k] || 0), 0) / data.length).toFixed(1);
      return acc;
    }, {});
  }, [data, lineKeys]);

  return (
    <div>
      <p className="ele-section-sub">Longitudinal party vote share trends across elections, showing shifts in political alignment over time.</p>
      <div className="ele-filter-row">
        <span className="ele-filter-label">Country:</span>
        {Object.keys(PARTY_VOTE_TRENDS).map(c => (
          <button key={c} className={`ele-filter-btn${country === c ? ' ele-filter-active' : ''}`} onClick={() => setCountry(c)}>{c}</button>
        ))}
      </div>
      <div className="ele-grid-3" style={{ marginBottom: 24 }}>
        {lineKeys.map(k => (
          <div key={k} className="ele-kpi">
            <div className="ele-kpi-label">{labelMap[k] || k}</div>
            <div className="ele-kpi-value" style={{ color: colorMap[k] || ACCENT }}>{avgShares[k]}%</div>
            <div className="ele-kpi-detail">Average across {data.length} elections</div>
          </div>
        ))}
        {dominantParty && (
          <div className="ele-kpi">
            <div className="ele-kpi-label">Most Dominant</div>
            <div className="ele-kpi-value" style={{ color: colorMap[dominantParty[0]] || ACCENT }}>
              {labelMap[dominantParty[0]] || dominantParty[0]}
            </div>
            <div className="ele-kpi-detail">Won {dominantParty[1]} of {data.length} elections</div>
          </div>
        )}
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Vote Share Over Time — {country}</div>
        <div className="ele-card-sub">Party vote percentages across successive elections</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ left: 0, right: 20, top: 10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 80]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.82rem', paddingTop: 8 }} />
            {lineKeys.map(k => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                name={labelMap[k] || k}
                stroke={colorMap[k] || ACCENT}
                strokeWidth={2.5}
                dot={{ r: 5, fill: colorMap[k] || ACCENT, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Election Results Data — {country}</div>
        <div className="ele-card-sub">Raw vote share figures by year</div>
        <div className="ele-table-wrap">
          <table className="ele-table">
            <thead>
              <tr>
                <th>Year</th>
                {lineKeys.map(k => <th key={k}>{labelMap[k] || k} %</th>)}
                <th>Leading Party</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {[...data].sort((a, b) => b.year - a.year).map((d, i) => {
                const leader = lineKeys.reduce((a, b) => d[a] > d[b] ? a : b);
                const vals = lineKeys.map(k => d[k]).sort((a, b) => b - a);
                const margin = vals.length > 1 ? (vals[0] - vals[1]).toFixed(1) : 'N/A';
                return (
                  <tr key={i}>
                    <td className="ele-bold">{d.year}</td>
                    {lineKeys.map(k => (
                      <td key={k} style={{ color: k === leader ? TEXT1 : TEXT2, fontWeight: k === leader ? 700 : 400 }}>
                        {d[k]}%
                      </td>
                    ))}
                    <td>
                      <span className="ele-badge" style={{ background: `${colorMap[leader]}22`, color: colorMap[leader] || ACCENT }}>
                        {labelMap[leader] || leader}
                      </span>
                    </td>
                    <td style={{ color: parseFloat(margin) < 3 ? '#f59e0b' : '#4ade80', fontWeight: 600 }}>
                      +{margin}pp
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TurnoutTab() {
  const [filterType, setFilterType] = useState('All');
  const filtered = useMemo(() => {
    if (filterType === 'Compulsory') return TURNOUT_DATA.filter(d => d.compulsory);
    if (filterType === 'Voluntary') return TURNOUT_DATA.filter(d => !d.compulsory);
    return TURNOUT_DATA;
  }, [filterType]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => b.turnout - a.turnout), [filtered]);

  const avgCompulsory = useMemo(() => {
    const comp = TURNOUT_DATA.filter(d => d.compulsory);
    return (comp.reduce((s, d) => s + d.turnout, 0) / comp.length).toFixed(1);
  }, []);

  const avgVoluntary = useMemo(() => {
    const vol = TURNOUT_DATA.filter(d => !d.compulsory);
    return (vol.reduce((s, d) => s + d.turnout, 0) / vol.length).toFixed(1);
  }, []);

  const chartData = useMemo(() => sorted.map(d => ({
    name: d.country,
    turnout: d.turnout,
    compulsory: d.compulsory,
  })), [sorted]);

  const distributionData = useMemo(() => {
    const buckets = [
      { range: '40-50%', min: 40, max: 50, count: 0 },
      { range: '50-60%', min: 50, max: 60, count: 0 },
      { range: '60-70%', min: 60, max: 70, count: 0 },
      { range: '70-80%', min: 70, max: 80, count: 0 },
      { range: '80-90%', min: 80, max: 90, count: 0 },
      { range: '90%+', min: 90, max: 101, count: 0 },
    ];
    TURNOUT_DATA.forEach(d => {
      const b = buckets.find(b => d.turnout >= b.min && d.turnout < b.max);
      if (b) b.count++;
    });
    return buckets;
  }, []);

  return (
    <div>
      <p className="ele-section-sub">Voter turnout analysis across democracies, comparing compulsory and voluntary voting systems.</p>
      <div className="ele-grid-3">
        <div className="ele-kpi">
          <div className="ele-kpi-label">Global Average</div>
          <div className="ele-kpi-value">{(TURNOUT_DATA.reduce((s, d) => s + d.turnout, 0) / TURNOUT_DATA.length).toFixed(1)}%</div>
          <div className="ele-kpi-detail">Across {TURNOUT_DATA.length} nations</div>
        </div>
        <div className="ele-kpi">
          <div className="ele-kpi-label">Avg — Compulsory</div>
          <div className="ele-kpi-value" style={{ color: '#f59e0b' }}>{avgCompulsory}%</div>
          <div className="ele-kpi-detail">{TURNOUT_DATA.filter(d => d.compulsory).length} countries with mandatory voting</div>
        </div>
        <div className="ele-kpi">
          <div className="ele-kpi-label">Avg — Voluntary</div>
          <div className="ele-kpi-value" style={{ color: ACCENT }}>{avgVoluntary}%</div>
          <div className="ele-kpi-detail">{TURNOUT_DATA.filter(d => !d.compulsory).length} countries with voluntary voting</div>
        </div>
      </div>
      <div className="ele-filter-row">
        <span className="ele-filter-label">Type:</span>
        {['All', 'Compulsory', 'Voluntary'].map(t => (
          <button key={t} className={`ele-filter-btn${filterType === t ? ' ele-filter-active' : ''}`} onClick={() => setFilterType(t)}>{t}</button>
        ))}
      </div>
      <div className="ele-card">
        <div className="ele-card-title">Voter Turnout by Country</div>
        <div className="ele-card-sub">Latest general election data — sorted descending</div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ left: 0, right: 10, top: 4, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} tickLine={false} axisLine={false} angle={-40} textAnchor="end" interval={0} />
            <YAxis domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="turnout" name="Turnout %" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.compulsory ? '#f59e0b' : ACCENT} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: '0.75rem', color: TEXT3, marginTop: 8 }}>
          <span style={{ color: '#f59e0b' }}>■</span> Compulsory voting &nbsp;
          <span style={{ color: ACCENT }}>■</span> Voluntary
        </div>
      </div>
      <div className="ele-grid-2">
        <div className="ele-card">
          <div className="ele-card-title">Turnout Distribution</div>
          <div className="ele-card-sub">Number of countries in each turnout range</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distributionData} margin={{ left: 0, right: 10, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="range" tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Countries" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="ele-card">
          <div className="ele-card-title">Ranked Turnout List</div>
          <div className="ele-card-sub">{sorted.length} countries shown</div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {sorted.map((d, i) => (
              <div className="ele-turnout-item" key={i}>
                <span style={{ width: 22, color: TEXT3, fontSize: '0.75rem', flexShrink: 0 }}>#{i + 1}</span>
                <span className="ele-turnout-country">{d.country}</span>
                <div className="ele-turnout-track">
                  <div
                    className="ele-turnout-fill"
                    style={{
                      width: `${d.turnout}%`,
                      background: d.compulsory ? '#f59e0b' : ACCENT,
                    }}
                  />
                </div>
                <span className="ele-turnout-pct">{d.turnout}%</span>
                <span className={`ele-badge ${d.compulsory ? 'ele-badge-comp' : 'ele-badge-vol'}`} style={{ flexShrink: 0 }}>
                  {d.compulsory ? 'Comp.' : 'Vol.'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ElectionsStatNations() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="ele-root">
      <style>{CSS}</style>
      <div className="ele-header">
        <div className="ele-header-inner">
          <div className="ele-header-tag">World · Elections</div>
          <h1>Global Elections Tracker</h1>
          <p className="ele-header-sub">
            Comprehensive data on presidential elections, parliamentary results, referenda, party vote trends, and voter turnout across major democracies worldwide.
          </p>
          <div className="ele-stats-row">
            <div className="ele-stat-pill">
              <span className="ele-stat-pill-num">{PRESIDENTIAL_ELECTIONS.length}</span>
              <span className="ele-stat-pill-label">Presidential</span>
            </div>
            <div className="ele-stat-pill">
              <span className="ele-stat-pill-num">{PARLIAMENTARY_ELECTIONS.length}</span>
              <span className="ele-stat-pill-label">Parliamentary</span>
            </div>
            <div className="ele-stat-pill">
              <span className="ele-stat-pill-num">{REFERENDA.length}</span>
              <span className="ele-stat-pill-label">Referenda</span>
            </div>
            <div className="ele-stat-pill">
              <span className="ele-stat-pill-num">{TURNOUT_DATA.length}</span>
              <span className="ele-stat-pill-label">Nations Tracked</span>
            </div>
            <div className="ele-stat-pill">
              <span className="ele-stat-pill-num">3</span>
              <span className="ele-stat-pill-label">Party Trend Series</span>
            </div>
          </div>
        </div>
      </div>
      <div className="ele-tabs">
        <div className="ele-tab-bar">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ele-tab-btn${activeTab === tab ? ' ele-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'Overview' && <OverviewTab />}
        {activeTab === 'Presidential' && <PresidentialTab />}
        {activeTab === 'Parliamentary' && <ParliamentaryTab />}
        {activeTab === 'Referenda' && <ReferendaTab />}
        {activeTab === 'Party Trends' && <PartyTrendsTab />}
        {activeTab === 'Turnout' && <TurnoutTab />}
      </div>
    </div>
  );
}
