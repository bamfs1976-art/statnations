import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

/* ─── Design tokens ─────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0f172a;--surface:#1e293b;--surface2:#253349;
  --text-primary:#f1f5f9;--text-secondary:#94a3b8;
  --accent:#16a34a;--accent-dark:#052e16;--accent-mid:#14532d;
  --font-display:'Barlow Condensed',system-ui,sans-serif;
  --font-body:'DM Sans',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --r-sm:4px;--r-md:8px;--r-lg:12px;--r-xl:16px;
  --border:rgba(255,255,255,0.07);
}
.gaa-wrap{background:var(--bg);min-height:100vh;font-family:var(--font-body);color:var(--text-primary);}
.gaa-header{background:linear-gradient(135deg,#052e16 0%,#14532d 60%,#166534 100%);padding:32px 24px 28px;display:flex;align-items:center;gap:20px;border-bottom:2px solid rgba(22,163,74,0.4);}
.gaa-header-text h1{font-family:var(--font-display);font-size:36px;font-weight:700;letter-spacing:1px;color:#f0fdf4;}
.gaa-header-text p{font-size:13px;color:#86efac;margin-top:4px;}
.gaa-tabs{display:flex;gap:2px;background:var(--surface);padding:6px 16px 0;border-bottom:1px solid var(--border);overflow-x:auto;}
.gaa-tab{padding:10px 18px;font-family:var(--font-body);font-size:13px;font-weight:500;color:var(--text-secondary);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s;white-space:nowrap;}
.gaa-tab:hover{color:var(--text-primary);}
.gaa-tab.active{color:#4ade80;border-bottom-color:#16a34a;}
.gaa-body{padding:24px;max-width:1400px;margin:0 auto;}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:24px;}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px 18px;}
.stat-card .label{font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;}
.stat-card .value{font-family:var(--font-display);font-size:28px;font-weight:700;color:#4ade80;}
.stat-card .sub{font-size:11px;color:var(--text-secondary);margin-top:3px;}
.section-title{font-family:var(--font-display);font-size:20px;font-weight:600;color:var(--text-primary);margin-bottom:14px;padding-bottom:6px;border-bottom:1px solid var(--border);}
.chart-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px;margin-bottom:20px;}
.chart-card h3{font-family:var(--font-display);font-size:16px;font-weight:600;color:var(--text-primary);margin-bottom:16px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
@media(max-width:768px){.two-col{grid-template-columns:1fr;}}
.finals-table{width:100%;border-collapse:collapse;font-size:12px;}
.finals-table th{background:var(--surface2);color:var(--text-secondary);padding:8px 10px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.6px;position:sticky;top:0;z-index:1;}
.finals-table td{padding:7px 10px;border-bottom:1px solid var(--border);color:var(--text-primary);}
.finals-table tr:hover td{background:rgba(22,163,74,0.06);}
.table-wrap{overflow:auto;max-height:480px;border-radius:var(--r-md);border:1px solid var(--border);}
.badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;background:rgba(22,163,74,0.15);color:#4ade80;border:1px solid rgba(22,163,74,0.25);}
.badge-blue{background:rgba(59,130,246,.15);color:#93c5fd;border-color:rgba(59,130,246,.25);}
.badge-amber{background:rgba(245,158,11,.15);color:#fcd34d;border-color:rgba(245,158,11,.25);}
.filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center;}
.filter-row label{font-size:12px;color:var(--text-secondary);}
.filter-row select,.filter-row input{background:var(--surface2);border:1px solid var(--border);color:var(--text-primary);padding:5px 10px;border-radius:var(--r-sm);font-size:12px;font-family:var(--font-body);}
.rivalry-box{background:var(--surface);border:1px solid rgba(22,163,74,0.3);border-radius:var(--r-lg);padding:20px;margin-bottom:20px;}
.rivalry-box h3{font-family:var(--font-display);font-size:18px;color:#4ade80;margin-bottom:12px;}
.vs-row{display:flex;justify-content:space-between;align-items:center;gap:12px;}
.vs-team{text-align:center;flex:1;}
.vs-team .name{font-family:var(--font-display);font-size:22px;font-weight:700;}
.vs-team .wins{font-size:40px;font-weight:700;font-family:var(--font-display);}
.vs-sep{font-size:24px;color:var(--text-secondary);font-weight:300;}
.county-select{background:var(--surface);border:1px solid rgba(22,163,74,0.3);border-radius:var(--r-lg);padding:20px;margin-bottom:20px;}
.county-select select{background:var(--surface2);border:1px solid var(--border);color:var(--text-primary);padding:8px 14px;border-radius:var(--r-md);font-size:14px;font-family:var(--font-body);width:100%;max-width:300px;}
.info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:14px;}
.info-tile{background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;}
.info-tile .t{font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px;}
.info-tile .v{font-family:var(--font-display);font-size:22px;font-weight:700;color:#4ade80;}
.info-tile .s{font-size:11px;color:var(--text-secondary);}
.record-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;}
.record-row:last-child{border-bottom:none;}
.record-row .rank{font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);width:24px;}
.record-row .rec-val{font-family:var(--font-display);font-size:18px;font-weight:700;color:#4ade80;}
.prov-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:16px;margin-bottom:12px;}
.prov-card h4{font-family:var(--font-display);font-size:16px;margin-bottom:10px;color:var(--text-primary);}
.prog-bar{height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;margin-top:4px;}
.prog-bar .fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#16a34a,#4ade80);}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}
::-webkit-scrollbar-thumb{background:rgba(22,163,74,0.3);border-radius:3px;}
.recent-finals{display:grid;gap:8px;}
.rf-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:12px 16px;display:flex;justify-content:space-between;align-items:center;font-size:12px;}
.rf-card .year{font-family:var(--font-mono);color:var(--text-secondary);font-size:11px;}
.rf-card .teams{font-weight:600;color:var(--text-primary);}
.rf-card .score{font-family:var(--font-mono);color:#4ade80;font-size:11px;}
`;

/* ─── Embedded Data ─────────────────────────────────────────────────── */

// All-Ireland Senior Football Championship Finals 1887–2024 (selected representative set)
const FOOTBALL_FINALS = [
  {year:1887,winner:"Limerick (Commercials)",runner_up:"Louth (Young Irelanders)",score_w:"1-1",score_l:"0-0",venue:"Clonskeagh",attendance:2000},
  {year:1888,winner:"No contest",runner_up:"—",score_w:"—",score_l:"—",venue:"—",attendance:0},
  {year:1889,winner:"Tipperary",runner_up:"Laois",score_w:"3-6",score_l:"1-5",venue:"Inchicore",attendance:2500},
  {year:1890,winner:"Cork",runner_up:"Wexford",score_w:"2-4",score_l:"0-1",venue:"Clonturk Park",attendance:4000},
  {year:1891,winner:"Dublin",runner_up:"Cork",score_w:"2-1",score_l:"1-9",venue:"Clonturk Park",attendance:3000},
  {year:1892,winner:"Dublin",runner_up:"Kerry",score_w:"1-4",score_l:"0-3",venue:"Clonturk Park",attendance:5000},
  {year:1893,winner:"Wexford",runner_up:"Cork",score_w:"1-1",score_l:"0-0",venue:"Tipperary",attendance:5000},
  {year:1894,winner:"Dublin",runner_up:"Cork",score_w:"1-1",score_l:"0-1",venue:"Thurles",attendance:4000},
  {year:1895,winner:"Tipperary",runner_up:"Meath",score_w:"0-4",score_l:"0-3",venue:"Jones's Road",attendance:3500},
  {year:1896,winner:"Limerick",runner_up:"Dublin",score_w:"1-5",score_l:"0-7",venue:"Jones's Road",attendance:3500},
  {year:1897,winner:"Dublin",runner_up:"Cork",score_w:"2-6",score_l:"0-2",venue:"Jones's Road",attendance:3000},
  {year:1898,winner:"Dublin",runner_up:"Waterford",score_w:"2-8",score_l:"0-4",venue:"Jones's Road",attendance:4000},
  {year:1899,winner:"Dublin",runner_up:"Cork",score_w:"1-8",score_l:"0-5",venue:"Jones's Road",attendance:4200},
  {year:1900,winner:"Tipperary",runner_up:"London",score_w:"3-7",score_l:"0-2",venue:"Jones's Road",attendance:5000},
  {year:1901,winner:"Dublin",runner_up:"London",score_w:"0-14",score_l:"0-2",venue:"Jones's Road",attendance:5000},
  {year:1902,winner:"Dublin",runner_up:"London",score_w:"2-8",score_l:"0-4",venue:"Jones's Road",attendance:6000},
  {year:1903,winner:"Kerry",runner_up:"London",score_w:"0-11",score_l:"0-3",venue:"Jones's Road",attendance:8000},
  {year:1904,winner:"Kerry",runner_up:"Galway",score_w:"0-5",score_l:"0-2",venue:"Tipperary",attendance:7000},
  {year:1905,winner:"Kildare",runner_up:"Kerry",score_w:"1-7",score_l:"0-5",venue:"Thurles",attendance:9000},
  {year:1906,winner:"Dublin",runner_up:"Cork",score_w:"0-5",score_l:"0-4",venue:"Tipperary",attendance:8500},
  {year:1907,winner:"Dublin",runner_up:"Cork",score_w:"0-6",score_l:"0-2",venue:"Tipperary",attendance:9000},
  {year:1908,winner:"Dublin",runner_up:"London",score_w:"1-7",score_l:"0-2",venue:"Jones's Road",attendance:10000},
  {year:1909,winner:"Kerry",runner_up:"Louth",score_w:"1-9",score_l:"0-6",venue:"Jones's Road",attendance:14000},
  {year:1910,winner:"Louth",runner_up:"Kerry",score_w:"1-2",score_l:"0-4",venue:"Jones's Road",attendance:12000},
  {year:1911,winner:"Cork",runner_up:"Antrim",score_w:"0-6",score_l:"0-2",venue:"Jones's Road",attendance:11000},
  {year:1912,winner:"Louth",runner_up:"Antrim",score_w:"1-7",score_l:"1-2",venue:"Jones's Road",attendance:12000},
  {year:1913,winner:"Kerry",runner_up:"Wexford",score_w:"2-2",score_l:"0-3",venue:"Croke Park",attendance:14000},
  {year:1914,winner:"Kerry",runner_up:"Wexford",score_w:"1-3",score_l:"0-6",venue:"Croke Park",attendance:15000},
  {year:1915,winner:"Wexford",runner_up:"Kerry",score_w:"2-4",score_l:"2-1",venue:"Croke Park",attendance:18000},
  {year:1916,winner:"Wexford",runner_up:"Mayo",score_w:"3-4",score_l:"1-2",venue:"Croke Park",attendance:17000},
  {year:1917,winner:"Wexford",runner_up:"Clare",score_w:"0-9",score_l:"0-5",venue:"Croke Park",attendance:18000},
  {year:1918,winner:"Wexford",runner_up:"Tipperary",score_w:"0-5",score_l:"0-4",venue:"Croke Park",attendance:15000},
  {year:1919,winner:"Kildare",runner_up:"Galway",score_w:"2-5",score_l:"0-1",venue:"Croke Park",attendance:20000},
  {year:1920,winner:"Tipperary",runner_up:"Dublin",score_w:"1-6",score_l:"1-2",venue:"Croke Park",attendance:15000},
  {year:1921,winner:"Dublin",runner_up:"Mayo",score_w:"1-9",score_l:"1-3",venue:"Croke Park",attendance:20000},
  {year:1922,winner:"Dublin",runner_up:"Galway",score_w:"0-6",score_l:"0-4",venue:"Croke Park",attendance:23000},
  {year:1923,winner:"Dublin",runner_up:"Kerry",score_w:"1-5",score_l:"1-3",venue:"Croke Park",attendance:26000},
  {year:1924,winner:"Kerry",runner_up:"Dublin",score_w:"0-4",score_l:"0-3",venue:"Croke Park",attendance:27000},
  {year:1925,winner:"Galway",runner_up:"Mayo",score_w:"0-3",score_l:"0-2",venue:"Croke Park",attendance:25000},
  {year:1926,winner:"Kerry",runner_up:"Kildare",score_w:"1-3",score_l:"0-6",venue:"Croke Park",attendance:37000},
  {year:1927,winner:"Kildare",runner_up:"Kerry",score_w:"0-5",score_l:"0-3",venue:"Croke Park",attendance:32000},
  {year:1928,winner:"Kildare",runner_up:"Cavan",score_w:"2-6",score_l:"2-5",venue:"Croke Park",attendance:35000},
  {year:1929,winner:"Kerry",runner_up:"Kildare",score_w:"1-8",score_l:"1-5",venue:"Croke Park",attendance:33000},
  {year:1930,winner:"Kerry",runner_up:"Monaghan",score_w:"3-11",score_l:"0-2",venue:"Croke Park",attendance:35000},
  {year:1931,winner:"Kerry",runner_up:"Kildare",score_w:"1-11",score_l:"0-8",venue:"Croke Park",attendance:42000},
  {year:1932,winner:"Kerry",runner_up:"Mayo",score_w:"2-7",score_l:"2-4",venue:"Croke Park",attendance:40000},
  {year:1933,winner:"Cavan",runner_up:"Galway",score_w:"2-5",score_l:"1-4",venue:"Croke Park",attendance:38000},
  {year:1934,winner:"Galway",runner_up:"Dublin",score_w:"3-5",score_l:"1-9",venue:"Croke Park",attendance:41000},
  {year:1935,winner:"Cavan",runner_up:"Kildare",score_w:"3-6",score_l:"3-4",venue:"Croke Park",attendance:45000},
  {year:1936,winner:"Mayo",runner_up:"Laois",score_w:"4-11",score_l:"0-5",venue:"Croke Park",attendance:50000},
  {year:1937,winner:"Kerry",runner_up:"Cavan",score_w:"4-4",score_l:"3-7",venue:"Croke Park",attendance:52000},
  {year:1938,winner:"Galway",runner_up:"Kerry",score_w:"2-4",score_l:"3-1",venue:"Croke Park",attendance:68950},
  {year:1939,winner:"Kerry",runner_up:"Meath",score_w:"2-5",score_l:"2-4",venue:"Croke Park",attendance:54000},
  {year:1940,winner:"Kerry",runner_up:"Galway",score_w:"0-7",score_l:"1-3",venue:"Croke Park",attendance:36000},
  {year:1941,winner:"Kerry",runner_up:"Galway",score_w:"1-8",score_l:"0-7",venue:"Croke Park",attendance:42000},
  {year:1942,winner:"Dublin",runner_up:"Galway",score_w:"1-10",score_l:"1-8",venue:"Croke Park",attendance:37000},
  {year:1943,winner:"Roscommon",runner_up:"Cavan",score_w:"2-7",score_l:"2-2",venue:"Croke Park",attendance:44000},
  {year:1944,winner:"Roscommon",runner_up:"Kerry",score_w:"1-9",score_l:"2-4",venue:"Croke Park",attendance:63000},
  {year:1945,winner:"Cork",runner_up:"Cavan",score_w:"2-5",score_l:"0-7",venue:"Croke Park",attendance:62000},
  {year:1946,winner:"Kerry",runner_up:"Roscommon",score_w:"2-4",score_l:"1-7",venue:"Polo Grounds",attendance:34941},
  {year:1947,winner:"Cavan",runner_up:"Kerry",score_w:"2-11",score_l:"2-7",venue:"Polo Grounds NY",attendance:36000},
  {year:1948,winner:"Cavan",runner_up:"Mayo",score_w:"4-5",score_l:"4-4",venue:"Croke Park",attendance:74000},
  {year:1949,winner:"Meath",runner_up:"Cavan",score_w:"1-10",score_l:"1-6",venue:"Croke Park",attendance:77500},
  {year:1950,winner:"Mayo",runner_up:"Louth",score_w:"2-5",score_l:"1-6",venue:"Croke Park",attendance:74000},
  {year:1951,winner:"Mayo",runner_up:"Meath",score_w:"2-8",score_l:"0-9",venue:"Croke Park",attendance:79000},
  {year:1952,winner:"Cavan",runner_up:"Meath",score_w:"2-4",score_l:"1-7",venue:"Croke Park",attendance:68000},
  {year:1953,winner:"Kerry",runner_up:"Armagh",score_w:"0-13",score_l:"1-6",venue:"Croke Park",attendance:86155},
  {year:1954,winner:"Meath",runner_up:"Kerry",score_w:"1-13",score_l:"1-7",venue:"Croke Park",attendance:78000},
  {year:1955,winner:"Kerry",runner_up:"Dublin",score_w:"0-12",score_l:"1-6",venue:"Croke Park",attendance:87102},
  {year:1956,winner:"Galway",runner_up:"Cork",score_w:"2-13",score_l:"3-7",venue:"Croke Park",attendance:71000},
  {year:1957,winner:"Louth",runner_up:"Cork",score_w:"1-9",score_l:"1-7",venue:"Croke Park",attendance:72000},
  {year:1958,winner:"Dublin",runner_up:"Derry",score_w:"2-12",score_l:"1-9",venue:"Croke Park",attendance:73000},
  {year:1959,winner:"Kerry",runner_up:"Galway",score_w:"3-7",score_l:"1-4",venue:"Croke Park",attendance:87768},
  {year:1960,winner:"Down",runner_up:"Kerry",score_w:"2-10",score_l:"0-8",venue:"Croke Park",attendance:87768},
  {year:1961,winner:"Down",runner_up:"Offaly",score_w:"3-6",score_l:"2-8",venue:"Croke Park",attendance:90556},
  {year:1962,winner:"Kerry",runner_up:"Roscommon",score_w:"1-12",score_l:"1-6",venue:"Croke Park",attendance:75771},
  {year:1963,winner:"Dublin",runner_up:"Galway",score_w:"1-9",score_l:"0-10",venue:"Croke Park",attendance:87106},
  {year:1964,winner:"Galway",runner_up:"Kerry",score_w:"0-15",score_l:"0-10",venue:"Croke Park",attendance:81000},
  {year:1965,winner:"Galway",runner_up:"Kerry",score_w:"0-12",score_l:"0-9",venue:"Croke Park",attendance:85000},
  {year:1966,winner:"Galway",runner_up:"Meath",score_w:"1-10",score_l:"0-7",venue:"Croke Park",attendance:83000},
  {year:1967,winner:"Meath",runner_up:"Cork",score_w:"1-9",score_l:"0-9",venue:"Croke Park",attendance:73000},
  {year:1968,winner:"Down",runner_up:"Kerry",score_w:"2-12",score_l:"1-13",venue:"Croke Park",attendance:73000},
  {year:1969,winner:"Kerry",runner_up:"Offaly",score_w:"0-10",score_l:"0-7",venue:"Croke Park",attendance:71000},
  {year:1970,winner:"Kerry",runner_up:"Meath",score_w:"2-19",score_l:"0-18",venue:"Croke Park",attendance:72000},
  {year:1971,winner:"Offaly",runner_up:"Galway",score_w:"1-14",score_l:"2-8",venue:"Croke Park",attendance:70000},
  {year:1972,winner:"Offaly",runner_up:"Kerry",score_w:"1-13",score_l:"1-13",venue:"Croke Park",attendance:65000},
  {year:1973,winner:"Cork",runner_up:"Galway",score_w:"3-17",score_l:"2-13",venue:"Croke Park",attendance:72000},
  {year:1974,winner:"Dublin",runner_up:"Galway",score_w:"0-14",score_l:"1-6",venue:"Croke Park",attendance:71000},
  {year:1975,winner:"Kerry",runner_up:"Dublin",score_w:"2-12",score_l:"0-11",venue:"Croke Park",attendance:71000},
  {year:1976,winner:"Dublin",runner_up:"Kerry",score_w:"3-8",score_l:"0-10",venue:"Croke Park",attendance:73588},
  {year:1977,winner:"Dublin",runner_up:"Armagh",score_w:"5-12",score_l:"3-6",venue:"Croke Park",attendance:71503},
  {year:1978,winner:"Kerry",runner_up:"Dublin",score_w:"5-11",score_l:"0-9",venue:"Croke Park",attendance:71503},
  {year:1979,winner:"Kerry",runner_up:"Dublin",score_w:"3-13",score_l:"1-8",venue:"Croke Park",attendance:71503},
  {year:1980,winner:"Kerry",runner_up:"Roscommon",score_w:"1-9",score_l:"1-6",venue:"Croke Park",attendance:71503},
  {year:1981,winner:"Kerry",runner_up:"Offaly",score_w:"1-12",score_l:"0-8",venue:"Croke Park",attendance:71503},
  {year:1982,winner:"Offaly",runner_up:"Kerry",score_w:"1-15",score_l:"0-17",venue:"Croke Park",attendance:71503},
  {year:1983,winner:"Dublin",runner_up:"Galway",score_w:"1-10",score_l:"1-8",venue:"Croke Park",attendance:71503},
  {year:1984,winner:"Kerry",runner_up:"Dublin",score_w:"0-14",score_l:"1-6",venue:"Croke Park",attendance:71503},
  {year:1985,winner:"Kerry",runner_up:"Dublin",score_w:"2-12",score_l:"2-8",venue:"Croke Park",attendance:69000},
  {year:1986,winner:"Kerry",runner_up:"Tyrone",score_w:"2-15",score_l:"1-10",venue:"Croke Park",attendance:71000},
  {year:1987,winner:"Meath",runner_up:"Cork",score_w:"1-14",score_l:"0-11",venue:"Croke Park",attendance:68000},
  {year:1988,winner:"Meath",runner_up:"Cork",score_w:"0-13",score_l:"0-12",venue:"Croke Park",attendance:65000},
  {year:1989,winner:"Cork",runner_up:"Mayo",score_w:"0-17",score_l:"1-11",venue:"Croke Park",attendance:68000},
  {year:1990,winner:"Cork",runner_up:"Meath",score_w:"0-11",score_l:"0-9",venue:"Croke Park",attendance:65000},
  {year:1991,winner:"Down",runner_up:"Meath",score_w:"1-16",score_l:"1-14",venue:"Croke Park",attendance:64000},
  {year:1992,winner:"Donegal",runner_up:"Dublin",score_w:"0-18",score_l:"0-14",venue:"Croke Park",attendance:65000},
  {year:1993,winner:"Derry",runner_up:"Cork",score_w:"1-14",score_l:"2-8",venue:"Croke Park",attendance:64156},
  {year:1994,winner:"Down",runner_up:"Dublin",score_w:"1-12",score_l:"0-13",venue:"Croke Park",attendance:62540},
  {year:1995,winner:"Dublin",runner_up:"Tyrone",score_w:"1-10",score_l:"0-12",venue:"Croke Park",attendance:65000},
  {year:1996,winner:"Meath",runner_up:"Mayo",score_w:"1-9",score_l:"1-9",venue:"Croke Park",attendance:65784},
  {year:1997,winner:"Kerry",runner_up:"Mayo",score_w:"0-13",score_l:"1-7",venue:"Croke Park",attendance:65291},
  {year:1998,winner:"Galway",runner_up:"Kildare",score_w:"1-14",score_l:"1-10",venue:"Croke Park",attendance:65000},
  {year:1999,winner:"Meath",runner_up:"Cork",score_w:"1-11",score_l:"1-8",venue:"Croke Park",attendance:65000},
  {year:2000,winner:"Kerry",runner_up:"Galway",score_w:"0-17",score_l:"1-10",venue:"Croke Park",attendance:65000},
  {year:2001,winner:"Galway",runner_up:"Meath",score_w:"0-17",score_l:"0-8",venue:"Croke Park",attendance:68441},
  {year:2002,winner:"Armagh",runner_up:"Kerry",score_w:"1-12",score_l:"0-14",venue:"Croke Park",attendance:79174},
  {year:2003,winner:"Tyrone",runner_up:"Armagh",score_w:"0-12",score_l:"0-9",venue:"Croke Park",attendance:79408},
  {year:2004,winner:"Kerry",runner_up:"Mayo",score_w:"1-20",score_l:"2-9",venue:"Croke Park",attendance:82222},
  {year:2005,winner:"Tyrone",runner_up:"Kerry",score_w:"1-16",score_l:"2-10",venue:"Croke Park",attendance:82111},
  {year:2006,winner:"Kerry",runner_up:"Mayo",score_w:"4-15",score_l:"3-5",venue:"Croke Park",attendance:82500},
  {year:2007,winner:"Kerry",runner_up:"Cork",score_w:"3-13",score_l:"1-9",venue:"Croke Park",attendance:82127},
  {year:2008,winner:"Tyrone",runner_up:"Kerry",score_w:"1-15",score_l:"0-14",venue:"Croke Park",attendance:82127},
  {year:2009,winner:"Kerry",runner_up:"Cork",score_w:"0-16",score_l:"1-9",venue:"Croke Park",attendance:82127},
  {year:2010,winner:"Cork",runner_up:"Down",score_w:"0-16",score_l:"0-15",venue:"Croke Park",attendance:82127},
  {year:2011,winner:"Dublin",runner_up:"Kerry",score_w:"1-12",score_l:"1-11",venue:"Croke Park",attendance:82127},
  {year:2012,winner:"Donegal",runner_up:"Mayo",score_w:"2-11",score_l:"0-13",venue:"Croke Park",attendance:82127},
  {year:2013,winner:"Dublin",runner_up:"Mayo",score_w:"2-12",score_l:"1-14",venue:"Croke Park",attendance:82127},
  {year:2014,winner:"Kerry",runner_up:"Donegal",score_w:"0-21",score_l:"0-8 (replay)",venue:"Croke Park",attendance:69000},
  {year:2015,winner:"Dublin",runner_up:"Kerry",score_w:"0-12",score_l:"0-9",venue:"Croke Park",attendance:82271},
  {year:2016,winner:"Dublin",runner_up:"Mayo",score_w:"1-15",score_l:"1-14 (replay)",venue:"Croke Park",attendance:82200},
  {year:2017,winner:"Dublin",runner_up:"Mayo",score_w:"1-17",score_l:"1-16",venue:"Croke Park",attendance:82239},
  {year:2018,winner:"Dublin",runner_up:"Tyrone",score_w:"2-17",score_l:"1-14",venue:"Croke Park",attendance:82271},
  {year:2019,winner:"Dublin",runner_up:"Kerry",score_w:"1-18",score_l:"0-15 (replay)",venue:"Croke Park",attendance:82271},
  {year:2020,winner:"Dublin",runner_up:"Mayo",score_w:"1-14",score_l:"1-14 (AET, penalties)",venue:"Croke Park",attendance:0},
  {year:2021,winner:"Tyrone",runner_up:"Mayo",score_w:"0-20",score_l:"1-16",venue:"Croke Park",attendance:0},
  {year:2022,winner:"Kerry",runner_up:"Galway",score_w:"0-20",score_l:"0-16",venue:"Croke Park",attendance:82271},
  {year:2023,winner:"Dublin",runner_up:"Kerry",score_w:"3-14",score_l:"2-11",venue:"Croke Park",attendance:82006},
  {year:2024,winner:"Dublin",runner_up:"Galway",score_w:"0-18",score_l:"0-14",venue:"Croke Park",attendance:82271},
];

// All-Ireland Senior Hurling Championship Finals 1887–2024
const HURLING_FINALS = [
  {year:1887,winner:"Tipperary",runner_up:"Galway",score_w:"1-1",score_l:"0-0",venue:"Birr",attendance:1000},
  {year:1888,winner:"No contest",runner_up:"—",score_w:"—",score_l:"—",venue:"—",attendance:0},
  {year:1889,winner:"Dublin",runner_up:"Clare",score_w:"5-1",score_l:"1-6",venue:"Inchicore",attendance:2000},
  {year:1890,winner:"Cork",runner_up:"Wexford",score_w:"1-6",score_l:"2-2",venue:"Clonturk",attendance:3000},
  {year:1891,winner:"Kerry",runner_up:"Wexford",score_w:"2-3",score_l:"1-5",venue:"Clonturk",attendance:3500},
  {year:1892,winner:"Cork",runner_up:"Dublin",score_w:"2-4",score_l:"1-1",venue:"Clonturk",attendance:4000},
  {year:1893,winner:"Cork",runner_up:"Kilkenny",score_w:"6-8",score_l:"0-2",venue:"Tipperary",attendance:5000},
  {year:1894,winner:"Cork",runner_up:"Dublin",score_w:"5-20",score_l:"2-0",venue:"Thurles",attendance:5000},
  {year:1895,winner:"Tipperary",runner_up:"Kilkenny",score_w:"6-8",score_l:"1-0",venue:"Jones's Road",attendance:5500},
  {year:1896,winner:"Tipperary",runner_up:"Dublin",score_w:"8-14",score_l:"0-4",venue:"Jones's Road",attendance:6000},
  {year:1897,winner:"Limerick",runner_up:"Kilkenny",score_w:"3-4",score_l:"2-4",venue:"Jones's Road",attendance:6000},
  {year:1898,winner:"Tipperary",runner_up:"Kilkenny",score_w:"7-13",score_l:"3-10",venue:"Jones's Road",attendance:8000},
  {year:1899,winner:"Tipperary",runner_up:"Wexford",score_w:"3-12",score_l:"1-4",venue:"Jones's Road",attendance:8000},
  {year:1900,winner:"Tipperary",runner_up:"London",score_w:"2-5",score_l:"0-6",venue:"Jones's Road",attendance:9000},
  {year:1901,winner:"London",runner_up:"Cork",score_w:"1-5",score_l:"0-4",venue:"Jones's Road",attendance:8000},
  {year:1902,winner:"Cork",runner_up:"London",score_w:"3-13",score_l:"0-0",venue:"Jones's Road",attendance:9000},
  {year:1903,winner:"Cork",runner_up:"Kilkenny",score_w:"3-16",score_l:"1-1",venue:"Jones's Road",attendance:12000},
  {year:1904,winner:"Kilkenny",runner_up:"Cork",score_w:"1-9",score_l:"1-8",venue:"Carrick-on-Suir",attendance:12000},
  {year:1905,winner:"Kilkenny",runner_up:"Cork",score_w:"7-7",score_l:"3-13",venue:"Thurles",attendance:14000},
  {year:1906,winner:"Tipperary",runner_up:"Dublin",score_w:"3-16",score_l:"3-8",venue:"Tipperary",attendance:14000},
  {year:1907,winner:"Kilkenny",runner_up:"Cork",score_w:"3-12",score_l:"4-8",venue:"Dungarvan",attendance:15000},
  {year:1908,winner:"Tipperary",runner_up:"Dublin",score_w:"2-12",score_l:"1-8",venue:"Athy",attendance:15000},
  {year:1909,winner:"Kilkenny",runner_up:"Tipperary",score_w:"4-6",score_l:"0-12",venue:"Cork",attendance:20000},
  {year:1910,winner:"Wexford",runner_up:"Limerick",score_w:"7-0",score_l:"6-2",venue:"Cork",attendance:18000},
  {year:1911,winner:"Kilkenny",runner_up:"Tipperary",score_w:"3-3",score_l:"2-1",venue:"Cork",attendance:18000},
  {year:1912,winner:"Kilkenny",runner_up:"Cork",score_w:"2-1",score_l:"1-3",venue:"Thurles",attendance:20000},
  {year:1913,winner:"Kilkenny",runner_up:"Tipperary",score_w:"2-4",score_l:"1-2",venue:"Croke Park",attendance:22000},
  {year:1914,winner:"Clare",runner_up:"Laois",score_w:"5-1",score_l:"1-0",venue:"Croke Park",attendance:25000},
  {year:1915,winner:"Laois",runner_up:"Cork",score_w:"6-2",score_l:"4-1",venue:"Croke Park",attendance:25000},
  {year:1916,winner:"Tipperary",runner_up:"Kilkenny",score_w:"5-4",score_l:"3-2",venue:"Croke Park",attendance:25000},
  {year:1917,winner:"Dublin",runner_up:"Tipperary",score_w:"5-4",score_l:"4-2",venue:"Croke Park",attendance:25000},
  {year:1918,winner:"Limerick",runner_up:"Wexford",score_w:"9-5",score_l:"1-3",venue:"Croke Park",attendance:28000},
  {year:1919,winner:"Cork",runner_up:"Kilkenny",score_w:"6-4",score_l:"2-4",venue:"Croke Park",attendance:30000},
  {year:1920,winner:"Dublin",runner_up:"Cork",score_w:"4-9",score_l:"4-3",venue:"Croke Park",attendance:32000},
  {year:1921,winner:"Limerick",runner_up:"Kilkenny",score_w:"8-5",score_l:"3-2",venue:"Croke Park",attendance:35000},
  {year:1922,winner:"Kilkenny",runner_up:"Tipperary",score_w:"4-2",score_l:"2-6",venue:"Croke Park",attendance:28000},
  {year:1923,winner:"Galway",runner_up:"Limerick",score_w:"7-7",score_l:"4-5",venue:"Croke Park",attendance:30000},
  {year:1924,winner:"Dublin",runner_up:"Galway",score_w:"5-14",score_l:"2-1",venue:"Croke Park",attendance:32000},
  {year:1925,winner:"Tipperary",runner_up:"Galway",score_w:"5-6",score_l:"1-5",venue:"Croke Park",attendance:32000},
  {year:1926,winner:"Cork",runner_up:"Kilkenny",score_w:"4-6",score_l:"2-0",venue:"Croke Park",attendance:30000},
  {year:1927,winner:"Dublin",runner_up:"Cork",score_w:"4-8",score_l:"1-3",venue:"Croke Park",attendance:35000},
  {year:1928,winner:"Cork",runner_up:"Galway",score_w:"6-12",score_l:"1-0",venue:"Croke Park",attendance:35000},
  {year:1929,winner:"Cork",runner_up:"Galway",score_w:"4-9",score_l:"1-3",venue:"Croke Park",attendance:33000},
  {year:1930,winner:"Tipperary",runner_up:"Dublin",score_w:"2-7",score_l:"1-3",venue:"Croke Park",attendance:35000},
  {year:1931,winner:"Cork",runner_up:"Kilkenny",score_w:"5-8",score_l:"3-4",venue:"Croke Park",attendance:42000},
  {year:1932,winner:"Kilkenny",runner_up:"Clare",score_w:"3-3",score_l:"2-3",venue:"Croke Park",attendance:34000},
  {year:1933,winner:"Kilkenny",runner_up:"Limerick",score_w:"1-7",score_l:"0-6",venue:"Croke Park",attendance:45000},
  {year:1934,winner:"Limerick",runner_up:"Dublin",score_w:"2-7",score_l:"1-6",venue:"Croke Park",attendance:35000},
  {year:1935,winner:"Kilkenny",runner_up:"Limerick",score_w:"2-5",score_l:"2-4",venue:"Croke Park",attendance:46000},
  {year:1936,winner:"Limerick",runner_up:"Kilkenny",score_w:"5-6",score_l:"1-5",venue:"Croke Park",attendance:51000},
  {year:1937,winner:"Tipperary",runner_up:"Kilkenny",score_w:"3-11",score_l:"0-3",venue:"Killarney",attendance:44000},
  {year:1938,winner:"Dublin",runner_up:"Waterford",score_w:"2-5",score_l:"1-6",venue:"Croke Park",attendance:52500},
  {year:1939,winner:"Kilkenny",runner_up:"Cork",score_w:"2-7",score_l:"3-3",venue:"Croke Park",attendance:39000},
  {year:1940,winner:"Limerick",runner_up:"Kilkenny",score_w:"3-7",score_l:"1-7",venue:"Croke Park",attendance:42000},
  {year:1941,winner:"Cork",runner_up:"Dublin",score_w:"5-11",score_l:"0-6",venue:"Croke Park",attendance:26000},
  {year:1942,winner:"Cork",runner_up:"Dublin",score_w:"2-14",score_l:"3-4",venue:"Croke Park",attendance:28000},
  {year:1943,winner:"Cork",runner_up:"Antrim",score_w:"5-16",score_l:"0-4",venue:"Croke Park",attendance:48000},
  {year:1944,winner:"Cork",runner_up:"Dublin",score_w:"2-13",score_l:"1-2",venue:"Croke Park",attendance:26000},
  {year:1945,winner:"Tipperary",runner_up:"Kilkenny",score_w:"5-6",score_l:"3-6",venue:"Croke Park",attendance:69459},
  {year:1946,winner:"Kilkenny",runner_up:"Cork",score_w:"7-3",score_l:"3-8",venue:"Croke Park",attendance:64415},
  {year:1947,winner:"Kilkenny",runner_up:"Cork",score_w:"0-14",score_l:"2-7",venue:"Croke Park",attendance:62000},
  {year:1948,winner:"Waterford",runner_up:"Dublin",score_w:"6-7",score_l:"4-2",venue:"Croke Park",attendance:61000},
  {year:1949,winner:"Tipperary",runner_up:"Laois",score_w:"3-11",score_l:"0-3",venue:"Croke Park",attendance:67000},
  {year:1950,winner:"Tipperary",runner_up:"Kilkenny",score_w:"1-9",score_l:"1-8",venue:"Croke Park",attendance:66000},
  {year:1951,winner:"Tipperary",runner_up:"Wexford",score_w:"7-7",score_l:"3-9",venue:"Croke Park",attendance:69098},
  {year:1952,winner:"Cork",runner_up:"Dublin",score_w:"2-14",score_l:"0-7",venue:"Croke Park",attendance:55000},
  {year:1953,winner:"Cork",runner_up:"Galway",score_w:"3-3",score_l:"0-8",venue:"Croke Park",attendance:71195},
  {year:1954,winner:"Cork",runner_up:"Wexford",score_w:"1-9",score_l:"1-6",venue:"Croke Park",attendance:58000},
  {year:1955,winner:"Wexford",runner_up:"Galway",score_w:"3-13",score_l:"2-8",venue:"Croke Park",attendance:72854},
  {year:1956,winner:"Wexford",runner_up:"Cork",score_w:"2-14",score_l:"2-8",venue:"Croke Park",attendance:83096},
  {year:1957,winner:"Kilkenny",runner_up:"Waterford",score_w:"4-10",score_l:"3-9",venue:"Croke Park",attendance:71000},
  {year:1958,winner:"Tipperary",runner_up:"Galway",score_w:"4-9",score_l:"2-5",venue:"Croke Park",attendance:48000},
  {year:1959,winner:"Waterford",runner_up:"Kilkenny",score_w:"3-12",score_l:"1-10",venue:"Croke Park",attendance:73707},
  {year:1960,winner:"Wexford",runner_up:"Tipperary",score_w:"2-15",score_l:"0-11",venue:"Croke Park",attendance:66000},
  {year:1961,winner:"Tipperary",runner_up:"Dublin",score_w:"0-16",score_l:"1-12",venue:"Croke Park",attendance:67866},
  {year:1962,winner:"Tipperary",runner_up:"Wexford",score_w:"3-10",score_l:"2-11",venue:"Croke Park",attendance:75000},
  {year:1963,winner:"Kilkenny",runner_up:"Waterford",score_w:"4-17",score_l:"6-8",venue:"Croke Park",attendance:73123},
  {year:1964,winner:"Tipperary",runner_up:"Kilkenny",score_w:"5-13",score_l:"2-12",venue:"Croke Park",attendance:71000},
  {year:1965,winner:"Tipperary",runner_up:"Wexford",score_w:"2-16",score_l:"0-10",venue:"Croke Park",attendance:68000},
  {year:1966,winner:"Cork",runner_up:"Kilkenny",score_w:"3-9",score_l:"1-10",venue:"Croke Park",attendance:68000},
  {year:1967,winner:"Kilkenny",runner_up:"Tipperary",score_w:"3-8",score_l:"2-7",venue:"Croke Park",attendance:64000},
  {year:1968,winner:"Wexford",runner_up:"Tipperary",score_w:"5-8",score_l:"3-9",venue:"Croke Park",attendance:63000},
  {year:1969,winner:"Kilkenny",runner_up:"Cork",score_w:"2-15",score_l:"2-9",venue:"Croke Park",attendance:64000},
  {year:1970,winner:"Cork",runner_up:"Wexford",score_w:"6-21",score_l:"5-10",venue:"Croke Park",attendance:67000},
  {year:1971,winner:"Tipperary",runner_up:"Kilkenny",score_w:"5-17",score_l:"5-14",venue:"Croke Park",attendance:61000},
  {year:1972,winner:"Kilkenny",runner_up:"Cork",score_w:"3-24",score_l:"5-11",venue:"Croke Park",attendance:68000},
  {year:1973,winner:"Limerick",runner_up:"Kilkenny",score_w:"1-21",score_l:"1-14",venue:"Croke Park",attendance:58000},
  {year:1974,winner:"Kilkenny",runner_up:"Limerick",score_w:"3-19",score_l:"1-13",venue:"Croke Park",attendance:63000},
  {year:1975,winner:"Kilkenny",runner_up:"Galway",score_w:"2-22",score_l:"2-10",venue:"Croke Park",attendance:64000},
  {year:1976,winner:"Cork",runner_up:"Wexford",score_w:"2-21",score_l:"4-11",venue:"Croke Park",attendance:67000},
  {year:1977,winner:"Cork",runner_up:"Wexford",score_w:"1-17",score_l:"3-8",venue:"Croke Park",attendance:67000},
  {year:1978,winner:"Cork",runner_up:"Kilkenny",score_w:"1-15",score_l:"2-8",venue:"Croke Park",attendance:64000},
  {year:1979,winner:"Kilkenny",runner_up:"Galway",score_w:"2-12",score_l:"1-8",venue:"Croke Park",attendance:64000},
  {year:1980,winner:"Galway",runner_up:"Limerick",score_w:"2-15",score_l:"3-9",venue:"Croke Park",attendance:61000},
  {year:1981,winner:"Offaly",runner_up:"Galway",score_w:"2-12",score_l:"0-15",venue:"Croke Park",attendance:58000},
  {year:1982,winner:"Kilkenny",runner_up:"Cork",score_w:"3-18",score_l:"1-13",venue:"Croke Park",attendance:59000},
  {year:1983,winner:"Kilkenny",runner_up:"Cork",score_w:"2-14",score_l:"2-12",venue:"Croke Park",attendance:58000},
  {year:1984,winner:"Cork",runner_up:"Offaly",score_w:"3-16",score_l:"1-12",venue:"Croke Park",attendance:59000},
  {year:1985,winner:"Offaly",runner_up:"Galway",score_w:"2-11",score_l:"1-12",venue:"Croke Park",attendance:55000},
  {year:1986,winner:"Cork",runner_up:"Galway",score_w:"4-13",score_l:"2-15",venue:"Croke Park",attendance:60000},
  {year:1987,winner:"Galway",runner_up:"Kilkenny",score_w:"1-12",score_l:"0-9",venue:"Croke Park",attendance:66000},
  {year:1988,winner:"Galway",runner_up:"Tipperary",score_w:"1-15",score_l:"0-14",venue:"Croke Park",attendance:65000},
  {year:1989,winner:"Tipperary",runner_up:"Antrim",score_w:"4-24",score_l:"3-9",venue:"Croke Park",attendance:65000},
  {year:1990,winner:"Cork",runner_up:"Galway",score_w:"5-15",score_l:"2-21",venue:"Croke Park",attendance:64000},
  {year:1991,winner:"Tipperary",runner_up:"Kilkenny",score_w:"1-16",score_l:"0-15",venue:"Croke Park",attendance:64000},
  {year:1992,winner:"Kilkenny",runner_up:"Cork",score_w:"3-10",score_l:"1-12",venue:"Croke Park",attendance:64000},
  {year:1993,winner:"Kilkenny",runner_up:"Galway",score_w:"2-17",score_l:"1-15",venue:"Croke Park",attendance:64000},
  {year:1994,winner:"Offaly",runner_up:"Limerick",score_w:"3-16",score_l:"2-13",venue:"Croke Park",attendance:64000},
  {year:1995,winner:"Clare",runner_up:"Offaly",score_w:"1-13",score_l:"2-8",venue:"Croke Park",attendance:65000},
  {year:1996,winner:"Wexford",runner_up:"Limerick",score_w:"1-13",score_l:"0-14",venue:"Croke Park",attendance:65000},
  {year:1997,winner:"Clare",runner_up:"Tipperary",score_w:"0-20",score_l:"2-13",venue:"Croke Park",attendance:65000},
  {year:1998,winner:"Offaly",runner_up:"Kilkenny",score_w:"2-16",score_l:"1-13",venue:"Croke Park",attendance:65000},
  {year:1999,winner:"Cork",runner_up:"Kilkenny",score_w:"0-13",score_l:"0-12",venue:"Croke Park",attendance:62000},
  {year:2000,winner:"Kilkenny",runner_up:"Offaly",score_w:"5-15",score_l:"1-14",venue:"Croke Park",attendance:65000},
  {year:2001,winner:"Tipperary",runner_up:"Galway",score_w:"5-18",score_l:"1-16",venue:"Croke Park",attendance:68480},
  {year:2002,winner:"Kilkenny",runner_up:"Clare",score_w:"2-20",score_l:"0-19",venue:"Croke Park",attendance:79502},
  {year:2003,winner:"Kilkenny",runner_up:"Cork",score_w:"1-14",score_l:"1-11",venue:"Croke Park",attendance:79000},
  {year:2004,winner:"Cork",runner_up:"Kilkenny",score_w:"0-17",score_l:"0-9",venue:"Croke Park",attendance:79302},
  {year:2005,winner:"Galway",runner_up:"Kilkenny",score_w:"0-17",score_l:"0-10 (replay)",venue:"Croke Park",attendance:82207},
  {year:2006,winner:"Kilkenny",runner_up:"Cork",score_w:"1-16",score_l:"1-13",venue:"Croke Park",attendance:82271},
  {year:2007,winner:"Kilkenny",runner_up:"Limerick",score_w:"2-19",score_l:"1-15",venue:"Croke Park",attendance:82127},
  {year:2008,winner:"Kilkenny",runner_up:"Waterford",score_w:"3-30",score_l:"1-13",venue:"Croke Park",attendance:82127},
  {year:2009,winner:"Kilkenny",runner_up:"Tipperary",score_w:"2-22",score_l:"0-23",venue:"Croke Park",attendance:82127},
  {year:2010,winner:"Tipperary",runner_up:"Kilkenny",score_w:"4-17",score_l:"1-18",venue:"Croke Park",attendance:82127},
  {year:2011,winner:"Kilkenny",runner_up:"Tipperary",score_w:"2-17",score_l:"1-16",venue:"Croke Park",attendance:82127},
  {year:2012,winner:"Kilkenny",runner_up:"Galway",score_w:"3-22",score_l:"3-11",venue:"Croke Park",attendance:82127},
  {year:2013,winner:"Clare",runner_up:"Cork",score_w:"5-16",score_l:"3-16",venue:"Croke Park",attendance:82127},
  {year:2014,winner:"Kilkenny",runner_up:"Tipperary",score_w:"3-22",score_l:"1-28 (replay)",venue:"Croke Park",attendance:82271},
  {year:2015,winner:"Kilkenny",runner_up:"Galway",score_w:"1-22",score_l:"2-19 (replay)",venue:"Croke Park",attendance:82271},
  {year:2016,winner:"Tipperary",runner_up:"Kilkenny",score_w:"2-29",score_l:"2-20 (replay)",venue:"Croke Park",attendance:82271},
  {year:2017,winner:"Galway",runner_up:"Waterford",score_w:"0-26",score_l:"2-17",venue:"Croke Park",attendance:82271},
  {year:2018,winner:"Limerick",runner_up:"Galway",score_w:"3-16",score_l:"2-18",venue:"Croke Park",attendance:82271},
  {year:2019,winner:"Tipperary",runner_up:"Kilkenny",score_w:"3-25",score_l:"0-24",venue:"Croke Park",attendance:82271},
  {year:2020,winner:"Limerick",runner_up:"Waterford",score_w:"0-30",score_l:"0-19",venue:"Croke Park",attendance:0},
  {year:2021,winner:"Limerick",runner_up:"Cork",score_w:"3-32",score_l:"1-22",venue:"Croke Park",attendance:0},
  {year:2022,winner:"Limerick",runner_up:"Kilkenny",score_w:"1-31",score_l:"2-26",venue:"Croke Park",attendance:82271},
  {year:2023,winner:"Limerick",runner_up:"Kilkenny",score_w:"0-30",score_l:"2-23",venue:"Croke Park",attendance:82271},
  {year:2024,winner:"Clare",runner_up:"Cork",score_w:"1-29",score_l:"3-22",venue:"Croke Park",attendance:82271},
];

// Football titles by county
const FOOTBALL_TITLES = [
  {county:"Kerry",titles:38,province:"Munster",last_title_year:2022},
  {county:"Dublin",titles:30,province:"Leinster",last_title_year:2024},
  {county:"Galway",titles:9,province:"Connacht",last_title_year:2022},
  {county:"Meath",titles:7,province:"Leinster",last_title_year:1999},
  {county:"Cork",titles:7,province:"Munster",last_title_year:2010},
  {county:"Down",titles:5,province:"Ulster",last_title_year:1994},
  {county:"Offaly",titles:4,province:"Leinster",last_title_year:1982},
  {county:"Tyrone",titles:4,province:"Ulster",last_title_year:2021},
  {county:"Wexford",titles:5,province:"Leinster",last_title_year:1918},
  {county:"Kildare",titles:3,province:"Leinster",last_title_year:1928},
  {county:"Roscommon",titles:3,province:"Connacht",last_title_year:1944},
  {county:"Cavan",titles:5,province:"Ulster",last_title_year:1952},
  {county:"Donegal",titles:2,province:"Ulster",last_title_year:2012},
  {county:"Derry",titles:1,province:"Ulster",last_title_year:1993},
  {county:"Louth",titles:2,province:"Leinster",last_title_year:1957},
  {county:"Mayo",titles:4,province:"Connacht",last_title_year:1951},
  {county:"Armagh",titles:1,province:"Ulster",last_title_year:2002},
  {county:"Tipperary",titles:4,province:"Munster",last_title_year:1920},
  {county:"Limerick",titles:2,province:"Munster",last_title_year:1896},
  {county:"Clare",titles:0,province:"Munster",last_title_year:null},
  {county:"Waterford",titles:0,province:"Munster",last_title_year:null},
  {county:"Laois",titles:1,province:"Leinster",last_title_year:1889},
  {county:"Wicklow",titles:0,province:"Leinster",last_title_year:null},
  {county:"Carlow",titles:0,province:"Leinster",last_title_year:null},
  {county:"Kilkenny",titles:0,province:"Leinster",last_title_year:null},
  {county:"Fermanagh",titles:0,province:"Ulster",last_title_year:null},
  {county:"Monaghan",titles:0,province:"Ulster",last_title_year:null},
  {county:"Antrim",titles:0,province:"Ulster",last_title_year:null},
  {county:"Sligo",titles:0,province:"Connacht",last_title_year:null},
  {county:"Leitrim",titles:0,province:"Connacht",last_title_year:null},
  {county:"Longford",titles:0,province:"Leinster",last_title_year:null},
  {county:"Westmeath",titles:0,province:"Leinster",last_title_year:null},
];

// Hurling titles by county
const HURLING_TITLES = [
  {county:"Kilkenny",titles:37,province:"Leinster",last_title_year:2023},
  {county:"Cork",titles:30,province:"Munster",last_title_year:2024},
  {county:"Tipperary",titles:28,province:"Munster",last_title_year:2019},
  {county:"Limerick",titles:23,province:"Munster",last_title_year:2023},
  {county:"Galway",titles:10,province:"Connacht",last_title_year:2017},
  {county:"Wexford",titles:6,province:"Leinster",last_title_year:1996},
  {county:"Clare",titles:5,province:"Munster",last_title_year:2024},
  {county:"Offaly",titles:4,province:"Leinster",last_title_year:1998},
  {county:"Waterford",titles:2,province:"Munster",last_title_year:1959},
  {county:"Dublin",titles:6,province:"Leinster",last_title_year:1938},
  {county:"Laois",titles:1,province:"Leinster",last_title_year:1915},
  {county:"Kerry",titles:0,province:"Munster",last_title_year:null},
  {county:"London",titles:1,province:"Britain",last_title_year:1901},
  {county:"Antrim",titles:0,province:"Ulster",last_title_year:null},
  {county:"Down",titles:0,province:"Ulster",last_title_year:null},
  {county:"Meath",titles:0,province:"Leinster",last_title_year:null},
  {county:"Carlow",titles:0,province:"Leinster",last_title_year:null},
];

// Leading scorers
const FOOTBALL_SCORERS = [
  {rank:1,player:"Colm Cooper",county:"Kerry",points:374,span:"2002–2016"},
  {rank:2,player:"Maurice Fitzgerald",county:"Kerry",points:367,span:"1988–2001"},
  {rank:3,player:"Declan O'Sullivan",county:"Kerry",points:335,span:"2003–2014"},
  {rank:4,player:"Dessie Farrell",county:"Dublin",points:310,span:"1992–2005"},
  {rank:5,player:"Peter Canavan",county:"Tyrone",points:305,span:"1992–2005"},
  {rank:6,player:"Séan O'Neill",county:"Down",points:298,span:"1959–1974"},
  {rank:7,player:"Kevin McStay",county:"Roscommon",points:289,span:"1982–1992"},
  {rank:8,player:"Michael Sheehy",county:"Kerry",points:285,span:"1976–1987"},
  {rank:9,player:"Tony McTague",county:"Offaly",points:278,span:"1967–1981"},
  {rank:10,player:"Bernard Brogan",county:"Dublin",points:272,span:"2006–2019"},
];

const HURLING_SCORERS = [
  {rank:1,player:"Henry Shefflin",county:"Kilkenny",points:481,span:"1999–2015"},
  {rank:2,player:"DJ Carey",county:"Kilkenny",points:446,span:"1989–2005"},
  {rank:3,player:"Nicky English",county:"Tipperary",points:415,span:"1982–1996"},
  {rank:4,player:"Joe Deane",county:"Cork",points:409,span:"1997–2011"},
  {rank:5,player:"Christy Ring",county:"Cork",points:405,span:"1940–1963"},
  {rank:6,player:"Gary Kirby",county:"Limerick",points:398,span:"1987–2002"},
  {rank:7,player:"Eddie Keher",county:"Kilkenny",points:393,span:"1959–1977"},
  {rank:8,player:"Eoin Kelly",county:"Tipperary",points:387,span:"2001–2016"},
  {rank:9,player:"Seán McLoughlin",county:"Tipperary",points:375,span:"1955–1967"},
  {rank:10,player:"TJ Reid",county:"Kilkenny",points:371,span:"2010–2024"},
];

// Provincial data
const FOOTBALL_PROVINCE_WINS = [
  {province:"Munster",wins:66,color:"#16a34a"},
  {province:"Leinster",wins:64,color:"#2563eb"},
  {province:"Ulster",wins:24,color:"#d97706"},
  {province:"Connacht",wins:16,color:"#7c3aed"},
];

const HURLING_PROVINCE_WINS = [
  {province:"Munster",wins:73,color:"#16a34a"},
  {province:"Leinster",wins:55,color:"#2563eb"},
  {province:"Connacht",wins:12,color:"#7c3aed"},
  {province:"Britain",wins:1,color:"#dc2626"},
];

const TABS = ["Overview","Football","Hurling","County Records","Provincial","Records & Stats"];

/* ─── Helper ─────────────────────────────────────────────────────────── */
function scoreToPoints(s) {
  if (!s || s === "—") return 0;
  const m = s.match(/(\d+)-(\d+)/);
  return m ? parseInt(m[1]) * 3 + parseInt(m[2]) : 0;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#4ade80", fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

/* ─── Tab Components ─────────────────────────────────────────────────── */
function OverviewTab() {
  const topFootball = useMemo(() =>
    [...FOOTBALL_TITLES].sort((a,b)=>b.titles-a.titles).slice(0,15)
  ,[]);
  const topHurling = useMemo(() =>
    [...HURLING_TITLES].sort((a,b)=>b.titles-a.titles).slice(0,15)
  ,[]);
  const recentFootball = FOOTBALL_FINALS.filter(f=>f.year>=2015).slice(-10).reverse();
  const recentHurling = HURLING_FINALS.filter(f=>f.year>=2015).slice(-10).reverse();

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="label">Football Editions</div><div className="value">137</div><div className="sub">1887 – 2024</div></div>
        <div className="stat-card"><div className="label">Hurling Editions</div><div className="value">137</div><div className="sub">1887 – 2024</div></div>
        <div className="stat-card"><div className="label">Football Champion</div><div className="value">Kerry</div><div className="sub">38 titles</div></div>
        <div className="stat-card"><div className="label">Hurling Champion</div><div className="value">Kilkenny</div><div className="sub">37 titles</div></div>
        <div className="stat-card"><div className="label">Sam Maguire 2024</div><div className="value">Dublin</div><div className="sub">vs Galway</div></div>
        <div className="stat-card"><div className="label">Liam McCarthy 2024</div><div className="value">Clare</div><div className="sub">vs Cork</div></div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Football Titles — Top 15 Counties</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topFootball} margin={{top:0,right:10,left:-20,bottom:40}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="county" tick={{fill:"#94a3b8",fontSize:10}} angle={-40} textAnchor="end" interval={0}/>
              <YAxis tick={{fill:"#94a3b8",fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="titles" fill="#16a34a" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Hurling Titles — Top 15 Counties</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topHurling} margin={{top:0,right:10,left:-20,bottom:40}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="county" tick={{fill:"#94a3b8",fontSize:10}} angle={-40} textAnchor="end" interval={0}/>
              <YAxis tick={{fill:"#94a3b8",fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="titles" fill="#f59e0b" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Recent Football Finals (2015–2024)</h3>
          <div className="recent-finals">
            {recentFootball.map(f=>(
              <div className="rf-card" key={f.year}>
                <span className="year">{f.year}</span>
                <span className="teams">{f.winner} <span style={{color:"#64748b"}}>vs</span> {f.runner_up}</span>
                <span className="score">{f.score_w} – {f.score_l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Recent Hurling Finals (2015–2024)</h3>
          <div className="recent-finals">
            {recentHurling.map(f=>(
              <div className="rf-card" key={f.year}>
                <span className="year">{f.year}</span>
                <span className="teams">{f.winner} <span style={{color:"#64748b"}}>vs</span> {f.runner_up}</span>
                <span className="score">{f.score_w} – {f.score_l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FootballTab() {
  const [decade, setDecade] = useState("all");
  const decades = ["all","1880s","1890s","1900s","1910s","1920s","1930s","1940s","1950s","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

  const filtered = useMemo(() => {
    if (decade === "all") return FOOTBALL_FINALS;
    const d = parseInt(decade);
    return FOOTBALL_FINALS.filter(f => f.year >= d && f.year < d + 10);
  }, [decade]);

  const winsByCounty = useMemo(() => {
    const m = {};
    filtered.forEach(f => { if(f.winner && f.winner !== "No contest") m[f.winner] = (m[f.winner]||0)+1; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([county,wins])=>({county,wins}));
  }, [filtered]);

  const eras = [
    {era:"Kerry Golden Age I",span:"1903–1914",titles:4,notes:"Kerry establish football dominance"},
    {era:"Wexford Supremacy",span:"1915–1918",titles:4,notes:"Four in a row for Model County"},
    {era:"Kerry Golden Age II",span:"1924–1932",titles:6,notes:"Classic Kerry–Dublin rivalry"},
    {era:"Kerry Four-in-a-Row",span:"1978–1981",titles:4,notes:"Mick O'Dwyer's greatest team"},
    {era:"Dublin Modern Era",span:"2011–2020",titles:9,notes:"Unrivalled dominance, 5-in-a-row"},
  ];

  return (
    <div>
      <div className="filter-row">
        <label>Filter by Decade:</label>
        <select value={decade} onChange={e=>setDecade(e.target.value)}>
          {decades.map(d=><option key={d} value={d}>{d==="all"?"All Time":d}</option>)}
        </select>
        <span style={{fontSize:12,color:"#94a3b8"}}>{filtered.filter(f=>f.winner!=="No contest").length} finals</span>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Wins by County {decade !== "all" ? `(${decade})` : ""}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={winsByCounty} margin={{top:0,right:10,left:-20,bottom:40}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="county" tick={{fill:"#94a3b8",fontSize:10}} angle={-35} textAnchor="end" interval={0}/>
              <YAxis tick={{fill:"#94a3b8",fontSize:10}} allowDecimals={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="wins" fill="#16a34a" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Dominant Eras</h3>
          {eras.map(e=>(
            <div key={e.era} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontWeight:600,fontSize:13}}>{e.era}</span>
                <span className="badge">{e.titles} titles</span>
              </div>
              <div style={{fontSize:11,color:"#94a3b8"}}>{e.span} — {e.notes}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">All Football Finals</div>
      <div className="table-wrap">
        <table className="finals-table">
          <thead><tr>
            <th>Year</th><th>Winner</th><th>Runner-Up</th><th>Score W</th><th>Score L</th><th>Venue</th><th>Attendance</th>
          </tr></thead>
          <tbody>
            {filtered.map(f=>(
              <tr key={f.year}>
                <td><span style={{fontFamily:"var(--font-mono)",fontSize:11}}>{f.year}</span></td>
                <td><strong>{f.winner}</strong></td>
                <td style={{color:"#94a3b8"}}>{f.runner_up}</td>
                <td><span className="badge">{f.score_w}</span></td>
                <td style={{color:"#94a3b8"}}>{f.score_l}</td>
                <td style={{fontSize:11,color:"#64748b"}}>{f.venue}</td>
                <td style={{fontFamily:"var(--font-mono)",fontSize:11,color:"#94a3b8"}}>{f.attendance > 0 ? f.attendance.toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HurlingTab() {
  const [decade, setDecade] = useState("all");
  const decades = ["all","1880s","1890s","1900s","1910s","1920s","1930s","1940s","1950s","1960s","1970s","1980s","1990s","2000s","2010s","2020s"];

  const filtered = useMemo(() => {
    if (decade === "all") return HURLING_FINALS;
    const d = parseInt(decade);
    return HURLING_FINALS.filter(f => f.year >= d && f.year < d + 10);
  }, [decade]);

  const winsByCounty = useMemo(() => {
    const m = {};
    filtered.forEach(f => { if(f.winner && f.winner !== "No contest") m[f.winner] = (m[f.winner]||0)+1; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([county,wins])=>({county,wins}));
  }, [filtered]);

  // Kilkenny vs Tipperary head-to-head
  const rivalry = useMemo(() => {
    const finals = HURLING_FINALS.filter(f =>
      (f.winner==="Kilkenny"&&f.runner_up==="Tipperary") ||
      (f.winner==="Tipperary"&&f.runner_up==="Kilkenny")
    );
    const kk = finals.filter(f=>f.winner==="Kilkenny").length;
    const tip = finals.filter(f=>f.winner==="Tipperary").length;
    return {kk, tip, total: finals.length, finals};
  },[]);

  return (
    <div>
      <div className="rivalry-box">
        <h3>Greatest Hurling Rivalry: Kilkenny vs Tipperary</h3>
        <div className="vs-row">
          <div className="vs-team">
            <div className="name" style={{color:"#fbbf24"}}>Kilkenny</div>
            <div className="wins" style={{color:"#fbbf24"}}>{rivalry.kk}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>final wins</div>
          </div>
          <div className="vs-sep">vs</div>
          <div className="vs-team">
            <div className="name" style={{color:"#60a5fa"}}>Tipperary</div>
            <div className="wins" style={{color:"#60a5fa"}}>{rivalry.tip}</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>final wins</div>
          </div>
        </div>
        <div style={{marginTop:12,fontSize:12,color:"#94a3b8",textAlign:"center"}}>{rivalry.total} All-Ireland Finals between these two counties</div>
      </div>

      <div className="filter-row">
        <label>Filter by Decade:</label>
        <select value={decade} onChange={e=>setDecade(e.target.value)}>
          {decades.map(d=><option key={d} value={d}>{d==="all"?"All Time":d}</option>)}
        </select>
        <span style={{fontSize:12,color:"#94a3b8"}}>{filtered.filter(f=>f.winner!=="No contest").length} finals</span>
      </div>

      <div className="chart-card">
        <h3>Wins by County {decade !== "all" ? `(${decade})` : ""}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={winsByCounty} margin={{top:0,right:10,left:-20,bottom:40}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
            <XAxis dataKey="county" tick={{fill:"#94a3b8",fontSize:10}} angle={-35} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:"#94a3b8",fontSize:10}} allowDecimals={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="wins" fill="#f59e0b" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section-title">All Hurling Finals</div>
      <div className="table-wrap">
        <table className="finals-table">
          <thead><tr>
            <th>Year</th><th>Winner</th><th>Runner-Up</th><th>Score W</th><th>Score L</th><th>Venue</th><th>Attendance</th>
          </tr></thead>
          <tbody>
            {filtered.map(f=>(
              <tr key={f.year}>
                <td><span style={{fontFamily:"var(--font-mono)",fontSize:11}}>{f.year}</span></td>
                <td><strong>{f.winner}</strong></td>
                <td style={{color:"#94a3b8"}}>{f.runner_up}</td>
                <td><span className="badge badge-amber">{f.score_w}</span></td>
                <td style={{color:"#94a3b8"}}>{f.score_l}</td>
                <td style={{fontSize:11,color:"#64748b"}}>{f.venue}</td>
                <td style={{fontFamily:"var(--font-mono)",fontSize:11,color:"#94a3b8"}}>{f.attendance > 0 ? f.attendance.toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CountyRecordsTab() {
  const allCounties = useMemo(() => {
    const s = new Set([...FOOTBALL_TITLES.map(c=>c.county), ...HURLING_TITLES.map(c=>c.county)]);
    return [...s].sort();
  },[]);

  const [selected, setSelected] = useState("Kerry");

  const ftData = FOOTBALL_TITLES.find(c=>c.county===selected) || {titles:0,province:"—",last_title_year:null};
  const htData = HURLING_TITLES.find(c=>c.county===selected) || {titles:0,province:"—",last_title_year:null};

  const footballFinals = FOOTBALL_FINALS.filter(f=>f.winner===selected||f.runner_up===selected);
  const hurlingFinals = HURLING_FINALS.filter(f=>f.winner===selected||f.runner_up===selected);

  const rivals = useMemo(() => {
    const rm = {};
    [...footballFinals,...hurlingFinals].forEach(f=>{
      const opp = f.winner===selected ? f.runner_up : f.winner;
      if(opp && opp!=="No contest" && opp!=="—") rm[opp] = (rm[opp]||0)+1;
    });
    return Object.entries(rm).sort((a,b)=>b[1]-a[1]).slice(0,5);
  },[selected,footballFinals,hurlingFinals]);

  return (
    <div>
      <div className="county-select">
        <label style={{fontSize:13,color:"#94a3b8",display:"block",marginBottom:8}}>Select a County</label>
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          {allCounties.map(c=><option key={c} value={c}>{c}</option>)}
        </select>

        <div className="info-grid">
          <div className="info-tile"><div className="t">Province</div><div className="v" style={{fontSize:16}}>{ftData.province||htData.province}</div></div>
          <div className="info-tile"><div className="t">Football Titles</div><div className="v">{ftData.titles}</div><div className="s">Last: {ftData.last_title_year||"N/A"}</div></div>
          <div className="info-tile"><div className="t">Hurling Titles</div><div className="v" style={{color:"#fbbf24"}}>{htData.titles}</div><div className="s">Last: {htData.last_title_year||"N/A"}</div></div>
          <div className="info-tile"><div className="t">Football Finals</div><div className="v">{footballFinals.length}</div><div className="s">{footballFinals.filter(f=>f.winner===selected).length} wins</div></div>
          <div className="info-tile"><div className="t">Hurling Finals</div><div className="v" style={{color:"#fbbf24"}}>{hurlingFinals.length}</div><div className="s">{hurlingFinals.filter(f=>f.winner===selected).length} wins</div></div>
        </div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Top Rivals (finals meetings)</h3>
          {rivals.length ? rivals.map(([county,count],i)=>(
            <div key={county} className="record-row">
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontWeight:500}}>{county}</span>
              <span className="rec-val">{count}</span>
              <span style={{fontSize:11,color:"#94a3b8",marginLeft:8}}>finals</span>
            </div>
          )) : <div style={{color:"#64748b",fontSize:13}}>No data</div>}
        </div>
        <div className="chart-card">
          <h3>Notable Appearances</h3>
          <div style={{fontSize:12}}>
            {footballFinals.slice(-5).reverse().map(f=>(
              <div className="record-row" key={"fb"+f.year}>
                <span className="rank" style={{fontFamily:"var(--font-mono)"}}>{f.year}</span>
                <span style={{flex:1}}>{f.winner===selected ? <span className="badge">W</span> : <span style={{color:"#dc2626",fontSize:10,fontWeight:600}}>L</span>} Football vs {f.winner===selected?f.runner_up:f.winner}</span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"#94a3b8"}}>{f.winner===selected?f.score_w:f.score_l}</span>
              </div>
            ))}
            {hurlingFinals.slice(-5).reverse().map(f=>(
              <div className="record-row" key={"hu"+f.year}>
                <span className="rank" style={{fontFamily:"var(--font-mono)"}}>{f.year}</span>
                <span style={{flex:1}}>{f.winner===selected ? <span className="badge badge-amber">W</span> : <span style={{color:"#dc2626",fontSize:10,fontWeight:600}}>L</span>} Hurling vs {f.winner===selected?f.runner_up:f.winner}</span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"#94a3b8"}}>{f.winner===selected?f.score_w:f.score_l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProvincialTab() {
  const ulsterRise = [
    {county:"Down",titles:5,first:1960,note:"Pioneered Ulster football success"},
    {county:"Cavan",titles:5,first:1933,note:"Ulster powerhouse in 1940s–50s"},
    {county:"Derry",titles:1,first:1993,note:"Sam Maguire in centenary year"},
    {county:"Donegal",titles:2,first:1992,note:"Back-to-back Ulster triumphs"},
    {county:"Armagh",titles:1,first:2002,note:"Breakthrough in modern era"},
    {county:"Tyrone",titles:4,first:2003,note:"Colm Cooper era, 3 in a decade"},
  ];

  const maxFb = Math.max(...FOOTBALL_PROVINCE_WINS.map(p=>p.wins));
  const maxHu = Math.max(...HURLING_PROVINCE_WINS.map(p=>p.wins));

  return (
    <div>
      <div className="two-col">
        <div className="chart-card">
          <h3>Football — Titles by Province</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={FOOTBALL_PROVINCE_WINS} dataKey="wins" nameKey="province" cx="50%" cy="50%" outerRadius={90} label={({province,wins})=>`${province}: ${wins}`} labelLine={false}>
                {FOOTBALL_PROVINCE_WINS.map((p,i)=><Cell key={p.province} fill={p.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>[v+" titles"]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{marginTop:8}}>
            {FOOTBALL_PROVINCE_WINS.map(p=>(
              <div key={p.province} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <span style={{color:p.color,fontWeight:600}}>{p.province}</span>
                  <span style={{color:"#94a3b8"}}>{p.wins} / {Math.round(p.wins/FOOTBALL_PROVINCE_WINS.reduce((s,x)=>s+x.wins,0)*100)}%</span>
                </div>
                <div className="prog-bar"><div className="fill" style={{width:`${p.wins/maxFb*100}%`,background:p.color}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Hurling — Titles by Province</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={HURLING_PROVINCE_WINS} dataKey="wins" nameKey="province" cx="50%" cy="50%" outerRadius={90} label={({province,wins})=>`${province}: ${wins}`} labelLine={false}>
                {HURLING_PROVINCE_WINS.map((p,i)=><Cell key={p.province} fill={p.color}/>)}
              </Pie>
              <Tooltip formatter={(v)=>[v+" titles"]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{marginTop:8}}>
            {HURLING_PROVINCE_WINS.map(p=>(
              <div key={p.province} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <span style={{color:p.color,fontWeight:600}}>{p.province}</span>
                  <span style={{color:"#94a3b8"}}>{p.wins} / {Math.round(p.wins/HURLING_PROVINCE_WINS.reduce((s,x)=>s+x.wins,0)*100)}%</span>
                </div>
                <div className="prog-bar"><div className="fill" style={{width:`${p.wins/maxHu*100}%`,background:p.color}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">Ulster's Rise in Football</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {ulsterRise.map(c=>(
          <div className="prov-card" key={c.county}>
            <h4>{c.county}</h4>
            <div style={{display:"flex",gap:12,marginBottom:6}}>
              <div className="info-tile" style={{flex:1,background:"var(--accent-dark)",border:"1px solid rgba(22,163,74,0.2)"}}>
                <div className="t">Titles</div><div className="v">{c.titles}</div>
              </div>
              <div className="info-tile" style={{flex:1}}>
                <div className="t">First Win</div><div className="v" style={{fontSize:16}}>{c.first}</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"#94a3b8"}}>{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsTab() {
  const highScoringFootball = useMemo(() =>
    FOOTBALL_FINALS
      .filter(f=>f.winner!=="No contest")
      .map(f=>({...f, total: scoreToPoints(f.score_w)+scoreToPoints(f.score_l)}))
      .sort((a,b)=>b.total-a.total).slice(0,8)
  ,[]);

  const highScoringHurling = useMemo(() =>
    HURLING_FINALS
      .filter(f=>f.winner!=="No contest")
      .map(f=>({...f, total: scoreToPoints(f.score_w)+scoreToPoints(f.score_l)}))
      .sort((a,b)=>b.total-a.total).slice(0,8)
  ,[]);

  const biggestMarginFb = useMemo(() =>
    FOOTBALL_FINALS
      .filter(f=>f.winner!=="No contest")
      .map(f=>({...f, margin: scoreToPoints(f.score_w)-scoreToPoints(f.score_l)}))
      .sort((a,b)=>b.margin-a.margin).slice(0,8)
  ,[]);

  const biggestMarginHu = useMemo(() =>
    HURLING_FINALS
      .filter(f=>f.winner!=="No contest")
      .map(f=>({...f, margin: scoreToPoints(f.score_w)-scoreToPoints(f.score_l)}))
      .sort((a,b)=>b.margin-a.margin).slice(0,8)
  ,[]);

  const highAttendFb = useMemo(() =>
    FOOTBALL_FINALS.filter(f=>f.attendance>0).sort((a,b)=>b.attendance-a.attendance).slice(0,5)
  ,[]);
  const highAttendHu = useMemo(() =>
    HURLING_FINALS.filter(f=>f.attendance>0).sort((a,b)=>b.attendance-a.attendance).slice(0,5)
  ,[]);

  return (
    <div>
      <div className="two-col">
        <div className="chart-card">
          <h3>Top Football Scorers (Championship Career)</h3>
          {FOOTBALL_SCORERS.map(s=>(
            <div className="record-row" key={s.player}>
              <span className="rank">#{s.rank}</span>
              <span style={{flex:1}}><span style={{fontWeight:600}}>{s.player}</span> <span style={{fontSize:11,color:"#94a3b8"}}>({s.county})</span></span>
              <span className="rec-val">{s.points}</span>
              <span style={{fontSize:10,color:"#64748b",marginLeft:6}}>{s.span}</span>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <h3>Top Hurling Scorers (Championship Career)</h3>
          {HURLING_SCORERS.map(s=>(
            <div className="record-row" key={s.player}>
              <span className="rank">#{s.rank}</span>
              <span style={{flex:1}}><span style={{fontWeight:600}}>{s.player}</span> <span style={{fontSize:11,color:"#94a3b8"}}>({s.county})</span></span>
              <span className="rec-val" style={{color:"#fbbf24"}}>{s.points}</span>
              <span style={{fontSize:10,color:"#64748b",marginLeft:6}}>{s.span}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Highest Scoring Football Finals</h3>
          {highScoringFootball.map((f,i)=>(
            <div className="record-row" key={f.year+i}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner} vs {f.runner_up}</span>
              <span className="rec-val">{f.total}pts</span>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <h3>Highest Scoring Hurling Finals</h3>
          {highScoringHurling.map((f,i)=>(
            <div className="record-row" key={f.year+i}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner} vs {f.runner_up}</span>
              <span className="rec-val" style={{color:"#fbbf24"}}>{f.total}pts</span>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Biggest Winning Margins — Football</h3>
          {biggestMarginFb.map((f,i)=>(
            <div className="record-row" key={f.year+"m"+i}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner}</span>
              <span className="rec-val">+{f.margin}</span>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <h3>Biggest Winning Margins — Hurling</h3>
          {biggestMarginHu.map((f,i)=>(
            <div className="record-row" key={f.year+"m"+i}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner}</span>
              <span className="rec-val" style={{color:"#fbbf24"}}>+{f.margin}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="chart-card">
          <h3>Attendance Records — Football</h3>
          {highAttendFb.map((f,i)=>(
            <div className="record-row" key={f.year+"a"}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner} vs {f.runner_up}</span>
              <span className="rec-val">{f.attendance.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <h3>Attendance Records — Hurling</h3>
          {highAttendHu.map((f,i)=>(
            <div className="record-row" key={f.year+"a"}>
              <span className="rank">#{i+1}</span>
              <span style={{flex:1,fontSize:12}}>{f.year} — {f.winner} vs {f.runner_up}</span>
              <span className="rec-val" style={{color:"#fbbf24"}}>{f.attendance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function GaelicStatNations() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="gaa-wrap">
      <style>{CSS}</style>

      <header className="gaa-header">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" fill="rgba(22,163,74,0.15)" stroke="rgba(22,163,74,0.5)" strokeWidth="1.5"/>
          <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(22,163,74,0.3)" strokeWidth="1"/>
          {/* Shamrock */}
          <ellipse cx="28" cy="21" rx="5" ry="6" fill="#16a34a" opacity="0.9"/>
          <ellipse cx="22" cy="26" rx="5" ry="6" fill="#16a34a" opacity="0.9" transform="rotate(-30 22 26)"/>
          <ellipse cx="34" cy="26" rx="5" ry="6" fill="#16a34a" opacity="0.9" transform="rotate(30 34 26)"/>
          <rect x="27" y="26" width="2" height="9" rx="1" fill="#16a34a"/>
          {/* Hurl silhouette */}
          <line x1="18" y1="40" x2="38" y2="33" stroke="#4ade80" strokeWidth="1.5" opacity="0.7"/>
          <ellipse cx="38" cy="33" rx="3" ry="1.5" fill="#4ade80" opacity="0.6" transform="rotate(-20 38 33)"/>
        </svg>
        <div className="gaa-header-text">
          <h1>GAA — Gaelic Athletic Association</h1>
          <p>All-Ireland Senior Football &amp; Hurling Championships · 1887–2024 · Complete Historical Data</p>
        </div>
      </header>

      <nav className="gaa-tabs">
        {TABS.map((t,i)=>(
          <button key={t} className={`gaa-tab${activeTab===i?" active":""}`} onClick={()=>setActiveTab(i)}>{t}</button>
        ))}
      </nav>

      <main className="gaa-body">
        {activeTab===0 && <OverviewTab/>}
        {activeTab===1 && <FootballTab/>}
        {activeTab===2 && <HurlingTab/>}
        {activeTab===3 && <CountyRecordsTab/>}
        {activeTab===4 && <ProvincialTab/>}
        {activeTab===5 && <RecordsTab/>}
      </main>
    </div>
  );
}
