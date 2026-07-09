#!/usr/bin/env tsx
/**
 * Validate environment variables before dev or deploy.
 *
 * Usage:
 *   npm run validate-env          # local mode — seed data OK without Supabase
 *   npm run validate-env:strict   # production / connected mode
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { printValidationResults, validateEnvironment } from './env-validation';

function loadEnvFile(relativePath: string): void {
  const filePath = resolve(process.cwd(), relativePath);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function main(): void {
  const strict =
    process.argv.includes('--strict') ||
    process.env.VALIDATE_ENV_STRICT === '1' ||
    process.env.VALIDATE_ENV_STRICT === 'true';

  loadEnvFile('.env');
  loadEnvFile('.env.local');

  console.log('🔍 Validating Madcap Tees environment...\n');

  const result = validateEnvironment(strict);
  printValidationResults(result);

  if (!result.valid) {
    console.error('\n❌ Fix variables in .env.local — see .env.local.example\n');
    process.exit(1);
  }

  if (result.warnings.length > 0 && strict) {
    console.warn('\n⚠️  Strict mode passed with warnings — review before deploy.\n');
  } else {
    console.log('');
  }

  process.exit(0);
}

main();
