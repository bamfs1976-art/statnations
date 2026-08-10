import { memo } from 'react';

/**
 * The flag sprite.
 *
 * Every flag used to be inlined at each use site: a results table with 200 rows
 * shipped 200 copies of the same rectangles, and the United States flag alone is
 * eight of them. Here each flag is declared once as a <symbol> in a single hidden
 * sheet, and every instance is a two-element <svg><use/></svg> no matter how
 * detailed the flag is.
 *
 * A module that shows flags mounts <FlagSprite /> itself — <Flag> renders nothing
 * visible without it. It is mounted per-module rather than app-wide because the
 * sheet is around 180 DOM nodes, which is pure cost on a page with no flags.
 * Mounting it twice is harmless: the symbol ids are identical, so a <use> just
 * resolves to whichever sheet came first.
 *
 * The artwork is deliberately simplified: at 20x13 CSS pixels a coat of arms is
 * a smudge, so flags carrying one are drawn with their fields and primary charge
 * only. Flags are decorative here; the nation is named in the adjacent text.
 */

/* Team name -> symbol id. A nation absent from this map gets the neutral disc. */
const FLAG_ID = {
  England: 'england',
  France: 'france',
  Germany: 'germany',
  Spain: 'spain',
  Italy: 'italy',
  Brazil: 'brazil',
  Argentina: 'argentina',
  Netherlands: 'netherlands',
  Portugal: 'portugal',
  Belgium: 'belgium',
  Wales: 'wales',
  Scotland: 'scotland',
  'Northern Ireland': 'northern-ireland',
  Ireland: 'ireland',
  Croatia: 'croatia',
  Japan: 'japan',
  Morocco: 'morocco',
  'United States': 'united-states',
  Denmark: 'denmark',
  Switzerland: 'switzerland',
  Uruguay: 'uruguay',
  Colombia: 'colombia',
  Poland: 'poland',
  Australia: 'australia',

  /* Nations appearing in the 2026 fixtures and results */
  Norway: 'norway',
  Mexico: 'mexico',
  Canada: 'canada',
  Egypt: 'egypt',
  Slovenia: 'slovenia',
  'New Zealand': 'new-zealand',
  Chile: 'chile',
  Paraguay: 'paraguay',
  Ghana: 'ghana',
  'Cape Verde': 'cape-verde',
  Algeria: 'algeria',
};

/* memo: the sheet is ~180 static nodes and takes no props, so there is no reason
   to diff it every time the surrounding view re-renders. */
export const FlagSprite = memo(function FlagSprite() {
  return (
    <svg
      aria-hidden="true" focusable="false" width="0" height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <symbol id="fl-england" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#CF081F"/><rect y="8" width="30" height="4" fill="#CF081F"/></symbol>
      <symbol id="fl-france" viewBox="0 0 30 20"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></symbol>
      <symbol id="fl-germany" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#DD0000"/><rect y="13.33" width="30" height="6.67" fill="#FFCC00"/></symbol>
      <symbol id="fl-spain" viewBox="0 0 30 20"><rect width="30" height="5" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/><rect y="15" width="30" height="5" fill="#AA151B"/></symbol>
      <symbol id="fl-italy" viewBox="0 0 30 20"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></symbol>
      <symbol id="fl-brazil" viewBox="0 0 30 20"><rect width="30" height="20" fill="#009C3B"/><polygon points="15,2 28,10 15,18 2,10" fill="#FFDF00"/><circle cx="15" cy="10" r="4" fill="#002776"/></symbol>
      <symbol id="fl-argentina" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#74ACDF"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/></symbol>
      <symbol id="fl-netherlands" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#AE1C28"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468B"/></symbol>
      <symbol id="fl-portugal" viewBox="0 0 30 20"><rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#FF0000"/><circle cx="12" cy="10" r="3.5" fill="#FFCC00"/></symbol>
      <symbol id="fl-belgium" viewBox="0 0 30 20"><rect width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#FFD700"/><rect x="20" width="10" height="20" fill="#FF0000"/></symbol>
      <symbol id="fl-wales" viewBox="0 0 30 20"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#00AB39"/></symbol>
      <symbol id="fl-scotland" viewBox="0 0 30 20"><rect width="30" height="20" fill="#005EB8"/><line x1="0" y1="0" x2="30" y2="20" stroke="#fff" strokeWidth="3"/><line x1="30" y1="0" x2="0" y2="20" stroke="#fff" strokeWidth="3"/></symbol>
      <symbol id="fl-northern-ireland" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#DA291C"/><rect y="8" width="30" height="4" fill="#DA291C"/></symbol>
      <symbol id="fl-ireland" viewBox="0 0 30 20"><rect width="10" height="20" fill="#169B62"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#FF883E"/></symbol>
      <symbol id="fl-croatia" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#FF0000"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#171796"/></symbol>
      <symbol id="fl-japan" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5" fill="#BC002D"/></symbol>
      <symbol id="fl-morocco" viewBox="0 0 30 20"><rect width="30" height="20" fill="#C1272D"/><polygon points="15,5 16.5,9.5 21,9.5 17.3,12.2 18.5,17 15,14 11.5,17 12.7,12.2 9,9.5 13.5,9.5" fill="none" stroke="#006233" strokeWidth="1"/></symbol>
      <symbol id="fl-united-states" viewBox="0 0 30 20"><rect width="30" height="20" fill="#B22234"/><rect y="1.54" width="30" height="1.54" fill="#fff"/><rect y="4.62" width="30" height="1.54" fill="#fff"/><rect y="7.69" width="30" height="1.54" fill="#fff"/><rect y="10.77" width="30" height="1.54" fill="#fff"/><rect y="13.85" width="30" height="1.54" fill="#fff"/><rect y="16.92" width="30" height="1.54" fill="#fff"/><rect width="12" height="10.77" fill="#3C3B6E"/></symbol>
      <symbol id="fl-denmark" viewBox="0 0 30 20"><rect width="30" height="20" fill="#C60C30"/><rect x="8" width="4" height="20" fill="#fff"/><rect y="8" width="30" height="4" fill="#fff"/></symbol>
      <symbol id="fl-switzerland" viewBox="0 0 30 20"><rect width="30" height="20" fill="#FF0000"/><rect x="12.5" y="5" width="5" height="10" fill="#fff"/><rect x="10" y="7.5" width="10" height="5" fill="#fff"/></symbol>
      <symbol id="fl-uruguay" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="0" width="30" height="2.22" fill="#0038A8"/><rect y="4.44" width="30" height="2.22" fill="#0038A8"/><rect y="8.88" width="30" height="2.22" fill="#0038A8"/><rect y="13.33" width="30" height="2.22" fill="#0038A8"/><rect y="17.78" width="30" height="2.22" fill="#0038A8"/><rect width="10" height="10" fill="#fff"/><circle cx="5" cy="5" r="3" fill="#FFD700"/></symbol>
      <symbol id="fl-colombia" viewBox="0 0 30 20"><rect width="30" height="10" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/></symbol>
      <symbol id="fl-poland" viewBox="0 0 30 20"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#DC143C"/></symbol>
      <symbol id="fl-australia" viewBox="0 0 30 20"><rect width="30" height="20" fill="#00008B"/><rect width="10" height="10" fill="#00008B"/><line x1="0" y1="0" x2="10" y2="10" stroke="#fff" strokeWidth="1.5"/><line x1="10" y1="0" x2="0" y2="10" stroke="#fff" strokeWidth="1.5"/><rect x="4" width="2" height="10" fill="#fff"/><rect y="4" width="10" height="2" fill="#fff"/><rect x="4.3" width="1.4" height="10" fill="#CF081F"/><rect y="4.3" width="10" height="1.4" fill="#CF081F"/></symbol>

      <symbol id="fl-norway" viewBox="0 0 30 20"><rect width="30" height="20" fill="#BA0C2F"/><rect x="8" width="6" height="20" fill="#fff"/><rect y="7" width="30" height="6" fill="#fff"/><rect x="9.5" width="3" height="20" fill="#00205B"/><rect y="8.5" width="30" height="3" fill="#00205B"/></symbol>
      <symbol id="fl-mexico" viewBox="0 0 30 20"><rect width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE1126"/><circle cx="15" cy="10" r="2.6" fill="none" stroke="#8C6239" strokeWidth="1"/></symbol>
      <symbol id="fl-canada" viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#D80621"/><rect x="22.5" width="7.5" height="20" fill="#D80621"/><path d="M15 4.6l1 2.4 2.2-1-.8 2.6 2.6-.5-1.8 2 1.2.9-4 1 .4 2.6H14l.4-2.6-4-1 1.2-.9-1.8-2 2.6.5-.8-2.6 2.2 1z" fill="#D80621"/></symbol>
      <symbol id="fl-egypt" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#CE1126"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#000"/><path d="M15 8.2l.8 2h2.1l-1.7 1.3.7 2-1.9-1.2-1.9 1.2.7-2-1.7-1.3h2.1z" fill="#C09300"/></symbol>
      <symbol id="fl-slovenia" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#005DA4"/><rect y="13.33" width="30" height="6.67" fill="#ED1C24"/><path d="M6 4.2l3 0 1.6 4.6H4.4z" fill="#005DA4" stroke="#fff" strokeWidth="0.7"/></symbol>
      <symbol id="fl-new-zealand" viewBox="0 0 30 20"><rect width="30" height="20" fill="#00247D"/><rect width="13" height="9" fill="#00247D"/><path d="M0 0l13 9M13 0L0 9" stroke="#fff" strokeWidth="1.6"/><path d="M6.1 0v9M0 4.3h13" stroke="#fff" strokeWidth="2.6"/><path d="M6.5 0v9M0 4.5h13" stroke="#CC142B" strokeWidth="1.2"/><circle cx="22" cy="5" r="1.1" fill="#CC142B"/><circle cx="25" cy="9" r="1.1" fill="#CC142B"/><circle cx="21" cy="13" r="1.1" fill="#CC142B"/><circle cx="25.5" cy="15" r="1.1" fill="#CC142B"/></symbol>
      <symbol id="fl-chile" viewBox="0 0 30 20"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/><path d="M5 2.4l.9 2.6h2.7L6.4 6.6l.8 2.6L5 7.6 2.8 9.2l.8-2.6L1.4 5h2.7z" fill="#fff"/></symbol>
      <symbol id="fl-paraguay" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#D52B1E"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#0038A8"/><circle cx="15" cy="10" r="2.4" fill="none" stroke="#0038A8" strokeWidth="0.7"/><circle cx="15" cy="10" r="1" fill="#1D9A3C"/></symbol>
      <symbol id="fl-ghana" viewBox="0 0 30 20"><rect width="30" height="6.67" fill="#CE1126"/><rect y="6.67" width="30" height="6.67" fill="#FCD116"/><rect y="13.33" width="30" height="6.67" fill="#006B3F"/><path d="M15 7.4l.9 2.7h2.8l-2.3 1.7.9 2.7-2.3-1.7-2.3 1.7.9-2.7-2.3-1.7h2.8z" fill="#000"/></symbol>
      <symbol id="fl-cape-verde" viewBox="0 0 30 20"><rect width="30" height="20" fill="#003893"/><rect y="10.5" width="30" height="4" fill="#fff"/><rect y="11.8" width="30" height="1.4" fill="#CF2027"/><circle cx="10" cy="12.5" r="5.4" fill="none" stroke="#F7D116" strokeWidth="0.9"/></symbol>
      <symbol id="fl-algeria" viewBox="0 0 30 20"><rect width="15" height="20" fill="#006233"/><rect x="15" width="15" height="20" fill="#fff"/><path d="M18 10a4.2 4.2 0 108 2.2 3.4 3.4 0 11-2.6-6 4.2 4.2 0 00-5.4 3.8z" fill="#D21034"/><path d="M24.6 8.4l.6 1.8h1.9l-1.6 1.1.6 1.9-1.5-1.2-1.6 1.2.6-1.9-1.5-1.1h1.9z" fill="#D21034"/></symbol>
    </svg>
  );
});

/**
 * A nation's flag, or a neutral disc bearing its three-letter code when the
 * sprite has no artwork for it. Both are the same size, so table rows and
 * result lines stay aligned either way.
 */
export default function Flag({ team, size = 20, tint }) {
  const h = size * 0.667;
  const id = FLAG_ID[team];

  if (id) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex', width: size, height: h, borderRadius: 3,
          overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--elev-1)',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 30 20" focusable="false">
          <use href={`#fl-${id}`} />
        </svg>
      </span>
    );
  }

  const code = team ? team.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : '';
  return (
    <svg width={size} height={h} viewBox="0 0 30 20" aria-hidden="true"
         focusable="false" style={{ flexShrink: 0 }}>
      <circle cx="15" cy="10" r="9.2" fill={tint || 'var(--surface-raised)'}
              stroke="var(--line-strong)" strokeWidth="1" />
      <text x="15" y="10" textAnchor="middle" dominantBaseline="central" fill="var(--text)"
            fontSize="7.5" fontWeight="700" fontFamily="var(--font-display)" letterSpacing="0.2">
        {code}
      </text>
    </svg>
  );
}
