import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { NavCategory } from "@/components/layout/nav-types";
import { AppProviders } from "@/components/providers/app-providers";
import { LazyOverlays } from "@/components/providers/lazy-overlays";
import { Toaster } from "@/components/ui/toaster";
import { formatPrice, getCollections, getPolicy } from "@/lib/commerce";
import { site } from "@/lib/site";
import { archivo } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline.replace(/\.$/, "")}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3e9de",
  width: "device-width",
  initialScale: 1,
};

function navCategories(): NavCategory[] {
  return getCollections().map((c) => {
    const image = c.featured.colours[0]!.images[0];
    return {
      handle: c.handle,
      title: c.title,
      href: c.href,
      types: c.types.map((t) => ({ title: t.title, href: t.href })),
      featured: {
        title: c.featured.title,
        href: c.featured.href,
        price: formatPrice(c.featured.priceFrom),
        image,
      },
    };
  });
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const policy = getPolicy();
  const trustLine = `Cash on delivery · ${policy.returnDays}-day returns · Free delivery over ${formatPrice(policy.freeShippingThreshold)}`;

  return (
    // The home page's intro script sets data-intro on <html> before hydration.
    <html lang="en-IN" className={archivo.variable} suppressHydrationWarning>
      <body>
        <AppProviders>
          <SiteHeader categories={navCategories()} trustLine={trustLine} />
          <main id="main">{children}</main>
          <SiteFooter />
          <LazyOverlays />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
