/**
 * port-rugby.cjs
 * Extracts the component code from rugby-analytics.jsx (lines after inline data)
 * and transforms it into a proper ES module for the Vite project.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../../Rugby/rugby analytics/rugby-analytics-netlify/rugby-netlify/rugby-analytics.jsx');
const OUT = path.resolve(__dirname, '../src/sports/rugby/index.jsx');

const raw = fs.readFileSync(SRC, 'utf8');
const lines = raw.split('\n');

// Find where the component code starts (after all raw data strings)
// The parse functions start around the last `var ... = \`` block + a few blank lines
// We look for "function parseSN" which is the first real code
const startLine = lines.findIndex(l => l.startsWith('function parseSN(raw)'));
if (startLine === -1) { console.error('Could not find parseSN'); process.exit(1); }
console.log(`Component code starts at line ${startLine + 1}`);

// Extract everything from parseSN onwards
let componentCode = lines.slice(startLine).join('\n');

// ── Recharts imports list ─────────────────────────────────────────────────────
// Scan the original file top for Recharts destructure
const rechartsMatch = raw.match(/var\s*\{([^}]+)\}\s*=\s*Recharts/);
const rechartsImports = rechartsMatch
  ? rechartsMatch[1].split(',').map(s => s.trim()).filter(Boolean).join(', ')
  : 'BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis';

// ── Transformations ───────────────────────────────────────────────────────────

// 1. Remove the parse functions (no longer needed — data comes pre-parsed from JSON)
componentCode = componentCode
  .replace(/function parseSN\(raw\)\s*\{[\s\S]*?\}\n/, '')
  .replace(/function parseR\(raw\)\s*\{[\s\S]*?\}\n/, '')
  .replace(/function parseWC\(raw\)\s*\{[\s\S]*?\}\n/, '')
  .replace(/function parseFN\(raw\)\s*\{[\s\S]*?\}\n/, '')
  .replace(/function parseRB\(raw\)\s*\{[\s\S]*?\}\n/, '')
  .replace(/function parseRBR\(raw\)\s*\{[\s\S]*?\}\n/, '');

// 2. Remove the globalCSS <style> injection (we use tokens.css via App)
// Keep the CSS string definition but note it's still used via <style>{globalCSS}</style> in the component

// 3. In RugbyStatNations, replace synchronous data loading with async hooks
// Replace:
//   const sn = useMemo(()=>parseSN(SIX_NATIONS_RAW),[]);
//   const intl = useMemo(()=>parseR(RESULTS_RAW),[]);
//   ...etc
const OLD_DATA_LOAD = `function RugbyStatNations() {
  const sn = useMemo(()=>parseSN(SIX_NATIONS_RAW),[]);
  const intl = useMemo(()=>parseR(RESULTS_RAW),[]);
  const wc = useMemo(()=>parseWC(WORLD_CUP_RAW),[]);
  const fn = useMemo(()=>parseFN(FIVE_NATIONS_RAW),[]);
  const rb = useMemo(()=>parseRB(RAEBURN_RAW),[]);
  const rbr = useMemo(()=>parseRBR(RAEBURN_RESULTS_RAW),[]);`;

const NEW_DATA_LOAD = `function RugbyStatNations() {
  // ── Async data loading via fetch (replaces inline CSV strings) ──────────────
  const { data: snRaw, loading: snLoading } = useData('rugby-sixnations.json');
  const { data: intlRaw, loading: intlLoading } = useData('rugby-intl.json');
  const { data: wcRaw, loading: wcLoading } = useData('rugby-worldcup.json');
  const { data: fnRaw } = useData('rugby-fivenations.json');
  const { data: rbRaw } = useData('rugby-raeburn.json');
  const { data: rbrRaw } = useData('rugby-raeburn-results.json');

  // Normalise types (JSON values are strings, component expects numbers)
  const sn = useMemo(() => (snRaw || []).map(r => ({
    ...r, year: +r.year, hb: +r.hb, ab: +r.ab, hs: +r.hs, as: +r.as,
  })), [snRaw]);
  const intl = useMemo(() => (intlRaw || []).map(r => ({
    ...r, hs: r.hs !== null && r.hs !== undefined ? +r.hs : null,
          as: r.as !== null && r.as !== undefined ? +r.as : null,
  })), [intlRaw]);
  const wc = useMemo(() => (wcRaw || []).map(r => ({
    ...r, year: +r.year, hs: r.hs !== null && r.hs !== '' ? +r.hs : null,
                         as: r.as !== null && r.as !== '' ? +r.as : null,
  })), [wcRaw]);
  const fn = useMemo(() => (fnRaw || []).map(r => ({
    ...r, year: +r.year, hs: +r.hs, as: +r.as,
  })), [fnRaw]);
  const rb = useMemo(() => rbRaw || [], [rbRaw]);
  const rbr = useMemo(() => (rbrRaw || []).map(r => ({
    ...r, hs: +r.hs, as: +r.as, run: +r.run,
  })), [rbrRaw]);

  // Loading state — show skeleton while critical data loads
  if (snLoading || intlLoading || wcLoading) {
    return (
      <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:16}}>🏉</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:'var(--fs-lg)',color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Loading Rugby Data…</div>
        </div>
      </div>
    );
  }`;

if (componentCode.includes('const sn = useMemo(()=>parseSN(SIX_NATIONS_RAW)')) {
  componentCode = componentCode.replace(OLD_DATA_LOAD, NEW_DATA_LOAD);
  console.log('✓ Replaced data loading with async hooks');
} else {
  console.error('⚠ Could not find data loading block — check source format');
}

// 4. Add the default export at the end
if (!componentCode.includes('export default')) {
  componentCode = componentCode.trimEnd() + '\n\nexport default RugbyStatNations;\n';
  console.log('✓ Added default export');
}

// ── Build the final file ──────────────────────────────────────────────────────
const header = `import { useState, useMemo, useEffect } from 'react';
import { ${rechartsImports} } from 'recharts';
import { useData } from '../../lib/useData.js';

`;

const final = header + componentCode;
fs.writeFileSync(OUT, final, 'utf8');
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`\n✓ Written src/sports/rugby/index.jsx — ${kb} KB`);
console.log('  Run: cd statnations && npm run dev  to test');
