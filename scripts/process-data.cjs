/**
 * process-data.cjs
 * Processes all source CSV files into optimised JSON chunks for public/data/.
 * Run: node scripts/process-data.cjs
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../Rugby/rugby analytics/rugby-analytics-netlify/rugby-netlify');
const OUT = path.resolve(__dirname, '../public/data');

function readCSV(file, srcDir = SRC) {
  const p = path.join(srcDir, file);
  if (!fs.existsSync(p)) { console.log(`  ⚠  ${file} not found`); return null; }
  const raw = fs.readFileSync(p, 'utf8');
  const lines = raw.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).filter(l => l.trim()).map(line => {
    // Handle quoted CSV fields
    const cols = [];
    let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] !== undefined ? cols[i] : ''; });
    return obj;
  });
}

function write(filename, data) {
  const p = path.join(OUT, filename);
  fs.writeFileSync(p, JSON.stringify(data));
  const kb = (fs.statSync(p).size / 1024).toFixed(1);
  console.log(`  ✓  ${filename}  ${Array.isArray(data) ? data.length + ' rows' : Object.keys(data).length + ' keys'}  ${kb} KB`);
}

// ── RUGBY ─────────────────────────────────────────────────────────────────────
console.log('\n── Rugby ───────────────────────────────────────');

// Six Nations is already in rugby-sixnations.json from extract-data.cjs.
// Copy remaining rugby CSV files that exist
const rugbyFiles = [
  ['rugby_results.csv', 'rugby-results.json', ['date','home','away','hs','as','venue']],
  ['rugby-world-cup-2023-UTC.csv', 'rugby-wc2023.json', null],
  ['rugby-world-cup-2019-TokyoStandardTime.csv', 'rugby-wc2019.json', null],
];
for (const [src, out, headers] of rugbyFiles) {
  const data = readCSV(src, path.resolve(__dirname, '../../Rugby'));
  if (data) write(out, data);
}

// ── FOOTBALL ─────────────────────────────────────────────────────────────────
console.log('\n── Football ────────────────────────────────────');

const allMatches = readCSV('all_matches.csv');
if (allMatches) {
  // Normalise field names
  const normalise = r => ({
    date: r.date || r.Date || '',
    home: r.home_team || r.home || '',
    away: r.away_team || r.away || '',
    hs: r.home_score || r.hs || '',
    as: r.away_score || r.as || '',
    tournament: r.tournament || r.Tournament || '',
    country: r.country || '',
    neutral: r.neutral || '',
  });

  const rows = allMatches.map(normalise);

  // Split by category for lazy loading
  const major = ['World Cup','UEFA Euro','Copa America','Copa América','Africa Cup of Nations','AFC Asian Cup','Gold Cup','Olympic Games'];
  const isMajor = t => major.some(m => t.includes(m));

  const worldCup = rows.filter(r => r.tournament === 'World Cup');
  const euros = rows.filter(r => r.tournament === 'UEFA Euro' || r.tournament === 'European Championship');
  const copa = rows.filter(r => r.tournament === 'Copa América' || r.tournament === 'Copa America');
  const nations = rows.filter(r => r.tournament.includes('Nations League'));
  const british = rows.filter(r => r.tournament.includes('British Championship'));
  const qualifiers = rows.filter(r => r.tournament.includes('qualifier') || r.tournament.includes('qualification'));
  const friendly = rows.filter(r => r.tournament === 'Friendly');
  const friendlyTourney = rows.filter(r => r.tournament === 'Friendly tournament');
  const majorOnly = rows.filter(r => isMajor(r.tournament) && !qualifiers.includes(r));

  write('football-worldcup.json', worldCup);
  write('football-euros.json', euros);
  write('football-copa.json', copa);
  write('football-nations-league.json', nations);
  write('football-british.json', british);
  write('football-qualifiers.json', qualifiers);
  write('football-friendly.json', [...friendly, ...friendlyTourney]);
  write('football-major.json', majorOnly);         // all major finals tournaments, no qualis
  write('football-all.json', rows);                 // full dataset for deep analysis
}

// Countries list
const countries = readCSV('countries_names.csv');
if (countries) write('football-countries.json', countries);

// ── OLYMPICS ──────────────────────────────────────────────────────────────────
console.log('\n── Olympics ─────────────────────────────────────');

// Summer medals — already processed, but re-process with cleaner structure
const summer = readCSV('SummerSD.csv');
if (summer) {
  // Group by year+country for medal table
  const medalTable = {};
  for (const r of summer) {
    if (!r.Medal || r.Medal === 'NA' || r.Medal === '') continue;
    const key = `${r.Year || r.year}_${r.NOC || r.country || r.Country}`;
    if (!medalTable[key]) medalTable[key] = { year: r.Year || r.year, country: r.NOC || r.country || r.Country, gold: 0, silver: 0, bronze: 0 };
    const medal = (r.Medal || r.medal || '').toLowerCase();
    if (medal === 'gold') medalTable[key].gold++;
    else if (medal === 'silver') medalTable[key].silver++;
    else if (medal === 'bronze') medalTable[key].bronze++;
  }
  write('olympics-summer-medals.json', Object.values(medalTable));
  write('olympics-summer-events.json', summer);
}

const winter = readCSV('WinterSD.csv');
if (winter) {
  const medalTable = {};
  for (const r of winter) {
    if (!r.Medal || r.Medal === 'NA' || r.Medal === '') continue;
    const key = `${r.Year || r.year}_${r.NOC || r.country || r.Country}`;
    if (!medalTable[key]) medalTable[key] = { year: r.Year || r.year, country: r.NOC || r.country || r.Country, gold: 0, silver: 0, bronze: 0 };
    const medal = (r.Medal || r.medal || '').toLowerCase();
    if (medal === 'gold') medalTable[key].gold++;
    else if (medal === 'silver') medalTable[key].silver++;
    else if (medal === 'bronze') medalTable[key].bronze++;
  }
  write('olympics-winter-medals.json', Object.values(medalTable));
  write('olympics-winter-events.json', winter);
}

const countries2 = readCSV('CountriesSD.csv');
if (countries2) write('olympics-countries.json', countries2);

const athletes = readCSV('olympics_athletes_dataset.csv');
if (athletes) write('olympics-athletes.json', athletes);

const medals = readCSV('olympic_medals.csv');
if (medals) write('olympics-medal-summary.json', medals);

// IAAF athletics records — shared between Olympics and Athletics sport module
const iaaf = readCSV('clean_iaaf_record.csv');
if (iaaf) write('athletics-records.json', iaaf);

console.log('\n✓ Done.\n');
