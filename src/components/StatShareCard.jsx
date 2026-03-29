import { useRef, useState } from 'react';
import { MODULE_INFO } from '../data/searchIndex.js';

/**
 * Stat Share Card — captures a branded 1200×630 PNG via html2canvas.
 * Usage: wrap any content in <StatShareCard module="rugby">...</StatShareCard>
 * Or use the standalone modal trigger via <StatShareCardButton />.
 */

export function StatShareCardButton({ module, statLabel, statValue, subtitle, flag = '🏳️', entityName = '' }) {
  const cardRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const mod = MODULE_INFO[module] || { label: module, emoji: '📊', accent: '#6366f1' };

  const handleCapture = async () => {
    if (!cardRef.current) return;
    setCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `statnations-${module}-${entityName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div>
      {/* The card to capture — hidden off-screen at 1200×630 */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed', top: -9999, left: -9999,
          width: 1200, height: 630,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '64px 80px',
          fontFamily: "'Barlow Condensed', system-ui, sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, ${mod.accent}30 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>
            📊
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#f1f5f9' }}>
            Stat<span style={{ color: '#d4a017' }}>Nations</span>
          </span>
          <div style={{
            marginLeft: 12, padding: '4px 14px', borderRadius: 6,
            background: `${mod.accent}22`, border: `1px solid ${mod.accent}44`,
            fontSize: 14, fontWeight: 700, color: mod.accent, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {mod.emoji} {mod.label}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <span style={{ fontSize: 96, lineHeight: 1 }}>{flag}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {entityName}
            </div>
            <div style={{ fontSize: 100, fontWeight: 800, color: mod.accent, lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: 12 }}>
              {statValue}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {statLabel}
            </div>
            {subtitle && (
              <div style={{ fontSize: 18, color: '#64748b', marginTop: 8 }}>{subtitle}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute', bottom: 40, left: 80, right: 80,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 20,
        }}>
          <span style={{ fontSize: 16, color: '#475569' }}>statnations.app</span>
          <span style={{ fontSize: 16, color: '#475569' }}>Data current as of 2024–25</span>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={handleCapture}
        disabled={capturing}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8,
          background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
          color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em',
          transition: 'all 120ms ease',
        }}
        title="Download stat card as PNG"
      >
        {capturing ? '⏳' : '📤'} {capturing ? 'Capturing…' : 'Share'}
      </button>
    </div>
  );
}

export default StatShareCardButton;
