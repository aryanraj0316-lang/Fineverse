import { cx } from "@/lib/cx";

/** Five stars, filled to `rating` (supports halves). Reads as "4.5 out of 5 stars". */
export function Stars({ rating, className, size = 14 }: { rating: number; className?: string; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className={cx("relative inline-flex", className)}>
      <StarRow size={size} className="text-basalt/20" />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <StarRow size={size} className="text-basalt" />
      </span>
    </span>
  );
}

function StarRow({ size, className }: { size: number; className?: string }) {
  return (
    <span aria-hidden className={cx("flex gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
          <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.4l-6.1 3.5 1.5-6.8L2.2 9.5l6.9-.7z" />
        </svg>
      ))}
    </span>
  );
}
