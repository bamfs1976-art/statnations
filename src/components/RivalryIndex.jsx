import { useState, useMemo } from 'react';

// ── Rivalry data ──────────────────────────────────────────────────────────────
// Each entry has pre-computed sub-scores (0–100) for the four algorithm factors.
// Final score = volume×0.3 + closeness×0.3 + balance×0.3 + recency×0.1
const RAW_RIVALRIES = [
  // ── Rugby Union ─────────────────────────────────────────────────────────────
  {
    id: 'rugby-france-england',
    sport: 'rugby',   sportLabel: 'Rugby Union', sportEmoji: '🏉', accent: '#10b981',
    teamA: { name: 'France',        flag: '🇫🇷', abbr: 'FRA' },
    teamB: { name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' },
    volume: 95, closeness: 74, balance: 88, recency: 100,
    meetings: 113, winsA: 51, winsB: 54, draws: 8,
    avgMarginNote: '~9 pts avg', lastMet: 2025,
    summary: 'Six Nations anchor fixture since 1906 — never more than a win apart',
  },
  {
    id: 'rugby-nz-sa',
    sport: 'rugby',   sportLabel: 'Rugby Union', sportEmoji: '🏉', accent: '#10b981',
    teamA: { name: 'New Zealand',   flag: '🇳🇿', abbr: 'NZL' },
    teamB: { name: 'South Africa',  flag: '🇿🇦', abbr: 'RSA' },
    volume: 91, closeness: 68, balance: 74, recency: 100,
    meetings: 106, winsA: 61, winsB: 40, draws: 5,
    avgMarginNote: '~12 pts avg', lastMet: 2024,
    summary: '100+ years of Southern Hemisphere supremacy',
  },
  {
    id: 'rugby-ireland-england',
    sport: 'rugby',   sportLabel: 'Rugby Union', sportEmoji: '🏉', accent: '#10b981',
    teamA: { name: 'Ireland',       flag: '🇮🇪', abbr: 'IRL' },
    teamB: { name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' },
    volume: 90, closeness: 71, balance: 80, recency: 100,
    meetings: 140, winsA: 54, winsB: 76, draws: 10,
    avgMarginNote: '~11 pts avg', lastMet: 2025,
    summary: 'Six Nations and Calcutta Cup history — charged with history',
  },
  {
    id: 'rugby-aus-nz',
    sport: 'rugby',   sportLabel: 'Rugby Union', sportEmoji: '🏉', accent: '#10b981',
    teamA: { name: 'Australia',     flag: '🇦🇺', abbr: 'AUS' },
    teamB: { name: 'New Zealand',   flag: '🇳🇿', abbr: 'NZL' },
    volume: 92, closeness: 62, balance: 52, recency: 100,
    meetings: 175, winsA: 48, winsB: 121, draws: 6,
    avgMarginNote: '~15 pts avg', lastMet: 2024,
    summary: 'Bledisloe Cup — contested annually since 1931',
  },
  // ── Football ────────────────────────────────────────────────────────────────
  {
    id: 'football-brazil-argentina',
    sport: 'football', sportLabel: 'Football', sportEmoji: '⚽', accent: '#6366f1',
    teamA: { name: 'Brazil',        flag: '🇧🇷', abbr: 'BRA' },
    teamB: { name: 'Argentina',     flag: '🇦🇷', abbr: 'ARG' },
    volume: 100, closeness: 82, balance: 81, recency: 100,
    meetings: 111, winsA: 41, winsB: 37, draws: 33,
    avgMarginNote: '~1.1 goals avg', lastMet: 2024,
    summary: 'The Superclásico de las Américas — bitterest rivalry in world football',
  },
  {
    id: 'football-england-germany',
    sport: 'football', sportLabel: 'Football', sportEmoji: '⚽', accent: '#6366f1',
    teamA: { name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' },
    teamB: { name: 'Germany',       flag: '🇩🇪', abbr: 'GER' },
    volume: 72, closeness: 68, balance: 72, recency: 100,
    meetings: 36, winsA: 13, winsB: 15, draws: 8,
    avgMarginNote: '~1.4 goals avg', lastMet: 2024,
    summary: '1966 World Cup final, Euro 96, Wembley classics — epochs of football history',
  },
  {
    id: 'football-spain-portugal',
    sport: 'football', sportLabel: 'Football', sportEmoji: '⚽', accent: '#6366f1',
    teamA: { name: 'Spain',         flag: '🇪🇸', abbr: 'ESP' },
    teamB: { name: 'Portugal',      flag: '🇵🇹', abbr: 'POR' },
    volume: 65, closeness: 77, balance: 69, recency: 100,
    meetings: 39, winsA: 17, winsB: 12, draws: 10,
    avgMarginNote: '~1.2 goals avg', lastMet: 2024,
    summary: 'Iberian rivalry brought to life by Messi-era Spain and Ronaldo\'s Portugal',
  },
  // ── Cricket ─────────────────────────────────────────────────────────────────
  {
    id: 'cricket-eng-aus',
    sport: 'cricket',  sportLabel: 'Cricket', sportEmoji: '🏏', accent: '#f59e0b',
    teamA: { name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', abbr: 'ENG' },
    teamB: { name: 'Australia',     flag: '🇦🇺', abbr: 'AUS' },
    volume: 100, closeness: 55, balance: 63, recency: 100,
    meetings: 355, winsA: 110, winsB: 147, draws: 98,
    avgMarginNote: 'Tests since 1882', lastMet: 2025,
    summary: 'The Ashes — oldest international sporting rivalry, born from a mock obituary',
  },
  {
    id: 'cricket-ind-aus',
    sport: 'cricket',  sportLabel: 'Cricket', sportEmoji: '🏏', accent: '#f59e0b',
    teamA: { name: 'India',         flag: '🇮🇳', abbr: 'IND' },
    teamB: { name: 'Australia',     flag: '🇦🇺', abbr: 'AUS' },
    volume: 82, closeness: 58, balance: 75, recency: 100,
    meetings: 115, winsA: 44, winsB: 51, draws: 20,
    avgMarginNote: 'Tests + ODIs', lastMet: 2025,
    summary: 'Modern cricket\'s dominant Test rivalry — Border-Gavaskar Trophy since 1996',
  },
  // ── Tennis ──────────────────────────────────────────────────────────────────
  {
    id: 'tennis-nadal-djokovic',
    sport: 'tennis',   sportLabel: 'Tennis', sportEmoji: '🎾', accent: '#ec4899',
    teamA: { name: 'Rafael Nadal',  flag: '🇪🇸', abbr: 'NAD' },
    teamB: { name: 'Novak Djokovic',flag: '🇷🇸', abbr: 'DJO' },
    volume: 82, closeness: 88, balance: 90, recency: 70,
    meetings: 59, winsA: 28, winsB: 31, draws: 0,
    avgMarginNote: '5 sets avg in majors', lastMet: 2024,
    summary: '59 meetings across every surface and Grand Slam — closest rivalry ever measured',
  },
  {
    id: 'tennis-federer-nadal',
    sport: 'tennis',   sportLabel: 'Tennis', sportEmoji: '🎾', accent: '#ec4899',
    teamA: { name: 'Roger Federer', flag: '🇨🇭', abbr: 'FED' },
    teamB: { name: 'Rafael Nadal',  flag: '🇪🇸', abbr: 'NAD' },
    volume: 64, closeness: 75, balance: 72, recency: 30,
    meetings: 40, winsA: 16, winsB: 24, draws: 0,
    avgMarginNote: 'Five Wimbledon finals', lastMet: 2022,
    summary: 'Greatest rivalry of the Open Era — contrasting styles, contrasting surfaces',
  },
  // ── Rugby League ────────────────────────────────────────────────────────────
  {
    id: 'rl-aus-nz',
    sport: 'rugby-league', sportLabel: 'Rugby League', sportEmoji: '🏈', accent: '#0ea5e9',
    teamA: { name: 'Australia',     flag: '🇦🇺', abbr: 'AUS' },
    teamB: { name: 'New Zealand',   flag: '🇳🇿', abbr: 'NZL' },
    volume: 80, closeness: 62, balance: 55, recency: 90,
    meetings: 72, winsA: 47, winsB: 23, draws: 2,
    avgMarginNote: '~14 pts avg', lastMet: 2024,
    summary: 'Kangaroos vs Kiwis — defining fixture of Pacific rugby league',
  },
];

// Compute final score
function computeScore({ volume, closeness, balance, recency }) {
  return Math.round(volume * 0.3 + closeness * 0.3 + balance * 0.3 + recency * 0.1);
}

const RIVALRIES = RAW_RIVALRIES.map(r => ({ ...r, score: computeScore(r) }))
  .sort((a, b) => b.score - a.score)
  .map((r, i) => ({ ...r, rank: i + 1 }));

// ── Sub-score bar ─────────────────────────────────────────────────────────────
function ScoreBar({ label, value, accent, weight }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
      <div style={{ width: 68, color: '#64748b', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: accent, borderRadius: 2, transition: 'width 600ms ease' }} />
      </div>
      <div style={{ width: 28, textAlign: 'right', color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: 10, flexShrink: 0 }}>
        {value}
      </div>
      <div style={{ width: 22, textAlign: 'right', color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 10, flexShrink: 0 }}>
        ×{weight}
      </div>
    </div>
  );
}

// ── Rivalry card ──────────────────────────────────────────────────────────────
function RivalryCard({ rivalry }) {
  const { teamA, teamB, score, accent, sportEmoji, sportLabel, rank,
          meetings, winsA, winsB, draws, avgMarginNote, lastMet, summary,
          volume, closeness, balance, recency } = rivalry;

  const scoreColor = score >= 85 ? '#ef4444' : score >= 75 ? '#f59e0b' : score >= 65 ? '#10b981' : '#6366f1';

  return (
    <div style={{
      background: '#1e293b',
      border: `1px solid rgba(148,163,184,0.1)`,
      borderRadius: 14,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}40`; e.currentTarget.style.boxShadow = `0 4px 20px ${accent}15`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Rank badge */}
      <div style={{ position: 'absolute', top: 16, left: 18, width: 22, height: 22, borderRadius: 6, background: rank === 1 ? 'rgba(212,160,23,0.2)' : 'rgba(148,163,184,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: rank === 1 ? '#d4a017' : '#64748b', fontFamily: 'var(--font-mono)' }}>
        {rank}
      </div>

      {/* Sport tag */}
      <div style={{ position: 'absolute', top: 16, right: 18, padding: '3px 9px', borderRadius: 6, background: `${accent}18`, border: `1px solid ${accent}30`, fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {sportEmoji} {sportLabel}
      </div>

      {/* Teams vs score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, marginBottom: 16 }}>
        {/* Team A */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 4 }}>{teamA.flag}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', fontFamily: 'var(--font-display)', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teamA.name}</div>
          <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{winsA}W</div>
        </div>

        {/* Score ring */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(30,41,59,0.8) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 16px ${scoreColor}40`,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: '#1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: scoreColor, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 8, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', marginTop: 1 }}>SCORE</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#475569', marginTop: 4, fontFamily: 'var(--font-mono)' }}>⚔️ vs</div>
        </div>

        {/* Team B */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 4 }}>{teamB.flag}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', fontFamily: 'var(--font-display)', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teamB.name}</div>
          <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{winsB}W</div>
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
        {summary}
      </p>

      {/* Key stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Meetings', value: meetings },
          { label: 'H2H', value: `${winsA}-${winsB}${draws ? `-${draws}` : ''}` },
          { label: 'Margin', value: avgMarginNote },
          { label: 'Last', value: lastMet },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'rgba(15,23,42,0.6)', borderRadius: 6, padding: '4px 10px' }}>
            <div style={{ fontSize: 9, color: '#475569', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-mono)', marginTop: 1 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Algorithm breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <ScoreBar label="Volume"    value={volume}    accent={accent} weight="0.3" />
        <ScoreBar label="Closeness" value={closeness} accent={accent} weight="0.3" />
        <ScoreBar label="Balance"   value={balance}   accent={accent} weight="0.3" />
        <ScoreBar label="Recency"   value={recency}   accent={accent} weight="0.1" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RivalryIndex() {
  const [activeSport, setActiveSport] = useState('all');

  const sports = [
    { id: 'all',          label: 'All',          emoji: '⚔️' },
    { id: 'rugby',        label: 'Rugby Union',  emoji: '🏉' },
    { id: 'football',     label: 'Football',     emoji: '⚽' },
    { id: 'cricket',      label: 'Cricket',      emoji: '🏏' },
    { id: 'tennis',       label: 'Tennis',       emoji: '🎾' },
    { id: 'rugby-league', label: 'Rugby League', emoji: '🏈' },
  ];

  const visible = useMemo(() =>
    activeSport === 'all' ? RIVALRIES : RIVALRIES.filter(r => r.sport === activeSport),
    [activeSport],
  );

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
          ⚔️
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Rivalry Index
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Algorithm-scored rivalries across every sport. Score = Volume (30%) + Closeness of margins (30%) + Head-to-head balance (30%) + Recency (10%).
          </p>
        </div>
        {/* Top score legend */}
        <div style={{ flexShrink: 0, display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
          {[{ color: '#ef4444', label: '85+' }, { color: '#f59e0b', label: '75–84' }, { color: '#10b981', label: '65–74' }, { color: '#6366f1', label: '<65' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ color: '#475569' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sport filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {sports.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSport(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              background: activeSport === s.id ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.8)',
              color: activeSport === s.id ? '#ef4444' : '#64748b',
              border: activeSport === s.id ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(148,163,184,0.1)',
              transition: 'all 120ms ease',
            }}
          >
            <span>{s.emoji}</span> {s.label}
            <span style={{ marginLeft: 2, opacity: 0.6, fontSize: 10 }}>
              ({s.id === 'all' ? RIVALRIES.length : RIVALRIES.filter(r => r.sport === s.id).length})
            </span>
          </button>
        ))}
      </div>

      {/* Rivalry grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 16,
      }}>
        {visible.map(r => <RivalryCard key={r.id} rivalry={r} />)}
      </div>

      {/* Algorithm footnote */}
      <div style={{ marginTop: 32, padding: '16px 20px', background: '#1e293b', borderRadius: 12, border: '1px solid rgba(148,163,184,0.08)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', alignSelf: 'center', flexShrink: 0 }}>
          Algorithm
        </div>
        {[
          { factor: 'Volume ×0.3',    desc: 'Total meetings vs sport maximum — more history = higher score' },
          { factor: 'Closeness ×0.3', desc: 'Inverse of average winning margin — tighter matches = higher score' },
          { factor: 'Balance ×0.3',   desc: 'Head-to-head parity — closer to 50/50 win split = higher score' },
          { factor: 'Recency ×0.1',   desc: 'How recently contested — active rivalries score higher' },
        ].map(({ factor, desc }) => (
          <div key={factor} style={{ flex: '1 1 180px', minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', marginBottom: 2 }}>{factor}</div>
            <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
