import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const ACCENT = '#d4a017';
const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURF2 = '#253349';
const TEXT1 = '#f1f5f9';
const TEXT2 = '#94a3b8';
const TEXT3 = '#64748b';
const BORDER = 'rgba(255,255,255,0.07)';

const CAT_COLORS = {
  Physics:    '#60a5fa',
  Chemistry:  '#34d399',
  Medicine:   '#f87171',
  Literature: '#a78bfa',
  Peace:      '#fbbf24',
  Economics:  '#fb923c',
};

const LAUREATES = [
  {year:2024,category:'Physics',name:'John Hopfield & Geoffrey Hinton',country:'USA/Canada',citation:'Foundational discoveries for machine learning with artificial neural networks'},
  {year:2023,category:'Physics',name:'Pierre Agostini, Ferenc Krausz & Anne L\'Huillier',country:'France/Austria/Sweden',citation:'Experimental methods generating attosecond light pulses'},
  {year:2022,category:'Physics',name:'Alain Aspect, John F. Clauser & Anton Zeilinger',country:'France/USA/Austria',citation:'Experiments with entangled photons, quantum information'},
  {year:2021,category:'Physics',name:'Syukuro Manabe, Klaus Hasselmann & Giorgio Parisi',country:'USA/Germany/Italy',citation:'Understanding of complex systems including climate'},
  {year:2020,category:'Physics',name:'Roger Penrose, Reinhard Genzel & Andrea Ghez',country:'UK/Germany/USA',citation:'Black hole formation and Milky Way compact massive object'},
  {year:2019,category:'Physics',name:'James Peebles, Michel Mayor & Didier Queloz',country:'Canada/Switzerland',citation:'Theoretical cosmology and exoplanet discovery'},
  {year:2018,category:'Physics',name:'Arthur Ashkin, Gérard Mourou & Donna Strickland',country:'USA/France/Canada',citation:'Laser physics tools including optical tweezers and CPA'},
  {year:2017,category:'Physics',name:'Rainer Weiss, Barry C. Barish & Kip S. Thorne',country:'USA',citation:'LIGO detector and gravitational wave observation'},
  {year:2016,category:'Physics',name:'David J. Thouless, F. Duncan M. Haldane & J. Michael Kosterlitz',country:'UK/USA',citation:'Topological phase transitions'},
  {year:2015,category:'Physics',name:'Takaaki Kajita & Arthur B. McDonald',country:'Japan/Canada',citation:'Neutrino oscillations proving neutrinos have mass'},
  {year:2024,category:'Chemistry',name:'David Baker, Demis Hassabis & John Jumper',country:'USA/UK',citation:'Computational protein design and protein structure prediction'},
  {year:2023,category:'Chemistry',name:'Moungi G. Bawendi, Louis E. Brus & Alexei I. Ekimov',country:'USA/Russia',citation:'Discovery and synthesis of quantum dots'},
  {year:2022,category:'Chemistry',name:'Carolyn R. Bertozzi, Morten Meldal & K. Barry Sharpless',country:'USA/Denmark',citation:'Click chemistry and bioorthogonal chemistry'},
  {year:2021,category:'Chemistry',name:'Benjamin List & David W.C. MacMillan',country:'Germany/USA',citation:'Asymmetric organocatalysis'},
  {year:2020,category:'Chemistry',name:'Emmanuelle Charpentier & Jennifer A. Doudna',country:'France/USA',citation:'CRISPR/Cas9 genetic scissors'},
  {year:2019,category:'Chemistry',name:'John B. Goodenough, M. Stanley Whittingham & Akira Yoshino',country:'USA/UK/Japan',citation:'Lithium-ion batteries'},
  {year:2018,category:'Chemistry',name:'Frances H. Arnold, George P. Smith & Sir Gregory P. Winter',country:'USA/UK',citation:'Directed evolution of enzymes and phage display'},
  {year:2017,category:'Chemistry',name:'Jacques Dubochet, Joachim Frank & Richard Henderson',country:'Switzerland/USA/UK',citation:'Cryo-electron microscopy'},
  {year:2016,category:'Chemistry',name:'Jean-Pierre Sauvage, Sir J. Fraser Stoddart & Bernard L. Feringa',country:'France/UK/Netherlands',citation:'Molecular machines'},
  {year:2015,category:'Chemistry',name:'Tomas Lindahl, Paul Modrich & Aziz Sancar',country:'Sweden/USA/Turkey',citation:'DNA repair mechanisms'},
  {year:2024,category:'Medicine',name:'Victor Ambros & Gary Ruvkun',country:'USA',citation:'Discovery of microRNA and its role in gene regulation'},
  {year:2023,category:'Medicine',name:'Katalin Karikó & Drew Weissman',country:'Hungary/USA',citation:'Nucleoside base modifications enabling mRNA vaccines'},
  {year:2022,category:'Medicine',name:'Svante Pääbo',country:'Sweden/Germany',citation:'Discoveries concerning genomes of extinct hominins'},
  {year:2021,category:'Medicine',name:'David Julius & Ardem Patapoutian',country:'USA',citation:'Discoveries of receptors for temperature and touch'},
  {year:2020,category:'Medicine',name:'Harvey J. Alter, Michael Houghton & Charles M. Rice',country:'USA/UK',citation:'Discovery of Hepatitis C virus'},
  {year:2019,category:'Medicine',name:'William G. Kaelin Jr, Sir Peter J. Ratcliffe & Gregg L. Semenza',country:'USA/UK',citation:'How cells sense and adapt to oxygen availability'},
  {year:2018,category:'Medicine',name:'James P. Allison & Tasuku Honjo',country:'USA/Japan',citation:'Cancer therapy by inhibition of negative immune regulation'},
  {year:2017,category:'Medicine',name:'Jeffrey C. Hall, Michael Rosbash & Michael W. Young',country:'USA',citation:'Molecular mechanisms controlling circadian rhythm'},
  {year:2016,category:'Medicine',name:'Yoshinori Ohsumi',country:'Japan',citation:'Mechanisms for autophagy'},
  {year:2015,category:'Medicine',name:'William C. Campbell, Satoshi Omura & Tu Youyou',country:'Ireland/Japan/China',citation:'Novel therapies against parasitic diseases'},
  {year:2024,category:'Literature',name:'Han Kang',country:'South Korea',citation:'For intense poetic prose that confronts historical traumas'},
  {year:2023,category:'Literature',name:'Jon Fosse',country:'Norway',citation:'For innovative plays and prose which give voice to the unsayable'},
  {year:2022,category:'Literature',name:'Annie Ernaux',country:'France',citation:'Courage and acuity uncovering roots of collective memory'},
  {year:2021,category:'Literature',name:'Abdulrazak Gurnah',country:'Tanzania/UK',citation:'Penetration of the effects of colonialism'},
  {year:2020,category:'Literature',name:'Louise Glück',country:'USA',citation:'Unmistakable poetic voice making individual existence universal'},
  {year:2019,category:'Literature',name:'Peter Handke',country:'Austria',citation:'Influential work exploring the periphery of human experience'},
  {year:2018,category:'Literature',name:'Olga Tokarczuk',country:'Poland',citation:'Narrative imagination representing crossing of boundaries'},
  {year:2017,category:'Literature',name:'Kazuo Ishiguro',country:'UK/Japan',citation:'Novels of great emotional force'},
  {year:2016,category:'Literature',name:'Bob Dylan',country:'USA',citation:'Creating new poetic expressions within the American song tradition'},
  {year:2015,category:'Literature',name:'Svetlana Alexievich',country:'Belarus',citation:'Polyphonic writings, monument to suffering and courage'},
  {year:2024,category:'Peace',name:'Nihon Hidankyo',country:'Japan',citation:'Efforts of atomic bomb survivors from Hiroshima and Nagasaki'},
  {year:2023,category:'Peace',name:'Narges Mohammadi',country:'Iran',citation:'Fight against oppression of women in Iran'},
  {year:2022,category:'Peace',name:'Ales Bialiatski, Memorial & Center for Civil Liberties',country:'Belarus/Russia/Ukraine',citation:'Civil society in their home countries'},
  {year:2021,category:'Peace',name:'Maria Ressa & Dmitry Muratov',country:'Philippines/Russia',citation:'Efforts to safeguard freedom of expression'},
  {year:2020,category:'Peace',name:'World Food Programme',country:'International',citation:'Efforts to combat hunger, bettering conditions for peace'},
  {year:2019,category:'Peace',name:'Abiy Ahmed Ali',country:'Ethiopia',citation:'Efforts to achieve peace and the Eritrea peace process'},
  {year:2018,category:'Peace',name:'Denis Mukwege & Nadia Murad',country:'Congo/Iraq',citation:'Efforts to end sexual violence as weapon of war'},
  {year:2017,category:'Peace',name:'International Campaign to Abolish Nuclear Weapons',country:'International',citation:'Work for a world free of nuclear weapons'},
  {year:2016,category:'Peace',name:'Juan Manuel Santos',country:'Colombia',citation:'Efforts to end the 50-year civil war'},
  {year:2015,category:'Peace',name:'National Dialogue Quartet',country:'Tunisia',citation:'Decisive contribution to democracy in Tunisia'},
  {year:2024,category:'Economics',name:'Daron Acemoglu, Simon Johnson & James A. Robinson',country:'Turkey/UK/USA',citation:'Studies on how institutions are formed and affect prosperity'},
  {year:2023,category:'Economics',name:'Claudia Goldin',country:'USA',citation:'Understanding of women\'s labour market outcomes'},
  {year:2022,category:'Economics',name:'Ben S. Bernanke, Douglas W. Diamond & Philip H. Dybvig',country:'USA',citation:'Research on banks and financial crises'},
  {year:2021,category:'Economics',name:'David Card, Joshua D. Angrist & Guido W. Imbens',country:'Canada/USA/Netherlands',citation:'Empirical contributions to labour economics'},
  {year:2020,category:'Economics',name:'Paul R. Milgrom & Robert B. Wilson',country:'USA',citation:'Improvements to auction theory'},
  {year:2019,category:'Economics',name:'Abhijit Banerjee, Esther Duflo & Michael Kremer',country:'India/France/USA',citation:'Experimental approach to alleviating global poverty'},
  {year:2018,category:'Economics',name:'William D. Nordhaus & Paul M. Romer',country:'USA',citation:'Integrating climate and technology into macroeconomics'},
  {year:2017,category:'Economics',name:'Richard H. Thaler',country:'USA',citation:'Contributions to behavioural economics'},
  {year:2016,category:'Economics',name:'Oliver Hart & Bengt Holmstrom',country:'UK/Finland/USA',citation:'Contributions to contract theory'},
  {year:2015,category:'Economics',name:'Angus Deaton',country:'UK/USA',citation:'Analysis of consumption, poverty, and welfare'},
];

const COUNTRY_STATS = [
  {country:'USA',total:400,physics:98,chemistry:76,medicine:105,literature:12,peace:22,economics:62},
  {country:'UK',total:137,physics:32,chemistry:33,medicine:32,literature:13,peace:12,economics:9},
  {country:'Germany',total:115,physics:32,chemistry:35,medicine:18,literature:8,peace:5,economics:1},
  {country:'France',total:73,physics:15,chemistry:9,medicine:15,literature:16,peace:9,economics:2},
  {country:'Sweden',total:33,physics:5,chemistry:5,medicine:9,literature:8,peace:5,economics:2},
  {country:'Japan',total:29,physics:13,chemistry:8,medicine:6,literature:2,peace:1,economics:0},
  {country:'Russia/USSR',total:32,physics:11,chemistry:1,medicine:2,literature:5,peace:3,economics:1},
  {country:'Switzerland',total:29,physics:6,chemistry:8,medicine:7,literature:2,peace:3,economics:0},
  {country:'Netherlands',total:22,physics:9,chemistry:4,medicine:4,literature:1,peace:1,economics:2},
  {country:'Canada',total:27,physics:4,chemistry:7,medicine:4,literature:3,peace:3,economics:4},
  {country:'Italy',total:21,physics:7,chemistry:2,medicine:5,literature:6,peace:1,economics:1},
  {country:'Norway',total:13,physics:0,chemistry:1,medicine:3,literature:3,peace:4,economics:0},
  {country:'Austria',total:22,physics:5,chemistry:3,medicine:6,literature:2,peace:3,economics:1},
  {country:'Israel',total:14,physics:1,chemistry:6,medicine:1,literature:1,peace:3,economics:2},
  {country:'India',total:12,physics:1,chemistry:1,medicine:1,literature:2,peace:4,economics:1},
];

const FEMALE_LAUREATES = [
  {name:'Marie Curie',country:'France/Poland',year:1903,category:'Physics',note:'First woman; also won 1911 Chemistry'},
  {name:'Marie Curie',country:'France/Poland',year:1911,category:'Chemistry',note:'First person to win Nobel twice'},
  {name:'Mother Teresa',country:'Albania/India',year:1979,category:'Peace',note:'Founded Missionaries of Charity'},
  {name:'Toni Morrison',country:'USA',year:1993,category:'Literature',note:'First African American woman'},
  {name:'Malala Yousafzai',country:'Pakistan',year:2014,category:'Peace',note:'Youngest laureate ever (age 17)'},
  {name:'Emmanuelle Charpentier',country:'France',year:2020,category:'Chemistry',note:'CRISPR gene editing'},
  {name:'Jennifer Doudna',country:'USA',year:2020,category:'Chemistry',note:'CRISPR gene editing'},
  {name:'Katalin Karikó',country:'Hungary',year:2023,category:'Medicine',note:'mRNA vaccine technology'},
  {name:'Annie Ernaux',country:'France',year:2022,category:'Literature',note:'Autofiction and social memory'},
  {name:'Han Kang',country:'South Korea',year:2024,category:'Literature',note:'First Asian woman in Literature'},
  {name:'Narges Mohammadi',country:'Iran',year:2023,category:'Peace',note:'Women\'s rights activist awarded in prison'},
];

const TABS = ['Overview','Physics','Chemistry','Medicine','Literature','Peace','Economics'];
const CATEGORIES = ['Physics','Chemistry','Medicine','Literature','Peace','Economics'];

const CSS = `
.nbl-root {
  background: ${BG};
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: ${TEXT1};
  padding-bottom: 60px;
}
.nbl-header {
  background: linear-gradient(135deg,#1a1200 0%,#3d2a00 60%,#1a1200 100%);
  padding: 40px 24px 32px;
  text-align: center;
  border-bottom: 1px solid rgba(212,160,23,0.25);
  position: relative;
  overflow: hidden;
}
.nbl-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(212,160,23,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.nbl-header-icon {
  font-size: 48px;
  line-height: 1;
  margin-bottom: 12px;
  display: block;
}
.nbl-header-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: ${ACCENT};
  letter-spacing: -0.5px;
  margin: 0 0 8px;
}
.nbl-header-sub {
  color: ${TEXT2};
  font-size: 0.95rem;
  margin: 0;
  max-width: 560px;
  margin: 0 auto;
}
.nbl-tabs-bar {
  display: flex;
  gap: 4px;
  padding: 16px 24px 0;
  border-bottom: 1px solid ${BORDER};
  overflow-x: auto;
  scrollbar-width: none;
  background: ${SURFACE};
}
.nbl-tabs-bar::-webkit-scrollbar { display: none; }
.nbl-tab {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: ${TEXT2};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  outline: none;
  border-radius: 4px 4px 0 0;
}
.nbl-tab:hover { color: ${TEXT1}; }
.nbl-tab.nbl-tab--active {
  color: ${ACCENT};
  border-bottom-color: ${ACCENT};
  background: rgba(212,160,23,0.06);
}
.nbl-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 20px;
}
.nbl-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: ${TEXT1};
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.nbl-section-title span {
  display: inline-block;
  width: 3px;
  height: 18px;
  background: ${ACCENT};
  border-radius: 2px;
}
.nbl-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.nbl-stat-card {
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.15s;
}
.nbl-stat-card:hover { transform: translateY(-2px); }
.nbl-stat-val {
  font-size: 2.4rem;
  font-weight: 800;
  color: ${ACCENT};
  line-height: 1;
  margin-bottom: 6px;
}
.nbl-stat-label {
  font-size: 0.8rem;
  color: ${TEXT2};
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.nbl-chart-card {
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.nbl-chart-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: ${TEXT2};
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.78rem;
}
.nbl-grid-recent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  margin-bottom: 32px;
}
.nbl-recent-card {
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.2s;
}
.nbl-recent-card:hover { border-color: rgba(212,160,23,0.3); }
.nbl-recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.nbl-recent-year {
  font-size: 0.78rem;
  font-weight: 700;
  color: ${ACCENT};
  background: rgba(212,160,23,0.1);
  padding: 2px 8px;
  border-radius: 4px;
}
.nbl-recent-cat {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}
.nbl-recent-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: ${TEXT1};
  margin-bottom: 4px;
  line-height: 1.3;
}
.nbl-recent-country {
  font-size: 0.78rem;
  color: ${TEXT3};
  margin-bottom: 6px;
}
.nbl-recent-citation {
  font-size: 0.78rem;
  color: ${TEXT2};
  line-height: 1.4;
  font-style: italic;
}
.nbl-search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}
.nbl-search {
  background: ${SURF2};
  border: 1px solid ${BORDER};
  border-radius: 8px;
  padding: 9px 14px;
  color: ${TEXT1};
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  flex: 1;
  min-width: 180px;
  max-width: 360px;
}
.nbl-search::placeholder { color: ${TEXT3}; }
.nbl-search:focus { border-color: rgba(212,160,23,0.45); }
.nbl-result-count {
  font-size: 0.8rem;
  color: ${TEXT3};
}
.nbl-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid ${BORDER};
  margin-bottom: 28px;
}
.nbl-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.nbl-table th {
  background: ${SURF2};
  color: ${TEXT3};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
  padding: 11px 16px;
  text-align: left;
  border-bottom: 1px solid ${BORDER};
  white-space: nowrap;
}
.nbl-table td {
  padding: 13px 16px;
  border-bottom: 1px solid ${BORDER};
  color: ${TEXT1};
  vertical-align: top;
}
.nbl-table tr:last-child td { border-bottom: none; }
.nbl-table tbody tr { transition: background 0.15s; }
.nbl-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.nbl-year-badge {
  display: inline-block;
  background: rgba(212,160,23,0.12);
  color: ${ACCENT};
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.82rem;
}
.nbl-country-badge {
  display: inline-block;
  background: rgba(148,163,184,0.1);
  color: ${TEXT2};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
}
.nbl-cat-badge {
  display: inline-block;
  font-size: 0.73rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}
.nbl-citation-cell {
  color: ${TEXT2};
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.4;
  max-width: 320px;
}
.nbl-country-table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid ${BORDER};
  margin-bottom: 28px;
}
.nbl-country-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.nbl-country-table th {
  background: ${SURF2};
  color: ${TEXT3};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
  padding: 11px 16px;
  text-align: left;
  border-bottom: 1px solid ${BORDER};
}
.nbl-country-table td {
  padding: 12px 16px;
  border-bottom: 1px solid ${BORDER};
  color: ${TEXT1};
}
.nbl-country-table tr:last-child td { border-bottom: none; }
.nbl-country-table tbody tr { transition: background 0.15s; }
.nbl-country-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.nbl-rank-num {
  color: ${TEXT3};
  font-weight: 700;
  font-size: 0.82rem;
}
.nbl-rank-1 { color: ${ACCENT}; }
.nbl-rank-2 { color: #94a3b8; }
.nbl-rank-3 { color: #cd7f32; }
.nbl-bar-bg {
  height: 6px;
  background: ${SURF2};
  border-radius: 3px;
  overflow: hidden;
  min-width: 80px;
}
.nbl-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}
.nbl-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
@media (max-width: 700px) {
  .nbl-two-col { grid-template-columns: 1fr; }
  .nbl-header-title { font-size: 1.6rem; }
}
.nbl-women-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}
.nbl-woman-card {
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.2s;
}
.nbl-woman-card:hover { border-color: rgba(212,160,23,0.35); }
.nbl-woman-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: ${TEXT1};
  margin-bottom: 4px;
}
.nbl-woman-meta {
  font-size: 0.8rem;
  color: ${TEXT3};
  margin-bottom: 8px;
}
.nbl-woman-note {
  font-size: 0.8rem;
  color: ${TEXT2};
  line-height: 1.4;
  font-style: italic;
}
.nbl-empty {
  padding: 40px;
  text-align: center;
  color: ${TEXT3};
  font-size: 0.9rem;
}
.nbl-divider {
  height: 1px;
  background: ${BORDER};
  margin: 28px 0;
}
.nbl-tooltip {
  background: #0f1e35 !important;
  border: 1px solid rgba(212,160,23,0.3) !important;
  border-radius: 8px !important;
  color: ${TEXT1} !important;
  font-size: 0.83rem !important;
}
.nbl-overview-cats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
@media (max-width: 600px) {
  .nbl-overview-cats { grid-template-columns: repeat(2, 1fr); }
}
.nbl-cat-pill {
  background: ${SURFACE};
  border: 1px solid ${BORDER};
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
}
.nbl-cat-pill:hover { border-color: rgba(212,160,23,0.4); transform: translateY(-1px); }
.nbl-cat-pill-icon {
  font-size: 1.6rem;
  margin-bottom: 6px;
}
.nbl-cat-pill-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: ${TEXT2};
}
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="nbl-tooltip" style={{padding:'10px 14px'}}>
      <p style={{margin:'0 0 6px',fontWeight:700,color:TEXT1}}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{margin:'2px 0',color:p.color || ACCENT}}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function CategoryBadge({ category }) {
  const color = CAT_COLORS[category] || TEXT2;
  return (
    <span className="nbl-cat-badge" style={{background:`${color}18`,color}}>
      {category}
    </span>
  );
}

function CategoryTab({ category, data }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.citation.toLowerCase().includes(q) ||
      String(d.year).includes(q)
    );
  }, [data, search]);

  const countryData = useMemo(() => {
    return COUNTRY_STATS
      .map(c => ({ country: c.country, count: c[category.toLowerCase()] || 0 }))
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [category]);

  const color = CAT_COLORS[category] || ACCENT;

  return (
    <div>
      <div className="nbl-section-title"><span />{category} Nobel Prize — 2015–2024</div>
      <div className="nbl-search-row">
        <input
          className="nbl-search"
          placeholder={`Search ${category} laureates...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="nbl-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="nbl-table-wrap">
        <table className="nbl-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Laureate(s)</th>
              <th>Country</th>
              <th>Citation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.sort((a,b) => b.year - a.year).map((row, i) => (
              <tr key={i}>
                <td><span className="nbl-year-badge">{row.year}</span></td>
                <td style={{fontWeight:600,minWidth:180}}>{row.name}</td>
                <td><span className="nbl-country-badge">{row.country}</span></td>
                <td className="nbl-citation-cell">{row.citation}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="nbl-empty">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="nbl-divider" />
      <div className="nbl-section-title"><span />All-Time Country Leaders — {category}</div>
      <div className="nbl-chart-card">
        <p className="nbl-chart-title">Top 10 countries by {category} Nobel Prize count</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={countryData} margin={{top:4,right:16,left:0,bottom:30}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis
              dataKey="country"
              tick={{fill:TEXT3,fontSize:11}}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{fill:TEXT3,fontSize:11}} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name={category} radius={[4,4,0,0]}>
              {countryData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? ACCENT : color} opacity={i === 0 ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OverviewTab({ onTabChange }) {
  const totalLaureates = useMemo(() => COUNTRY_STATS.reduce((s, c) => s + c.total, 0), []);
  const femaleCount = FEMALE_LAUREATES.length;
  const totalFemaleEst = 66;
  const femalePct = ((totalFemaleEst / 975) * 100).toFixed(1);

  const topCountries = useMemo(() =>
    [...COUNTRY_STATS].sort((a, b) => b.total - a.total).slice(0, 10),
  []);

  const recentAll = useMemo(() =>
    [...LAUREATES].sort((a, b) => b.year - a.year).slice(0, 12),
  []);

  const catIcons = {
    Physics: '⚛️', Chemistry: '🧪', Medicine: '🩺',
    Literature: '📚', Peace: '🕊️', Economics: '📈'
  };

  return (
    <div>
      <div className="nbl-stats-grid">
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">975+</div>
          <div className="nbl-stat-label">Total Nobel Laureates</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">6</div>
          <div className="nbl-stat-label">Prize Categories</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">{femalePct}%</div>
          <div className="nbl-stat-label">Female Laureates (est.)</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">1901</div>
          <div className="nbl-stat-label">First Prizes Awarded</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">400+</div>
          <div className="nbl-stat-label">USA Laureates (all-time)</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val">17</div>
          <div className="nbl-stat-label">Age 17 — Youngest (Malala)</div>
        </div>
      </div>

      <div className="nbl-section-title"><span />Jump to Category</div>
      <div className="nbl-overview-cats">
        {CATEGORIES.map(cat => (
          <div
            key={cat}
            className="nbl-cat-pill"
            onClick={() => onTabChange(cat)}
            style={{borderColor:`${CAT_COLORS[cat]}30`}}
          >
            <div className="nbl-cat-pill-icon">{catIcons[cat]}</div>
            <div className="nbl-cat-pill-name" style={{color:CAT_COLORS[cat]}}>{cat}</div>
          </div>
        ))}
      </div>

      <div className="nbl-divider" />
      <div className="nbl-section-title"><span />Country Leaders — All Categories</div>
      <div className="nbl-chart-card">
        <p className="nbl-chart-title">Top 10 countries by total Nobel Prize count</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCountries} margin={{top:4,right:16,left:0,bottom:36}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis
              dataKey="country"
              tick={{fill:TEXT3,fontSize:11}}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{fill:TEXT3,fontSize:11}} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Total" radius={[4,4,0,0]}>
              {topCountries.map((_, i) => (
                <Cell key={i} fill={i === 0 ? ACCENT : '#60a5fa'} opacity={i === 0 ? 1 : 0.65} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="nbl-divider" />
      <div className="nbl-section-title"><span />Most Recent Laureates (2024–2015)</div>
      <div className="nbl-grid-recent">
        {recentAll.map((l, i) => {
          const color = CAT_COLORS[l.category] || ACCENT;
          return (
            <div className="nbl-recent-card" key={i}>
              <div className="nbl-recent-header">
                <span className="nbl-recent-year">{l.year}</span>
                <span className="nbl-recent-cat" style={{background:`${color}18`,color}}>{l.category}</span>
              </div>
              <div className="nbl-recent-name">{l.name}</div>
              <div className="nbl-recent-country">{l.country}</div>
              <div className="nbl-recent-citation">"{l.citation}"</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CountryLeaderboardTab() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('total');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COUNTRY_STATS
      .filter(c => c.country.toLowerCase().includes(q))
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
  }, [search, sortKey]);

  const maxTotal = useMemo(() => Math.max(...COUNTRY_STATS.map(c => c.total)), []);

  const stackedData = useMemo(() =>
    [...COUNTRY_STATS].sort((a,b) => b.total - a.total).slice(0, 12),
  []);

  const sortCols = [
    { key: 'total', label: 'Total' },
    { key: 'physics', label: 'Physics' },
    { key: 'chemistry', label: 'Chemistry' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'literature', label: 'Literature' },
    { key: 'peace', label: 'Peace' },
    { key: 'economics', label: 'Economics' },
  ];

  return (
    <div>
      <div className="nbl-section-title"><span />Country Leaderboard</div>
      <div className="nbl-chart-card" style={{marginBottom:24}}>
        <p className="nbl-chart-title">Top 12 countries — stacked breakdown by category</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={stackedData} margin={{top:4,right:20,left:0,bottom:40}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis
              dataKey="country"
              tick={{fill:TEXT3,fontSize:10}}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{fill:TEXT3,fontSize:11}} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{color:TEXT2,fontSize:12,paddingTop:8}} />
            {CATEGORIES.map(cat => (
              <Bar key={cat} dataKey={cat.toLowerCase()} name={cat} stackId="a" fill={CAT_COLORS[cat]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="nbl-search-row">
        <input
          className="nbl-search"
          placeholder="Search country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="nbl-result-count">Sort by:</span>
        {sortCols.map(col => (
          <button
            key={col.key}
            onClick={() => setSortKey(col.key)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: `1px solid ${sortKey === col.key ? ACCENT : BORDER}`,
              background: sortKey === col.key ? `rgba(212,160,23,0.12)` : SURF2,
              color: sortKey === col.key ? ACCENT : TEXT2,
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontWeight: sortKey === col.key ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {col.label}
          </button>
        ))}
      </div>

      <div className="nbl-country-table-wrap">
        <table className="nbl-country-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Country</th>
              <th>Total</th>
              <th>Physics</th>
              <th>Chemistry</th>
              <th>Medicine</th>
              <th>Literature</th>
              <th>Peace</th>
              <th>Economics</th>
              <th style={{minWidth:100}}>Share</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.country}>
                <td>
                  <span className={`nbl-rank-num${i === 0 ? ' nbl-rank-1' : i === 1 ? ' nbl-rank-2' : i === 2 ? ' nbl-rank-3' : ''}`}>
                    #{i + 1}
                  </span>
                </td>
                <td style={{fontWeight:600}}>{c.country}</td>
                <td style={{fontWeight:700,color:ACCENT}}>{c.total}</td>
                <td style={{color:CAT_COLORS.Physics}}>{c.physics}</td>
                <td style={{color:CAT_COLORS.Chemistry}}>{c.chemistry}</td>
                <td style={{color:CAT_COLORS.Medicine}}>{c.medicine}</td>
                <td style={{color:CAT_COLORS.Literature}}>{c.literature}</td>
                <td style={{color:CAT_COLORS.Peace}}>{c.peace}</td>
                <td style={{color:CAT_COLORS.Economics}}>{c.economics}</td>
                <td>
                  <div className="nbl-bar-bg">
                    <div
                      className="nbl-bar-fill"
                      style={{
                        width: `${(c.total / maxTotal) * 100}%`,
                        background: ACCENT,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="nbl-empty">No countries match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WomenTab() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return FEMALE_LAUREATES.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.country.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.note.toLowerCase().includes(q)
    );
  }, [search]);

  const catBreakdown = useMemo(() => {
    const counts = {};
    FEMALE_LAUREATES.forEach(w => {
      counts[w.category] = (counts[w.category] || 0) + 1;
    });
    return Object.entries(counts).map(([cat, count]) => ({ cat, count })).sort((a,b) => b.count - a.count);
  }, []);

  return (
    <div>
      <div className="nbl-section-title"><span />Notable Women Laureates</div>
      <div className="nbl-stats-grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val" style={{color:'#f472b6'}}>~66</div>
          <div className="nbl-stat-label">Female Laureates (all-time)</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val" style={{color:'#f472b6'}}>6.8%</div>
          <div className="nbl-stat-label">Share of All Prizes</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val" style={{color:'#f472b6'}}>17</div>
          <div className="nbl-stat-label">Youngest: Malala Yousafzai</div>
        </div>
        <div className="nbl-stat-card">
          <div className="nbl-stat-val" style={{color:'#f472b6'}}>2</div>
          <div className="nbl-stat-label">Marie Curie — Won Twice</div>
        </div>
      </div>

      <div className="nbl-chart-card">
        <p className="nbl-chart-title">Female laureates by category (featured)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={catBreakdown} margin={{top:4,right:16,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="cat" tick={{fill:TEXT3,fontSize:12}} />
            <YAxis tick={{fill:TEXT3,fontSize:11}} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Women" radius={[4,4,0,0]}>
              {catBreakdown.map((entry, i) => (
                <Cell key={i} fill={CAT_COLORS[entry.cat] || ACCENT} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="nbl-divider" />
      <div className="nbl-search-row">
        <input
          className="nbl-search"
          placeholder="Search women laureates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="nbl-result-count">{filtered.length} featured</span>
      </div>

      <div className="nbl-women-grid">
        {filtered.map((w, i) => {
          const color = CAT_COLORS[w.category] || ACCENT;
          return (
            <div className="nbl-woman-card" key={i}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <span className="nbl-year-badge">{w.year}</span>
                <span className="nbl-cat-badge" style={{background:`${color}18`,color}}>{w.category}</span>
              </div>
              <div className="nbl-woman-name">{w.name}</div>
              <div className="nbl-woman-meta">{w.country}</div>
              <div className="nbl-woman-note">{w.note}</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="nbl-empty" style={{gridColumn:'1/-1'}}>No results found.</div>
        )}
      </div>

      <div className="nbl-divider" />
      <div className="nbl-section-title"><span />All Featured Women — Table View</div>
      <div className="nbl-table-wrap">
        <table className="nbl-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Name</th>
              <th>Category</th>
              <th>Country</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.sort((a,b) => b.year - a.year).map((w, i) => (
              <tr key={i}>
                <td><span className="nbl-year-badge">{w.year}</span></td>
                <td style={{fontWeight:600}}>{w.name}</td>
                <td><CategoryBadge category={w.category} /></td>
                <td><span className="nbl-country-badge">{w.country}</span></td>
                <td className="nbl-citation-cell">{w.note}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="nbl-empty">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function NobelStatNations() {
  const [activeTab, setActiveTab] = useState('Overview');

  const categoryData = useMemo(() => {
    const map = {};
    CATEGORIES.forEach(cat => {
      map[cat] = LAUREATES.filter(l => l.category === cat);
    });
    return map;
  }, []);

  const handleTabChange = (tab) => setActiveTab(tab);

  const allTabs = [...TABS, 'Countries', 'Women'];

  return (
    <div className="nbl-root">
      <style>{CSS}</style>

      <header className="nbl-header">
        <span className="nbl-header-icon">🏅</span>
        <h1 className="nbl-header-title">Nobel Prize Statistics</h1>
        <p className="nbl-header-sub">
          Exploring the history of Nobel Prizes — laureates, countries, categories, and milestones from 1901 to today.
        </p>
      </header>

      <div className="nbl-tabs-bar">
        {allTabs.map(tab => (
          <button
            key={tab}
            className={`nbl-tab${activeTab === tab ? ' nbl-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="nbl-body">
        {activeTab === 'Overview' && (
          <OverviewTab onTabChange={handleTabChange} />
        )}
        {CATEGORIES.includes(activeTab) && (
          <CategoryTab category={activeTab} data={categoryData[activeTab] || []} />
        )}
        {activeTab === 'Countries' && (
          <CountryLeaderboardTab />
        )}
        {activeTab === 'Women' && (
          <WomenTab />
        )}
      </div>
    </div>
  );
}
