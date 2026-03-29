// ── StatNations Global Search Entity Index ────────────────────────────────────
// All searchable entities across 14 modules. Each entry navigates to a module.

export const SEARCH_ENTITIES = [
  // ── RUGBY UNION ────────────────────────────────────────────────────────────
  { id: 'nz-rugby',   name: 'New Zealand',   alt: 'All Blacks',          type: 'nation',      module: 'rugby',      flag: '🇳🇿', accent: '#10b981' },
  { id: 'sa-rugby',   name: 'South Africa',  alt: 'Springboks',          type: 'nation',      module: 'rugby',      flag: '🇿🇦', accent: '#10b981' },
  { id: 'eng-rugby',  name: 'England',       alt: 'Red Roses / Red Rose', type: 'nation',     module: 'rugby',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', accent: '#10b981' },
  { id: 'ire-rugby',  name: 'Ireland',       alt: 'IRFU',                type: 'nation',      module: 'rugby',      flag: '🇮🇪', accent: '#10b981' },
  { id: 'fra-rugby',  name: 'France',        alt: 'Les Bleus',           type: 'nation',      module: 'rugby',      flag: '🇫🇷', accent: '#10b981' },
  { id: 'aus-rugby',  name: 'Australia',     alt: 'Wallabies',           type: 'nation',      module: 'rugby',      flag: '🇦🇺', accent: '#10b981' },
  { id: 'wal-rugby',  name: 'Wales',         alt: 'Dragons',             type: 'nation',      module: 'rugby',      flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', accent: '#10b981' },
  { id: 'sco-rugby',  name: 'Scotland',      alt: 'Thistle',             type: 'nation',      module: 'rugby',      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', accent: '#10b981' },
  { id: 'rwc',        name: 'Rugby World Cup', alt: 'RWC',               type: 'tournament',  module: 'rugby',      flag: '🏉', accent: '#10b981' },
  { id: 'six-nations',name: 'Six Nations',   alt: '6 Nations Championship', type: 'tournament', module: 'rugby',   flag: '🏉', accent: '#10b981' },
  { id: 'tri-nations',name: 'The Rugby Championship', alt: 'Tri Nations', type: 'tournament', module: 'rugby',    flag: '🏉', accent: '#10b981' },

  // ── FOOTBALL ───────────────────────────────────────────────────────────────
  { id: 'bra-football', name: 'Brazil',        alt: 'Seleção Canarinho',  type: 'nation',     module: 'football',   flag: '🇧🇷', accent: '#3b82f6' },
  { id: 'ger-football', name: 'Germany',       alt: 'Die Mannschaft',     type: 'nation',     module: 'football',   flag: '🇩🇪', accent: '#3b82f6' },
  { id: 'arg-football', name: 'Argentina',     alt: 'Albiceleste',        type: 'nation',     module: 'football',   flag: '🇦🇷', accent: '#3b82f6' },
  { id: 'fra-football', name: 'France',        alt: 'Les Bleus (football)', type: 'nation',   module: 'football',   flag: '🇫🇷', accent: '#3b82f6' },
  { id: 'ita-football', name: 'Italy',         alt: 'Azzurri',            type: 'nation',     module: 'football',   flag: '🇮🇹', accent: '#3b82f6' },
  { id: 'esp-football', name: 'Spain',         alt: 'La Furia Roja',      type: 'nation',     module: 'football',   flag: '🇪🇸', accent: '#3b82f6' },
  { id: 'eng-football', name: 'England',       alt: 'Three Lions',        type: 'nation',     module: 'football',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', accent: '#3b82f6' },
  { id: 'fifa-wc',      name: 'FIFA World Cup', alt: 'World Cup',         type: 'tournament', module: 'football',   flag: '⚽', accent: '#3b82f6' },
  { id: 'euros',        name: 'UEFA Euro',     alt: 'European Championship', type: 'tournament', module: 'football', flag: '⚽', accent: '#3b82f6' },
  { id: 'copa-america', name: 'Copa América',  alt: 'CONMEBOL',           type: 'tournament', module: 'football',   flag: '⚽', accent: '#3b82f6' },

  // ── OLYMPICS ────────────────────────────────────────────────────────────────
  { id: 'usa-olympics', name: 'United States', alt: 'Team USA',           type: 'nation',     module: 'olympics',   flag: '🇺🇸', accent: '#f59e0b' },
  { id: 'chn-olympics', name: 'China',         alt: 'Team China',         type: 'nation',     module: 'olympics',   flag: '🇨🇳', accent: '#f59e0b' },
  { id: 'gbr-olympics', name: 'Great Britain', alt: 'Team GB',            type: 'nation',     module: 'olympics',   flag: '🇬🇧', accent: '#f59e0b' },
  { id: 'rus-olympics', name: 'Russia',        alt: 'ROC',                type: 'nation',     module: 'olympics',   flag: '🇷🇺', accent: '#f59e0b' },
  { id: 'summer-olympics', name: 'Summer Olympics', alt: 'Olympic Games', type: 'tournament', module: 'olympics',   flag: '🏅', accent: '#f59e0b' },
  { id: 'winter-olympics', name: 'Winter Olympics', alt: 'Winter Games',  type: 'tournament', module: 'olympics',   flag: '🥇', accent: '#f59e0b' },

  // ── ATHLETICS ───────────────────────────────────────────────────────────────
  { id: 'bolt-100m',   name: '100m World Record', alt: 'Usain Bolt 9.58s', type: 'record',   module: 'athletics',  flag: '🏃', accent: '#8b5cf6' },
  { id: 'wrd-marathon', name: 'Marathon World Record', alt: 'Kelvin Kiptum 2:00:35', type: 'record', module: 'athletics', flag: '🏃', accent: '#8b5cf6' },
  { id: 'iaaf-worlds', name: 'World Athletics Championships', alt: 'IAAF', type: 'tournament', module: 'athletics', flag: '🏃', accent: '#8b5cf6' },
  { id: 'ken-athletics', name: 'Kenya',          alt: 'Distance running',  type: 'nation',    module: 'athletics',  flag: '🇰🇪', accent: '#8b5cf6' },
  { id: 'eth-athletics', name: 'Ethiopia',       alt: 'Haile Gebrselassie', type: 'nation',   module: 'athletics',  flag: '🇪🇹', accent: '#8b5cf6' },
  { id: 'usa-athletics', name: 'USA Sprints',    alt: 'American sprinters', type: 'nation',   module: 'athletics',  flag: '🇺🇸', accent: '#8b5cf6' },

  // ── CRICKET ─────────────────────────────────────────────────────────────────
  { id: 'aus-cricket', name: 'Australia',        alt: 'Baggy Greens',      type: 'nation',    module: 'cricket',    flag: '🇦🇺', accent: '#ef4444' },
  { id: 'ind-cricket', name: 'India',            alt: 'Men in Blue',       type: 'nation',    module: 'cricket',    flag: '🇮🇳', accent: '#ef4444' },
  { id: 'eng-cricket', name: 'England',          alt: 'Three Lions Cricket', type: 'nation',  module: 'cricket',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', accent: '#ef4444' },
  { id: 'wi-cricket',  name: 'West Indies',      alt: 'Windies',           type: 'nation',    module: 'cricket',    flag: '🏏', accent: '#ef4444' },
  { id: 'cwc',         name: 'Cricket World Cup', alt: 'ICC CWC ODI',      type: 'tournament', module: 'cricket',   flag: '🏏', accent: '#ef4444' },
  { id: 'ashes',       name: 'The Ashes',        alt: 'England vs Australia', type: 'tournament', module: 'cricket', flag: '🏏', accent: '#ef4444' },
  { id: 'ipl',         name: 'Indian Premier League', alt: 'IPL T20',      type: 'tournament', module: 'cricket',   flag: '🏏', accent: '#ef4444' },

  // ── TENNIS ──────────────────────────────────────────────────────────────────
  { id: 'djokovic',    name: 'Novak Djokovic',   alt: 'Serbia 24 Grand Slams', type: 'person', module: 'tennis',   flag: '🇷🇸', accent: '#06b6d4' },
  { id: 'federer',     name: 'Roger Federer',    alt: 'Switzerland 20 Slams',  type: 'person', module: 'tennis',   flag: '🇨🇭', accent: '#06b6d4' },
  { id: 'nadal',       name: 'Rafael Nadal',     alt: 'Spain 22 Slams',        type: 'person', module: 'tennis',   flag: '🇪🇸', accent: '#06b6d4' },
  { id: 'serena',      name: 'Serena Williams',  alt: 'USA 23 Slams',          type: 'person', module: 'tennis',   flag: '🇺🇸', accent: '#06b6d4' },
  { id: 'wimbledon',   name: 'Wimbledon',        alt: 'The Championships',      type: 'tournament', module: 'tennis', flag: '🎾', accent: '#06b6d4' },
  { id: 'roland-garros', name: 'Roland Garros',  alt: 'French Open clay',      type: 'tournament', module: 'tennis', flag: '🎾', accent: '#06b6d4' },
  { id: 'us-open-tennis', name: 'US Open',       alt: 'USTA Flushing Meadows', type: 'tournament', module: 'tennis', flag: '🎾', accent: '#06b6d4' },
  { id: 'aus-open',    name: 'Australian Open',  alt: 'AO Melbourne',          type: 'tournament', module: 'tennis', flag: '🎾', accent: '#06b6d4' },

  // ── CYCLING ─────────────────────────────────────────────────────────────────
  { id: 'tour-de-france', name: 'Tour de France', alt: 'TdF Grand Tour',  type: 'tournament', module: 'cycling',   flag: '🚴', accent: '#f97316' },
  { id: 'giro-ditalia', name: "Giro d'Italia",   alt: 'Corsa Rosa',       type: 'tournament', module: 'cycling',   flag: '🚴', accent: '#f97316' },
  { id: 'vuelta',       name: 'La Vuelta',        alt: 'Vuelta a España',  type: 'tournament', module: 'cycling',   flag: '🚴', accent: '#f97316' },
  { id: 'merckx',       name: 'Eddy Merckx',      alt: 'The Cannibal',    type: 'person',     module: 'cycling',   flag: '🇧🇪', accent: '#f97316' },
  { id: 'froome',       name: 'Chris Froome',     alt: 'Team Sky',        type: 'person',     module: 'cycling',   flag: '🇬🇧', accent: '#f97316' },
  { id: 'pogacar',      name: 'Tadej Pogačar',    alt: 'UAE Tour',        type: 'person',     module: 'cycling',   flag: '🇸🇮', accent: '#f97316' },
  { id: 'bel-cycling',  name: 'Belgium',          alt: 'Cycling powerhouse', type: 'nation', module: 'cycling',   flag: '🇧🇪', accent: '#f97316' },

  // ── RUGBY LEAGUE ─────────────────────────────────────────────────────────────
  { id: 'aus-rleague',  name: 'Australia',        alt: 'Kangaroos RL',    type: 'nation',     module: 'rugby-league', flag: '🇦🇺', accent: '#f59e0b' },
  { id: 'gb-rleague',   name: 'Great Britain',    alt: 'Lions RL',        type: 'nation',     module: 'rugby-league', flag: '🇬🇧', accent: '#f59e0b' },
  { id: 'nz-rleague',   name: 'New Zealand',      alt: 'Kiwis RL',        type: 'nation',     module: 'rugby-league', flag: '🇳🇿', accent: '#f59e0b' },
  { id: 'rl-wc',        name: 'Rugby League World Cup', alt: 'RLWC',      type: 'tournament', module: 'rugby-league', flag: '🏈', accent: '#f59e0b' },
  { id: 'state-origin', name: 'State of Origin',  alt: 'NSW vs QLD',      type: 'tournament', module: 'rugby-league', flag: '🏈', accent: '#f59e0b' },

  // ── GAELIC ──────────────────────────────────────────────────────────────────
  { id: 'kerry-gaa',    name: 'Kerry',            alt: 'Kingdom GAA',     type: 'nation',     module: 'gaelic',     flag: '🇮🇪', accent: '#16a34a' },
  { id: 'dublin-gaa',   name: 'Dublin',           alt: 'Dubs GAA',        type: 'nation',     module: 'gaelic',     flag: '🇮🇪', accent: '#16a34a' },
  { id: 'kilkenny-gaa', name: 'Kilkenny',         alt: 'Cats Hurling',    type: 'nation',     module: 'gaelic',     flag: '🇮🇪', accent: '#16a34a' },
  { id: 'all-ireland',  name: 'All-Ireland Championship', alt: 'Sam Maguire', type: 'tournament', module: 'gaelic', flag: '🏑', accent: '#16a34a' },
  { id: 'hurling-final', name: 'All-Ireland Hurling', alt: 'Liam MacCarthy', type: 'tournament', module: 'gaelic', flag: '🥍', accent: '#16a34a' },

  // ── ELECTIONS ───────────────────────────────────────────────────────────────
  { id: 'usa-elections', name: 'USA Elections',   alt: 'Presidential race', type: 'event',   module: 'elections',  flag: '🇺🇸', accent: '#6366f1' },
  { id: 'uk-elections',  name: 'UK Elections',    alt: 'General Election',  type: 'event',   module: 'elections',  flag: '🇬🇧', accent: '#6366f1' },
  { id: 'fra-elections', name: 'France Elections', alt: 'Présidentielle',   type: 'event',   module: 'elections',  flag: '🇫🇷', accent: '#6366f1' },
  { id: 'brexit',        name: 'Brexit',          alt: 'UK EU referendum',  type: 'event',   module: 'elections',  flag: '🗳️', accent: '#6366f1' },
  { id: 'voter-turnout', name: 'Voter Turnout',   alt: 'Electoral participation', type: 'record', module: 'elections', flag: '🗳️', accent: '#6366f1' },

  // ── EUROVISION ──────────────────────────────────────────────────────────────
  { id: 'ire-eurovision', name: 'Ireland',        alt: '7x Eurovision winner', type: 'nation', module: 'eurovision', flag: '🇮🇪', accent: '#ec4899' },
  { id: 'swe-eurovision', name: 'Sweden',         alt: '7x Eurovision winner', type: 'nation', module: 'eurovision', flag: '🇸🇪', accent: '#ec4899' },
  { id: 'abba-eurovision', name: 'ABBA',          alt: 'Waterloo 1974',     type: 'person',   module: 'eurovision', flag: '🇸🇪', accent: '#ec4899' },
  { id: 'esc-2024',       name: 'Eurovision 2024', alt: 'Nemo Switzerland', type: 'event',    module: 'eurovision', flag: '🎤', accent: '#ec4899' },
  { id: 'esc-record-pts', name: 'Eurovision Points Record', alt: '758 pts 2023', type: 'record', module: 'eurovision', flag: '🎤', accent: '#ec4899' },

  // ── NOBEL ───────────────────────────────────────────────────────────────────
  { id: 'usa-nobel',      name: 'USA Nobel Prizes', alt: '400+ laureates',  type: 'nation',   module: 'nobel',      flag: '🇺🇸', accent: '#d4a017' },
  { id: 'physics-nobel',  name: 'Nobel Physics',    alt: 'Physics Prize',   type: 'event',    module: 'nobel',      flag: '⚛️', accent: '#d4a017' },
  { id: 'peace-nobel',    name: 'Nobel Peace Prize', alt: 'Oslo Norway',    type: 'event',    module: 'nobel',      flag: '🕊️', accent: '#d4a017' },
  { id: 'malala-nobel',   name: 'Malala Yousafzai', alt: 'Youngest laureate 17', type: 'person', module: 'nobel', flag: '🇵🇰', accent: '#d4a017' },
  { id: 'curie-nobel',    name: 'Marie Curie',      alt: 'Two Nobel prizes', type: 'person',  module: 'nobel',      flag: '🇵🇱', accent: '#d4a017' },

  // ── DEMOGRAPHICS ────────────────────────────────────────────────────────────
  { id: 'ind-demo',       name: 'India',            alt: "World's most populous 2023", type: 'nation', module: 'demographics', flag: '🇮🇳', accent: '#0ea5e9' },
  { id: 'chn-demo',       name: 'China',            alt: '1.4 billion',     type: 'nation',   module: 'demographics', flag: '🇨🇳', accent: '#0ea5e9' },
  { id: 'tokyo-city',     name: 'Tokyo',            alt: "World's largest city", type: 'event', module: 'demographics', flag: '🇯🇵', accent: '#0ea5e9' },
  { id: 'world-pop',      name: 'World Population', alt: '8 billion milestone', type: 'record', module: 'demographics', flag: '🌍', accent: '#0ea5e9' },
  { id: 'africa-growth',  name: 'Africa Population Growth', alt: 'Fastest growing continent', type: 'record', module: 'demographics', flag: '🌍', accent: '#0ea5e9' },

  // ── ECONOMICS ───────────────────────────────────────────────────────────────
  { id: 'usa-gdp',        name: 'USA Economy',      alt: '$27T GDP largest', type: 'nation',  module: 'economics',  flag: '🇺🇸', accent: '#10b981' },
  { id: 'chn-gdp',        name: 'China Economy',    alt: '$17.5T GDP',      type: 'nation',   module: 'economics',  flag: '🇨🇳', accent: '#10b981' },
  { id: 'ind-gdp',        name: 'India Economy',    alt: 'Fastest growing major economy', type: 'nation', module: 'economics', flag: '🇮🇳', accent: '#10b981' },
  { id: 'gdp-world',      name: 'World GDP',        alt: '$105 trillion',   type: 'record',   module: 'economics',  flag: '📈', accent: '#10b981' },
  { id: 'gini-index',     name: 'Gini Coefficient', alt: 'Income inequality', type: 'record', module: 'economics',  flag: '📊', accent: '#10b981' },
  { id: 'debt-japan',     name: 'Japan National Debt', alt: '263% GDP',     type: 'record',   module: 'economics',  flag: '🇯🇵', accent: '#10b981' },
];

export const MODULE_INFO = {
  rugby:        { label: 'Rugby Union',   emoji: '🏉', accent: '#10b981' },
  football:     { label: 'Football',      emoji: '⚽', accent: '#3b82f6' },
  olympics:     { label: 'Olympics',      emoji: '🏅', accent: '#f59e0b' },
  athletics:    { label: 'Athletics',     emoji: '🏃', accent: '#8b5cf6' },
  cricket:      { label: 'Cricket',       emoji: '🏏', accent: '#ef4444' },
  tennis:       { label: 'Tennis',        emoji: '🎾', accent: '#06b6d4' },
  cycling:      { label: 'Cycling',       emoji: '🚴', accent: '#f97316' },
  'rugby-league': { label: 'Rugby League', emoji: '🏈', accent: '#f59e0b' },
  gaelic:       { label: 'Gaelic',        emoji: '🏑', accent: '#16a34a' },
  elections:    { label: 'Elections',     emoji: '🗳️', accent: '#6366f1' },
  eurovision:   { label: 'Eurovision',    emoji: '🎤', accent: '#ec4899' },
  nobel:        { label: 'Nobel',         emoji: '🏆', accent: '#d4a017' },
  demographics: { label: 'Demographics',  emoji: '👥', accent: '#0ea5e9' },
  economics:    { label: 'Economics',     emoji: '📈', accent: '#10b981' },
};

export const TYPE_LABEL = {
  nation:     'Nation',
  tournament: 'Tournament',
  record:     'Record',
  person:     'Person',
  event:      'Event',
};
