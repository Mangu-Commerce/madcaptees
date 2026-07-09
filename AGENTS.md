# AGENTS.md

## Cursor Cloud specific instructions

Madcap Tees is a single-page **Vite + React 19 + TypeScript** e-commerce storefront + admin dashboard (no separate backend service to run locally). Standard scripts live in `package.json` (`dev`, `build`, `lint`, `preview`).

- **Package manager:** npm (`package-lock.json`). Dependencies are refreshed by the startup update script; you normally don't need to reinstall.
- **Run dev:** `npm run dev` — Vite serves on `http://localhost:3000` (port set in `vite.config.ts`).
- **Build / lint:** `npm run build` (`tsc -b` + `vite build`) and `npm run lint` (eslint).

### Non-obvious gotchas

- **Runs fully offline with seeded data.** Supabase is optional. When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset, the data layer (`src/lib/api.ts`) falls back to local seeded products/orders in `src/lib/data.ts`, so the whole storefront + admin work with no backend. To exercise a real backend instead, set those vars in `.env` (see `.env.example`); doing so makes `hasSupabaseConfig` true and switches every read/write to live Supabase.
- **Lint currently fails on pre-existing errors.** `npm run lint` reports ~34 pre-existing `@typescript-eslint/no-explicit-any` errors across `src/` that are unrelated to environment setup. `npm run build` still passes. Don't treat these lint errors as an environment problem.
- **Checkout is a demo flow.** The "PLACE ORDER" step is a simulated payment (no real Stripe call in local dev); it produces a fake order number and confirmation screen.
