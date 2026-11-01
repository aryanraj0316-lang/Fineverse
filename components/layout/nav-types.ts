export interface NavImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** What the nav needs about a category. Built on the server from lib/commerce. */
export interface NavCategory {
  handle: string;
  title: string;
  href: string;
  types: { title: string; href: string }[];
  featured: { title: string; href: string; price: string; image: NavImage };
}
