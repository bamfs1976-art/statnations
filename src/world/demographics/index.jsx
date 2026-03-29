import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const ACCENT = '#0ea5e9';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURF2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const COUNTRIES = [
  {name:'India',pop2024:1441,pop2000:1053,pop1980:699,growth:0.9,density:479,urban:36,median_age:28.4,fertility:2.0,life_exp:70.8},
  {name:'China',pop2024:1425,pop2000:1268,pop1980:981,growth:-0.2,density:151,urban:65,median_age:39.0,fertility:1.0,life_exp:78.6},
  {name:'USA',pop2024:341,pop2000:282,pop1980:228,growth:0.5,density:36,urban:83,median_age:38.9,fertility:1.7,life_exp:79.3},
  {name:'Indonesia',pop2024:278,pop2000:212,pop1980:148,growth:0.8,density:153,urban:59,median_age:30.2,fertility:2.1,life_exp:71.7},
  {name:'Pakistan',pop2024:245,pop2000:154,pop1980:83,growth:1.9,density:318,urban:38,median_age:22.0,fertility:3.3,life_exp:67.7},
  {name:'Brazil',pop2024:216,pop2000:175,pop1980:122,growth:0.6,density:25,urban:88,median_age:33.5,fertility:1.7,life_exp:75.5},
  {name:'Nigeria',pop2024:229,pop2000:122,pop1980:72,growth:2.4,density:249,urban:54,median_age:18.6,fertility:4.6,life_exp:62.9},
  {name:'Bangladesh',pop2024:173,pop2000:133,pop1980:87,growth:1.0,density:1119,urban:40,median_age:28.4,fertility:2.0,life_exp:74.4},
  {name:'Ethiopia',pop2024:129,pop2000:68,pop1980:38,growth:2.4,density:128,urban:24,median_age:20.3,fertility:3.9,life_exp:67.4},
  {name:'Mexico',pop2024:130,pop2000:100,pop1980:68,growth:0.8,density:66,urban:81,median_age:29.3,fertility:1.8,life_exp:75.5},
  {name:'Russia',pop2024:144,pop2000:147,pop1980:139,growth:-0.2,density:8,urban:75,median_age:40.3,fertility:1.5,life_exp:73.4},
  {name:'DR Congo',pop2024:104,pop2000:50,pop1980:28,growth:3.1,density:46,urban:47,median_age:17.7,fertility:5.6,life_exp:62.1},
  {name:'Germany',pop2024:84,pop2000:82,pop1980:78,growth:0.1,density:236,urban:77,median_age:44.6,fertility:1.6,life_exp:81.3},
  {name:'Japan',pop2024:123,pop2000:127,pop1980:117,growth:-0.5,density:337,urban:92,median_age:49.0,fertility:1.2,life_exp:84.3},
  {name:'Philippines',pop2024:117,pop2000:77,pop1980:49,growth:1.4,density:391,urban:48,median_age:25.3,fertility:2.7,life_exp:72.8},
  {name:'Tanzania',pop2024:67,pop2000:34,pop1980:18,growth:2.9,density:71,urban:37,median_age:18.5,fertility:4.6,life_exp:67.3},
  {name:'UK',pop2024:68,pop2000:59,pop1980:56,growth:0.5,density:279,urban:84,median_age:40.5,fertility:1.6,life_exp:81.3},
  {name:'Italy',pop2024:59,pop2000:57,pop1980:57,growth:-0.3,density:201,urban:72,median_age:47.2,fertility:1.2,life_exp:83.5},
  {name:'France',pop2024:68,pop2000:61,pop1980:54,growth:0.3,density:119,urban:81,median_age:42.5,fertility:1.8,life_exp:82.9},
  {name:'South Korea',pop2024:52,pop2000:47,pop1980:38,growth:-0.1,density:527,urban:81,median_age:44.7,fertility:0.7,life_exp:83.9},
  {name:'Colombia',pop2024:52,pop2000:39,pop1980:28,growth:0.7,density:46,urban:82,median_age:32.6,fertility:1.7,life_exp:76.5},
  {name:'Spain',pop2024:47,pop2000:40,pop1980:38,growth:0.0,density:94,urban:81,median_age:44.5,fertility:1.2,life_exp:83.3},
  {name:'Uganda',pop2024:48,pop2000:24,pop1980:13,growth:3.1,density:213,urban:26,median_age:16.7,fertility:4.6,life_exp:65.6},
  {name:'Argentina',pop2024:46,pop2000:37,pop1980:28,growth:0.9,density:17,urban:93,median_age:31.8,fertility:2.2,life_exp:76.7},
  {name:'Kenya',pop2024:56,pop2000:31,pop1980:17,growth:2.1,density:97,urban:29,median_age:20.8,fertility:3.2,life_exp:67.4},
  {name:'Vietnam',pop2024:98,pop2000:78,pop1980:54,growth:0.8,density:312,urban:39,median_age:31.5,fertility:1.9,life_exp:75.5},
  {name:'Australia',pop2024:27,pop2000:19,pop1980:15,growth:1.4,density:3,urban:86,median_age:38.6,fertility:1.6,life_exp:83.4},
  {name:'Saudi Arabia',pop2024:36,pop2000:21,pop1980:10,growth:1.6,density:17,urban:85,median_age:30.5,fertility:2.3,life_exp:76.6},
];

const WORLD_MILESTONES = [
  {year:1804,pop:1,note:'First billion'},
  {year:1927,pop:2,note:'Second billion (123 years)'},
  {year:1960,pop:3,note:'Third billion (33 years)'},
  {year:1974,pop:4,note:'Fourth billion (14 years)'},
  {year:1987,pop:5,note:'Fifth billion (13 years)'},
  {year:1999,pop:6,note:'Sixth billion (12 years)'},
  {year:2011,pop:7,note:'Seventh billion (12 years)'},
  {year:2022,pop:8,note:'Eighth billion (11 years)'},
  {year:2037,pop:9,note:'Ninth billion (projected)'},
  {year:2058,pop:10,note:'Tenth billion (projected)'},
];

const REGIONS = [
  {name:'Asia',pop2024:4780,pct:59.4,growth:0.7,urban:53,median_age:32.0},
  {name:'Africa',pop2024:1460,pct:18.1,growth:2.4,urban:44,median_age:20.0},
  {name:'Europe',pop2024:745,pct:9.3,growth:-0.1,urban:75,median_age:43.3},
  {name:'Latin America',pop2024:668,pct:8.3,growth:0.7,urban:82,median_age:31.0},
  {name:'Northern America',pop2024:380,pct:4.7,growth:0.5,urban:83,median_age:38.8},
  {name:'Oceania',pop2024:45,pct:0.6,growth:1.2,urban:68,median_age:34.3},
];

const MEGA_CITIES = [
  {city:'Tokyo',country:'Japan',pop:37.1},
  {city:'Delhi',country:'India',pop:33.8},
  {city:'Shanghai',country:'China',pop:29.9},
  {city:'Dhaka',country:'Bangladesh',pop:23.9},
  {city:'São Paulo',country:'Brazil',pop:23.1},
  {city:'Cairo',country:'Egypt',pop:22.6},
  {city:'Mexico City',country:'Mexico',pop:22.5},
  {city:'Beijing',country:'China',pop:22.2},
  {city:'Mumbai',country:'India',pop:21.7},
  {city:'Osaka',country:'Japan',pop:19.1},
  {city:'Chongqing',country:'China',pop:17.4},
  {city:'Karachi',country:'Pakistan',pop:17.2},
  {city:'Istanbul',country:'Turkey',pop:15.7},
  {city:'Lagos',country:'Nigeria',pop:15.3},
  {city:'Buenos Aires',country:'Argentina',pop:15.4},
];

const REGION_COLORS = ['#0ea5e9','#f59e0b','#10b981','#a855f7','#ef4444','#06b6d4'];

const TABS = ['Overview','Population','Growth','Urbanisation','Age Structure','Migration'];

const CSS = `
  .dem-wrap { background:${BG}; min-height:100vh; font-family:'Inter',system-ui,sans-serif; color:${TEXT1}; }
  .dem-header { background:linear-gradient(135deg,#001a2e 0%,#003d6b 60%,#001a2e 100%); padding:40px 32px 32px; border-bottom:1px solid ${BORDER}; }
  .dem-header-inner { max-width:1200px; margin:0 auto; }
  .dem-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(14,165,233,0.15); border:1px solid rgba(14,165,233,0.3); border-radius:20px; padding:4px 12px; font-size:11px; color:${ACCENT}; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px; }
  .dem-title { font-size:32px; font-weight:700; color:${TEXT1}; margin:0 0 6px; line-height:1.2; }
  .dem-subtitle { font-size:14px; color:${TEXT2}; margin:0 0 24px; }
  .dem-kpi-row { display:flex; gap:16px; flex-wrap:wrap; margin-top:8px; }
  .dem-kpi { background:rgba(255,255,255,0.05); border:1px solid ${BORDER}; border-radius:10px; padding:14px 20px; min-width:140px; }
  .dem-kpi-val { font-size:22px; font-weight:700; color:${ACCENT}; }
  .dem-kpi-lbl { font-size:11px; color:${TEXT3}; text-transform:uppercase; letter-spacing:0.8px; margin-top:2px; }
  .dem-tabs { background:${SURFACE}; border-bottom:1px solid ${BORDER}; padding:0 32px; position:sticky; top:0; z-index:10; }
  .dem-tabs-inner { max-width:1200px; margin:0 auto; display:flex; gap:4px; overflow-x:auto; }
  .dem-tab { padding:14px 18px; font-size:13px; font-weight:500; color:${TEXT3}; border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:color 0.2s,border-color 0.2s; }
  .dem-tab:hover { color:${TEXT2}; }
  .dem-tab.active { color:${ACCENT}; border-bottom-color:${ACCENT}; }
  .dem-body { max-width:1200px; margin:0 auto; padding:28px 32px 48px; }
  .dem-section-title { font-size:18px; font-weight:600; color:${TEXT1}; margin:0 0 4px; }
  .dem-section-sub { font-size:13px; color:${TEXT3}; margin:0 0 20px; }
  .dem-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
  .dem-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:24px; }
  .dem-card { background:${SURFACE}; border:1px solid ${BORDER}; border-radius:12px; padding:20px; }
  .dem-card-title { font-size:13px; font-weight:600; color:${TEXT2}; text-transform:uppercase; letter-spacing:0.7px; margin:0 0 16px; }
  .dem-full { grid-column:1/-1; }
  .dem-chart-wrap { width:100%; }
  .dem-table { width:100%; border-collapse:collapse; font-size:13px; }
  .dem-table th { color:${TEXT3}; font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.7px; padding:8px 12px; border-bottom:1px solid ${BORDER}; text-align:left; }
  .dem-table td { padding:9px 12px; border-bottom:1px solid ${BORDER}; color:${TEXT2}; }
  .dem-table tr:last-child td { border-bottom:none; }
  .dem-table tr:hover td { background:rgba(255,255,255,0.03); color:${TEXT1}; }
  .dem-rank { font-weight:700; color:${TEXT3}; width:28px; display:inline-block; }
  .dem-bar-inline { display:inline-block; height:6px; border-radius:3px; vertical-align:middle; margin-left:8px; }
  .dem-pill { display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600; }
  .dem-pill-up { background:rgba(16,185,129,0.15); color:#10b981; }
  .dem-pill-dn { background:rgba(239,68,68,0.15); color:#ef4444; }
  .dem-pill-flat { background:rgba(148,163,184,0.15); color:${TEXT2}; }
  .dem-milestone { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid ${BORDER}; }
  .dem-milestone:last-child { border-bottom:none; }
  .dem-milestone-year { font-size:15px; font-weight:700; color:${ACCENT}; min-width:48px; }
  .dem-milestone-pop { font-size:20px; font-weight:800; color:${TEXT1}; min-width:28px; }
  .dem-milestone-note { font-size:12px; color:${TEXT3}; }
  .dem-future { opacity:0.6; }
  .dem-region-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid ${BORDER}; }
  .dem-region-row:last-child { border-bottom:none; }
  .dem-region-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .dem-region-name { font-size:13px; color:${TEXT1}; min-width:130px; font-weight:500; }
  .dem-region-bar-bg { flex:1; height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; }
  .dem-region-bar-fill { height:100%; border-radius:4px; }
  .dem-region-pct { font-size:12px; color:${TEXT2}; min-width:38px; text-align:right; }
  .dem-scatter-legend { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:10px; }
  .dem-scatter-legend-item { display:flex; align-items:center; gap:6px; font-size:12px; color:${TEXT2}; }
  .dem-scatter-dot { width:10px; height:10px; border-radius:50%; }
  .dem-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
  .dem-stat-box { background:${SURF2}; border:1px solid ${BORDER}; border-radius:10px; padding:14px; text-align:center; }
  .dem-stat-val { font-size:20px; font-weight:700; color:${TEXT1}; }
  .dem-stat-lbl { font-size:11px; color:${TEXT3}; margin-top:4px; text-transform:uppercase; letter-spacing:0.6px; }
  .dem-highlight { color:${ACCENT}; }
  .dem-city-list { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .dem-city-item { display:flex; align-items:center; gap:10px; padding:8px 10px; background:${SURF2}; border-radius:8px; }
  .dem-city-rank { font-size:11px; font-weight:700; color:${TEXT3}; min-width:20px; }
  .dem-city-name { font-size:13px; color:${TEXT1}; font-weight:500; flex:1; }
  .dem-city-country { font-size:11px; color:${TEXT3}; }
  .dem-city-pop { font-size:13px; font-weight:700; color:${ACCENT}; }
  .dem-age-note { font-size:12px; color:${TEXT3}; margin-top:8px; line-height:1.6; }
  .dem-fertility-band { display:flex; align-items:center; gap:8px; padding:6px 0; }
  .dem-fertility-label { font-size:12px; color:${TEXT2}; min-width:100px; }
  .dem-fertility-bar-bg { flex:1; height:10px; background:rgba(255,255,255,0.05); border-radius:5px; overflow:hidden; }
  .dem-fertility-fill { height:100%; border-radius:5px; }
  .dem-migration-card { background:${SURF2}; border:1px solid ${BORDER}; border-radius:10px; padding:16px 18px; }
  .dem-migration-title { font-size:13px; font-weight:600; color:${TEXT2}; margin-bottom:10px; }
  .dem-mig-row { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid ${BORDER}; }
  .dem-mig-row:last-child { border-bottom:none; }
  .dem-mig-country { font-size:13px; color:${TEXT1}; }
  .dem-mig-val { font-size:13px; font-weight:600; }
  @media(max-width:768px){
    .dem-grid-2,.dem-grid-3{grid-template-columns:1fr;}
    .dem-stat-grid{grid-template-columns:repeat(2,1fr);}
    .dem-city-list{grid-template-columns:1fr;}
    .dem-header{padding:24px 16px 20px;}
    .dem-body{padding:16px 16px 40px;}
    .dem-tabs{padding:0 16px;}
    .dem-kpi-row{gap:10px;}
  }
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', fontSize: 12, color: TEXT2 }}>
      {label && <div style={{ color: TEXT1, fontWeight: 600, marginBottom: 6 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || ACCENT, marginTop: 2 }}>
          {p.name}: <span style={{ color: TEXT1, fontWeight: 600 }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: TEXT1, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: TEXT2 }}>Growth: <span style={{ color: ACCENT, fontWeight: 600 }}>{d.growth}%</span></div>
      <div style={{ color: TEXT2 }}>Fertility: <span style={{ color: ACCENT, fontWeight: 600 }}>{d.fertility}</span></div>
      <div style={{ color: TEXT2 }}>Median Age: <span style={{ color: ACCENT, fontWeight: 600 }}>{d.median_age} yrs</span></div>
      <div style={{ color: TEXT2 }}>Population: <span style={{ color: ACCENT, fontWeight: 600 }}>{d.pop2024}M</span></div>
    </div>
  );
};

function getPillClass(v) {
  if (v > 0.2) return 'dem-pill dem-pill-up';
  if (v < 0) return 'dem-pill dem-pill-dn';
  return 'dem-pill dem-pill-flat';
}

function TabOverview() {
  const top10 = useMemo(() => [...COUNTRIES].sort((a, b) => b.pop2024 - a.pop2024).slice(0, 10), []);
  const totalWorld = 8078;

  return (
    <div>
      <div className="dem-stat-grid">
        <div className="dem-stat-box"><div className="dem-stat-val dem-highlight">8.08B</div><div className="dem-stat-lbl">World Population</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">0.9%</div><div className="dem-stat-lbl">Annual Growth</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">57%</div><div className="dem-stat-lbl">Urban Population</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">30.5</div><div className="dem-stat-lbl">Median Age (Global)</div></div>
      </div>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Top 10 Countries by Population (2024)</div>
          <table className="dem-table">
            <thead>
              <tr><th>#</th><th>Country</th><th>Population (M)</th><th>Share</th></tr>
            </thead>
            <tbody>
              {top10.map((c, i) => (
                <tr key={c.name}>
                  <td><span className="dem-rank">{i + 1}</span></td>
                  <td style={{ color: TEXT1, fontWeight: 500 }}>{c.name}</td>
                  <td>
                    {c.pop2024.toLocaleString()}M
                    <span
                      className="dem-bar-inline"
                      style={{ width: `${(c.pop2024 / 1441) * 60}px`, background: ACCENT, opacity: 0.6 }}
                    />
                  </td>
                  <td style={{ color: TEXT3 }}>{((c.pop2024 / totalWorld) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Population by World Region</div>
          {REGIONS.map((r, i) => (
            <div className="dem-region-row" key={r.name}>
              <div className="dem-region-dot" style={{ background: REGION_COLORS[i] }} />
              <div className="dem-region-name">{r.name}</div>
              <div className="dem-region-bar-bg">
                <div
                  className="dem-region-bar-fill"
                  style={{ width: `${r.pct}%`, background: REGION_COLORS[i], opacity: 0.8 }}
                />
              </div>
              <div className="dem-region-pct">{r.pct}%</div>
            </div>
          ))}
          <div className="dem-chart-wrap" style={{ marginTop: 20, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REGIONS}
                  dataKey="pop2024"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {REGIONS.map((r, i) => <Cell key={r.name} fill={REGION_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v.toLocaleString()}M`, 'Population']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dem-card" style={{ marginBottom: 24 }}>
        <div className="dem-card-title">World Population Milestones</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          {WORLD_MILESTONES.map((m) => (
            <div key={m.year} className={`dem-milestone${m.year > 2025 ? ' dem-future' : ''}`}>
              <div className="dem-milestone-year">{m.year}</div>
              <div className="dem-milestone-pop">{m.pop}B</div>
              <div className="dem-milestone-note">{m.note}{m.year > 2025 ? ' *' : ''}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: TEXT3, marginTop: 12 }}>* Projected estimates based on UN medium variant</div>
      </div>

      <div className="dem-card">
        <div className="dem-card-title">Regional Snapshot</div>
        <table className="dem-table">
          <thead>
            <tr><th>Region</th><th>Population (M)</th><th>Growth %</th><th>Urban %</th><th>Median Age</th></tr>
          </thead>
          <tbody>
            {REGIONS.map((r, i) => (
              <tr key={r.name}>
                <td>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: REGION_COLORS[i], marginRight: 8, verticalAlign: 'middle' }} />
                  <span style={{ color: TEXT1 }}>{r.name}</span>
                </td>
                <td>{r.pop2024.toLocaleString()}M</td>
                <td>
                  <span className={getPillClass(r.growth)}>{r.growth > 0 ? '+' : ''}{r.growth}%</span>
                </td>
                <td>{r.urban}%</td>
                <td>{r.median_age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabPopulation() {
  const [sortKey, setSortKey] = useState('pop2024');
  const sorted = useMemo(() => [...COUNTRIES].sort((a, b) => b[sortKey] - a[sortKey]), [sortKey]);
  const top15 = useMemo(() => [...COUNTRIES].sort((a, b) => b.pop2024 - a.pop2024).slice(0, 15), []);

  const growthData = useMemo(() => top15.map(c => ({
    name: c.name,
    '1980': c.pop1980,
    '2000': c.pop2000,
    '2024': c.pop2024,
  })), [top15]);

  return (
    <div>
      <p className="dem-section-sub">Population figures in millions. Historical comparison across 1980, 2000, and 2024.</p>

      <div className="dem-card" style={{ marginBottom: 24 }}>
        <div className="dem-card-title">Population Growth 1980 – 2024 (Top 15 Countries)</div>
        <div className="dem-chart-wrap" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickFormatter={v => `${v}M`} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}M`, '']} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12, paddingTop: 16 }} />
              <Bar dataKey="1980" fill="#334155" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2000" fill="#0369a1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2024" fill={ACCENT} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dem-card">
        <div className="dem-card-title">
          Full Country Table
          <span style={{ marginLeft: 12, fontSize: 11, color: TEXT3, fontWeight: 400 }}>Sort by:</span>
          {['pop2024','pop2000','pop1980','density'].map(k => (
            <button
              key={k}
              onClick={() => setSortKey(k)}
              style={{
                marginLeft: 8, padding: '2px 10px', borderRadius: 6, border: `1px solid ${sortKey === k ? ACCENT : BORDER}`,
                background: sortKey === k ? 'rgba(14,165,233,0.15)' : 'transparent',
                color: sortKey === k ? ACCENT : TEXT3, fontSize: 11, cursor: 'pointer'
              }}
            >
              {k === 'pop2024' ? '2024' : k === 'pop2000' ? '2000' : k === 'pop1980' ? '1980' : 'Density'}
            </button>
          ))}
        </div>
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          <table className="dem-table">
            <thead>
              <tr><th>#</th><th>Country</th><th>2024 Pop (M)</th><th>2000 Pop (M)</th><th>1980 Pop (M)</th><th>Density /km²</th></tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.name}>
                  <td style={{ color: TEXT3 }}>{i + 1}</td>
                  <td style={{ color: TEXT1, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: ACCENT, fontWeight: 600 }}>{c.pop2024.toLocaleString()}M</td>
                  <td>{c.pop2000.toLocaleString()}M</td>
                  <td>{c.pop1980.toLocaleString()}M</td>
                  <td>
                    {c.density.toLocaleString()}
                    <span className="dem-bar-inline" style={{ width: `${Math.min((c.density / 1119) * 50, 50)}px`, background: '#f59e0b', opacity: 0.5 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabGrowth() {
  const scatterData = useMemo(() => COUNTRIES.map(c => ({
    ...c,
    x: c.fertility,
    y: c.growth,
    z: c.pop2024,
  })), []);

  const byGrowth = useMemo(() => [...COUNTRIES].sort((a, b) => b.growth - a.growth), []);
  const fastest = byGrowth.slice(0, 8);
  const slowest = byGrowth.slice(-8).reverse();

  return (
    <div>
      <p className="dem-section-sub">Annual population growth rates and fertility relationship across countries.</p>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Fastest Growing Populations</div>
          {fastest.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{c.name}</span>
              <div style={{ flex: 2, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(c.growth / 3.1) * 100}%`, height: '100%', background: '#10b981', borderRadius: 4 }} />
              </div>
              <span className="dem-pill dem-pill-up" style={{ minWidth: 48, textAlign: 'center' }}>+{c.growth}%</span>
            </div>
          ))}
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Declining / Slowest Growth</div>
          {slowest.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{c.name}</span>
              <div style={{ flex: 2, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${Math.abs(c.growth / 0.5) * 100}%`, height: '100%', background: '#ef4444', borderRadius: 4 }} />
              </div>
              <span className={getPillClass(c.growth)} style={{ minWidth: 48, textAlign: 'center' }}>
                {c.growth > 0 ? '+' : ''}{c.growth}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dem-card" style={{ marginBottom: 24 }}>
        <div className="dem-card-title">Fertility Rate vs. Population Growth Rate (bubble size = population)</div>
        <div className="dem-chart-wrap" style={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="x" name="Fertility" type="number" domain={[0.5, 6]} tick={{ fill: TEXT3, fontSize: 11 }} label={{ value: 'Fertility Rate', position: 'insideBottom', offset: -10, fill: TEXT3, fontSize: 12 }} />
              <YAxis dataKey="y" name="Growth" type="number" domain={[-1, 4]} tick={{ fill: TEXT3, fontSize: 11 }} label={{ value: 'Growth %', angle: -90, position: 'insideLeft', fill: TEXT3, fontSize: 12 }} />
              <ZAxis dataKey="z" range={[40, 600]} />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter data={scatterData} fill={ACCENT} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dem-card">
        <div className="dem-card-title">Growth Rate Overview — All Countries</div>
        <div className="dem-chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...COUNTRIES].sort((a, b) => b.growth - a.growth)}
              margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Growth Rate']} />
              <Bar dataKey="growth" name="Growth Rate" radius={[3, 3, 0, 0]}>
                {[...COUNTRIES].sort((a, b) => b.growth - a.growth).map((c) => (
                  <Cell key={c.name} fill={c.growth >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function TabUrbanisation() {
  const byUrban = useMemo(() => [...COUNTRIES].sort((a, b) => b.urban - a.urban), []);
  const cityData = useMemo(() => [...MEGA_CITIES].sort((a, b) => b.pop - a.pop), []);

  const urbanVsLifeExp = useMemo(() => COUNTRIES.map(c => ({
    name: c.name,
    x: c.urban,
    y: c.life_exp,
    z: c.pop2024,
  })), []);

  return (
    <div>
      <p className="dem-section-sub">Urban population share, megacity rankings, and the urbanisation–development relationship.</p>

      <div className="dem-stat-grid">
        <div className="dem-stat-box"><div className="dem-stat-val dem-highlight">57%</div><div className="dem-stat-lbl">Global Urban Share</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">33</div><div className="dem-stat-lbl">Megacities (10M+)</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">37.1M</div><div className="dem-stat-lbl">Largest City (Tokyo)</div></div>
        <div className="dem-stat-box"><div className="dem-stat-val">68%</div><div className="dem-stat-lbl">Urban by 2050 (proj.)</div></div>
      </div>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Urban Population % by Country</div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {byUrban.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: TEXT1, fontSize: 12, fontWeight: 500, minWidth: 110 }}>{c.name}</span>
                <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${c.urban}%`, height: '100%', borderRadius: 4,
                    background: c.urban >= 80 ? ACCENT : c.urban >= 50 ? '#38bdf8' : '#0369a1',
                  }} />
                </div>
                <span style={{ color: TEXT2, fontSize: 12, minWidth: 36, textAlign: 'right', fontWeight: 600 }}>{c.urban}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Top 15 Megacities (millions)</div>
          <div className="dem-city-list">
            {cityData.map((c, i) => (
              <div key={c.city} className="dem-city-item">
                <span className="dem-city-rank">{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="dem-city-name">{c.city}</div>
                  <div className="dem-city-country">{c.country}</div>
                </div>
                <span className="dem-city-pop">{c.pop}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dem-card">
        <div className="dem-card-title">Urbanisation vs Life Expectancy (bubble = population)</div>
        <div className="dem-chart-wrap" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="x" name="Urban %" type="number" domain={[0, 100]} tick={{ fill: TEXT3, fontSize: 11 }} label={{ value: 'Urban Population %', position: 'insideBottom', offset: -10, fill: TEXT3, fontSize: 12 }} />
              <YAxis dataKey="y" name="Life Exp" type="number" domain={[55, 90]} tick={{ fill: TEXT3, fontSize: 11 }} label={{ value: 'Life Expectancy', angle: -90, position: 'insideLeft', fill: TEXT3, fontSize: 12 }} />
              <ZAxis dataKey="z" range={[30, 500]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                    <div style={{ color: TEXT1, fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
                    <div style={{ color: TEXT2 }}>Urban: <span style={{ color: ACCENT, fontWeight: 600 }}>{d?.x}%</span></div>
                    <div style={{ color: TEXT2 }}>Life Exp: <span style={{ color: ACCENT, fontWeight: 600 }}>{d?.y} yrs</span></div>
                  </div>
                );
              }} />
              <Scatter data={urbanVsLifeExp} fill="#10b981" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function TabAgeStructure() {
  const ageSorted = useMemo(() => [...COUNTRIES].sort((a, b) => b.median_age - a.median_age), []);
  const oldest = ageSorted.slice(0, 10);
  const youngest = [...ageSorted].reverse().slice(0, 10);

  const radarData = useMemo(() => {
    const picks = ['Japan','Nigeria','Germany','India','USA','Brazil'];
    return picks.map(name => {
      const c = COUNTRIES.find(x => x.name === name);
      return {
        country: name,
        'Median Age': c.median_age,
        'Fertility': c.fertility * 10,
        'Life Exp': c.life_exp,
        'Urban %': c.urban,
        'Growth x10': c.growth * 10 + 20,
      };
    });
  }, []);

  const fertilityBands = useMemo(() => {
    const bands = [
      { label: 'Sub-replacement (<2.1)', min: 0, max: 2.1 },
      { label: 'Replacement (~2.1)', min: 2.0, max: 2.2 },
      { label: 'Moderate (2.1–3.5)', min: 2.1, max: 3.5 },
      { label: 'High (3.5–5.0)', min: 3.5, max: 5.0 },
      { label: 'Very high (>5.0)', min: 5.0, max: 10 },
    ];
    return bands.map(b => ({
      ...b,
      count: COUNTRIES.filter(c => c.fertility >= b.min && c.fertility < b.max).length,
    }));
  }, []);

  return (
    <div>
      <p className="dem-section-sub">Median age, fertility rates, and age structure comparisons across nations.</p>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Oldest Populations (Median Age)</div>
          {oldest.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT3, fontSize: 12, minWidth: 20 }}>{i + 1}</span>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{c.name}</span>
              <div style={{ flex: 2, height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(c.median_age / 49) * 100}%`, height: '100%', background: '#a855f7', borderRadius: 4 }} />
              </div>
              <span style={{ color: '#a855f7', fontWeight: 700, fontSize: 13, minWidth: 48, textAlign: 'right' }}>{c.median_age} yrs</span>
            </div>
          ))}
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Youngest Populations (Median Age)</div>
          {youngest.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT3, fontSize: 12, minWidth: 20 }}>{i + 1}</span>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{c.name}</span>
              <div style={{ flex: 2, height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(c.median_age / 20) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: 4 }} />
              </div>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13, minWidth: 48, textAlign: 'right' }}>{c.median_age} yrs</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dem-card" style={{ marginBottom: 24 }}>
        <div className="dem-card-title">Median Age vs Life Expectancy — All Countries</div>
        <div className="dem-chart-wrap" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[...COUNTRIES].sort((a, b) => b.median_age - a.median_age)}
              margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12, paddingTop: 14 }} />
              <Bar dataKey="median_age" name="Median Age" fill="#a855f7" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="life_exp" name="Life Expectancy" fill={ACCENT} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Fertility Rate Distribution</div>
          {fertilityBands.map((b, i) => (
            <div key={b.label} className="dem-fertility-band">
              <span className="dem-fertility-label" style={{ fontSize: 11 }}>{b.label}</span>
              <div className="dem-fertility-bar-bg">
                <div
                  className="dem-fertility-fill"
                  style={{
                    width: `${(b.count / COUNTRIES.length) * 100}%`,
                    background: ['#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#a855f7'][i],
                    opacity: 0.8,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: TEXT2, minWidth: 28, textAlign: 'right' }}>{b.count}</span>
            </div>
          ))}
          <div className="dem-age-note">
            Sub-replacement fertility (below 2.1) leads to eventual population decline without net immigration.
            Global average fertility stood at approximately 2.3 in 2024.
          </div>
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Fertility Rate by Country (sorted)</div>
          <div className="dem-chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...COUNTRIES].sort((a, b) => b.fertility - a.fertility)}
                margin={{ top: 0, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 9 }} angle={-50} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: TEXT3, fontSize: 10 }} domain={[0, 6]} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [v, 'Fertility Rate']} />
                <Bar dataKey="fertility" name="Fertility" radius={[3, 3, 0, 0]}>
                  {[...COUNTRIES].sort((a, b) => b.fertility - a.fertility).map((c) => (
                    <Cell key={c.name} fill={c.fertility < 2.1 ? '#ef4444' : c.fertility < 3.5 ? '#10b981' : '#f59e0b'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabMigration() {
  const NET_MIGRATION = useMemo(() => [
    { country: 'USA', net: 3.0, direction: 'in' },
    { country: 'Germany', net: 1.4, direction: 'in' },
    { country: 'Australia', net: 1.6, direction: 'in' },
    { country: 'UK', net: 0.7, direction: 'in' },
    { country: 'Canada', net: 1.8, direction: 'in' },
    { country: 'France', net: 0.3, direction: 'in' },
    { country: 'Saudi Arabia', net: 0.8, direction: 'in' },
    { country: 'Spain', net: 0.6, direction: 'in' },
    { country: 'India', net: -0.5, direction: 'out' },
    { country: 'China', net: -0.3, direction: 'out' },
    { country: 'Mexico', net: -0.4, direction: 'out' },
    { country: 'Bangladesh', net: -1.2, direction: 'out' },
    { country: 'Pakistan', net: -0.9, direction: 'out' },
    { country: 'Nigeria', net: -0.3, direction: 'out' },
    { country: 'Philippines', net: -1.0, direction: 'out' },
    { country: 'Ethiopia', net: -0.2, direction: 'out' },
  ], []);

  const REMITTANCES = useMemo(() => [
    { country: 'India', value: 125 },
    { country: 'Mexico', value: 63 },
    { country: 'China', value: 50 },
    { country: 'Philippines', value: 40 },
    { country: 'Egypt', value: 28 },
    { country: 'Pakistan', value: 27 },
    { country: 'Bangladesh', value: 22 },
    { country: 'Vietnam', value: 19 },
  ], []);

  const DIASPORA_FACTS = [
    { label: 'International migrants worldwide', value: '281M' },
    { label: 'Share of world population', value: '3.6%' },
    { label: 'Global remittances (2024)', value: '$860B' },
    { label: 'Refugees & asylum seekers', value: '43M+' },
  ];

  const inFlow = NET_MIGRATION.filter(d => d.direction === 'in').sort((a, b) => b.net - a.net);
  const outFlow = NET_MIGRATION.filter(d => d.direction === 'out').sort((a, b) => a.net - b.net);

  return (
    <div>
      <p className="dem-section-sub">Net migration rates, remittance flows, and global diaspora statistics.</p>

      <div className="dem-stat-grid">
        {DIASPORA_FACTS.map(f => (
          <div key={f.label} className="dem-stat-box">
            <div className="dem-stat-val dem-highlight">{f.value}</div>
            <div className="dem-stat-lbl">{f.label}</div>
          </div>
        ))}
      </div>

      <div className="dem-grid-2">
        <div className="dem-card">
          <div className="dem-card-title">Top Net Immigration Destinations</div>
          {inFlow.map((d) => (
            <div key={d.country} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{d.country}</span>
              <div style={{ flex: 2, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(d.net / 3.0) * 100}%`, height: '100%', background: '#10b981', borderRadius: 4 }} />
              </div>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: 12, minWidth: 50, textAlign: 'right' }}>+{d.net}M/yr</span>
            </div>
          ))}
        </div>

        <div className="dem-card">
          <div className="dem-card-title">Top Net Emigration Sources</div>
          {outFlow.map((d) => (
            <div key={d.country} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ color: TEXT1, fontWeight: 500, flex: 1, fontSize: 13 }}>{d.country}</span>
              <div style={{ flex: 2, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(Math.abs(d.net) / 1.2) * 100}%`, height: '100%', background: '#ef4444', borderRadius: 4 }} />
              </div>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 12, minWidth: 50, textAlign: 'right' }}>{d.net}M/yr</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dem-card" style={{ marginBottom: 24 }}>
        <div className="dem-card-title">Net Migration Rate Comparison</div>
        <div className="dem-chart-wrap" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={NET_MIGRATION} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 11 }} angle={-40} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickFormatter={v => `${v}M`} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}M/yr`, 'Net Migration']} />
              <Bar dataKey="net" name="Net Migration" radius={[3, 3, 0, 0]}>
                {NET_MIGRATION.map((d) => (
                  <Cell key={d.country} fill={d.direction === 'in' ? '#10b981' : '#ef4444'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dem-card">
        <div className="dem-card-title">Top Remittance-Receiving Countries (USD Billions, 2024 est.)</div>
        <div className="dem-chart-wrap" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REMITTANCES} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT3, fontSize: 11 }} tickFormatter={v => `$${v}B`} />
              <YAxis dataKey="country" type="category" tick={{ fill: TEXT2, fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`$${v}B`, 'Remittances']} />
              <Bar dataKey="value" name="Remittances (USD B)" fill={ACCENT} fillOpacity={0.8} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function DemographicsStatNations() {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'Overview': return <TabOverview />;
      case 'Population': return <TabPopulation />;
      case 'Growth': return <TabGrowth />;
      case 'Urbanisation': return <TabUrbanisation />;
      case 'Age Structure': return <TabAgeStructure />;
      case 'Migration': return <TabMigration />;
      default: return null;
    }
  }, [activeTab]);

  return (
    <div className="dem-wrap">
      <style>{CSS}</style>

      <div className="dem-header">
        <div className="dem-header-inner">
          <div className="dem-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
            World Demographics
          </div>
          <h1 className="dem-title">Global Demographics Dashboard</h1>
          <p className="dem-subtitle">Population, growth, urbanisation, and age structure data for 28 countries and 6 world regions</p>
          <div className="dem-kpi-row">
            <div className="dem-kpi">
              <div className="dem-kpi-val">8.08B</div>
              <div className="dem-kpi-lbl">World Population</div>
            </div>
            <div className="dem-kpi">
              <div className="dem-kpi-val">28</div>
              <div className="dem-kpi-lbl">Countries Tracked</div>
            </div>
            <div className="dem-kpi">
              <div className="dem-kpi-val">57%</div>
              <div className="dem-kpi-lbl">Urban Share</div>
            </div>
            <div className="dem-kpi">
              <div className="dem-kpi-val">2.3</div>
              <div className="dem-kpi-lbl">Avg Fertility Rate</div>
            </div>
            <div className="dem-kpi">
              <div className="dem-kpi-val">73.3</div>
              <div className="dem-kpi-lbl">Avg Life Exp (yrs)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dem-tabs">
        <div className="dem-tabs-inner">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dem-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="dem-body">
        <div style={{ marginBottom: 8 }}>
          <div className="dem-section-title">{activeTab}</div>
          <div className="dem-section-sub" style={{ marginBottom: 20 }}>
            {activeTab === 'Overview' && 'High-level summary of global population distribution and key indicators.'}
            {activeTab === 'Population' && 'Detailed population figures and density comparisons across countries.'}
            {activeTab === 'Growth' && 'Annual growth rates, fertility relationships, and demographic momentum.'}
            {activeTab === 'Urbanisation' && 'Urban share, megacity rankings, and urbanisation–development linkages.'}
            {activeTab === 'Age Structure' && 'Median age, fertility rates, and demographic ageing trends.'}
            {activeTab === 'Migration' && 'Net migration flows, remittance data, and diaspora statistics.'}
          </div>
        </div>
        {tabContent}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BORDER}`, fontSize: 11, color: TEXT3, lineHeight: 1.7 }}>
          <strong style={{ color: TEXT2 }}>Sources:</strong> UN World Population Prospects 2024, World Bank Open Data, UNDESA Population Division, IOM World Migration Report 2024.
          Population figures in millions. Growth rates are annual percentages. Data as of 2024 unless otherwise noted. Projections are UN medium-variant estimates.
        </div>
      </div>
    </div>
  );
}
