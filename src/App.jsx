import { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import CompareBar from './components/CompareBar.jsx';
import CompareModal from './components/CompareModal.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';

const RecordTracker = lazy(() => import('./components/RecordTracker.jsx'));
const DataStories   = lazy(() => import('./stories/index.jsx'));
const RivalryIndex  = lazy(() => import('./components/RivalryIndex.jsx'));
import './styles/global.css';

// ── Lazy-loaded sport modules ─────────────────────────────────────────────────
const Rugby       = lazy(() => import('./sports/rugby/index.jsx'));
const Football    = lazy(() => import('./sports/football/index.jsx'));
const Olympics    = lazy(() => import('./sports/olympics/index.jsx'));
const Athletics   = lazy(() => import('./sports/athletics/index.jsx'));
const Cricket     = lazy(() => import('./sports/cricket/index.jsx'));
const Tennis      = lazy(() => import('./sports/tennis/index.jsx'));
const Cycling     = lazy(() => import('./sports/cycling/index.jsx'));
const RugbyLeague = lazy(() => import('./sports/rugby-league/index.jsx'));
const Gaelic      = lazy(() => import('./sports/gaelic/index.jsx'));

// ── Lazy-loaded world modules ─────────────────────────────────────────────────
const Elections   = lazy(() => import('./world/elections/index.jsx'));
const Eurovision  = lazy(() => import('./world/eurovision/index.jsx'));
const Nobel       = lazy(() => import('./world/nobel/index.jsx'));
const Demographics = lazy(() => import('./world/demographics/index.jsx'));
const Economics   = lazy(() => import('./world/economics/index.jsx'));

// ── Module definitions ────────────────────────────────────────────────────────
const SPORTS = [
  { id: 'rugby',        label: 'Rugby',        emoji: '🏉', accent: 'var(--accent-rugby)',        glow: 'var(--accent-rugby-glow)' },
  { id: 'football',     label: 'Football',     emoji: '⚽', accent: 'var(--accent-football)',     glow: 'var(--accent-football-glow)' },
  { id: 'olympics',     label: 'Olympics',     emoji: '🏅', accent: 'var(--accent-olympics)',     glow: 'var(--accent-olympics-glow)' },
  { id: 'athletics',    label: 'Athletics',    emoji: '🏃', accent: 'var(--accent-athletics)',    glow: 'var(--accent-athletics-glow)' },
  { id: 'cricket',      label: 'Cricket',      emoji: '🏏', accent: 'var(--accent-cricket)',      glow: 'var(--accent-cricket-glow)' },
  { id: 'tennis',       label: 'Tennis',       emoji: '🎾', accent: 'var(--accent-tennis)',       glow: 'var(--accent-tennis-glow)' },
  { id: 'cycling',      label: 'Cycling',      emoji: '🚴', accent: 'var(--accent-cycling)',      glow: 'var(--accent-cycling-glow)' },
  { id: 'rugby-league', label: 'Rugby League', emoji: '🏈', accent: 'var(--accent-rugby-league)', glow: 'var(--accent-rugby-league-glow)' },
  { id: 'gaelic',       label: 'Gaelic',       emoji: '🏑', accent: 'var(--accent-gaelic)',       glow: 'var(--accent-gaelic-glow)' },
];

const WORLD_MODULES = [
  { id: 'elections',    label: 'Elections',    emoji: '🗳️',  accent: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
  { id: 'eurovision',   label: 'Eurovision',   emoji: '🎤',  accent: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
  { id: 'nobel',        label: 'Nobel',        emoji: '🏆',  accent: '#d4a017', glow: 'rgba(212,160,23,0.3)' },
  { id: 'demographics', label: 'Demographics', emoji: '👥',  accent: '#0ea5e9', glow: 'rgba(14,165,233,0.3)' },
  { id: 'economics',    label: 'Economics',    emoji: '📈',  accent: '#10b981', glow: 'rgba(16,185,129,0.3)' },
];

// ── Phase 4 platform modules ──────────────────────────────────────────────────
const PLATFORM_MODULES = [
  { id: 'records',      label: 'Records',        emoji: '🏆', accent: '#d4a017', glow: 'rgba(212,160,23,0.3)' },
  { id: 'stories',      label: 'Stories',        emoji: '📖', accent: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
  { id: 'rivalry',      label: 'Rivalry Index',  emoji: '⚔️', accent: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  { id: 'my-nations',   label: 'My Nations',     emoji: '⭐', accent: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
];

const ALL_MODULES = [...SPORTS, ...WORLD_MODULES, ...PLATFORM_MODULES];
const SPORT_IDS    = new Set(SPORTS.map(s => s.id));
const WORLD_IDS    = new Set(WORLD_MODULES.map(m => m.id));
const PLATFORM_IDS = new Set(PLATFORM_MODULES.map(m => m.id));

// ── Nav ───────────────────────────────────────────────────────────────────────
function AppNav({ active, onSelect }) {
  const { setSearchOpen, compareList, favorites } = useApp();
  const isWorld    = WORLD_IDS.has(active);
  const isPlatform = PLATFORM_IDS.has(active);
  const [category, setCategory] = useState(
    isPlatform ? 'platform' : isWorld ? 'world' : 'sports'
  );

  useEffect(() => {
    if (WORLD_IDS.has(active)) setCategory('world');
    else if (PLATFORM_IDS.has(active)) setCategory('platform');
    else setCategory('sports');
  }, [active]);

  const modules = category === 'world' ? WORLD_MODULES : category === 'platform' ? PLATFORM_MODULES : SPORTS;

  const handleCategorySwitch = (cat) => {
    setCategory(cat);
    const defaults = { sports: 'rugby', world: 'elections', platform: 'records' };
    const inCurrent = (cat === 'sports' && SPORT_IDS.has(active)) ||
                      (cat === 'world' && WORLD_IDS.has(active)) ||
                      (cat === 'platform' && PLATFORM_IDS.has(active));
    if (!inCurrent) onSelect(defaults[cat]);
  };

  const catDefs = [
    { id: 'sports',   label: '🏆 Sports',   activeBg: 'var(--accent-rugby)' },
    { id: 'world',    label: '🌍 World',    activeBg: '#6366f1' },
    { id: 'platform', label: '✨ Discover', activeBg: '#d4a017' },
  ];

  return (
    <nav
      aria-label="Module selector"
      style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(15,23,42,0.9)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Row 1: brand + category pills + search */}
      <div style={{ padding: '0 16px', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, height: 44 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              📊
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Stat<span style={{ color: '#d4a017' }}>Nations</span>
            </span>
          </div>

          {/* Category toggle */}
          <div style={{ display: 'flex', gap: 4, background: 'rgba(30,41,59,0.8)', borderRadius: 9, padding: '3px' }}>
            {catDefs.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySwitch(cat.id)}
                style={{
                  padding: '4px 14px', borderRadius: 6,
                  fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: category === cat.id ? '#fff' : 'var(--text-dim)',
                  background: category === cat.id ? cat.activeBg : 'transparent',
                  border: 'none', cursor: 'pointer', transition: 'all 120ms ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 8,
              background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.15)',
              color: '#64748b', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'border-color 120ms ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'}
          >
            <span>🔍</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Search
              <kbd style={{ padding: '1px 6px', background: 'rgba(148,163,184,0.1)', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)', color: '#475569' }}>
                ⌘K
              </kbd>
            </span>
          </button>

          {/* Favorites indicator */}
          {favorites.length > 0 && (
            <button
              onClick={() => onSelect('my-nations')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                color: '#f59e0b', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              ⭐ {favorites.length}
            </button>
          )}
        </div>
      </div>

      {/* Row 2: module buttons */}
      <div style={{ padding: '0 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 2, height: 44, minWidth: 'max-content' }}>
          {modules.map(mod => {
            const isActive = active === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onSelect(mod.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 8,
                  fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? mod.accent : 'transparent',
                  boxShadow: isActive ? `0 2px 10px ${mod.glow}` : 'none',
                  transition: 'all 120ms cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer', border: 'none', outline: 'none', whiteSpace: 'nowrap',
                }}
              >
                <span aria-hidden="true">{mod.emoji}</span>
                <span className="sn-nav-label">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .sn-nav-label { display: none; } }
      `}</style>
    </nav>
  );
}

// ── My Nations dashboard ──────────────────────────────────────────────────────
function MyNations({ onNavigate }) {
  const { favorites, toggleFavorite } = useApp();

  if (favorites.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32 }}>
        <div style={{ fontSize: 48 }}>⭐</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
          No followed nations yet
        </div>
        <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', maxWidth: 400 }}>
          Star any nation inside a sport or world module to follow it here. Your selections are saved locally in your browser.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1400, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⭐</div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', color: '#f1f5f9', margin: 0 }}>My Nations</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Your followed nations — saved locally, no account needed</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {favorites.map(nation => (
          <div key={nation.id} style={{
            background: '#1e293b', border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: 12, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 28 }}>{nation.flag || '🏳️'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nation.name}
              </div>
              {nation.module && (
                <button
                  onClick={() => onNavigate(nation.module)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 11, color: '#6366f1', fontWeight: 600,
                    fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  View in {nation.module} →
                </button>
              )}
            </div>
            <button
              onClick={() => toggleFavorite(nation)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#f59e0b' }}
              title="Unfollow"
            >
              ⭐
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Loading fallback ──────────────────────────────────────────────────────────
function LoadingFallback({ id }) {
  const mod = ALL_MODULES.find(m => m.id === id) || ALL_MODULES[0];
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>{mod.emoji}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
        Loading {mod.label}…
      </div>
      <div className="skeleton" style={{ width: 200, height: 4, borderRadius: 2 }} />
    </div>
  );
}

// ── Path routing ──────────────────────────────────────────────────────────────
// ── Inner App (has context access) ───────────────────────────────────────────
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveModule } = useApp();

  // Derive active module from URL path (e.g. /rugby → 'rugby')
  const pathId = location.pathname.replace(/^\//, '').split('/')[0];
  const active = ALL_MODULES.find(m => m.id === pathId)?.id || 'rugby';

  // Keep AppContext in sync when route changes
  useEffect(() => {
    setActiveModule(active);
  }, [active, setActiveModule]);

  const handleSelect = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div data-sport={active} style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <AppNav active={active} onSelect={handleSelect} />

      <ErrorBoundary title={`${active} module error`}>
        <Suspense fallback={<LoadingFallback id={active} />}>
          {/* Sports */}
          {active === 'rugby'        && <Rugby />}
          {active === 'football'     && <Football />}
          {active === 'olympics'     && <Olympics />}
          {active === 'athletics'    && <Athletics />}
          {active === 'cricket'      && <Cricket />}
          {active === 'tennis'       && <Tennis />}
          {active === 'cycling'      && <Cycling />}
          {active === 'rugby-league' && <RugbyLeague />}
          {active === 'gaelic'       && <Gaelic />}
          {/* World */}
          {active === 'elections'    && <Elections />}
          {active === 'eurovision'   && <Eurovision />}
          {active === 'nobel'        && <Nobel />}
          {active === 'demographics' && <Demographics />}
          {active === 'economics'    && <Economics />}
          {/* Platform */}
          {active === 'records'    && <RecordTracker onNavigate={handleSelect} />}
          {active === 'stories'    && <DataStories onNavigate={handleSelect} />}
          {active === 'rivalry'    && <RivalryIndex />}
          {active === 'my-nations' && <MyNations onNavigate={handleSelect} />}
        </Suspense>
      </ErrorBoundary>

      {/* Phase 4 overlays */}
      <GlobalSearch onNavigate={handleSelect} />
      <CompareBar />
      <CompareModal />
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
