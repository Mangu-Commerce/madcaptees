---
description: Madcap Tees project memory — stack, data flow, secrets, and agent workflow
globs:
  - "**/*"
---

# Madcap Tees — Cursor Rules

## Project

E-commerce storefront + admin for @madcaptees. Vite SPA today; docs describe a future Next.js production stack.

## Before coding

1. Read `blockers/SUMMARY.md` for current launch blockers.
2. Read `docs/AGENT_PLAYBOOK.md` for milestone order.
3. Run `npm run validate-env` if touching env or deploy.

## Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind, shadcn/ui
- **Data:** Supabase (optional) via `src/lib/api.ts`; falls back to `src/lib/data.ts`
- **Env prefix:** `VITE_*` for client vars (not `NEXT_PUBLIC_*`)

## Critical data rule

**Storefront must use `lib/api.ts`**, not `lib/data.ts`, for products/orders when Supabase is configured.

Files still on local seed data (fix when wiring M1):
- `src/App.tsx` — `getProductBySlug`
- `src/sections/ShopPage.tsx` — `getPublishedProducts`
- `src/sections/BestSellers.tsx`, `NewArrivals.tsx`, `ProductDetail.tsx`

Admin already uses `fetchProducts` from `api.ts`.

## Secrets

Never put in client code or commit:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `PRINTFUL_API_KEY`

Safe in client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_SITE_URL`

## Admin

- Currently **unauthenticated** — treat as P0 blocker
- Navbar User icon opens admin (temporary)

## Checkout

- Demo only — `CheckoutPage` does not call Stripe
- Real payments need a server/Edge Function

## Conventions

- Match existing section components in `src/sections/`
- Minimal diffs; no drive-by refactors
- Update `blockers/SUMMARY.md` when closing blockers

## Useful commands

```bash
npm run dev
npm run validate-env
npm run validate-env:strict
./scripts/launch-readiness.sh
./scripts/apply-supabase-migrations.sh
```

## Docs

- `docs/PRD.md` — requirements
- `docs/DEPLOYMENT.md` — deploy runbook
- `docs/AGENT_PLAYBOOK.md` — agent workflow
- `blockers/SUMMARY.md` — launch status
