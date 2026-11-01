/**
 * Mock reviews for the UI. Replace with real reviews from your review provider.
 * Photos point at stand-in images until customers' photos exist.
 */
export interface ReviewSeed {
  id: string;
  product: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  variant?: string;
  photos?: string[];
}

export const reviewSeeds: ReviewSeed[] = [
  // Pulse Earbuds
  { id: "r01", product: "pulse-earbuds", author: "Aarav S.", city: "Pune", rating: 5, title: "The case closes with a click you can feel", body: "The case closes with a click you can feel, and the battery lasted the whole Pune to Goa drive with noise cancelling on. Calls sound clear even on the highway.", date: "2026-09-14", variant: "Sand" },
  { id: "r02", product: "pulse-earbuds", author: "Meera K.", city: "Bengaluru", rating: 4, title: "Quiet on the metro", body: "Noise cancelling takes out most of the metro rumble. I'd like a slightly smaller case, but it fits a jeans pocket.", date: "2026-09-02", variant: "Basalt" },
  { id: "r03", product: "pulse-earbuds", author: "Rohan D.", city: "Mumbai", rating: 5, title: "Switches between phone and laptop", body: "Connected to my phone and laptop at once and switches without me touching anything. Fit is secure with the medium tips.", date: "2026-08-28", variant: "Sand", photos: ["/products/pulse-earbuds/sand-2.webp"] },
  { id: "r04", product: "pulse-earbuds", author: "Ishita P.", city: "Delhi", rating: 4, title: "Good for long calls", body: "Wore them through a three-hour call with no ear fatigue. Transparency mode is a little bright but useful.", date: "2026-08-19", variant: "Sand" },
  { id: "r05", product: "pulse-earbuds", author: "Kabir M.", city: "Hyderabad", rating: 3, title: "Great sound, touch controls take practice", body: "Sound and noise cancelling are great. I kept pausing music by accident for the first week until I got used to the touch area.", date: "2026-08-05", variant: "Basalt" },

  // Tide Watch
  { id: "r06", product: "tide-watch", author: "Riya M.", city: "Chennai", rating: 5, title: "Twelve days and counting", body: "Twelve days on one charge with sleep tracking on. The sapphire glass has survived a month of door frames and desk edges without a mark.", date: "2026-09-20", variant: "Basalt / 42 mm", photos: ["/products/tide-watch/basalt-2.webp"] },
  { id: "r07", product: "tide-watch", author: "Vikram J.", city: "Jaipur", rating: 5, title: "Looks like a watch, not a gadget", body: "People ask about it because it looks like a proper watch. The crown clicks are a nice touch when scrolling.", date: "2026-09-08", variant: "Basalt / 46 mm" },
  { id: "r08", product: "tide-watch", author: "Ananya R.", city: "Kochi", rating: 4, title: "Accurate GPS on runs", body: "GPS matched my running club's measured route within 50 m over 10 km. The strap is comfortable in humid weather.", date: "2026-08-30", variant: "Sand / 42 mm" },
  { id: "r09", product: "tide-watch", author: "Dev S.", city: "Kolkata", rating: 4, title: "Swim tracking works", body: "Counts laps correctly in a 25 m pool. I wish the app showed more detail per lap.", date: "2026-08-11", variant: "Basalt / 42 mm" },

  // Field Overshirt
  { id: "r10", product: "field-overshirt", author: "Karan P.", city: "Ahmedabad", rating: 5, title: "Clean design, great fabric", body: "Clean design, heavy fabric that still breathes, and it goes with everything I own. I sized down from my usual L to M for a neater fit.", date: "2026-09-22", variant: "Stone Grey / M" },
  { id: "r11", product: "field-overshirt", author: "Sneha T.", city: "Bengaluru", rating: 5, title: "Wears like a light jacket", body: "Perfect over a tee on cool evenings. Washed it three times, no shrinking, the texture is still crisp.", date: "2026-09-10", variant: "Olive / S", photos: ["/products/field-overshirt/stone-grey-2.webp"] },
  { id: "r12", product: "field-overshirt", author: "Arjun N.", city: "Chandigarh", rating: 4, title: "Boxy, as described", body: "It is boxy, as the page says. Sleeves are a touch long on me at 175 cm, so I roll them once.", date: "2026-08-24", variant: "Basalt / L" },
  { id: "r13", product: "field-overshirt", author: "Priya V.", city: "Indore", rating: 4, title: "Pockets are actually useful", body: "Phone fits in the chest pocket without the shirt sagging. Buttons feel solid.", date: "2026-08-12", variant: "Stone Grey / S" },

  // Arc Sunglasses
  { id: "r14", product: "arc-sunglasses", author: "Neha G.", city: "Goa", rating: 5, title: "Glare off the water is gone", body: "Polarised lenses make a real difference on the beach and while driving. The hinges feel sturdy.", date: "2026-09-18", variant: "Basalt" },
  { id: "r15", product: "arc-sunglasses", author: "Siddharth L.", city: "Pune", rating: 4, title: "Good fit for a wider face", body: "Finally a pair that doesn't pinch at the temples. Slightly heavier than my old pair, but it doesn't slip.", date: "2026-08-27", variant: "Tortoise" },
  { id: "r16", product: "arc-sunglasses", author: "Fatima Z.", city: "Lucknow", rating: 5, title: "Case is a bonus", body: "The hard case is compact and the cloth is good quality. Lenses are dark enough for midday sun.", date: "2026-08-09", variant: "Basalt" },

  // Cell Power Bank
  { id: "r17", product: "cell-power-bank", author: "Harsh B.", city: "Surat", rating: 5, title: "Charges my laptop too", body: "The 20,000 mAh model topped up my laptop from 30% to 80% on a train. Charges phone and earbuds at the same time.", date: "2026-09-12", variant: "20,000 mAh" },
  { id: "r18", product: "cell-power-bank", author: "Divya I.", city: "Mysuru", rating: 4, title: "Doesn't show fingerprints", body: "The textured shell really doesn't show marks. It gets warm when fast charging, which is normal.", date: "2026-08-21", variant: "10,000 mAh" },
  { id: "r19", product: "cell-power-bank", author: "Manav A.", city: "Bhopal", rating: 5, title: "Flight-friendly", body: "Carried it on two domestic flights in cabin baggage without questions. Three phone charges from the 20,000 mAh one.", date: "2026-08-03", variant: "20,000 mAh" },

  // Others
  { id: "r20", product: "hush-headphones", author: "Tanvi C.", city: "Mumbai", rating: 5, title: "Office noise disappears", body: "Open office chatter is gone with noise cancelling on. Comfortable through a full working day.", date: "2026-10-12", variant: "Basalt" },
  { id: "r21", product: "base-tee", author: "Omkar W.", city: "Nagpur", rating: 4, title: "Collar keeps its shape", body: "After ten washes the collar still sits flat. Thicker than most tees at this price.", date: "2026-07-30", variant: "Basalt / L" },
  { id: "r22", product: "cove-speaker", author: "Aditi H.", city: "Shillong", rating: 4, title: "Survived the monsoon", body: "Left it on the balcony during a downpour by accident. Still works perfectly. Bass is decent for the size.", date: "2026-07-18", variant: "Basalt" },
  { id: "r23", product: "pace-band", author: "Yusuf Q.", city: "Hyderabad", rating: 4, title: "Light enough to sleep in", body: "I forget I'm wearing it at night. Sleep stages seem reasonable compared with how I feel.", date: "2026-07-07", variant: "Sage" },
  { id: "r24", product: "stride-trousers", author: "Rahul E.", city: "Bengaluru", rating: 5, title: "Ride-friendly", body: "Stretch is enough for riding my scooter all day. The hidden zip pocket is perfect for keys.", date: "2026-08-16", variant: "Khaki / 32" },
];

/** Shown one at a time on the home page. */
export const featuredReviewIds = ["r01", "r06", "r10", "r17", "r14"];
