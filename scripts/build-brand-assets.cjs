/**
 * build-brand-assets.cjs
 *
 * Generates every StatNations brand asset from one source mark so they never drift:
 * a circular "globe-as-scoreboard" — a meridian grid whose horizontal gridlines
 * double as chart bars, in brand green and amber on deep navy.
 *
 * Outputs: favicon.svg, favicon.png, apple-touch-icon.png, icon-192.png,
 *          icon-512.png, og-image.png
 *
 * Run: node scripts/build-brand-assets.cjs
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.resolve(__dirname, '../public');

const NAVY = '#0B1220';
const NAVY_DEEP = '#070C15';
const GREEN = '#22C55E';
const GREEN_DIM = '#15803D';
const AMBER = '#F5B301';
const TEXT = '#F1F5F9';
const MUTED = '#94A3B8';

/**
 * The mark. Bars are the globe's latitude lines, clipped to the sphere, with the
 * longest bar picked out in amber so the "scoreboard" reading survives at 16px.
 * `bg` false gives a transparent mark for use inside the app.
 */
function mark({ size = 64, bg = true, pad = 0 } = {}) {
  const s = 64;
  const r = 27;
  const cx = 32, cy = 32;
  // latitude lines: [y, halfWidth, colour] — halfWidth stays inside the sphere
  const bars = [
    [20, 17, GREEN_DIM],
    [26, 22, GREEN],
    [32, 26, AMBER],
    [38, 22, GREEN],
    [44, 15, GREEN_DIM],
  ];
  const inner = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREEN}" stroke-width="3.5"/>
    <g clip-path="url(#globe)">
      ${bars.map(([y, hw, c]) =>
        `<rect x="${cx - hw}" y="${y - 2}" width="${hw * 2}" height="4" rx="2" fill="${c}"/>`).join('\n      ')}
      <ellipse cx="${cx}" cy="${cy}" rx="11" ry="${r}" fill="none" stroke="${NAVY}" stroke-width="2.5" opacity="0.85"/>
    </g>`;
  const canvas = s + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}" width="${size}" height="${size}" role="img" aria-label="StatNations">
  <defs><clipPath id="globe"><circle cx="${cx}" cy="${cy}" r="${r - 1}"/></clipPath></defs>
  ${bg ? `<rect width="${canvas}" height="${canvas}" rx="${canvas * 0.22}" fill="${NAVY}"/>` : ''}
  <g transform="translate(${pad} ${pad})">${inner}
  </g>
</svg>`;
}

// ── favicon.svg — mark only, no wordmark, legible at 16px ────────────────────
const faviconSvg = mark({ size: 64, bg: true });
fs.writeFileSync(path.join(OUT, 'favicon.svg'), faviconSvg);
console.log('  ✓  favicon.svg');

// ── Open Graph card ──────────────────────────────────────────────────────────
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.55" stop-color="${NAVY_DEEP}"/>
      <stop offset="1" stop-color="#0D1A14"/>
    </linearGradient>
    <clipPath id="g2"><circle cx="200" cy="200" r="167"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.07">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 52}" x2="1200" y2="${i * 52}" stroke="${GREEN}" stroke-width="1"/>`).join('')}
  </g>
  <g transform="translate(96 118) scale(0.9)">
    <circle cx="200" cy="200" r="167" fill="none" stroke="${GREEN}" stroke-width="20"/>
    <g clip-path="url(#g2)">
      <rect x="95"  y="126" width="210" height="26" rx="13" fill="${GREEN_DIM}"/>
      <rect x="63"  y="164" width="274" height="26" rx="13" fill="${GREEN}"/>
      <rect x="38"  y="202" width="324" height="26" rx="13" fill="${AMBER}"/>
      <rect x="63"  y="240" width="274" height="26" rx="13" fill="${GREEN}"/>
      <rect x="108" y="278" width="184" height="26" rx="13" fill="${GREEN_DIM}"/>
      <ellipse cx="200" cy="200" rx="68" ry="167" fill="none" stroke="${NAVY}" stroke-width="13" opacity="0.7"/>
    </g>
  </g>
  <text x="470" y="278" font-family="Barlow Condensed, Oswald, DejaVu Sans, sans-serif" font-size="76" font-weight="700" letter-spacing="0.5" fill="${TEXT}">STAT<tspan fill="${GREEN}">NATIONS</tspan></text>
  <text x="472" y="332" font-family="Inter, DejaVu Sans, Helvetica, sans-serif" font-size="30" fill="${MUTED}">International Football Analytics</text>
  <rect x="472" y="366" width="130" height="6" rx="3" fill="${AMBER}"/>
  <text x="472" y="424" font-family="Inter, DejaVu Sans, Helvetica, sans-serif" font-size="23" fill="${MUTED}">51,000+ internationals since 1872</text>
</svg>`;

// ── Raster outputs ───────────────────────────────────────────────────────────
const png = (svg, size, file, background) =>
  sharp(Buffer.from(svg))
    .resize(size, size, background ? { fit: 'contain', background } : undefined)
    .png()
    .toFile(path.join(OUT, file))
    .then(() => console.log(`  ✓  ${file}  ${size}×${size}`));

(async () => {
  await png(mark({ size: 512, bg: true }), 64, 'favicon.png');
  // apple-touch-icon: opaque navy, padded so iOS' rounding never clips the mark
  await png(mark({ size: 512, bg: true, pad: 9 }), 180, 'apple-touch-icon.png');
  // maskable icons need ~20% safe padding
  await png(mark({ size: 512, bg: true, pad: 13 }), 192, 'icon-192.png');
  await png(mark({ size: 512, bg: true, pad: 13 }), 512, 'icon-512.png');
  await sharp(Buffer.from(og)).png().toFile(path.join(OUT, 'og-image.png'));
  console.log('  ✓  og-image.png  1200×630');
})();
