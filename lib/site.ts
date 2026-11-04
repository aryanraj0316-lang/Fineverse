export const site = {
  name: "Fineverse",
  tagline: "Considered essentials for every part of your day.",
  description:
    "Electronics, clothing, wearables, bags, footwear and home essentials. Cash on delivery, 7-day returns and delivery across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/**
 * Support details. PLACEHOLDERS: replace before launch (listed in ASSETS_TODO.md).
 * The values are deliberately non-working (.example domain, all-zero number).
 */
export const support = {
  email: "help@fineverse.example",
  whatsappNumber: "910000000000",
  hours: "Monday to Saturday, 10 am to 7 pm IST",
  replyTime: "within one working day",
};

export const footerLinks: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/shop/men" },
      { label: "Women", href: "/shop/women" },
      { label: "Electronics", href: "/shop/electronics" },
      { label: "Clothing", href: "/shop/clothing" },
      { label: "Wearables", href: "/shop/wearables" },
      { label: "Bags", href: "/shop/bags" },
      { label: "Footwear", href: "/shop/footwear" },
      { label: "Home", href: "/shop/home" },
      { label: "The Everyday Kit", href: "/kit" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track an order", href: "/track" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const legalLinks: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const mobileMenuLinks: { label: string; href: string }[] = [
  { label: "The Everyday Kit", href: "/kit" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Track an order", href: "/track" },
  { label: "Account", href: "/account" },
  { label: "Help", href: "/faq" },
];
