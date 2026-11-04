/**
 * Original demo products. Additional categories live in catalog-expansion.ts.
 *
 * Authoring format only. Components never import this file: everything goes
 * through `lib/commerce`, which turns these seeds into typed `Product`s.
 *
 * Prices are whole rupees here (the commerce layer stores paise).
 * Images live at /public/products/{handle}/{colour-slug}-{n}.webp. Files that
 * are still placeholders are listed in ASSETS_TODO.md.
 */

export type CategoryHandle = "electronics" | "clothing" | "wearables" | "bags" | "footwear" | "home";
export type KitSlot = "watch" | "earbuds" | "sunglasses" | "overshirt" | "powerbank";
export type SizeGuideKind = "tops" | "trousers";

export interface ColourSeed {
  name: string;
  /** Swatch hex shown in the variant picker. */
  swatch: string;
}

export interface SecondOptionSeed {
  /** Shown as the option label, e.g. "Size", "Case", "Capacity", "Waist". */
  name: string;
  values: { name: string; priceDelta?: number }[];
}

export interface ProductSeed {
  audiences?: ("men" | "women")[];
  handle: string;
  title: string;
  category: CategoryHandle;
  /** Subcategory handle, see data/collections.ts. */
  type: string;
  price: number;
  /** One plain paragraph: what it is, what it's made of, how it's used. */
  description: string;
  highlights: string[];
  specs: [label: string, value: string][];
  colours: ColourSeed[];
  option?: SecondOptionSeed;
  /**
   * Units in stock per variant. Keys are "Colour" or "Colour/Option".
   * Variants not listed get `default`.
   */
  stock: { default: number; overrides?: Record<string, number> };
  tags?: ("bestseller" | "new")[];
  kitSlot?: KitSlot;
  sizeGuide?: SizeGuideKind;
  /** ISO date, used for "Newest" sorting. */
  added: string;
}

const TOPS = ["S", "M", "L", "XL", "XXL"].map((name) => ({ name }));

export const productSeeds: ProductSeed[] = [
  // ───────────────────────────── Electronics ─────────────────────────────
  {
    handle: "pulse-earbuds",
    title: "Pulse Earbuds",
    category: "electronics",
    type: "earbuds",
    price: 4999,
    description:
      "Noise-cancelling earbuds in a speckled matte case. Active noise cancelling takes out up to 42 dB of traffic and cabin noise, and transparency mode lets voices through when you need them. 8 hours per charge, 30 hours with the case.",
    highlights: [
      "Active noise cancelling, up to 42 dB",
      "8 h playback, 30 h with the case",
      "IPX4 sweat and splash resistant",
      "USB-C and wireless charging",
    ],
    specs: [
      ["Drivers", "11 mm dynamic"],
      ["Bluetooth", "5.3, connects to two devices at once"],
      ["Codecs", "AAC, SBC, LDAC"],
      ["Quick charge", "10 minutes gives 2 hours"],
      ["Weight", "5 g per earbud, 48 g case"],
      ["In the box", "Earbuds, case, 4 tip sizes, USB-C cable"],
    ],
    colours: [
      { name: "Sand", swatch: "#D9CFC1" },
      { name: "Basalt", swatch: "#2A2927" },
    ],
    stock: { default: 40, overrides: { Basalt: 18 } },
    tags: ["bestseller"],
    kitSlot: "earbuds",
    added: "2026-08-04",
  },
  {
    handle: "tone-earbuds",
    title: "Tone Earbuds",
    category: "electronics",
    type: "earbuds",
    price: 1999,
    description:
      "Everyday earbuds without the extras. A tuned 10 mm driver, a clear call microphone, and 7 hours per charge, 28 with the case. The stems are short enough to wear under a helmet.",
    highlights: [
      "7 h playback, 28 h with the case",
      "Call noise reduction",
      "IPX4 sweat and splash resistant",
      "10 minutes of charge gives 90 minutes",
    ],
    specs: [
      ["Drivers", "10 mm dynamic"],
      ["Bluetooth", "5.3"],
      ["Codecs", "AAC, SBC"],
      ["Weight", "4 g per earbud, 36 g case"],
      ["In the box", "Earbuds, case, 3 tip sizes, USB-C cable"],
    ],
    colours: [
      { name: "Chalk", swatch: "#F2EFEA" },
      { name: "Basalt", swatch: "#2A2927" },
    ],
    stock: { default: 60, overrides: { Basalt: 4 } },
    added: "2026-06-12",
  },
  {
    handle: "hush-headphones",
    title: "Hush Headphones",
    category: "electronics",
    type: "headphones",
    price: 14999,
    description:
      "Over-ear headphones with adaptive noise cancelling and memory-foam cushions in protein leather. 40 mm drivers, 40 hours per charge with noise cancelling on. They fold flat into a felt case.",
    highlights: [
      "Adaptive noise cancelling",
      "40 h battery with noise cancelling on",
      "40 mm drivers",
      "Folds flat, 254 g",
    ],
    specs: [
      ["Drivers", "40 mm dynamic"],
      ["Cushions", "Memory foam in protein leather"],
      ["Battery", "40 h with noise cancelling, 60 h without"],
      ["Quick charge", "5 minutes gives 4 hours"],
      ["Microphones", "6, for noise cancelling and calls"],
      ["Bluetooth", "5.3, connects to two devices at once"],
      ["Wired", "USB-C audio and 3.5 mm"],
      ["Weight", "254 g"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Stone", swatch: "#CFC6B8" },
    ],
    stock: { default: 12, overrides: { Stone: 0 } },
    tags: ["new"],
    added: "2026-10-01",
  },
  {
    handle: "cove-speaker",
    title: "Cove Speaker",
    category: "electronics",
    type: "speakers",
    price: 5999,
    description:
      "A portable speaker the size of a paperback. Two passive radiators keep the bass full outdoors, IP67 means it survives sand and a drop in the pool, and it plays for 16 hours per charge.",
    highlights: [
      "IP67 dust and water resistant",
      "16 h battery",
      "Pair two for stereo",
      "Full charge in 3 h over USB-C",
    ],
    specs: [
      ["Output", "20 W"],
      ["Battery", "16 h at medium volume"],
      ["Bluetooth", "5.3"],
      ["Size", "18 × 7 × 6.5 cm"],
      ["Weight", "540 g"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Sand", swatch: "#D9CFC1" },
    ],
    stock: { default: 25, overrides: { Sand: 9 } },
    added: "2026-05-20",
  },
  {
    handle: "cell-power-bank",
    title: "Cell Power Bank",
    category: "electronics",
    type: "power-banks",
    price: 2999,
    description:
      "A graphite power bank with a textured shell that hides fingerprints. Two USB-C ports and one USB-A, so a phone and earbuds charge at the same time. The 20,000 mAh model charges most phones four times.",
    highlights: [
      "30 W USB-C Power Delivery",
      "2 × USB-C, 1 × USB-A",
      "Charges three devices at once",
      "Allowed in cabin baggage",
    ],
    specs: [
      ["Output", "30 W USB-C PD, 18 W USB-A"],
      ["Recharge time", "2.5 h (10,000 mAh), 4 h (20,000 mAh)"],
      ["Weight", "212 g (10,000 mAh), 356 g (20,000 mAh)"],
      ["In the box", "Power bank, USB-C to USB-C cable"],
    ],
    colours: [{ name: "Graphite", swatch: "#3A3A3C" }],
    option: {
      name: "Capacity",
      values: [{ name: "10,000 mAh" }, { name: "20,000 mAh", priceDelta: 1000 }],
    },
    stock: { default: 80, overrides: { "Graphite/20,000 mAh": 3 } },
    tags: ["bestseller"],
    kitSlot: "powerbank",
    added: "2026-03-15",
  },
  {
    handle: "cell-mini",
    title: "Cell Mini Power Bank",
    category: "electronics",
    type: "power-banks",
    price: 1499,
    description:
      "5,000 mAh in a magnetic slab that snaps to the back of Qi2 and MagSafe phones. A fold-out stand holds the phone upright while it charges. Recharges over USB-C.",
    highlights: [
      "Magnetic, 15 W wireless",
      "Fold-out stand",
      "20 W USB-C in and out",
      "Weighs 128 g",
    ],
    specs: [
      ["Capacity", "5,000 mAh"],
      ["Wireless output", "15 W"],
      ["Wired output", "20 W USB-C"],
      ["Weight", "128 g"],
    ],
    colours: [
      { name: "Graphite", swatch: "#3A3A3C" },
      { name: "Sand", swatch: "#D9CFC1" },
    ],
    stock: { default: 40, overrides: { Sand: 22 } },
    added: "2026-07-08",
  },

  // ─────────────────────────────── Clothing ──────────────────────────────
  {
    handle: "field-overshirt",
    title: "Field Overshirt",
    category: "clothing",
    type: "shirts",
    price: 3799,
    description:
      "A heavy overshirt in 380 gsm brushed cotton with a jacquard texture. Two chest pockets with button flaps and a relaxed, boxy cut that sits over a tee. A shirt on mild days, a light jacket on cool evenings.",
    highlights: [
      "380 gsm brushed cotton",
      "Relaxed, boxy fit",
      "Two flap chest pockets",
      "Machine wash cold",
    ],
    specs: [
      ["Fabric", "100% cotton, 380 gsm"],
      ["Fit", "Relaxed. The model is 183 cm and wears L"],
      ["Care", "Machine wash cold, dry flat"],
      ["Made in", "Tiruppur, India"],
    ],
    colours: [
      { name: "Stone Grey", swatch: "#8C857A" },
      { name: "Olive", swatch: "#5B5A3F" },
      { name: "Basalt", swatch: "#2A2927" },
    ],
    option: { name: "Size", values: TOPS },
    stock: { default: 14, overrides: { "Olive/XXL": 0, "Stone Grey/M": 2, "Basalt/S": 3 } },
    tags: ["bestseller"],
    kitSlot: "overshirt",
    sizeGuide: "tops",
    added: "2026-09-02",
  },
  {
    handle: "base-tee",
    title: "Base Tee",
    category: "clothing",
    type: "t-shirts",
    price: 999,
    description:
      "A 220 gsm combed-cotton tee with a tight rib collar that keeps its shape wash after wash. Pre-shrunk, so the size you buy is the size you keep.",
    highlights: ["220 gsm combed cotton", "Pre-shrunk", "Rib collar that holds its shape", "Regular fit"],
    specs: [
      ["Fabric", "100% combed cotton, 220 gsm"],
      ["Fit", "Regular. The model is 180 cm and wears M"],
      ["Care", "Machine wash cold, tumble dry low"],
      ["Made in", "Tiruppur, India"],
    ],
    colours: [
      { name: "Chalk", swatch: "#F2EFEA" },
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Sand", swatch: "#D9CFC1" },
    ],
    option: { name: "Size", values: TOPS },
    stock: { default: 50, overrides: { "Sand/XXL": 0 } },
    sizeGuide: "tops",
    added: "2026-02-10",
  },
  {
    handle: "shore-shirt",
    title: "Shore Shirt",
    category: "clothing",
    type: "shirts",
    price: 2499,
    description:
      "A lightweight shirt in washed linen that breathes in humid heat. Cut a little longer so it works untucked. Creases relax after an hour of wear.",
    highlights: ["100% washed linen", "Cut to wear untucked", "Chest pocket", "Machine wash cold"],
    specs: [
      ["Fabric", "100% linen, 150 gsm"],
      ["Fit", "Regular. The model is 183 cm and wears L"],
      ["Care", "Machine wash cold, line dry"],
      ["Made in", "Bengaluru, India"],
    ],
    colours: [
      { name: "Chalk", swatch: "#F2EFEA" },
      { name: "Haze", swatch: "#AFC2D6" },
      { name: "Sand", swatch: "#D9CFC1" },
    ],
    option: { name: "Size", values: TOPS.slice(0, 4) },
    stock: { default: 18, overrides: { "Haze/S": 2 } },
    sizeGuide: "tops",
    added: "2026-04-18",
  },
  {
    handle: "stride-trousers",
    title: "Stride Trousers",
    category: "clothing",
    type: "trousers",
    price: 2999,
    description:
      "Tapered trousers in cotton twill with 2% stretch, so they move when you ride a scooter or sit cross-legged. Gusseted crotch and a hidden zip pocket for keys.",
    highlights: ["Cotton twill, 2% stretch", "Tapered leg", "Hidden zip pocket", "Gusseted crotch"],
    specs: [
      ["Fabric", "98% cotton, 2% elastane"],
      ["Fit", "Tapered. Inseam 78 cm"],
      ["Care", "Machine wash cold, line dry"],
      ["Made in", "Tiruppur, India"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Khaki", swatch: "#A89A7C" },
      { name: "Stone", swatch: "#CFC6B8" },
    ],
    option: { name: "Waist", values: ["28", "30", "32", "34", "36"].map((name) => ({ name })) },
    stock: { default: 16, overrides: { "Khaki/36": 0, "Stone/30": 4 } },
    sizeGuide: "trousers",
    added: "2026-06-30",
  },
  {
    handle: "shell-jacket",
    title: "Shell Jacket",
    category: "clothing",
    type: "outerwear",
    price: 5999,
    description:
      "A packable rain shell for monsoon commutes. Fully seam-sealed with a 10,000 mm waterproof rating, a hood that fits over a cap, and it packs into its own chest pocket.",
    highlights: ["10,000 mm waterproof", "Seam-sealed", "Packs into its chest pocket", "Weighs 310 g"],
    specs: [
      ["Fabric", "Recycled nylon, 2.5-layer"],
      ["Waterproofing", "10,000 mm, breathable to 10,000 g/m²/24h"],
      ["Fit", "Regular, room for a hoodie underneath"],
      ["Weight", "310 g (size M)"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Olive", swatch: "#5B5A3F" },
    ],
    option: { name: "Size", values: TOPS.slice(0, 4) },
    stock: { default: 10, overrides: { "Olive/XL": 1 } },
    tags: ["new"],
    sizeGuide: "tops",
    added: "2026-09-25",
  },
  {
    handle: "loop-hoodie",
    title: "Loop Hoodie",
    category: "clothing",
    type: "outerwear",
    price: 2799,
    description:
      "A 400 gsm loopback-cotton hoodie with a double-layer hood and no drawcords to fray. Dropped shoulders, ribbed cuffs and a kangaroo pocket.",
    highlights: ["400 gsm loopback cotton", "Double-layer hood", "No drawcords", "Dropped shoulders"],
    specs: [
      ["Fabric", "100% cotton, 400 gsm"],
      ["Fit", "Relaxed. The model is 180 cm and wears M"],
      ["Care", "Machine wash cold, dry flat"],
      ["Made in", "Tiruppur, India"],
    ],
    colours: [
      { name: "Grey Melange", swatch: "#A7A6A2" },
      { name: "Basalt", swatch: "#2A2927" },
    ],
    option: { name: "Size", values: TOPS },
    stock: { default: 20 },
    sizeGuide: "tops",
    added: "2026-08-21",
  },

  // ─────────────────────────────── Wearables ─────────────────────────────
  {
    handle: "tide-watch",
    title: "Tide Watch",
    category: "wearables",
    type: "smartwatches",
    price: 12999,
    description:
      "A round smartwatch with a 1.4-inch AMOLED display under sapphire glass, an aluminium case and a soft fluoroelastomer strap. Tracks heart rate, SpO2, sleep and GPS workouts, and lasts up to 14 days per charge.",
    highlights: [
      "Up to 14 days per charge",
      "Water resistant to 50 m",
      "Sapphire glass",
      "GPS, heart rate, SpO2, sleep",
    ],
    specs: [
      ["Display", "1.4-inch AMOLED, 466 × 466"],
      ["Case", "Aluminium, 42 or 46 mm"],
      ["Crown", "Rotating, with haptic clicks; press to start a workout"],
      ["Glass", "Sapphire crystal"],
      ["Water resistance", "5 ATM, swim-proof"],
      ["Battery", "14 days typical, 5 days with always-on display"],
      ["Strap", "Fluoroelastomer, 20 mm quick-release"],
      ["Works with", "Android 9 or later, iOS 15 or later"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Sand", swatch: "#D9CFC1" },
    ],
    option: { name: "Case", values: [{ name: "42 mm" }, { name: "46 mm", priceDelta: 1000 }] },
    stock: { default: 20, overrides: { "Sand/42 mm": 6, "Sand/46 mm": 0 } },
    tags: ["bestseller"],
    kitSlot: "watch",
    added: "2026-07-22",
  },
  {
    handle: "tide-watch-titanium",
    title: "Tide Watch Titanium",
    category: "wearables",
    type: "smartwatches",
    price: 21999,
    description:
      "The Tide Watch in a grade 2 titanium case, which resists scratches far better than aluminium. Dual-frequency GPS holds a lock between tall buildings, and the larger battery lasts up to 18 days.",
    highlights: [
      "Grade 2 titanium case",
      "Up to 18 days per charge",
      "Dual-frequency GPS",
      "Sapphire glass",
    ],
    specs: [
      ["Display", "1.43-inch AMOLED, 466 × 466"],
      ["Case", "Grade 2 titanium, 46 mm"],
      ["Glass", "Sapphire crystal"],
      ["Water resistance", "10 ATM"],
      ["Battery", "18 days typical, 6 days with always-on display"],
      ["Strap", "Titanium link or fluoroelastomer, 22 mm"],
    ],
    colours: [
      { name: "Natural", swatch: "#9C988F" },
      { name: "Basalt", swatch: "#2A2927" },
    ],
    stock: { default: 7, overrides: { Basalt: 2 } },
    tags: ["new"],
    added: "2026-10-12",
  },
  {
    handle: "pace-band",
    title: "Pace Band",
    category: "wearables",
    type: "fitness-bands",
    price: 2999,
    description:
      "A slim band for steps, sleep and heart rate, with a 1.1-inch AMOLED display you can read in sunlight. 12 days per charge and 5 ATM water resistance, so you can swim with it.",
    highlights: ["12 days per charge", "1.1-inch AMOLED", "Water resistant to 50 m", "Sleep and heart rate"],
    specs: [
      ["Display", "1.1-inch AMOLED"],
      ["Battery", "12 days typical"],
      ["Water resistance", "5 ATM"],
      ["Sensors", "Heart rate, SpO2, accelerometer"],
      ["Weight", "24 g with strap"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Sand", swatch: "#D9CFC1" },
      { name: "Sage", swatch: "#9AA58E" },
    ],
    stock: { default: 35 },
    added: "2026-01-28",
  },
  {
    handle: "arc-sunglasses",
    title: "Arc Sunglasses",
    category: "wearables",
    type: "sunglasses",
    price: 2999,
    description:
      "Square acetate frames with polarised UV400 lenses that cut glare off roads and water. Five-barrel metal hinges and a 142 mm frame width, a medium-wide fit.",
    highlights: ["Polarised, UV400", "Acetate frame", "Five-barrel hinges", "Frame width 142 mm"],
    specs: [
      ["Lens", "Polarised, UV400, category 3"],
      ["Frame", "Acetate"],
      ["Measurements", "Lens 52 mm, bridge 20 mm, temple 145 mm"],
      ["In the box", "Hard case, cleaning cloth"],
    ],
    colours: [
      { name: "Basalt", swatch: "#1F1E1C" },
      { name: "Tortoise", swatch: "#6B4A2F" },
    ],
    stock: { default: 30, overrides: { Tortoise: 5 } },
    tags: ["bestseller"],
    kitSlot: "sunglasses",
    added: "2026-03-03",
  },
  {
    handle: "halo-sunglasses",
    title: "Halo Sunglasses",
    category: "wearables",
    type: "sunglasses",
    price: 3499,
    description:
      "Round stainless-steel frames, 2 mm thin, with polarised glass lenses and adjustable nose pads. Light enough to forget you're wearing them.",
    highlights: ["Polarised glass lenses", "Stainless-steel frame", "Adjustable nose pads", "Weighs 19 g"],
    specs: [
      ["Lens", "Polarised glass, UV400"],
      ["Frame", "Stainless steel, 2 mm"],
      ["Measurements", "Lens 49 mm, bridge 21 mm, temple 140 mm"],
      ["In the box", "Hard case, cleaning cloth"],
    ],
    colours: [
      { name: "Gold", swatch: "#B79A5B" },
      { name: "Gunmetal", swatch: "#55575A" },
    ],
    stock: { default: 11, overrides: { Gunmetal: 0 } },
    added: "2026-05-02",
  },
  {
    handle: "vale-sunglasses",
    title: "Vale Sunglasses",
    category: "wearables",
    type: "sunglasses",
    price: 3999,
    description:
      "Light wrap sunglasses for running and cycling. They weigh 24 g, the temple tips grip when you sweat, and the contrast tint makes road surfaces easier to read.",
    highlights: ["Weighs 24 g", "Grippy temple tips", "Contrast-tint polarised lenses", "Wrap fit"],
    specs: [
      ["Lens", "Polarised polycarbonate, contrast tint, UV400"],
      ["Frame", "TR90 nylon"],
      ["Weight", "24 g"],
      ["In the box", "Soft case, cleaning cloth"],
    ],
    colours: [
      { name: "Basalt", swatch: "#2A2927" },
      { name: "Stone", swatch: "#CFC6B8" },
    ],
    stock: { default: 16 },
    added: "2026-06-05",
  },
];
