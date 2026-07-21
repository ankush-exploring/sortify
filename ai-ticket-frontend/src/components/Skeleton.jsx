export function CardSkeleton() {
  return (
    <div className="border border-[var(--border)] rounded-md p-4 space-y-2">
      <div className="skeleton-shimmer h-4 w-3/5 rounded" />
      <div className="skeleton-shimmer h-3 w-full rounded" />
      <div className="skeleton-shimmer h-3 w-4/5 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-9 w-full rounded" />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="skeleton-shimmer h-5 w-1/3 rounded" />
      <div className="border border-[var(--border)] rounded-md p-6 space-y-3">
        <div className="skeleton-shimmer h-5 w-2/3 rounded" />
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="skeleton-shimmer h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}
