// Upcoming men's international fixtures after the 2026 FIFA World Cup.
// The World Cup (11 June – 19 July 2026, won by Spain) is now complete — every
// match from that tournament lives in the results dataset (public/data/football-all.json).
//
// Next up: the 2026/27 UEFA Nations League league phase, played across a long
// September/October window (24 Sept – 6 Oct) and a November window (12–17 Nov).
// Matchday 1: 24–26 Sep · MD2: 27–29 Sep · MD3: 1–3 Oct · MD4: 4–6 Oct
// MD5: 12–14 Nov · MD6: 15–17 Nov
//
// League A groups: A1 France, Italy, Belgium, Türkiye · A2 Germany, Netherlands,
// Serbia, Greece · A3 Spain, Croatia, England, Czechia · A4 Portugal, Denmark,
// Norway, Wales. Scotland are in League B, Group B1 with Switzerland, Slovenia
// and North Macedonia.
//
// Only fixtures with confirmed dates are listed below.

export var FIXTURES_2026 = [
  // ── September 2026 — Nations League matchdays 1 & 2 ─────────────────────────
  {date:"2026-09-24",home:"Portugal",away:"Wales",tournament:"UEFA Nations League",group:"League A, Group 4 — MD1",venue:"",city:"Portugal"},
  {date:"2026-09-26",home:"England",away:"Spain",tournament:"UEFA Nations League",group:"League A, Group 3 — MD1",venue:"Wembley Stadium",city:"London"},
  {date:"2026-09-26",home:"Slovenia",away:"Scotland",tournament:"UEFA Nations League",group:"League B, Group 1 — MD1",venue:"",city:"Slovenia"},
  {date:"2026-09-27",home:"Denmark",away:"Wales",tournament:"UEFA Nations League",group:"League A, Group 4 — MD2",venue:"",city:"Denmark"},
  {date:"2026-09-29",home:"Czechia",away:"England",tournament:"UEFA Nations League",group:"League A, Group 3 — MD2",venue:"",city:"Czechia"},
  {date:"2026-09-29",home:"Scotland",away:"Switzerland",tournament:"UEFA Nations League",group:"League B, Group 1 — MD2",venue:"Hampden Park",city:"Glasgow"},

  // ── October 2026 — Nations League matchdays 3 & 4 ──────────────────────────
  {date:"2026-10-01",home:"Wales",away:"Norway",tournament:"UEFA Nations League",group:"League A, Group 4 — MD3",venue:"",city:"Cardiff"},
  {date:"2026-10-03",home:"Croatia",away:"England",tournament:"UEFA Nations League",group:"League A, Group 3 — MD3 (behind closed doors)",venue:"",city:"Croatia"},
  {date:"2026-10-03",home:"North Macedonia",away:"Scotland",tournament:"UEFA Nations League",group:"League B, Group 1 — MD3",venue:"",city:"North Macedonia"},
  {date:"2026-10-04",home:"Wales",away:"Denmark",tournament:"UEFA Nations League",group:"League A, Group 4 — MD4",venue:"",city:"Cardiff"},
  {date:"2026-10-06",home:"England",away:"Czechia",tournament:"UEFA Nations League",group:"League A, Group 3 — MD4",venue:"Wembley Stadium",city:"London"},
  {date:"2026-10-06",home:"Scotland",away:"Slovenia",tournament:"UEFA Nations League",group:"League B, Group 1 — MD4",venue:"Hampden Park",city:"Glasgow"},

  // ── November 2026 — Nations League matchdays 5 & 6 ─────────────────────────
  {date:"2026-11-12",home:"England",away:"Croatia",tournament:"UEFA Nations League",group:"League A, Group 3 — MD5",venue:"Wembley Stadium",city:"London"},
  {date:"2026-11-13",home:"Scotland",away:"North Macedonia",tournament:"UEFA Nations League",group:"League B, Group 1 — MD5",venue:"Hampden Park",city:"Glasgow"},
  {date:"2026-11-14",home:"Norway",away:"Wales",tournament:"UEFA Nations League",group:"League A, Group 4 — MD5",venue:"",city:"Norway"},
  {date:"2026-11-15",home:"Spain",away:"England",tournament:"UEFA Nations League",group:"League A, Group 3 — MD6",venue:"",city:"Spain"},
  {date:"2026-11-16",home:"Switzerland",away:"Scotland",tournament:"UEFA Nations League",group:"League B, Group 1 — MD6",venue:"",city:"Switzerland"},
  {date:"2026-11-17",home:"Wales",away:"Portugal",tournament:"UEFA Nations League",group:"League A, Group 4 — MD6",venue:"",city:"Cardiff"},
];
