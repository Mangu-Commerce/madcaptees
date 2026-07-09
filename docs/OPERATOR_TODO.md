# Your To-Do List (Operator Only)

**Everything else is on the agents.** This is the only stuff that needs your login, credit card, or DNS access.

Copy this checklist and work top to bottom. Check each box when done.

---

## Already done for you

- [x] Supabase project `madcap-tees` (`mggzocnsacpzgakpymrt`)
- [x] Migrations 001–004 + storage bucket + RLS (`is_admin()` recursion fix)
- [x] Catalog seeded (8 products, 64 variants, `DEMO10`)
- [x] Vercel project linked to `redinc23/madcaptees`
- [x] Deploy config fixed (`outputDirectory: dist`, Vite framework)
- [x] Preview deploy **READY** on branch `cursor/phase2-live-b82e` (PR #7)

**Live preview (SSO-gated until step 0):**  
https://madcaptees-git-cursor-phase2-live-b82e-redinc23s-projects.vercel.app

---

## 0. Make the site public (2 min) — required

Vercel Authentication is currently on for **all** URLs (including production). Until you turn it off, shoppers hit a Vercel login wall.

1. Vercel → **madcaptees** → Settings → **Deployment Protection**
2. Set **Vercel Authentication** to **Off** (or Standard Protection → only Preview, not Production)
3. Save

---

## 1. Paste env vars into Vercel (10 min)

Vercel → **madcaptees** → Settings → Environment Variables → add for Production + Preview:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://mggzocnsacpzgakpymrt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon** `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → **service_role** (never commit / never expose client-side) |
| `VITE_SITE_URL` | `https://madcaptees-redinc23s-projects.vercel.app` (or your custom domain) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | [Stripe](https://dashboard.stripe.com/apikeys) → `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe → `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Step 3 below (`whsec_...`) |

Optional later: `RESEND_API_KEY`, `PRINTFUL_API_KEY`.

After saving, **Redeploy** the latest deployment.

Local copy (optional):

```bash
cp .env.local.example .env.local
# fill same values; VITE_SITE_URL=http://localhost:3000
npm run validate-env:strict
```

---

## 2. Admin user (5 min)

1. Supabase → **Authentication → Users → Add user** (email + password)
2. SQL Editor:

```sql
UPDATE profiles SET is_admin = true WHERE email = 'YOUR_EMAIL@example.com';
```

---

## 3. Stripe webhook (10 min)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://madcaptees-redinc23s-projects.vercel.app/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel → redeploy

---

## 4. Custom domain (optional)

1. Vercel → Project → Domains → add your domain
2. Update DNS per Vercel
3. Set `VITE_SITE_URL=https://yourdomain.com` → redeploy

---

## 5. Smoke test (10 min)

- [ ] Homepage loads at the Vercel URL
- [ ] Shop shows the 8 seeded products
- [ ] Add to cart → checkout
- [ ] Stripe test card `4242 4242 4242 4242` completes
- [ ] Order appears in **Admin → Orders** (`/admin`)
- [ ] Discount `DEMO10` applies at checkout
- [ ] `/account` sign-up / order history works

---

## When you're stuck

```bash
npm run validate-env:strict
./scripts/launch-readiness.sh
```

**Blocker board:** `blockers/SUMMARY.md`  
**Agent playbook:** `docs/AGENT_PLAYBOOK.md`

You handle: **keys, DNS, dashboards, and the smoke test.** Agents handle the rest.
