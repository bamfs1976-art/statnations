/**
 * MiniTable — a compact ranked table with optional medal colouring.
 * cols: [{ key, label, num?, width? }]
 */
export default function MiniTable({ cols, rows, rankCol, maxRows }) {
  const displayRows = maxRows ? rows.slice(0, maxRows) : rows;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {rankCol && <th style={{ width: 36 }}>#</th>}
            {cols.map(c => (
              <th key={c.key} className={c.num ? 'num' : ''} style={c.width ? { width: c.width } : {}}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, i) => (
            <tr key={i}>
              {rankCol && (
                <td>
                  <span className={`rank rank-${i + 1}`}>{i + 1}</span>
                </td>
              )}
              {cols.map(c => (
                <td key={c.key} className={c.num ? 'num' : ''}>
                  {row[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
