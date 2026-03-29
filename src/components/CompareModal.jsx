import { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { MODULE_INFO } from '../data/searchIndex.js';

// Per-module stat dimensions for the radar chart
const MODULE_DIMS = {
  rugby: [
    { key: 'worldCups', label: 'World Cups', max: 5 },
    { key: 'rwRanking', label: 'World Rank', max: 10, invert: true },
    { key: 'sixNations', label: '6 Nations', max: 15 },
    { key: 'grandSlams', label: 'Grand Slams', max: 10 },
    { key: 'winRate', label: 'Win Rate %', max: 100 },
  ],
  football: [
    { key: 'worldCups', label: 'World Cups', max: 5 },
    { key: 'continentalTitles', label: 'Continental', max: 10 },
    { key: 'fifaRanking', label: 'FIFA Rank', max: 10, invert: true },
    { key: 'winRate', label: 'Win Rate %', max: 100 },
    { key: 'goalsScored', label: 'Goals/Game', max: 3 },
  ],
  cricket: [
    { key: 'testWins', label: 'Test Wins', max: 400 },
    { key: 'odisWins', label: 'ODI Wins', max: 600 },
    { key: 'worldCups', label: 'World Cups', max: 5 },
    { key: 'winRate', label: 'Win Rate %', max: 100 },
    { key: 'ranking', label: 'ICC Rank', max: 10, invert: true },
  ],
  default: [
    { key: 'titles', label: 'Titles', max: 10 },
    { key: 'ranking', label: 'World Rank', max: 10, invert: true },
    { key: 'winRate', label: 'Win Rate %', max: 100 },
    { key: 'points', label: 'Points', max: 1000 },
    { key: 'experience', label: 'Experience', max: 100 },
  ],
};

// Simulated stats (in a real app these come from module data)
const NATION_STATS = {
  'nz-rugby':  { worldCups: 4, rwRanking: 1, sixNations: 0, grandSlams: 0, winRate: 77 },
  'sa-rugby':  { worldCups: 4, rwRanking: 2, sixNations: 0, grandSlams: 0, winRate: 67 },
  'eng-rugby': { worldCups: 1, rwRanking: 4, sixNations: 32, grandSlams: 12, winRate: 58 },
  'ire-rugby': { worldCups: 0, rwRanking: 3, sixNations: 32, grandSlams: 3, winRate: 62 },
  'fra-rugby': { worldCups: 0, rwRanking: 5, sixNations: 17, grandSlams: 9, winRate: 57 },
  'aus-rugby': { worldCups: 2, rwRanking: 6, sixNations: 0, grandSlams: 0, winRate: 56 },
  'bra-football': { worldCups: 5, continentalTitles: 9, fifaRanking: 5, winRate: 64, goalsScored: 2.1 },
  'ger-football': { worldCups: 4, continentalTitles: 3, fifaRanking: 4, winRate: 60, goalsScored: 1.9 },
  'arg-football': { worldCups: 3, continentalTitles: 15, fifaRanking: 1, winRate: 62, goalsScored: 1.8 },
  'fra-football': { worldCups: 2, continentalTitles: 2, fifaRanking: 2, winRate: 58, goalsScored: 1.7 },
  'ita-football': { worldCups: 4, continentalTitles: 2, fifaRanking: 9, winRate: 56, goalsScored: 1.5 },
  'esp-football': { worldCups: 1, continentalTitles: 3, fifaRanking: 8, winRate: 60, goalsScored: 1.6 },
  'aus-cricket':  { testWins: 392, odisWins: 560, worldCups: 5, winRate: 65, ranking: 1 },
  'ind-cricket':  { testWins: 175, odisWins: 520, worldCups: 3, winRate: 62, ranking: 2 },
  'eng-cricket':  { testWins: 368, odisWins: 440, worldCups: 1, winRate: 53, ranking: 4 },
};

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4'];

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

function normalize(value, max, invert) {
  const v = Math.min((value / max) * 100, 100);
  return invert ? 100 - v : v;
}

export default function CompareModal() {
  const { compareList, compareOpen, setCompareOpen, clearCompare } = useApp();

  const dims = useMemo(() => {
    const module = compareList[0]?.module || 'default';
    return MODULE_DIMS[module] || MODULE_DIMS.default;
  }, [compareList]);

  const radarData = useMemo(() => {
    return dims.map(dim => {
      const row = { dimension: dim.label };
      compareList.forEach(nation => {
        const stats = NATION_STATS[nation.id] || {};
        const raw = stats[dim.key] ?? 0;
        row[nation.id] = normalize(raw, dim.max, dim.invert);
      });
      return row;
    });
  }, [compareList, dims]);

  if (!compareOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && setCompareOpen(false)}
    >
      <div style={{
        width: '100%', maxWidth: 900,
        background: '#1e293b',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 20,
        overflow: 'hidden',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px 16px',
          borderBottom: '1px solid rgba(148,163,184,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
              Nation Comparison
            </div>
            <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9' }}>
              {compareList.map(n => n.name).join(' vs ')}
            </h2>
          </div>
          <button
            onClick={() => setCompareOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 24 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Nation pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {compareList.map((nation, i) => (
              <div key={nation.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 10,
                background: `${COLORS[i]}22`, border: `1px solid ${COLORS[i]}55`,
              }}>
                <span style={{ fontSize: 20 }}>{nation.flag || '🏳️'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{nation.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {MODULE_INFO[nation.module]?.emoji} {MODULE_INFO[nation.module]?.label}
                  </div>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i], marginLeft: 4 }} />
              </div>
            ))}
          </div>

          {/* Radar chart */}
          <div style={{ background: '#263148', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
              Performance Radar (normalised 0–100)
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(148,163,184,0.15)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => `${v.toFixed(0)}%`} />
                {compareList.map((nation, i) => (
                  <Radar
                    key={nation.id}
                    name={nation.name}
                    dataKey={nation.id}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Side-by-side stat cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${compareList.length}, 1fr)`,
            gap: 12,
            marginBottom: 24,
          }}>
            {compareList.map((nation, i) => {
              const stats = NATION_STATS[nation.id];
              return (
                <div key={nation.id} style={{
                  background: '#263148',
                  border: `1px solid ${COLORS[i]}33`,
                  borderRadius: 12, padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{nation.flag || '🏳️'}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: COLORS[i] }}>
                      {nation.name}
                    </span>
                  </div>
                  {stats ? (
                    dims.map(dim => {
                      const raw = stats[dim.key] ?? '—';
                      return (
                        <div key={dim.key} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '6px 0',
                          borderBottom: '1px solid rgba(148,163,184,0.06)',
                        }}>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{dim.label}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>
                            {typeof raw === 'number' ? raw.toLocaleString() : raw}
                            {dim.key === 'winRate' ? '%' : ''}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ fontSize: 13, color: '#475569', fontStyle: 'italic' }}>
                      Detailed stats not yet available for this entity. Navigate to the {MODULE_INFO[nation.module]?.label} module to explore.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={clearCompare}
              style={{
                padding: '8px 20px', borderRadius: 8,
                background: 'transparent', border: '1px solid rgba(148,163,184,0.2)',
                color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => setCompareOpen(false)}
              style={{
                padding: '8px 20px', borderRadius: 8,
                background: '#6366f1', border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
