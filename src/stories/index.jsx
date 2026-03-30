import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

// ── Story data ─────────────────────────────────────────────────────────────────
const AB_DOMINANCE = [
  { year: 1987, winPct: 82, rwcResult: 'Winner' },
  { year: 1991, winPct: 71, rwcResult: 'SF' },
  { year: 1995, winPct: 78, rwcResult: 'Final' },
  { year: 1999, winPct: 75, rwcResult: 'SF' },
  { year: 2003, winPct: 79, rwcResult: 'SF' },
  { year: 2007, winPct: 76, rwcResult: 'QF' },
  { year: 2011, winPct: 88, rwcResult: 'Winner' },
  { year: 2015, winPct: 93, rwcResult: 'Winner' },
  { year: 2019, winPct: 84, rwcResult: 'SF' },
  { year: 2023, winPct: 78, rwcResult: 'SF' },
];

const BOLT_TIMELINE = [
  { year: 2002, time: 11.40, age: 15 },
  { year: 2003, time: 10.97, age: 16 },
  { year: 2004, time: 10.61, age: 17 },
  { year: 2005, time: 10.28, age: 18 },
  { year: 2006, time: 10.03, age: 19 },
  { year: 2007, time: 9.76, age: 20 },
  { year: 2008, time: 9.69, age: 21, note: 'Olympic WR' },
  { year: 2009, time: 9.58, age: 22, note: 'World Record' },
  { year: 2012, time: 9.63, age: 25, note: 'Olympic Gold' },
  { year: 2016, time: 9.81, age: 29, note: 'Final Olympic' },
];

const ESC_POINTS_ERA = [
  { year: 2004, topScore: 230, votingSystem: 'Old' },
  { year: 2006, topScore: 292, votingSystem: 'Old' },
  { year: 2008, topScore: 292, votingSystem: 'Old' },
  { year: 2010, topScore: 387, votingSystem: 'Old' },
  { year: 2012, topScore: 365, votingSystem: 'Old' },
  { year: 2014, topScore: 217, votingSystem: 'Old' },
  { year: 2016, topScore: 534, votingSystem: 'New' },
  { year: 2018, topScore: 529, votingSystem: 'New' },
  { year: 2019, topScore: 498, votingSystem: 'New' },
  { year: 2021, topScore: 524, votingSystem: 'New' },
  { year: 2022, topScore: 631, votingSystem: 'New' },
  { year: 2023, topScore: 583, votingSystem: 'New' },
  { year: 2024, topScore: 591, votingSystem: 'New' },
];

const MARATHON_RECORDS = [
  { year: 1908, time: 2 * 60 + 55 + 18/60, holder: 'John Hayes', flag: '🇺🇸' },
  { year: 1952, time: 2 * 60 + 20 + 42/60, holder: 'Jim Peters', flag: '🇬🇧' },
  { year: 1988, time: 2 * 60 + 6 + 50/60, holder: 'Belayneh Densimo', flag: '🇪🇹' },
  { year: 1999, time: 2 * 60 + 5 + 42/60, holder: 'Khalid Khannouchi', flag: '🇺🇸' },
  { year: 2011, time: 2 * 60 + 3 + 38/60, holder: 'Patrick Makau', flag: '🇰🇪' },
  { year: 2014, time: 2 * 60 + 2 + 57/60, holder: 'Dennis Kimetto', flag: '🇰🇪' },
  { year: 2018, time: 2 * 60 + 1 + 39/60, holder: 'Eliud Kipchoge', flag: '🇰🇪' },
  { year: 2022, time: 2 * 60 + 1 + 9/60, holder: 'Eliud Kipchoge', flag: '🇰🇪' },
  { year: 2023, time: 2 * 60 + 0 + 35/60, holder: 'Kelvin Kiptum', flag: '🇰🇪' },
];

const STORIES = [
  {
    id: 'all-blacks',
    title: "The All Blacks' Unmatched Dominance",
    emoji: '🏉',
    accent: '#10b981',
    module: 'rugby',
    byline: 'How New Zealand became rugby\'s most dominant force — and stayed there for a century.',
    readTime: '4 min',
  },
  {
    id: 'bolt',
    title: "Usain Bolt: Rewriting the Limits of Human Speed",
    emoji: '🏃',
    accent: '#8b5cf6',
    module: 'athletics',
    byline: 'From 11.40s at 15 to an untouched 9.58s world record — the arc of the fastest man alive.',
    readTime: '3 min',
  },
  {
    id: 'esc-inflation',
    title: "Eurovision's Scoring Revolution",
    emoji: '🎤',
    accent: '#ec4899',
    module: 'eurovision',
    byline: 'How the 2016 voting reform transformed points from the hundreds to the six-hundreds.',
    readTime: '3 min',
  },
  {
    id: 'marathon',
    title: "The 2-Hour Marathon: Running Into History",
    emoji: '🏃',
    accent: '#8b5cf6',
    module: 'athletics',
    byline: 'From the 1908 Olympics to Kelvin Kiptum\'s 2:00:35 — the century-long hunt for sub-2 hours.',
    readTime: '5 min',
  },
  {
    id: 'wales-euros',
    title: "Wales at the EUROs: Cymru Am Byth",
    emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    accent: '#D21034',
    module: 'football',
    byline: 'From 10 consecutive failed qualifications to a Euro 2016 semi-final and back-to-back knockout stages — the story of Wales at the European Championship.',
    readTime: '8 min',
  },
];

// ── Individual story content ────────────────────────────────────────────────
function AllBlacksStory() {
  return (
    <div>
      <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
        No team in international sport has maintained dominance like the All Blacks. Since the first Rugby World Cup in 1987, New Zealand has averaged a win rate above <strong style={{ color: '#10b981' }}>78%</strong> across every four-year cycle — peaking at <strong style={{ color: '#10b981' }}>93%</strong> in the 2011–2015 period that ended with back-to-back World Cup titles.
      </p>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
          Win Rate by World Cup Cycle
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={AB_DOMINANCE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`, 'Win Rate']} />
            <ReferenceLine y={75} stroke="rgba(148,163,184,0.3)" strokeDasharray="4 4" label={{ value: '75% baseline', fill: '#64748b', fontSize: 10 }} />
            <Bar dataKey="winPct" name="Win Rate %" radius={[4, 4, 0, 0]}>
              {AB_DOMINANCE.map((d, i) => <Cell key={i} fill={d.rwcResult === 'Winner' ? '#10b981' : d.winPct >= 85 ? '#06b6d4' : '#334155'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
          <span style={{ color: '#10b981' }}>■</span> World Cup winner &nbsp;
          <span style={{ color: '#06b6d4' }}>■</span> 85%+ win rate &nbsp;
          <span style={{ color: '#334155' }}>■</span> Other cycles
        </div>
      </div>

      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>
        The All Blacks' secret is systemic. Unlike most nations that rebuild between cycles, New Zealand's provincial structure — led by the Super Rugby franchises — continuously produces test-ready forwards and backs. The Haka is ritual, but the pipeline is engineering.
      </p>
      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
        Their four World Cup wins (1987, 2011, 2015, 2023) are a record. South Africa, the next closest, matched them in 2023 with a fourth title — but the All Blacks remain the only nation with three consecutive final appearances (2011, 2015, and nearly 2019).
      </p>
    </div>
  );
}

function BoltStory() {
  return (
    <div>
      <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
        When Usain Bolt ran 9.69s at the 2008 Beijing Olympics — showboating to the line — scientists said the record could fall another 0.1s. A year later, at Berlin's World Championships, he ran <strong style={{ color: '#8b5cf6' }}>9.58s</strong>. Fifteen years on, no one has come within 0.10s of it.
      </p>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
          Bolt's 100m Progression (seconds — lower is faster)
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={BOLT_TIMELINE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[9.5, 11.5]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${v}s`} reversed />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}s`, '100m time']} />
            <ReferenceLine y={9.58} stroke="#8b5cf6" strokeDasharray="5 5" label={{ value: 'WR 9.58s', fill: '#8b5cf6', fontSize: 11 }} />
            <Line type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
        What makes the 9.58 remarkable is not just the time — it's the margin. The previous record was 9.69s, held by Bolt himself. He broke it by 0.11s in a single race. By comparison, the marathon world record has been lowered by only 15 minutes over an entire century.
      </p>
    </div>
  );
}

function EscInflationStory() {
  return (
    <div>
      <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
        Eurovision's 2016 voting reform split jury and public votes into separate 1–12 point allocations per country — effectively doubling the theoretical maximum. The result: winning scores jumped from the 200–400 range to the <strong style={{ color: '#ec4899' }}>500–631</strong> range overnight.
      </p>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
          Winning Score Inflation (2004–2024)
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ESC_POINTS_ERA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine x={2016} stroke="rgba(236,72,153,0.5)" strokeWidth={2} label={{ value: '2016 reform', fill: '#ec4899', fontSize: 11 }} />
            <Bar dataKey="topScore" name="Winning score" radius={[4, 4, 0, 0]}>
              {ESC_POINTS_ERA.map((d, i) => <Cell key={i} fill={d.votingSystem === 'New' ? '#ec4899' : '#334155'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
          <span style={{ color: '#ec4899' }}>■</span> New voting system (2016+) &nbsp;
          <span style={{ color: '#334155' }}>■</span> Old system
        </div>
      </div>

      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
        Ukraine's 631 in 2022 — aided by overwhelming public sympathy amid the Russian invasion — stands as the all-time record. But the structural shift means every winner since 2016 has outscored every winner before it. When comparing eras, context is everything.
      </p>
    </div>
  );
}

function MarathonStory() {
  return (
    <div>
      <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
        In 1908 in London, John Hayes ran 2:55:18 — more than 50 minutes slower than today's world record. Over a century of incremental improvements by athletes from over a dozen nations, the marathon record has been cut by <strong style={{ color: '#8b5cf6' }}>55 minutes</strong>. Kenya now holds it.
      </p>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 16 }}>
          Marathon World Record Progression (minutes — lower is faster)
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={MARATHON_RECORDS}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[119, 180]} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2,'0')}`} reversed />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n, p) => [`${Math.floor(v)}:${String(Math.round((v%1)*60)).padStart(2,'0')} (${p.payload.holder} ${p.payload.flag})`, 'Time']} />
            <ReferenceLine y={120} stroke="#8b5cf6" strokeDasharray="5 5" label={{ value: '2:00:00 barrier', fill: '#8b5cf6', fontSize: 11 }} />
            <Line type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
        Kelvin Kiptum's 2:00:35 in Chicago in October 2023 is the current official record, set at age 23. At his trajectory, sub-2:00 was seen as inevitable — but Kiptum died in a car accident in February 2024, aged 24. The two-hour barrier remains unbroken in official competition.
      </p>
    </div>
  );
}

// ── Wales at the Euros data ────────────────────────────────────────────────────
const WALES_EUROS_COMPARISON = [
  { tournament: '2016', matches: 6, wins: 4, goalsFor: 10, goalsAgainst: 6 },
  { tournament: '2020', matches: 4, wins: 2, goalsFor: 4, goalsAgainst: 5 },
];

const WALES_HISTORY = [
  { year: '1960', result: 'Did not participate', tier: 0 },
  { year: '1964', result: 'Did not qualify', tier: 0 },
  { year: '1968', result: 'Did not qualify', tier: 0 },
  { year: '1972', result: 'Did not qualify', tier: 0 },
  { year: '1976', result: 'Quarter-finals', tier: 2 },
  { year: '1980', result: 'Did not qualify', tier: 0 },
  { year: '1984', result: 'Did not qualify', tier: 0 },
  { year: '1988', result: 'Did not qualify', tier: 0 },
  { year: '1992', result: 'Did not qualify', tier: 0 },
  { year: '1996', result: 'Did not qualify', tier: 0 },
  { year: '2000', result: 'Did not qualify', tier: 0 },
  { year: '2004', result: 'Did not qualify', tier: 0 },
  { year: '2008', result: 'Did not qualify', tier: 0 },
  { year: '2012', result: 'Did not qualify', tier: 0 },
  { year: '2016', result: 'Semi-finals ★', tier: 4 },
  { year: '2020', result: 'Round of 16', tier: 3 },
];

const WALES_CHART_DATA = [
  { label: 'Matches', y2016: 6, y2020: 4 },
  { label: 'Wins', y2016: 4, y2020: 2 },
  { label: 'Goals For', y2016: 10, y2020: 4 },
  { label: 'Goals Against', y2016: 6, y2020: 5 },
];

const SS = { fontSize: 12, fontFamily: 'var(--font-body)', color: '#94a3b8', lineHeight: 1.7 };
const SH2 = { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9', margin: '32px 0 10px', letterSpacing: '0.02em' };
const SH3 = { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 12 };
const SURFACE = { background: '#1e293b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 };
const RED = '#D21034';
const GOLD = '#d4a017';

function MatchCard({ meta, score, result, resultType, scorers, note, lineup }) {
  const colors = { win: '#10b981', loss: '#ef4444', draw: '#d4a017' };
  const bg = { win: 'rgba(16,185,129,0.08)', loss: 'rgba(239,68,68,0.08)', draw: 'rgba(212,160,23,0.08)' };
  return (
    <div style={{ borderLeft: `3px solid ${colors[resultType]}`, paddingLeft: 16, marginBottom: 24, paddingBottom: 8 }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 4 }}>{meta}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{score}</div>
      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em', background: bg[resultType], color: colors[resultType], border: `1px solid ${colors[resultType]}44`, marginBottom: 8 }}>{result}</span>
      {scorers && <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)', marginBottom: 6 }}>{scorers}</div>}
      {note && <p style={{ ...SS, fontSize: 13, margin: '6px 0' }}>{note}</p>}
      {lineup && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontStyle: 'italic' }}><strong style={{ color: '#94a3b8', fontStyle: 'normal' }}>XI: </strong>{lineup}</div>}
    </div>
  );
}

function PlayerGrid({ players }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginTop: 12 }}>
      {players.map(p => (
        <div key={p.name} style={{ background: '#1e293b', borderRadius: 8, padding: '10px 14px', borderLeft: `2px solid rgba(210,16,52,0.4)` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{p.num}. {p.name}</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{p.club}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1, fontStyle: 'italic' }}>{p.pos}</div>
        </div>
      ))}
    </div>
  );
}

const SQUAD_2016 = [
  { num: 1, name: 'Wayne Hennessey', club: 'Crystal Palace', pos: 'Goalkeeper' },
  { num: 12, name: 'Owain Fôn Williams', club: 'Inverness', pos: 'Goalkeeper' },
  { num: 21, name: 'Danny Ward', club: 'Liverpool', pos: 'Goalkeeper' },
  { num: 2, name: 'Chris Gunter', club: 'Reading', pos: 'Defender' },
  { num: 3, name: 'Neil Taylor', club: 'Swansea City', pos: 'Defender' },
  { num: 4, name: 'Ben Davies', club: 'Tottenham', pos: 'Defender' },
  { num: 5, name: 'James Chester', club: 'West Brom', pos: 'Defender' },
  { num: 6, name: 'Ashley Williams', club: 'Swansea City', pos: 'Defender / Captain' },
  { num: 7, name: 'Joe Allen', club: 'Liverpool', pos: 'Midfielder' },
  { num: 8, name: 'Andy King', club: 'Leicester City', pos: 'Midfielder' },
  { num: 10, name: 'Aaron Ramsey', club: 'Arsenal', pos: 'Midfielder' },
  { num: 16, name: 'Joe Ledley', club: 'Crystal Palace', pos: 'Midfielder' },
  { num: 9, name: 'Hal Robson-Kanu', club: 'Reading', pos: 'Forward' },
  { num: 11, name: 'Gareth Bale', club: 'Real Madrid', pos: 'Forward' },
  { num: 17, name: 'David Cotterill', club: 'Birmingham City', pos: 'Forward' },
  { num: 18, name: 'Sam Vokes', club: 'Burnley', pos: 'Forward' },
  { num: 19, name: 'James Collins', club: 'West Ham', pos: 'Defender' },
  { num: 20, name: 'Jonathan Williams', club: 'Crystal Palace', pos: 'Midfielder' },
  { num: 22, name: 'David Vaughan', club: 'Nottm Forest', pos: 'Midfielder' },
  { num: 23, name: 'Simon Church', club: 'MK Dons', pos: 'Forward' },
  { num: 14, name: 'David Edwards', club: 'Wolverhampton', pos: 'Midfielder' },
  { num: 15, name: 'Jazz Richards', club: 'Fulham', pos: 'Defender' },
  { num: 13, name: 'George Williams', club: 'Fulham', pos: 'Forward' },
];

const SQUAD_2020 = [
  { num: 1, name: 'Wayne Hennessey', club: 'Crystal Palace', pos: 'Goalkeeper' },
  { num: 12, name: 'Danny Ward', club: 'Leicester City', pos: 'Goalkeeper (1st choice)' },
  { num: 21, name: 'Adam Davies', club: 'Stoke City', pos: 'Goalkeeper' },
  { num: 2, name: 'Chris Gunter', club: 'Charlton Athletic', pos: 'Defender' },
  { num: 3, name: 'Neco Williams', club: 'Liverpool', pos: 'Defender' },
  { num: 4, name: 'Ben Davies', club: 'Tottenham', pos: 'Defender' },
  { num: 6, name: 'Joe Rodon', club: 'Tottenham', pos: 'Defender' },
  { num: 14, name: 'Connor Roberts', club: 'Swansea City', pos: 'Defender' },
  { num: 15, name: 'Ethan Ampadu', club: 'Chelsea', pos: 'Defender/Midfielder' },
  { num: 22, name: 'Chris Mepham', club: 'Bournemouth', pos: 'Defender' },
  { num: 7, name: 'Joe Allen', club: 'Stoke City', pos: 'Midfielder' },
  { num: 8, name: 'Harry Wilson', club: 'Liverpool', pos: 'Midfielder' },
  { num: 10, name: 'Aaron Ramsey', club: 'Juventus', pos: 'Midfielder' },
  { num: 16, name: 'Joe Morrell', club: 'Luton Town', pos: 'Midfielder' },
  { num: 20, name: 'Daniel James', club: 'Man United', pos: 'Midfielder/Forward' },
  { num: 9, name: 'Tyler Roberts', club: 'Leeds United', pos: 'Forward' },
  { num: 11, name: 'Gareth Bale', club: 'Real Madrid', pos: 'Forward / Captain' },
  { num: 13, name: 'Kieffer Moore', club: 'Cardiff City', pos: 'Forward' },
  { num: 5, name: 'Tom Lockyer', club: 'Luton Town', pos: 'Defender' },
  { num: 17, name: 'Rhys Norrington-Davies', club: 'Sheff. United', pos: 'Defender' },
  { num: 18, name: 'Jonny Williams', club: 'Cardiff City', pos: 'Midfielder' },
  { num: 19, name: 'David Brooks', club: 'Bournemouth', pos: 'Midfielder' },
  { num: 23, name: 'Dylan Levitt', club: 'Man United', pos: 'Midfielder' },
  { num: 24, name: 'Ben Cabango', club: 'Swansea City', pos: 'Defender' },
  { num: 25, name: 'Rubin Colwill', club: 'Cardiff City', pos: 'Midfielder' },
  { num: 26, name: 'Matthew Smith', club: 'Man City', pos: 'Midfielder' },
];

function WalesEurosStory() {
  const [tab, setTab] = useState('2016');
  const tabs = ['2016', '2020', 'Compare', 'History'];

  return (
    <div>
      {/* Intro */}
      <p style={{ ...SS, fontSize: 16, marginBottom: 24 }}>
        Wales made their UEFA European Championship debut in <strong style={{ color: RED }}>2016</strong>, reaching the semi-finals in France — their greatest international achievement. They followed it with a <strong style={{ color: GOLD }}>Round of 16</strong> appearance in 2020, becoming the first Welsh side to reach back-to-back EURO knockout stages.
      </p>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(30,41,59,0.8)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            background: tab === t ? RED : 'transparent',
            color: tab === t ? '#fff' : '#64748b',
            transition: 'all 120ms',
          }}>{t}</button>
        ))}
      </div>

      {/* ── EURO 2016 ── */}
      {tab === '2016' && (
        <div>
          {/* Stats bar */}
          <div style={{ ...SURFACE, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {[['6','Matches'],['4','Wins'],['0','Draws'],['2','Losses'],['10','Goals For'],['6','Goals Against'],['SF','Best Round']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: RED }}>{v}</div>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>{l}</div>
              </div>
            ))}
          </div>

          <p style={{ ...SS, marginBottom: 20 }}>
            Wales entered Euro 2016 making their debut at a UEFA European Championship final tournament — their first major tournament since the 1958 FIFA World Cup. Under Chris Coleman, they exceeded every expectation: finishing as Group B winners ahead of England, beating Northern Ireland and Belgium in the knockouts, before falling to eventual champions Portugal in the semi-finals.
          </p>

          <h2 style={SH2}>Qualifying</h2>
          <p style={{ ...SS, marginBottom: 12 }}>Wales qualified from Group B, finishing second behind Belgium with 21 points from 10 matches. Bale was decisive across the campaign, scoring 7 of Wales's 11 qualifying goals.</p>

          <div style={{ ...SURFACE, overflowX: 'auto' }}>
            <div style={SH3}>Final Qualifying Group B</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono, monospace)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${RED}44` }}>
                  {['Team','P','W','D','L','GF','GA','Pts'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Team' ? 'left' : 'center', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Belgium', 10, 7, 2, 1, 24, 5, 23, false],
                  ['Wales ★', 10, 6, 3, 1, 11, 4, 21, true],
                  ['Bosnia & Herz.', 10, 5, 2, 3, 17, 12, 17, false],
                  ['Israel', 10, 4, 1, 5, 16, 14, 13, false],
                  ['Cyprus', 10, 4, 0, 6, 16, 17, 12, false],
                  ['Andorra', 10, 0, 0, 10, 4, 36, 0, false],
                ].map(([team, ...vals]) => (
                  <tr key={team} style={{ background: vals[vals.length - 1] ? `${RED}10` : 'transparent', borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: vals[vals.length - 1] ? '#f1f5f9' : '#94a3b8', fontWeight: vals[vals.length - 1] ? 700 : 400 }}>{team}</td>
                    {vals.slice(0, vals.length - 1).map((v, i) => (
                      <td key={i} style={{ padding: '8px', textAlign: 'center', color: i === vals.length - 2 ? GOLD : '#94a3b8', fontWeight: i === vals.length - 2 ? 700 : 400 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={SH2}>The Campaign</h2>

          <div style={{ ...SURFACE, overflowX: 'auto', marginBottom: 20 }}>
            <div style={SH3}>Finals Group B</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono, monospace)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${RED}44` }}>
                  {['Team','P','W','D','L','GF','GA','Pts'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Team' ? 'left' : 'center', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Wales ★', 3, 2, 0, 1, 6, 3, 6, true],
                  ['England', 3, 1, 2, 0, 3, 2, 5, false],
                  ['Slovakia', 3, 1, 1, 1, 3, 3, 4, false],
                  ['Russia', 3, 0, 1, 2, 2, 6, 1, false],
                ].map(([team, ...vals]) => (
                  <tr key={team} style={{ background: vals[vals.length - 1] ? `${RED}10` : 'transparent', borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: vals[vals.length - 1] ? '#f1f5f9' : '#94a3b8', fontWeight: vals[vals.length - 1] ? 700 : 400 }}>{team}</td>
                    {vals.slice(0, vals.length - 1).map((v, i) => (
                      <td key={i} style={{ padding: '8px', textAlign: 'center', color: i === vals.length - 2 ? GOLD : '#94a3b8', fontWeight: i === vals.length - 2 ? 700 : 400 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <MatchCard meta="Group B MD1 · 11 June 2016 · Stade de Bordeaux" score="Wales 2–1 Slovakia" result="Win" resultType="win" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 Bale 10' (fk), Robson-Kanu 81'  ·  🇸🇰 Duda 61'" note="Wales's first-ever major tournament win since the 1958 World Cup. Bale's sublime free-kick opened the scoring; Robson-Kanu bundled home a winner nine minutes from time." lineup="Ward; Gunter, N. Taylor, Davies, Chester, A. Williams (C); Allen, Ramsey, Bale; Edwards, J. Williams" />
          <MatchCard meta="Group B MD2 · 16 June 2016 · Stade Bollaert-Delelis, Lens" score="England 2–1 Wales" result="Loss" resultType="loss" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 Bale 42'  ·  🏴󠁧󠁢󠁥󠁮󠁧󠁿 Vardy 56', Sturridge 90+2'" note="Wales led through a Bale free-kick until Vardy levelled and Sturridge struck in the second minute of injury time." lineup="Hennessey; Gunter, N. Taylor, Davies, Chester, A. Williams (C); Allen, Robson-Kanu, Ramsey, Bale; Ledley" />
          <MatchCard meta="Group B MD3 · 20 June 2016 · Stadium de Toulouse" score="Russia 0–3 Wales" result="Win — Group Winners" resultType="win" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 Ramsey 11', N. Taylor 20', Bale 67'" note="Wales dominated to finish as Group B winners — above England on goal difference. Neil Taylor's remarkable long-range effort was the highlight." lineup="Hennessey; Gunter, N. Taylor, Davies, Chester, A. Williams (C); Allen, Ramsey, Bale; Ledley, Vokes" />
          <MatchCard meta="Round of 16 · 25 June 2016 · Parc des Princes, Paris" score="Wales 1–0 Northern Ireland" result="Win" resultType="win" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 McAuley 75' (og)" note="A tense all-British affair decided by a McAuley own goal. Both nations were at their first-ever major tournament — adding immense emotional weight. Wales into the quarter-finals." lineup="Hennessey; Gunter, N. Taylor, Davies, Chester, A. Williams (C); Allen, Ramsey, Bale; Ledley, Vokes" />

          <div style={{ ...SURFACE, borderLeft: `4px solid ${GOLD}`, borderRadius: 0, borderTopRightRadius: 12, borderBottomRightRadius: 12 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: GOLD, marginBottom: 8 }}>Quarter-Final</div>
            <MatchCard meta="1 July 2016 · Stade Pierre Mauroy, Lille · Att: 45,936" score="Wales 3–1 Belgium" result="Win" resultType="win" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 A. Williams 31', Robson-Kanu 55' (Cruyff), Vokes 86'  ·  🇧🇪 Nainggolan 13'" note="One of the great tournament upsets. Belgium contained Hazard, De Bruyne, Lukaku and Courtois. Ashley Williams headed an equaliser, Robson-Kanu executed an extraordinary Cruyff turn to fire Wales ahead, and Sam Vokes headed a third. Magnificent." lineup="Hennessey; Gunter, N. Taylor, Davies, Chester, A. Williams (C); Allen, Robson-Kanu, Ramsey, Bale; Ledley" />
          </div>

          <div style={{ ...SURFACE, borderLeft: `4px solid ${RED}`, borderRadius: 0, borderTopRightRadius: 12, borderBottomRightRadius: 12, marginTop: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: RED, marginBottom: 8 }}>Semi-Final</div>
            <MatchCard meta="6 July 2016 · Stade de Lyon, Lyon" score="Portugal 2–0 Wales" result="Loss — Eliminated" resultType="loss" scorers="🇵🇹 Ronaldo 50', Nani 53'" note="Wales's first major tournament semi-final in history. Ben Davies and Aaron Ramsey were both suspended. Ronaldo struck in the 50th minute, Nani added a second three minutes later. Portugal went on to win the tournament. Wales received a standing ovation across France. Their journey from Bordeaux to Lyon was the greatest achievement in Welsh football history." lineup="Hennessey; Gunter, N. Taylor, Chester, A. Williams (C); Allen, Bale; Ledley, Robson-Kanu, Vokes" />
          </div>

          {/* Bale spotlight */}
          <div style={{ background: RED, borderRadius: 12, padding: '24px', marginTop: 28, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Tournament Talisman · Euro 2016</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Gareth Bale</div>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 16 }}>
              {[['3','Tournament Goals'],['1','Assists'],['5','Appearances'],['7','Qualifying Goals'],['82%','Goals Involved (Qual.)']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#fff' }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: 580 }}>In qualifying, Bale scored 7 of Wales's 11 goals — accounting for 82% of their output. At the tournament he scored in all three group games, finishing as joint-third top scorer in all of Euro 2016 alongside Griezmann and Morata. Playing for Real Madrid, he was the lone world-class player who dragged a modest squad to a semi-final few thought possible.</p>
          </div>

          {/* 2016 Scorers */}
          <h2 style={SH2}>2016 Goalscorers</h2>
          <div style={SURFACE}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${RED}33` }}>
                  {['Player','Goals','Apps','Notes'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Gareth Bale', 3, 5, 'Slovakia, England, Russia — joint 3rd in tournament'],
                  ['Hal Robson-Kanu', 2, 4, 'Slovakia, Belgium (iconic Cruyff turn)'],
                  ['Ashley Williams', 1, 5, 'Belgium QF — headed equaliser'],
                  ['Aaron Ramsey', 1, '5*', 'Russia — susp. for semi-final'],
                  ['Neil Taylor', 1, 5, 'Russia — long-range effort'],
                  ['Sam Vokes', 1, 3, 'Belgium QF — headed third'],
                  ['McAuley (og)', 1, '—', 'Northern Ireland R16'],
                ].map(([p, g, a, n]) => (
                  <tr key={p} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: '#f1f5f9', fontWeight: 600 }}>{p}</td>
                    <td style={{ padding: '8px', color: GOLD, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>{g}</td>
                    <td style={{ padding: '8px', color: '#64748b', fontSize: 11 }}>{a}</td>
                    <td style={{ padding: '8px', color: '#64748b', fontSize: 11 }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manager */}
          <h2 style={SH2}>Manager: Chris Coleman</h2>
          <div style={{ ...SURFACE }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Born 10 June 1970</div>
                <div style={{ fontSize: 11, color: GOLD, fontFamily: 'var(--font-mono, monospace)', marginBottom: 12 }}>Swansea, Wales</div>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Won 32 international caps; played for Crystal Palace, Blackburn Rovers and Fulham.',
                'Appointed Wales manager in January 2012, following the tragic death of team-mate and predecessor Gary Speed.',
                'His appointment was widely questioned. What followed silenced every critic: Wales\'s first major tournament since 1958 and a semi-final place.',
              ].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(148,163,184,0.06)', color: '#94a3b8', fontSize: 13, display: 'flex', gap: 10 }}>
                  <span style={{ color: RED, flexShrink: 0 }}>→</span>{f}
                </li>
              ))}
            </ul>
          </div>

          <h2 style={SH2}>2016 Squad</h2>
          <PlayerGrid players={SQUAD_2016} />
        </div>
      )}

      {/* ── EURO 2020 ── */}
      {tab === '2020' && (
        <div>
          {/* Stats bar */}
          <div style={{ ...SURFACE, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {[['4','Matches'],['2','Wins'],['1','Draw'],['1','Loss (Group)'],['4','Goals For'],['5','Goals Against'],['R16','Best Round']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: GOLD }}>{v}</div>
                <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>{l}</div>
              </div>
            ))}
          </div>

          <p style={{ ...SS, marginBottom: 20 }}>
            Euro 2020, played in summer 2021 due to the COVID-19 pandemic, was Wales's second consecutive UEFA European Championship. Under caretaker manager Rob Page, Wales drew with Switzerland, beat Turkey and lost narrowly to Italy before facing Denmark in Amsterdam in the Round of 16.
          </p>

          <h2 style={SH2}>Qualifying</h2>
          <p style={{ ...SS, marginBottom: 12 }}>Wales qualified from Group E, finishing second behind Croatia. Managed by Ryan Giggs, they recovered from early setbacks to remain unbeaten in their final five matches, booking their place with a 2-0 home win against Hungary.</p>

          <div style={{ ...SURFACE, overflowX: 'auto' }}>
            <div style={SH3}>Final Qualifying Group E</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono, monospace)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}44` }}>
                  {['Team','P','W','D','L','GF','GA','Pts'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Team' ? 'left' : 'center', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Croatia', 8, 5, 2, 1, 17, 6, 17, false],
                  ['Wales ★', 8, 4, 2, 2, 10, 7, 14, true],
                  ['Slovakia', 8, 3, 2, 3, 12, 12, 11, false],
                  ['Hungary', 8, 2, 2, 4, 11, 15, 8, false],
                  ['Azerbaijan', 8, 1, 0, 7, 5, 15, 3, false],
                ].map(([team, ...vals]) => (
                  <tr key={team} style={{ background: vals[vals.length - 1] ? `${GOLD}10` : 'transparent', borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: vals[vals.length - 1] ? '#f1f5f9' : '#94a3b8', fontWeight: vals[vals.length - 1] ? 700 : 400 }}>{team}</td>
                    {vals.slice(0, vals.length - 1).map((v, i) => (
                      <td key={i} style={{ padding: '8px', textAlign: 'center', color: i === vals.length - 2 ? GOLD : '#94a3b8', fontWeight: i === vals.length - 2 ? 700 : 400 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={SH2}>The Campaign</h2>

          <div style={{ ...SURFACE, overflowX: 'auto', marginBottom: 20 }}>
            <div style={SH3}>Finals Group A</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'var(--font-mono, monospace)' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}44` }}>
                  {['Team','P','W','D','L','GF','GA','Pts'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Team' ? 'left' : 'center', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Italy ★', 3, 3, 0, 0, 7, 0, 9, false],
                  ['Wales ★', 3, 1, 1, 1, 3, 2, 4, true],
                  ['Switzerland ★', 3, 1, 1, 1, 3, 3, 4, false],
                  ['Turkey', 3, 0, 0, 3, 1, 9, 0, false],
                ].map(([team, ...vals]) => (
                  <tr key={team} style={{ background: vals[vals.length - 1] ? `${GOLD}10` : 'transparent', borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: vals[vals.length - 1] ? '#f1f5f9' : '#94a3b8', fontWeight: vals[vals.length - 1] ? 700 : 400 }}>{team}</td>
                    {vals.slice(0, vals.length - 1).map((v, i) => (
                      <td key={i} style={{ padding: '8px', textAlign: 'center', color: i === vals.length - 2 ? GOLD : '#94a3b8', fontWeight: i === vals.length - 2 ? 700 : 400 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 8, fontFamily: 'var(--font-mono, monospace)' }}>★ = Qualified for Round of 16. Wales finished 2nd on goal difference behind Italy.</div>
          </div>

          <MatchCard meta="Group A MD1 · 12 June 2021 · Baku Olympic Stadium · Att: 8,782" score="Wales 1–1 Switzerland" result="Draw" resultType="draw" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 Kieffer Moore 74'  ·  🇨🇭 Embolo 49'" note="Switzerland led early in the second half. Kieffer Moore headed a deserved equaliser on 74 minutes. Wales finished with just 38% possession but competed well throughout." lineup="D. Ward; Davies, Rodon, Allen, Ramsey, Bale (C), Moore, C. Roberts, Morrell, D. James, Mepham" />
          <MatchCard meta="Group A MD2 · 16 June 2021 · Baku Olympic Stadium" score="Turkey 0–2 Wales" result="Win" resultType="win" scorers="🏴󠁧󠁢󠁷󠁬󠁳󠁿 Ramsey 42', C. Roberts 90+5'" note="Wales controlled this match. Ramsey drove through to finish clinically before half-time, becoming the first Welshman to score in two separate major tournaments. Connor Roberts sealed it in injury time. Bale provided both assists." lineup="D. Ward; Davies, Rodon, Allen, Ramsey, Bale (C), Moore, C. Roberts, Morrell, D. James, Mepham" />
          <MatchCard meta="Group A MD3 · 20 June 2021 · Olimpico in Rome" score="Italy 1–0 Wales" result="Loss" resultType="loss" scorers="🇮🇹 Pessina 39'" note="Italy fielded a rotated side but proved too strong. Ethan Ampadu received a red card on 55 minutes, ruling him out of the Round of 16. Wales qualified as group runners-up." lineup="D. Ward; Gunter, N. Williams, Rodon, Allen, Ramsey, Bale (C), C. Roberts, Ampadu*, Morrell, D. James" />

          <div style={{ ...SURFACE, borderLeft: `4px solid ${RED}`, borderRadius: 0, borderTopRightRadius: 12, borderBottomRightRadius: 12, marginTop: 20 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: RED, marginBottom: 8 }}>Round of 16</div>
            <MatchCard meta="26 June 2021 · Johan Cruijff ArenA, Amsterdam" score="Wales 0–4 Denmark" result="Loss — Eliminated" resultType="loss" scorers="🇩🇰 Dolberg 27', 48', Mæhle 88', Braithwaite 90+4'" note="Denmark, inspired after losing their opening games before recovering with a 4-1 win over Russia, proved too strong. Ampadu was suspended; Ben Davies was also absent. Dolberg scored twice before half-time. Wales rallied but conceded twice late on. Denmark reached the semi-finals." lineup="D. Ward; Davies*, Rodon, Allen*, Ramsey, Bale (C), Moore, Mepham, Morrell, D. James, Roberts" />
          </div>

          {/* 2020 Scorers */}
          <h2 style={SH2}>2020 Goalscorers</h2>
          <div style={SURFACE}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}33` }}>
                  {['Player','Goals','Apps','Notes'].map(h => <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Kieffer Moore', 1, 4, 'Switzerland — powerful header equaliser'],
                  ['Aaron Ramsey', 1, 4, 'Turkey — first Welshman to score in two major tournaments'],
                  ['Connor Roberts', 1, 4, 'Turkey — 90+5\' to seal victory'],
                  ['Gareth Bale', 0, 4, 'Provided 2 assists vs Turkey; 14-match scoring drought'],
                ].map(([p, g, a, n]) => (
                  <tr key={p} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                    <td style={{ padding: '8px', color: '#f1f5f9', fontWeight: 600 }}>{p}</td>
                    <td style={{ padding: '8px', color: GOLD, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>{g}</td>
                    <td style={{ padding: '8px', color: '#64748b', fontSize: 11 }}>{a}</td>
                    <td style={{ padding: '8px', color: '#64748b', fontSize: 11 }}>{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manager */}
          <h2 style={SH2}>Manager: Rob Page</h2>
          <div style={{ ...SURFACE }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Born 3 September 1974</div>
            <div style={{ fontSize: 11, color: GOLD, fontFamily: 'var(--font-mono, monospace)', marginBottom: 12 }}>Llwynypia, Wales</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Won 41 caps for Wales between 1996 and 2005. Played for Watford, Sheffield United, Cardiff City and others.',
                'Appointed assistant to Ryan Giggs in August 2019; became caretaker head coach in November 2020 after Giggs stepped aside.',
                'Led Wales to back-to-back EURO knockout stages — the first Welsh side to achieve that.',
              ].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(148,163,184,0.06)', color: '#94a3b8', fontSize: 13, display: 'flex', gap: 10 }}>
                  <span style={{ color: GOLD, flexShrink: 0 }}>→</span>{f}
                </li>
              ))}
            </ul>
          </div>

          <h2 style={SH2}>2020 Squad</h2>
          <PlayerGrid players={SQUAD_2020} />
        </div>
      )}

      {/* ── COMPARISON ── */}
      {tab === 'Compare' && (
        <div>
          <p style={{ ...SS, fontSize: 15, marginBottom: 24 }}>
            Euro 2016 was the higher achievement — a semi-final place against eventual champions Portugal. Euro 2020 showed resilience and consistency: back-to-back knockout stages with a caretaker manager and a squad of predominantly Championship players.
          </p>

          <div style={SURFACE}>
            <div style={SH3}>2016 vs 2020 — At a Glance</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={WALES_CHART_DATA} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend formatter={v => v === 'y2016' ? 'Euro 2016' : 'Euro 2020'} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="y2016" name="y2016" fill={RED} radius={[4,4,0,0]} />
                <Bar dataKey="y2020" name="y2020" fill={GOLD} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'start', marginTop: 8 }}>
            <div style={SURFACE}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: RED, marginBottom: 12 }}>Euro 2016</div>
              {[['Manager','Coleman'],['Matches','6'],['Wins','4'],['Goals Scored','10'],['Best Round','Semi-Final'],['Group Finish','1st'],['Top Scorer','Bale (3 goals)']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.05)', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{l}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'rgba(148,163,184,0.15)', paddingTop: 60, textAlign: 'center' }}>VS</div>
            <div style={SURFACE}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: GOLD, marginBottom: 12 }}>Euro 2020</div>
              {[['Manager','R. Page'],['Matches','4'],['Wins','2'],['Goals Scored','4'],['Best Round','Round of 16'],['Group Finish','2nd'],['Scorers','Moore / Ramsey / Roberts']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.05)', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{l}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab === 'History' && (
        <div>
          <p style={{ ...SS, fontSize: 15, marginBottom: 24 }}>
            Wales failed to qualify for 10 consecutive EURO tournaments between 1980 and 2012. Their back-to-back appearances in 2016 and 2020 represent a remarkable shift for a country of three million people.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 28 }}>
            {WALES_HISTORY.map(({ year, result, tier }) => (
              <div key={year} style={{
                background: tier === 4 ? `${RED}20` : tier === 3 ? `${GOLD}12` : tier === 2 ? `${RED}0D` : '#1e293b',
                border: `1px solid ${tier === 4 ? RED : tier === 3 ? GOLD : tier === 2 ? `${RED}44` : 'rgba(148,163,184,0.08)'}`,
                borderRadius: 8, padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{year}</span>
                <span style={{ fontSize: 10, color: tier === 4 ? RED : tier === 3 ? GOLD : '#64748b', textAlign: 'right', fontFamily: 'var(--font-mono, monospace)' }}>{result}</span>
              </div>
            ))}
          </div>
          <div style={SURFACE}>
            <div style={SH3}>Key Facts</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Wales failed to qualify for 10 consecutive EUROs (1980–2012) before back-to-back knockout stages in 2016 and 2020.',
                'Their 2016 semi-final remains Wales\'s greatest international achievement, surpassing the 1958 World Cup quarter-final.',
                'The 2016 semi-final was the first Wales had reached in any UEFA or FIFA men\'s or women\'s tournament at any level.',
                'Bale\'s 7 qualifying goals in 2016 (from 11 total) represent one of the most dominant individual contributions in EURO qualifying history.',
                'Aaron Ramsey scored in both 2016 and 2020, making him the first Welshman to score in two separate major tournaments.',
                'In both tournaments, the manager took squads of predominantly Championship-level players to the EURO knockout rounds.',
              ].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(148,163,184,0.06)', color: '#94a3b8', fontSize: 13, display: 'flex', gap: 10, lineHeight: 1.5 }}>
                  <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>◆</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const STORY_CONTENT = {
  'all-blacks': AllBlacksStory,
  'bolt': BoltStory,
  'esc-inflation': EscInflationStory,
  'marathon': MarathonStory,
  'wales-euros': WalesEurosStory,
};

export default function DataStories({ onNavigate }) {
  const [active, setActive] = useState(null);

  const s = {
    page: { padding: '24px 16px', maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-body)' },
    hero: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
    heroIcon: { width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
    heroTitle: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--text-primary)', margin: 0 },
    heroSub: { fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 },
  };

  if (active) {
    const story = STORIES.find(s => s.id === active);
    const StoryComponent = STORY_CONTENT[active];
    return (
      <div style={s.page}>
        <button
          onClick={() => setActive(null)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 24, fontFamily: 'var(--font-body)',
          }}
        >
          ← Back to Stories
        </button>

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Story header */}
          <div style={{
            padding: '28px 32px', borderRadius: 16, marginBottom: 32,
            background: `linear-gradient(135deg, ${story.accent}15 0%, ${story.accent}08 100%)`,
            border: `1px solid ${story.accent}33`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: story.accent, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
              {story.emoji} {story.module.toUpperCase()} · {story.readTime} read
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9', margin: '0 0 12px', lineHeight: 1.2 }}>
              {story.title}
            </h1>
            <p style={{ fontSize: 15, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{story.byline}</p>
          </div>

          {StoryComponent && <StoryComponent />}

          {onNavigate && (
            <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--surface)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Explore the full dataset</span>
              <button
                onClick={() => onNavigate(story.module)}
                style={{
                  padding: '8px 20px', borderRadius: 8,
                  background: story.accent, border: 'none',
                  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}
              >
                Open {story.module} module →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroIcon}>📖</div>
        <div>
          <h1 style={s.heroTitle}>Data Stories</h1>
          <p style={s.heroSub}>Narrative deep-dives powered by live StatNations data</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {STORIES.map(story => (
          <button
            key={story.id}
            onClick={() => setActive(story.id)}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '24px', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color 200ms ease, transform 200ms ease',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = story.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{story.emoji}</span>
              <div style={{
                padding: '3px 10px', borderRadius: 6,
                background: `${story.accent}22`, border: `1px solid ${story.accent}44`,
                fontSize: 10, fontWeight: 700, color: story.accent,
                fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {story.module}
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {story.readTime}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9', margin: '0 0 10px', lineHeight: 1.25 }}>
              {story.title}
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              {story.byline}
            </p>
            <div style={{ marginTop: 16, fontSize: 12, color: story.accent, fontWeight: 600 }}>
              Read story →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
