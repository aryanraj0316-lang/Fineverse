import Link from "next/link";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-cobalt text-chalk hover:bg-cobalt-press",
  secondary: "border border-basalt/25 text-basalt hover:border-basalt",
};

// Pick a size here rather than overriding height or text in className:
// there is no class merging, so conflicting utilities don't reliably win.
const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-small",
  md: "h-12 px-6 text-body",
  lg: "h-14 px-7 text-body-lg",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cx(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
