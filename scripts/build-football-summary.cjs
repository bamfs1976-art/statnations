/**
 * build-football-summary.cjs
 *
 * The football overview only needs aggregates, the last few results and the UFWC
 * lineage — but it was waiting on the full 7.5 MB match archive before it could
 * paint anything, which is what dragged Largest Contentful Paint past six seconds.
 *
 * This precomputes everything the overview shows into a ~40 KB file. The full
 * archive is still fetched, but in the background, and only the views that need
 * match-level data wait for it.
 *
 * Run: node scripts/build-football-summary.cjs  (or npm run build:summary)
 */

const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '../public/data');
const matches = JSON.parse(fs.readFileSync(path.join(DATA, 'football-all.json'), 'utf8'));
const countries = JSON.parse(fs.readFileSync(path.join(DATA, 'football-countries.json'), 'utf8'));

// Same name normalisation the app applies at runtime
const nameMap = {};
countries.forEach(row => {
  const keys = Object.keys(row);
  if (keys.length >= 2 && row[keys[0]] && row[keys[1]]) nameMap[String(row[keys[0]]).trim()] = String(row[keys[1]]).trim();
});
const canon = n => nameMap[n] || n;

const parsed = matches.map(r => {
  const home = canon((r.home_team || r.home || '').trim());
  const away = canon((r.away_team || r.away || '').trim());
  const hs = parseInt(r.home_score ?? r.hs, 10);
  const as = parseInt(r.away_score ?? r.as, 10);
  const date = (r.date || '').trim();
  if (!date || isNaN(hs) || isNaN(as)) return null;
  return { date, home_team: home, away_team: away, home_score: hs, away_score: as, tournament: (r.tournament || '').trim() };
}).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date));

const isWorldCup = t => t === 'World Cup' || t === 'FIFA World Cup';

// ── Aggregates ───────────────────────────────────────────────────────────────
const nations = new Set();
const tournaments = new Set();
const decades = {};
const perYear = {};
let goals = 0, wcMatches = 0;

parsed.forEach(m => {
  nations.add(m.home_team); nations.add(m.away_team);
  tournaments.add(m.tournament);
  goals += m.home_score + m.away_score;
  if (isWorldCup(m.tournament)) wcMatches++;

  const year = parseInt(m.date.slice(0, 4), 10);
  if (!isNaN(year)) {
    const d = Math.floor(year / 10) * 10;
    decades[d] = decades[d] || { decadeStart: d, decade: d + 's', goals: 0, matches: 0 };
    decades[d].goals += m.home_score + m.away_score;
    decades[d].matches++;
    perYear[year] = (perYear[year] || 0) + 1;
  }
});

const decadeData = Object.values(decades)
  .sort((a, b) => a.decadeStart - b.decadeStart)
  .map(d => ({ ...d, perMatch: d.matches ? +(d.goals / d.matches).toFixed(2) : 0 }));

// ── World Cup appearances (honours themselves live in the module) ───────────
const appearances = {};
parsed.forEach(m => {
  if (!isWorldCup(m.tournament)) return;
  const yr = m.date.slice(0, 4);
  [m.home_team, m.away_team].forEach(t => {
    appearances[t] = appearances[t] || new Set();
    appearances[t].add(yr);
  });
});
const appearanceCounts = Object.fromEntries(Object.entries(appearances).map(([t, s]) => [t, s.size]));

// ── UFWC lineage ─────────────────────────────────────────────────────────────
let holder = 'Scotland';
let titleMatches = 0, defences = 0;
const changes = [];
parsed.forEach(m => {
  const homeIsHolder = m.home_team === holder;
  const awayIsHolder = m.away_team === holder;
  if (!homeIsHolder && !awayIsHolder) return;
  titleMatches++;
  const challenger = homeIsHolder ? m.away_team : m.home_team;
  const holderScored = homeIsHolder ? m.home_score : m.away_score;
  const challengerScored = homeIsHolder ? m.away_score : m.home_score;
  if (holderScored >= challengerScored) { defences++; return; }
  changes.push({ date: m.date, holder, challenger, holderScore: holderScored, challengerScore: challengerScored });
  holder = challenger;
  defences = 0;
});

const summary = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: {
    matches: parsed.length,
    goals,
    avgGoals: +(goals / parsed.length).toFixed(2),
    nations: nations.size,
    tournaments: tournaments.size,
    wcMatches,
  },
  perYear,
  decades: decadeData,
  wcAppearances: appearanceCounts,
  ufwc: { holder, defences, titleMatches, changes: changes.slice(-5).reverse() },
  recent: parsed.slice(-60).reverse(),
  nationList: [...nations].sort(),
};

const out = path.join(DATA, 'football-summary.json');
fs.writeFileSync(out, JSON.stringify(summary));
console.log(`  ✓  football-summary.json  ${(fs.statSync(out).size / 1024).toFixed(1)} KB  (from ${(fs.statSync(path.join(DATA, 'football-all.json')).size / 1024 / 1024).toFixed(1)} MB)`);
