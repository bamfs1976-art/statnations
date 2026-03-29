import { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useApp } from '../context/AppContext.jsx';
import { SEARCH_ENTITIES, MODULE_INFO, TYPE_LABEL } from '../data/searchIndex.js';

const fuse = new Fuse(SEARCH_ENTITIES, {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'alt',  weight: 0.3 },
    { name: 'type', weight: 0.1 },
    { name: 'module', weight: 0.1 },
  ],
  threshold: 0.35,
  includeScore: true,
});

const TYPE_ORDER = ['nation', 'tournament', 'person', 'record', 'event'];

export default function GlobalSearch({ onNavigate }) {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Show recent/popular when empty
      return SEARCH_ENTITIES.slice(0, 8);
    }
    return fuse.search(query).slice(0, 12).map(r => r.item);
  }, [query]);

  // Group results by type
  const grouped = useMemo(() => {
    const order = query.trim() ? TYPE_ORDER : [];
    const groups = {};
    results.forEach(r => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    if (order.length) {
      return order.filter(t => groups[t]).map(t => ({ type: t, items: groups[t] }));
    }
    return Object.entries(groups).map(([type, items]) => ({ type, items }));
  }, [results, query]);

  // Flat list for keyboard nav
  const flat = useMemo(() => results, [results]);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSelect = (entity) => {
    setSearchOpen(false);
    onNavigate(entity.module);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && flat[cursor]) {
      handleSelect(flat[cursor]);
    }
  };

  if (!searchOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
    >
      <div style={{
        width: '100%', maxWidth: 600,
        background: '#1e293b',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 16,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        margin: '0 16px',
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 20px',
          borderBottom: '1px solid rgba(148,163,184,0.1)',
        }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search nations, tournaments, records…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 16, color: '#f1f5f9', fontFamily: 'var(--font-body)',
            }}
          />
          <kbd style={{
            padding: '2px 8px', background: 'rgba(148,163,184,0.15)',
            borderRadius: 6, fontSize: 11, color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 480, overflowY: 'auto', padding: '8px 0' }}>
          {grouped.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              No results for "{query}"
            </div>
          )}
          {grouped.map(({ type, items }) => (
            <div key={type}>
              {(query.trim() || grouped.length > 1) && (
                <div style={{
                  padding: '4px 20px 2px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#64748b',
                  fontFamily: 'var(--font-display)',
                }}>
                  {TYPE_LABEL[type] || type}
                </div>
              )}
              {items.map((entity) => {
                const idx = flat.indexOf(entity);
                const mod = MODULE_INFO[entity.module];
                const isActive = idx === cursor;
                return (
                  <button
                    key={entity.id}
                    onClick={() => handleSelect(entity)}
                    onMouseEnter={() => setCursor(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', padding: '9px 20px',
                      background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 80ms ease',
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1, width: 24, textAlign: 'center' }}>
                      {entity.flag}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: '#f1f5f9',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {entity.name}
                      </div>
                      {entity.alt && (
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                          {entity.alt}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '3px 10px', borderRadius: 6,
                      background: `${entity.accent}22`,
                      border: `1px solid ${entity.accent}44`,
                      fontSize: 11, fontWeight: 600,
                      color: entity.accent,
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {mod?.emoji} {mod?.label}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 20px',
          borderTop: '1px solid rgba(148,163,184,0.08)',
          display: 'flex', gap: 16, alignItems: 'center',
          fontSize: 11, color: '#475569',
          fontFamily: 'var(--font-mono)',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ open module</span>
          <span style={{ marginLeft: 'auto' }}>
            {SEARCH_ENTITIES.length} entities indexed
          </span>
        </div>
      </div>
    </div>
  );
}
