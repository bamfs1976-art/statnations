import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { useData } from '../../lib/useData.js';

// ── Design constants ──────────────────────────────────────────────────────────
const ACCENT   = '#8b5cf6';
const ACCENT2  = '#a78bfa';
const BG       = '#0f172a';
const SURFACE  = '#1e293b';
const SURFACE2 = '#253349';
const TEXT1    = '#f1f5f9';
const TEXT2    = '#94a3b8';
const TEXT3    = '#64748b';
const BORDER   = 'rgba(255,255,255,0.07)';

// ── Discipline category map ───────────────────────────────────────────────────
const DISC_CATS = {
  Sprints:         ['100 Metres','150 Metres','200 Metres','300 Metres','400 Metres','50 Metres','55 Metres','60 Metres'],
  Hurdles:         ['100 Metres Hurdles','110 Metres Hurdles','300 Metres Hurdles','400 Metres Hurdles','50 Metres Hurdles','55 Metres Hurdles','60 Metres Hurdles'],
  'Middle Distance':['800 Metres','1000 Metres','1500 Metres','Mile','2000 Metres','3000 Metres'],
  'Long Distance': ['5000 Metres','10,000 Metres','15,000 Metres','20,000 Metres','25,000 Metres','30,000 Metres','One Hour'],
  'Road':          ['Half Marathon','Marathon','5 Kilometres Road','10 Kilometres Road','15 Kilometres Road','20 Kilometres Road','25 Kilometres Road','30 Kilometres Road','50 Kilometres Road','100 Kilometres Road','Mile Road','Mile Short Track'],
  Steeplechase:    ['2000 Metres Steeplechase','3000 Metres Steeplechase'],
  Jumps:           ['High Jump','Long Jump','Triple Jump','Pole Vault'],
  Throws:          ['Discus Throw','Hammer Throw','Javelin Throw','Shot Put'],
  Combined:        ['Decathlon','Heptathlon'],
  Relays:          ['4x100 Metres Relay','4x200 Metres Relay','4x400 Metres Relay','4x400 Metres Relay Mixed','4x800 Metres Relay','4x1500 Metres Relay','Distance Medley','Road Relay'],
  'Race Walk':     ['10,000 Metres Race Walk','20 Kilometres Race Walk','35 Kilometres Race Walk','50 Kilometres Race Walk','50,000 Metres Race Walk'],
  'Indoor Sprints':['50 Metres','55 Metres','60 Metres','200 Metres Short Track','300 Metres Short Track','400 Metres Short Track','500 Metres Short Track','600 Metres Short Track'],
  'Indoor Distance':['800 Metres Short Track','1000 Metres Short Track','1500 Metres Short Track','Mile Short Track','2 Miles Short Track','2000 Metres Short Track','3000 Metres Short Track','5000 Metres Short Track'],
  'Indoor Hurdles':['50 Metres Hurdles','55 Metres Hurdles','60 Metres Hurdles'],
  'Indoor Relays': ['4x200 Metres Relay Short Track','4x400 Metres Relay Short Track','4x800 Metres Relay Short Track'],
  'Indoor Combined':['Heptathlon Short Track','Pentathlon Short Track'],
  'Indoor Race Walk':['3000 Metres Race Walk Short Track','5000 Metres Race Walk Short Track'],
};

function getDisciplineCategory(disc) {
  for (const [cat, discs] of Object.entries(DISC_CATS)) {
    if (discs.some(d => disc.startsWith(d) || d === disc)) return cat;
  }
  return 'Other';
}

// ── Country name lookup ───────────────────────────────────────────────────────
const COUNTRY_NAMES = {
  USA:'United States',KEN:'Kenya',ETH:'Ethiopia',RUS:'Russia',URS:'Soviet Union',
  JAM:'Jamaica',GDR:'East Germany',CHN:'China',NED:'Netherlands',GBR:'Great Britain',
  CUB:'Cuba',GER:'Germany',AUS:'Australia',JPN:'Japan',FRA:'France',NOR:'Norway',
  CZE:'Czechia',SVK:'Slovakia',TCH:'Czechoslovakia',BLR:'Belarus',UKR:'Ukraine',
  MAR:'Morocco',ALG:'Algeria',TUN:'Tunisia',ZIM:'Zimbabwe',RSA:'South Africa',
  QAT:'Qatar',BRN:'Bahrain',ESP:'Spain',POL:'Poland',FIN:'Finland',SWE:'Sweden',
  CAN:'Canada',BRA:'Brazil',MEX:'Mexico',ARG:'Argentina',COL:'Colombia',ECU:'Ecuador',
  NZL:'New Zealand',AUS:'Australia',BAH:'Bahamas',TTO:'Trinidad & Tobago',
  POR:'Portugal',ITA:'Italy',ROM:'Romania',CRO:'Croatia',HUN:'Hungary',
};
const countryName = c => COUNTRY_NAMES[c] || c;

// ── Module CSS ────────────────────────────────────────────────────────────────
const CSS = `
@keyframes ath-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes ath-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.ath-root *{box-sizing:border-box;margin:0;padding:0;}
.ath-root{font-family:'DM Sans',system-ui,sans-serif;background:${BG};color:${TEXT1};min-height:100vh;}
.ath-fade{animation:ath-fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both;}
.ath-fade-1{animation-delay:0.05s}.ath-fade-2{animation-delay:0.1s}.ath-fade-3{animation-delay:0.15s}.ath-fade-4{animation-delay:0.2s}.ath-fade-5{animation-delay:0.25s}

/* header */
.ath-header{background:linear-gradient(135deg,#1a0533 0%,#2d1b69 60%,#1a0533 100%);border-bottom:1px solid rgba(139,92,246,0.2);padding:28px 32px 24px;}
.ath-header-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:20px;}
.ath-icon{width:56px;height:56px;border-radius:14px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.35);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}
.ath-title{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:700;letter-spacing:-0.01em;color:#f1f5f9;}
.ath-subtitle{font-size:13px;color:#a78bfa;margin-top:3px;}

/* tabs */
.ath-tabs{background:rgba(30,41,59,0.6);border-bottom:1px solid ${BORDER};position:sticky;top:0;z-index:100;backdrop-filter:blur(16px);}
.ath-tabs-inner{max-width:1280px;margin:0 auto;display:flex;overflow-x:auto;scrollbar-width:none;}
.ath-tabs-inner::-webkit-scrollbar{display:none;}
.ath-tab{padding:14px 20px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:${TEXT2};background:none;border:none;cursor:pointer;border-bottom:3px solid transparent;transition:all 0.2s ease;white-space:nowrap;position:relative;}
.ath-tab:hover{color:${TEXT1};background:rgba(139,92,246,0.06);}
.ath-tab.active{color:${ACCENT2};border-bottom-color:${ACCENT};}

/* main */
.ath-main{max-width:1280px;margin:0 auto;padding:28px 24px 64px;}

/* stat boxes */
.ath-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:28px;}
.ath-stat{background:${SURFACE};border-radius:12px;padding:20px 16px;text-align:center;border:1px solid ${BORDER};border-top:3px solid ${ACCENT};transition:transform 0.2s,box-shadow 0.2s;}
.ath-stat:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.25);}
.ath-stat-val{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:600;color:${ACCENT2};}
.ath-stat-label{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${TEXT2};margin-top:6px;}

/* cards */
.ath-card{background:${SURFACE};border-radius:14px;padding:24px;border:1px solid ${BORDER};margin-bottom:24px;}
.ath-card-title{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${TEXT2};margin-bottom:18px;display:flex;align-items:center;gap:8px;}
.ath-card-title span{font-size:15px;}

/* grid */
.ath-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.ath-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}

/* featured records */
.ath-rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}
.ath-rec-card{background:linear-gradient(135deg,rgba(139,92,246,0.06),rgba(30,41,59,0.8));border:1px solid rgba(139,92,246,0.18);border-radius:12px;padding:16px;transition:all 0.2s;}
.ath-rec-card:hover{border-color:rgba(139,92,246,0.35);transform:translateY(-2px);}
.ath-rec-disc{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${ACCENT};margin-bottom:6px;}
.ath-rec-perf{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:600;color:${TEXT1};}
.ath-rec-name{font-size:12px;color:${TEXT2};margin-top:4px;font-weight:500;}
.ath-rec-meta{font-size:11px;color:${TEXT3};margin-top:2px;}
.ath-gender-badge{display:inline-block;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;font-family:'Barlow Condensed',sans-serif;letter-spacing:0.05em;margin-right:4px;}
.ath-badge-m{background:rgba(59,130,246,0.15);color:#93c5fd;border:1px solid rgba(59,130,246,0.25);}
.ath-badge-w{background:rgba(236,72,153,0.15);color:#f9a8d4;border:1px solid rgba(236,72,153,0.25);}

/* table */
.ath-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.ath-table{width:100%;border-collapse:collapse;font-size:12px;}
.ath-table th{padding:10px 12px;text-align:left;color:${TEXT2};font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid ${BORDER};font-family:'Barlow Condensed',sans-serif;background:rgba(15,23,42,0.4);white-space:nowrap;}
.ath-table th.r,.ath-table td.r{text-align:right;}
.ath-table td{padding:11px 12px;color:#c8d3e0;border-bottom:1px solid rgba(255,255,255,0.03);vertical-align:middle;}
.ath-table tr:hover td{background:rgba(139,92,246,0.04);}
.ath-table .perf{font-family:'JetBrains Mono',monospace;font-size:12px;color:${TEXT1};font-weight:500;}
.ath-cat-header td{background:rgba(139,92,246,0.08);color:${ACCENT2};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;padding:8px 12px;}

/* search/filter */
.ath-search{width:100%;background:rgba(15,23,42,0.5);border:1px solid ${BORDER};border-radius:8px;padding:10px 14px;color:${TEXT1};font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;}
.ath-search:focus{border-color:rgba(139,92,246,0.4);}
.ath-search::placeholder{color:${TEXT3};}
.ath-select{background:rgba(15,23,42,0.5);border:1px solid ${BORDER};border-radius:8px;padding:10px 14px;color:${TEXT1};font-size:13px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;transition:border-color 0.2s;}
.ath-select:focus{border-color:rgba(139,92,246,0.4);}
.ath-select option{background:${SURFACE};}

/* filter row */
.ath-filters{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center;}
.ath-filter-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${TEXT2};font-family:'Barlow Condensed',sans-serif;white-space:nowrap;align-self:center;}

/* pill buttons */
.ath-pill{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;font-family:'Barlow Condensed',sans-serif;letter-spacing:0.04em;text-transform:uppercase;background:rgba(255,255,255,0.04);border:1px solid ${BORDER};color:${TEXT2};cursor:pointer;transition:all 0.15s;}
.ath-pill:hover{background:rgba(139,92,246,0.1);border-color:rgba(139,92,246,0.3);color:${ACCENT2};}
.ath-pill.active{background:rgba(139,92,246,0.15);border-color:rgba(139,92,246,0.4);color:${ACCENT2};}

/* history chart */
.ath-milestone{font-size:10px;fill:${TEXT2};}

/* loading/error */
.ath-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;color:${TEXT2};}
.ath-spinner{width:40px;height:40px;border:3px solid rgba(139,92,246,0.15);border-top-color:${ACCENT};border-radius:50%;animation:ath-spin 0.8s linear infinite;}
@keyframes ath-spin{to{transform:rotate(360deg)}}

/* tooltip */
.ath-tooltip{background:rgba(15,23,42,0.95);border:1px solid rgba(139,92,246,0.2);border-left:3px solid ${ACCENT};border-radius:10px;padding:10px 14px;color:#e2e8f0;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,0.35);font-size:12px;max-width:240px;}
.ath-tooltip-label{font-family:'Barlow Condensed',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:${ACCENT};margin-bottom:4px;}

/* responsive */
@media(max-width:900px){.ath-grid-2{grid-template-columns:1fr;}.ath-grid-3{grid-template-columns:1fr 1fr;}}
@media(max-width:640px){.ath-header{padding:18px 16px 16px;}.ath-main{padding:18px 12px 48px;}.ath-title{font-size:22px;}.ath-grid-3{grid-template-columns:1fr;}.ath-tab{padding:12px 14px;font-size:12px;}.ath-stats{grid-template-columns:repeat(2,1fr);}}
@media(prefers-reduced-motion:reduce){.ath-fade,.ath-fade-1,.ath-fade-2,.ath-fade-3,.ath-fade-4,.ath-fade-5{animation:none;opacity:1;}.ath-stat{transition:none;}.ath-rec-card{transition:none;}}
`;

// ── Reusable helpers ──────────────────────────────────────────────────────────
function StatBox({ value, label, sub, delay = '' }) {
  return (
    <div className={`ath-stat ath-fade${delay}`}>
      <div className="ath-stat-val">{value}</div>
      <div className="ath-stat-label">{label}</div>
      {sub && <div style={{ fontSize: 10, color: TEXT3, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function CardTitle({ icon, children }) {
  return (
    <div className="ath-card-title">
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
}

function GenderBadge({ g }) {
  return (
    <span className={`ath-gender-badge ${g === 'M' ? 'ath-badge-m' : 'ath-badge-w'}`}>
      {g === 'M' ? 'Men' : 'Women'}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ath-tooltip">
      <div className="ath-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || TEXT1, fontFamily: "'JetBrains Mono',monospace" }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function TabOverview({ records }) {
  const wrs     = useMemo(() => records.filter(r => r.record_type === 'World Records'), [records]);
  const nations  = useMemo(() => new Set(wrs.map(r => r.country)).size, [wrs]);
  const disciplines = useMemo(() => new Set(wrs.map(r => r.discipline)).size, [wrs]);
  const mWrs    = useMemo(() => wrs.filter(r => r.gender === 'M').length, [wrs]);
  const wWrs    = useMemo(() => wrs.filter(r => r.gender === 'W').length, [wrs]);

  // Featured records – take the most recent entry per key discipline+gender
  const FEATURED = [
    { disc: '100 Metres',      g: 'M' },
    { disc: '100 Metres',      g: 'W' },
    { disc: '200 Metres',      g: 'M' },
    { disc: '200 Metres',      g: 'W' },
    { disc: 'Marathon',        g: 'M' },
    { disc: 'Marathon',        g: 'W' },
    { disc: 'Long Jump',       g: 'M' },
    { disc: 'Long Jump',       g: 'W' },
    { disc: 'Pole Vault',      g: 'M' },
    { disc: 'Pole Vault',      g: 'W' },
    { disc: '110 Metres Hurdles', g: 'M' },
    { disc: '100 Metres Hurdles', g: 'W' },
  ];

  const featuredRecords = useMemo(() => {
    return FEATURED.map(({ disc, g }) => {
      const candidates = wrs
        .filter(r => r.discipline === disc && r.gender === g)
        .sort((a, b) => Number(b.year) - Number(a.year));
      return candidates[0] ? { ...candidates[0], _disc: disc, _g: g } : null;
    }).filter(Boolean);
  }, [wrs]);

  // Records by continent bar chart
  const contData = useMemo(() => {
    const map = {};
    wrs.forEach(r => {
      const reg = r.comp_country_region || 'Other';
      if (!map[reg]) map[reg] = 0;
      map[reg]++;
    });
    return Object.entries(map)
      .filter(([k]) => k)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [wrs]);

  const CONT_COLORS = { Africa: '#f59e0b', Americas: '#3b82f6', Europe: '#10b981', Asia: '#ec4899', Other: TEXT3 };

  return (
    <div className="ath-fade">
      {/* Stat row */}
      <div className="ath-stats ath-fade-1">
        <StatBox value={wrs.length}    label="World Records"       delay=" ath-fade-1" />
        <StatBox value={mWrs}          label="Men's WRs"           delay=" ath-fade-2" />
        <StatBox value={wWrs}          label="Women's WRs"         delay=" ath-fade-3" />
        <StatBox value={nations}       label="Nations Represented" delay=" ath-fade-4" />
        <StatBox value={disciplines}   label="Disciplines"         delay=" ath-fade-5" />
      </div>

      {/* Featured records */}
      <div className="ath-card ath-fade-2">
        <CardTitle icon="⚡">Featured World Records</CardTitle>
        <div className="ath-rec-grid">
          {featuredRecords.map((r, i) => (
            <div key={i} className="ath-rec-card">
              <div className="ath-rec-disc">
                <GenderBadge g={r._g} /> {r._disc}
              </div>
              <div className="ath-rec-perf">{r.performance}</div>
              <div className="ath-rec-name">{r.competitor}</div>
              <div className="ath-rec-meta">{r.country} · {r.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Continent chart */}
      <div className="ath-card ath-fade-3">
        <CardTitle icon="🌍">World Records by Continent</CardTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={contData} margin={{ top: 5, right: 24, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: TEXT2, fontSize: 12, fontFamily: "'Barlow Condensed',sans-serif" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: TEXT2, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Records" radius={[5, 5, 0, 0]}>
              {contData.map((entry, i) => (
                <Cell key={i} fill={CONT_COLORS[entry.name] || ACCENT} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Tab: World Records ────────────────────────────────────────────────────────
function TabWorldRecords({ records }) {
  const [search, setSearch]     = useState('');
  const [genderFilter, setGF]   = useState('All');
  const [catFilter, setCatF]    = useState('All');

  const wrs = useMemo(() => records.filter(r => r.record_type === 'World Records'), [records]);

  const allCats = useMemo(() => {
    const cats = new Set(wrs.map(r => getDisciplineCategory(r.discipline)));
    return ['All', ...Array.from(cats).sort()];
  }, [wrs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return wrs.filter(r => {
      if (genderFilter !== 'All' && r.gender !== genderFilter) return false;
      if (catFilter !== 'All' && getDisciplineCategory(r.discipline) !== catFilter) return false;
      if (q && !r.discipline.toLowerCase().includes(q) &&
               !r.competitor.toLowerCase().includes(q) &&
               !r.country.toLowerCase().includes(q) &&
               !r.performance.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [wrs, search, genderFilter, catFilter]);

  // Group by category
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      const cat = getDisciplineCategory(r.discipline);
      if (!map[cat]) map[cat] = [];
      map[cat].push(r);
    });
    return map;
  }, [filtered]);

  const sortedCats = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  return (
    <div className="ath-fade">
      <div className="ath-card">
        <CardTitle icon="🏅">All World Records</CardTitle>
        <div className="ath-filters">
          <input
            className="ath-search"
            style={{ flex: '1 1 200px', maxWidth: 320 }}
            placeholder="Search discipline, athlete, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="ath-filter-label">Gender:</span>
          {['All', 'M', 'W'].map(g => (
            <button key={g} className={`ath-pill${genderFilter === g ? ' active' : ''}`} onClick={() => setGF(g)}>
              {g === 'All' ? 'All' : g === 'M' ? 'Men' : 'Women'}
            </button>
          ))}
          <span className="ath-filter-label">Category:</span>
          <select className="ath-select" value={catFilter} onChange={e => setCatF(e.target.value)}>
            {allCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ fontSize: 11, color: TEXT3, marginBottom: 12 }}>
          Showing {filtered.length} of {wrs.length} records
        </div>
        <div className="ath-table-wrap">
          <table className="ath-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Gender</th>
                <th className="r">Performance</th>
                <th>Athlete</th>
                <th>Country</th>
                <th className="r">Year</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {sortedCats.map(cat => [
                <tr key={`cat-${cat}`} className="ath-cat-header">
                  <td colSpan={7}>{cat} — {grouped[cat].length} record{grouped[cat].length !== 1 ? 's' : ''}</td>
                </tr>,
                ...grouped[cat]
                  .sort((a, b) => a.discipline.localeCompare(b.discipline) || a.gender.localeCompare(b.gender))
                  .map((r, i) => (
                    <tr key={`${cat}-${i}`}>
                      <td style={{ fontWeight: 500, color: TEXT1 }}>{r.discipline}</td>
                      <td><GenderBadge g={r.gender} /></td>
                      <td className="r perf">{r.performance}{r.wind ? ` (${r.wind})` : ''}</td>
                      <td>{r.competitor}</td>
                      <td>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: ACCENT2, fontSize: 11 }}>{r.country}</span>
                        <span style={{ color: TEXT3, fontSize: 11 }}> {countryName(r.country) !== r.country ? `· ${countryName(r.country)}` : ''}</span>
                      </td>
                      <td className="r" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{r.year}</td>
                      <td style={{ fontSize: 11, color: TEXT3, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.venue_city}{r.venue_country ? `, ${r.venue_country}` : ''}</td>
                    </tr>
                  ))
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Records by Nation ────────────────────────────────────────────────────
function TabByNation({ records }) {
  const [genderFilter, setGF] = useState('All');

  const wrs = useMemo(() => records.filter(r => r.record_type === 'World Records'), [records]);

  const filtered = useMemo(() => (
    genderFilter === 'All' ? wrs : wrs.filter(r => r.gender === genderFilter)
  ), [wrs, genderFilter]);

  const nationData = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      if (!map[r.country]) map[r.country] = { country: r.country, total: 0, men: 0, women: 0 };
      map[r.country].total++;
      if (r.gender === 'M') map[r.country].men++;
      else map[r.country].women++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filtered]);

  const top15 = useMemo(() => nationData.slice(0, 15), [nationData]);

  return (
    <div className="ath-fade">
      {/* Filter */}
      <div className="ath-filters" style={{ marginBottom: 20 }}>
        <span className="ath-filter-label">Gender:</span>
        {['All', 'M', 'W'].map(g => (
          <button key={g} className={`ath-pill${genderFilter === g ? ' active' : ''}`} onClick={() => setGF(g)}>
            {g === 'All' ? 'All' : g === 'M' ? 'Men' : 'Women'}
          </button>
        ))}
      </div>

      <div className="ath-grid-2">
        {/* Chart */}
        <div className="ath-card ath-fade-1">
          <CardTitle icon="📊">Top 15 Nations — World Records Held</CardTitle>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={top15} layout="vertical" margin={{ top: 0, right: 24, left: 24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
              <XAxis type="number" tick={{ fill: TEXT2, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="country" type="category" tick={{ fill: TEXT1, fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              {genderFilter === 'All' ? (
                <>
                  <Bar dataKey="men"   name="Men"   stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="women" name="Women" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "'Barlow Condensed',sans-serif", color: TEXT2 }} />
                </>
              ) : (
                <Bar dataKey="total" name="Records" fill={ACCENT} radius={[0, 4, 4, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="ath-card ath-fade-2">
          <CardTitle icon="🏆">Nation Rankings</CardTitle>
          <div className="ath-table-wrap">
            <table className="ath-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}>#</th>
                  <th>Country</th>
                  <th className="r">Total</th>
                  <th className="r">Men</th>
                  <th className="r">Women</th>
                </tr>
              </thead>
              <tbody>
                {nationData.map((n, i) => (
                  <tr key={n.country}>
                    <td style={{ color: TEXT3, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{i + 1}</td>
                    <td>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: ACCENT2 }}>{n.country}</span>
                      <span style={{ color: TEXT2, fontSize: 11, marginLeft: 6 }}>{countryName(n.country)}</span>
                    </td>
                    <td className="r perf">{n.total}</td>
                    <td className="r" style={{ color: '#93c5fd', fontFamily: "'JetBrains Mono',monospace" }}>{n.men}</td>
                    <td className="r" style={{ color: '#f9a8d4', fontFamily: "'JetBrains Mono',monospace" }}>{n.women}</td>
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

// ── Tab: Indoor Records ───────────────────────────────────────────────────────
function TabIndoor({ records }) {
  const [search, setSearch]   = useState('');
  const [genderFilter, setGF] = useState('All');

  // Use records that are World Records AND marked as indoor (is_indoor === 'True')
  const indoorWRs = useMemo(() => records.filter(r => r.record_type === 'World Records' && r.is_indoor === 'True'), [records]);

  // Additionally include World Indoor Championships Records
  const wicr = useMemo(() => records.filter(r => r.record_type === 'World Indoor Championships Records'), [records]);

  const combined = useMemo(() => {
    const seen = new Set();
    const result = [];
    [...indoorWRs, ...wicr].forEach(r => {
      const key = `${r.discipline}|${r.gender}|${r.performance}|${r.competitor}`;
      if (!seen.has(key)) { seen.add(key); result.push(r); }
    });
    return result;
  }, [indoorWRs, wicr]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return combined.filter(r => {
      if (genderFilter !== 'All' && r.gender !== genderFilter) return false;
      if (q && !r.discipline.toLowerCase().includes(q) &&
               !r.competitor.toLowerCase().includes(q) &&
               !r.country.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [combined, search, genderFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      const cat = getDisciplineCategory(r.discipline);
      if (!map[cat]) map[cat] = [];
      map[cat].push(r);
    });
    return map;
  }, [filtered]);

  const sortedCats = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  const indoorStats = useMemo(() => {
    const nations = new Set(combined.map(r => r.country));
    const discs   = new Set(combined.map(r => r.discipline));
    return { total: combined.length, nations: nations.size, discs: discs.size };
  }, [combined]);

  return (
    <div className="ath-fade">
      <div className="ath-stats ath-fade-1" style={{ marginBottom: 24 }}>
        <StatBox value={indoorStats.total}   label="Indoor Records" delay=" ath-fade-1" />
        <StatBox value={indoorStats.nations} label="Nations"        delay=" ath-fade-2" />
        <StatBox value={indoorStats.discs}   label="Disciplines"    delay=" ath-fade-3" />
      </div>

      <div className="ath-card ath-fade-2">
        <CardTitle icon="🏟️">Indoor World Records &amp; Championship Records</CardTitle>
        <div className="ath-filters">
          <input
            className="ath-search"
            style={{ flex: '1 1 200px', maxWidth: 320 }}
            placeholder="Search discipline, athlete, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="ath-filter-label">Gender:</span>
          {['All', 'M', 'W'].map(g => (
            <button key={g} className={`ath-pill${genderFilter === g ? ' active' : ''}`} onClick={() => setGF(g)}>
              {g === 'All' ? 'All' : g === 'M' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: TEXT3, marginBottom: 12 }}>Showing {filtered.length} of {combined.length} records</div>
        <div className="ath-table-wrap">
          <table className="ath-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Gender</th>
                <th className="r">Performance</th>
                <th>Athlete</th>
                <th>Country</th>
                <th className="r">Year</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sortedCats.map(cat => [
                <tr key={`cat-${cat}`} className="ath-cat-header">
                  <td colSpan={7}>{cat} — {grouped[cat].length}</td>
                </tr>,
                ...grouped[cat]
                  .sort((a, b) => a.discipline.localeCompare(b.discipline) || a.gender.localeCompare(b.gender))
                  .map((r, i) => (
                    <tr key={`${cat}-${i}`}>
                      <td style={{ fontWeight: 500, color: TEXT1 }}>{r.discipline}</td>
                      <td><GenderBadge g={r.gender} /></td>
                      <td className="r perf">{r.performance}</td>
                      <td>{r.competitor}</td>
                      <td style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: ACCENT2, fontSize: 11 }}>{r.country}</td>
                      <td className="r" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{r.year}</td>
                      <td style={{ fontSize: 10, color: TEXT3 }}>
                        {r.record_type === 'World Records' ? (
                          <span style={{ color: '#fbbf24', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>WR</span>
                        ) : (
                          <span style={{ color: ACCENT, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>WIC</span>
                        )}
                      </td>
                    </tr>
                  ))
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Championship Records ─────────────────────────────────────────────────
function TabChampionship({ records }) {
  const [champType, setChampType] = useState('Olympic Games Records');
  const [genderFilter, setGF]     = useState('All');
  const [search, setSearch]       = useState('');

  const champTypes = [
    { id: 'Olympic Games Records',                    label: 'Olympic Games' },
    { id: 'World Championships In Athletics Records', label: 'World Champs' },
    { id: 'World Indoor Championships Records',       label: 'World Indoor' },
    { id: 'World U20 Records',                        label: 'U20' },
  ];

  const champRecords = useMemo(() => records.filter(r => r.record_type === champType), [records, champType]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return champRecords.filter(r => {
      if (genderFilter !== 'All' && r.gender !== genderFilter) return false;
      if (q && !r.discipline.toLowerCase().includes(q) &&
               !r.competitor.toLowerCase().includes(q) &&
               !r.country.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [champRecords, search, genderFilter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      const cat = getDisciplineCategory(r.discipline);
      if (!map[cat]) map[cat] = [];
      map[cat].push(r);
    });
    return map;
  }, [filtered]);

  const sortedCats = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  // Top nations for this championship
  const topNations = useMemo(() => {
    const map = {};
    champRecords.forEach(r => {
      if (!map[r.country]) map[r.country] = 0;
      map[r.country]++;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  }, [champRecords]);

  return (
    <div className="ath-fade">
      {/* Championship type switcher */}
      <div className="ath-filters" style={{ marginBottom: 20 }}>
        <span className="ath-filter-label">Championship:</span>
        {champTypes.map(ct => (
          <button
            key={ct.id}
            className={`ath-pill${champType === ct.id ? ' active' : ''}`}
            onClick={() => { setChampType(ct.id); setSearch(''); setGF('All'); }}
          >
            {ct.label}
          </button>
        ))}
      </div>

      {/* Stats + top nations */}
      <div className="ath-grid-2" style={{ marginBottom: 20 }}>
        <div className="ath-stats ath-fade-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, height: 'fit-content' }}>
          <StatBox value={champRecords.length} label="Total Records" delay=" ath-fade-1" />
          <StatBox value={champRecords.filter(r => r.gender === 'M').length} label="Men's" delay=" ath-fade-2" />
          <StatBox value={champRecords.filter(r => r.gender === 'W').length} label="Women's" delay=" ath-fade-3" />
        </div>
        <div className="ath-card ath-fade-2" style={{ padding: 16, margin: 0 }}>
          <CardTitle icon="🥇">Top Nations</CardTitle>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={topNations} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="country" tick={{ fill: TEXT2, fontSize: 10, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT3, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Records" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="ath-card ath-fade-3">
        <CardTitle icon="📋">{champTypes.find(c => c.id === champType)?.label} Records</CardTitle>
        <div className="ath-filters">
          <input
            className="ath-search"
            style={{ flex: '1 1 200px', maxWidth: 300 }}
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="ath-filter-label">Gender:</span>
          {['All', 'M', 'W'].map(g => (
            <button key={g} className={`ath-pill${genderFilter === g ? ' active' : ''}`} onClick={() => setGF(g)}>
              {g === 'All' ? 'All' : g === 'M' ? 'Men' : 'Women'}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: TEXT3, marginBottom: 12 }}>Showing {filtered.length} of {champRecords.length} records</div>
        <div className="ath-table-wrap">
          <table className="ath-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Gender</th>
                <th className="r">Performance</th>
                <th>Athlete</th>
                <th>Country</th>
                <th className="r">Year</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {sortedCats.map(cat => [
                <tr key={`cat-${cat}`} className="ath-cat-header">
                  <td colSpan={7}>{cat} — {grouped[cat].length}</td>
                </tr>,
                ...grouped[cat]
                  .sort((a, b) => a.discipline.localeCompare(b.discipline) || a.gender.localeCompare(b.gender))
                  .map((r, i) => (
                    <tr key={`${cat}-${i}`}>
                      <td style={{ fontWeight: 500, color: TEXT1 }}>{r.discipline}</td>
                      <td><GenderBadge g={r.gender} /></td>
                      <td className="r perf">{r.performance}{r.wind ? ` (${r.wind})` : ''}</td>
                      <td>{r.competitor}</td>
                      <td style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: ACCENT2, fontSize: 11 }}>{r.country}</td>
                      <td className="r" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{r.year}</td>
                      <td style={{ fontSize: 11, color: TEXT3, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.venue_city}</td>
                    </tr>
                  ))
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: History ──────────────────────────────────────────────────────────────
function TabHistory({ records }) {
  const wrs = useMemo(() => records.filter(r => r.record_type === 'World Records'), [records]);

  // Build discipline options: unique disc+gender combos that have ≥2 WR entries
  const discOptions = useMemo(() => {
    const map = {};
    wrs.forEach(r => {
      const key = `${r.discipline}|${r.gender}`;
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return Object.entries(map)
      .filter(([, recs]) => recs.length >= 2)
      .map(([key, recs]) => ({ key, label: `${recs[0].discipline} (${recs[0].gender === 'M' ? 'Men' : 'Women'})`, recs }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [wrs]);

  const [selected, setSelected] = useState(() => {
    // Default: Marathon Men if available
    const def = discOptions.find(d => d.key === 'Marathon|M') || discOptions[0];
    return def?.key || '';
  });

  const selectedOpt = useMemo(() => discOptions.find(d => d.key === selected), [discOptions, selected]);

  // Performance parsing: try to convert to numeric seconds/metres
  function parsePerf(perf, disc) {
    if (!perf) return null;
    const p = perf.trim().replace(/[^0-9:.h]/g, '');
    // Try time format h:mm:ss, m:ss.s, or ss.s
    const parts = p.split(':');
    if (parts.length === 3) {
      // h:mm:ss or mm:ss.s in 3 parts?
      const [a, b, c] = parts.map(Number);
      if (!isNaN(a) && !isNaN(b) && !isNaN(c)) return a * 3600 + b * 60 + c;
    }
    if (parts.length === 2) {
      const [a, b] = parts.map(Number);
      if (!isNaN(a) && !isNaN(b)) return a * 60 + b;
    }
    const n = parseFloat(p);
    return isNaN(n) ? null : n;
  }

  const chartData = useMemo(() => {
    if (!selectedOpt) return [];
    const sorted = [...selectedOpt.recs].sort((a, b) => Number(a.year) - Number(b.year));
    return sorted.map(r => ({
      year:        Number(r.year),
      performance: r.performance,
      numeric:     parsePerf(r.performance, r.discipline),
      athlete:     r.competitor,
      country:     r.country,
    }));
  }, [selectedOpt]);

  // For line chart we need valid numeric values
  const hasNumeric = useMemo(() => chartData.some(d => d.numeric !== null), [chartData]);

  function HistoryTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="ath-tooltip">
        <div className="ath-tooltip-label">{d.year}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600, color: ACCENT2 }}>{d.performance}</div>
        <div style={{ color: TEXT1, fontSize: 12, marginTop: 4 }}>{d.athlete}</div>
        <div style={{ color: TEXT3, fontSize: 11 }}>{d.country}</div>
      </div>
    );
  }

  return (
    <div className="ath-fade">
      <div className="ath-card ath-fade-1">
        <CardTitle icon="📈">World Record Progression</CardTitle>
        <div className="ath-filters" style={{ marginBottom: 24 }}>
          <span className="ath-filter-label">Discipline:</span>
          <select
            className="ath-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{ flex: '1 1 auto', maxWidth: 380 }}
          >
            {discOptions.map(d => (
              <option key={d.key} value={d.key}>{d.label}</option>
            ))}
          </select>
        </div>

        {selectedOpt && (
          <>
            {/* Milestone cards */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              {chartData.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: i === chartData.length - 1
                      ? `linear-gradient(135deg,rgba(139,92,246,0.15),rgba(30,41,59,0.8))`
                      : `rgba(30,41,59,0.5)`,
                    border: `1px solid ${i === chartData.length - 1 ? 'rgba(139,92,246,0.35)' : BORDER}`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    minWidth: 140,
                  }}
                >
                  {i === chartData.length - 1 && (
                    <div style={{ fontSize: 9, fontFamily: "'Barlow Condensed',sans-serif", color: ACCENT, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Current WR</div>
                  )}
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 600, color: i === chartData.length - 1 ? ACCENT2 : TEXT1 }}>
                    {d.performance}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT1, marginTop: 4, fontWeight: 500 }}>{d.athlete}</div>
                  <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{d.country} · {d.year}</div>
                </div>
              ))}
            </div>

            {/* Line chart */}
            {hasNumeric && (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: TEXT2, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: TEXT2, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    label={{ value: 'Performance (numeric)', angle: -90, position: 'insideLeft', fill: TEXT3, fontSize: 10, dy: 60 }}
                  />
                  <Tooltip content={<HistoryTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="numeric"
                    name="Performance"
                    stroke={ACCENT}
                    strokeWidth={2.5}
                    dot={{ fill: ACCENT2, strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 7, fill: ACCENT2, stroke: BG, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* Full table */}
            <div style={{ marginTop: 28 }}>
              <div className="ath-card-title" style={{ marginBottom: 14 }}>
                <span>📋</span> Full Record History
              </div>
              <div className="ath-table-wrap">
                <table className="ath-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="r">Performance</th>
                      <th>Athlete</th>
                      <th>Country</th>
                      <th className="r">Year</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d, i) => (
                      <tr key={i}>
                        <td style={{ color: TEXT3, fontSize: 11 }}>{i + 1}</td>
                        <td className="r perf" style={{ color: i === chartData.length - 1 ? ACCENT2 : TEXT1 }}>
                          {d.performance}
                          {i === chartData.length - 1 && (
                            <span style={{ marginLeft: 6, fontSize: 9, fontFamily: "'Barlow Condensed',sans-serif", color: ACCENT, fontWeight: 700 }}>CURRENT</span>
                          )}
                        </td>
                        <td>{d.athlete}</td>
                        <td style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: ACCENT2, fontSize: 11 }}>{d.country}</td>
                        <td className="r" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{d.year}</td>
                        <td style={{ fontSize: 11, color: TEXT3 }}>
                          {selectedOpt.recs[i]?.venue_city}
                          {selectedOpt.recs[i]?.venue_country ? `, ${selectedOpt.recs[i].venue_country}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview',             icon: '📊' },
  { id: 'world-records', label: 'World Records',         icon: '🏅' },
  { id: 'by-nation',     label: 'Records by Nation',     icon: '🌍' },
  { id: 'indoor',        label: 'Indoor Records',        icon: '🏟️' },
  { id: 'championship',  label: 'Championship Records',  icon: '🏆' },
  { id: 'history',       label: 'History',               icon: '📈' },
];

export default function AthleticsStatNations() {
  // ── All hooks MUST be declared before any conditional returns ────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const { data: rawData, loading, error } = useData('athletics-records.json');

  const records = useMemo(() => rawData || [], [rawData]);

  // ── Conditional render AFTER all hooks ───────────────────────────────────────
  if (loading) {
    return (
      <div className="ath-root">
        <style>{CSS}</style>
        <div className="ath-loading">
          <div className="ath-spinner" />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', color: TEXT2 }}>
            Loading Athletics Data…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ath-root">
        <style>{CSS}</style>
        <div className="ath-loading">
          <div style={{ fontSize: 48, opacity: 0.3 }}>⚠️</div>
          <div style={{ color: '#f87171', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16 }}>
            Failed to load data: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ath-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <header className="ath-header">
        <div className="ath-header-inner">
          <div className="ath-icon">
            {/* Athletics track SVG icon */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <ellipse cx="14" cy="14" rx="12" ry="9" stroke="#a78bfa" strokeWidth="2.2" fill="none" />
              <ellipse cx="14" cy="14" rx="7" ry="4.5" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
              <circle cx="14" cy="5.5" r="1.6" fill="#c4b5fd" />
              <line x1="14" y1="7.2" x2="14" y2="13" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="14" y1="13" x2="11" y2="17" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="14" y1="13" x2="17" y2="17" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="14" y1="10" x2="11.5" y2="12.5" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="14" y1="10" x2="16.5" y2="12.5" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="ath-title">Athletics Records</div>
            <div className="ath-subtitle">
              {records.length.toLocaleString()} records · World Athletics IAAF Database
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav className="ath-tabs" role="navigation" aria-label="Athletics sections">
        <div className="ath-tabs-inner">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ath-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span style={{ marginRight: 5 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="ath-main" role="main">
        {activeTab === 'overview'      && <TabOverview      key="overview"      records={records} />}
        {activeTab === 'world-records' && <TabWorldRecords  key="world-records" records={records} />}
        {activeTab === 'by-nation'     && <TabByNation      key="by-nation"     records={records} />}
        {activeTab === 'indoor'        && <TabIndoor        key="indoor"        records={records} />}
        {activeTab === 'championship'  && <TabChampionship  key="championship"  records={records} />}
        {activeTab === 'history'       && <TabHistory       key="history"       records={records} />}
      </main>
    </div>
  );
}
