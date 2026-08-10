/**
 * StatNations brand mark and wordmark.
 *
 * The mark is a "globe-as-scoreboard": a meridian grid whose latitude lines double
 * as chart bars. It is the same geometry as public/favicon.svg (see
 * scripts/build-brand-assets.cjs), so the tab icon and the in-app logo never drift.
 *
 * `accent` tints the bars per sport so the section is identifiable at a glance;
 * it defaults to the current sport accent supplied by the [data-sport] theme.
 */

const BARS = [
  { y: 20, hw: 17, tone: 'dim' },
  { y: 26, hw: 22, tone: 'full' },
  { y: 32, hw: 26, tone: 'warn' },
  { y: 38, hw: 22, tone: 'full' },
  { y: 44, hw: 15, tone: 'dim' },
];

export function LogoMark({ size = 28, accent, title = 'StatNations' }) {
  const uid = `sn-globe-${size}-${String(accent || 'default').replace(/[^a-z0-9]/gi, '')}`;
  const stroke = accent || 'var(--accent, var(--accent-brand))';
  const opacity = { full: 1, dim: 0.55, warn: 1 };
  const fill = { full: stroke, dim: stroke, warn: 'var(--accent-warn)' };
  return (
    <svg
      width={size} height={size} viewBox="0 0 64 64"
      role="img" aria-label={title} focusable="false"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <clipPath id={uid}><circle cx="32" cy="32" r="26" /></clipPath>
      </defs>
      <circle cx="32" cy="32" r="27" fill="none" stroke={stroke} strokeWidth="3.5" />
      <g clipPath={`url(#${uid})`}>
        {BARS.map((b, i) => (
          <rect key={i} x={32 - b.hw} y={b.y - 2} width={b.hw * 2} height="4" rx="2"
                fill={fill[b.tone]} opacity={opacity[b.tone]} />
        ))}
        <ellipse cx="32" cy="32" rx="11" ry="27" fill="none" stroke="var(--pitch)" strokeWidth="2.5" opacity="0.85" />
      </g>
    </svg>
  );
}

/**
 * Full lockup. `sport` adds a tinted sport name in front of the wordmark, which is
 * how a section identifies itself (Football = green, Rugby = amber, and so on).
 */
export default function Logo({ size = 28, sport, accent, textSize = 17, showWordmark = true }) {
  return (
    <span className="sn-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
      <LogoMark size={size} accent={accent} />
      {showWordmark && (
        <span
          className="sn-logo-word"
          style={{
            fontFamily: 'var(--font-display)', fontSize: textSize, fontWeight: 700,
            letterSpacing: '0.01em', textTransform: 'uppercase', lineHeight: 1,
            color: 'var(--text)', whiteSpace: 'nowrap',
          }}
        >
          {sport && <span style={{ color: accent || 'var(--accent)' }}>{sport} </span>}
          Stat<span style={{ color: accent || 'var(--accent-brand)' }}>Nations</span>
        </span>
      )}
    </span>
  );
}
