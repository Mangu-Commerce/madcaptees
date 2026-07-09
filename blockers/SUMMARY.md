# Blocker Pipeline — Madcap Tees Launch Status

| Metric | Value |
|--------|-------|
| P0–P1 code | **DONE** |
| Phase 2 code | **DONE** (PR #7) |
| Infrastructure | **Supabase LIVE** — `madcap-tees` (`mggzocnsacpzgakpymrt`) |
| Catalog seed | **DONE** — 8 products, 64 variants, DEMO10 |
| Vercel deploy | **READY** on PR #7 preview (`outputDirectory: dist` fixed) |
| Public access | **BLOCKED** — Vercel Authentication SSO on all URLs |
| Operator remaining | Disable SSO + paste env (Supabase/Stripe) + admin user |
| Launch readiness | **~99%** (blocked only on operator dashboard steps) |

> **Your checklist:** `docs/OPERATOR_TODO.md`  
> **Supabase:** `https://mggzocnsacpzgakpymrt.supabase.co`  
> **Vercel project:** `madcaptees` → `madcaptees-redinc23s-projects.vercel.app`

---

## Done in code

| Phase | Items |
|-------|-------|
| Toolkit | env validation, blockers, agent playbook |
| P0 | catalog ↔ Supabase, admin auth, image upload, Stripe API |
| P1 | SEO/sitemap, gallery, category filters, admin chart |
| Phase 2 | accounts + order history, wishlist, Resend receipts, discount codes, Instagram feed |
| Deploy fix | `vercel.json` → framework Vite, `outputDirectory: "dist"`; Vite `base: '/'` |

---

## Done in infrastructure (agent)

- Supabase project created + migrations 001–003 applied
- Storage bucket `product-images` + RLS
- Seeded 8 designs / images / variants + `DEMO10` discount
- Anon key available for storefront

---

## Operator remaining (bring-alive)

1. **Disable Vercel Authentication** (Settings → Deployment Protection → Off) so the storefront is public
2. In Vercel → Project → Settings → Environment Variables, add **server secrets**:
   - `SUPABASE_SERVICE_ROLE_KEY` = (service_role — never commit)
   - Stripe: `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - (Client Supabase URL/anon already baked via `.env.production`)
3. Create admin user in Supabase Auth → `UPDATE profiles SET is_admin = true WHERE email = '...'`
4. Stripe webhook → `https://YOUR-URL/api/stripe/webhook` (`checkout.session.completed`)
5. Merge PR #7 → redeploy production → smoke test with card `4242…`

Optional: Resend API key; Printful later.
