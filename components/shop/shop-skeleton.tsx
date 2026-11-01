/** Static placeholder in the exact shape of the shop page. No shimmer, no spinner. */
export function ShopSkeleton() {
  return (
    <div aria-hidden className="px-gutter pt-[calc(var(--nav-h)+2.5rem)] pb-24">
      <div className="h-[clamp(2.5rem,1.1rem+5.8vw,6rem)] w-2/3 max-w-xl rounded-surface bg-sand/70" />
      <div className="mt-4 h-5 w-1/2 max-w-md rounded-surface bg-sand/60" />
      <div className="mt-8 flex gap-2">
        {[64, 88, 104, 92].map((w) => (
          <div key={w} className="h-10 rounded-full bg-sand/60" style={{ width: w }} />
        ))}
      </div>
      <div className="mt-6 h-px bg-basalt/10" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:ml-[25%] xl:ml-[16.66%] xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-surface bg-sand/70" />
            <div className="mt-3 h-4 w-2/3 rounded-surface bg-sand/60" />
            <div className="mt-2 h-3 w-1/3 rounded-surface bg-sand/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
