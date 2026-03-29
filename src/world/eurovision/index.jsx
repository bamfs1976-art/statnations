import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

const ACCENT = '#ec4899';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURF2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const WINNERS = [
  {year:1956,country:'Switzerland',artist:'Lys Assia',song:'Refrain',points:null,host:'Lugano'},
  {year:1957,country:'Netherlands',artist:'Corry Brokken',song:'Net Als Toen',points:null,host:'Frankfurt'},
  {year:1958,country:'France',artist:'André Claveau',song:'Dors, Mon Amour',points:null,host:'Hilversum'},
  {year:1959,country:'Netherlands',artist:'Teddy Scholten',song:"'n Beetje",points:null,host:'Cannes'},
  {year:1960,country:'France',artist:'Jacqueline Boyer',song:'Tom Pillibi',points:null,host:'London'},
  {year:1961,country:'Luxembourg',artist:'Jean-Claude Pascal',song:'Nous les amoureux',points:null,host:'Cannes'},
  {year:1962,country:'France',artist:'Isabelle Aubret',song:'Un premier amour',points:null,host:'Luxembourg'},
  {year:1963,country:'Denmark',artist:'Grethe & Jørgen Ingmann',song:'Dansevise',points:null,host:'London'},
  {year:1964,country:'Italy',artist:'Gigliola Cinquetti',song:"Non ho l'età",points:null,host:'Copenhagen'},
  {year:1965,country:'Luxembourg',artist:'France Gall',song:'Poupée de cire, poupée de son',points:null,host:'Naples'},
  {year:1966,country:'Austria',artist:'Udo Jürgens',song:'Merci Chérie',points:null,host:'Luxembourg'},
  {year:1967,country:'UK',artist:'Sandie Shaw',song:'Puppet on a String',points:null,host:'Vienna'},
  {year:1968,country:'Spain',artist:'Massiel',song:'La, la, la',points:null,host:'London'},
  {year:1970,country:'Ireland',artist:'Dana',song:'All Kinds of Everything',points:null,host:'Amsterdam'},
  {year:1971,country:'Monaco',artist:'Séverine',song:'Un banc, un arbre, une rue',points:null,host:'Dublin'},
  {year:1972,country:'Luxembourg',artist:'Vicky Leandros',song:'Après toi',points:null,host:'Edinburgh'},
  {year:1973,country:'Luxembourg',artist:'Anne-Marie David',song:'Tu te reconnaîtras',points:null,host:'Luxembourg'},
  {year:1974,country:'Sweden',artist:'ABBA',song:'Waterloo',points:null,host:'Brighton'},
  {year:1975,country:'Netherlands',artist:'Teach-In',song:'Ding-A-Dong',points:null,host:'Stockholm'},
  {year:1976,country:'UK',artist:'Brotherhood of Man',song:'Save Your Kisses for Me',points:null,host:'The Hague'},
  {year:1977,country:'France',artist:'Marie Myriam',song:"L'Oiseau et l'Enfant",points:null,host:'London'},
  {year:1978,country:'Israel',artist:'Izhar Cohen',song:'A-Ba-Ni-Bi',points:null,host:'Paris'},
  {year:1979,country:'Israel',artist:'Milk and Honey',song:'Hallelujah',points:null,host:'Jerusalem'},
  {year:1980,country:'Ireland',artist:'Johnny Logan',song:"What's Another Year",points:null,host:'The Hague'},
  {year:1981,country:'UK',artist:'Bucks Fizz',song:'Making Your Mind Up',points:null,host:'Dublin'},
  {year:1982,country:'Germany',artist:'Nicole',song:'Ein bißchen Frieden',points:null,host:'Harrogate'},
  {year:1983,country:'Luxembourg',artist:'Corinne Hermès',song:'Si la vie est cadeau',points:null,host:'Munich'},
  {year:1984,country:'Sweden',artist:'Herreys',song:'Diggiloo Diggiley',points:null,host:'Luxembourg'},
  {year:1985,country:'Norway',artist:'Bobbysocks!',song:'La det swinge',points:null,host:'Gothenburg'},
  {year:1986,country:'Belgium',artist:'Sandra Kim',song:"J'aime la vie",points:null,host:'Bergen'},
  {year:1987,country:'Ireland',artist:'Johnny Logan',song:'Hold Me Now',points:null,host:'Brussels'},
  {year:1988,country:'Switzerland',artist:'Celine Dion',song:'Ne partez pas sans moi',points:null,host:'Dublin'},
  {year:1989,country:'Yugoslavia',artist:'Riva',song:'Rock Me',points:null,host:'Lausanne'},
  {year:1990,country:'Italy',artist:'Toto Cutugno',song:'Insieme: 1992',points:null,host:'Zagreb'},
  {year:1991,country:'Sweden',artist:'Carola',song:'Fångad av en stormvind',points:null,host:'Rome'},
  {year:1992,country:'Ireland',artist:'Linda Martin',song:'Why Me',points:null,host:'Malmö'},
  {year:1993,country:'Ireland',artist:'Niamh Kavanagh',song:'In Your Eyes',points:null,host:'Millstreet'},
  {year:1994,country:'Ireland',artist:'Paul Harrington',song:"Rock 'n' Roll Kids",points:null,host:'Dublin'},
  {year:1995,country:'Norway',artist:'Secret Garden',song:'Nocturne',points:null,host:'Dublin'},
  {year:1996,country:'Ireland',artist:'Eimear Quinn',song:'The Voice',points:null,host:'Oslo'},
  {year:1997,country:'UK',artist:'Katrina and the Waves',song:'Love Shine a Light',points:null,host:'Dublin'},
  {year:1998,country:'Israel',artist:'Dana International',song:'Diva',points:null,host:'Birmingham'},
  {year:1999,country:'Sweden',artist:'Charlotte Nilsson',song:'Take Me to Your Heaven',points:null,host:'Jerusalem'},
  {year:2000,country:'Denmark',artist:'Olsen Brothers',song:'Fly on the Wings of Love',points:null,host:'Stockholm'},
  {year:2001,country:'Estonia',artist:'Tanel Padar',song:'Everybody',points:null,host:'Copenhagen'},
  {year:2002,country:'Latvia',artist:'Marie N',song:'I Wanna',points:null,host:'Tallinn'},
  {year:2003,country:'Turkey',artist:'Sertab Erener',song:'Every Way That I Can',points:null,host:'Riga'},
  {year:2004,country:'Ukraine',artist:'Ruslana',song:'Wild Dances',points:null,host:'Istanbul'},
  {year:2005,country:'Greece',artist:'Elena Paparizou',song:'My Number One',points:230,host:'Kiev'},
  {year:2006,country:'Finland',artist:'Lordi',song:'Hard Rock Hallelujah',points:292,host:'Athens'},
  {year:2007,country:'Serbia',artist:'Marija Šerifović',song:'Molitva',points:268,host:'Helsinki'},
  {year:2008,country:'Russia',artist:'Dima Bilan',song:'Believe',points:272,host:'Belgrade'},
  {year:2009,country:'Norway',artist:'Alexander Rybak',song:'Fairytale',points:387,host:'Moscow'},
  {year:2010,country:'Germany',artist:'Lena',song:'Satellite',points:246,host:'Oslo'},
  {year:2011,country:'Azerbaijan',artist:'Ell & Nikki',song:'Running Scared',points:221,host:'Düsseldorf'},
  {year:2012,country:'Sweden',artist:'Loreen',song:'Euphoria',points:372,host:'Baku'},
  {year:2013,country:'Denmark',artist:'Emmelie de Forest',song:'Only Teardrops',points:281,host:'Malmö'},
  {year:2014,country:'Austria',artist:'Conchita Wurst',song:'Rise Like a Phoenix',points:290,host:'Copenhagen'},
  {year:2015,country:'Sweden',artist:'Måns Zelmerlöw',song:'Heroes',points:365,host:'Vienna'},
  {year:2016,country:'Ukraine',artist:'Jamala',song:'1944',points:534,host:'Stockholm'},
  {year:2017,country:'Portugal',artist:'Salvador Sobral',song:'Amar Pelos Dois',points:758,host:'Kiev'},
  {year:2018,country:'Israel',artist:'Netta',song:'TOY',points:529,host:'Lisbon'},
  {year:2019,country:'Netherlands',artist:'Duncan Laurence',song:'Arcade',points:498,host:'Tel Aviv'},
  {year:2021,country:'Italy',artist:'Måneskin',song:'Zitti e buoni',points:524,host:'Rotterdam'},
  {year:2022,country:'Ukraine',artist:'Kalush Orchestra',song:'Stefania',points:631,host:'Turin'},
  {year:2023,country:'Sweden',artist:'Loreen',song:'Tattoo',points:583,host:'Liverpool'},
  {year:2024,country:'Switzerland',artist:'Nemo',song:'The Code',points:591,host:'Malmö'},
];

const HOSTING_CITIES = [
  {city:'Dublin',country:'Ireland',times:7,years:'1971,1981,1988,1993,1994,1995,1997'},
  {city:'London',country:'UK',times:4,years:'1960,1963,1968,1977'},
  {city:'Luxembourg',country:'Luxembourg',times:3,years:'1962,1966,1973'},
  {city:'Malmö',country:'Sweden',times:3,years:'1992,2013,2024'},
  {city:'Stockholm',country:'Sweden',times:3,years:'1975,2000,2016'},
  {city:'Oslo',country:'Norway',times:3,years:'1986,1996,2010'},
  {city:'Tel Aviv',country:'Israel',times:2,years:'1979,2019'},
  {city:'Paris',country:'France',times:2,years:'1959,1978'},
  {city:'Kiev/Kyiv',country:'Ukraine',times:2,years:'2005,2017'},
];

const BIG_5 = ['France','Germany','Italy','Spain','UK'];

const HISTORY_MILESTONES = [
  {year:1956,event:'First Contest',detail:'Eurovision Song Contest debuts in Lugano, Switzerland. Only 7 countries participated. Switzerland won with Lys Assia singing "Refrain".'},
  {year:1965,event:'Colour TV Era Begins',detail:'The contest began to be broadcast in colour in some countries, though full colour broadcasts came gradually through the late 1960s.'},
  {year:1969,event:'Four-Way Tie',detail:'Spain, UK, France and Netherlands all tied for first place — the only four-way tie in contest history. No tiebreaker rules existed at the time.'},
  {year:1971,event:'Voting Rule Changes',detail:'A new points system was introduced giving more granular scoring. Countries awarded 1–5, 6, 7, 8, 10, and 12 points to their top 10 songs.'},
  {year:1974,event:'ABBA & Waterloo',detail:'ABBA won for Sweden with "Waterloo", launching one of the most successful pop groups in history. The contest gained massive global attention.'},
  {year:1975,event:'12-Point System',detail:'The iconic "douze points" system was fully standardised, with each country awarding 1, 2, 3, 4, 5, 6, 7, 8, 10, and 12 points.'},
  {year:1993,event:'Post-Soviet Expansion',detail:'Former Soviet and Eastern Bloc countries began entering, significantly expanding the contest. Bosnia-Herzegovina, Croatia, and Slovenia debuted.'},
  {year:1999,event:'Semi-Finals Era Begins',detail:'A relegation system was introduced to manage the growing number of countries. Weaker-performing countries had to qualify the following year.'},
  {year:2004,event:'Semi-Finals Introduced',detail:'A dedicated Semi-Final was introduced for the first time, allowing more countries to compete. The Big 5 (France, Germany, Italy, Spain, UK) plus the host received automatic qualification.'},
  {year:2008,event:'Two Semi-Finals',detail:'The contest expanded to two semi-finals to accommodate the 43 participating countries, a format that continues to this day.'},
  {year:2009,event:'Record Score',detail:'Alexander Rybak (Norway) set a record with 387 points under the old system — the highest ever at the time, with "Fairytale".'},
  {year:2013,event:'Televote + Jury Split',detail:'The 50/50 split between national juries and televote was maintained, creating more balanced results and reducing bloc-voting concerns.'},
  {year:2015,event:'Australia Joins',detail:'Australia was invited to participate as a special guest for the contest\'s 60th anniversary, and has continued to compete since 2016.'},
  {year:2016,event:'New Scoring Format',detail:'The announcement format changed: jury points and televote points announced separately, creating dramatic reveals. Ukraine\'s Jamala won with 534 points.'},
  {year:2017,event:'All-Time Points Record',detail:'Portugal\'s Salvador Sobral won with 758 points — the highest ever score under any points system in Eurovision history.'},
  {year:2020,event:'Contest Cancelled',detail:'For the first time in 64 years, the Eurovision Song Contest was cancelled due to the COVID-19 pandemic.'},
  {year:2022,event:'Ukraine Wins Amid War',detail:'Kalush Orchestra won for Ukraine with 631 points while the country was under Russian invasion. The UK hosted in 2023 on Ukraine\'s behalf.'},
  {year:2024,event:'Switzerland Wins Again',detail:'Nemo won for Switzerland with "The Code", scoring 591 points — Switzerland\'s first win since Celine Dion in 1988.'},
];

const COUNTRY_COLORS = [
  '#ec4899','#8b5cf6','#06b6d4','#10b981','#f59e0b',
  '#ef4444','#3b82f6','#a78bfa','#34d399','#fbbf24',
  '#f87171','#60a5fa','#c084fc','#4ade80','#facc15',
  '#fb923c','#38bdf8','#e879f9','#2dd4bf','#a3e635',
];

const CSS = `
  .esc-root {
    background: ${BG};
    min-height: 100vh;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: ${TEXT1};
  }
  .esc-header {
    background: linear-gradient(135deg,#1a001a 0%,#4a0048 60%,#1a001a 100%);
    padding: 48px 24px 40px;
    text-align: center;
    border-bottom: 1px solid ${BORDER};
    position: relative;
    overflow: hidden;
  }
  .esc-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .esc-header-star {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
    filter: drop-shadow(0 0 12px ${ACCENT});
  }
  .esc-header h1 {
    margin: 0 0 8px;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #fff 0%, ${ACCENT} 50%, #fff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .esc-header p {
    margin: 0;
    color: ${TEXT2};
    font-size: 1rem;
  }
  .esc-nav {
    display: flex;
    gap: 4px;
    padding: 16px 24px;
    background: ${SURFACE};
    border-bottom: 1px solid ${BORDER};
    overflow-x: auto;
    scrollbar-width: none;
  }
  .esc-nav::-webkit-scrollbar { display: none; }
  .esc-tab {
    padding: 8px 18px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: ${TEXT2};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.18s;
  }
  .esc-tab:hover {
    background: ${SURF2};
    color: ${TEXT1};
  }
  .esc-tab.active {
    background: ${ACCENT}22;
    border-color: ${ACCENT}55;
    color: ${ACCENT};
  }
  .esc-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
  }
  .esc-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${TEXT1};
    margin: 0 0 4px;
  }
  .esc-section-sub {
    font-size: 0.85rem;
    color: ${TEXT3};
    margin: 0 0 20px;
  }
  .esc-stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .esc-stat-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  .esc-stat-card .val {
    font-size: 2rem;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1;
  }
  .esc-stat-card .lbl {
    font-size: 0.78rem;
    color: ${TEXT3};
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .esc-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .esc-chart-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${TEXT2};
    margin: 0 0 16px;
  }
  .esc-table-wrap {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid ${BORDER};
  }
  .esc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  .esc-table th {
    background: ${SURF2};
    color: ${TEXT3};
    font-weight: 600;
    text-align: left;
    padding: 10px 14px;
    white-space: nowrap;
    border-bottom: 1px solid ${BORDER};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .esc-table td {
    padding: 10px 14px;
    color: ${TEXT2};
    border-bottom: 1px solid ${BORDER};
    white-space: nowrap;
  }
  .esc-table tr:last-child td { border-bottom: none; }
  .esc-table tr:hover td { background: ${SURF2}; }
  .esc-table td.bold { font-weight: 600; color: ${TEXT1}; }
  .esc-table td.accent { color: ${ACCENT}; font-weight: 700; }
  .esc-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: ${ACCENT}22;
    color: ${ACCENT};
    border: 1px solid ${ACCENT}44;
  }
  .esc-badge-blue {
    background: #3b82f622;
    color: #60a5fa;
    border-color: #3b82f644;
  }
  .esc-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }
  .esc-input {
    background: ${SURF2};
    border: 1px solid ${BORDER};
    border-radius: 8px;
    color: ${TEXT1};
    padding: 8px 14px;
    font-size: 0.875rem;
    outline: none;
    min-width: 220px;
    transition: border-color 0.18s;
  }
  .esc-input::placeholder { color: ${TEXT3}; }
  .esc-input:focus { border-color: ${ACCENT}88; }
  .esc-select {
    background: ${SURF2};
    border: 1px solid ${BORDER};
    border-radius: 8px;
    color: ${TEXT1};
    padding: 8px 14px;
    font-size: 0.875rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s;
  }
  .esc-select:focus { border-color: ${ACCENT}88; }
  .esc-select option { background: ${SURF2}; }
  .esc-note {
    background: ${ACCENT}11;
    border: 1px solid ${ACCENT}33;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 0.875rem;
    color: ${TEXT2};
    margin-bottom: 24px;
    line-height: 1.6;
  }
  .esc-note strong { color: ${ACCENT}; }
  .esc-grid2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }
  .esc-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .esc-milestone {
    display: flex;
    gap: 20px;
    position: relative;
  }
  .esc-milestone-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 40px;
  }
  .esc-milestone-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${ACCENT};
    border: 2px solid ${BG};
    box-shadow: 0 0 8px ${ACCENT}88;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .esc-milestone-vert {
    width: 2px;
    flex: 1;
    background: ${BORDER};
    min-height: 20px;
  }
  .esc-milestone:last-child .esc-milestone-vert { display: none; }
  .esc-milestone-content {
    padding-bottom: 24px;
    flex: 1;
  }
  .esc-milestone-year {
    font-size: 0.78rem;
    color: ${ACCENT};
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .esc-milestone-event {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${TEXT1};
    margin: 2px 0 4px;
  }
  .esc-milestone-detail {
    font-size: 0.85rem;
    color: ${TEXT3};
    line-height: 1.55;
  }
  .esc-country-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }
  .esc-country-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 0.18s;
  }
  .esc-country-card:hover { border-color: ${ACCENT}55; }
  .esc-country-card-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${TEXT1};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .esc-country-card-wins {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${ACCENT};
  }
  .esc-country-card-meta {
    font-size: 0.78rem;
    color: ${TEXT3};
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .esc-country-card-meta span strong {
    color: ${TEXT2};
    font-weight: 600;
  }
  .esc-hosting-hero {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
    margin-bottom: 28px;
  }
  .esc-host-card {
    background: ${SURFACE};
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    transition: border-color 0.18s;
  }
  .esc-host-card:hover { border-color: ${ACCENT}55; }
  .esc-host-card-city {
    font-size: 1rem;
    font-weight: 700;
    color: ${TEXT1};
    margin-bottom: 2px;
  }
  .esc-host-card-country {
    font-size: 0.78rem;
    color: ${TEXT3};
    margin-bottom: 8px;
  }
  .esc-host-card-times {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${ACCENT};
    line-height: 1;
  }
  .esc-host-card-label {
    font-size: 0.72rem;
    color: ${TEXT3};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .esc-host-card-years {
    font-size: 0.75rem;
    color: ${TEXT2};
    margin-top: 6px;
  }
  .esc-footer {
    text-align: center;
    padding: 32px 24px;
    color: ${TEXT3};
    font-size: 0.8rem;
    border-top: 1px solid ${BORDER};
    margin-top: 16px;
  }
  @media (max-width: 600px) {
    .esc-body { padding: 20px 14px; }
    .esc-nav { padding: 12px 14px; }
    .esc-tab { padding: 7px 12px; font-size: 0.8rem; }
  }
`;

const TABS = ['Overview','Winners','Points Records','Country Stats','History','Hosting'];

const TOOLTIP_STYLE = {
  backgroundColor: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  color: TEXT1,
  fontSize: 13,
};

const DECADES = ['All','1950s','1960s','1970s','1980s','1990s','2000s','2010s','2020s'];

function decadeOf(year) {
  const d = Math.floor(year / 10) * 10;
  return `${d}s`;
}

function toTop(arr, n) {
  return [...arr].sort((a,b) => b - a).slice(0, n);
}

export default function EurovisionStatNations() {
  const [tab, setTab] = useState('Overview');
  const [winnerSearch, setWinnerSearch] = useState('');
  const [winnerDecade, setWinnerDecade] = useState('All');

  const winsByCountry = useMemo(() => {
    const map = {};
    for (const w of WINNERS) {
      map[w.country] = (map[w.country] || 0) + 1;
    }
    return map;
  }, []);

  const winsByCountrySorted = useMemo(() => {
    return Object.entries(winsByCountry)
      .map(([country, wins]) => ({ country, wins }))
      .sort((a,b) => b.wins - a.wins);
  }, [winsByCountry]);

  const winsBarchartData = useMemo(() => {
    return winsByCountrySorted.filter(d => d.wins >= 1).slice(0, 20);
  }, [winsByCountrySorted]);

  const filteredWinners = useMemo(() => {
    let list = [...WINNERS];
    if (winnerDecade !== 'All') {
      const start = parseInt(winnerDecade.replace('s',''));
      list = list.filter(w => w.year >= start && w.year < start + 10);
    }
    if (winnerSearch.trim()) {
      const q = winnerSearch.toLowerCase();
      list = list.filter(w =>
        w.country.toLowerCase().includes(q) ||
        w.artist.toLowerCase().includes(q) ||
        w.song.toLowerCase().includes(q) ||
        String(w.year).includes(q)
      );
    }
    return list;
  }, [winnerSearch, winnerDecade]);

  const pointsData = useMemo(() => {
    return WINNERS.filter(w => w.points !== null).map(w => ({
      year: w.year,
      points: w.points,
      country: w.country,
      song: w.song,
    }));
  }, []);

  const highScores = useMemo(() => {
    return [...pointsData].sort((a,b) => b.points - a.points);
  }, [pointsData]);

  const hostingByCountry = useMemo(() => {
    const map = {};
    for (const h of HOSTING_CITIES) {
      map[h.country] = (map[h.country] || 0) + h.times;
    }
    return map;
  }, []);

  const countryStats = useMemo(() => {
    const countries = [...new Set(WINNERS.map(w => w.country))].sort();
    return countries.map(c => {
      const wins = WINNERS.filter(w => w.country === c);
      const first = wins[0];
      const last = wins[wins.length - 1];
      return {
        country: c,
        wins: wins.length,
        firstWin: first.year,
        lastWin: last.year,
        firstSong: first.song,
        hosted: hostingByCountry[c] || 0,
        isBig5: BIG_5.includes(c),
      };
    }).sort((a,b) => b.wins - a.wins);
  }, [hostingByCountry]);

  const hostingChartData = useMemo(() => {
    const map = {};
    for (const h of HOSTING_CITIES) {
      map[h.country] = (map[h.country] || 0) + h.times;
    }
    return Object.entries(map)
      .map(([country, times]) => ({ country, times }))
      .sort((a,b) => b.times - a.times);
  }, []);

  const totalEditions = WINNERS.length;
  const totalCountries = Object.keys(winsByCountry).length;
  const maxWinCountry = winsByCountrySorted[0];
  const recent5 = [...WINNERS].reverse().slice(0, 5);

  return (
    <div className="esc-root">
      <style>{CSS}</style>

      <header className="esc-header">
        <span className="esc-header-star">★</span>
        <h1>Eurovision Song Contest</h1>
        <p>Statistics & Records · 1956 – 2024 · {totalEditions} Editions</p>
      </header>

      <nav className="esc-nav">
        {TABS.map(t => (
          <button
            key={t}
            className={`esc-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="esc-body">
        {tab === 'Overview' && (
          <OverviewTab
            totalEditions={totalEditions}
            totalCountries={totalCountries}
            maxWinCountry={maxWinCountry}
            recent5={recent5}
            winsBarchartData={winsBarchartData}
          />
        )}
        {tab === 'Winners' && (
          <WinnersTab
            filteredWinners={filteredWinners}
            winnerSearch={winnerSearch}
            setWinnerSearch={setWinnerSearch}
            winnerDecade={winnerDecade}
            setWinnerDecade={setWinnerDecade}
          />
        )}
        {tab === 'Points Records' && (
          <PointsTab highScores={highScores} pointsData={pointsData} />
        )}
        {tab === 'Country Stats' && (
          <CountryStatsTab countryStats={countryStats} />
        )}
        {tab === 'History' && (
          <HistoryTab />
        )}
        {tab === 'Hosting' && (
          <HostingTab hostingChartData={hostingChartData} />
        )}
      </div>

      <footer className="esc-footer">
        Eurovision Song Contest data · StatNations · Data through 2024
      </footer>
    </div>
  );
}

function OverviewTab({ totalEditions, totalCountries, maxWinCountry, recent5, winsBarchartData }) {
  const totalPoints2017 = 758;
  return (
    <>
      <p className="esc-section-sub" style={{marginBottom:20,color:TEXT2,fontSize:'0.9rem'}}>
        The Eurovision Song Contest is the world's longest-running annual international TV song competition, held since 1956.
      </p>

      <div className="esc-stats-row">
        <div className="esc-stat-card">
          <div className="val">{totalEditions}</div>
          <div className="lbl">Total Editions</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{totalCountries}</div>
          <div className="lbl">Winning Nations</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{maxWinCountry?.wins}</div>
          <div className="lbl">Most Wins ({maxWinCountry?.country})</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{totalPoints2017}</div>
          <div className="lbl">All-Time Record Pts</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">68</div>
          <div className="lbl">Countries Ever Competed</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">1956</div>
          <div className="lbl">Year Founded</div>
        </div>
      </div>

      <div className="esc-note">
        <strong>Big 5:</strong> France, Germany, Italy, Spain and the United Kingdom automatically qualify for the Grand Final each year as the largest financial contributors to the EBU, regardless of prior results.
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Wins by Country (All Time)</p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={winsBarchartData} margin={{top:4,right:8,bottom:60,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis
              dataKey="country"
              tick={{fill: TEXT3, fontSize: 11}}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{fill: TEXT3, fontSize: 12}} allowDecimals={false} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [v, 'Wins']}
            />
            <Bar dataKey="wins" radius={[4,4,0,0]}>
              {winsBarchartData.map((entry, i) => (
                <Cell key={entry.country} fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">5 Most Recent Winners</p>
        <div className="esc-table-wrap">
          <table className="esc-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Country</th>
                <th>Artist</th>
                <th>Song</th>
                <th>Points</th>
                <th>Host City</th>
              </tr>
            </thead>
            <tbody>
              {recent5.map(w => (
                <tr key={w.year}>
                  <td className="bold">{w.year}</td>
                  <td className="bold">{w.country}</td>
                  <td>{w.artist}</td>
                  <td style={{fontStyle:'italic',color:TEXT2}}>{w.song}</td>
                  <td className="accent">{w.points ?? 'N/A'}</td>
                  <td>{w.host}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function WinnersTab({ filteredWinners, winnerSearch, setWinnerSearch, winnerDecade, setWinnerDecade }) {
  return (
    <>
      <p className="esc-section-title">All Winners</p>
      <p className="esc-section-sub">Complete list of Eurovision Song Contest winners, 1956–2024</p>

      <div className="esc-controls">
        <input
          className="esc-input"
          placeholder="Search country, artist, song, year..."
          value={winnerSearch}
          onChange={e => setWinnerSearch(e.target.value)}
        />
        <select
          className="esc-select"
          value={winnerDecade}
          onChange={e => setWinnerDecade(e.target.value)}
        >
          {DECADES.map(d => (
            <option key={d} value={d}>{d === 'All' ? 'All Decades' : d}</option>
          ))}
        </select>
        <span style={{color: TEXT3, fontSize:'0.82rem'}}>
          {filteredWinners.length} result{filteredWinners.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="esc-table-wrap">
        <table className="esc-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Country</th>
              <th>Artist</th>
              <th>Song</th>
              <th>Points</th>
              <th>Host City</th>
              <th>Decade</th>
            </tr>
          </thead>
          <tbody>
            {filteredWinners.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'24px',color:TEXT3}}>No results found.</td></tr>
            ) : filteredWinners.map(w => (
              <tr key={w.year}>
                <td className="bold">{w.year}</td>
                <td className="bold">{w.country}</td>
                <td style={{color:TEXT1}}>{w.artist}</td>
                <td style={{fontStyle:'italic'}}>{w.song}</td>
                <td>
                  {w.points !== null
                    ? <span className="esc-badge">{w.points} pts</span>
                    : <span style={{color:TEXT3,fontSize:'0.8rem'}}>Pre-scoring</span>
                  }
                </td>
                <td>{w.host}</td>
                <td><span className="esc-badge-blue esc-badge">{decadeOf(w.year)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PointsTab({ highScores, pointsData }) {
  return (
    <>
      <p className="esc-section-title">Points Records</p>
      <p className="esc-section-sub">Winning scores since the modern televote era (2005+)</p>

      <div className="esc-note">
        <strong>Note:</strong> Points data is available from 2005 onwards, when score reporting became standardised in the modern era. The current all-time record is <strong>758 points</strong> by Salvador Sobral (Portugal, 2017).
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Winning Score Progression (2005–2024)</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pointsData} margin={{top:4,right:16,bottom:4,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="year" tick={{fill:TEXT3,fontSize:11}} />
            <YAxis tick={{fill:TEXT3,fontSize:12}} domain={[180, 800]} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, _, props) => [`${v} pts — ${props.payload.country}`, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke={ACCENT}
              strokeWidth={2.5}
              dot={{fill: ACCENT, r: 4, strokeWidth: 0}}
              activeDot={{r: 6}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Top 10 Highest Winning Scores</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={highScores.slice(0,10)}
            layout="vertical"
            margin={{top:4,right:40,bottom:4,left:60}}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
            <XAxis type="number" tick={{fill:TEXT3,fontSize:11}} domain={[0,800]} />
            <YAxis
              type="category"
              dataKey="country"
              tick={{fill:TEXT2,fontSize:11}}
              width={56}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v, _, props) => [`${v} pts (${props.payload.year})`, props.payload.country]}
            />
            <Bar dataKey="points" radius={[0,4,4,0]}>
              {highScores.slice(0,10).map((entry, i) => (
                <Cell key={`${entry.year}`} fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">All Scored Finals (2005–2024) — Ranked by Points</p>
        <div className="esc-table-wrap">
          <table className="esc-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Year</th>
                <th>Country</th>
                <th>Artist</th>
                <th>Song</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((w, i) => (
                <tr key={w.year}>
                  <td style={{color: i < 3 ? ACCENT : TEXT3, fontWeight: i < 3 ? 700 : 400}}>#{i+1}</td>
                  <td className="bold">{w.year}</td>
                  <td className="bold">{w.country}</td>
                  <td style={{color:TEXT1}}>{w.song.split(' ').slice(0,4).join(' ')}{w.song.split(' ').length > 4 ? '…' : ''}</td>
                  <td style={{fontStyle:'italic',fontSize:'0.82rem'}}>{w.song}</td>
                  <td className="accent">{w.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CountryStatsTab({ countryStats }) {
  const [sortBy, setSortBy] = useState('wins');

  const sorted = useMemo(() => {
    return [...countryStats].sort((a,b) => {
      if (sortBy === 'wins') return b.wins - a.wins;
      if (sortBy === 'first') return a.firstWin - b.firstWin;
      if (sortBy === 'hosted') return b.hosted - a.hosted;
      return 0;
    });
  }, [countryStats, sortBy]);

  const mostWins = countryStats[0];

  return (
    <>
      <p className="esc-section-title">Country Statistics</p>
      <p className="esc-section-sub">Per-country wins, hosting and records</p>

      <div className="esc-stats-row" style={{marginBottom:28}}>
        <div className="esc-stat-card">
          <div className="val">{countryStats.length}</div>
          <div className="lbl">Winning Countries</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{mostWins?.wins}</div>
          <div className="lbl">Record Wins ({mostWins?.country})</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{countryStats.filter(c => c.wins === 1).length}</div>
          <div className="lbl">One-Time Winners</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{countryStats.filter(c => c.isBig5).reduce((a,c) => a + c.wins, 0)}</div>
          <div className="lbl">Big 5 Total Wins</div>
        </div>
      </div>

      <div className="esc-controls">
        <label style={{color:TEXT3,fontSize:'0.85rem'}}>Sort by:</label>
        <select className="esc-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="wins">Most Wins</option>
          <option value="first">First Win (Earliest)</option>
          <option value="hosted">Most Hosted</option>
        </select>
      </div>

      <div className="esc-country-grid">
        {sorted.map(c => (
          <div key={c.country} className="esc-country-card">
            <div className="esc-country-card-name">
              <span className="esc-country-card-wins">{c.wins}</span>
              {c.country}
              {c.isBig5 && <span className="esc-badge" style={{fontSize:'0.68rem',padding:'1px 7px'}}>Big 5</span>}
            </div>
            <div className="esc-country-card-meta">
              <span><strong>First win:</strong> {c.firstWin}</span>
              <span><strong>Last win:</strong> {c.lastWin}</span>
              {c.hosted > 0 && <span><strong>Hosted:</strong> {c.hosted}×</span>}
            </div>
            <div style={{fontSize:'0.78rem',color:TEXT3,fontStyle:'italic',marginTop:2}}>
              First: "{c.firstSong}"
            </div>
          </div>
        ))}
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Countries with 3+ Wins</p>
        <div className="esc-table-wrap">
          <table className="esc-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Wins</th>
                <th>First Win</th>
                <th>Last Win</th>
                <th>Times Hosted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.filter(c => c.wins >= 3).map(c => (
                <tr key={c.country}>
                  <td className="bold">{c.country}</td>
                  <td className="accent">{c.wins}</td>
                  <td>{c.firstWin}</td>
                  <td>{c.lastWin}</td>
                  <td>{c.hosted > 0 ? c.hosted : '—'}</td>
                  <td>
                    {c.isBig5
                      ? <span className="esc-badge">Big 5</span>
                      : <span className="esc-badge-blue esc-badge">Qualifier</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function HistoryTab() {
  return (
    <>
      <p className="esc-section-title">Contest History & Milestones</p>
      <p className="esc-section-sub">Key moments and turning points from 1956 to the present day</p>

      <div className="esc-stats-row" style={{marginBottom:28}}>
        <div className="esc-stat-card">
          <div className="val">1956</div>
          <div className="lbl">Contest Founded</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">68+</div>
          <div className="lbl">Years of History</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">1</div>
          <div className="lbl">Cancellations (2020)</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">1969</div>
          <div className="lbl">Only 4-Way Tie</div>
        </div>
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Timeline of Key Milestones</p>
        <div className="esc-timeline">
          {HISTORY_MILESTONES.map(m => (
            <div key={m.year + m.event} className="esc-milestone">
              <div className="esc-milestone-line">
                <div className="esc-milestone-dot" />
                <div className="esc-milestone-vert" />
              </div>
              <div className="esc-milestone-content">
                <div className="esc-milestone-year">{m.year}</div>
                <div className="esc-milestone-event">{m.event}</div>
                <div className="esc-milestone-detail">{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function HostingTab({ hostingChartData }) {
  const topCity = HOSTING_CITIES[0];
  const totalHostings = HOSTING_CITIES.reduce((s, h) => s + h.times, 0);
  const uniqueHostCountries = [...new Set(HOSTING_CITIES.map(h => h.country))].length;

  return (
    <>
      <p className="esc-section-title">Hosting History</p>
      <p className="esc-section-sub">Cities and countries that have hosted the Eurovision Song Contest</p>

      <div className="esc-stats-row" style={{marginBottom:28}}>
        <div className="esc-stat-card">
          <div className="val">{HOSTING_CITIES.length}+</div>
          <div className="lbl">Host Cities (listed)</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{uniqueHostCountries}</div>
          <div className="lbl">Host Countries</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{topCity.city}</div>
          <div className="lbl">Most Times Hosted City</div>
        </div>
        <div className="esc-stat-card">
          <div className="val">{topCity.times}</div>
          <div className="lbl">{topCity.city} Hostings</div>
        </div>
      </div>

      <div className="esc-note">
        <strong>Notable:</strong> Dublin hosted a record 7 times, mainly during Ireland's dominant run in the 1980s–90s. In 2023, the UK hosted on behalf of Ukraine, which had won in 2022 but could not safely host due to the ongoing war.
      </div>

      <div className="esc-hosting-hero">
        {HOSTING_CITIES.map(h => (
          <div key={h.city} className="esc-host-card">
            <div className="esc-host-card-city">{h.city}</div>
            <div className="esc-host-card-country">{h.country}</div>
            <div className="esc-host-card-times">{h.times}</div>
            <div className="esc-host-card-label">time{h.times > 1 ? 's' : ''} hosted</div>
            <div className="esc-host-card-years">{h.years.replace(/,/g, ', ')}</div>
          </div>
        ))}
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Hostings by Country</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hostingChartData} margin={{top:4,right:8,bottom:40,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis
              dataKey="country"
              tick={{fill:TEXT3,fontSize:12}}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{fill:TEXT3,fontSize:12}} allowDecimals={false} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v) => [v, 'Hostings']}
            />
            <Bar dataKey="times" radius={[4,4,0,0]}>
              {hostingChartData.map((entry, i) => (
                <Cell key={entry.country} fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="esc-card">
        <p className="esc-chart-title">Full Hosting Table</p>
        <div className="esc-table-wrap">
          <table className="esc-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Country</th>
                <th>Times Hosted</th>
                <th>Years</th>
              </tr>
            </thead>
            <tbody>
              {[...HOSTING_CITIES].sort((a,b) => b.times - a.times).map(h => (
                <tr key={h.city}>
                  <td className="bold">{h.city}</td>
                  <td style={{color:TEXT1}}>{h.country}</td>
                  <td className="accent">{h.times}×</td>
                  <td style={{color:TEXT2,fontSize:'0.82rem'}}>{h.years.replace(/,/g, ', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
