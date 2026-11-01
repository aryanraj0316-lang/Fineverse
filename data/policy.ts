/** Store-wide money and delivery rules for the mock store (whole rupees). */
export const policySeed = {
  freeShippingThreshold: 1999,
  standardShipping: 99,
  expressShipping: 199,
  codFee: 49,
  returnDays: 7,
  /** Business days from order to delivery, used by the mock pincode check. */
  standardDays: { metro: 2, other: 5 },
  expressDays: { metro: 1, other: 3 },
};
