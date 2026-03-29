import { useApp } from '../context/AppContext.jsx';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, setCompareOpen } = useApp();

  if (compareList.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 400,
      background: '#1e293b',
      border: '1px solid rgba(148,163,184,0.25)',
      borderRadius: 16,
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      backdropFilter: 'blur(12px)',
      maxWidth: 'calc(100vw - 32px)',
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#64748b',
        fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
        marginRight: 4,
      }}>
        Compare
      </span>

      {compareList.map(nation => (
        <div key={nation.id} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: `${nation.accent || '#6366f1'}22`,
          border: `1px solid ${nation.accent || '#6366f1'}44`,
          borderRadius: 8, padding: '4px 10px',
        }}>
          <span style={{ fontSize: 16 }}>{nation.flag || '🏳️'}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap' }}>
            {nation.name}
          </span>
          <button
            onClick={() => removeFromCompare(nation.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 14, padding: '0 0 0 2px',
              lineHeight: 1, display: 'flex', alignItems: 'center',
            }}
            aria-label={`Remove ${nation.name}`}
          >
            ×
          </button>
        </div>
      ))}

      {compareList.length < 5 && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          border: '2px dashed rgba(148,163,184,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#475569', fontSize: 18, flexShrink: 0,
        }}>
          +
        </div>
      )}

      <button
        onClick={() => setCompareOpen(true)}
        disabled={compareList.length < 2}
        style={{
          padding: '6px 16px', borderRadius: 8,
          background: compareList.length >= 2 ? '#6366f1' : '#1e293b',
          border: compareList.length >= 2 ? 'none' : '1px solid rgba(148,163,184,0.15)',
          color: compareList.length >= 2 ? '#fff' : '#475569',
          fontSize: 12, fontWeight: 700, cursor: compareList.length >= 2 ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          transition: 'all 120ms ease', flexShrink: 0,
        }}
      >
        Compare {compareList.length >= 2 ? `(${compareList.length})` : ''}
      </button>

      <button
        onClick={clearCompare}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#475569', fontSize: 12, padding: '4px 8px',
          whiteSpace: 'nowrap',
        }}
      >
        Clear
      </button>
    </div>
  );
}
