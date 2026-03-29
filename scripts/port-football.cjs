/**
 * port-football.cjs
 * Transforms football-analytics.jsx into an ES module for Vite.
 * Key changes:
 *  1. CDN React/Recharts → ES imports
 *  2. fetch("all_matches.csv") → fetch("/data/football-all.json")
 *  3. CSV parsing removed — JSON already parsed
 *  4. Default export added
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../Rugby/rugby analytics/rugby-analytics-netlify/rugby-netlify/football-analytics.jsx');
const OUT = path.resolve(__dirname, '../src/sports/football/index.jsx');

let code = fs.readFileSync(SRC, 'utf8');

// ── 1. Build header with proper ES imports ─────────────────────────────────
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

// ── 3. Replace CSV fetch with JSON fetch and simplify loading ──────────────
// Replace the entire async loadData function with a JSON-based one
const OLD_LOAD = `  // Fetch CSVs
  useEffect(function(){
    async function loadData() {
      try {
        var responses = await Promise.all([
          fetch("all_matches.csv"),
          fetch("countries_names.csv")
        ]);
        var matchRes = responses[0];
        var nameRes = responses[1];
        if(!matchRes.ok) throw new Error("Failed to load all_matches.csv");

        // Stream match data with progress
        var matchText;
        if(matchRes.body && matchRes.body.getReader) {
          var contentLength = +matchRes.headers.get('Content-Length') || 0;
          var reader = matchRes.body.getReader();
          var decoder = new TextDecoder();
          var chunks = []; var received = 0;
          while(true) {
            var chunk = await reader.read();
            if(chunk.done) break;
            chunks.push(chunk.value);
            received += chunk.value.length;
            var mb = (received/1024/1024).toFixed(1);
            setLoadProgress(contentLength
              ? mb + " / " + (contentLength/1024/1024).toFixed(1) + " MB"
              : mb + " MB downloaded");
          }
          matchText = chunks.map(function(c){return decoder.decode(c,{stream:true});}).join("") + decoder.decode();
        } else {
          matchText = await matchRes.text();
        }
        setLoadProgress("Parsing " + (matchText.split("\\n").length - 1).toLocaleString() + " matches...");
        var nameText = await nameRes.text();

        // Parse name map
        var nm = {};
        nameText.split("\\n").slice(1).forEach(function(line){
          var cols = line.split(",");
          if(cols.length>=2 && cols[0].trim() && cols[1].trim()) {
            nm[cols[0].trim()] = cols[1].trim();
          }
        });
        setNameMap(nm);

        // Parse matches
        var lines = matchText.split("\\n").slice(1);
        var parsed = [];
        lines.forEach(function(line){
          if(!line.trim()) return;
          var cols = line.split(",");
          if(cols.length<6) return;
          var date = cols[0].trim();
          var home_team = cols[1].trim();
          var away_team = cols[2].trim();
          var home_score = parseInt(cols[3]);
          var away_score = parseInt(cols[4]);
          var tournament = cols[5].trim();
          var country = cols[6] ? cols[6].trim() : "";
          var neutral = cols[7] ? cols[7].trim()==="True" : false;

          // Normalize team names
          if(nm[home_team]) home_team = nm[home_team];
          if(nm[away_team]) away_team = nm[away_team];
          // Keep West/East Germany as distinct for historical accuracy (pre-1990)

          if(!isNaN(home_score) && !isNaN(away_score)) {
            parsed.push({date:date,home_team:home_team,away_team:away_team,home_score:home_score,away_score:away_score,tournament:tournament,country:country,neutral:neutral});
          }
        });

        parsed.sort(function(a,b){return a.date.localeCompare(b.date);});
        setMatches(parsed);
        setLoading(false);
      } catch(e) {
        console.error("Football data load error:",e);
        setError(e.message);
        setLoading(false);
      }
    }
    loadData();
  },[]);`;

const NEW_LOAD = `  // Fetch pre-processed JSON (replaces CSV parsing)
  useEffect(function(){
    async function loadData() {
      try {
        setLoadProgress("Fetching match data...");
        var [matchRes, nameRes] = await Promise.all([
          fetch("/data/football-all.json"),
          fetch("/data/football-countries.json")
        ]);
        if(!matchRes.ok) throw new Error("Failed to load football-all.json: " + matchRes.status);

        setLoadProgress("Parsing JSON...");
        var [matchData, nameData] = await Promise.all([matchRes.json(), nameRes.json()]);

        // Build name map from countries JSON
        var nm = {};
        (nameData || []).forEach(function(row){
          var keys = Object.keys(row);
          if(keys.length>=2 && row[keys[0]] && row[keys[1]]) {
            nm[row[keys[0]].trim()] = row[keys[1]].trim();
          }
        });
        setNameMap(nm);

        // Normalise field names and types (JSON uses snake_case from CSV headers)
        var parsed = (matchData || []).map(function(r){
          var home_team = (r.home_team || r.home || '').trim();
          var away_team = (r.away_team || r.away || '').trim();
          var home_score = parseInt(r.home_score || r.hs);
          var away_score = parseInt(r.away_score || r.as);
          var date = (r.date || '').trim();
          var tournament = (r.tournament || r.Tournament || '').trim();
          var country = (r.country || '').trim();
          var neutral = r.neutral === true || r.neutral === 'True' || r.neutral === 'true';
          if(nm[home_team]) home_team = nm[home_team];
          if(nm[away_team]) away_team = nm[away_team];
          if(!date || isNaN(home_score) || isNaN(away_score)) return null;
          return {date,home_team,away_team,home_score,away_score,tournament,country,neutral};
        }).filter(Boolean);

        parsed.sort(function(a,b){return a.date.localeCompare(b.date);});
        setMatches(parsed);
        setLoading(false);
      } catch(e) {
        console.error("Football data load error:",e);
        setError(e.message);
        setLoading(false);
      }
    }
    loadData();
  },[]);`;

if (code.includes('// Fetch CSVs')) {
  code = code.replace(OLD_LOAD, NEW_LOAD);
  console.log('✓ Replaced CSV fetch with JSON fetch');
} else {
  // If exact match fails, try a simpler replacement
  code = code.replace(
    /\/\/ Fetch CSVs[\s\S]*?loadData\(\);\s*\}\s*,\s*\[\]\);/,
    NEW_LOAD
  );
  console.log('✓ Replaced CSV fetch (fallback match)');
}

// ── 4. Add default export ───────────────────────────────────────────────────
if (!code.includes('export default')) {
  code = code.trimEnd() + '\n\nexport default FootballStatNations;\n';
  console.log('✓ Added default export');
}

// ── 5. Build final file ────────────────────────────────────────────────────
const header = `import { ${reactImports} } from 'react';
import { ${rechartsImports} } from 'recharts';

`;

const final = header + code;
fs.writeFileSync(OUT, final, 'utf8');
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`\n✓ Written src/sports/football/index.jsx — ${kb} KB`);
