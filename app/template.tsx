/**
 * Re-mounts on every navigation, so each new page fades in (280 ms, opacity
 * only). It never blocks clicks; reduced motion turns it off (globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
