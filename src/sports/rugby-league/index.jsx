import { useState, useMemo } from 'react';

const ACCENT = '#f59e0b';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURFACE2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const CSS = `
  .rgl-root {
    background: ${BG};
    color: ${TEXT1};
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    padding-bottom: 3rem;
  }
  .rgl-header {
    background: linear-gradient(135deg,#1a1000 0%,#3d2800 60%,#1a1000 100%);
    padding: 2.5rem 2rem 2rem;
    border-bottom: 1px solid ${BORDER};
  }
  .rgl-header-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .rgl-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(245,158,11,0.15);
    border: 1px solid rgba(245,158,11,0.3);
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: ${ACCENT};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.9rem;
  }
  .rgl-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: ${TEXT1};
    margin: 0 0 0.4rem;
    letter-spacing: -0.02em;
  }
  .rgl-subtitle {
    color: ${TEXT2};
    font-size: 0.95rem;
    margin: 0;
  }
  .rgl-stats-strip {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .rgl-stat-item {
    display: flex;
    flex-direction: column;
  }
  .rgl-stat-val {
    font-size: 1.6rem;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1;
  }
  .rgl-stat-lbl {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-top: 0.2rem;
  }
  .rgl-tabs {
    max-width: 1100px;
    margin: 1.8rem auto 0;
    padding: 0 2rem;
    display: flex;
    gap: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .rgl-tabs::-webkit-scrollbar { display: none; }
  .rgl-tab {
    background: none;
    border: none;
    color: ${TEXT2};
    padding: 0.6rem 1.1rem;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
  }
  .rgl-tab:hover {
    background: rgba(255,255,255,0.05);
    color: ${TEXT1};
  }
  .rgl-tab.active {
    background: rgba(245,158,11,0.15);
    color: ${ACCENT};
    font-weight: 700;
  }
  .rgl-content {
    max-width: 1100px;
    margin: 2rem auto 0;
    padding: 0 2rem;
  }
  .rgl-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .rgl-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    .rgl-grid-2, .rgl-grid-3 { grid-template-columns: 1fr; }
    .rgl-title { font-size: 1.6rem; }
    .rgl-content { padding: 0 1rem; }
    .rgl-kpi-row { grid-template-columns: 1fr 1fr; }
  }
  .rgl-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 1.4rem;
  }
  .rgl-card-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.09em;
    margin: 0 0 1.1rem;
  }
  .rgl-section-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .rgl-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${BORDER};
    margin-left: 0.5rem;
  }
  .rgl-bar-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .rgl-bar-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .rgl-bar-label {
    font-size: 0.82rem;
    color: ${TEXT2};
    width: 130px;
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rgl-bar-track {
    flex: 1;
    height: 10px;
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    overflow: hidden;
  }
  .rgl-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .rgl-bar-val {
    font-size: 0.82rem;
    font-weight: 700;
    color: ${TEXT1};
    width: 36px;
    text-align: right;
    flex-shrink: 0;
  }
  .rgl-table-wrap {
    overflow-x: auto;
  }
  .rgl-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }
  .rgl-table th {
    color: ${TEXT3};
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.6rem 0.8rem;
    text-align: left;
    border-bottom: 1px solid ${BORDER};
    white-space: nowrap;
  }
  .rgl-table td {
    padding: 0.65rem 0.8rem;
    color: ${TEXT2};
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .rgl-table tr:last-child td { border-bottom: none; }
  .rgl-table tr:hover td { background: rgba(255,255,255,0.03); }
  .rgl-table td.highlight { color: ${TEXT1}; font-weight: 600; }
  .rgl-table td.accent { color: ${ACCENT}; font-weight: 700; }
  .rgl-pill {
    display: inline-block;
    padding: 0.18rem 0.55rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    background: rgba(245,158,11,0.15);
    color: ${ACCENT};
    letter-spacing: 0.05em;
  }
  .rgl-pill.green {
    background: rgba(34,197,94,0.13);
    color: #4ade80;
  }
  .rgl-pill.blue {
    background: rgba(59,130,246,0.13);
    color: #60a5fa;
  }
  .rgl-pill.purple {
    background: rgba(168,85,247,0.13);
    color: #c084fc;
  }
  .rgl-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .rgl-kpi {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 1.1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .rgl-kpi-label {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .rgl-kpi-value {
    font-size: 1.7rem;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1.1;
  }
  .rgl-kpi-sub {
    font-size: 0.78rem;
    color: ${TEXT2};
  }
  .rgl-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 420px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(245,158,11,0.2) transparent;
  }
  .rgl-timeline::-webkit-scrollbar { width: 4px; }
  .rgl-timeline::-webkit-scrollbar-track { background: transparent; }
  .rgl-timeline::-webkit-scrollbar-thumb {
    background: rgba(245,158,11,0.2);
    border-radius: 2px;
  }
  .rgl-tl-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 0.55rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .rgl-tl-item:last-child { border-bottom: none; }
  .rgl-tl-year {
    font-size: 0.78rem;
    font-weight: 700;
    color: ${ACCENT};
    width: 36px;
    flex-shrink: 0;
    padding-top: 0.05rem;
  }
  .rgl-tl-winner {
    font-size: 0.85rem;
    color: ${TEXT1};
    font-weight: 600;
  }
  .rgl-record-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 600px) {
    .rgl-record-grid { grid-template-columns: 1fr; }
  }
  .rgl-record-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 10px;
    padding: 1rem 1.1rem;
  }
  .rgl-record-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${ACCENT};
    margin-bottom: 0.15rem;
  }
  .rgl-record-desc {
    font-size: 0.82rem;
    color: ${TEXT2};
    line-height: 1.4;
  }
  .rgl-record-holder {
    font-size: 0.78rem;
    color: ${TEXT3};
    margin-top: 0.3rem;
  }
  .rgl-divider {
    height: 1px;
    background: ${BORDER};
    margin: 1.8rem 0;
  }
  .rgl-note {
    font-size: 0.78rem;
    color: ${TEXT3};
    line-height: 1.55;
    margin: 0;
  }
  .rgl-note-box {
    margin-top: 1.2rem;
    border-top: 1px solid ${BORDER};
    padding-top: 1rem;
  }
  .rgl-pacific-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 0.75rem;
  }
  @media (max-width: 600px) {
    .rgl-pacific-grid { grid-template-columns: 1fr 1fr; }
  }
  .rgl-pacific-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 8px;
    padding: 0.7rem;
    text-align: center;
  }
  .rgl-pacific-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: ${TEXT1};
  }
  .rgl-pacific-sub {
    font-size: 0.7rem;
    color: ${TEXT3};
    margin-top: 0.25rem;
  }
  .rgl-dynasty-strip {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .rgl-dynasty-badge {
    border-radius: 10px;
    padding: 0.7rem 1.2rem;
    text-align: center;
    min-width: 80px;
  }
  .rgl-dynasty-year {
    font-size: 1.3rem;
    font-weight: 800;
  }
  .rgl-dynasty-lbl {
    font-size: 0.72rem;
    margin-top: 0.1rem;
  }
  .rgl-decade-card {
    text-align: center;
  }
  .rgl-decade-label {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
  }
  .rgl-decade-club {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }
  .rgl-decade-stat {
    font-size: 0.82rem;
    color: ${TEXT2};
  }
`;

// ---- Static Data ----

const WC_WINNERS = [
  { year: 1954, winner: 'Great Britain', nation: 'GBR' },
  { year: 1957, winner: 'Australia', nation: 'AUS' },
  { year: 1960, winner: 'Great Britain', nation: 'GBR' },
  { year: 1968, winner: 'Australia', nation: 'AUS' },
  { year: 1970, winner: 'Australia', nation: 'AUS' },
  { year: 1972, winner: 'Great Britain', nation: 'GBR' },
  { year: 1975, winner: 'Australia', nation: 'AUS' },
  { year: 1977, winner: 'Australia', nation: 'AUS' },
  { year: 1988, winner: 'Australia', nation: 'AUS' },
  { year: 1992, winner: 'Australia', nation: 'AUS' },
  { year: 1995, winner: 'Australia', nation: 'AUS' },
  { year: 2000, winner: 'Australia', nation: 'AUS' },
  { year: 2008, winner: 'Australia', nation: 'AUS' },
  { year: 2013, winner: 'Australia', nation: 'AUS' },
  { year: 2017, winner: 'Australia', nation: 'AUS' },
  { year: 2022, winner: 'Australia', nation: 'AUS' },
];

const WC_TITLES = [
  { nation: 'Australia', wins: 12 },
  { nation: 'Great Britain', wins: 3 },
  { nation: 'New Zealand', wins: 0 },
  { nation: 'England', wins: 0 },
  { nation: 'France', wins: 0 },
];

const SL_WINNERS = [
  { year: 1998, winner: 'Wigan Warriors' },
  { year: 1999, winner: 'St Helens' },
  { year: 2000, winner: 'St Helens' },
  { year: 2001, winner: 'Bradford Bulls' },
  { year: 2002, winner: 'St Helens' },
  { year: 2003, winner: 'Bradford Bulls' },
  { year: 2004, winner: 'Leeds Rhinos' },
  { year: 2005, winner: 'Leeds Rhinos' },
  { year: 2006, winner: 'St Helens' },
  { year: 2007, winner: 'Leeds Rhinos' },
  { year: 2008, winner: 'Leeds Rhinos' },
  { year: 2009, winner: 'Leeds Rhinos' },
  { year: 2010, winner: 'Wigan Warriors' },
  { year: 2011, winner: 'Leeds Rhinos' },
  { year: 2012, winner: 'Wigan Warriors' },
  { year: 2013, winner: 'Wigan Warriors' },
  { year: 2014, winner: 'St Helens' },
  { year: 2015, winner: 'Leeds Rhinos' },
  { year: 2016, winner: 'Wigan Warriors' },
  { year: 2017, winner: 'Leeds Rhinos' },
  { year: 2018, winner: 'Wigan Warriors' },
  { year: 2019, winner: 'St Helens' },
  { year: 2020, winner: 'St Helens' },
  { year: 2021, winner: 'St Helens' },
  { year: 2022, winner: 'St Helens' },
  { year: 2023, winner: 'Wigan Warriors' },
];

const SL_TITLES = [
  { club: 'Leeds Rhinos', titles: 8, color: '#f59e0b' },
  { club: 'St Helens', titles: 8, color: '#3b82f6' },
  { club: 'Wigan Warriors', titles: 7, color: '#ef4444' },
  { club: 'Bradford Bulls', titles: 2, color: '#8b5cf6' },
];

const NRL_WINNERS = [
  { year: 2000, winner: 'Brisbane Broncos' },
  { year: 2001, winner: 'Newcastle Knights' },
  { year: 2002, winner: 'Sydney Roosters' },
  { year: 2003, winner: 'Penrith Panthers' },
  { year: 2004, winner: 'Canterbury Bulldogs' },
  { year: 2005, winner: 'Wests Tigers' },
  { year: 2006, winner: 'Brisbane Broncos' },
  { year: 2007, winner: 'Melbourne Storm' },
  { year: 2008, winner: 'Manly Sea Eagles' },
  { year: 2009, winner: 'Melbourne Storm' },
  { year: 2010, winner: 'St George Illawarra Dragons' },
  { year: 2011, winner: 'Manly Sea Eagles' },
  { year: 2012, winner: 'Melbourne Storm' },
  { year: 2013, winner: 'Sydney Roosters' },
  { year: 2014, winner: 'South Sydney Rabbitohs' },
  { year: 2015, winner: 'North Queensland Cowboys' },
  { year: 2016, winner: 'Cronulla Sharks' },
  { year: 2017, winner: 'Melbourne Storm' },
  { year: 2018, winner: 'Sydney Roosters' },
  { year: 2019, winner: 'Canberra Raiders' },
  { year: 2020, winner: 'Melbourne Storm' },
  { year: 2021, winner: 'Penrith Panthers' },
  { year: 2022, winner: 'Penrith Panthers' },
  { year: 2023, winner: 'Penrith Panthers' },
];

const NRL_TITLES = [
  { club: 'Melbourne Storm', titles: 5, color: '#8b5cf6' },
  { club: 'Penrith Panthers', titles: 4, color: '#ef4444' },
  { club: 'Sydney Roosters', titles: 4, color: '#f59e0b' },
  { club: 'Brisbane Broncos', titles: 3, color: '#f97316' },
  { club: 'Manly Sea Eagles', titles: 2, color: '#3b82f6' },
  { club: 'St George Illawarra', titles: 1, color: '#10b981' },
  { club: 'South Sydney', titles: 1, color: '#ec4899' },
  { club: 'North Queensland', titles: 1, color: '#06b6d4' },
  { club: 'Cronulla', titles: 1, color: '#84cc16' },
];

const INT_TRY_SCORERS = [
  { player: 'Gareth Thomas', nation: 'Wales', tries: 30, color: '#ef4444' },
  { player: 'Lesley Vainikolo', nation: 'NZ/Eng', tries: 27, color: '#10b981' },
  { player: 'Martin Offiah', nation: 'England', tries: 26, color: '#f59e0b' },
  { player: 'Steve Rogers', nation: 'Australia', tries: 23, color: '#3b82f6' },
  { player: 'Andrew Johns', nation: 'Australia', tries: 20, color: '#60a5fa' },
  { player: 'Darren Lockyer', nation: 'Australia', tries: 18, color: '#93c5fd' },
  { player: 'Matthew Johns', nation: 'Australia', tries: 18, color: '#bfdbfe' },
  { player: 'Brian Carney', nation: 'Ire/Eng', tries: 14, color: '#22c55e' },
];

const RECORDS = [
  {
    val: '110-4',
    desc: 'Highest Test score ever recorded',
    holder: 'Australia vs Russia (2000 World Cup)',
  },
  {
    val: '3,967',
    desc: 'Most Super League career points',
    holder: 'Kevin Sinfield (Leeds Rhinos)',
  },
  {
    val: '2,772',
    desc: 'Most NRL career points',
    holder: 'Cameron Smith (Melbourne Storm)',
  },
  {
    val: '15 tries',
    desc: 'Most tries in 31 Test appearances',
    holder: 'Billy Slater (Australia)',
  },
  {
    val: '16',
    desc: 'Rugby League World Cups contested',
    holder: 'Since inaugural 1954 tournament',
  },
  {
    val: '12',
    desc: 'World Cup titles for Australia',
    holder: 'Most dominant nation in history',
  },
  {
    val: '8',
    desc: 'Super League titles (joint record)',
    holder: 'Leeds Rhinos and St Helens',
  },
  {
    val: '26+ yrs',
    desc: 'Super League has run continuously',
    holder: '1996 to present day',
  },
];

// ---- Reusable Sub-components ----

function BarChart({ data, labelKey, valueKey, max, colorKey, defaultColor }) {
  const resolvedMax = max || Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="rgl-bar-wrap">
      {data.map((row, i) => {
        const pct = resolvedMax > 0 ? (row[valueKey] / resolvedMax) * 100 : 0;
        const color = colorKey ? row[colorKey] : defaultColor || ACCENT;
        return (
          <div key={i} className="rgl-bar-row">
            <span className="rgl-bar-label">{row[labelKey]}</span>
            <div className="rgl-bar-track">
              <div
                className="rgl-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="rgl-bar-val">{row[valueKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

function KPI({ label, value, sub }) {
  return (
    <div className="rgl-kpi">
      <span className="rgl-kpi-label">{label}</span>
      <span className="rgl-kpi-value">{value}</span>
      {sub && <span className="rgl-kpi-sub">{sub}</span>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="rgl-section-title">{children}</h2>;
}

function Pill({ children, variant }) {
  const styles = {
    amber: {},
    blue: { background: 'rgba(59,130,246,0.13)', color: '#60a5fa' },
    red: { background: 'rgba(239,68,68,0.13)', color: '#f87171' },
    purple: { background: 'rgba(168,85,247,0.13)', color: '#c084fc' },
    green: { background: 'rgba(34,197,94,0.13)', color: '#4ade80' },
    muted: { background: 'rgba(100,116,139,0.2)', color: TEXT2 },
  };
  return (
    <span className="rgl-pill" style={styles[variant] || styles.amber}>
      {children}
    </span>
  );
}

// ---- Tab: Overview ----

function OverviewTab() {
  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="World Cups Held" value="16" sub="1954 to 2022" />
        <KPI label="Australia Titles" value="12" sub="Most in history" />
        <KPI label="Super League Seasons" value="28+" sub="Since 1996" />
        <KPI label="NRL Seasons" value="24+" sub="Since 2000 re-brand" />
      </div>

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">World Cup Wins by Nation</p>
          <BarChart
            data={WC_TITLES}
            labelKey="nation"
            valueKey="wins"
            defaultColor={ACCENT}
          />
        </div>
        <div className="rgl-card">
          <p className="rgl-card-title">Super League Titles (All-Time)</p>
          <BarChart
            data={SL_TITLES}
            labelKey="club"
            valueKey="titles"
            colorKey="color"
          />
        </div>
      </div>

      <div className="rgl-divider" />

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">NRL All-Time Premier Rankings</p>
          <BarChart
            data={NRL_TITLES.slice(0, 6)}
            labelKey="club"
            valueKey="titles"
            colorKey="color"
          />
        </div>
        <div className="rgl-card">
          <p className="rgl-card-title">Top International Try Scorers</p>
          <BarChart
            data={INT_TRY_SCORERS.slice(0, 5)}
            labelKey="player"
            valueKey="tries"
            colorKey="color"
          />
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Notable Records at a Glance</SectionTitle>
      <div className="rgl-record-grid">
        {RECORDS.slice(0, 4).map((r, i) => (
          <div key={i} className="rgl-record-card">
            <div className="rgl-record-val">{r.val}</div>
            <div className="rgl-record-desc">{r.desc}</div>
            <div className="rgl-record-holder">{r.holder}</div>
          </div>
        ))}
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Competition Snapshot</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Competition</th>
                <th>Region</th>
                <th>Founded</th>
                <th>Seasons</th>
                <th>Current Champion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="highlight">Rugby League World Cup</td>
                <td>International</td>
                <td>1954</td>
                <td>16</td>
                <td><Pill variant="amber">Australia (2022)</Pill></td>
              </tr>
              <tr>
                <td className="highlight">NRL Premiership</td>
                <td>Australia / NZ</td>
                <td>1998 (NRL)</td>
                <td>26+</td>
                <td><Pill variant="red">Penrith (2023)</Pill></td>
              </tr>
              <tr>
                <td className="highlight">Super League</td>
                <td>England / France</td>
                <td>1996</td>
                <td>28+</td>
                <td><Pill variant="red">Wigan (2023)</Pill></td>
              </tr>
              <tr>
                <td className="highlight">State of Origin</td>
                <td>Australia</td>
                <td>1980</td>
                <td>44+</td>
                <td><Pill variant="muted">Annual series</Pill></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Tab: World Cup ----

function WorldCupTab() {
  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="Tournaments" value="16" sub="1954 to 2022" />
        <KPI label="AUS Wins" value="12" sub="75% win rate" />
        <KPI label="GBR Wins" value="3" sub="Last won in 1972" />
        <KPI label="Only Winners" value="2" sub="AUS and Great Britain" />
      </div>

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">Wins by Nation</p>
          <BarChart
            data={WC_TITLES}
            labelKey="nation"
            valueKey="wins"
            defaultColor={ACCENT}
          />
          <div className="rgl-note-box">
            <p className="rgl-note">
              Australia have dominated the tournament since 1975, winning every
              edition since. No other nation has lifted the trophy since Great
              Britain in 1972. New Zealand have reached three finals without
              claiming the title.
            </p>
          </div>
        </div>

        <div className="rgl-card">
          <p className="rgl-card-title">Tournament Results Timeline</p>
          <div className="rgl-timeline">
            {WC_WINNERS.map((e) => (
              <div key={e.year} className="rgl-tl-item">
                <span className="rgl-tl-year">{e.year}</span>
                <div>
                  <div className="rgl-tl-winner">{e.winner}</div>
                  <div style={{ marginTop: '0.2rem' }}>
                    <Pill variant={e.nation === 'AUS' ? 'amber' : 'blue'}>
                      {e.nation}
                    </Pill>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>World Cup Head-to-Head Summary</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Nation</th>
                <th>Titles</th>
                <th>Finals</th>
                <th>Semi-finals</th>
                <th>Best Finish</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="highlight">Australia</td>
                <td className="accent">12</td>
                <td>14</td>
                <td>16</td>
                <td><Pill variant="amber">Champions</Pill></td>
              </tr>
              <tr>
                <td className="highlight">Great Britain</td>
                <td className="accent">3</td>
                <td>7</td>
                <td>12</td>
                <td><Pill variant="blue">Champions (1972)</Pill></td>
              </tr>
              <tr>
                <td className="highlight">New Zealand</td>
                <td className="accent">0</td>
                <td>3</td>
                <td>8</td>
                <td><Pill variant="muted">Runner-up</Pill></td>
              </tr>
              <tr>
                <td className="highlight">England</td>
                <td className="accent">0</td>
                <td>1</td>
                <td>4</td>
                <td><Pill variant="muted">Runner-up</Pill></td>
              </tr>
              <tr>
                <td className="highlight">France</td>
                <td className="accent">0</td>
                <td>1</td>
                <td>3</td>
                <td><Pill variant="muted">Runner-up (1954)</Pill></td>
              </tr>
              <tr>
                <td className="highlight">Samoa</td>
                <td className="accent">0</td>
                <td>0</td>
                <td>2</td>
                <td><Pill variant="muted">Semi-final</Pill></td>
              </tr>
              <tr>
                <td className="highlight">Tonga</td>
                <td className="accent">0</td>
                <td>0</td>
                <td>1</td>
                <td><Pill variant="muted">Semi-final</Pill></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Australia's World Cup Dominance by Era</SectionTitle>
      <div className="rgl-grid-3">
        {[
          { era: '1954-1972', ausWins: 2, total: 4, note: 'Shared era with Great Britain' },
          { era: '1975-1988', ausWins: 4, total: 4, note: 'Complete dominance begins' },
          { era: '1992-2022', ausWins: 6, total: 8, note: 'Modern era total control' },
        ].map((e) => (
          <div key={e.era} className="rgl-card" style={{ textAlign: 'center' }}>
            <div className="rgl-decade-label">{e.era}</div>
            <div
              className="rgl-decade-club"
              style={{ color: ACCENT, fontSize: '1.6rem' }}
            >
              {e.ausWins}/{e.total}
            </div>
            <div className="rgl-decade-stat">AUS wins of {e.total} held</div>
            <div
              style={{
                fontSize: '0.72rem',
                color: TEXT3,
                marginTop: '0.4rem',
              }}
            >
              {e.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Tab: Super League ----

function SuperLeagueTab() {
  const SL_COLOR_MAP = {
    'Leeds Rhinos': ACCENT,
    'St Helens': '#3b82f6',
    'Wigan Warriors': '#ef4444',
    'Bradford Bulls': '#8b5cf6',
  };

  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="Seasons" value="28" sub="1996 to 2023" />
        <KPI label="Unique Champions" value="4" sub="Different title winners" />
        <KPI label="Leeds / Saints" value="8 each" sub="Joint record holders" />
        <KPI label="Wigan" value="7" sub="Third most titles" />
      </div>

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">Super League Titles by Club</p>
          <BarChart
            data={SL_TITLES}
            labelKey="club"
            valueKey="titles"
            colorKey="color"
          />
          <div className="rgl-note-box">
            <p className="rgl-note">
              Leeds Rhinos and St Helens are joint holders of the Super League
              record with 8 titles each. Wigan Warriors are not far behind
              with 7. Bradford Bulls won 2 titles before financial difficulties
              ended their challenge era.
            </p>
          </div>
        </div>

        <div className="rgl-card">
          <p className="rgl-card-title">Championship History 1998-2023</p>
          <div className="rgl-timeline">
            {SL_WINNERS.map((e) => (
              <div key={e.year} className="rgl-tl-item">
                <span className="rgl-tl-year">{e.year}</span>
                <div
                  className="rgl-tl-winner"
                  style={{ color: SL_COLOR_MAP[e.winner] || TEXT1 }}
                >
                  {e.winner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Super League Club Stats</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Club</th>
                <th>Titles</th>
                <th>Most Recent</th>
                <th>Peak Era</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="highlight">Leeds Rhinos</td>
                <td className="accent">8</td>
                <td>2017</td>
                <td><Pill variant="amber">2004-2017</Pill></td>
                <td>Kevin Sinfield era</td>
              </tr>
              <tr>
                <td className="highlight">St Helens</td>
                <td className="accent">8</td>
                <td>2022</td>
                <td><Pill variant="blue">1999-2022</Pill></td>
                <td>Longest title span</td>
              </tr>
              <tr>
                <td className="highlight">Wigan Warriors</td>
                <td className="accent">7</td>
                <td>2023</td>
                <td><Pill variant="red">1998-2023</Pill></td>
                <td>Consistent contenders</td>
              </tr>
              <tr>
                <td className="highlight">Bradford Bulls</td>
                <td className="accent">2</td>
                <td>2003</td>
                <td><Pill variant="purple">2001-2003</Pill></td>
                <td>Financial collapse 2012</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Decade-by-Decade Dominance</SectionTitle>
      <div className="rgl-grid-3">
        {[
          { decade: '2000s', dominant: 'Leeds Rhinos', titles: 5, color: ACCENT },
          { decade: '2010s', dominant: 'Wigan Warriors', titles: 4, color: '#ef4444' },
          { decade: '2020s', dominant: 'St Helens', titles: 4, color: '#3b82f6' },
        ].map((d) => (
          <div key={d.decade} className="rgl-card rgl-decade-card">
            <div className="rgl-decade-label">{d.decade}</div>
            <div
              className="rgl-decade-club"
              style={{ color: d.color }}
            >
              {d.dominant}
            </div>
            <div className="rgl-decade-stat">{d.titles} titles in the decade</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Tab: NRL ----

function NRLTab() {
  const NRL_COLOR_MAP = {
    'Melbourne Storm': '#8b5cf6',
    'Penrith Panthers': '#ef4444',
    'Sydney Roosters': '#f59e0b',
    'Brisbane Broncos': '#f97316',
    'Manly Sea Eagles': '#3b82f6',
  };

  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="NRL Seasons" value="24" sub="2000 to 2023" />
        <KPI label="Melbourne Storm" value="5 titles" sub="Most successful club" />
        <KPI label="Penrith 3-peat" value="2021-23" sub="Recent dynasty" />
        <KPI label="Unique Winners" value="9" sub="Different premiers" />
      </div>

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">NRL Premiership Titles 2000-2023</p>
          <BarChart
            data={NRL_TITLES}
            labelKey="club"
            valueKey="titles"
            colorKey="color"
          />
        </div>

        <div className="rgl-card">
          <p className="rgl-card-title">NRL Grand Final Results</p>
          <div className="rgl-timeline">
            {NRL_WINNERS.map((e) => (
              <div key={e.year} className="rgl-tl-item">
                <span className="rgl-tl-year">{e.year}</span>
                <div
                  className="rgl-tl-winner"
                  style={{ color: NRL_COLOR_MAP[e.winner] || TEXT2 }}
                >
                  {e.winner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>NRL All-Time Records</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Value</th>
                <th>Holder</th>
                <th>Club</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Most career points</td>
                <td className="accent">2,772</td>
                <td className="highlight">Cameron Smith</td>
                <td>Melbourne Storm</td>
              </tr>
              <tr>
                <td>Most career games</td>
                <td className="accent">430+</td>
                <td className="highlight">Cameron Smith</td>
                <td>Melbourne Storm</td>
              </tr>
              <tr>
                <td>Most premierships (club)</td>
                <td className="accent">5</td>
                <td className="highlight">Melbourne Storm</td>
                <td>NRL era record</td>
              </tr>
              <tr>
                <td>Most tries in a season</td>
                <td className="accent">25+</td>
                <td className="highlight">Various</td>
                <td>Multiple clubs</td>
              </tr>
              <tr>
                <td>Consecutive titles</td>
                <td className="accent">3</td>
                <td className="highlight">Penrith Panthers</td>
                <td>2021-2023</td>
              </tr>
              <tr>
                <td>Highest NRL score</td>
                <td className="accent">74+</td>
                <td className="highlight">Brisbane Broncos</td>
                <td>vs Various opponents</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Recent Dynasty: Penrith Panthers</SectionTitle>
      <div className="rgl-card">
        <p
          style={{
            fontSize: '0.9rem',
            color: TEXT2,
            margin: '0 0 1rem',
            lineHeight: 1.6,
          }}
        >
          The Penrith Panthers achieved one of the most dominant stretches in
          NRL history, claiming three consecutive premierships from 2021 to 2023.
          Led by halfback Nathan Cleary and head coach Ivan Cleary, Penrith set
          a new benchmark for consistency in the modern era. Their squad depth
          and development pipeline drew comparisons to the great Melbourne Storm
          teams of the 2010s.
        </p>
        <div className="rgl-dynasty-strip">
          {[2021, 2022, 2023].map((yr) => (
            <div
              key={yr}
              className="rgl-dynasty-badge"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <div
                className="rgl-dynasty-year"
                style={{ color: '#f87171' }}
              >
                {yr}
              </div>
              <div
                className="rgl-dynasty-lbl"
                style={{ color: TEXT3 }}
              >
                NRL Champions
              </div>
            </div>
          ))}
        </div>

        <div className="rgl-note-box">
          <p className="rgl-note">
            Prior to Penrith, Melbourne Storm held the record for sustained
            excellence in the NRL era with 5 premierships. The Storm's dynasty
            under Craig Bellamy (2007-2020) redefined how professional rugby
            league clubs operate.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- Tab: International ----

function InternationalTab() {
  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="Top Try Scorer" value="30" sub="Gareth Thomas (Wales)" />
        <KPI label="Australia Tests" value="250+" sub="Most played nation" />
        <KPI label="Biggest Win" value="110-4" sub="AUS vs Russia 2000" />
        <KPI label="Active Nations" value="30+" sub="World Rugby League" />
      </div>

      <div className="rgl-grid-2">
        <div className="rgl-card">
          <p className="rgl-card-title">International Try Scoring Leaders</p>
          <BarChart
            data={INT_TRY_SCORERS}
            labelKey="player"
            valueKey="tries"
            colorKey="color"
          />
        </div>

        <div className="rgl-card">
          <p className="rgl-card-title">Top Try Scorers - Full Table</p>
          <div className="rgl-table-wrap">
            <table className="rgl-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Nation</th>
                  <th>Tries</th>
                </tr>
              </thead>
              <tbody>
                {INT_TRY_SCORERS.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: TEXT3, fontWeight: 700 }}>{i + 1}</td>
                    <td className="highlight">{p.player}</td>
                    <td>{p.nation}</td>
                    <td className="accent">{p.tries}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>International Rugby League - Nation Profiles</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Nation</th>
                <th>World Cups</th>
                <th>First Match</th>
                <th>Status</th>
                <th>Nickname</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="highlight">Australia</td>
                <td className="accent">12</td>
                <td>1908</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>The Kangaroos</td>
              </tr>
              <tr>
                <td className="highlight">Great Britain</td>
                <td className="accent">3</td>
                <td>1908</td>
                <td><Pill variant="blue">Retired</Pill></td>
                <td>The Lions</td>
              </tr>
              <tr>
                <td className="highlight">New Zealand</td>
                <td className="accent">0</td>
                <td>1908</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>The Kiwis</td>
              </tr>
              <tr>
                <td className="highlight">England</td>
                <td className="accent">0</td>
                <td>2008</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>The Lions</td>
              </tr>
              <tr>
                <td className="highlight">France</td>
                <td className="accent">0</td>
                <td>1934</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>Les Chanticleers</td>
              </tr>
              <tr>
                <td className="highlight">Samoa</td>
                <td className="accent">0</td>
                <td>1995</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>Toa Samoa</td>
              </tr>
              <tr>
                <td className="highlight">Tonga</td>
                <td className="accent">0</td>
                <td>1995</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>Mate Ma'a Tonga</td>
              </tr>
              <tr>
                <td className="highlight">Papua New Guinea</td>
                <td className="accent">0</td>
                <td>1975</td>
                <td><Pill variant="green">Active</Pill></td>
                <td>The Kumuls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Pacific Nations - Rising Powers</SectionTitle>
      <div className="rgl-card">
        <p
          style={{
            fontSize: '0.9rem',
            color: TEXT2,
            margin: '0 0 1.2rem',
            lineHeight: 1.6,
          }}
        >
          Tonga's remarkable 2017 World Cup campaign shocked the rugby league
          world, defeating Australia for the first time in history. The Pacific
          nations - Samoa, Tonga, Fiji, and Papua New Guinea - have dramatically
          raised competition levels in international rugby league, fueled by
          NRL-based players choosing heritage eligibility over established
          nations.
        </p>
        <div className="rgl-pacific-grid">
          {[
            { name: 'Samoa', note: 'Toa Samoa' },
            { name: 'Tonga', note: 'Mate Ma\'a Tonga' },
            { name: 'Fiji', note: 'The Bati' },
            { name: 'Papua New Guinea', note: 'The Kumuls' },
          ].map((n) => (
            <div key={n.name} className="rgl-pacific-card">
              <div className="rgl-pacific-name">{n.name}</div>
              <div className="rgl-pacific-sub">{n.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Tab: Records ----

function RecordsTab() {
  return (
    <div>
      <div className="rgl-kpi-row">
        <KPI label="Biggest Win" value="110-4" sub="AUS vs Russia (2000)" />
        <KPI label="Top SL Points" value="3,967" sub="Kevin Sinfield" />
        <KPI label="Top NRL Points" value="2,772" sub="Cameron Smith" />
        <KPI label="Top Int Tries" value="30" sub="Gareth Thomas" />
      </div>

      <SectionTitle>All-Time Records</SectionTitle>
      <div className="rgl-record-grid">
        {RECORDS.map((r, i) => (
          <div key={i} className="rgl-record-card">
            <div className="rgl-record-val">{r.val}</div>
            <div className="rgl-record-desc">{r.desc}</div>
            <div className="rgl-record-holder">{r.holder}</div>
          </div>
        ))}
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Individual Milestones</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Record</th>
                <th>Player</th>
                <th>Competition</th>
                <th>Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Points (SL career)</td>
                <td className="accent">3,967</td>
                <td className="highlight">Kevin Sinfield</td>
                <td>Super League</td>
                <td>2002-2015</td>
              </tr>
              <tr>
                <td>Points (NRL career)</td>
                <td className="accent">2,772</td>
                <td className="highlight">Cameron Smith</td>
                <td>NRL</td>
                <td>2002-2020</td>
              </tr>
              <tr>
                <td>Test tries (31 apps)</td>
                <td className="accent">15</td>
                <td className="highlight">Billy Slater</td>
                <td>International</td>
                <td>2004-2017</td>
              </tr>
              <tr>
                <td>International tries</td>
                <td className="accent">30</td>
                <td className="highlight">Gareth Thomas</td>
                <td>International</td>
                <td>1995-2007</td>
              </tr>
              <tr>
                <td>Most games (NRL)</td>
                <td className="accent">430+</td>
                <td className="highlight">Cameron Smith</td>
                <td>NRL</td>
                <td>2002-2020</td>
              </tr>
              <tr>
                <td>Most intl tries (field)</td>
                <td className="accent">27</td>
                <td className="highlight">Lesley Vainikolo</td>
                <td>International</td>
                <td>2000-2012</td>
              </tr>
              <tr>
                <td>Highest Test score</td>
                <td className="accent">110-4</td>
                <td className="highlight">Australia</td>
                <td>World Cup</td>
                <td>2000</td>
              </tr>
              <tr>
                <td>Consecutive WC wins</td>
                <td className="accent">9+</td>
                <td className="highlight">Australia</td>
                <td>World Cup</td>
                <td>1975-2022</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rgl-divider" />

      <SectionTitle>Team Records</SectionTitle>
      <div className="rgl-card">
        <div className="rgl-table-wrap">
          <table className="rgl-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Team</th>
                <th>Value</th>
                <th>Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Most World Cup titles</td>
                <td className="highlight">Australia</td>
                <td className="accent">12</td>
                <td>All-time record</td>
              </tr>
              <tr>
                <td>Most Super League titles</td>
                <td className="highlight">Leeds / St Helens</td>
                <td className="accent">8</td>
                <td>Joint record</td>
              </tr>
              <tr>
                <td>Most NRL titles (era)</td>
                <td className="highlight">Melbourne Storm</td>
                <td className="accent">5</td>
                <td>NRL era only</td>
              </tr>
              <tr>
                <td>Consecutive NRL titles</td>
                <td className="highlight">Penrith Panthers</td>
                <td className="accent">3</td>
                <td>2021-2023</td>
              </tr>
              <tr>
                <td>Highest Test score</td>
                <td className="highlight">Australia</td>
                <td className="accent">110 pts</td>
                <td>vs Russia, WC 2000</td>
              </tr>
              <tr>
                <td>Longest WC winning run</td>
                <td className="highlight">Australia</td>
                <td className="accent">9 consecutive</td>
                <td>1975-2022</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----

export default function RugbyLeagueStatNations() {
  const TABS = [
    'Overview',
    'World Cup',
    'Super League',
    'NRL',
    'International',
    'Records',
  ];

  const [activeTab, setActiveTab] = useState('Overview');

  const totalWCTournaments = useMemo(() => WC_WINNERS.length, []);

  const ausWCPct = useMemo(
    () => Math.round((WC_TITLES[0].wins / totalWCTournaments) * 100),
    [totalWCTournaments]
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="rgl-root">
        {/* Header */}
        <header className="rgl-header">
          <div className="rgl-header-inner">
            <div className="rgl-badge">
              <span>Rugby League</span>
              <span style={{ opacity: 0.5 }}>|</span>
              <span>StatNations</span>
            </div>
            <h1 className="rgl-title">Rugby League Analytics</h1>
            <p className="rgl-subtitle">
              World Cup history, Super League, NRL, international records and
              statistics
            </p>
            <div className="rgl-stats-strip">
              <div className="rgl-stat-item">
                <span className="rgl-stat-val">16</span>
                <span className="rgl-stat-lbl">World Cups</span>
              </div>
              <div className="rgl-stat-item">
                <span className="rgl-stat-val">{ausWCPct}%</span>
                <span className="rgl-stat-lbl">AUS Win Rate</span>
              </div>
              <div className="rgl-stat-item">
                <span className="rgl-stat-val">28</span>
                <span className="rgl-stat-lbl">Super League Seasons</span>
              </div>
              <div className="rgl-stat-item">
                <span className="rgl-stat-val">24</span>
                <span className="rgl-stat-lbl">NRL Seasons</span>
              </div>
              <div className="rgl-stat-item">
                <span className="rgl-stat-val">30+</span>
                <span className="rgl-stat-lbl">Test Nations</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="rgl-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`rgl-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="rgl-content">
          {activeTab === 'Overview' && <OverviewTab />}
          {activeTab === 'World Cup' && <WorldCupTab />}
          {activeTab === 'Super League' && <SuperLeagueTab />}
          {activeTab === 'NRL' && <NRLTab />}
          {activeTab === 'International' && <InternationalTab />}
          {activeTab === 'Records' && <RecordsTab />}
        </main>
      </div>
    </>
  );
}
