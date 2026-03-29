export function SkeletonLine({ width = '100%', height = 16, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, marginBottom: 8, ...style }}
    />
  );
}

export function SkeletonCard({ rows = 4 }) {
  return (
    <div className="card">
      <SkeletonLine width="40%" height={14} style={{ marginBottom: 16 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} width={i % 2 === 0 ? '100%' : '75%'} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ cols = 4, cards = 4 }) {
  return (
    <div className={`grid-${cols}`} style={{ marginBottom: 16 }}>
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} rows={3} />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ sport }) {
  return (
    <div className="fade-in" style={{ padding: '16px 0' }}>
      <SkeletonGrid cols={4} cards={4} />
      <SkeletonCard rows={6} />
    </div>
  );
}
