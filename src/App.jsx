import { lazy, Suspense, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Award, Bike, CircleDot, Crown, Dumbbell, Globe2, LineChart, Medal, Mic2,
  Shield, Star, Swords, Target, Users, Vote, BookOpen, Trophy, Volleyball,
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import CompareBar from './components/CompareBar.jsx';
import CompareModal from './components/CompareModal.jsx';
import { TopBar, BottomBar, SiteFooter } from './components/AppShell.jsx';
import { LogoMark } from './components/Logo.jsx';
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
  { id: 'football',     label: 'Football',     Icon: Volleyball, accent: 'var(--accent-football)',     glow: 'var(--accent-football-glow)' },
  { id: 'rugby',        label: 'Rugby',        Icon: Shield,     accent: 'var(--accent-rugby)',        glow: 'var(--accent-rugby-glow)' },
  { id: 'olympics',     label: 'Olympics',     Icon: Medal,      accent: 'var(--accent-olympics)',     glow: 'var(--accent-olympics-glow)' },
  { id: 'athletics',    label: 'Athletics',    Icon: Dumbbell,   accent: 'var(--accent-athletics)',    glow: 'var(--accent-athletics-glow)' },
  { id: 'cricket',      label: 'Cricket',      Icon: Target,     accent: 'var(--accent-cricket)',      glow: 'var(--accent-cricket-glow)' },
  { id: 'tennis',       label: 'Tennis',       Icon: CircleDot,  accent: 'var(--accent-tennis)',       glow: 'var(--accent-tennis-glow)' },
  { id: 'cycling',      label: 'Cycling',      Icon: Bike,       accent: 'var(--accent-cycling)',      glow: 'var(--accent-cycling-glow)' },
  { id: 'rugby-league', label: 'Rugby League', Icon: Shield,     accent: 'var(--accent-rugby-league)', glow: 'var(--accent-rugby-league-glow)' },
  { id: 'gaelic',       label: 'Gaelic',       Icon: Award,      accent: 'var(--accent-gaelic)',       glow: 'var(--accent-gaelic-glow)' },
];

const WORLD_MODULES = [
  { id: 'elections',    label: 'Elections',    Icon: Vote,      accent: 'var(--accent-elections)',    glow: 'var(--accent-elections-glow)' },
  { id: 'eurovision',   label: 'Eurovision',   Icon: Mic2,      accent: 'var(--accent-eurovision)',   glow: 'var(--accent-eurovision-glow)' },
  { id: 'nobel',        label: 'Nobel',        Icon: Trophy,    accent: 'var(--accent-nobel)',        glow: 'var(--accent-nobel-glow)' },
  { id: 'demographics', label: 'Demographics', Icon: Users,     accent: 'var(--accent-demographics)', glow: 'var(--accent-demographics-glow)' },
  { id: 'economics',    label: 'Economics',    Icon: LineChart, accent: 'var(--accent-economics)',    glow: 'var(--accent-economics-glow)' },
];

// ── Phase 4 platform modules ──────────────────────────────────────────────────
const PLATFORM_MODULES = [
  { id: 'records',      label: 'Records',       Icon: Crown,    accent: 'var(--accent-nobel)',      glow: 'var(--accent-nobel-glow)' },
  { id: 'stories',      label: 'Stories',       Icon: BookOpen, accent: 'var(--accent-elections)',  glow: 'var(--accent-elections-glow)' },
  { id: 'rivalry',      label: 'Rivalry Index', Icon: Swords,   accent: 'var(--accent-cricket)',    glow: 'var(--accent-cricket-glow)' },
  { id: 'my-nations',   label: 'My Nations',    Icon: Star,     accent: 'var(--accent-olympics)',   glow: 'var(--accent-olympics-glow)' },
];

const ALL_MODULES = [...SPORTS, ...WORLD_MODULES, ...PLATFORM_MODULES];
const SPORT_IDS    = new Set(SPORTS.map(s => s.id));
const WORLD_IDS    = new Set(WORLD_MODULES.map(m => m.id));
const PLATFORM_IDS = new Set(PLATFORM_MODULES.map(m => m.id));

// ── Category helpers ──────────────────────────────────────────────────────────
const DEFAULT_FOR = { sports: 'football', world: 'elections', platform: 'records' };

function categoryOf(id) {
  if (WORLD_IDS.has(id)) return 'world';
  if (PLATFORM_IDS.has(id)) return 'platform';
  return 'sports';
}

// ── My Nations dashboard ──────────────────────────────────────────────────────
function MyNations({ onNavigate }) {
  const { favorites, toggleFavorite } = useApp();

  if (favorites.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 32 }}>
        <Star size={44} aria-hidden="true" style={{ color: 'var(--accent-warn)' }} />
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
        <div style={{ width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'var(--accent-warn-bg)', border: '1px solid var(--accent-warn)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={26} aria-hidden="true" style={{ color: 'var(--accent-warn)' }} />
        </div>
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
            <span style={{ fontSize: 26 }} aria-hidden="true">{nation.flag || ''}</span>
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
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-warn)', display: 'flex' }}
              title={`Unfollow ${nation.name}`}
              aria-label={`Unfollow ${nation.name}`}
            >
              <Star size={17} fill="currentColor" aria-hidden="true" />
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
      <LogoMark size={44} accent={mod.accent} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
        Loading {mod.label}…
      </div>
      <div className="skeleton" style={{ width: 200, height: 4, borderRadius: 2 }} />
    </div>
  );
}

// ── Inner App (has context access) ───────────────────────────────────────────
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveModule, setSearchOpen, favorites } = useApp();

  // Active module comes from the URL path (/football → 'football') so every view
  // is linkable and the browser's back button behaves.
  const pathId = location.pathname.replace(/^\//, '').split('/')[0];
  const active = ALL_MODULES.find(m => m.id === pathId)?.id || 'football';
  const activeMod = ALL_MODULES.find(m => m.id === active);
  const [category, setCategory] = useState(() => categoryOf(active));

  useEffect(() => { setActiveModule(active); }, [active, setActiveModule]);
  useEffect(() => { setCategory(categoryOf(active)); }, [active]);

  const handleSelect = (id, tab) => {
    navigate(`/${id}`);
    if (tab) window.location.hash = `#/${id}/${tab}`;
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    if (categoryOf(active) !== cat) handleSelect(DEFAULT_FOR[cat]);
  };

  const modules = category === 'world' ? WORLD_MODULES
    : category === 'platform' ? PLATFORM_MODULES : SPORTS;

  return (
    <div className="sn-app" data-sport={active}>
      <a href="#sn-main" className="sr-only">Skip to main content</a>

      <TopBar
        modules={modules}
        active={active}
        category={category}
        onCategory={handleCategory}
        onSelect={handleSelect}
        onSearch={() => setSearchOpen(true)}
        favouriteCount={favorites.length}
        onFavourites={() => handleSelect('my-nations')}
        sportAccent={activeMod?.accent}
      />

      <main id="sn-main" className="sn-main">
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
      </main>

      <SiteFooter note={activeMod ? `${activeMod.label} — historic results, records and fixtures for every nation.` : undefined} />

      {SPORT_IDS.has(active) && (
        <BottomBar sportId={active} onSelect={handleSelect} onSearch={() => setSearchOpen(true)} />
      )}

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
