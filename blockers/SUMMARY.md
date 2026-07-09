# Blocker Pipeline — Madcap Tees Launch Status

| Metric | Value |
|--------|-------|
| P0 code blockers | **5 open** |
| P1 polish / SEO | **6 open** |
| Operator-only (deploy) | **5 open** |
| Launch readiness | **~45%** (UI done, backend/payments not wired) |
| Tracking branch | `cursor/dev-toolkit-scaffold-b82e` |

> **Source of truth for agents:** read this before planning work. Update when a blocker closes.

---

## P0 — Must fix before real sales

| ID | Blocker | Status | Notes |
|----|---------|--------|-------|
| P0.1 | Storefront reads `src/lib/data.ts`, not Supabase | **OPEN** | Admin uses `lib/api.ts`; shop/home still use seed data |
| P0.2 | Demo checkout only (no Stripe) | **OPEN** | `CheckoutPage` writes `cs_demo_*` to local memory |
| P0.3 | Admin has no auth | **OPEN** | Anyone can open admin via navbar User icon |
| P0.4 | No image upload in admin | **OPEN** | New products save with `product_images: []` |
| P0.5 | No server for secrets/webhooks | **OPEN** | Vite SPA cannot hold `STRIPE_SECRET_KEY` or verify webhooks |

### P0 fix order (recommended)

1. Wire storefront → `fetchProducts()` / `useProducts`
2. Supabase Auth + admin gate + RLS-compliant writes
3. Image upload → Supabase Storage `product-images`
4. Backend (Edge Functions or Next.js API) for Stripe Checkout + webhooks
5. Point checkout at Stripe instead of demo flow

---

## P1 — MVP polish (post-P0 or parallel)

| ID | Item | Status |
|----|------|--------|
| P1.1 | Shareable URLs (`/products/[slug]`) via react-router | OPEN |
| P1.2 | JSON-LD + sitemap + per-page meta | OPEN |
| P1.3 | Product gallery (thumbnails, zoom) | OPEN |
| P1.4 | Category icon filters (PRD FR-6) | OPEN |
| P1.5 | Admin analytics chart (recharts installed) | OPEN |
| P1.6 | Auto SVG placeholder for products without images | OPEN |

---

## Operator-only (deployment)

These are not code — they need dashboards filled in:

- [ ] `.env.local` with real Supabase + Stripe keys
- [ ] Run `supabase/migrations/001_initial_schema.sql` on production project
- [ ] Vercel project + env vars (`npm run validate-env:strict` green)
- [ ] Stripe webhook endpoint + `STRIPE_WEBHOOK_SECRET`
- [ ] Custom domain DNS (`madcaptees.com` or similar)
- [ ] Printful vs Printify decision + API key
- [ ] Resend domain verify + `RESEND_API_KEY`

---

## Resolved / in progress

| Item | Status |
|------|--------|
| Dev toolkit scaffold (env validation, playbooks, cursor rules) | **DONE** (this branch) |
| Storefront UI (home, shop, cart, quick view) | DONE |
| Admin UI (CRUD, orders, CSV export) | DONE |
| Supabase schema + RLS SQL migration file | DONE |
| `lib/api.ts` Supabase layer with local fallback | DONE |

---

## Quick commands

```bash
cp .env.local.example .env.local    # then fill values
npm run validate-env                # local dev OK without Supabase
npm run validate-env:strict         # before deploy
./scripts/apply-supabase-migrations.sh
./scripts/launch-readiness.sh       # lint + build + secret audit
```

---

## Cross-repo patterns

Mirrors **`redinc23/my_publishing`** operator kit. Shared standards target: **`redinc23/standards_poor`**.
