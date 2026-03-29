/** Format an integer with comma thousands separators */
export const fmtNum = n =>
  n == null || n === '' ? '—' : Number(n).toLocaleString('en-GB');

/** Format a percentage to 1dp */
export const fmtPct = n =>
  n == null || n === '' ? '—' : `${(+n).toFixed(1)}%`;

/** Format a win-rate fraction as percentage */
export const winRate = (w, played) =>
  played ? `${((w / played) * 100).toFixed(1)}%` : '—';

/** Friendly date — "12 Oct 2023" */
export const fmtDate = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Short month+year — "Oct 2023" */
export const fmtMonthYear = str => {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

/** Ordinal suffix — 1st, 2nd, 3rd ... */
export const ordinal = n => {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v-20) % 10] || s[v] || s[0]);
};

/** Score display — "34 - 12" */
export const score = (hs, as) =>
  (hs != null && as != null) ? `${hs} - ${as}` : '—';
