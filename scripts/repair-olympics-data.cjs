/**
 * repair-olympics-data.cjs
 *
 * The Olympic medal JSON files in public/data were produced by a CSV import that
 * mislabelled every column: the key `country` actually held the Gender column,
 * `gender` held the country code, `sport` held the host city, and so on. On top of
 * that, winter athlete names are formatted "SURNAME, Firstname", so the comma split
 * those rows an extra field to the right and the Medal column fell off the end —
 * only 188 of 6,522 winter rows kept a real Gold/Silver/Bronze value.
 *
 * That is why the all-time winter medal table listed "Men", "Women" and "Mixed" as
 * nations with every medal counted as bronze.
 *
 * This script rebuilds both season files:
 *   • summer — re-keyed in place (its rows are intact, only the labels were wrong)
 *   • winter — rebuilt from olympics-medal-summary.json, which is clean and complete,
 *     one row per medal, with athlete names carried across from the old file wherever
 *     a row can be matched unambiguously
 *
 * Milano Cortina 2026 is written from the published final medal table (29 medalling
 * nations, 116 gold). Event-by-event medallists for 2026 are not in any dataset we
 * hold, so those rows carry the country, medal and Games only — sport and event are
 * left empty rather than guessed, and the views skip empty sports.
 *
 * Run: node scripts/repair-olympics-data.cjs
 */

const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '../public/data');
const read = f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const write = (f, d) => {
  fs.writeFileSync(path.join(DATA, f), JSON.stringify(d));
  const kb = (fs.statSync(path.join(DATA, f)).size / 1024).toFixed(1);
  console.log(`  ✓  ${f}  ${d.length} rows  ${kb} KB`);
};

const isCode = v => /^[A-Z]{2,3}[0-9]?$/.test((v || '').trim());
const clean = v => (v || '').replace(/"/g, '').trim();

// ── Milano Cortina 2026 final medal table ────────────────────────────────────
// 116 events; one tie for silver means 117 silver and 115 bronze medals.
const MEDALS_2026 = [
  ['NOR', 'Norway',         18, 12, 11],
  ['USA', 'United States',  12, 12,  9],
  ['NED', 'Netherlands',    10,  7,  3],
  ['ITA', 'Italy',          10,  6, 14],
  ['GER', 'Germany',         8, 10,  8],
  ['FRA', 'France',          8,  9,  6],
  ['SWE', 'Sweden',          8,  6,  4],
  ['SUI', 'Switzerland',     6,  9,  8],
  ['AUT', 'Austria',         5,  8,  5],
  ['JPN', 'Japan',           5,  7, 12],
  ['CAN', 'Canada',          5,  7,  9],
  ['CHN', 'China',           5,  4,  6],
  ['KOR', 'South Korea',     3,  4,  3],
  ['AUS', 'Australia',       3,  2,  1],
  ['GBR', 'Great Britain',   3,  1,  1],
  ['CZE', 'Czechia',         2,  2,  1],
  ['SLO', 'Slovenia',        2,  1,  1],
  ['ESP', 'Spain',           1,  0,  2],
  ['BRA', 'Brazil',          1,  0,  0],
  ['KAZ', 'Kazakhstan',      1,  0,  0],
  ['POL', 'Poland',          0,  3,  1],
  ['NZL', 'New Zealand',     0,  2,  1],
  ['FIN', 'Finland',         0,  1,  5],
  ['LAT', 'Latvia',          0,  1,  1],
  ['EST', 'Estonia',         0,  1,  0],
  ['GEO', 'Georgia',         0,  1,  0],
  ['DEN', 'Denmark',         0,  1,  0],
  ['BUL', 'Bulgaria',        0,  0,  2],
  ['BEL', 'Belgium',         0,  0,  1],
];

// ── Re-key a raw row using the real column order ─────────────────────────────
// True columns: [index, Year, City, Sport, Discipline, Athlete, Country, Gender, Event, Medal]
function rekey(r) {
  if (isCode(r.gender)) {
    return {
      year: clean(r.year), city: clean(r.sport), sport: clean(r.discipline),
      discipline: clean(r.event), athlete: clean(r.athlete), code: clean(r.gender),
      gender: clean(r.country), event: clean(r.event_gender), medal: clean(r.medal),
    };
  }
  if (isCode(r.country)) {
    // Athlete name contained a comma: name split in two and Medal was lost.
    return {
      year: clean(r.year), city: clean(r.sport), sport: clean(r.discipline),
      discipline: clean(r.event), athlete: (clean(r.athlete) + ', ' + clean(r.gender)).replace(/^, |, $/g, ''),
      code: clean(r.country), gender: clean(r.event_gender), event: clean(r.medal), medal: '',
    };
  }
  return null;
}

const normGender = g => {
  const s = (g || '').toLowerCase();
  if (s.startsWith('men')) return 'Men';
  if (s.startsWith('women')) return 'Women';
  if (s.startsWith('mixed')) return 'Mixed';
  if (s.startsWith('open')) return 'Open';
  return clean(g);
};

// Loose key used to carry athlete names over from the old winter rows.
const norm = s => (s || '').toLowerCase()
  .replace(/\b(men|women|mixed|open|s)\b/g, '')
  .replace(/metres|meters|metre|meter/g, 'm')
  .replace(/[^a-z0-9]/g, '');

console.log('\n── Olympics data repair ────────────────────────');

const summary = read('olympics-medal-summary.json');
const rawWinter = read('olympics-winter.json').filter(r => r.year !== 'Year');
const rawSummer = read('olympics-summer.json').filter(r => r.year !== 'Year');

// This script consumes the original mislabelled import and overwrites it, so it is
// not idempotent — running it twice would treat repaired rows as raw ones.
if (rawWinter.some(r => 'code' in r)) {
  console.log('  ! these files have already been repaired — restore the originals first (git checkout HEAD -- public/data/olympics-*.json)\n');
  process.exit(0);
}

// ── Summer: re-key, recovering medals lost to commas in event names ──────────
// Where an event was written "Foil, Masters" the comma split it and pushed Medal off
// the end. The event can be pieced back together and the medal looked up in the
// per-medal summary, but only when that country won exactly one medal in the event.
const summerMedalIndex = new Map();
summary.filter(r => r.season === 'Summer').forEach(r => {
  const k = [r.year, norm(r.sport), norm(r.event_name), r.country_code].join('|');
  if (!summerMedalIndex.has(k)) summerMedalIndex.set(k, new Set());
  summerMedalIndex.get(k).add(r.medal);
});

let recovered = 0, unrecoverable = 0;
const summer = rawSummer.map(row => {
  const r = rekey(row);
  if (!r) return null;
  if (['Gold', 'Silver', 'Bronze'].includes(r.medal)) return r;
  // Medal missing: rebuild the event name from the two halves and look the medal up.
  const event = (clean(row.event_gender) + ', ' + clean(row.medal)).replace(/^, |, $/g, '');
  const found = summerMedalIndex.get([r.year, norm(r.sport), norm(event), r.code].join('|'));
  if (found && found.size === 1) {
    recovered++;
    return Object.assign({}, r, { event, medal: [...found][0] });
  }
  unrecoverable++;
  return null;
}).filter(Boolean);
console.log(`  summer: ${rawSummer.length} raw rows → ${summer.length} medals (${recovered} recovered, ${unrecoverable} unrecoverable and dropped)`);

// ── Winter: rebuild from the clean per-medal summary ─────────────────────────
const oldWinter = rawWinter.map(rekey).filter(Boolean);
const athleteIndex = new Map();
oldWinter.forEach(r => {
  const k = [r.year, norm(r.discipline || r.sport), norm(r.event), r.code].join('|');
  if (!athleteIndex.has(k)) athleteIndex.set(k, []);
  athleteIndex.get(k).push(r.athlete);
});

const CITY = { '2026': 'Milano Cortina' };
let named = 0;
const winter = summary
  .filter(r => r.season === 'Winter' && r.year !== '2026')
  .map(r => {
    const city = (r.games || '').replace(/^\d{4}\s*/, '') || CITY[r.year] || '';
    const k = [r.year, norm(r.sport), norm(r.event_name), r.country_code].join('|');
    const pool = athleteIndex.get(k);
    let athlete = '';
    if (pool && pool.length) { athlete = pool.length === 1 ? pool[0] : pool.slice(0, 4).join('; '); named++; }
    return {
      year: r.year, city, sport: r.sport, discipline: r.sport, athlete,
      code: r.country_code, country: r.country, gender: normGender(r.event_gender),
      event: r.event_name, medal: r.medal,
    };
  });
console.log(`  winter 1924–2022: ${winter.length} medals (${named} with an athlete name carried over)`);

// ── Winter 2026 from the published final table ───────────────────────────────
const winter2026 = [];
MEDALS_2026.forEach(([code, country, g, s, b]) => {
  [['Gold', g], ['Silver', s], ['Bronze', b]].forEach(([medal, n]) => {
    for (let i = 0; i < n; i++) {
      winter2026.push({
        year: '2026', city: 'Milano Cortina', sport: '', discipline: '', athlete: '',
        code, country, gender: '', event: '', medal,
      });
    }
  });
});
const tally = m => winter2026.filter(r => r.medal === m).length;
console.log(`  winter 2026: ${winter2026.length} medals (${tally('Gold')} gold, ${tally('Silver')} silver, ${tally('Bronze')} bronze across ${MEDALS_2026.length} nations)`);
if (tally('Gold') !== 116) throw new Error('2026 gold count should equal the 116 events');

write('olympics-winter.json', winter.concat(winter2026));
write('olympics-summer.json', summer);

// ── Keep the aggregate table and the per-medal summary in step ───────────────
const aggregate = read('olympics-winter-medals.json')
  .filter(r => String(r.year) !== '2026')
  .concat(MEDALS_2026.map(([code, , g, s, b]) => ({ year: '2026', country: code, gold: g, silver: s, bronze: b })));
write('olympics-winter-medals.json', aggregate);

const summaryOut = summary.filter(r => !(r.season === 'Winter' && r.year === '2026'))
  .concat(winter2026.map(r => ({
    season: 'Winter', year: '2026', medal: r.medal, country_code: r.code, country: r.country,
    games: '2026 Milano Cortina', sport: '', event_gender: '', event_name: '',
  })));
write('olympics-medal-summary.json', summaryOut);

console.log('');
