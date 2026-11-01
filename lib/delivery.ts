import { policySeed } from "@/data/policy";

/** Mock delivery rules by pincode (UI only; a real courier API replaces this). */
const METRO_PREFIXES = ["11", "40", "41", "50", "56", "60", "70"]; // Delhi, Mumbai, Pune, Hyderabad, Bengaluru, Chennai, Kolkata
const NO_COD_PREFIXES = ["18", "19", "79", "744"]; // J&K, North-East, Andaman: prepaid only in this mock

export type PincodeResult =
  | { ok: false; error: string }
  | { ok: true; metro: boolean; cod: boolean; standard: Date; express: Date };

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++; // no Sunday deliveries
  }
  return d;
}

export function checkPincode(raw: string, today = new Date()): PincodeResult {
  const pin = raw.replace(/\s/g, "");
  if (!pin) return { ok: false, error: "Enter a 6-digit pincode." };
  if (!/^\d+$/.test(pin)) return { ok: false, error: "A pincode has numbers only, like 560001." };
  if (pin.length !== 6) return { ok: false, error: `A pincode has 6 digits. You entered ${pin.length}.` };
  if (pin.startsWith("0")) return { ok: false, error: "Indian pincodes don't start with 0. Check the first digit." };

  const metro = METRO_PREFIXES.some((p) => pin.startsWith(p));
  const cod = !NO_COD_PREFIXES.some((p) => pin.startsWith(p));
  const { standardDays, expressDays } = policySeed;
  return {
    ok: true,
    metro,
    cod,
    standard: addBusinessDays(today, metro ? standardDays.metro : standardDays.other),
    express: addBusinessDays(today, metro ? expressDays.metro : expressDays.other),
  };
}

export const formatDeliveryDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
