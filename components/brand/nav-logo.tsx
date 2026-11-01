import Link from "next/link";
import { cx } from "@/lib/cx";

/**
 * The small wordmark in the nav. It uses the hero wordmark's exact lettering,
 * split into the same two parts, so the hero wordmark can travel into it and
 * cross-fade without a visible change.
 */
export function NavLogo({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      data-nav-logo
      className={cx("type-wordmark text-[1.5rem] leading-none lg:text-[1.75rem]", className)}
    >
      <span>Fine</span>
      <span>verse</span>
    </Link>
  );
}
