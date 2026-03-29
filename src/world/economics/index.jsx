import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, Legend, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

const ACCENT = '#10b981';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURF2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const COUNTRIES_GDP = [
  {country:'USA',gdp:28.8,gdp_pc:85400,growth:2.5,inflation:3.4,unemployment:3.7},
  {country:'China',gdp:18.5,gdp_pc:13200,growth:5.2,inflation:0.2,unemployment:5.2},
  {country:'Germany',gdp:4.6,gdp_pc:54400,growth:-0.2,inflation:5.9,unemployment:3.1},
  {country:'Japan',gdp:4.1,gdp_pc:33100,growth:1.9,inflation:3.3,unemployment:2.6},
  {country:'India',gdp:3.9,gdp_pc:2700,growth:8.2,inflation:5.4,unemployment:7.8},
  {country:'UK',gdp:3.1,gdp_pc:46100,growth:0.1,inflation:6.7,unemployment:4.3},
  {country:'France',gdp:3.0,gdp_pc:45400,growth:0.9,inflation:5.7,unemployment:7.3},
  {country:'Italy',gdp:2.3,gdp_pc:38700,growth:0.9,inflation:5.9,unemployment:6.7},
  {country:'Brazil',gdp:2.2,gdp_pc:10200,growth:2.9,inflation:4.7,unemployment:8.0},
  {country:'Canada',gdp:2.2,gdp_pc:56400,growth:1.1,inflation:3.9,unemployment:5.5},
  {country:'Russia',gdp:2.2,gdp_pc:15200,growth:3.6,inflation:7.4,unemployment:3.2},
  {country:'South Korea',gdp:1.7,gdp_pc:33200,growth:1.4,inflation:3.7,unemployment:2.8},
  {country:'Australia',gdp:1.7,gdp_pc:62400,growth:2.0,inflation:5.4,unemployment:3.7},
  {country:'Mexico',gdp:1.8,gdp_pc:13700,growth:3.2,inflation:4.7,unemployment:2.9},
  {country:'Spain',gdp:1.6,gdp_pc:34700,growth:2.5,inflation:3.5,unemployment:12.1},
  {country:'Indonesia',gdp:1.5,gdp_pc:5400,growth:5.1,inflation:3.7,unemployment:5.3},
  {country:'Netherlands',gdp:1.2,gdp_pc:68500,growth:0.1,inflation:4.1,unemployment:3.7},
  {country:'Saudi Arabia',gdp:1.1,gdp_pc:30900,growth:-0.8,inflation:2.3,unemployment:5.0},
  {country:'Turkey',gdp:1.1,gdp_pc:12900,growth:4.5,inflation:65.0,unemployment:8.9},
  {country:'Switzerland',gdp:0.9,gdp_pc:101700,growth:1.2,inflation:2.1,unemployment:2.3},
];

const TRADE_DATA = [
  {country:'China',exports:3380,imports:2560,balance:820},
  {country:'USA',exports:2020,imports:3170,balance:-1150},
  {country:'Germany',exports:1700,imports:1490,balance:210},
  {country:'Netherlands',exports:960,imports:850,balance:110},
  {country:'Japan',exports:890,imports:900,balance:-10},
  {country:'South Korea',exports:680,imports:640,balance:40},
  {country:'Italy',exports:680,imports:620,balance:60},
  {country:'France',exports:620,imports:720,balance:-100},
  {country:'India',exports:430,imports:720,balance:-290},
  {country:'UK',exports:480,imports:730,balance:-250},
  {country:'Mexico',exports:590,imports:540,balance:50},
  {country:'Canada',exports:590,imports:550,balance:40},
  {country:'Russia',exports:430,imports:280,balance:150},
  {country:'Saudi Arabia',exports:370,imports:230,balance:140},
];

const GINI_DATA = [
  {country:'South Africa',gini:63.0},{country:'Brazil',gini:52.9},{country:'Colombia',gini:51.3},
  {country:'Mexico',gini:45.4},{country:'USA',gini:39.8},{country:'China',gini:38.2},
  {country:'UK',gini:35.1},{country:'Australia',gini:34.3},{country:'Italy',gini:33.4},
  {country:'France',gini:31.5},{country:'Germany',gini:31.7},{country:'India',gini:32.8},
  {country:'Japan',gini:32.9},{country:'Canada',gini:31.7},{country:'South Korea',gini:31.4},
  {country:'Sweden',gini:27.6},{country:'Norway',gini:25.0},{country:'Denmark',gini:28.3},
  {country:'Finland',gini:27.4},{country:'Slovenia',gini:24.4},
];

const DEBT_DATA = [
  {country:'Japan',debt:264,rating:'A+'},{country:'Greece',debt:163,rating:'BB+'},
  {country:'Italy',debt:137,rating:'BBB'},{country:'USA',debt:129,rating:'AA+'},
  {country:'France',debt:113,rating:'AA-'},{country:'Spain',debt:110,rating:'A-'},
  {country:'Canada',debt:107,rating:'AAA'},{country:'UK',debt:98,rating:'AA'},
  {country:'Brazil',debt:88,rating:'BB'},{country:'India',debt:82,rating:'BBB-'},
  {country:'China',debt:77,rating:'A+'},{country:'Germany',debt:64,rating:'AAA'},
  {country:'South Korea',debt:54,rating:'AA'},{country:'Australia',debt:53,rating:'AAA'},
  {country:'Indonesia',debt:39,rating:'BBB'},{country:'Netherlands',debt:46,rating:'AAA'},
  {country:'Norway',debt:43,rating:'AAA'},{country:'Switzerland',debt:40,rating:'AAA'},
  {country:'Saudi Arabia',debt:24,rating:'A+'},{country:'Russia',debt:18,rating:'NR'},
];

const GROWTH_HISTORY = [
  {year:2018,world:3.6,usa:2.9,china:6.6,india:6.8,eu:1.9},
  {year:2019,world:2.8,usa:2.3,china:6.0,india:3.9,eu:1.7},
  {year:2020,world:-3.1,usa:-2.8,china:2.2,india:-6.6,eu:-5.9},
  {year:2021,world:6.3,usa:5.9,china:8.4,india:8.7,eu:5.3},
  {year:2022,world:3.5,usa:2.1,china:3.0,india:7.2,eu:3.5},
  {year:2023,world:3.2,usa:2.5,china:5.2,india:8.2,eu:0.5},
  {year:2024,world:3.3,usa:2.8,china:4.8,india:7.0,eu:0.8},
];

const TABS = ['Overview', 'GDP', 'Trade', 'Income', 'Debt', 'Growth'];

const RATING_COLOR = {
  'AAA': '#10b981', 'AA+': '#34d399', 'AA': '#6ee7b7', 'AA-': '#a7f3d0',
  'A+': '#fbbf24', 'A': '#f59e0b', 'A-': '#d97706',
  'BBB': '#f97316', 'BBB-': '#ea580c', 'BB+': '#ef4444', 'BB': '#dc2626',
  'NR': '#64748b'
};

const CSS = `
  .eco-wrap {
    background: ${BG};
    min-height: 100vh;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: ${TEXT1};
  }
  .eco-header {
    background: linear-gradient(135deg,#001a0e 0%,#003d22 60%,#001a0e 100%);
    padding: 40px 32px 32px;
    border-bottom: 1px solid ${BORDER};
    position: relative;
    overflow: hidden;
  }
  .eco-header::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .eco-header-title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: ${TEXT1};
    margin: 0 0 6px;
  }
  .eco-header-title span {
    color: ${ACCENT};
  }
  .eco-header-sub {
    font-size: 14px;
    color: ${TEXT2};
    margin: 0;
  }
  .eco-header-stats {
    display: flex;
    gap: 24px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .eco-hstat {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 10px;
    padding: 12px 20px;
    min-width: 130px;
  }
  .eco-hstat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: ${TEXT3};
    margin-bottom: 4px;
  }
  .eco-hstat-value {
    font-size: 22px;
    font-weight: 700;
    color: ${ACCENT};
  }
  .eco-hstat-unit {
    font-size: 12px;
    color: ${TEXT2};
    margin-left: 3px;
  }
  .eco-tabs {
    display: flex;
    gap: 4px;
    padding: 16px 32px 0;
    background: ${SURFACE};
    border-bottom: 1px solid ${BORDER};
    overflow-x: auto;
  }
  .eco-tab {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    color: ${TEXT2};
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }
  .eco-tab:hover {
    color: ${TEXT1};
  }
  .eco-tab.eco-tab-active {
    color: ${ACCENT};
    border-bottom-color: ${ACCENT};
  }
  .eco-content {
    padding: 28px 32px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .eco-section-title {
    font-size: 18px;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 4px;
  }
  .eco-section-desc {
    font-size: 13px;
    color: ${TEXT2};
    margin: 0 0 24px;
  }
  .eco-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  .eco-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  .eco-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .eco-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 20px;
  }
  .eco-card-full {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 24px;
  }
  .eco-card-title {
    font-size: 14px;
    font-weight: 600;
    color: ${TEXT1};
    margin: 0 0 4px;
  }
  .eco-card-desc {
    font-size: 12px;
    color: ${TEXT3};
    margin: 0 0 16px;
  }
  .eco-stat-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .eco-stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: ${TEXT3};
  }
  .eco-stat-value {
    font-size: 26px;
    font-weight: 800;
    color: ${TEXT1};
    line-height: 1;
  }
  .eco-stat-value.eco-green { color: ${ACCENT}; }
  .eco-stat-value.eco-red { color: #ef4444; }
  .eco-stat-sub {
    font-size: 12px;
    color: ${TEXT2};
  }
  .eco-table-wrap {
    overflow-x: auto;
  }
  .eco-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .eco-table th {
    text-align: left;
    padding: 10px 14px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: ${TEXT3};
    border-bottom: 1px solid ${BORDER};
    white-space: nowrap;
    font-weight: 600;
  }
  .eco-table td {
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: ${TEXT2};
  }
  .eco-table tr:hover td {
    background: rgba(255,255,255,0.025);
    color: ${TEXT1};
  }
  .eco-table td:first-child {
    color: ${TEXT1};
    font-weight: 500;
  }
  .eco-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  .eco-pos { color: ${ACCENT}; }
  .eco-neg { color: #ef4444; }
  .eco-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(16,185,129,0.12);
    color: ${ACCENT};
    font-size: 11px;
    font-weight: 700;
  }
  .eco-bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .eco-bar-label {
    font-size: 12px;
    color: ${TEXT2};
    min-width: 100px;
    text-align: right;
  }
  .eco-bar-track {
    flex: 1;
    height: 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 4px;
    overflow: hidden;
  }
  .eco-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: ${ACCENT};
    transition: width 0.6s ease;
  }
  .eco-bar-val {
    font-size: 12px;
    color: ${TEXT1};
    font-weight: 600;
    min-width: 40px;
  }
  .eco-legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .eco-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${TEXT2};
  }
  .eco-legend-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .eco-divider {
    border: none;
    border-top: 1px solid ${BORDER};
    margin: 20px 0;
  }
  .eco-tooltip {
    background: #0f2027;
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 12px;
    color: ${TEXT1};
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .eco-tooltip-label {
    font-weight: 700;
    margin-bottom: 6px;
    color: ${ACCENT};
  }
  .eco-tooltip-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 2px;
  }
  .eco-tooltip-key { color: ${TEXT2}; }
  .eco-tooltip-val { font-weight: 600; color: ${TEXT1}; }
  @media (max-width: 900px) {
    .eco-grid-2, .eco-grid-3, .eco-grid-4 { grid-template-columns: 1fr; }
    .eco-content { padding: 16px; }
    .eco-tabs { padding: 12px 16px 0; }
    .eco-header { padding: 24px 16px 20px; }
  }
`;

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="eco-tooltip">
      <div className="eco-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div className="eco-tooltip-row" key={i}>
          <span className="eco-tooltip-key">{p.name}</span>
          <span className="eco-tooltip-val" style={{ color: p.color || TEXT1 }}>
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function OverviewTab() {
  const totalGDP = useMemo(() => COUNTRIES_GDP.reduce((s, c) => s + c.gdp, 0).toFixed(1), []);
  const avgGrowth = useMemo(() => (COUNTRIES_GDP.reduce((s, c) => s + c.growth, 0) / COUNTRIES_GDP.length).toFixed(1), []);
  const avgInflation = useMemo(() => (COUNTRIES_GDP.reduce((s, c) => s + c.inflation, 0) / COUNTRIES_GDP.length).toFixed(1), []);
  const topGDP = useMemo(() => [...COUNTRIES_GDP].sort((a, b) => b.gdp - a.gdp).slice(0, 8), []);
  const topGrowth = useMemo(() => [...COUNTRIES_GDP].sort((a, b) => b.growth - a.growth).slice(0, 8), []);
  const radarData = useMemo(() => [
    { metric: 'GDP Size', USA: 100, China: 64, EU: 80 },
    { metric: 'Growth', USA: 30, China: 63, EU: 10 },
    { metric: 'GDP/Capita', USA: 84, China: 13, EU: 53 },
    { metric: 'Trade', USA: 64, China: 100, EU: 70 },
    { metric: 'Low Debt', USA: 28, China: 54, EU: 38 },
    { metric: 'Employment', USA: 82, China: 66, EU: 75 },
  ], []);

  return (
    <div>
      <div className="eco-section-title">Global Economic Overview</div>
      <div className="eco-section-desc">Key indicators across major world economies — 2023/2024 data</div>
      <div className="eco-grid-4">
        <div className="eco-stat-card">
          <div className="eco-stat-label">Tracked GDP Total</div>
          <div className="eco-stat-value eco-green">${totalGDP}T</div>
          <div className="eco-stat-sub">20 major economies</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Avg. GDP Growth</div>
          <div className="eco-stat-value eco-green">{avgGrowth}%</div>
          <div className="eco-stat-sub">Weighted average 2023</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Avg. Inflation</div>
          <div className="eco-stat-value" style={{color:'#f59e0b'}}>{avgInflation}%</div>
          <div className="eco-stat-sub">Consumer price index</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Global Trade Vol.</div>
          <div className="eco-stat-value eco-green">$31.4T</div>
          <div className="eco-stat-sub">Goods & services 2023</div>
        </div>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Top 8 Economies by GDP (Trillion USD)</div>
          <div className="eco-card-desc">Nominal GDP, 2023</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topGDP} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}T`} />
              <Tooltip content={<CustomTooltip formatter={(v) => `$${v}T`} />} />
              <Bar dataKey="gdp" name="GDP" radius={[6, 6, 0, 0]}>
                {topGDP.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? ACCENT : i === 1 ? '#0d9488' : SURF2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="eco-card">
          <div className="eco-card-title">Fastest Growing Economies</div>
          <div className="eco-card-desc">Real GDP growth rate %, 2023</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topGrowth} layout="vertical" margin={{ top: 4, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="country" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
              <Bar dataKey="growth" name="Growth" radius={[0, 6, 6, 0]}>
                {topGrowth.map((entry, i) => (
                  <Cell key={i} fill={entry.growth > 0 ? ACCENT : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Power Comparison: USA vs China vs EU</div>
          <div className="eco-card-desc">Normalized index across key economic dimensions</div>
          <div className="eco-legend">
            <div className="eco-legend-item"><div className="eco-legend-dot" style={{background:'#10b981'}}></div>USA</div>
            <div className="eco-legend-item"><div className="eco-legend-dot" style={{background:'#f59e0b'}}></div>China</div>
            <div className="eco-legend-item"><div className="eco-legend-dot" style={{background:'#818cf8'}}></div>EU</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={BORDER} />
              <PolarAngleAxis dataKey="metric" tick={{ fill: TEXT2, fontSize: 11 }} />
              <Radar name="USA" dataKey="USA" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
              <Radar name="China" dataKey="China" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              <Radar name="EU" dataKey="EU" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="eco-card">
          <div className="eco-card-title">Inflation vs Unemployment</div>
          <div className="eco-card-desc">Scatter plot — size indicates GDP (excl. Turkey outlier)</div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="inflation" type="number" name="Inflation" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Inflation %', position: 'insideBottom', offset: -4, fill: TEXT3, fontSize: 11 }} domain={[0, 12]} />
              <YAxis dataKey="unemployment" type="number" name="Unemployment" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Unemploy %', angle: -90, position: 'insideLeft', fill: TEXT3, fontSize: 11 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="eco-tooltip">
                    <div className="eco-tooltip-label">{d.country}</div>
                    <div className="eco-tooltip-row"><span className="eco-tooltip-key">Inflation</span><span className="eco-tooltip-val">{d.inflation}%</span></div>
                    <div className="eco-tooltip-row"><span className="eco-tooltip-key">Unemployment</span><span className="eco-tooltip-val">{d.unemployment}%</span></div>
                  </div>
                );
              }} />
              <Scatter data={COUNTRIES_GDP.filter(c => c.country !== 'Turkey')} fill={ACCENT} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function GDPTab() {
  const [metric, setMetric] = useState('gdp');
  const sorted = useMemo(() => [...COUNTRIES_GDP].sort((a, b) => b[metric] - a[metric]), [metric]);

  const metrics = [
    { key: 'gdp', label: 'Total GDP (T$)', fmt: v => `$${v}T` },
    { key: 'gdp_pc', label: 'GDP per Capita ($)', fmt: v => `$${v.toLocaleString()}` },
    { key: 'inflation', label: 'Inflation (%)', fmt: v => `${v}%` },
    { key: 'unemployment', label: 'Unemployment (%)', fmt: v => `${v}%` },
  ];
  const active = metrics.find(m => m.key === metric);
  const maxVal = sorted[0][metric];

  return (
    <div>
      <div className="eco-section-title">GDP & Economic Indicators</div>
      <div className="eco-section-desc">Nominal GDP, GDP per capita, inflation and unemployment rates for 20 major economies</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {metrics.map(m => (
          <button key={m.key} onClick={() => setMetric(m.key)} style={{
            padding: '7px 16px', fontSize: 12, fontWeight: 500, borderRadius: 8,
            border: `1px solid ${metric === m.key ? ACCENT : BORDER}`,
            background: metric === m.key ? 'rgba(16,185,129,0.12)' : SURFACE,
            color: metric === m.key ? ACCENT : TEXT2, cursor: 'pointer'
          }}>{m.label}</button>
        ))}
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">{active.label} — All Countries</div>
          <div className="eco-card-desc">Sorted descending</div>
          {sorted.map((c, i) => (
            <div className="eco-bar-row" key={c.country}>
              <div className="eco-bar-label">{c.country}</div>
              <div className="eco-bar-track">
                <div className="eco-bar-fill" style={{ width: `${(c[metric] / maxVal) * 100}%`, background: i < 3 ? ACCENT : SURF2 }} />
              </div>
              <div className="eco-bar-val">{active.fmt(c[metric])}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="eco-card" style={{ marginBottom: 20 }}>
            <div className="eco-card-title">Top 10 — {active.label}</div>
            <div className="eco-card-desc">Bar chart comparison</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sorted.slice(0, 10)} margin={{ top: 4, right: 8, left: -5, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 10 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => active.key === 'gdp_pc' ? `$${(v/1000).toFixed(0)}k` : active.key === 'gdp' ? `$${v}T` : `${v}%`} />
                <Tooltip content={<CustomTooltip formatter={active.fmt} />} />
                <Bar dataKey={metric} name={active.label} radius={[6, 6, 0, 0]}>
                  {sorted.slice(0, 10).map((_, i) => (
                    <Cell key={i} fill={i === 0 ? ACCENT : i <= 2 ? '#0d9488' : SURF2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="eco-card">
            <div className="eco-card-title">GDP vs GDP per Capita</div>
            <div className="eco-card-desc">Country size vs wealth distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart margin={{ top: 10, right: 20, left: -5, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="gdp" type="number" tick={{ fill: TEXT3, fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'GDP ($T)', position: 'insideBottom', offset: -4, fill: TEXT3, fontSize: 10 }} />
                <YAxis dataKey="gdp_pc" type="number" tick={{ fill: TEXT3, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="eco-tooltip">
                      <div className="eco-tooltip-label">{d.country}</div>
                      <div className="eco-tooltip-row"><span className="eco-tooltip-key">GDP</span><span className="eco-tooltip-val">${d.gdp}T</span></div>
                      <div className="eco-tooltip-row"><span className="eco-tooltip-key">Per Capita</span><span className="eco-tooltip-val">${d.gdp_pc.toLocaleString()}</span></div>
                    </div>
                  );
                }} />
                <Scatter data={COUNTRIES_GDP} fill={ACCENT} fillOpacity={0.65} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="eco-card-full">
        <div className="eco-card-title">Full Country Data Table</div>
        <div className="eco-card-desc">All tracked economies — 2023 figures</div>
        <div className="eco-table-wrap">
          <table className="eco-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>GDP (T$)</th>
                <th>GDP per Capita</th>
                <th>Growth %</th>
                <th>Inflation %</th>
                <th>Unemployment %</th>
              </tr>
            </thead>
            <tbody>
              {[...COUNTRIES_GDP].sort((a,b) => b.gdp - a.gdp).map((c, i) => (
                <tr key={c.country}>
                  <td><span className="eco-rank">{i+1}</span></td>
                  <td>{c.country}</td>
                  <td><strong>${c.gdp}T</strong></td>
                  <td>${c.gdp_pc.toLocaleString()}</td>
                  <td><span className={c.growth >= 0 ? 'eco-pos' : 'eco-neg'}>{c.growth > 0 ? '+' : ''}{c.growth}%</span></td>
                  <td>{c.inflation}%</td>
                  <td>{c.unemployment}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TradeTab() {
  const sortedByExports = useMemo(() => [...TRADE_DATA].sort((a,b) => b.exports - a.exports), []);
  const sortedByBalance = useMemo(() => [...TRADE_DATA].sort((a,b) => b.balance - a.balance), []);
  const totalExports = useMemo(() => TRADE_DATA.reduce((s, c) => s + c.exports, 0), []);
  const totalImports = useMemo(() => TRADE_DATA.reduce((s, c) => s + c.imports, 0), []);
  const surplusCount = useMemo(() => TRADE_DATA.filter(c => c.balance > 0).length, []);

  return (
    <div>
      <div className="eco-section-title">International Trade</div>
      <div className="eco-section-desc">Exports, imports and trade balance for top trading nations (USD billions, 2023)</div>
      <div className="eco-grid-4">
        <div className="eco-stat-card">
          <div className="eco-stat-label">Total Tracked Exports</div>
          <div className="eco-stat-value eco-green">${(totalExports/1000).toFixed(1)}T</div>
          <div className="eco-stat-sub">14 major exporters</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Total Tracked Imports</div>
          <div className="eco-stat-value" style={{color:'#f97316'}}>${(totalImports/1000).toFixed(1)}T</div>
          <div className="eco-stat-sub">14 major importers</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Surplus Countries</div>
          <div className="eco-stat-value eco-green">{surplusCount}</div>
          <div className="eco-stat-sub">of 14 tracked</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Largest Surplus</div>
          <div className="eco-stat-value eco-green">+$820B</div>
          <div className="eco-stat-sub">China 2023</div>
        </div>
      </div>
      <div className="eco-card-full">
        <div className="eco-card-title">Exports vs Imports by Country (USD Billions)</div>
        <div className="eco-card-desc">Side-by-side comparison of trade flows</div>
        <div className="eco-legend">
          <div className="eco-legend-item"><div className="eco-legend-dot" style={{background:ACCENT}}></div>Exports</div>
          <div className="eco-legend-item"><div className="eco-legend-dot" style={{background:'#f97316'}}></div>Imports</div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sortedByExports} margin={{ top: 4, right: 8, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
            <Tooltip content={<CustomTooltip formatter={(v) => `$${v}B`} />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="exports" name="Exports" fill={ACCENT} radius={[4,4,0,0]} />
            <Bar dataKey="imports" name="Imports" fill="#f97316" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Trade Balance (USD Billions)</div>
          <div className="eco-card-desc">Positive = surplus, negative = deficit</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={sortedByBalance} layout="vertical" margin={{ top: 4, right: 40, left: 70, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
              <YAxis type="category" dataKey="country" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v) => `$${v}B`} />} />
              <ReferenceLine x={0} stroke={TEXT3} strokeDasharray="3 3" />
              <Bar dataKey="balance" name="Balance" radius={[0, 6, 6, 0]}>
                {sortedByBalance.map((entry, i) => (
                  <Cell key={i} fill={entry.balance >= 0 ? ACCENT : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="eco-card">
          <div className="eco-card-title">Trade Data Table</div>
          <div className="eco-card-desc">Full figures for all tracked nations</div>
          <div className="eco-table-wrap">
            <table className="eco-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Exports $B</th>
                  <th>Imports $B</th>
                  <th>Balance $B</th>
                </tr>
              </thead>
              <tbody>
                {sortedByExports.map(c => (
                  <tr key={c.country}>
                    <td>{c.country}</td>
                    <td className="eco-pos">${c.exports}B</td>
                    <td style={{color:'#f97316'}}>${c.imports}B</td>
                    <td><span className={c.balance >= 0 ? 'eco-pos' : 'eco-neg'}>{c.balance >= 0 ? '+' : ''}${c.balance}B</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeTab() {
  const sortedGini = useMemo(() => [...GINI_DATA].sort((a,b) => b.gini - a.gini), []);
  const maxGini = sortedGini[0].gini;
  const avgGini = useMemo(() => (GINI_DATA.reduce((s, c) => s + c.gini, 0) / GINI_DATA.length).toFixed(1), []);
  const topGdpPc = useMemo(() => [...COUNTRIES_GDP].sort((a,b) => b.gdp_pc - a.gdp_pc), []);
  const maxPc = topGdpPc[0].gdp_pc;

  const getGiniColor = (val) => {
    if (val >= 50) return '#ef4444';
    if (val >= 40) return '#f97316';
    if (val >= 35) return '#f59e0b';
    if (val >= 30) return '#84cc16';
    return ACCENT;
  };

  return (
    <div>
      <div className="eco-section-title">Income Inequality & Wealth</div>
      <div className="eco-section-desc">Gini coefficients (0=perfect equality, 100=perfect inequality) and GDP per capita comparisons</div>
      <div className="eco-grid-4">
        <div className="eco-stat-card">
          <div className="eco-stat-label">Avg Gini (tracked)</div>
          <div className="eco-stat-value" style={{color:'#f59e0b'}}>{avgGini}</div>
          <div className="eco-stat-sub">20 countries</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Most Unequal</div>
          <div className="eco-stat-value eco-neg">63.0</div>
          <div className="eco-stat-sub">South Africa</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Most Equal</div>
          <div className="eco-stat-value eco-green">24.4</div>
          <div className="eco-stat-sub">Slovenia</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Highest GDP/Capita</div>
          <div className="eco-stat-value eco-green">$101.7k</div>
          <div className="eco-stat-sub">Switzerland</div>
        </div>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Gini Coefficient by Country</div>
          <div className="eco-card-desc">Higher = more unequal income distribution</div>
          {sortedGini.map((c, i) => (
            <div className="eco-bar-row" key={c.country}>
              <div className="eco-bar-label" style={{fontSize:11}}>{c.country}</div>
              <div className="eco-bar-track">
                <div className="eco-bar-fill" style={{ width: `${(c.gini / maxGini) * 100}%`, background: getGiniColor(c.gini) }} />
              </div>
              <div className="eco-bar-val" style={{color: getGiniColor(c.gini)}}>{c.gini}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="eco-card" style={{marginBottom:20}}>
            <div className="eco-card-title">Gini Chart — All Countries</div>
            <div className="eco-card-desc">Sorted from most to least unequal</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sortedGini} margin={{ top: 4, right: 8, left: -15, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 70]} />
                <Tooltip content={<CustomTooltip formatter={(v) => v.toFixed(1)} />} />
                <ReferenceLine y={40} stroke="#f97316" strokeDasharray="4 4" label={{ value: 'High inequality', fill: '#f97316', fontSize: 10 }} />
                <Bar dataKey="gini" name="Gini" radius={[4,4,0,0]}>
                  {sortedGini.map((c, i) => (
                    <Cell key={i} fill={getGiniColor(c.gini)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="eco-card">
            <div className="eco-card-title">GDP per Capita Ranking</div>
            <div className="eco-card-desc">All 20 tracked nations</div>
            {topGdpPc.map((c, i) => (
              <div className="eco-bar-row" key={c.country} style={{marginBottom:5}}>
                <div className="eco-bar-label" style={{fontSize:11}}>{c.country}</div>
                <div className="eco-bar-track">
                  <div className="eco-bar-fill" style={{ width: `${(c.gdp_pc / maxPc) * 100}%`, background: i < 3 ? ACCENT : SURF2 }} />
                </div>
                <div className="eco-bar-val" style={{fontSize:11}}>${(c.gdp_pc/1000).toFixed(0)}k</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtTab() {
  const sortedDebt = useMemo(() => [...DEBT_DATA].sort((a,b) => b.debt - a.debt), []);
  const maxDebt = sortedDebt[0].debt;
  const avgDebt = useMemo(() => (DEBT_DATA.reduce((s, c) => s + c.debt, 0) / DEBT_DATA.length).toFixed(0), []);
  const highDebt = useMemo(() => DEBT_DATA.filter(c => c.debt > 100).length, []);

  const getDebtColor = (val) => {
    if (val > 150) return '#ef4444';
    if (val > 100) return '#f97316';
    if (val > 70) return '#f59e0b';
    if (val > 50) return '#84cc16';
    return ACCENT;
  };

  return (
    <div>
      <div className="eco-section-title">Government Debt & Credit Ratings</div>
      <div className="eco-section-desc">Government debt as % of GDP with sovereign credit ratings from major agencies</div>
      <div className="eco-grid-4">
        <div className="eco-stat-card">
          <div className="eco-stat-label">Avg Debt / GDP</div>
          <div className="eco-stat-value" style={{color:'#f59e0b'}}>{avgDebt}%</div>
          <div className="eco-stat-sub">20 tracked nations</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Highest Debt</div>
          <div className="eco-stat-value eco-neg">264%</div>
          <div className="eco-stat-sub">Japan</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Lowest Debt</div>
          <div className="eco-stat-value eco-green">18%</div>
          <div className="eco-stat-sub">Russia</div>
        </div>
        <div className="eco-stat-card">
          <div className="eco-stat-label">Over 100% GDP</div>
          <div className="eco-stat-value eco-neg">{highDebt}</div>
          <div className="eco-stat-sub">countries at risk</div>
        </div>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Debt-to-GDP % by Country</div>
          <div className="eco-card-desc">Sorted highest to lowest</div>
          {sortedDebt.map((c, i) => (
            <div className="eco-bar-row" key={c.country} style={{marginBottom:6}}>
              <div className="eco-bar-label" style={{fontSize:11}}>{c.country}</div>
              <div className="eco-bar-track">
                <div className="eco-bar-fill" style={{ width: `${(c.debt / maxDebt) * 100}%`, background: getDebtColor(c.debt) }} />
              </div>
              <div className="eco-bar-val" style={{color: getDebtColor(c.debt), fontSize:11}}>{c.debt}%</div>
            </div>
          ))}
        </div>
        <div>
          <div className="eco-card" style={{marginBottom:20}}>
            <div className="eco-card-title">Debt Chart — Benchmark Lines</div>
            <div className="eco-card-desc">60% (EU limit) and 100% danger zones marked</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sortedDebt} margin={{ top: 4, right: 8, left: -5, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                <XAxis dataKey="country" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip formatter={(v) => `${v}% of GDP`} />} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '60% EU limit', fill: '#f59e0b', fontSize: 9, position: 'right' }} />
                <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '100%', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                <Bar dataKey="debt" name="Debt % GDP" radius={[4,4,0,0]}>
                  {sortedDebt.map((c, i) => (
                    <Cell key={i} fill={getDebtColor(c.debt)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="eco-card">
            <div className="eco-card-title">Credit Ratings Table</div>
            <div className="eco-card-desc">Sovereign credit ratings</div>
            <div className="eco-table-wrap">
              <table className="eco-table">
                <thead>
                  <tr><th>Country</th><th>Debt % GDP</th><th>Rating</th></tr>
                </thead>
                <tbody>
                  {sortedDebt.map(c => (
                    <tr key={c.country}>
                      <td>{c.country}</td>
                      <td style={{color: getDebtColor(c.debt)}}>{c.debt}%</td>
                      <td>
                        <span className="eco-badge" style={{
                          background: `${RATING_COLOR[c.rating] || TEXT3}22`,
                          color: RATING_COLOR[c.rating] || TEXT3
                        }}>{c.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthTab() {
  const [activeLines, setActiveLines] = useState({ world: true, usa: true, china: true, india: true, eu: true });

  const lineColors = {
    world: '#94a3b8', usa: '#10b981', china: '#f59e0b', india: '#818cf8', eu: '#38bdf8'
  };
  const lineLabels = { world: 'World', usa: 'USA', china: 'China', india: 'India', eu: 'EU' };

  const toggleLine = (key) => setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const latest = GROWTH_HISTORY[GROWTH_HISTORY.length - 1];
  const prev = GROWTH_HISTORY[GROWTH_HISTORY.length - 2];

  return (
    <div>
      <div className="eco-section-title">Economic Growth History</div>
      <div className="eco-section-desc">Real GDP growth rates from 2018 to 2024 — includes COVID-19 shock and recovery</div>
      <div className="eco-grid-4">
        {Object.keys(lineColors).map(k => (
          <div className="eco-stat-card" key={k}>
            <div className="eco-stat-label">{lineLabels[k]} — {latest.year}</div>
            <div className="eco-stat-value" style={{color: latest[k] >= 0 ? lineColors[k] : '#ef4444'}}>
              {latest[k] > 0 ? '+' : ''}{latest[k]}%
            </div>
            <div className="eco-stat-sub" style={{color: latest[k] > prev[k] ? ACCENT : '#ef4444'}}>
              {latest[k] > prev[k] ? '▲' : '▼'} vs {prev.year}: {prev[k]}%
            </div>
          </div>
        ))}
      </div>
      <div className="eco-card-full">
        <div className="eco-card-title">GDP Growth Rate Trends 2018–2024</div>
        <div className="eco-card-desc">Click legend items to toggle visibility</div>
        <div className="eco-legend">
          {Object.entries(lineColors).map(([k, color]) => (
            <div key={k} className="eco-legend-item" onClick={() => toggleLine(k)} style={{cursor:'pointer', opacity: activeLines[k] ? 1 : 0.35}}>
              <div className="eco-legend-dot" style={{background: color}}></div>
              {lineLabels[k]}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={GROWTH_HISTORY} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="year" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
            <ReferenceLine y={0} stroke={TEXT3} strokeDasharray="4 4" />
            {Object.entries(lineColors).map(([k, color]) => activeLines[k] && (
              <Line key={k} type="monotone" dataKey={k} name={lineLabels[k]} stroke={color}
                strokeWidth={k === 'world' ? 2 : 2.5} dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="eco-grid-2">
        <div className="eco-card">
          <div className="eco-card-title">Year-by-Year Summary</div>
          <div className="eco-card-desc">Growth rates across all tracked regions</div>
          <div className="eco-table-wrap">
            <table className="eco-table">
              <thead>
                <tr>
                  <th>Year</th>
                  {Object.keys(lineColors).map(k => <th key={k}>{lineLabels[k]}</th>)}
                </tr>
              </thead>
              <tbody>
                {GROWTH_HISTORY.map(row => (
                  <tr key={row.year}>
                    <td><strong>{row.year}</strong></td>
                    {Object.keys(lineColors).map(k => (
                      <td key={k} style={{color: row[k] >= 0 ? (row[k] > 4 ? ACCENT : TEXT2) : '#ef4444'}}>
                        {row[k] > 0 ? '+' : ''}{row[k]}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="eco-card">
          <div className="eco-card-title">2020 COVID Impact vs 2021 Recovery</div>
          <div className="eco-card-desc">Comparing the crash and rebound magnitudes</div>
          {(() => {
            const crisis = GROWTH_HISTORY.find(r => r.year === 2020);
            const recovery = GROWTH_HISTORY.find(r => r.year === 2021);
            const regions = Object.keys(lineColors);
            const data = regions.map(k => ({
              region: lineLabels[k],
              crash: crisis[k],
              recovery: recovery[k],
              net: (recovery[k] + crisis[k]).toFixed(1)
            }));
            return (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                  <XAxis dataKey="region" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip formatter={(v) => `${v}%`} />} />
                  <ReferenceLine y={0} stroke={TEXT3} />
                  <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
                  <Bar dataKey="crash" name="2020 Crash" fill="#ef4444" radius={[4,4,0,0]} />
                  <Bar dataKey="recovery" name="2021 Recovery" fill={ACCENT} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default function EconomicsStatNations() {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab />;
      case 'GDP': return <GDPTab />;
      case 'Trade': return <TradeTab />;
      case 'Income': return <IncomeTab />;
      case 'Debt': return <DebtTab />;
      case 'Growth': return <GrowthTab />;
      default: return null;
    }
  }, [activeTab]);

  return (
    <div className="eco-wrap">
      <style>{CSS}</style>
      <div className="eco-header">
        <h1 className="eco-header-title">Global <span>Economics</span> Dashboard</h1>
        <p className="eco-header-sub">Comprehensive economic indicators for 20+ major world economies — StatNations 2024</p>
        <div className="eco-header-stats">
          <div className="eco-hstat">
            <div className="eco-hstat-label">World GDP</div>
            <div><span className="eco-hstat-value">$105</span><span className="eco-hstat-unit">Trillion</span></div>
          </div>
          <div className="eco-hstat">
            <div className="eco-hstat-label">Global Growth</div>
            <div><span className="eco-hstat-value">3.3</span><span className="eco-hstat-unit">% 2024</span></div>
          </div>
          <div className="eco-hstat">
            <div className="eco-hstat-label">Trade Volume</div>
            <div><span className="eco-hstat-value">$31.4</span><span className="eco-hstat-unit">Trillion</span></div>
          </div>
          <div className="eco-hstat">
            <div className="eco-hstat-label">Countries</div>
            <div><span className="eco-hstat-value">20</span><span className="eco-hstat-unit">tracked</span></div>
          </div>
        </div>
      </div>
      <div className="eco-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`eco-tab${activeTab === tab ? ' eco-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="eco-content">
        {tabContent}
      </div>
    </div>
  );
}
