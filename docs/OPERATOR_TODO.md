# Your To-Do List (Operator Only)

**Everything else is on the agents.** This is the only stuff that needs your login, credit card, or DNS access.

Copy this checklist and work top to bottom. Check each box when done.

---

## 1. Environment file (15 min)

```bash
cp .env.local.example .env.local
```

Fill from dashboards (same pattern as `my_publishing`):

| Variable | Where to get it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | [Supabase](https://app.supabase.com) → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Same page (anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page (service_role — **never commit**) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | [Stripe](https://dashboard.stripe.com/apikeys) → pk_test_... |
| `STRIPE_SECRET_KEY` | Stripe → sk_test_... |
| `STRIPE_WEBHOOK_SECRET` | Step 4 below |
| `VITE_SITE_URL` | `http://localhost:3000` locally, your Vercel URL in prod |

Verify:

```bash
npm run validate-env:strict
```

---

## 2. Supabase database (20 min)

1. Create project at [supabase.com](https://supabase.com) (or reuse one)
2. SQL Editor → paste full file → Run:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_bucket.sql`
3. **Auth → Users → Add user** with your email + password
4. SQL Editor → make yourself admin:

```sql
UPDATE profiles SET is_admin = true WHERE email = 'YOUR_EMAIL@example.com';
```

5. Confirm storage bucket `product-images` exists (public read)

---

## 3. Vercel deploy (20 min)

1. [vercel.com](https://vercel.com) → Import `redinc23/madcaptees`
2. Framework: **Vite**
3. Add **all** env vars from `.env.local` (same names)
4. Deploy
5. Copy production URL → set `VITE_SITE_URL` in Vercel env → redeploy

---

## 4. Stripe webhook (10 min)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://YOUR-VERCEL-URL.vercel.app/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel env → redeploy

Local testing (optional):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 5. Custom domain (optional)

1. Vercel → Project → Settings → Domains → add `madcaptees.com` (or your domain)
2. Update DNS per Vercel instructions
3. Set `VITE_SITE_URL=https://madcaptees.com` → redeploy

---

## 6. Email receipts — Phase 2 (optional for launch)

1. [resend.com](https://resend.com) → API key
2. Verify sending domain
3. Add `RESEND_API_KEY` to Vercel env

---

## 7. Print-on-demand — Phase 3 (pick one)

| Provider | Sign up | Env var |
|----------|---------|---------|
| Printful | [printful.com](https://printful.com/dashboard/api) | `PRINTFUL_API_KEY` |
| Printify | [printify.com](https://printify.com/app/account/api) | `PRINTIFY_API_KEY` |

Map variant IDs in admin once you choose.

---

## 8. Smoke test (10 min)

After deploy:

- [ ] Homepage loads
- [ ] Shop shows products
- [ ] Add to cart → checkout
- [ ] Stripe test card `4242 4242 4242 4242` completes
- [ ] Order appears in **Admin → Orders** (`/admin`, your login)
- [ ] Add a shirt in admin with image → shows on shop within ~10s

---

## When you're stuck

```bash
npm run validate-env:strict
./scripts/apply-supabase-migrations.sh
./scripts/launch-readiness.sh
```

**Blocker board:** `blockers/SUMMARY.md`  
**Agent playbook:** `docs/AGENT_PLAYBOOK.md`

---

## What you do NOT need to code

Agents handle: storefront ↔ Supabase wiring, admin auth UI, image upload, Stripe API routes, routing, placeholders, and blocker updates.

You handle: **keys, DNS, dashboards, and the smoke test above.**
