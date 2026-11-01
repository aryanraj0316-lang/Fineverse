import localFont from "next/font/local";

/**
 * Archivo (Omnibus-Type, SIL OFL 1.1, see ./fonts/Archivo-OFL.txt).
 * Self-hosted subset: Latin, Latin-1, typographic punctuation and ₹,
 * weight 400–900 and width 62–100 in one 61 KB variable file.
 * Rebuild with scripts/build-font.py if more glyphs are needed.
 */
export const archivo = localFont({
  src: "./fonts/Archivo-Fineverse.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 100%" }],
  adjustFontFallback: "Arial",
});
