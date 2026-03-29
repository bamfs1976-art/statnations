import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const ACCENT = '#06b6d4';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURFACE2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const CSS = `
  .ten-root {
    background: ${BG};
    color: ${TEXT1};
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
    padding-bottom: 60px;
  }
  .ten-header {
    background: linear-gradient(135deg,#001a1f 0%,#003d4d 60%,#001a1f 100%);
    padding: 40px 32px 32px;
    border-bottom: 1px solid ${BORDER};
  }
  .ten-header-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .ten-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(6,182,212,0.15);
    border: 1px solid rgba(6,182,212,0.3);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${ACCENT};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .ten-header h1 {
    font-size: 2.6rem;
    font-weight: 800;
    margin: 0 0 8px;
    letter-spacing: -0.02em;
    background: linear-gradient(90deg, ${TEXT1} 0%, ${ACCENT} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ten-header p {
    color: ${TEXT2};
    font-size: 1rem;
    margin: 0;
  }
  .ten-tabs {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 32px 0;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .ten-tab {
    background: transparent;
    border: 1px solid ${BORDER};
    color: ${TEXT2};
    padding: 9px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.18s ease;
  }
  .ten-tab:hover {
    background: ${SURFACE};
    color: ${TEXT1};
    border-color: rgba(6,182,212,0.3);
  }
  .ten-tab.active {
    background: rgba(6,182,212,0.15);
    border-color: ${ACCENT};
    color: ${ACCENT};
    font-weight: 600;
  }
  .ten-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
  }
  .ten-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }
  .ten-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  .ten-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .ten-card-sm {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 20px;
  }
  .ten-card h3 {
    font-size: 1rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .ten-card-sm h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 4px;
  }
  .ten-card p {
    font-size: 0.8rem;
    color: ${TEXT3};
    margin: 0 0 20px;
  }
  .ten-stat-value {
    font-size: 2.4rem;
    font-weight: 800;
    color: ${ACCENT};
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .ten-stat-label {
    font-size: 0.75rem;
    color: ${TEXT3};
    margin-top: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .ten-stat-sub {
    font-size: 0.85rem;
    color: ${TEXT2};
    margin-top: 6px;
  }
  .ten-section-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 6px;
    letter-spacing: -0.02em;
  }
  .ten-section-sub {
    font-size: 0.85rem;
    color: ${TEXT3};
    margin: 0 0 24px;
  }
  .ten-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .ten-table th {
    text-align: left;
    padding: 10px 14px;
    color: ${TEXT3};
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid ${BORDER};
    white-space: nowrap;
  }
  .ten-table td {
    padding: 11px 14px;
    color: ${TEXT2};
    border-bottom: 1px solid ${BORDER};
    vertical-align: middle;
  }
  .ten-table tr:last-child td {
    border-bottom: none;
  }
  .ten-table tr:hover td {
    background: rgba(255,255,255,0.02);
    color: ${TEXT1};
  }
  .ten-rank {
    font-weight: 700;
    color: ${TEXT3};
    width: 28px;
    text-align: center;
  }
  .ten-rank-gold { color: #f59e0b; }
  .ten-rank-silver { color: #94a3b8; }
  .ten-rank-bronze { color: #b45309; }
  .ten-player-name {
    font-weight: 600;
    color: ${TEXT1};
  }
  .ten-pill {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }
  .ten-pill-cyan {
    background: rgba(6,182,212,0.15);
    color: ${ACCENT};
  }
  .ten-pill-gold {
    background: rgba(245,158,11,0.15);
    color: #f59e0b;
  }
  .ten-pill-green {
    background: rgba(34,197,94,0.15);
    color: #22c55e;
  }
  .ten-pill-purple {
    background: rgba(168,85,247,0.15);
    color: #a855f7;
  }
  .ten-divider {
    border: none;
    border-top: 1px solid ${BORDER};
    margin: 20px 0;
  }
  .ten-h2h-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .ten-h2h-title {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${TEXT1};
    margin-bottom: 12px;
  }
  .ten-h2h-bar-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .ten-h2h-name {
    font-size: 12px;
    color: ${TEXT2};
    width: 120px;
    text-align: right;
    flex-shrink: 0;
  }
  .ten-h2h-name-right {
    font-size: 12px;
    color: ${TEXT2};
    width: 120px;
    flex-shrink: 0;
  }
  .ten-h2h-bar-outer {
    flex: 1;
    height: 10px;
    background: ${SURFACE};
    border-radius: 5px;
    overflow: hidden;
    display: flex;
  }
  .ten-h2h-bar-left {
    height: 100%;
    border-radius: 5px 0 0 5px;
    transition: width 0.4s ease;
  }
  .ten-h2h-bar-right {
    height: 100%;
    border-radius: 0 5px 5px 0;
    transition: width 0.4s ease;
  }
  .ten-h2h-score {
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT1};
    min-width: 50px;
    text-align: center;
    flex-shrink: 0;
  }
  .ten-timeline-item {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    position: relative;
  }
  .ten-timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${ACCENT};
    flex-shrink: 0;
    margin-top: 4px;
    position: relative;
    z-index: 1;
  }
  .ten-timeline-line {
    position: absolute;
    left: 4px;
    top: 14px;
    bottom: -16px;
    width: 2px;
    background: ${BORDER};
  }
  .ten-timeline-content h4 {
    font-size: 13px;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 3px;
  }
  .ten-timeline-content p {
    font-size: 12px;
    color: ${TEXT3};
    margin: 0;
  }
  .ten-slam-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .ten-slam-card {
    background: ${SURFACE2};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }
  .ten-slam-card h4 {
    font-size: 11px;
    font-weight: 700;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 8px;
  }
  .ten-slam-winner {
    font-size: 14px;
    font-weight: 700;
    color: ${TEXT1};
    margin-bottom: 4px;
  }
  .ten-slam-year {
    font-size: 11px;
    color: ${TEXT3};
  }
  @media (max-width: 768px) {
    .ten-grid-2, .ten-grid-3 { grid-template-columns: 1fr; }
    .ten-slam-grid { grid-template-columns: 1fr 1fr; }
    .ten-content { padding: 16px; }
    .ten-header { padding: 24px 16px; }
    .ten-tabs { padding: 16px 16px 0; }
    .ten-header h1 { font-size: 1.8rem; }
  }
`;

// ── Static Data ───────────────────────────────────────────────────────────────

const MENS_SLAM_TOTALS = [
  { player: 'Novak Djokovic', country: 'SRB', flag: '🇷🇸', total: 24, ao: 10, fo: 3,  wb: 7, uso: 4 },
  { player: 'Rafael Nadal',   country: 'ESP', flag: '🇪🇸', total: 22, ao: 2,  fo: 14, wb: 3, uso: 4 },
  { player: 'Roger Federer',  country: 'SUI', flag: '🇨🇭', total: 20, ao: 6,  fo: 1,  wb: 8, uso: 5 },
  { player: 'Pete Sampras',   country: 'USA', flag: '🇺🇸', total: 14, ao: 0,  fo: 0,  wb: 7, uso: 5 },
  { player: 'Roy Emerson',    country: 'AUS', flag: '🇦🇺', total: 12, ao: 6,  fo: 2,  wb: 2, uso: 2 },
  { player: 'Bjorn Borg',     country: 'SWE', flag: '🇸🇪', total: 11, ao: 0,  fo: 6,  wb: 5, uso: 0 },
  { player: 'Rod Laver',      country: 'AUS', flag: '🇦🇺', total: 11, ao: 3,  fo: 2,  wb: 4, uso: 2 },
  { player: 'Bill Tilden',    country: 'USA', flag: '🇺🇸', total: 10, ao: 0,  fo: 0,  wb: 3, uso: 7 },
  { player: 'Andre Agassi',   country: 'USA', flag: '🇺🇸', total: 8,  ao: 4,  fo: 1,  wb: 1, uso: 2 },
  { player: 'Jimmy Connors',  country: 'USA', flag: '🇺🇸', total: 8,  ao: 1,  fo: 0,  wb: 2, uso: 5 },
  { player: 'Ivan Lendl',     country: 'CZE', flag: '🇨🇿', total: 8,  ao: 2,  fo: 3,  wb: 0, uso: 3 },
  { player: 'John McEnroe',   country: 'USA', flag: '🇺🇸', total: 7,  ao: 0,  fo: 0,  wb: 3, uso: 4 },
  { player: 'Mats Wilander',  country: 'SWE', flag: '🇸🇪', total: 7,  ao: 3,  fo: 3,  wb: 0, uso: 1 },
];

const WOMENS_SLAM_TOTALS = [
  { player: 'Margaret Court',      country: 'AUS', flag: '🇦🇺', total: 24 },
  { player: 'Serena Williams',     country: 'USA', flag: '🇺🇸', total: 23 },
  { player: 'Steffi Graf',         country: 'GER', flag: '🇩🇪', total: 22 },
  { player: 'Helen Wills Moody',   country: 'USA', flag: '🇺🇸', total: 19 },
  { player: 'Chris Evert',         country: 'USA', flag: '🇺🇸', total: 18 },
  { player: 'Martina Navratilova', country: 'USA', flag: '🇺🇸', total: 18 },
  { player: 'Billie Jean King',    country: 'USA', flag: '🇺🇸', total: 12 },
  { player: 'Monica Seles',        country: 'USA', flag: '🇺🇸', total: 9  },
  { player: 'Iga Swiatek',         country: 'POL', flag: '🇵🇱', total: 4  },
  { player: 'Coco Gauff',          country: 'USA', flag: '🇺🇸', total: 1  },
];

const ATP_YEAR_END_NO1 = [
  { player: 'Novak Djokovic', finishes: 8 },
  { player: 'Ivan Lendl',     finishes: 8 },
  { player: 'Pete Sampras',   finishes: 6 },
  { player: 'Jimmy Connors',  finishes: 5 },
  { player: 'Roger Federer',  finishes: 5 },
  { player: 'John McEnroe',   finishes: 4 },
  { player: 'Lleyton Hewitt', finishes: 2 },
  { player: 'Rafael Nadal',   finishes: 2 },
  { player: 'Carlos Alcaraz', finishes: 2 },
  { player: 'Andy Murray',    finishes: 1 },
];

const RECENT_SLAMS = {
  ao:  [
    { year: 2024, winner: 'Jannik Sinner',   country: '🇮🇹' },
    { year: 2023, winner: 'Novak Djokovic',  country: '🇷🇸' },
    { year: 2022, winner: 'Rafael Nadal',    country: '🇪🇸' },
    { year: 2021, winner: 'Novak Djokovic',  country: '🇷🇸' },
    { year: 2020, winner: 'Novak Djokovic',  country: '🇷🇸' },
    { year: 2019, winner: 'Novak Djokovic',  country: '🇷🇸' },
  ],
  fo:  [
    { year: 2024, winner: 'Carlos Alcaraz', country: '🇪🇸' },
    { year: 2023, winner: 'Novak Djokovic', country: '🇷🇸' },
    { year: 2022, winner: 'Rafael Nadal',   country: '🇪🇸' },
    { year: 2021, winner: 'Novak Djokovic', country: '🇷🇸' },
    { year: 2020, winner: 'Rafael Nadal',   country: '🇪🇸' },
    { year: 2019, winner: 'Rafael Nadal',   country: '🇪🇸' },
  ],
  wb:  [
    { year: 2024, winner: 'Carlos Alcaraz', country: '🇪🇸' },
    { year: 2023, winner: 'Carlos Alcaraz', country: '🇪🇸' },
    { year: 2022, winner: 'Novak Djokovic', country: '🇷🇸' },
    { year: 2021, winner: 'Novak Djokovic', country: '🇷🇸' },
    { year: 2020, winner: '(Not held)',      country: ''     },
    { year: 2019, winner: 'Novak Djokovic', country: '🇷🇸' },
  ],
  uso: [
    { year: 2024, winner: 'Jannik Sinner',    country: '🇮🇹' },
    { year: 2023, winner: 'Daniil Medvedev',  country: '🇷🇺' },
    { year: 2022, winner: 'Carlos Alcaraz',   country: '🇪🇸' },
    { year: 2021, winner: 'Daniil Medvedev',  country: '🇷🇺' },
    { year: 2020, winner: 'Dominic Thiem',    country: '🇦🇹' },
    { year: 2019, winner: 'Rafael Nadal',     country: '🇪🇸' },
  ],
};

const H2H_DATA = [
  {
    matchup: 'Djokovic vs Federer',
    player1: 'Novak Djokovic',
    player2: 'Roger Federer',
    w1: 27, w2: 23,
    color1: '#06b6d4', color2: '#f59e0b',
  },
  {
    matchup: 'Djokovic vs Nadal',
    player1: 'Novak Djokovic',
    player2: 'Rafael Nadal',
    w1: 30, w2: 29,
    color1: '#06b6d4', color2: '#f97316',
  },
  {
    matchup: 'Nadal vs Federer',
    player1: 'Rafael Nadal',
    player2: 'Roger Federer',
    w1: 24, w2: 16,
    color1: '#f97316', color2: '#f59e0b',
  },
];

const RADAR_DATA = [
  { stat: 'Slam Titles', djokovic: 100, nadal: 92,  federer: 83  },
  { stat: 'Year-End #1', djokovic: 100, nadal: 25,  federer: 63  },
  { stat: 'Wimbledon',   djokovic: 88,  nadal: 38,  federer: 100 },
  { stat: 'Clay Mastery',djokovic: 60,  nadal: 100, federer: 30  },
  { stat: 'US Open',     djokovic: 80,  nadal: 80,  federer: 100 },
  { stat: 'Longevity',   djokovic: 95,  nadal: 85,  federer: 80  },
];

const HISTORY_TIMELINE = [
  { year: '1877', event: 'First Wimbledon Championship', desc: 'Spencer Gore wins the inaugural Wimbledon tournament, beginning the Grand Slam era.' },
  { year: '1881', event: 'First US National Championship', desc: 'Richard Sears wins the first US Championship, forerunner of the US Open.' },
  { year: '1891', event: 'First French Championship', desc: 'The French Championships opens, later becoming Roland Garros.' },
  { year: '1905', event: 'First Australian Open', desc: 'Rodney Heath wins the inaugural Australasian Championships in Melbourne.' },
  { year: '1926', event: 'ILTF Standardizes Rules', desc: 'The International Lawn Tennis Federation standardizes rules and competition formats globally.' },
  { year: '1938', event: "Don Budge's Calendar Grand Slam", desc: 'Don Budge becomes the first player to win all four major titles in one calendar year.' },
  { year: '1968', event: 'Open Era Begins', desc: 'Professional players are allowed to compete at Grand Slams, revolutionizing the sport.' },
  { year: '1969', event: "Rod Laver's Second Grand Slam", desc: "Rod Laver completes tennis's only Open Era Grand Slam, winning all four majors in a single year." },
  { year: '1973', event: 'ATP Tour Founded', desc: 'Association of Tennis Professionals established to represent players and organize the tour.' },
  { year: '1975', event: 'WTA Rankings Introduced', desc: "Women's Tennis Association launches official computerized world rankings." },
  { year: '1988', event: "Steffi Graf's Golden Slam", desc: 'Graf wins all four Grand Slams plus Olympic gold — the only Golden Slam in history.' },
  { year: '2003', event: "Federer Era Begins", desc: 'Roger Federer wins his first Wimbledon, launching an era of dominance lasting nearly two decades.' },
  { year: '2008', event: 'Legendary Wimbledon Final', desc: 'Nadal defeats Federer in the "greatest match ever played" — 6-4, 6-4, 6-7, 6-7, 9-7.' },
  { year: '2011', event: 'Big Three Peak Era', desc: "Djokovic wins 3 slams going 70-6 for the year; the Big Three rivalry reaches its peak." },
  { year: '2023', event: 'Djokovic Reaches 24 Slams', desc: 'Djokovic wins his 24th Grand Slam title at the US Open, cementing his status as statistical GOAT.' },
  { year: '2024', event: 'New Generation Rises', desc: 'Carlos Alcaraz and Jannik Sinner each claim multiple Grand Slam titles, closing the Big Three era.' },
];

const SLAM_BAR_DATA = MENS_SLAM_TOTALS.slice(0, 8).map(p => ({
  name: p.player.split(' ').pop(),
  AO: p.ao,
  FO: p.fo,
  WB: p.wb,
  USO: p.uso,
}));

const WOMENS_BAR_DATA = WOMENS_SLAM_TOTALS.map(p => ({
  name: p.player.split(' ').pop(),
  Titles: p.total,
}));

const ATP_NO1_CHART = ATP_YEAR_END_NO1.map(p => ({
  name: p.player.split(' ').pop(),
  'Year-End #1': p.finishes,
}));

// ── Shared Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: SURFACE2,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <p style={{ color: TEXT2, marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || ACCENT, margin: '2px 0' }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="ten-rank ten-rank-gold">1</span>;
  if (rank === 2) return <span className="ten-rank ten-rank-silver">2</span>;
  if (rank === 3) return <span className="ten-rank ten-rank-bronze">3</span>;
  return <span className="ten-rank">{rank}</span>;
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <div>
      <div className="ten-grid-3">
        <div className="ten-card-sm">
          <div className="ten-stat-value">24</div>
          <div className="ten-stat-label">Most Men's Slams</div>
          <div className="ten-stat-sub">Novak Djokovic (SRB)</div>
        </div>
        <div className="ten-card-sm">
          <div className="ten-stat-value">24</div>
          <div className="ten-stat-label">Most Women's Slams</div>
          <div className="ten-stat-sub">Margaret Court (AUS)</div>
        </div>
        <div className="ten-card-sm">
          <div className="ten-stat-value">8</div>
          <div className="ten-stat-label">Most Year-End No.1</div>
          <div className="ten-stat-sub">Djokovic & Lendl (tied)</div>
        </div>
      </div>

      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>Big Three — Grand Slam Titles by Surface</h3>
          <p>Career slam counts across Australian Open, French Open, Wimbledon and US Open</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SLAM_BAR_DATA.slice(0, 3)} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
              <Bar dataKey="AO"  fill="#06b6d4" radius={[3,3,0,0]} name="AO" />
              <Bar dataKey="FO"  fill="#f97316" radius={[3,3,0,0]} name="FO" />
              <Bar dataKey="WB"  fill="#22c55e" radius={[3,3,0,0]} name="WB" />
              <Bar dataKey="USO" fill="#a855f7" radius={[3,3,0,0]} name="USO" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ten-card">
          <h3>Big Three — Multi-Metric Radar</h3>
          <p>Normalized comparison across six key performance dimensions</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke={BORDER} />
              <PolarAngleAxis dataKey="stat" tick={{ fill: TEXT3, fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Djokovic" dataKey="djokovic" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
              <Radar name="Nadal"    dataKey="nadal"    stroke="#f97316" fill="#f97316" fillOpacity={0.10} />
              <Radar name="Federer"  dataKey="federer"  stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.10} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ten-card">
        <h3>All-Time Men's Grand Slam Leaderboard</h3>
        <p>Total Grand Slam singles titles — Open Era and pre-Open Era combined</p>
        <table className="ten-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Country</th>
              <th>AO</th>
              <th>FO</th>
              <th>WB</th>
              <th>USO</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {MENS_SLAM_TOTALS.map((p, i) => (
              <tr key={p.player}>
                <td><RankBadge rank={i + 1} /></td>
                <td className="ten-player-name">{p.flag} {p.player}</td>
                <td><span className="ten-pill ten-pill-cyan">{p.country}</span></td>
                <td>{p.ao || '—'}</td>
                <td>{p.fo || '—'}</td>
                <td>{p.wb || '—'}</td>
                <td>{p.uso || '—'}</td>
                <td>
                  <span style={{ fontWeight: 700, color: i < 3 ? ACCENT : TEXT1 }}>{p.total}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Grand Slams ──────────────────────────────────────────────────────────

function GrandSlamsTab() {
  const slamMeta = {
    ao:  { name: 'Australian Open', surface: 'Hard',  color: '#06b6d4' },
    fo:  { name: 'French Open',     surface: 'Clay',  color: '#f97316' },
    wb:  { name: 'Wimbledon',       surface: 'Grass', color: '#22c55e' },
    uso: { name: 'US Open',         surface: 'Hard',  color: '#a855f7' },
  };

  return (
    <div>
      <p className="ten-section-sub">Recent Grand Slam men's singles winners (2019–2024) across all four majors</p>

      <div className="ten-slam-grid">
        {Object.entries(slamMeta).map(([key, info]) => (
          <div className="ten-slam-card" key={key}>
            <h4 style={{ color: info.color }}>{info.name}</h4>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              background: `${info.color}22`,
              border: `1px solid ${info.color}44`,
              borderRadius: 8,
              fontSize: 10,
              color: info.color,
              marginBottom: 12,
              fontWeight: 600,
            }}>{info.surface}</div>
            {RECENT_SLAMS[key].map(w => (
              <div key={w.year} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: `1px solid ${BORDER}`,
              }}>
                <span style={{ fontSize: 12, color: TEXT3, fontWeight: 600 }}>{w.year}</span>
                <span style={{ fontSize: 12, color: w.year === 2024 ? TEXT1 : TEXT2, fontWeight: w.year === 2024 ? 700 : 400 }}>
                  {w.country} {w.winner}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>Grand Slam Titles by Player — Top 8 (Stacked)</h3>
          <p>Distribution of titles across all four Grand Slams</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={SLAM_BAR_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
              <Bar dataKey="AO"  stackId="a" fill="#06b6d4" name="AO" />
              <Bar dataKey="FO"  stackId="a" fill="#f97316" name="FO" />
              <Bar dataKey="WB"  stackId="a" fill="#22c55e" name="WB" />
              <Bar dataKey="USO" stackId="a" fill="#a855f7" radius={[0,3,3,0]} name="USO" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ten-card">
          <h3>Australian Open All-Time Leaders</h3>
          <p>Most men's singles titles at Melbourne Park</p>
          <table className="ten-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Titles</th></tr>
            </thead>
            <tbody>
              {[
                { p: 'Novak Djokovic', n: 10 },
                { p: 'Roger Federer',  n: 6  },
                { p: 'Roy Emerson',    n: 6  },
                { p: 'Andre Agassi',   n: 4  },
                { p: 'Ken Rosewall',   n: 4  },
                { p: 'Mats Wilander',  n: 3  },
                { p: 'Rafael Nadal',   n: 2  },
              ].sort((a,b) => b.n - a.n).map((row, i) => (
                <tr key={row.p}>
                  <td><RankBadge rank={i+1} /></td>
                  <td className="ten-player-name">{row.p}</td>
                  <td><span className="ten-pill ten-pill-cyan">{row.n}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>French Open All-Time Leaders</h3>
          <p>Most men's singles titles at Roland Garros (clay court)</p>
          <table className="ten-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Titles</th></tr>
            </thead>
            <tbody>
              {[
                { p: 'Rafael Nadal',    n: 14 },
                { p: 'Bjorn Borg',      n: 6  },
                { p: 'Ivan Lendl',      n: 3  },
                { p: 'Mats Wilander',   n: 3  },
                { p: 'Gustavo Kuerten', n: 3  },
                { p: 'Novak Djokovic',  n: 3  },
                { p: 'Jim Courier',     n: 2  },
              ].map((row, i) => (
                <tr key={row.p}>
                  <td><RankBadge rank={i+1} /></td>
                  <td className="ten-player-name">{row.p}</td>
                  <td><span className="ten-pill ten-pill-gold">{row.n}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ten-card">
          <h3>Wimbledon All-Time Leaders</h3>
          <p>Most men's singles titles at the All England Club (grass court)</p>
          <table className="ten-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Titles</th></tr>
            </thead>
            <tbody>
              {[
                { p: 'Roger Federer',  n: 8 },
                { p: 'Novak Djokovic', n: 7 },
                { p: 'Pete Sampras',   n: 7 },
                { p: 'Bjorn Borg',     n: 5 },
                { p: 'Rafael Nadal',   n: 3 },
                { p: 'John McEnroe',   n: 3 },
                { p: 'Boris Becker',   n: 3 },
              ].map((row, i) => (
                <tr key={row.p}>
                  <td><RankBadge rank={i+1} /></td>
                  <td className="ten-player-name">{row.p}</td>
                  <td><span className="ten-pill ten-pill-green">{row.n}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ten-card">
        <h3>US Open All-Time Leaders</h3>
        <p>Most men's singles titles at Flushing Meadows (hard court)</p>
        <table className="ten-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Titles</th></tr>
          </thead>
          <tbody>
            {[
              { p: 'Jimmy Connors',  n: 5 },
              { p: 'Pete Sampras',   n: 5 },
              { p: 'Roger Federer',  n: 5 },
              { p: 'Rafael Nadal',   n: 4 },
              { p: 'Novak Djokovic', n: 4 },
              { p: 'John McEnroe',   n: 4 },
              { p: 'Ivan Lendl',     n: 3 },
            ].map((row, i) => (
              <tr key={row.p}>
                <td><RankBadge rank={i+1} /></td>
                <td className="ten-player-name">{row.p}</td>
                <td><span className="ten-pill ten-pill-purple">{row.n}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: ATP Records ──────────────────────────────────────────────────────────

function ATPRecordsTab() {
  return (
    <div>
      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>Year-End World No. 1 Finishes</h3>
          <p>Number of times a player finished the season ranked #1 in the world</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ATP_NO1_CHART} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Year-End #1" radius={[4,4,0,0]}>
                {ATP_NO1_CHART.map((entry, index) => (
                  <Cell key={index} fill={index < 2 ? ACCENT : index < 5 ? '#f59e0b' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ten-card">
          <h3>Year-End #1 Rankings — Full Table</h3>
          <p>Complete list of players with the most ATP year-end No.1 finishes</p>
          <table className="ten-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Year-End #1s</th></tr>
            </thead>
            <tbody>
              {ATP_YEAR_END_NO1.map((p, i) => (
                <tr key={p.player}>
                  <td><RankBadge rank={i+1} /></td>
                  <td className="ten-player-name">{p.player}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: `${(p.finishes / 8) * 100}px`,
                        height: 6,
                        background: i < 2 ? ACCENT : '#475569',
                        borderRadius: 3,
                      }} />
                      <span style={{ fontWeight: 700, color: i < 2 ? ACCENT : TEXT1 }}>{p.finishes}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ten-card">
        <h3>ATP All-Time Records & Milestones</h3>
        <p>Notable achievements and standing records in the Open Era</p>
        <table className="ten-table">
          <thead>
            <tr><th>Record</th><th>Player</th><th>Mark</th><th>Year</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { record: 'Most Grand Slam titles',              player: 'Novak Djokovic',          mark: '24 titles',        year: '2023',    status: 'Active'   },
              { record: 'Most Wimbledon titles (Open Era)',    player: 'Roger Federer',            mark: '8 titles',         year: '2017',    status: 'Retired'  },
              { record: 'Most French Open titles',            player: 'Rafael Nadal',             mark: '14 titles',        year: '2022',    status: 'Retired'  },
              { record: 'Most weeks at World No. 1',          player: 'Novak Djokovic',           mark: '428+ weeks',       year: 'Ongoing', status: 'Active'   },
              { record: 'Career Golden Masters (all 9)',      player: 'Novak Djokovic',           mark: 'All 9 Masters',    year: '2016',    status: 'Active'   },
              { record: 'Year-End #1 most times',             player: 'Djokovic / Lendl',         mark: '8 times each',     year: '2023',    status: 'Tied'     },
              { record: 'Most US Open titles (Open Era)',     player: 'Connors / Sampras / Federer', mark: '5 each',        year: 'Various', status: 'Tied'     },
              { record: 'Fastest serve recorded',             player: 'Sam Groth',                mark: '263 km/h',         year: '2012',    status: 'Standing' },
              { record: 'Youngest ATP World No. 1',           player: 'Carlos Alcaraz',           mark: '19 yrs 4 months',  year: '2022',    status: 'Standing' },
              { record: 'Most titles in a single season',     player: 'Guillermo Vilas',          mark: '16 titles',        year: '1977',    status: 'Standing' },
            ].map(row => (
              <tr key={row.record}>
                <td style={{ fontWeight: 500, color: TEXT1 }}>{row.record}</td>
                <td className="ten-player-name">{row.player}</td>
                <td><span className="ten-pill ten-pill-cyan">{row.mark}</span></td>
                <td style={{ color: TEXT3 }}>{row.year}</td>
                <td>
                  <span className={`ten-pill ${
                    row.status === 'Active'   ? 'ten-pill-green' :
                    row.status === 'Retired'  ? 'ten-pill-purple' :
                    'ten-pill-gold'
                  }`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ten-card">
        <h3>Career Title Leaders — Open Era</h3>
        <p>All-time ATP singles titles won during the Open Era (1968–present)</p>
        <table className="ten-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Career Titles</th><th>Active Years</th></tr>
          </thead>
          <tbody>
            {[
              { player: 'Jimmy Connors',   titles: 109, years: '1972–1996'    },
              { player: 'Roger Federer',   titles: 103, years: '1998–2022'    },
              { player: 'Ivan Lendl',      titles: 94,  years: '1978–1994'    },
              { player: 'Novak Djokovic',  titles: 98,  years: '2003–present' },
              { player: 'Rafael Nadal',    titles: 92,  years: '2001–2024'    },
              { player: 'John McEnroe',    titles: 77,  years: '1978–1992'    },
              { player: 'Pete Sampras',    titles: 64,  years: '1988–2002'    },
              { player: 'Bjorn Borg',      titles: 64,  years: '1973–1983'    },
              { player: 'Guillermo Vilas', titles: 62,  years: '1970–1992'    },
              { player: 'Andre Agassi',    titles: 60,  years: '1986–2006'    },
            ].sort((a,b) => b.titles - a.titles).map((row, i) => (
              <tr key={row.player}>
                <td><RankBadge rank={i+1} /></td>
                <td className="ten-player-name">{row.player}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: `${(row.titles / 109) * 120}px`,
                      height: 6,
                      background: i === 0 ? ACCENT : SURFACE2,
                      borderRadius: 3,
                      border: `1px solid ${BORDER}`,
                    }} />
                    <span style={{ fontWeight: 700, color: TEXT1 }}>{row.titles}</span>
                  </div>
                </td>
                <td style={{ color: TEXT3, fontSize: 12 }}>{row.years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: WTA Records ──────────────────────────────────────────────────────────

function WTARecordsTab() {
  return (
    <div>
      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>Women's Grand Slam Titles — All-Time</h3>
          <p>Total Grand Slam singles titles across Open and pre-Open eras</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={WOMENS_BAR_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Titles" radius={[4,4,0,0]}>
                {WOMENS_BAR_DATA.map((entry, index) => (
                  <Cell key={index} fill={
                    index === 0 ? '#f97316' :
                    index === 1 ? ACCENT :
                    index === 2 ? '#f59e0b' :
                    '#475569'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="ten-card">
          <h3>All-Time Women's Grand Slam Leaderboard</h3>
          <p>Combined Open and pre-Open Era Grand Slam singles titles</p>
          <table className="ten-table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Country</th><th>Total</th></tr>
            </thead>
            <tbody>
              {WOMENS_SLAM_TOTALS.map((p, i) => (
                <tr key={p.player}>
                  <td><RankBadge rank={i+1} /></td>
                  <td className="ten-player-name">{p.flag} {p.player}</td>
                  <td><span className="ten-pill ten-pill-cyan">{p.country}</span></td>
                  <td style={{ fontWeight: 700, color: i < 3 ? ACCENT : TEXT1 }}>{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ten-card">
        <h3>WTA All-Time Records & Milestones</h3>
        <p>Notable achievements in women's professional tennis history</p>
        <table className="ten-table">
          <thead>
            <tr><th>Record</th><th>Player</th><th>Mark</th><th>Year</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { record: 'Most Grand Slam titles (Open Era)',     player: 'Serena Williams',      mark: '23 titles',         year: '2017', status: 'Retired'  },
              { record: 'Most Grand Slam titles (all-time)',     player: 'Margaret Court',       mark: '24 titles',         year: '1973', status: 'Retired'  },
              { record: 'Most weeks at World No. 1 (WTA)',       player: 'Steffi Graf',          mark: '377 weeks',         year: '1997', status: 'Standing' },
              { record: 'Only Golden Slam (Slams + Olympics)',   player: 'Steffi Graf',          mark: '1988 Golden Slam',  year: '1988', status: 'Unique'   },
              { record: 'Youngest WTA World No. 1',              player: 'Martina Hingis',       mark: '16 years old',      year: '1997', status: 'Standing' },
              { record: 'Most consecutive weeks at No. 1',       player: 'Steffi Graf',          mark: '186 consecutive',   year: '1994', status: 'Standing' },
              { record: 'Most consecutive Wimbledon titles',     player: 'Martina Navratilova',  mark: '6 consecutive',     year: '1987', status: 'Standing' },
              { record: 'Most French Open titles (Open Era)',    player: 'Iga Swiatek',          mark: '4 titles',          year: '2024', status: 'Active'   },
              { record: 'Fastest serve (women)',                  player: 'Georgina Garcia Perez',mark: '220 km/h',          year: '2018', status: 'Standing' },
              { record: 'Most career WTA singles titles',        player: 'Martina Navratilova',  mark: '167 titles',        year: '1994', status: 'Standing' },
            ].map(row => (
              <tr key={row.record}>
                <td style={{ fontWeight: 500, color: TEXT1 }}>{row.record}</td>
                <td className="ten-player-name">{row.player}</td>
                <td><span className="ten-pill ten-pill-gold">{row.mark}</span></td>
                <td style={{ color: TEXT3 }}>{row.year}</td>
                <td>
                  <span className={`ten-pill ${
                    row.status === 'Active'   ? 'ten-pill-green' :
                    row.status === 'Retired'  ? 'ten-pill-purple' :
                    row.status === 'Unique'   ? 'ten-pill-cyan' :
                    'ten-pill-gold'
                  }`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ten-card">
        <h3>WTA Career Title Leaders — Open Era</h3>
        <p>All-time WTA singles titles won during the Open Era</p>
        <table className="ten-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Career Titles</th><th>Active Years</th></tr>
          </thead>
          <tbody>
            {[
              { player: 'Martina Navratilova', titles: 167, years: '1973–2006' },
              { player: 'Chris Evert',         titles: 157, years: '1971–1989' },
              { player: 'Billie Jean King',    titles: 129, years: '1965–1984' },
              { player: 'Steffi Graf',         titles: 107, years: '1982–1999' },
              { player: 'Serena Williams',     titles: 73,  years: '1995–2022' },
              { player: 'Evonne Goolagong',    titles: 68,  years: '1970–1983' },
              { player: 'Virginia Wade',       titles: 55,  years: '1965–1985' },
              { player: 'Monica Seles',        titles: 53,  years: '1989–2003' },
            ].sort((a,b) => b.titles - a.titles).map((row, i) => (
              <tr key={row.player}>
                <td><RankBadge rank={i+1} /></td>
                <td className="ten-player-name">{row.player}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: `${(row.titles / 167) * 120}px`,
                      height: 6,
                      background: i === 0 ? ACCENT : SURFACE2,
                      borderRadius: 3,
                      border: `1px solid ${BORDER}`,
                    }} />
                    <span style={{ fontWeight: 700, color: TEXT1 }}>{row.titles}</span>
                  </div>
                </td>
                <td style={{ color: TEXT3, fontSize: 12 }}>{row.years}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Head to Head ─────────────────────────────────────────────────────────

function HeadToHeadTab() {
  return (
    <div>
      <p className="ten-section-sub">All-time head-to-head records between the Big Three — Djokovic, Nadal, and Federer</p>

      {H2H_DATA.map(match => {
        const total = match.w1 + match.w2;
        const pct1  = (match.w1 / total) * 100;
        const pct2  = (match.w2 / total) * 100;
        return (
          <div className="ten-h2h-card" key={match.matchup}>
            <div className="ten-h2h-title">{match.matchup}</div>
            <div className="ten-h2h-bar-wrap">
              <span className="ten-h2h-name" style={{ color: match.color1 }}>{match.player1}</span>
              <div className="ten-h2h-bar-outer">
                <div className="ten-h2h-bar-left"  style={{ width: `${pct1}%`, background: match.color1 }} />
                <div className="ten-h2h-bar-right" style={{ width: `${pct2}%`, background: match.color2 }} />
              </div>
              <span className="ten-h2h-name-right" style={{ color: match.color2 }}>{match.player2}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 130, paddingRight: 130 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: match.color1 }}>{match.w1}</span>
              <span style={{ fontSize: 12, color: TEXT3, alignSelf: 'center' }}>wins</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: match.color2 }}>{match.w2}</span>
            </div>
          </div>
        );
      })}

      <div className="ten-grid-2" style={{ marginTop: 24 }}>
        <div className="ten-card">
          <h3>Djokovic vs Federer — By Surface</h3>
          <p>50 total meetings broken down by court surface</p>
          <table className="ten-table">
            <thead>
              <tr><th>Surface</th><th>Djokovic</th><th>Federer</th></tr>
            </thead>
            <tbody>
              {[
                { surface: 'Hard',  d: 14, f: 11 },
                { surface: 'Clay',  d: 7,  f: 3  },
                { surface: 'Grass', d: 6,  f: 9  },
                { surface: 'Total', d: 27, f: 23 },
              ].map(row => (
                <tr key={row.surface}>
                  <td style={{ fontWeight: row.surface === 'Total' ? 700 : 400, color: row.surface === 'Total' ? TEXT1 : TEXT2 }}>
                    {row.surface}
                  </td>
                  <td style={{ fontWeight: 700, color: row.d > row.f ? ACCENT : TEXT2 }}>{row.d}</td>
                  <td style={{ fontWeight: 700, color: row.f > row.d ? '#f59e0b' : TEXT2 }}>{row.f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ten-card">
          <h3>Djokovic vs Nadal — By Surface</h3>
          <p>59 total meetings — the most between any two top-ranked players</p>
          <table className="ten-table">
            <thead>
              <tr><th>Surface</th><th>Djokovic</th><th>Nadal</th></tr>
            </thead>
            <tbody>
              {[
                { surface: 'Hard',  d: 20, n: 10 },
                { surface: 'Clay',  d: 7,  n: 16 },
                { surface: 'Grass', d: 3,  n: 3  },
                { surface: 'Total', d: 30, n: 29 },
              ].map(row => (
                <tr key={row.surface}>
                  <td style={{ fontWeight: row.surface === 'Total' ? 700 : 400, color: row.surface === 'Total' ? TEXT1 : TEXT2 }}>
                    {row.surface}
                  </td>
                  <td style={{ fontWeight: 700, color: row.d > row.n ? ACCENT : TEXT2 }}>{row.d}</td>
                  <td style={{ fontWeight: 700, color: row.n > row.d ? '#f97316' : TEXT2 }}>{row.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ten-card">
        <h3>Big Three Head-to-Head Summary Chart</h3>
        <p>Grouped bar comparison of overall wins when facing each other</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={[
              { name: 'Djok vs Fed', Djokovic: 27, Federer: 23 },
              { name: 'Djok vs Nad', Djokovic: 30, Nadal: 29   },
              { name: 'Nad vs Fed',  Nadal: 24,    Federer: 16  },
            ]}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
            <Bar dataKey="Djokovic" fill="#06b6d4" radius={[3,3,0,0]} />
            <Bar dataKey="Federer"  fill="#f59e0b" radius={[3,3,0,0]} />
            <Bar dataKey="Nadal"    fill="#f97316" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Tab: History ──────────────────────────────────────────────────────────────

function HistoryTab() {
  return (
    <div>
      <p className="ten-section-sub">Key moments and milestones in tennis history from 1877 to the present day</p>

      <div className="ten-grid-2">
        <div className="ten-card">
          <h3>Tennis History Timeline</h3>
          <p>Major events that shaped the sport across 150 years</p>
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            {HISTORY_TIMELINE.map((item, i) => (
              <div className="ten-timeline-item" key={item.year}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div className="ten-timeline-dot" />
                  {i < HISTORY_TIMELINE.length - 1 && (
                    <div className="ten-timeline-line" />
                  )}
                </div>
                <div className="ten-timeline-content">
                  <h4>{item.year} — {item.event}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="ten-card" style={{ marginBottom: 20 }}>
            <h3>Era Overview — Dominant Players by Decade</h3>
            <p>Who ruled tennis in each decade of the Open Era</p>
            <table className="ten-table">
              <thead>
                <tr><th>Era</th><th>Dominant Player(s)</th><th>Notable Fact</th></tr>
              </thead>
              <tbody>
                {[
                  { era: '1960s', players: 'Rod Laver, Roy Emerson',       fact: 'Laver wins 2 Calendar Grand Slams' },
                  { era: '1970s', players: 'Bjorn Borg, Jimmy Connors',    fact: 'Open Era rivalries ignite'         },
                  { era: '1980s', players: 'John McEnroe, Ivan Lendl',     fact: 'Lendl dominates mid-to-late decade'},
                  { era: '1990s', players: 'Pete Sampras, Andre Agassi',   fact: 'Sampras wins 7 Wimbledons'         },
                  { era: '2000s', players: 'Roger Federer, Rafael Nadal',  fact: 'Federer wins 12 slams by 2009'     },
                  { era: '2010s', players: 'Djokovic, Federer, Nadal',     fact: 'Big Three era — 56 slams combined' },
                  { era: '2020s', players: 'Alcaraz, Sinner, Djokovic',    fact: 'New generation seizes the slams'   },
                ].map(row => (
                  <tr key={row.era}>
                    <td><span className="ten-pill ten-pill-cyan">{row.era}</span></td>
                    <td className="ten-player-name" style={{ fontSize: 12 }}>{row.players}</td>
                    <td style={{ fontSize: 12, color: TEXT3 }}>{row.fact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ten-card">
            <h3>Calendar Year Grand Slams</h3>
            <p>Players who won all four majors in a single calendar year</p>
            <table className="ten-table">
              <thead>
                <tr><th>Year</th><th>Player</th><th>Gender</th><th>Note</th></tr>
              </thead>
              <tbody>
                {[
                  { year: '1938', player: 'Don Budge',          gender: 'Men',   note: 'First ever Grand Slam'          },
                  { year: '1962', player: 'Rod Laver',          gender: 'Men',   note: 'Pre-Open Era Grand Slam'        },
                  { year: '1969', player: 'Rod Laver',          gender: 'Men',   note: 'Only Open Era men\'s Grand Slam' },
                  { year: '1953', player: 'Maureen Connolly',   gender: 'Women', note: 'First women\'s Grand Slam'       },
                  { year: '1970', player: 'Margaret Court',     gender: 'Women', note: 'Open Era women\'s Grand Slam'    },
                  { year: '1988', player: 'Steffi Graf',        gender: 'Women', note: 'Golden Slam incl. Olympic gold'  },
                ].map(row => (
                  <tr key={`${row.year}-${row.player}`}>
                    <td style={{ color: ACCENT, fontWeight: 700 }}>{row.year}</td>
                    <td className="ten-player-name">{row.player}</td>
                    <td>
                      <span className={`ten-pill ${row.gender === 'Men' ? 'ten-pill-cyan' : 'ten-pill-gold'}`}>
                        {row.gender}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: TEXT3 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="ten-card">
        <h3>Slam Title Progression — Big Three (Simulated Career Arc)</h3>
        <p>Approximate cumulative Grand Slam titles earned across career milestones</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={[
              { year: '2003', Federer: 1,  Nadal: 0,  Djokovic: 0  },
              { year: '2006', Federer: 9,  Nadal: 2,  Djokovic: 0  },
              { year: '2009', Federer: 15, Nadal: 6,  Djokovic: 1  },
              { year: '2012', Federer: 17, Nadal: 11, Djokovic: 5  },
              { year: '2015', Federer: 17, Nadal: 14, Djokovic: 10 },
              { year: '2018', Federer: 20, Nadal: 17, Djokovic: 14 },
              { year: '2021', Federer: 20, Nadal: 20, Djokovic: 20 },
              { year: '2024', Federer: 20, Nadal: 22, Djokovic: 24 },
            ]}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="year" tick={{ fill: TEXT3, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: 12 }} />
            <Line type="monotone" dataKey="Federer"  stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }}  />
            <Line type="monotone" dataKey="Nadal"    stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }}  />
            <Line type="monotone" dataKey="Djokovic" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: '#06b6d4' }}  />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TennisStatNations() {
  const TABS = ['Overview', 'Grand Slams', 'ATP Records', 'WTA Records', 'Head to Head', 'History'];

  const [activeTab, setActiveTab] = useState('Overview');

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'Overview':     return <OverviewTab />;
      case 'Grand Slams':  return <GrandSlamsTab />;
      case 'ATP Records':  return <ATPRecordsTab />;
      case 'WTA Records':  return <WTARecordsTab />;
      case 'Head to Head': return <HeadToHeadTab />;
      case 'History':      return <HistoryTab />;
      default:             return <OverviewTab />;
    }
  }, [activeTab]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ten-root">
        <header className="ten-header">
          <div className="ten-header-inner">
            <div className="ten-badge">
              <span>🎾</span>
              <span>Tennis Analytics</span>
            </div>
            <h1>Tennis StatNations</h1>
            <p>Grand Slam records, ATP &amp; WTA statistics, head-to-head data and tennis history</p>
          </div>
        </header>

        <nav className="ten-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ten-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <main className="ten-content">
          <h2 className="ten-section-title">{activeTab}</h2>
          {tabContent}
        </main>
      </div>
    </>
  );
}
