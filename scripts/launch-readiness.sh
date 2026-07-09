#!/usr/bin/env bash
# Local launch readiness gate for Madcap Tees (no cloud credentials required).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Madcap Tees — Launch Readiness Verification             ║"
echo "╚══════════════════════════════════════════════════════════╝"

if [[ -f .nvmrc ]] && [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "${HOME}/.nvm/nvm.sh"
  nvm use "$(cat .nvmrc)" 2>/dev/null || true
fi
echo "→ Node: $(node -v)"

run_step() {
  echo ""
  echo "━━━ $1 ━━━"
  shift
  "$@"
}

run_step "install" npm ci
run_step "lint" npm run lint
run_step "production build" npm run build

echo ""
echo "━━━ local env check (non-strict) ━━━"
npm run validate-env

echo ""
echo "━━━ secret pattern audit (dist/) ━━━"
PATTERN='sk_test_[A-Za-z0-9]{10,}|sk_live_[A-Za-z0-9]{10,}|whsec_[A-Za-z0-9]{10,}|service_role'
found=0
if [[ -d dist ]] && grep -R -nE "$PATTERN" dist/ 2>/dev/null | head -5; then
  found=1
fi
if [[ "$found" -eq 1 ]]; then
  echo "FAIL: potential secret values in dist/ — never bundle server keys in Vite client"
  exit 1
fi
echo "PASS: no secret patterns in dist/"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ LOCAL LAUNCH GATES PASS                              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Operator next steps (require real credentials):"
echo "  1. cp .env.local.example .env.local"
echo "  2. Apply supabase/migrations/001_initial_schema.sql in Supabase SQL Editor"
echo "  3. npm run validate-env:strict"
echo "  4. Set Vercel env vars — see docs/DEPLOYMENT.md"
echo "  5. Update blockers/SUMMARY.md as items close"
echo ""
