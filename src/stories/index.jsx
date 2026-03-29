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

const STORY_CONTENT = {
  'all-blacks': AllBlacksStory,
  'bolt': BoltStory,
  'esc-inflation': EscInflationStory,
  'marathon': MarathonStory,
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
