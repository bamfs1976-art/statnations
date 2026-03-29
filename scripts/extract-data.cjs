/**
 * extract-data.js
 * Reads the three legacy JSX files, extracts all inline CSV/data strings,
 * parses them, and writes clean JSON files to public/data/.
 * Run once: node scripts/extract-data.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../Rugby/rugby analytics/rugby-analytics-netlify/rugby-netlify');
const OUT = path.resolve(__dirname, '../public/data');

// ── helpers ──────────────────────────────────────────────────────────────────

function extractVar(src, varName) {
  // Match  var NAME = `...`  or  var NAME = "..."  (possibly multiline for backtick)
  const bt = new RegExp(`var\\s+${varName}\\s*=\\s*\`([\\s\\S]*?)\``, 'm');
  const dq = new RegExp(`var\\s+${varName}\\s*=\\s*"([\\s\\S]*?)"\\s*;`, 'm');
  let m = src.match(bt) || src.match(dq);
  if (!m) throw new Error(`Could not find variable: ${varName}`);
  return m[1];
}

function extractJsVar(src, varName) {
  // Extract a JS array/object literal assigned to varName
  const re = new RegExp(`var\\s+${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
  const m = src.match(re);
  if (!m) throw new Error(`Could not find JS array: ${varName}`);
  // Use eval in a controlled way — only called on known safe source files
  return eval(m[1]); // eslint-disable-line no-eval
}

function parseCSV(raw, headers) {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(line => {
      const cols = line.split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cols[i] !== undefined ? cols[i].trim() : ''; });
      return obj;
    });
}

function write(filename, data) {
  const outPath = path.join(OUT, filename);
  fs.writeFileSync(outPath, JSON.stringify(data));
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  ✓ ${filename} — ${Array.isArray(data) ? data.length : Object.keys(data).length} records — ${kb} KB`);
}

// ── Rugby ─────────────────────────────────────────────────────────────────────

function extractRugby() {
  console.log('\nExtracting Rugby data…');
  const src = fs.readFileSync(path.join(SRC, 'rugby-analytics.jsx'), 'utf8');

  // Six Nations (from SIX_NATIONS_RAW)
  const sixRaw = extractVar(src, 'SIX_NATIONS_RAW');
  const sixNations = parseCSV(sixRaw, ['year','date','home','hb','away','ab','hs','as','stadium']);
  write('rugby-sixnations.json', sixNations);

  // All international results (RESULTS_RAW)
  try {
    const resultsRaw = extractVar(src, 'RESULTS_RAW');
    // Format: date,home,away,hs,as,cat,stadium(;=,),city(;=,),neutral(Y/N)
    const results = resultsRaw.trim().split('\n').filter(l => l.trim()).map(l => {
      const p = l.split(',');
      return {
        date: p[0], home: p[1], away: p[2],
        hs: p[3] !== undefined ? +p[3] : null,
        as: p[4] !== undefined ? +p[4] : null,
        cat: p[5] || 'OT',
        stadium: (p[6] || '').replace(/;/g, ','),
        city: (p[7] || '').replace(/;/g, ','),
        neutral: p[8] === 'Y',
      };
    });
    write('rugby-intl.json', results);
  } catch (e) { console.log('  ℹ RESULTS_RAW:', e.message); }

  // World Cup data
  try {
    const wcRaw = extractVar(src, 'WORLD_CUP_RAW');
    const wc = wcRaw.trim().split('\n').filter(l => l.trim()).map(l => {
      const p = l.split(',');
      return {
        year: +p[0], date: p[1], round: p[2], group: p[3],
        venue: (p[4] || '').replace(/;/g, ','),
        home: p[5], away: p[6],
        hs: p[7] !== '' ? +p[7] : null,
        as: p[8] !== '' ? +p[8] : null,
      };
    });
    write('rugby-worldcup.json', wc);
  } catch (e) { console.log('  ℹ WORLD_CUP_RAW:', e.message); }

  // Five Nations
  try {
    const fnRaw = extractVar(src, 'FIVE_NATIONS_RAW');
    const fn = parseCSV(fnRaw, ['year','date','home','away','hs','as','stadium']);
    write('rugby-fivenations.json', fn);
  } catch (e) { console.log('  ℹ FIVE_NATIONS_RAW:', e.message); }

  // Raeburn Shield holders
  try {
    const rbRaw = extractVar(src, 'RAEBURN_RAW');
    const rb = rbRaw.trim().split('\n').filter(l => l.trim()).map(l => {
      const p = l.split('|');
      return { no: +p[0], holder: p[1], gained: p[2], days: p[3] ? +p[3] : 0, matches: p[4] ? +p[4] : 0 };
    });
    write('rugby-raeburn.json', rb);
  } catch (e) { console.log('  ℹ RAEBURN_RAW:', e.message); }

  // Raeburn Results
  try {
    const rbrRaw = extractVar(src, 'RAEBURN_RESULTS_RAW');
    const rbr = rbrRaw.trim().split('\n').filter(l => l.trim()).map(l => {
      const p = l.split(',');
      return {
        date: p[0], home: p[1], away: p[2],
        hs: +p[3], as: +p[4],
        tourn: p[5] || '',
        venue: (p[6] || '').replace(/;/g, ','),
        run: p[7] ? +p[7] : 0,
        neutral: p[8] === 'Y',
      };
    });
    write('rugby-raeburn-results.json', rbr);
  } catch (e) { console.log('  ℹ RAEBURN_RESULTS_RAW:', e.message); }

  // All matches CSV (from all_matches.csv if it exists)
  const allMatchesPath = path.join(SRC, 'all_matches.csv');
  if (fs.existsSync(allMatchesPath)) {
    const raw = fs.readFileSync(allMatchesPath, 'utf8');
    const rows = raw.split('\n').filter(l => l.trim());
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g,'_'));
    const matches = rows.slice(1).filter(l => l.trim()).map(line => {
      const cols = line.split(',');
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cols[i] !== undefined ? cols[i].trim() : ''; });
      return obj;
    });
    write('rugby-all-matches.json', matches);
  }
}

// ── Football ──────────────────────────────────────────────────────────────────

function extractFootball() {
  console.log('\nExtracting Football data…');
  const src = fs.readFileSync(path.join(SRC, 'football-analytics.jsx'), 'utf8');

  // WC Winners
  try {
    const WC_WINNERS = extractJsVar(src, 'WC_WINNERS');
    write('football-wc-winners.json', WC_WINNERS);
  } catch (e) { console.log('  ℹ WC_WINNERS:', e.message); }

  // Euro Winners
  try {
    const EURO_WINNERS = extractJsVar(src, 'EURO_WINNERS');
    write('football-euro-winners.json', EURO_WINNERS);
  } catch (e) { console.log('  ℹ EURO_WINNERS:', e.message); }

  // Copa Winners
  try {
    const COPA_WINNERS = extractJsVar(src, 'COPA_WINNERS');
    write('football-copa-winners.json', COPA_WINNERS);
  } catch (e) { console.log('  ℹ COPA_WINNERS:', e.message); }

  // Match data — scan for CSV raw strings
  const csvVars = ['MATCHES_RAW','ALL_MATCHES_RAW','FB_MATCHES_RAW','RESULTS_RAW'];
  for (const v of csvVars) {
    try {
      const raw = extractVar(src, v);
      const matches = parseCSV(raw, ['date','home_team','away_team','home_score','away_score','tournament','country','neutral']);
      write(`football-matches.json`, matches);
      break;
    } catch { /* try next */ }
  }
}

// ── Olympics ──────────────────────────────────────────────────────────────────

function extractOlympics() {
  console.log('\nExtracting Olympics data…');

  // These are already external CSV files in the project
  const csvFiles = [
    { file: 'SummerSD.csv', out: 'olympics-summer.json', headers: ['city','year','sport','discipline','event','athlete','gender','country','event_gender','medal'] },
    { file: 'WinterSD.csv', out: 'olympics-winter.json', headers: ['city','year','sport','discipline','event','athlete','gender','country','event_gender','medal'] },
    { file: 'CountriesSD.csv', out: 'olympics-countries.json', headers: ['year','country','gold','silver','bronze','total','season'] },
    { file: 'olympic_medals.csv', out: 'olympics-medals.json', headers: ['rank','country','code','gold','silver','bronze','total'] },
  ];

  for (const { file, out, headers } of csvFiles) {
    const csvPath = path.join(SRC, file);
    if (!fs.existsSync(csvPath)) { console.log(`  ℹ ${file} not found — skipping`); continue; }
    const raw = fs.readFileSync(csvPath, 'utf8');
    const rows = raw.split('\n').filter(l => l.trim());
    // Auto-detect if first row is a header
    const firstCols = rows[0].split(',').length;
    const hasHeader = isNaN(rows[0].split(',')[0]) && rows[0].split(',')[0].length < 20;
    const dataRows = hasHeader ? rows.slice(1) : rows;
    const h = hasHeader ? rows[0].split(',').map(c => c.trim().toLowerCase().replace(/\s+/g,'_')) : headers;
    const data = dataRows.filter(l => l.trim()).map(line => {
      const cols = line.split(',');
      const obj = {};
      h.forEach((hh, i) => { obj[hh] = cols[i] !== undefined ? cols[i].trim() : ''; });
      return obj;
    });
    write(out, data);
  }

  // Also extract from olympics-analytics.jsx src if needed
  const olSrc = fs.readFileSync(path.join(SRC, 'olympics-analytics.jsx'), 'utf8');

  // OL_FOCUS_NATIONS and OL_COLORS are small enough to keep in-source
  // but extract any large data arrays
  const dataVars = ['OLYMPICS_RESULTS_RAW', 'ATHLETE_DATA_RAW'];
  for (const v of dataVars) {
    try {
      const raw = extractVar(olSrc, v);
      const rows = parseCSV(raw, ['year','season','city','sport','event','athlete','country','gender','medal']);
      write(`olympics-${v.toLowerCase().replace('_raw','').replace('olympics_','')}.json`, rows);
    } catch { /* not present */ }
  }
}

// ── Copy remaining CSV to data-sources ───────────────────────────────────────

function copySourceFiles() {
  console.log('\nCopying source CSVs to data-sources/…');
  const copies = [
    ['all_matches.csv', '../data-sources/rugby/all-matches.csv'],
    ['rugby_results.csv', '../data-sources/rugby/results.csv'],
    ['rugby_six_nations.csv', '../data-sources/rugby/six-nations.csv'],
    ['clean_iaaf_record.csv', '../data-sources/athletics/iaaf-records.csv'],
    ['SummerSD.csv', '../data-sources/olympics/summer.csv'],
    ['WinterSD.csv', '../data-sources/olympics/winter.csv'],
    ['CountriesSD.csv', '../data-sources/olympics/countries.csv'],
  ];
  for (const [src, dest] of copies) {
    const srcPath = path.join(SRC, src);
    const destPath = path.resolve(__dirname, dest);
    if (fs.existsSync(srcPath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied ${src}`);
    }
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────

console.log('StatNations — Data Extraction Script');
console.log('=====================================');

try { extractRugby(); } catch (e) { console.error('Rugby extraction failed:', e.message); }
try { extractFootball(); } catch (e) { console.error('Football extraction failed:', e.message); }
try { extractOlympics(); } catch (e) { console.error('Olympics extraction failed:', e.message); }
try { copySourceFiles(); } catch (e) { console.error('Copy failed:', e.message); }

console.log('\nDone. Check public/data/ for output files.\n');
