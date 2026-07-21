export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-sm">
      <div className="skeleton-shimmer h-5 w-3/5 rounded" />
      <div className="skeleton-shimmer h-3 w-full rounded" />
      <div className="skeleton-shimmer h-3 w-4/5 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-10 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="skeleton-shimmer h-7 w-2/5 rounded" />
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm">
        <div className="skeleton-shimmer h-6 w-3/4 rounded" />
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-full rounded" />
        <div className="skeleton-shimmer h-4 w-2/3 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          <div className="skeleton-shimmer h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
