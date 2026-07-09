#!/usr/bin/env bash
# Print migration instructions and optionally open the bundled SQL file.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MIGRATION="$ROOT/supabase/migrations/001_initial_schema.sql"

echo "Madcap Tees — Supabase migration"
echo ""
echo "1. Open Supabase Dashboard → SQL Editor → New query"
echo "2. Paste and run BOTH migration files:"
echo "   - supabase/migrations/001_initial_schema.sql"
echo "   - supabase/migrations/002_storage_bucket.sql"
echo "3. Run the query"
echo "4. Storage → New bucket: product-images (public read)"
echo "5. Auth → Invite admin user → set profiles.is_admin = true"
echo ""
echo "Verify: npm run validate-env:strict (after .env.local is filled)"
echo ""

if command -v cat >/dev/null 2>&1; then
  echo "─── Migration file preview (first 20 lines) ───"
  head -n 20 "$MIGRATION"
  echo "... ($(wc -l < "$MIGRATION") total lines)"
fi
