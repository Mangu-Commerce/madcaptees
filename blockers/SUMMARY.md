# Blocker Pipeline — Madcap Tees Launch Status

| Metric | Value |
|--------|-------|
| P0–P1 code | **DONE** |
| Phase 2 code | **DONE** (this branch) |
| Infrastructure | **IN PROGRESS** — Supabase `madcap-tees` provisioning |
| Operator remaining | Stripe keys + Vercel env + admin user |
| Launch readiness | **~98%** |

> **Your checklist:** `docs/OPERATOR_TODO.md`  
> **Supabase project:** `madcap-tees` (`mggzocnsacpzgakpymrt`, us-east-1)

---

## Done in code

| Phase | Items |
|-------|-------|
| Toolkit | env validation, blockers, agent playbook |
| P0 | catalog ↔ Supabase, admin auth, image upload, Stripe API |
| P1 | SEO/sitemap, gallery, category filters, admin chart |
| Phase 2 | accounts + order history, wishlist, Resend receipts, discount codes, Instagram feed |

---

## Operator remaining (bring-alive)

1. Wait for Supabase project healthy (agent applying migrations + seed)
2. Add **Stripe** test keys to Vercel env (and `.env.local`)
3. Create your admin user in Supabase Auth → `is_admin = true`
4. Point Stripe webhook at `https://YOUR-URL/api/stripe/webhook`
5. Smoke test checkout with `4242…`

Optional: Resend API key for email receipts; Printful later.
