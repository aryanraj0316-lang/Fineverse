/**
 * Sample past orders for the mock account (phone 98765 43210) and the
 * track-an-order demo. Orders placed at checkout are added in the browser.
 */
export type OrderStatus = "ordered" | "packed" | "shipped" | "out-for-delivery" | "delivered";

export interface OrderAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderSeed {
  id: string;
  phone: string;
  email: string;
  placed: string;
  status: OrderStatus;
  /** When each step happened (ISO dates), for the tracking timeline. */
  steps: Partial<Record<OrderStatus, string>>;
  estimated: string;
  lines: { variantId: string; quantity: number; bundleId?: string }[];
  address: OrderAddress;
  delivery: "standard" | "express";
  payment: "online" | "cod";
  coupon?: string;
  courier?: { name: string; awb: string };
}

const home: OrderAddress = {
  name: "Aarav Sharma",
  line1: "Flat 4B, Lake View Apartments",
  line2: "12th Main, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
};

export const orderSeeds: OrderSeed[] = [
  {
    id: "FV-10482",
    phone: "9876543210",
    email: "aarav@example.com",
    placed: "2026-10-28T10:12:00+05:30",
    status: "shipped",
    steps: { ordered: "2026-10-28T10:12:00+05:30", packed: "2026-10-28T16:40:00+05:30", shipped: "2026-10-29T09:05:00+05:30" },
    estimated: "2026-11-02",
    lines: [
      { variantId: "tide-watch:basalt:42-mm", quantity: 1 },
      { variantId: "pulse-earbuds:sand", quantity: 1 },
    ],
    address: home,
    delivery: "standard",
    payment: "online",
    courier: { name: "BlueDart", awb: "BD 7731 0042 18" },
  },
  {
    id: "FV-10377",
    phone: "9876543210",
    email: "aarav@example.com",
    placed: "2026-09-14T19:30:00+05:30",
    status: "delivered",
    steps: {
      ordered: "2026-09-14T19:30:00+05:30",
      packed: "2026-09-15T11:00:00+05:30",
      shipped: "2026-09-15T18:20:00+05:30",
      "out-for-delivery": "2026-09-17T08:10:00+05:30",
      delivered: "2026-09-17T13:45:00+05:30",
    },
    estimated: "2026-09-17",
    lines: [{ variantId: "field-overshirt:stone-grey:m", quantity: 1 }],
    address: home,
    delivery: "standard",
    payment: "cod",
  },
  {
    id: "FV-10291",
    phone: "9876543210",
    email: "aarav@example.com",
    placed: "2026-08-02T08:45:00+05:30",
    status: "delivered",
    steps: {
      ordered: "2026-08-02T08:45:00+05:30",
      packed: "2026-08-02T13:00:00+05:30",
      shipped: "2026-08-02T19:00:00+05:30",
      "out-for-delivery": "2026-08-03T09:00:00+05:30",
      delivered: "2026-08-03T12:20:00+05:30",
    },
    estimated: "2026-08-03",
    lines: [
      { variantId: "cell-power-bank:graphite:10-000-mah", quantity: 1 },
      { variantId: "arc-sunglasses:basalt", quantity: 1 },
    ],
    address: home,
    delivery: "express",
    payment: "online",
  },
];
