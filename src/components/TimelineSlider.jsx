import { useState, useCallback } from 'react';

/**
 * Reusable dual-handle timeline slider.
 * Usage:
 *   <TimelineSlider min={1900} max={2024} value={[1990, 2024]} onChange={([from, to]) => ...} />
 */
export default function TimelineSlider({
  min = 1900,
  max = 2024,
  value,
  onChange,
  label = 'Timeline',
  accent = '#6366f1',
  step = 1,
}) {
  const [from, to] = value || [min, max];

  const handleFrom = useCallback((e) => {
    const v = Math.min(Number(e.target.value), to - step);
    onChange([v, to]);
  }, [to, onChange, step]);

  const handleTo = useCallback((e) => {
    const v = Math.max(Number(e.target.value), from + step);
    onChange([from, v]);
  }, [from, onChange, step]);

  const pctFrom = ((from - min) / (max - min)) * 100;
  const pctTo   = ((to   - min) / (max - min)) * 100;

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#64748b',
          fontFamily: 'var(--font-display)',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 12, color: accent, fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}>
          {from} – {to}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 6, marginBottom: 16 }}>
        {/* Background */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          background: 'rgba(148,163,184,0.12)', borderRadius: 3,
        }} />
        {/* Active range */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, borderRadius: 3,
          left: `${pctFrom}%`, width: `${pctTo - pctFrom}%`,
          background: accent, opacity: 0.8,
        }} />

        {/* From handle */}
        <input
          type="range" min={min} max={max} step={step} value={from}
          onChange={handleFrom}
          style={{
            position: 'absolute', top: -5, left: 0, right: 0, width: '100%',
            height: 16, opacity: 0, cursor: 'pointer', zIndex: 2,
            WebkitAppearance: 'none', pointerEvents: 'auto',
          }}
        />

        {/* To handle */}
        <input
          type="range" min={min} max={max} step={step} value={to}
          onChange={handleTo}
          style={{
            position: 'absolute', top: -5, left: 0, right: 0, width: '100%',
            height: 16, opacity: 0, cursor: 'pointer', zIndex: 3,
            WebkitAppearance: 'none', pointerEvents: 'auto',
          }}
        />

        {/* Visual thumbs */}
        <div style={{
          position: 'absolute', top: '50%', left: `${pctFrom}%`,
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: accent, border: '2px solid #1e293b',
          boxShadow: `0 0 0 3px ${accent}40`,
          pointerEvents: 'none', zIndex: 4,
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${pctTo}%`,
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: accent, border: '2px solid #1e293b',
          boxShadow: `0 0 0 3px ${accent}40`,
          pointerEvents: 'none', zIndex: 4,
        }} />
      </div>

      {/* Tick marks */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {[min, Math.round((min + max) / 2), max].map(tick => (
          <span key={tick} style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)' }}>
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
