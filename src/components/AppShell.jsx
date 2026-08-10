import { useEffect, useRef, useState } from 'react';
import {
  Search, Star, Globe2, Trophy, Sparkles, Compass, Calendar, Users, Home,
} from 'lucide-react';
import Logo, { LogoMark } from './Logo.jsx';

/**
 * The application chrome: one sticky top bar (logo, sport switcher, search,
 * favourites), a footer that is pinned to the bottom of the viewport by the
 * .sn-app flex column, and a thumb-reachable bottom bar on small screens.
 *
 * Every icon here is an SVG from lucide-react — no emoji, so nothing can render
 * as a tofu box on systems without an emoji font.
 */

const CATEGORIES = [
  { id: 'sports', label: 'Sports', Icon: Trophy },
  { id: 'world', label: 'World', Icon: Globe2 },
  { id: 'platform', label: 'Discover', Icon: Sparkles },
];

/** Horizontal scroller that shows a fade on whichever edge has more content. */
function EdgeScroller({ children, className = '', style }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => { el.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, []);

  return (
    <div style={{ position: 'relative', minWidth: 0, flex: 1 }}>
      <div ref={ref} className={`sn-scroll-x ${className}`} style={style}>{children}</div>
      {edges.left && <span aria-hidden="true" style={edgeStyle('left')} />}
      {edges.right && <span aria-hidden="true" style={edgeStyle('right')} />}
    </div>
  );
}

const edgeStyle = side => ({
  position: 'absolute', top: 0, bottom: 0, [side]: 0, width: 28, pointerEvents: 'none',
  background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, var(--pitch), transparent)`,
});

export function TopBar({
  modules, active, category, onCategory, onSelect, onSearch, favouriteCount, onFavourites, sportAccent,
}) {
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-sticky)',
        background: 'color-mix(in srgb, var(--pitch) 88%, transparent)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div className="sn-topbar-inner" style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Row 1 — brand, category segmented control, search, favourites */}
        <div className="sn-topbar-row" style={{ display: 'flex', alignItems: 'center', height: 56 }}>
          <a
            href="/"
            onClick={e => { e.preventDefault(); onSelect('football'); }}
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}
            aria-label="StatNations home"
          >
            <Logo size={26} textSize={17} accent={sportAccent} />
          </a>

          <div
            role="tablist"
            aria-label="Section"
            style={{
              display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 'var(--r-md)',
              padding: 3, border: '1px solid var(--line)', flexShrink: 0,
            }}
          >
            {CATEGORIES.map(cat => {
              const on = category === cat.id;
              return (
                <button
                  key={cat.id} role="tab" aria-selected={on}
                  onClick={() => onCategory(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xs)', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: on ? 'var(--text-inv)' : 'var(--text-muted)',
                    background: on ? 'var(--accent)' : 'transparent',
                    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                  }}
                >
                  <cat.Icon size={14} aria-hidden="true" />
                  <span className="sn-cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onSearch}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              padding: '7px 12px', borderRadius: 'var(--r-md)',
              background: 'var(--surface)', border: '1px solid var(--line)',
              color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', flexShrink: 0,
            }}
          >
            {/* The accessible name is built from the content so that it always
                contains the visible word "Search" — an aria-label that omitted it
                would leave voice-control users unable to activate the button. */}
            <Search size={15} aria-hidden="true" />
            <span className="sn-search-label">Search</span>
            <span className="sr-only">nations, fixtures and tournaments</span>
            <kbd className="sn-kbd" style={{
              padding: '1px 5px', background: 'var(--surface-raised)', borderRadius: 4,
              fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)',
            }}>⌘K</kbd>
          </button>

          {favouriteCount > 0 && (
            <button
              onClick={onFavourites}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
                borderRadius: 'var(--r-md)', background: 'var(--accent-warn-bg)',
                border: '1px solid var(--accent-warn)', color: 'var(--accent-warn)',
                fontSize: 'var(--fs-2xs)', fontWeight: 700, flexShrink: 0,
              }}
              aria-label={`${favouriteCount} followed nations`}
            >
              <Star size={13} aria-hidden="true" />
              <span className="tabular">{favouriteCount}</span>
            </button>
          )}
        </div>

        {/* Row 2 — module switcher: segmented on desktop, labelled pills on mobile */}
        {/* minHeight, not height: the pills grow to 44px on phones. */}
        <nav aria-label="Module" style={{ display: 'flex', alignItems: 'center', minHeight: 46, paddingBottom: 4 }}>
          <EdgeScroller>
            <div style={{ display: 'flex', gap: 4, minWidth: 'max-content', paddingBottom: 2 }}>
              {modules.map(mod => {
                const on = active === mod.id;
                const ModIcon = mod.Icon || Compass;
                return (
                  <button
                    key={mod.id}
                    className="sn-mod-pill"
                    onClick={() => onSelect(mod.id)}
                    aria-current={on ? 'page' : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 12px', borderRadius: 'var(--r-full)',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xs)', fontWeight: 600,
                      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      color: on ? 'var(--text)' : 'var(--text-muted)',
                      background: on ? `color-mix(in srgb, ${mod.accent} 18%, transparent)` : 'transparent',
                      border: `1px solid ${on ? mod.accent : 'transparent'}`,
                      boxShadow: on ? `inset 0 -2px 0 ${mod.accent}` : 'none',
                      transition: 'all var(--dur-fast) var(--ease-out)',
                    }}
                  >
                    <ModIcon size={14} aria-hidden="true" style={{ color: on ? mod.accent : 'currentColor' }} />
                    <span>{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </EdgeScroller>
        </nav>
      </div>

      <style>{`
        /* A class rather than an inline height, so the 44px touch-target rule in
           the global stylesheet can raise it on phones. */
        .sn-mod-pill { min-height: 34px; }
        .sn-topbar-inner { padding: 0 var(--sp-4); }
        .sn-topbar-row { gap: var(--sp-3); }
        @media (max-width: 640px) {
          .sn-cat-label, .sn-search-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
          .sn-logo-word { font-size: 15px; }
          /* No keyboard to press it with, and the row has no width to spare. */
          .sn-kbd { display: none; }
          /* Tighter chrome so the 44px controls all fit across a 390px screen. */
          .sn-topbar-inner { padding: 0 var(--sp-3); }
          .sn-topbar-row { gap: var(--sp-2); }
        }
      `}</style>
    </header>
  );
}

/** Thumb-reach bar: the four things people actually need on a phone. */
export function BottomBar({ onSelect, onSearch, active, sportId }) {
  const items = [
    { id: 'overview', label: 'Overview', Icon: Home, go: () => onSelect(sportId, 'overview') },
    { id: 'fixtures', label: 'Fixtures', Icon: Calendar, go: () => onSelect(sportId, 'fixtures') },
    { id: 'teams', label: 'Teams', Icon: Users, go: () => onSelect(sportId, 'teams') },
    { id: 'search', label: 'Search', Icon: Search, go: onSearch },
  ];
  return (
    <nav className="sn-bottom-bar" aria-label="Quick navigation">
      {items.map(item => {
        const on = active === item.id;
        return (
          <button
            key={item.id} onClick={item.go} aria-current={on ? 'page' : undefined}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 3, minHeight: 56, padding: '6px 4px',
              color: on ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)',
            }}
          >
            <item.Icon size={19} aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function SiteFooter({ note }) {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line)',
        background: 'linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 6%, transparent))',
        padding: 'var(--sp-8) var(--sp-4)',
      }}
    >
      <div style={{
        maxWidth: 'var(--content-max)', margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <LogoMark size={30} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-md)', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              StatNations
            </div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: 0 }}>
              {note || 'International sports analytics — free, no account needed.'}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-faint)', margin: 0 }}>
          © {year} StatNations
        </p>
      </div>
    </footer>
  );
}
