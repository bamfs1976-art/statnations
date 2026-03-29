import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MODULE_INFO } from '../data/searchIndex.js';

const RECORDS = [
  // Rugby Union
  { id: 'r1',  sport: 'rugby',     category: 'Team',    record: 'Most Rugby World Cup wins',           holder: 'New Zealand',        value: '4 titles', year: '2015', flag: '🇳🇿', numeric: 4 },
  { id: 'r2',  sport: 'rugby',     category: 'Team',    record: 'Most Six Nations titles (outright)',   holder: 'Wales',              value: '28 titles', year: '2022', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', numeric: 28 },
  { id: 'r3',  sport: 'rugby',     category: 'Team',    record: 'Highest RWC score',                   holder: 'NZ vs Japan',        value: '145–17', year: '1995', flag: '🏉', numeric: 145 },
  { id: 'r4',  sport: 'rugby',     category: 'Player',  record: 'Most international tries',            holder: 'Brian O\'Driscoll',  value: '83 tries', year: '2011', flag: '🇮🇪', numeric: 83 },
  // Football
  { id: 'f1',  sport: 'football',  category: 'Team',    record: 'Most FIFA World Cup wins',            holder: 'Brazil',             value: '5 titles', year: '2002', flag: '🇧🇷', numeric: 5 },
  { id: 'f2',  sport: 'football',  category: 'Team',    record: 'Most consecutive WC appearances',     holder: 'Brazil',             value: '22 WCs',  year: '2022', flag: '🇧🇷', numeric: 22 },
  { id: 'f3',  sport: 'football',  category: 'Player',  record: 'Most WC goals (men)',                 holder: 'Miroslav Klose',     value: '16 goals', year: '2014', flag: '🇩🇪', numeric: 16 },
  { id: 'f4',  sport: 'football',  category: 'Player',  record: 'Most WC appearances',                holder: 'Lothar Matthäus',    value: '25 games', year: '1998', flag: '🇩🇪', numeric: 25 },
  // Olympics
  { id: 'o1',  sport: 'olympics',  category: 'Nation',  record: 'Most Summer Olympic gold medals (all time)', holder: 'United States', value: '1,061 golds', year: '2024', flag: '🇺🇸', numeric: 1061 },
  { id: 'o2',  sport: 'olympics',  category: 'Athlete', record: 'Most Olympic gold medals (individual)', holder: 'Michael Phelps', value: '23 golds', year: '2016', flag: '🇺🇸', numeric: 23 },
  { id: 'o3',  sport: 'olympics',  category: 'Nation',  record: 'Most golds in one Games',             holder: 'USA 1984',           value: '83 golds', year: '1984', flag: '🇺🇸', numeric: 83 },
  // Athletics
  { id: 'a1',  sport: 'athletics', category: 'Running', record: "100m Men's World Record",             holder: 'Usain Bolt',         value: '9.58s',    year: '2009', flag: '🇯🇲', numeric: 9.58 },
  { id: 'a2',  sport: 'athletics', category: 'Running', record: "Marathon Men's World Record",         holder: 'Kelvin Kiptum',      value: '2:00:35',  year: '2023', flag: '🇰🇪', numeric: 120.58 },
  { id: 'a3',  sport: 'athletics', category: 'Running', record: "200m Men's World Record",             holder: 'Usain Bolt',         value: '19.19s',   year: '2009', flag: '🇯🇲', numeric: 19.19 },
  { id: 'a4',  sport: 'athletics', category: 'Jump',    record: "Long Jump Men's World Record",        holder: 'Mike Powell',        value: '8.95m',    year: '1991', flag: '🇺🇸', numeric: 8.95 },
  // Cricket
  { id: 'c1',  sport: 'cricket',   category: 'Team',    record: 'Most ODI World Cup wins',             holder: 'Australia',          value: '6 titles', year: '2023', flag: '🇦🇺', numeric: 6 },
  { id: 'c2',  sport: 'cricket',   category: 'Batting', record: 'Highest Test innings',                holder: 'Sri Lanka vs India', value: '952/6d',   year: '1997', flag: '🇱🇰', numeric: 952 },
  { id: 'c3',  sport: 'cricket',   category: 'Bowling', record: 'Most Test wickets',                   holder: 'Muttiah Muralitharan', value: '800 wkts', year: '2010', flag: '🇱🇰', numeric: 800 },
  { id: 'c4',  sport: 'cricket',   category: 'Batting', record: 'Most Test runs',                      holder: 'Sachin Tendulkar',   value: '15,921',   year: '2013', flag: '🇮🇳', numeric: 15921 },
  // Tennis
  { id: 't1',  sport: 'tennis',    category: 'Men',     record: 'Most Grand Slam titles (men)',        holder: 'Novak Djokovic',     value: '24 titles', year: '2023', flag: '🇷🇸', numeric: 24 },
  { id: 't2',  sport: 'tennis',    category: 'Women',   record: 'Most Grand Slam titles (women)',      holder: 'Margaret Court',     value: '24 titles', year: '1973', flag: '🇦🇺', numeric: 24 },
  { id: 't3',  sport: 'tennis',    category: 'Men',     record: 'Most Wimbledon titles (men)',         holder: 'Roger Federer',      value: '8 titles', year: '2017', flag: '🇨🇭', numeric: 8 },
  // Cycling
  { id: 'cy1', sport: 'cycling',   category: 'Grand Tour', record: 'Most Tour de France wins',        holder: 'Lance Armstrong†',   value: '7 titles*', year: '2005', flag: '🇺🇸', numeric: 7 },
  { id: 'cy2', sport: 'cycling',   category: 'Grand Tour', record: 'Most Grand Tour wins (legitimate)', holder: 'Eddy Merckx',      value: '11 titles', year: '1974', flag: '🇧🇪', numeric: 11 },
  // Rugby League
  { id: 'rl1', sport: 'rugby-league', category: 'Team', record: 'Most Rugby League World Cup wins',   holder: 'Australia',          value: '12 titles', year: '2017', flag: '🇦🇺', numeric: 12 },
  // Eurovision
  { id: 'e1',  sport: 'eurovision', category: 'Country', record: 'Most Eurovision wins',               holder: 'Ireland & Sweden',   value: '7 wins',   year: '1996', flag: '🇮🇪', numeric: 7 },
  { id: 'e2',  sport: 'eurovision', category: 'Score',   record: 'Highest Eurovision score',           holder: 'Ukraine 2022',       value: '631 pts',  year: '2022', flag: '🇺🇦', numeric: 631 },
  // Nobel
  { id: 'n1',  sport: 'nobel',     category: 'Country',  record: 'Most Nobel Prize laureates',        holder: 'United States',      value: '400+ prizes', year: '2024', flag: '🇺🇸', numeric: 400 },
  { id: 'n2',  sport: 'nobel',     category: 'Person',   record: 'Youngest Nobel laureate',            holder: 'Malala Yousafzai',   value: 'Age 17',   year: '2014', flag: '🇵🇰', numeric: 17 },
  // Economics
  { id: 'ec1', sport: 'economics', category: 'GDP',      record: 'Largest national economy (nominal GDP)', holder: 'United States', value: '$27.4T',  year: '2024', flag: '🇺🇸', numeric: 27400 },
  { id: 'ec2', sport: 'economics', category: 'Debt',     record: 'Highest public debt to GDP',        holder: 'Japan',              value: '263%',     year: '2024', flag: '🇯🇵', numeric: 263 },
];

const SPORTS = ['all', ...Object.keys(MODULE_INFO)];
const CATEGORIES = ['all', 'Team', 'Player', 'Person', 'Nation', 'Athlete', 'Running', 'Jump', 'Batting', 'Bowling', 'Men', 'Women', 'Grand Tour', 'Country', 'Score', 'GDP', 'Debt'];

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

export default function RecordTracker({ onNavigate }) {
  const [sportFilter, setSportFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('cards'); // 'cards' | 'chart'

  const filtered = RECORDS.filter(r => {
    if (sportFilter !== 'all' && r.sport !== sportFilter) return false;
    if (catFilter !== 'all' && r.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.record.toLowerCase().includes(q) && !r.holder.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sportGroups = filtered.reduce((acc, r) => {
    if (!acc[r.sport]) acc[r.sport] = [];
    acc[r.sport].push(r);
    return acc;
  }, {});

  const chartData = Object.entries(sportGroups).map(([sport, records]) => ({
    sport: MODULE_INFO[sport]?.label || sport,
    count: records.length,
    accent: MODULE_INFO[sport]?.accent || '#6366f1',
  }));

  const s = {
    page: { padding: '24px 16px', maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-body)' },
    hero: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 },
    heroIcon: { width: 56, height: 56, borderRadius: 14, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
    heroTitle: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)', margin: 0 },
    heroSub: { fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 },
    filters: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' },
    chip: (active) => ({
      padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', border: 'none',
      fontFamily: 'var(--font-display)', transition: 'all 120ms ease',
      background: active ? '#d4a017' : 'var(--surface)', color: active ? '#000' : 'var(--text-secondary)',
    }),
    card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', cursor: 'pointer', transition: 'border-color 200ms ease' },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroIcon}>🏆</div>
        <div>
          <h1 style={s.heroTitle}>Record Tracker</h1>
          <p style={s.heroSub}>Cross-sport greatest achievements — {RECORDS.length} records across {Object.keys(MODULE_INFO).length} modules</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['cards','chart'].map(v => (
            <button key={v} onClick={() => setView(v)} style={s.chip(view === v)}>
              {v === 'cards' ? '⊞ Cards' : '📊 Chart'}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search records or holders…"
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '6px 12px', fontSize: 13, color: 'var(--text-primary)', outline: 'none',
            fontFamily: 'var(--font-body)', width: 220,
          }}
        />
        {['all', 'rugby', 'football', 'olympics', 'athletics', 'cricket', 'tennis', 'cycling', 'eurovision', 'nobel', 'economics'].map(sport => (
          <button key={sport} style={s.chip(sportFilter === sport)} onClick={() => setSportFilter(sport)}>
            {sport === 'all' ? 'All Sports' : (MODULE_INFO[sport]?.emoji + ' ' + MODULE_INFO[sport]?.label)}
          </button>
        ))}
      </div>

      <div style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 16 }}>
        {filtered.length} record{filtered.length !== 1 ? 's' : ''} shown
      </div>

      {view === 'chart' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
            Records by Module
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
              <XAxis dataKey="sport" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" name="Records" radius={[4, 4, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.accent} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records by sport group */}
      {Object.entries(sportGroups).map(([sport, records]) => {
        const mod = MODULE_INFO[sport] || { label: sport, emoji: '📊', accent: '#6366f1' };
        return (
          <div key={sport} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
              paddingBottom: 8, borderBottom: `2px solid ${mod.accent}44`,
            }}>
              <span style={{ fontSize: 20 }}>{mod.emoji}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: mod.accent }}>
                {mod.label}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', marginLeft: 4 }}>
                {records.length} record{records.length !== 1 ? 's' : ''}
              </span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate(sport)}
                  style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 6,
                    background: `${mod.accent}22`, border: `1px solid ${mod.accent}44`,
                    color: mod.accent, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  Open module →
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {records.map(rec => (
                <div
                  key={rec.id}
                  style={{
                    ...s.card,
                    borderLeft: `3px solid ${mod.accent}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 28, lineHeight: 1, marginTop: 2 }}>{rec.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                        {rec.category}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.4 }}>
                        {rec.record}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: mod.accent }}>
                          {rec.value}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                          {rec.holder}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)', flexShrink: 0,
                    }}>
                      {rec.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-dim)' }}>
          No records match your filters.
        </div>
      )}
    </div>
  );
}
