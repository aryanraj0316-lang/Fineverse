import { getPolicy, type Rupees } from "@/lib/commerce";
import { priceCart, type CartTotals } from "@/lib/cart-pricing";
import type { CartLine } from "@/stores/cart";

/** Mock coupon codes (UI only). */
const COUPONS: Record<string, { percent: number; label: string }> = {
  FINE10: { percent: 10, label: "10% off" },
};

export type CouponResult = { ok: true; code: string; percent: number; label: string } | { ok: false; error: string };

export function checkCoupon(raw: string): CouponResult {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a code." };
  const found = COUPONS[code];
  if (!found) return { ok: false, error: `${code} isn't a valid code. Check the spelling, or try another code.` };
  return { ok: true, code, ...found };
}

export interface OrderTotals extends CartTotals {
  couponDiscount: Rupees;
  shipping: Rupees;
  codFee: Rupees;
  total: Rupees;
}

export function priceOrder(
  lines: CartLine[],
  opts: { coupon?: string; delivery: "standard" | "express"; payment: "online" | "cod" },
): OrderTotals {
  const cart = priceCart(lines);
  const policy = getPolicy();
  const coupon = opts.coupon ? checkCoupon(opts.coupon) : null;
  // Whole rupees, rounded in the customer's favour.
  const couponDiscount = coupon?.ok ? Math.ceil((cart.merchandise * coupon.percent) / 100) : 0;
  const afterCoupon = cart.merchandise - couponDiscount;
  const shipping =
    opts.delivery === "express" ? policy.expressShipping : cart.merchandise >= policy.freeShippingThreshold ? 0 : policy.standardShipping;
  const codFee = opts.payment === "cod" ? policy.codFee : 0;
  return { ...cart, couponDiscount, shipping, codFee, total: afterCoupon + shipping + codFee };
}

/** Validators return a message that says exactly what to fix, or null. */
export const validate = {
  phone(v: string) {
    const d = v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!d) return "Enter your mobile number.";
    if (d.length !== 10) return `A mobile number has 10 digits. You entered ${d.length}.`;
    if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
    return null;
  },
  email(v: string) {
    if (!v.trim()) return "Enter your email address for the receipt.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Enter an email address like name@example.com.";
    return null;
  },
  required(v: string, what: string) {
    return v.trim() ? null : `Enter ${what}.`;
  },
  pincode(v: string) {
    const d = v.replace(/\s/g, "");
    if (!d) return "Enter a 6-digit pincode.";
    if (!/^\d+$/.test(d)) return "A pincode has numbers only, like 560001.";
    if (d.length !== 6) return `A pincode has 6 digits. You entered ${d.length}.`;
    if (d.startsWith("0")) return "Indian pincodes don't start with 0. Check the first digit.";
    return null;
  },
};

export const normalisePhone = (v: string) => v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
export const formatPhone = (d: string) => (d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : d);

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

