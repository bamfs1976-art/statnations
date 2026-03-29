import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const ACCENT   = '#ef4444';
const BG       = '#0f172a';
const SURFACE  = '#1e293b';
const SURFACE2 = '#253349';
const TEXT1    = '#f1f5f9';
const TEXT2    = '#94a3b8';
const TEXT3    = '#64748b';
const BORDER   = 'rgba(255,255,255,0.07)';

// ─── Static Data ──────────────────────────────────────────────────────────────
const ODI_WC_WINNERS = [
  { year: 1975, winner: 'West Indies', host: 'England',          final: 'West Indies v Australia' },
  { year: 1979, winner: 'West Indies', host: 'England',          final: 'West Indies v England' },
  { year: 1983, winner: 'India',       host: 'England',          final: 'India v West Indies' },
  { year: 1987, winner: 'Australia',   host: 'India/Pakistan',   final: 'Australia v England' },
  { year: 1992, winner: 'Pakistan',    host: 'Australia/NZ',     final: 'Pakistan v England' },
  { year: 1996, winner: 'Sri Lanka',   host: 'India/Pak/SL',     final: 'Sri Lanka v Australia' },
  { year: 1999, winner: 'Australia',   host: 'England',          final: 'Australia v Pakistan' },
  { year: 2003, winner: 'Australia',   host: 'South Africa',     final: 'Australia v India' },
  { year: 2007, winner: 'Australia',   host: 'West Indies',      final: 'Australia v Sri Lanka' },
  { year: 2011, winner: 'India',       host: 'India/SL/Ban',     final: 'India v Sri Lanka' },
  { year: 2015, winner: 'Australia',   host: 'Australia/NZ',     final: 'Australia v New Zealand' },
  { year: 2019, winner: 'England',     host: 'England',          final: 'England v New Zealand' },
  { year: 2023, winner: 'Australia',   host: 'India',            final: 'Australia v India' },
];

const T20_WC_WINNERS = [
  { year: 2007, winner: 'India',       host: 'South Africa',     final: 'India v Pakistan' },
  { year: 2009, winner: 'Pakistan',    host: 'England',          final: 'Pakistan v Sri Lanka' },
  { year: 2010, winner: 'England',     host: 'West Indies',      final: 'England v Australia' },
  { year: 2012, winner: 'West Indies', host: 'Sri Lanka',        final: 'West Indies v Sri Lanka' },
  { year: 2014, winner: 'Sri Lanka',   host: 'Bangladesh',       final: 'Sri Lanka v India' },
  { year: 2016, winner: 'West Indies', host: 'India',            final: 'West Indies v England' },
  { year: 2021, winner: 'Australia',   host: 'UAE/Oman',         final: 'Australia v New Zealand' },
  { year: 2022, winner: 'England',     host: 'Australia',        final: 'England v Pakistan' },
  { year: 2024, winner: 'India',       host: 'USA/West Indies',  final: 'India v South Africa' },
];

const TOP_TEST_BATTERS = [
  { name: 'Sachin Tendulkar',       country: 'India',        matches: 200, innings: 329, runs: 15921, avg: 53.78, hundreds: 51 },
  { name: 'Ricky Ponting',          country: 'Australia',    matches: 168, innings: 287, runs: 13378, avg: 51.85, hundreds: 41 },
  { name: 'Jacques Kallis',         country: 'South Africa', matches: 166, innings: 280, runs: 13289, avg: 55.37, hundreds: 45 },
  { name: 'Rahul Dravid',           country: 'India',        matches: 164, innings: 286, runs: 13288, avg: 52.31, hundreds: 36 },
  { name: 'Alastair Cook',          country: 'England',      matches: 161, innings: 291, runs: 12472, avg: 45.35, hundreds: 33 },
  { name: 'Kumar Sangakkara',       country: 'Sri Lanka',    matches: 134, innings: 233, runs: 12400, avg: 57.40, hundreds: 38 },
  { name: 'Brian Lara',             country: 'West Indies',  matches: 131, innings: 232, runs: 11953, avg: 52.88, hundreds: 34 },
  { name: 'Shivnarine Chanderpaul', country: 'West Indies',  matches: 164, innings: 280, runs: 11867, avg: 51.37, hundreds: 30 },
  { name: 'Steve Waugh',            country: 'Australia',    matches: 168, innings: 260, runs: 10927, avg: 51.06, hundreds: 32 },
  { name: 'Graham Gooch',           country: 'England',      matches: 118, innings: 215, runs: 8900,  avg: 42.58, hundreds: 20 },
];

const TOP_TEST_WICKETS = [
  { name: 'Muttiah Muralitharan', country: 'Sri Lanka',    matches: 133, wickets: 800, avg: 22.72, sr: 55.0, best: '9/51'  },
  { name: 'Shane Warne',          country: 'Australia',    matches: 145, wickets: 708, avg: 25.41, sr: 57.4, best: '8/71'  },
  { name: 'James Anderson',       country: 'England',      matches: 188, wickets: 703, avg: 26.45, sr: 56.8, best: '7/42'  },
  { name: 'Anil Kumble',          country: 'India',        matches: 132, wickets: 619, avg: 29.65, sr: 65.9, best: '10/74' },
  { name: 'Glenn McGrath',        country: 'Australia',    matches: 124, wickets: 563, avg: 21.64, sr: 51.9, best: '8/24'  },
  { name: 'Courtney Walsh',       country: 'West Indies',  matches: 132, wickets: 519, avg: 24.44, sr: 57.8, best: '7/37'  },
  { name: 'Dale Steyn',           country: 'South Africa', matches: 93,  wickets: 439, avg: 22.95, sr: 42.3, best: '7/51'  },
  { name: 'Kapil Dev',            country: 'India',        matches: 131, wickets: 434, avg: 29.64, sr: 63.9, best: '9/83'  },
  { name: 'Richard Hadlee',       country: 'New Zealand',  matches: 86,  wickets: 431, avg: 22.29, sr: 50.8, best: '9/52'  },
  { name: 'Harbhajan Singh',      country: 'India',        matches: 103, wickets: 417, avg: 32.46, sr: 68.5, best: '8/84'  },
];

const TEST_BATTING_AVERAGES = [
  { name: 'Don Bradman',       country: 'Australia',    matches: 52,  innings: 80,  avg: 99.94, runs: 6996  },
  { name: 'Adam Voges',        country: 'Australia',    matches: 20,  innings: 31,  avg: 61.87, runs: 1485  },
  { name: 'Graeme Pollock',    country: 'South Africa', matches: 23,  innings: 41,  avg: 60.97, runs: 2256  },
  { name: 'George Headley',    country: 'West Indies',  matches: 22,  innings: 40,  avg: 60.83, runs: 2190  },
  { name: 'Herbert Sutcliffe', country: 'England',      matches: 54,  innings: 84,  avg: 60.73, runs: 4555  },
  { name: 'Eddie Paynter',     country: 'England',      matches: 20,  innings: 31,  avg: 59.23, runs: 1540  },
  { name: 'Ken Barrington',    country: 'England',      matches: 82,  innings: 131, avg: 58.67, runs: 6806  },
  { name: 'Everton Weekes',    country: 'West Indies',  matches: 48,  innings: 81,  avg: 58.61, runs: 4455  },
  { name: 'Wally Hammond',     country: 'England',      matches: 85,  innings: 140, avg: 58.45, runs: 7249  },
  { name: 'Len Hutton',        country: 'England',      matches: 79,  innings: 138, avg: 56.67, runs: 6971  },
];

const TEST_BOWLING_AVERAGES = [
  { name: 'George Lohmann',   country: 'England',      matches: 18,  wickets: 112, avg: 10.75, sr: 34.1 },
  { name: 'Billy Barnes',     country: 'England',      matches: 21,  wickets: 51,  avg: 15.54, sr: 39.4 },
  { name: 'SF Barnes',        country: 'England',      matches: 27,  wickets: 189, avg: 16.43, sr: 41.6 },
  { name: 'Fred Spofforth',   country: 'Australia',    matches: 18,  wickets: 94,  avg: 18.41, sr: 43.7 },
  { name: 'Malcolm Marshall', country: 'West Indies',  matches: 81,  wickets: 376, avg: 20.94, sr: 46.7 },
  { name: 'Joel Garner',      country: 'West Indies',  matches: 58,  wickets: 259, avg: 20.97, sr: 50.8 },
  { name: 'Curtly Ambrose',   country: 'West Indies',  matches: 98,  wickets: 405, avg: 20.99, sr: 54.5 },
  { name: 'Glenn McGrath',    country: 'Australia',    matches: 124, wickets: 563, avg: 21.64, sr: 51.9 },
  { name: 'Dennis Lillee',    country: 'Australia',    matches: 70,  wickets: 355, avg: 23.92, sr: 52.0 },
  { name: 'Tom Richardson',   country: 'England',      matches: 14,  wickets: 88,  avg: 25.22, sr: 44.2 },
];

const ICC_MILESTONES = [
  { year: 1909, event: 'ICC Founded',              detail: 'Imperial Cricket Conference established by England, Australia, and South Africa.' },
  { year: 1926, event: 'New Members',              detail: 'West Indies, New Zealand, and India admitted as full members.' },
  { year: 1952, event: 'Pakistan Joins',           detail: 'Pakistan becomes a Test-playing nation following independence and partition.' },
  { year: 1965, event: 'ICC Renamed',              detail: 'Renamed International Cricket Conference; non-Commonwealth nations made eligible.' },
  { year: 1975, event: 'First ODI World Cup',      detail: 'Inaugural ICC Cricket World Cup held in England. West Indies win.' },
  { year: 1981, event: 'Zimbabwe Joins',           detail: 'Zimbabwe admitted as an associate member of the ICC.' },
  { year: 1989, event: 'ICC Restructured',         detail: 'Renamed International Cricket Council with an independent constitution.' },
  { year: 1996, event: 'TV Rights Boom',           detail: 'Cricket becomes a global commercial sport with massive broadcast deals in Asia.' },
  { year: 2001, event: 'Anti-Corruption Unit',     detail: 'ICC Anti-Corruption Unit formed following widespread match-fixing scandals.' },
  { year: 2005, event: 'DRS Introduced',           detail: 'Decision Review System pilot testing begins in international cricket.' },
  { year: 2007, event: 'First T20 World Cup',      detail: 'Inaugural ICC World Twenty20 held in South Africa. India win the inaugural title.' },
  { year: 2012, event: 'Membership Revised',       detail: 'Full members and associate members classification revised and modernised.' },
  { year: 2017, event: "Women's WC Surge",         detail: "ICC Women's World Cup final draws record viewership of over 180 million." },
  { year: 2019, event: 'Super Over Final',         detail: 'England win ODI WC in historic super over tie against New Zealand at Lord\'s.' },
  { year: 2023, event: "Australia's 6th ODI Title",detail: 'Australia claim record 6th ODI World Cup title on Indian soil.' },
  { year: 2024, event: 'India T20 Champions',      detail: 'India win T20 World Cup hosted across the USA and West Indies.' },
];

const TEST_RANKINGS = [
  { rank: 1, team: 'Australia',    rating: 121 },
  { rank: 2, team: 'India',        rating: 116 },
  { rank: 3, team: 'England',      rating: 108 },
  { rank: 4, team: 'New Zealand',  rating: 104 },
  { rank: 5, team: 'South Africa', rating: 99  },
];

const ODI_RANKINGS = [
  { rank: 1, team: 'India',        rating: 115 },
  { rank: 2, team: 'Australia',    rating: 109 },
  { rank: 3, team: 'New Zealand',  rating: 103 },
  { rank: 4, team: 'England',      rating: 98  },
  { rank: 5, team: 'South Africa', rating: 95  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .ckt-root {
    background: ${BG};
    color: ${TEXT1};
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }
  .ckt-header {
    background: linear-gradient(135deg,#1a0533 0%,#3b0a0a 60%,#1a0533 100%);
    padding: 40px 32px 32px;
    border-bottom: 1px solid ${BORDER};
  }
  .ckt-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 6px;
    letter-spacing: -0.5px;
  }
  .ckt-header p {
    color: ${TEXT2};
    margin: 0;
    font-size: 0.95rem;
  }
  .ckt-badge {
    display: inline-block;
    background: ${ACCENT};
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    margin-bottom: 10px;
  }
  .ckt-tabs {
    display: flex;
    gap: 4px;
    padding: 16px 32px 0;
    background: ${SURFACE};
    border-bottom: 1px solid ${BORDER};
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ckt-tabs::-webkit-scrollbar { display: none; }
  .ckt-tab {
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: ${TEXT2};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
  }
  .ckt-tab:hover { color: ${TEXT1}; }
  .ckt-tab.active {
    color: ${ACCENT};
    border-bottom-color: ${ACCENT};
  }
  .ckt-body {
    padding: 28px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .ckt-section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${BORDER};
  }
  .ckt-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .ckt-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px 16px;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .ckt-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .ckt-card-label {
    font-size: 0.75rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }
  .ckt-card-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1;
    margin-bottom: 4px;
  }
  .ckt-card-sub {
    font-size: 0.8rem;
    color: ${TEXT2};
  }
  .ckt-table-wrap {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .ckt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  .ckt-table thead th {
    background: ${SURFACE2};
    color: ${TEXT3};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-size: 0.72rem;
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${BORDER};
  }
  .ckt-table tbody tr {
    border-bottom: 1px solid ${BORDER};
    transition: background 0.15s;
  }
  .ckt-table tbody tr:last-child { border-bottom: none; }
  .ckt-table tbody tr:hover { background: rgba(255,255,255,0.03); }
  .ckt-table tbody td {
    padding: 12px 16px;
    color: ${TEXT2};
  }
  .ckt-table tbody td:first-child { color: ${TEXT1}; font-weight: 500; }
  .ckt-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
    background: rgba(239,68,68,0.15);
    color: ${ACCENT};
  }
  .ckt-rank.gold   { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .ckt-rank.silver { background: rgba(148,163,184,0.15); color: #94a3b8; }
  .ckt-rank.bronze { background: rgba(180,120,60,0.15);  color: #b87c3c; }
  .ckt-chart-wrap {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px 16px;
    margin-bottom: 28px;
  }
  .ckt-chart-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${TEXT2};
    margin-bottom: 16px;
  }
  .ckt-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 28px;
  }
  @media (max-width: 700px) {
    .ckt-grid2 { grid-template-columns: 1fr; }
    .ckt-body  { padding: 16px; }
    .ckt-tabs  { padding: 12px 16px 0; }
    .ckt-header { padding: 24px 16px 20px; }
    .ckt-header h1 { font-size: 1.4rem; }
  }
  .ckt-flag { font-size: 0.85rem; margin-right: 6px; }
  .ckt-hi   { color: ${ACCENT}; font-weight: 700; }
  .ckt-filter-row {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .ckt-filter-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid ${BORDER};
    background: ${SURFACE};
    color: ${TEXT2};
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ckt-filter-btn:hover { border-color: ${ACCENT}; color: ${TEXT1}; }
  .ckt-filter-btn.active {
    background: ${ACCENT};
    border-color: ${ACCENT};
    color: #fff;
    font-weight: 600;
  }
  .ckt-timeline {
    position: relative;
    padding-left: 28px;
  }
  .ckt-timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 4px;
    bottom: 4px;
    width: 2px;
    background: linear-gradient(to bottom, ${ACCENT}, transparent);
  }
  .ckt-tl-item {
    position: relative;
    margin-bottom: 24px;
  }
  .ckt-tl-item::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${ACCENT};
    border: 2px solid ${BG};
    box-shadow: 0 0 0 2px ${ACCENT};
  }
  .ckt-tl-year   { font-size: 0.75rem; font-weight: 700; color: ${ACCENT}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
  .ckt-tl-event  { font-size: 0.95rem; font-weight: 600; color: ${TEXT1}; margin-bottom: 2px; }
  .ckt-tl-detail { font-size: 0.82rem; color: ${TEXT2}; line-height: 1.5; }
  .ckt-subtitle  { font-size: 0.82rem; color: ${TEXT3}; margin-bottom: 20px; margin-top: -8px; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rankClass(i) {
  if (i === 0) return 'ckt-rank gold';
  if (i === 1) return 'ckt-rank silver';
  if (i === 2) return 'ckt-rank bronze';
  return 'ckt-rank';
}

const FLAGS = {
  'Australia':    '🇦🇺',
  'India':        '🇮🇳',
  'West Indies':  '🏏',
  'England':      '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Pakistan':     '🇵🇰',
  'Sri Lanka':    '🇱🇰',
  'New Zealand':  '🇳🇿',
  'South Africa': '🇿🇦',
  'Bangladesh':   '🇧🇩',
  'Zimbabwe':     '🇿🇼',
};

function Flag({ country }) {
  return <span className="ckt-flag">{FLAGS[country] || '🏏'}</span>;
}

const TT = { contentStyle: { background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT1 }, cursor: { fill: 'rgba(255,255,255,0.04)' } };

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const odiChart = useMemo(() => {
    const m = {};
    ODI_WC_WINNERS.forEach(w => { m[w.winner] = (m[w.winner] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, Titles]) => ({ name, Titles }));
  }, []);

  return (
    <div>
      <h2 className="ckt-section-title">Key Statistics</h2>
      <div className="ckt-cards">
        {[
          { label: 'ODI WC Editions',    value: '13',    sub: '1975 – 2023' },
          { label: 'T20 WC Editions',    value: '9',     sub: '2007 – 2024' },
          { label: 'Most ODI WC Titles', value: '6',     sub: 'Australia' },
          { label: 'Most T20 WC Titles', value: '2',     sub: 'India / West Indies / England' },
          { label: 'Test Run Record',    value: '15,921',sub: 'Sachin Tendulkar' },
          { label: 'Test Wicket Record', value: '800',   sub: 'Muttiah Muralitharan' },
          { label: 'Highest Batting Avg',value: '99.94', sub: 'Don Bradman' },
          { label: 'Best Bowling Avg',   value: '10.75', sub: 'George Lohmann' },
        ].map(c => (
          <div className="ckt-card" key={c.label}>
            <div className="ckt-card-label">{c.label}</div>
            <div className="ckt-card-value">{c.value}</div>
            <div className="ckt-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <h2 className="ckt-section-title">Current ICC Rankings</h2>
      <div className="ckt-grid2">
        <div>
          <div style={{ fontSize: '0.78rem', color: TEXT3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Test Rankings</div>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead><tr><th>Rank</th><th>Team</th><th>Rating</th></tr></thead>
              <tbody>
                {TEST_RANKINGS.map((r, i) => (
                  <tr key={r.team}>
                    <td><span className={rankClass(i)}>{r.rank}</span></td>
                    <td><Flag country={r.team} />{r.team}</td>
                    <td className="ckt-hi">{r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', color: TEXT3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>ODI Rankings</div>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead><tr><th>Rank</th><th>Team</th><th>Rating</th></tr></thead>
              <tbody>
                {ODI_RANKINGS.map((r, i) => (
                  <tr key={r.team}>
                    <td><span className={rankClass(i)}>{r.rank}</span></td>
                    <td><Flag country={r.team} />{r.team}</td>
                    <td className="ckt-hi">{r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 className="ckt-section-title">ODI World Cup Titles by Nation</h2>
      <div className="ckt-chart-wrap">
        <div className="ckt-chart-title">All-time ODI World Cup wins per country</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={odiChart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} allowDecimals={false} />
            <Tooltip {...TT} />
            <Bar dataKey="Titles" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── World Cup Tab ────────────────────────────────────────────────────────────
function WorldCupTab() {
  const [view, setView] = useState('odi');

  const odiChart = useMemo(() => {
    const m = {};
    ODI_WC_WINNERS.forEach(w => { m[w.winner] = (m[w.winner] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, v]) => ({ name, 'ODI Titles': v }));
  }, []);

  const t20Chart = useMemo(() => {
    const m = {};
    T20_WC_WINNERS.forEach(w => { m[w.winner] = (m[w.winner] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, v]) => ({ name, 'T20 Titles': v }));
  }, []);

  return (
    <div>
      <div className="ckt-filter-row">
        <button className={`ckt-filter-btn ${view === 'odi' ? 'active' : ''}`} onClick={() => setView('odi')}>ODI World Cup</button>
        <button className={`ckt-filter-btn ${view === 't20' ? 'active' : ''}`} onClick={() => setView('t20')}>T20 World Cup</button>
      </div>

      {view === 'odi' && (
        <>
          <h2 className="ckt-section-title">ICC ODI Cricket World Cup Winners</h2>
          <p className="ckt-subtitle">All 13 editions from 1975 to 2023</p>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead>
                <tr><th>#</th><th>Year</th><th>Winner</th><th>Host</th><th>Final Opponents</th></tr>
              </thead>
              <tbody>
                {ODI_WC_WINNERS.map((w, i) => (
                  <tr key={w.year}>
                    <td><span className={rankClass(i)}>{i + 1}</span></td>
                    <td className="ckt-hi">{w.year}</td>
                    <td><Flag country={w.winner} /><strong>{w.winner}</strong></td>
                    <td>{w.host}</td>
                    <td style={{ color: TEXT3, fontSize: '0.82rem' }}>{w.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ckt-chart-wrap">
            <div className="ckt-chart-title">ODI World Cup titles by country (all-time)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={odiChart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} allowDecimals={false} />
                <Tooltip {...TT} />
                <Bar dataKey="ODI Titles" fill={ACCENT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {view === 't20' && (
        <>
          <h2 className="ckt-section-title">ICC T20 World Cup Winners</h2>
          <p className="ckt-subtitle">All 9 editions from 2007 to 2024</p>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead>
                <tr><th>#</th><th>Year</th><th>Winner</th><th>Host</th><th>Final Opponents</th></tr>
              </thead>
              <tbody>
                {T20_WC_WINNERS.map((w, i) => (
                  <tr key={w.year}>
                    <td><span className={rankClass(i)}>{i + 1}</span></td>
                    <td className="ckt-hi">{w.year}</td>
                    <td><Flag country={w.winner} /><strong>{w.winner}</strong></td>
                    <td>{w.host}</td>
                    <td style={{ color: TEXT3, fontSize: '0.82rem' }}>{w.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ckt-chart-wrap">
            <div className="ckt-chart-title">T20 World Cup titles by country (all-time)</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={t20Chart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} allowDecimals={false} />
                <Tooltip {...TT} />
                <Bar dataKey="T20 Titles" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Test Records Tab ─────────────────────────────────────────────────────────
function TestRecordsTab() {
  const runChart = useMemo(() =>
    TOP_TEST_BATTERS.map(b => ({ name: b.name.split(' ').slice(-1)[0], Runs: b.runs })),
  []);

  const wktChart = useMemo(() =>
    TOP_TEST_WICKETS.map(b => ({ name: b.name.split(' ').slice(-1)[0], Wickets: b.wickets })),
  []);

  return (
    <div>
      <h2 className="ckt-section-title">All-Time Test Run Scorers</h2>
      <p className="ckt-subtitle">Top 10 leading run scorers in Test cricket history</p>
      <div className="ckt-table-wrap">
        <table className="ckt-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Country</th><th>Matches</th><th>Innings</th><th>Runs</th><th>Average</th><th>100s</th></tr>
          </thead>
          <tbody>
            {TOP_TEST_BATTERS.map((b, i) => (
              <tr key={b.name}>
                <td><span className={rankClass(i)}>{i + 1}</span></td>
                <td>{b.name}</td>
                <td><Flag country={b.country} />{b.country}</td>
                <td>{b.matches}</td>
                <td>{b.innings}</td>
                <td className="ckt-hi">{b.runs.toLocaleString()}</td>
                <td>{b.avg}</td>
                <td>{b.hundreds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ckt-chart-wrap">
        <div className="ckt-chart-title">Career Test runs — top 10</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={runChart} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...TT} formatter={v => [v.toLocaleString(), 'Runs']} />
            <Bar dataKey="Runs" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2 className="ckt-section-title">All-Time Test Wicket Takers</h2>
      <p className="ckt-subtitle">Top 10 leading wicket takers in Test cricket history</p>
      <div className="ckt-table-wrap">
        <table className="ckt-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Country</th><th>Matches</th><th>Wickets</th><th>Average</th><th>SR</th><th>Best</th></tr>
          </thead>
          <tbody>
            {TOP_TEST_WICKETS.map((b, i) => (
              <tr key={b.name}>
                <td><span className={rankClass(i)}>{i + 1}</span></td>
                <td>{b.name}</td>
                <td><Flag country={b.country} />{b.country}</td>
                <td>{b.matches}</td>
                <td className="ckt-hi">{b.wickets}</td>
                <td>{b.avg}</td>
                <td>{b.sr}</td>
                <td>{b.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ckt-chart-wrap">
        <div className="ckt-chart-title">Career Test wickets — top 10</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={wktChart} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} />
            <Tooltip {...TT} />
            <Bar dataKey="Wickets" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Batting Tab ──────────────────────────────────────────────────────────────
function BattingTab() {
  const [filter, setFilter] = useState('All');

  const countries = useMemo(() => {
    const s = new Set(TEST_BATTING_AVERAGES.map(b => b.country));
    return ['All', ...Array.from(s)];
  }, []);

  const filtered = useMemo(() =>
    filter === 'All' ? TEST_BATTING_AVERAGES : TEST_BATTING_AVERAGES.filter(b => b.country === filter),
  [filter]);

  const chartData = useMemo(() =>
    filtered.map(b => ({ name: b.name.split(' ').slice(-1)[0], Average: b.avg })),
  [filtered]);

  return (
    <div>
      <h2 className="ckt-section-title">All-Time Test Batting Averages</h2>
      <p className="ckt-subtitle">Highest career averages in Test history (ordered by average)</p>

      <div className="ckt-filter-row">
        {countries.map(c => (
          <button key={c} className={`ckt-filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="ckt-table-wrap">
        <table className="ckt-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Country</th><th>Matches</th><th>Innings</th><th>Runs</th><th>Average</th></tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.name}>
                <td><span className={rankClass(i)}>{i + 1}</span></td>
                <td>{b.name}</td>
                <td><Flag country={b.country} />{b.country}</td>
                <td>{b.matches}</td>
                <td>{b.innings}</td>
                <td>{b.runs.toLocaleString()}</td>
                <td className="ckt-hi">{b.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ckt-chart-wrap">
        <div className="ckt-chart-title">Test batting averages — filtered view</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} domain={[0, 110]} />
            <Tooltip {...TT} />
            <Bar dataKey="Average" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ckt-cards">
        {[
          { label: 'Highest Ever Average',  value: '99.94', sub: 'Don Bradman (Australia)' },
          { label: 'Most Test Hundreds',     value: '51',    sub: 'Sachin Tendulkar' },
          { label: 'Highest Individual Score', value: '400*', sub: 'Brian Lara (2004)' },
          { label: 'Consec. Hundreds Record', value: '5',    sub: 'Everton Weekes (1948–49)' },
        ].map(c => (
          <div className="ckt-card" key={c.label}>
            <div className="ckt-card-label">{c.label}</div>
            <div className="ckt-card-value">{c.value}</div>
            <div className="ckt-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bowling Tab ──────────────────────────────────────────────────────────────
function BowlingTab() {
  const [view, setView] = useState('wickets');

  const avgSorted = useMemo(() =>
    [...TEST_BOWLING_AVERAGES].sort((a, b) => a.avg - b.avg),
  []);

  const avgChartData = useMemo(() =>
    avgSorted.map(b => ({ name: b.name.split(' ').slice(-1)[0], Average: b.avg })),
  [avgSorted]);

  const dualChartData = useMemo(() =>
    TOP_TEST_WICKETS.map(b => ({ name: b.name.split(' ').slice(-1)[0], Wickets: b.wickets, Average: b.avg })),
  []);

  return (
    <div>
      <div className="ckt-filter-row">
        <button className={`ckt-filter-btn ${view === 'wickets' ? 'active' : ''}`} onClick={() => setView('wickets')}>Top Wicket Takers</button>
        <button className={`ckt-filter-btn ${view === 'avg' ? 'active' : ''}`} onClick={() => setView('avg')}>Best Averages</button>
      </div>

      {view === 'wickets' && (
        <>
          <h2 className="ckt-section-title">Top Test Wicket Takers</h2>
          <p className="ckt-subtitle">Career wickets in Test cricket — all-time leaders</p>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead>
                <tr><th>#</th><th>Player</th><th>Country</th><th>Matches</th><th>Wickets</th><th>Average</th><th>SR</th><th>Best</th></tr>
              </thead>
              <tbody>
                {TOP_TEST_WICKETS.map((b, i) => (
                  <tr key={b.name}>
                    <td><span className={rankClass(i)}>{i + 1}</span></td>
                    <td>{b.name}</td>
                    <td><Flag country={b.country} />{b.country}</td>
                    <td>{b.matches}</td>
                    <td className="ckt-hi">{b.wickets}</td>
                    <td>{b.avg}</td>
                    <td>{b.sr}</td>
                    <td>{b.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ckt-chart-wrap">
            <div className="ckt-chart-title">Wickets vs. Average — top 10 all-time</div>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={dualChartData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
                <YAxis yAxisId="l" tick={{ fill: TEXT3, fontSize: 11 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: TEXT3, fontSize: 11 }} domain={[0, 40]} />
                <Tooltip contentStyle={TT.contentStyle} cursor={TT.cursor} />
                <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.8rem' }} />
                <Bar yAxisId="l" dataKey="Wickets" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="r" dataKey="Average" fill={ACCENT}   radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {view === 'avg' && (
        <>
          <h2 className="ckt-section-title">Best Career Test Bowling Averages</h2>
          <p className="ckt-subtitle">Lowest bowling averages in Test history (minimum qualification applies)</p>
          <div className="ckt-table-wrap">
            <table className="ckt-table">
              <thead>
                <tr><th>#</th><th>Player</th><th>Country</th><th>Matches</th><th>Wickets</th><th>Average</th><th>SR</th></tr>
              </thead>
              <tbody>
                {avgSorted.map((b, i) => (
                  <tr key={b.name}>
                    <td><span className={rankClass(i)}>{i + 1}</span></td>
                    <td>{b.name}</td>
                    <td><Flag country={b.country} />{b.country}</td>
                    <td>{b.matches}</td>
                    <td>{b.wickets}</td>
                    <td className="ckt-hi">{b.avg}</td>
                    <td>{b.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ckt-chart-wrap">
            <div className="ckt-chart-title">Bowling average comparison — lower is better</div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={avgChartData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="name" tick={{ fill: TEXT3, fontSize: 11 }} />
                <YAxis tick={{ fill: TEXT3, fontSize: 11 }} />
                <Tooltip {...TT} />
                <Bar dataKey="Average" fill={ACCENT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <div className="ckt-cards">
        {[
          { label: 'Most Test Wickets',   value: '800',   sub: 'Muttiah Muralitharan' },
          { label: 'Lowest Bowling Avg',  value: '10.75', sub: 'George Lohmann' },
          { label: 'Best Test Figures',   value: '10/74', sub: 'Anil Kumble (1999)' },
          { label: 'Most 5-Wicket Hauls', value: '67',    sub: 'Muttiah Muralitharan' },
        ].map(c => (
          <div className="ckt-card" key={c.label}>
            <div className="ckt-card-label">{c.label}</div>
            <div className="ckt-card-value">{c.value}</div>
            <div className="ckt-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab() {
  const lineData = useMemo(() => {
    const map = {};
    return ODI_WC_WINNERS.map(w => {
      map[w.winner] = (map[w.winner] || 0) + 1;
      return {
        year: w.year,
        Australia:    map['Australia']    || 0,
        India:        map['India']        || 0,
        'West Indies':map['West Indies']  || 0,
        England:      map['England']      || 0,
        Pakistan:     map['Pakistan']     || 0,
        'Sri Lanka':  map['Sri Lanka']    || 0,
      };
    });
  }, []);

  return (
    <div>
      <h2 className="ckt-section-title">ICC & Cricket History Timeline</h2>
      <p className="ckt-subtitle">Major milestones from 1909 to the present day</p>

      <div className="ckt-grid2">
        <div>
          <div className="ckt-timeline">
            {ICC_MILESTONES.slice(0, 8).map(m => (
              <div className="ckt-tl-item" key={m.year + m.event}>
                <div className="ckt-tl-year">{m.year}</div>
                <div className="ckt-tl-event">{m.event}</div>
                <div className="ckt-tl-detail">{m.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="ckt-timeline">
            {ICC_MILESTONES.slice(8).map(m => (
              <div className="ckt-tl-item" key={m.year + m.event}>
                <div className="ckt-tl-year">{m.year}</div>
                <div className="ckt-tl-event">{m.event}</div>
                <div className="ckt-tl-detail">{m.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="ckt-section-title">Cumulative ODI World Cup Title Progression</h2>
      <div className="ckt-chart-wrap">
        <div className="ckt-chart-title">Running total of ODI World Cup titles by country over time</div>
        <ResponsiveContainer width="100%" height={290}>
          <LineChart data={lineData} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="year" tick={{ fill: TEXT3, fontSize: 11 }} />
            <YAxis tick={{ fill: TEXT3, fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={TT.contentStyle} cursor={{ stroke: ACCENT, strokeWidth: 1 }} />
            <Legend wrapperStyle={{ color: TEXT2, fontSize: '0.78rem' }} />
            <Line type="monotone" dataKey="Australia"    stroke="#fbbf24" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="India"         stroke={ACCENT}  strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="West Indies"   stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="England"       stroke="#38bdf8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Pakistan"      stroke="#34d399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Sri Lanka"     stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS = ['Overview', 'World Cup', 'Test Records', 'Batting', 'Bowling', 'History'];

export default function CricketStatNations() {
  const [activeTab, setActiveTab] = useState('Overview');

  function renderTab() {
    switch (activeTab) {
      case 'Overview':     return <OverviewTab />;
      case 'World Cup':    return <WorldCupTab />;
      case 'Test Records': return <TestRecordsTab />;
      case 'Batting':      return <BattingTab />;
      case 'Bowling':      return <BowlingTab />;
      case 'History':      return <HistoryTab />;
      default:             return null;
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ckt-root">

        {/* Header */}
        <div className="ckt-header">
          <div className="ckt-badge">Cricket Analytics</div>
          <h1>🏏 Cricket — StatNations</h1>
          <p>World Cup history · Test records · Batting &amp; bowling statistics · Cricket milestones</p>
        </div>

        {/* Tabs */}
        <div className="ckt-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ckt-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="ckt-body">
          {renderTab()}
        </div>

      </div>
    </>
  );
}
