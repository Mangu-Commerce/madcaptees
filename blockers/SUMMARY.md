# Blocker Pipeline — Madcap Tees Launch Status

| Metric | Value |
|--------|-------|
| P0 code blockers | **0 open** (pending your env + deploy) |
| P1 polish / SEO | **4 open** |
| Operator-only (deploy) | **See docs/OPERATOR_TODO.md** |
| Launch readiness | **~85%** (code ready — needs your keys + smoke test) |
| Tracking branch | `cursor/p0-implementation-b82e` |

> **Your checklist:** `docs/OPERATOR_TODO.md` — only thing left that needs your logins.

---

## P0 — Code (agent completed)

| ID | Blocker | Status |
|----|---------|--------|
| P0.1 | Storefront reads seed data, not Supabase | **DONE** — `CatalogContext` + `fetchPublishedProducts` |
| P0.2 | Demo checkout only | **DONE** — Stripe Checkout when keys set; demo fallback remains |
| P0.3 | Admin has no auth | **DONE** — Supabase Auth + `is_admin` gate at `/admin` |
| P0.4 | No image upload in admin | **DONE** — upload to `product-images` bucket |
| P0.5 | No server for secrets/webhooks | **DONE** — `api/checkout.ts` + `api/stripe/webhook.ts` + `vercel.json` |

---

## P1 — Polish (optional before launch)

| ID | Item | Status |
|----|------|--------|
| P1.1 | Shareable URLs | **DONE** — react-router (`/shop`, `/products/:slug`, etc.) |
| P1.2 | JSON-LD + sitemap + per-page meta | OPEN |
| P1.3 | Product gallery (thumbnails, zoom) | OPEN |
| P1.4 | Category icon filters (PRD FR-6) | OPEN |
| P1.5 | Admin analytics chart | OPEN |
| P1.6 | Auto SVG placeholder | **DONE** — `src/lib/placeholders.ts` |

---

## Operator-only — **YOUR TO-DO**

Everything in **`docs/OPERATOR_TODO.md`**:

- [ ] `.env.local` + Vercel env vars
- [ ] Run migrations `001` + `002` in Supabase
- [ ] Create admin user + `is_admin = true`
- [ ] Deploy Vercel + Stripe webhook URL
- [ ] Custom domain (optional)
- [ ] Smoke test with card `4242...`

---

## Quick commands

```bash
cp .env.local.example .env.local
npm run validate-env:strict
./scripts/apply-supabase-migrations.sh
npm run dev
# Admin: http://localhost:3000/admin
```

---

## Cross-repo patterns

Mirrors **`redinc23/my_publishing`**. Shared standards: **`redinc23/standards_poor`**.
