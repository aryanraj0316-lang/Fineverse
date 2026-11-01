import type { Rupees } from "./types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 12499 → "₹12,499" (Indian grouping: 124999 → "₹1,24,999"). */
export function formatPrice(amount: Rupees): string {
  return inr.format(amount);
}

/** Rounds down to the nearest ₹…99, so rounding always favours the customer. */
export function roundDownTo99(amount: number): Rupees {
  return Math.floor((amount + 1) / 100) * 100 - 1;
}
