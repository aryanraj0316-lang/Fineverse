@AGENTS.md

# Fineverse

Scroll-cinematic storefront, front-end UI only (mock data, no backend).

- `BUILD_BRIEF.md`: the client brief, plus the approved Phase 0 decisions at the end.
- `DESIGN_PLAN.md`: tokens, wireframes, motion map. Follow it.
- `PROGRESS.md`: per-phase critique. Append a section after every phase.
- `ASSETS_TODO.md`: placeholders and missing assets.
- `reference-project/`: the old travel site, for technique only. Excluded from tsc, ESLint and Tailwind.

Rules that are easy to miss:
- Product data, prices and stock come only from `lib/commerce`; format prices with `formatPrice`.
- Colours, type sizes and radii are tokens in `app/globals.css`; the Tailwind defaults are switched off.
- Animate only transform, opacity and clip-path. Every effect needs a reduced-motion state.
- Cache Components is on: no `new Date()`, `Math.random()` or request data during render outside Suspense or client effects.
- After each phase: `npm run dev`, `npm run qa -- --phase=<n>`, look at the screenshots, update `PROGRESS.md`.
