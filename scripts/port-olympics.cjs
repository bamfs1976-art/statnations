/**
 * port-olympics.cjs
 * Transforms olympics-analytics.jsx into an ES module for Vite.
 * Key changes:
 *  1. CDN React/Recharts → ES imports
 *  2. CSV fetch + parse → JSON fetch (pre-processed data)
 *  3. Template literal fix (var olCSS = `...`)
 *  4. Default export added
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../Rugby/rugby analytics/rugby-analytics-netlify/rugby-netlify/olympics-analytics.jsx');
const OUT = path.resolve(__dirname, '../src/sports/olympics/index.jsx');

let code = fs.readFileSync(SRC, 'utf8');

// ── 1. Build ES import header ──────────────────────────────────────────────
const reactMatch = code.match(/var\s*\{([^}]+)\}\s*=\s*React/);
const reactImports = reactMatch
  ? reactMatch[1].split(',').map(s => s.trim()).filter(Boolean).join(', ')
  : 'useState, useMemo, useEffect, useCallback';

const rechartsMatch = code.match(/var\s*\{([^}]+)\}\s*=\s*Recharts/);
const rechartsImports = rechartsMatch
  ? rechartsMatch[1].split(',').map(s => s.trim()).filter(Boolean).join(', ')
  : 'BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart';

// ── 2. Remove CDN destructures ─────────────────────────────────────────────
code = code.replace(/var\s*\{[^}]+\}\s*=\s*React\s*;\s*\n/, '');
code = code.replace(/var\s*\{[^}]+\}\s*=\s*Recharts\s*;\s*\n/, '');

// ── 3. Replace CSV fetches with JSON fetches ───────────────────────────────
// Find the loadData function block (from line ~1770 to ~2001)
const OLD_LOAD_START = `  // Fetch CSVs
  useEffect(function() {
    async function loadData() {
      try {
        setLoadProgress("Downloading Olympic datasets...");
        var responses = await Promise.all([
          fetch("SummerSD.csv"),
          fetch("WinterSD.csv"),
          fetch("CountriesSD.csv"),
          fetch("clean_iaaf_record.csv"),
          fetch("olympic_medals.csv"),
          fetch("olympics_athletes_dataset.csv")
        ]);`;

if (!code.includes(OLD_LOAD_START)) {
  console.error('Could not find CSV fetch block — check source format');
  process.exit(1);
}

// Find the end of this useEffect block by searching for the closing pattern after loadData()
// The block ends with:   loadData();\n  }, []);
const loadStart = code.indexOf(OLD_LOAD_START);
const blockEnd = code.indexOf('    loadData();\n  }, []);', loadStart);
if (blockEnd === -1) { console.error('Could not find end of loadData useEffect'); process.exit(1); }
const blockEndIdx = blockEnd + '    loadData();\n  }, []);'.length;

const NEW_LOAD = `  // Fetch pre-processed JSON files (replaces CSV parsing)
  useEffect(function() {
    async function loadData() {
      try {
        setLoadProgress("Loading Olympic JSON data...");
        var [summerRes, winterRes, countriesRes, iaafRes, olMedalsRes, athletesRes] = await Promise.all([
          fetch("/data/olympics-summer.json"),
          fetch("/data/olympics-winter.json"),
          fetch("/data/olympics-countries.json"),
          fetch("/data/athletics-records.json"),
          fetch("/data/olympics-medal-summary.json"),
          fetch("/data/olympics-athletes.json")
        ]);

        if (!summerRes.ok) throw new Error("Failed to load olympics-summer.json: " + summerRes.status);
        if (!winterRes.ok) throw new Error("Failed to load olympics-winter.json: " + winterRes.status);

        setLoadProgress("Parsing Olympic data...");
        var [summerData, winterData, countriesData, iaafData, olMedalsData, athletesData] = await Promise.all([
          summerRes.json(),
          winterRes.json(),
          countriesRes.json(),
          iaafRes.ok ? iaafRes.json() : Promise.resolve([]),
          olMedalsRes.ok ? olMedalsRes.json() : Promise.resolve([]),
          athletesRes.ok ? athletesRes.json() : Promise.resolve([])
        ]);

        // Build countries map: code → country name
        var cMap = {};
        var cData = [];
        (countriesData || []).forEach(function(row) {
          var country = row.country || row.NOC_country || '';
          var code = row.code || row.NOC || '';
          var population = row.population || '';
          var gdp = row.gdp || '';
          if (code && country) {
            cMap[code] = country;
            cData.push({country:country, code:code, population:population, gdp:gdp});
          }
        });
        setCountriesMap(cMap);
        setCountryData(cData);

        // Normalise Summer medals
        var summerParsed = (summerData || []).filter(function(r) {
          return r.medal && r.medal !== 'NA' && r.medal !== '';
        }).map(function(r) {
          var year = parseInt(r.year || r.Year);
          var city = r.city || r.City || '';
          var sport = r.sport || r.Sport || '';
          var discipline = r.discipline || r.Discipline || '';
          var athlete = r.athlete || r.Athlete || '';
          var code = r.code || r.Code || r.NOC || '';
          var gender = r.gender || r.Gender || '';
          var event = r.event || r.Event || '';
          var medal = (r.medal || r.Medal || '').trim();
          var country = r.country || r.Country || cMap[code] || code;
          return {year,city,sport,discipline,athlete,code,gender,event,medal,country,season:'Summer'};
        });
        setSummerMedals(summerParsed);

        // Normalise Winter medals
        var winterParsed = (winterData || []).filter(function(r) {
          return r.medal && r.medal !== 'NA' && r.medal !== '';
        }).map(function(r) {
          var year = parseInt(r.year || r.Year);
          var city = r.city || r.City || '';
          var sport = r.sport || r.Sport || '';
          var discipline = r.discipline || r.Discipline || '';
          var athlete = r.athlete || r.Athlete || '';
          var code = r.code || r.Code || r.NOC || '';
          var gender = r.gender || r.Gender || '';
          var event = r.event || r.Event || '';
          var medal = (r.medal || r.Medal || '').trim();
          var country = r.country || r.Country || cMap[code] || code;
          return {year,city,sport,discipline,athlete,code,gender,event,medal,country,season:'Winter'};
        });
        setWinterMedals(winterParsed);

        // IAAF athletics records
        setIaafRecords(iaafData || []);

        // Olympic medals summary
        setOlympicMedals(olMedalsData || []);

        // Athletes dataset
        setAthletes(athletesData || []);

        setLoadProgress("Done");
        setLoading(false);
      } catch(e) {
        console.error("Olympics data load error:", e);
        setError(e.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);`;

code = code.slice(0, loadStart) + NEW_LOAD + code.slice(blockEndIdx);
console.log('✓ Replaced CSV fetch/parse with JSON fetch');

// ── 4. Add default export ───────────────────────────────────────────────────
if (!code.includes('export default')) {
  code = code.trimEnd() + '\n\nexport default OlympicsStatNations;\n';
  console.log('✓ Added default export');
}

// ── 5. Build final file ────────────────────────────────────────────────────
const header = `import { ${reactImports} } from 'react';
import { ${rechartsImports} } from 'recharts';

`;

const final = header + code;
fs.writeFileSync(OUT, final, 'utf8');
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`\n✓ Written src/sports/olympics/index.jsx — ${kb} KB`);
