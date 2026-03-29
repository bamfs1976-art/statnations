/**
 * StatCard — a single large KPI number with label and optional subtitle.
 * Used across rugby, football, olympics for top-line stats.
 */
export default function StatCard({ label, value, sub, accent = false, style, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      <div
        style={{
          fontSize: 'var(--fs-xs)',
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--fw-semibold)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: accent ? 'var(--accent, var(--accent-rugby))' : 'var(--text-secondary)',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        className="stat-num"
        style={{
          fontSize: 'var(--fs-3xl)',
          fontWeight: 'var(--fw-black)',
          lineHeight: 1,
          color: accent ? 'var(--accent, var(--accent-rugby))' : 'var(--text-primary)',
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--text-dim)',
            marginTop: 6,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
