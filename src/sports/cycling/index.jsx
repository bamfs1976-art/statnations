import { useState, useMemo } from 'react';

// ── Design tokens ──────────────────────────────────────────────────────────
const ACCENT   = '#f97316';
const BG       = '#0f172a';
const SURFACE  = '#1e293b';
const SURFACE2 = '#253349';
const TEXT1    = '#f1f5f9';
const TEXT2    = '#94a3b8';
const TEXT3    = '#64748b';
const BORDER   = 'rgba(255,255,255,0.07)';
const HEADER_GRADIENT = 'linear-gradient(135deg,#1a0a00 0%,#3d1a00 60%,#1a0a00 100%)';

// ── Static data ────────────────────────────────────────────────────────────
const TDF_MULTI_WINNERS = [
  { rider: 'Lance Armstrong', wins: 7, note: 'stripped' },
  { rider: 'Jacques Anquetil', wins: 5, note: '' },
  { rider: 'Eddy Merckx', wins: 5, note: '' },
  { rider: 'Bernard Hinault', wins: 5, note: '' },
  { rider: 'Miguel Indurain', wins: 5, note: '' },
  { rider: 'Chris Froome', wins: 4, note: '' },
  { rider: 'Greg LeMond', wins: 3, note: '' },
  { rider: 'Philippe Thys', wins: 3, note: '' },
  { rider: 'Louison Bobet', wins: 3, note: '' },
  { rider: 'Tadej Pogacar', wins: 3, note: '' },
  { rider: 'Jonas Vingegaard', wins: 2, note: '' },
];

const TDF_RECENT = [
  { year: 2010, winner: 'Andy Schleck', note: 'Contador stripped' },
  { year: 2011, winner: 'Cadel Evans', note: '' },
  { year: 2012, winner: 'Bradley Wiggins', note: '' },
  { year: 2013, winner: 'Chris Froome', note: '' },
  { year: 2014, winner: 'Vincenzo Nibali', note: '' },
  { year: 2015, winner: 'Chris Froome', note: '' },
  { year: 2016, winner: 'Chris Froome', note: '' },
  { year: 2017, winner: 'Chris Froome', note: '' },
  { year: 2018, winner: 'Geraint Thomas', note: '' },
  { year: 2019, winner: 'Egan Bernal', note: '' },
  { year: 2020, winner: 'Tadej Pogacar', note: '' },
  { year: 2021, winner: 'Tadej Pogacar', note: '' },
  { year: 2022, winner: 'Jonas Vingegaard', note: '' },
  { year: 2023, winner: 'Jonas Vingegaard', note: '' },
  { year: 2024, winner: 'Tadej Pogacar', note: '' },
];

const GIRO_MULTI_WINNERS = [
  { rider: 'Fausto Coppi', wins: 5 },
  { rider: 'Eddy Merckx', wins: 5 },
  { rider: 'Alfredo Binda', wins: 5 },
  { rider: 'Bernard Hinault', wins: 3 },
  { rider: 'Felice Gimondi', wins: 3 },
  { rider: 'Giovanni Brunero', wins: 3 },
  { rider: 'Costante Girardengo', wins: 3 },
  { rider: 'Chris Froome', wins: 1 },
  { rider: 'Tadej Pogacar', wins: 1 },
];

const VUELTA_MULTI_WINNERS = [
  { rider: 'Roberto Heras', wins: 4 },
  { rider: 'Primoz Roglic', wins: 4 },
  { rider: 'Tony Rominger', wins: 3 },
  { rider: 'Alberto Contador', wins: 3 },
  { rider: 'Alejandro Valverde', wins: 1 },
  { rider: 'Chris Froome', wins: 1 },
  { rider: 'Sepp Kuss', wins: 1 },
  { rider: 'Jonas Vingegaard', wins: 0 },
];

const MONUMENTS = [
  {
    race: 'Milan\u2013San Remo',
    recordHolder: 'Eddy Merckx',
    recordWins: 7,
    others: [],
  },
  {
    race: 'Tour of Flanders',
    recordHolder: 'Tom Boonen',
    recordWins: 4,
    others: ['Eddy Merckx 3', 'Fabian Cancellara 3'],
  },
  {
    race: 'Paris\u2013Roubaix',
    recordHolder: 'Roger De Vlaeminck',
    recordWins: 4,
    others: ['Eddy Merckx 3'],
  },
  {
    race: 'Li\u00e8ge\u2013Bastogne\u2013Li\u00e8ge',
    recordHolder: 'Eddy Merckx',
    recordWins: 5,
    others: [],
  },
  {
    race: 'Il Lombardia',
    recordHolder: 'Eddy Merckx',
    recordWins: 5,
    others: [],
  },
];

const HOUR_RECORDS = [
  { year: 1972, rider: 'Eddy Merckx', distance: 49.431 },
  { year: 1984, rider: 'Francesco Moser', distance: 51.151 },
  { year: 1993, rider: 'Graeme Obree', distance: 52.713 },
  { year: 1996, rider: 'Tony Rominger', distance: 55.291 },
  { year: 2015, rider: 'Matthias Br\u00e4ndle', distance: 51.852 },
  { year: 2015, rider: 'Rohan Dennis', distance: 52.491 },
  { year: 2016, rider: 'Alex Dowsett', distance: 52.937 },
  { year: 2019, rider: 'Victor Campenaerts', distance: 55.089 },
  { year: 2022, rider: 'Filippo Ganna', distance: 56.792 },
];

const NATIONS_GRAND_TOUR = [
  { nation: 'Belgium', wins: 37 },
  { nation: 'France', wins: 36 },
  { nation: 'Italy', wins: 30 },
  { nation: 'Spain', wins: 24 },
  { nation: 'USA', wins: 13 },
  { nation: 'Slovenia', wins: 10 },
  { nation: 'Switzerland', wins: 8 },
  { nation: 'Netherlands', wins: 8 },
  { nation: 'Luxembourg', wins: 6 },
  { nation: 'UK', wins: 5 },
  { nation: 'Colombia', wins: 3 },
].sort((a, b) => b.wins - a.wins);

const UCI_WORLDS = [
  { year: 2017, winner: 'Peter Sagan' },
  { year: 2018, winner: 'Alejandro Valverde' },
  { year: 2019, winner: 'Mads Pedersen' },
  { year: 2020, winner: 'Julian Alaphilippe' },
  { year: 2021, winner: 'Julian Alaphilippe' },
  { year: 2022, winner: 'Remco Evenepoel' },
  { year: 2023, winner: 'Mathieu van der Poel' },
  { year: 2024, winner: 'Tadej Pogacar' },
];

const TABS = ['Overview', "Tour de France", "Giro d'Italia", 'Vuelta', 'Monuments', 'Records'];

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  .cyc-root {
    background: ${BG};
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: ${TEXT1};
  }
  .cyc-header {
    background: ${HEADER_GRADIENT};
    padding: 40px 32px 32px;
    border-bottom: 1px solid ${BORDER};
  }
  .cyc-header-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .cyc-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(249,115,22,0.15);
    border: 1px solid rgba(249,115,22,0.35);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${ACCENT};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .cyc-header h1 {
    margin: 0 0 8px;
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 800;
    color: ${TEXT1};
    letter-spacing: -0.02em;
  }
  .cyc-header-sub {
    color: ${TEXT2};
    font-size: 15px;
    margin: 0;
  }
  .cyc-header-stats {
    display: flex;
    gap: 28px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .cyc-header-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .cyc-header-stat-val {
    font-size: 22px;
    font-weight: 800;
    color: ${ACCENT};
  }
  .cyc-header-stat-lbl {
    font-size: 11px;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .cyc-tabs {
    background: ${SURFACE};
    border-bottom: 1px solid ${BORDER};
    overflow-x: auto;
    scrollbar-width: none;
  }
  .cyc-tabs::-webkit-scrollbar { display: none; }
  .cyc-tab-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    gap: 2px;
  }
  .cyc-tab {
    background: none;
    border: none;
    color: ${TEXT3};
    font-size: 13px;
    font-weight: 500;
    padding: 14px 18px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
    letter-spacing: 0.02em;
  }
  .cyc-tab:hover { color: ${TEXT1}; }
  .cyc-tab.active {
    color: ${ACCENT};
    border-bottom-color: ${ACCENT};
  }
  .cyc-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px;
  }
  .cyc-section-title {
    font-size: 18px;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cyc-section-title::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: ${ACCENT};
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cyc-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 28px;
  }
  .cyc-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 28px;
  }
  .cyc-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }
  .cyc-stat-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 10px;
    padding: 20px;
    text-align: center;
  }
  .cyc-stat-card-val {
    font-size: 32px;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1;
    margin-bottom: 6px;
  }
  .cyc-stat-card-lbl {
    font-size: 12px;
    color: ${TEXT2};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cyc-stat-card-sub {
    font-size: 11px;
    color: ${TEXT3};
    margin-top: 4px;
  }
  .cyc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  .cyc-table th {
    text-align: left;
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 600;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.07em;
    border-bottom: 1px solid ${BORDER};
  }
  .cyc-table td {
    padding: 11px 14px;
    color: ${TEXT2};
    border-bottom: 1px solid ${BORDER};
    vertical-align: middle;
  }
  .cyc-table tr:last-child td { border-bottom: none; }
  .cyc-table tr:hover td { background: rgba(249,115,22,0.04); }
  .cyc-table td:first-child { color: ${TEXT1}; font-weight: 500; }
  .cyc-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    background: ${SURFACE2};
    color: ${TEXT3};
  }
  .cyc-rank.gold   { background: rgba(234,179,8,0.15);  color: #eab308; }
  .cyc-rank.silver { background: rgba(148,163,184,0.15); color: #94a3b8; }
  .cyc-rank.bronze { background: rgba(180,83,9,0.15);   color: #b45309; }
  .cyc-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }
  .cyc-badge-warn {
    background: rgba(239,68,68,0.15);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
  }
  .cyc-badge-accent {
    background: rgba(249,115,22,0.15);
    color: ${ACCENT};
    border: 1px solid rgba(249,115,22,0.25);
  }
  .cyc-badge-blue {
    background: rgba(59,130,246,0.15);
    color: #60a5fa;
    border: 1px solid rgba(59,130,246,0.2);
  }

  /* ---- Bar chart ---- */
  .cyc-bar-chart { display: flex; flex-direction: column; gap: 10px; }
  .cyc-bar-row {
    display: grid;
    grid-template-columns: 120px 1fr 44px;
    align-items: center;
    gap: 12px;
  }
  .cyc-bar-label {
    font-size: 12px;
    color: ${TEXT2};
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cyc-bar-track {
    height: 22px;
    background: ${SURFACE2};
    border-radius: 4px;
    overflow: hidden;
  }
  .cyc-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${ACCENT}, #fb923c);
    border-radius: 4px;
    transition: width 0.6s ease;
  }
  .cyc-bar-fill-alt {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
  .cyc-bar-val {
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT1};
  }

  /* ---- Line chart (SVG) ---- */
  .cyc-line-chart-wrap {
    width: 100%;
    overflow-x: auto;
  }
  .cyc-line-chart svg {
    display: block;
    width: 100%;
    min-width: 480px;
    height: 220px;
    overflow: visible;
  }

  /* ---- Monument cards ---- */
  .cyc-monument-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 16px;
    margin-bottom: 0;
  }
  .cyc-monument-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 10px;
    padding: 18px;
    transition: border-color 0.2s;
  }
  .cyc-monument-card:hover { border-color: rgba(249,115,22,0.35); }
  .cyc-monument-name {
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT1};
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .cyc-monument-wins {
    font-size: 30px;
    font-weight: 800;
    color: ${ACCENT};
    margin-bottom: 2px;
    line-height: 1;
  }
  .cyc-monument-rider {
    font-size: 12px;
    color: ${TEXT2};
    margin-bottom: 10px;
  }
  .cyc-monument-others {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .cyc-monument-others li {
    font-size: 11px;
    color: ${TEXT3};
    padding: 3px 0;
    border-top: 1px solid ${BORDER};
  }

  /* ---- UCI Worlds ---- */
  .cyc-worlds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
    gap: 12px;
  }
  .cyc-worlds-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 8px;
    padding: 14px;
  }
  .cyc-worlds-year {
    font-size: 11px;
    font-weight: 700;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .cyc-worlds-winner {
    font-size: 14px;
    font-weight: 600;
    color: ${TEXT1};
  }

  .cyc-footnote {
    font-size: 11px;
    color: ${TEXT3};
    margin-top: 12px;
    margin-bottom: 0;
    line-height: 1.6;
  }

  @media (max-width: 700px) {
    .cyc-content { padding: 20px 16px; }
    .cyc-header { padding: 28px 16px 24px; }
    .cyc-tab-inner { padding: 0 16px; }
    .cyc-grid-2 { grid-template-columns: 1fr; }
    .cyc-grid-3 { grid-template-columns: 1fr 1fr; }
    .cyc-bar-row { grid-template-columns: 80px 1fr 36px; }
  }
`;

// ── Sub-components ─────────────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, altColor = false, maxOverride }) {
  const max = maxOverride || Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="cyc-bar-chart">
      {data.map((item, i) => {
        const pct = max > 0 ? (item[valueKey] / max) * 100 : 0;
        return (
          <div className="cyc-bar-row" key={i}>
            <div className="cyc-bar-label" title={item[labelKey]}>
              {item[labelKey]}
            </div>
            <div className="cyc-bar-track">
              <div
                className={`cyc-bar-fill${altColor ? ' cyc-bar-fill-alt' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="cyc-bar-val">{item[valueKey]}</div>
          </div>
        );
      })}
    </div>
  );
}

function HourRecordChart({ data }) {
  const W = 560;
  const H = 200;
  const PAD = { top: 16, right: 24, bottom: 40, left: 56 };

  const minY = 48;
  const maxY = 58;
  const minX = 1968;
  const maxX = 2026;

  const sx = x => PAD.left + ((x - minX) / (maxX - minX)) * (W - PAD.left - PAD.right);
  const sy = y => H - PAD.bottom - ((y - minY) / (maxY - minY)) * (H - PAD.top - PAD.bottom);

  const pts = data.map(d => ({ ...d, px: sx(d.year), py: sy(d.distance) }));
  const polyline = pts.map(p => `${p.px},${p.py}`).join(' ');
  const areaBottom = H - PAD.bottom;

  const yTicks = [49, 51, 53, 55, 57];
  const xTicks = [1972, 1984, 1993, 1996, 2015, 2019, 2022];

  return (
    <div className="cyc-line-chart-wrap">
      <div className="cyc-line-chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="cyc-hr-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map(t => (
            <line
              key={t}
              x1={PAD.left} y1={sy(t)}
              x2={W - PAD.right} y2={sy(t)}
              stroke={BORDER} strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {yTicks.map(t => (
            <text key={t} x={PAD.left - 8} y={sy(t) + 4}
              textAnchor="end" fontSize="10" fill={TEXT3}>
              {t}
            </text>
          ))}

          {/* X-axis labels */}
          {xTicks.map(t => (
            <text key={t} x={sx(t)} y={H - PAD.bottom + 18}
              textAnchor="middle" fontSize="10" fill={TEXT3}>
              {t}
            </text>
          ))}

          {/* Area */}
          <polygon
            points={`${PAD.left},${areaBottom} ${polyline} ${W - PAD.right},${areaBottom}`}
            fill="url(#cyc-hr-grad)"
          />

          {/* Line */}
          <polyline
            points={polyline}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.px} cy={p.py} r="5" fill={ACCENT} />
              <circle cx={p.px} cy={p.py} r="2.5" fill={BG} />
            </g>
          ))}

          {/* Y-axis title */}
          <text
            x={14} y={H / 2}
            textAnchor="middle" fontSize="10" fill={TEXT3}
            transform={`rotate(-90, 14, ${H / 2})`}
          >
            km
          </text>
        </svg>
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
  return <span className={`cyc-rank ${cls}`}>{rank}</span>;
}

// ── Tab panels ─────────────────────────────────────────────────────────────
function OverviewPanel() {
  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">5</div>
          <div className="cyc-stat-card-lbl">Eddy Merckx</div>
          <div className="cyc-stat-card-sub">TdF wins — most legitimate</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">56.792</div>
          <div className="cyc-stat-card-lbl">Hour Record (km)</div>
          <div className="cyc-stat-card-sub">Filippo Ganna, 2022</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">3</div>
          <div className="cyc-stat-card-lbl">Tadej Pogacar</div>
          <div className="cyc-stat-card-sub">TdF titles (2020–21, 2024)</div>
        </div>
      </div>

      <div className="cyc-grid-2">
        <div className="cyc-card">
          <div className="cyc-section-title">Grand Tour Wins by Nation</div>
          <BarChart data={NATIONS_GRAND_TOUR} valueKey="wins" labelKey="nation" />
        </div>
        <div className="cyc-card">
          <div className="cyc-section-title">UCI Worlds Road Race (2017–2024)</div>
          <div className="cyc-worlds-grid">
            {UCI_WORLDS.map(w => (
              <div className="cyc-worlds-card" key={w.year}>
                <div className="cyc-worlds-year">{w.year}</div>
                <div className="cyc-worlds-winner">{w.winner}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Monument Classics — Record Holders</div>
        <div className="cyc-monument-grid">
          {MONUMENTS.map(m => (
            <div className="cyc-monument-card" key={m.race}>
              <div className="cyc-monument-name">{m.race}</div>
              <div className="cyc-monument-wins">{m.recordWins}</div>
              <div className="cyc-monument-rider">{m.recordHolder}</div>
              {m.others.length > 0 && (
                <ul className="cyc-monument-others">
                  {m.others.map(o => <li key={o}>{o}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TdFPanel() {
  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">111</div>
          <div className="cyc-stat-card-lbl">Editions (1903–2024)</div>
          <div className="cyc-stat-card-sub">excl. war years</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">21</div>
          <div className="cyc-stat-card-lbl">Stages</div>
          <div className="cyc-stat-card-sub">modern format</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">~3 400</div>
          <div className="cyc-stat-card-lbl">km per edition</div>
          <div className="cyc-stat-card-sub">average distance</div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Multiple Winners — All-Time</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Rider</th>
              <th>Wins</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {TDF_MULTI_WINNERS.map((r, i) => (
              <tr key={r.rider}>
                <td><RankBadge rank={i + 1} /></td>
                <td>{r.rider}</td>
                <td><span className="cyc-badge cyc-badge-accent">{r.wins}</span></td>
                <td>
                  {r.note && <span className="cyc-badge cyc-badge-warn">{r.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Wins Distribution — Top Winners</div>
        <BarChart
          data={TDF_MULTI_WINNERS.filter(r => r.wins >= 2)}
          valueKey="wins"
          labelKey="rider"
          maxOverride={7}
        />
        <p className="cyc-footnote">
          * Lance Armstrong's 7 titles were stripped by UCI in 2012 due to doping violations.
        </p>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Recent Winners (2010–2024)</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Winner</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {[...TDF_RECENT].reverse().map(r => (
              <tr key={r.year}>
                <td style={{ color: TEXT3, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {r.year}
                </td>
                <td>{r.winner}</td>
                <td>
                  {r.note && <span className="cyc-badge cyc-badge-warn">{r.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function GiroPanel() {
  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">107</div>
          <div className="cyc-stat-card-lbl">Editions (1909–2024)</div>
          <div className="cyc-stat-card-sub">oldest Grand Tour</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">5</div>
          <div className="cyc-stat-card-lbl">Record wins</div>
          <div className="cyc-stat-card-sub">Coppi / Merckx / Binda</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">21</div>
          <div className="cyc-stat-card-lbl">Stages</div>
          <div className="cyc-stat-card-sub">incl. TTs & mountain stages</div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Multiple Winners — All-Time</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Rider</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {GIRO_MULTI_WINNERS.map((r, i) => (
              <tr key={r.rider}>
                <td><RankBadge rank={i + 1} /></td>
                <td>{r.rider}</td>
                <td><span className="cyc-badge cyc-badge-accent">{r.wins}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Wins Distribution</div>
        <BarChart
          data={GIRO_MULTI_WINNERS.filter(r => r.wins >= 1)}
          valueKey="wins"
          labelKey="rider"
          altColor
          maxOverride={5}
        />
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Jersey Classification</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>Jersey</th>
              <th>Italian name</th>
              <th>For</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Pink</td><td>Maglia Rosa</td><td>Overall GC leader (since 1931)</td></tr>
            <tr><td>Blue</td><td>Maglia Azzurra</td><td>Mountains classification</td></tr>
            <tr><td>Cyclamen</td><td>Maglia Ciclamino</td><td>Points classification</td></tr>
            <tr><td>White</td><td>Maglia Bianca</td><td>Best young rider</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function VueltaPanel() {
  const vueltaFiltered = VUELTA_MULTI_WINNERS.filter(r => r.wins >= 1).sort((a, b) => b.wins - a.wins);
  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">79</div>
          <div className="cyc-stat-card-lbl">Editions (1935–2024)</div>
          <div className="cyc-stat-card-sub">youngest Grand Tour</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">4</div>
          <div className="cyc-stat-card-lbl">Record wins</div>
          <div className="cyc-stat-card-sub">Heras &amp; Roglic</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">2023</div>
          <div className="cyc-stat-card-lbl">Sepp Kuss</div>
          <div className="cyc-stat-card-sub">first American winner</div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Multiple Winners — All-Time</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Rider</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {vueltaFiltered.map((r, i) => (
              <tr key={r.rider}>
                <td><RankBadge rank={i + 1} /></td>
                <td>{r.rider}</td>
                <td><span className="cyc-badge cyc-badge-accent">{r.wins}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Wins Distribution</div>
        <BarChart
          data={vueltaFiltered}
          valueKey="wins"
          labelKey="rider"
          maxOverride={4}
        />
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Key Facts</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Leader jersey</td><td>Rojo (red) — worn by overall GC leader</td></tr>
            <tr><td>Timing</td><td>September, closing the Grand Tour season</td></tr>
            <tr><td>Iconic climbs</td><td>Angliru, Lagos de Covadonga, Alto de l'Angliru</td></tr>
            <tr><td>Primoz Roglic</td><td>4 consecutive victories 2019–2022, tying the all-time record</td></tr>
            <tr><td>Spanish dominance</td><td>Spain has the most Vuelta victories by nation</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function MonumentsPanel() {
  const merckxBreakdown = [
    { race: 'Milan\u2013San Remo', wins: 7 },
    { race: 'Li\u00e8ge\u2013Bastogne\u2013Li\u00e8ge', wins: 5 },
    { race: 'Il Lombardia', wins: 5 },
    { race: 'Tour of Flanders', wins: 3 },
    { race: 'Paris\u2013Roubaix', wins: 3 },
  ];

  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">5</div>
          <div className="cyc-stat-card-lbl">Monument Classics</div>
          <div className="cyc-stat-card-sub">cycling's prestige one-day races</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">23</div>
          <div className="cyc-stat-card-lbl">Eddy Merckx total</div>
          <div className="cyc-stat-card-sub">Monument wins across all 5</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">7</div>
          <div className="cyc-stat-card-lbl">Milan–San Remo</div>
          <div className="cyc-stat-card-sub">Merckx — single-race record</div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Record Holders per Monument</div>
        <div className="cyc-monument-grid">
          {MONUMENTS.map(m => (
            <div className="cyc-monument-card" key={m.race}>
              <div className="cyc-monument-name">{m.race}</div>
              <div className="cyc-monument-wins">{m.recordWins}</div>
              <div className="cyc-monument-rider">{m.recordHolder}</div>
              {m.others.length > 0 && (
                <ul className="cyc-monument-others">
                  {m.others.map(o => <li key={o}>{o}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Eddy Merckx — Monument Wins Breakdown</div>
        <BarChart data={merckxBreakdown} valueKey="wins" labelKey="race" maxOverride={7} />
        <p className="cyc-footnote">
          Eddy Merckx accumulated 23 Monument victories during his career — a record widely considered unbreakable.
        </p>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Monument Quick Reference</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>Race</th>
              <th>Country</th>
              <th>Terrain</th>
              <th>First edition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Milan\u2013San Remo</td>
              <td>Italy</td>
              <td>Flat / sprint finishes</td>
              <td>1907</td>
            </tr>
            <tr>
              <td>Tour of Flanders</td>
              <td>Belgium</td>
              <td>Cobbles &amp; short climbs</td>
              <td>1913</td>
            </tr>
            <tr>
              <td>Paris\u2013Roubaix</td>
              <td>France</td>
              <td>Cobblestones — Hell of the North</td>
              <td>1896</td>
            </tr>
            <tr>
              <td>Li\u00e8ge\u2013Bastogne\u2013Li\u00e8ge</td>
              <td>Belgium</td>
              <td>Ardennes climbers</td>
              <td>1892</td>
            </tr>
            <tr>
              <td>Il Lombardia</td>
              <td>Italy</td>
              <td>Lakes &amp; mountain climbs</td>
              <td>1905</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function RecordsPanel() {
  return (
    <>
      <div className="cyc-grid-3">
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">56.792</div>
          <div className="cyc-stat-card-lbl">Current Hour Record (km)</div>
          <div className="cyc-stat-card-sub">Filippo Ganna, 2022</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">+15%</div>
          <div className="cyc-stat-card-lbl">Improvement since 1972</div>
          <div className="cyc-stat-card-sub">49.431 → 56.792 km</div>
        </div>
        <div className="cyc-stat-card">
          <div className="cyc-stat-card-val">9</div>
          <div className="cyc-stat-card-lbl">Notable records listed</div>
          <div className="cyc-stat-card-sub">1972 – 2022</div>
        </div>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">UCI Hour Record — Progression</div>
        <HourRecordChart data={HOUR_RECORDS} />
        <p className="cyc-footnote">
          Note: Records set between 1984 and 2014 were contested under varying equipment rules.
          The UCI unified standards in 2014, requiring road-bike geometry.
        </p>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Hour Record Holders — Full Table</div>
        <table className="cyc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Rider</th>
              <th>Distance (km)</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            {HOUR_RECORDS.map((r, i) => {
              const prev = i > 0 ? HOUR_RECORDS[i - 1].distance : null;
              const delta = prev !== null ? (r.distance - prev).toFixed(3) : null;
              return (
                <tr key={i}>
                  <td><RankBadge rank={i + 1} /></td>
                  <td style={{ color: TEXT3, fontVariantNumeric: 'tabular-nums' }}>{r.year}</td>
                  <td>{r.rider}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: ACCENT, fontWeight: 700 }}>
                    {r.distance.toFixed(3)}
                  </td>
                  <td>
                    {delta !== null && (
                      <span className="cyc-badge cyc-badge-blue">+{delta} km</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="cyc-card">
        <div className="cyc-section-title">Grand Tour Wins by Nation (All-Time)</div>
        <BarChart
          data={NATIONS_GRAND_TOUR}
          valueKey="wins"
          labelKey="nation"
          maxOverride={40}
        />
        <p className="cyc-footnote">
          Totals across Tour de France, Giro d'Italia, and Vuelta a Espa\u00f1a.
          Slovenia's total is driven largely by Tadej Poga\u010dar and Primo\u017e Rogli\u010d.
        </p>
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function CyclingStatNations() {
  const [activeTab, setActiveTab] = useState(0);

  const totalGrandTourWins = useMemo(
    () => NATIONS_GRAND_TOUR.reduce((s, n) => s + n.wins, 0),
    []
  );

  const topNation = useMemo(() => NATIONS_GRAND_TOUR[0], []);

  const currentHourRecord = useMemo(
    () => HOUR_RECORDS[HOUR_RECORDS.length - 1],
    []
  );

  const renderPanel = () => {
    switch (activeTab) {
      case 0: return <OverviewPanel />;
      case 1: return <TdFPanel />;
      case 2: return <GiroPanel />;
      case 3: return <VueltaPanel />;
      case 4: return <MonumentsPanel />;
      case 5: return <RecordsPanel />;
      default: return <OverviewPanel />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="cyc-root">

        {/* ── Header ── */}
        <div className="cyc-header">
          <div className="cyc-header-inner">
            <div className="cyc-header-badge">
              <span>&#x1f6b4;</span>
              <span>Cycling Analytics</span>
            </div>
            <h1>Cycling StatNations</h1>
            <p className="cyc-header-sub">
              Grand Tours, Monument classics, hour records and historical data
              across professional road cycling.
            </p>
            <div className="cyc-header-stats">
              <div className="cyc-header-stat">
                <span className="cyc-header-stat-val">{totalGrandTourWins}</span>
                <span className="cyc-header-stat-lbl">Grand Tour wins tracked</span>
              </div>
              <div className="cyc-header-stat">
                <span className="cyc-header-stat-val">{topNation.nation}</span>
                <span className="cyc-header-stat-lbl">Most GT wins — {topNation.wins}</span>
              </div>
              <div className="cyc-header-stat">
                <span className="cyc-header-stat-val">{currentHourRecord.distance}</span>
                <span className="cyc-header-stat-lbl">Hour record km — {currentHourRecord.rider}</span>
              </div>
              <div className="cyc-header-stat">
                <span className="cyc-header-stat-val">5</span>
                <span className="cyc-header-stat-lbl">Monument classics</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="cyc-tabs">
          <div className="cyc-tab-inner">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`cyc-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Panel content ── */}
        <div className="cyc-content">
          {renderPanel()}
        </div>

      </div>
    </>
  );
}
