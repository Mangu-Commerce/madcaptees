/**
 * Madcap Tees — environment variable validation
 * Used by scripts/validate-env.ts and launch-readiness checks.
 */

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
  mode: 'local' | 'strict';
}

interface EnvConfig {
  name: string;
  requiredInStrict: boolean;
  description: string;
  validate?: (value: string) => boolean | string;
}

const envConfigs: EnvConfig[] = [
  {
    name: 'VITE_SUPABASE_URL',
    requiredInStrict: true,
    description: 'Supabase project URL',
    validate: (value) => {
      if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        return 'Must be a valid Supabase URL (https://*.supabase.co)';
      }
      return true;
    },
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    requiredInStrict: true,
    description: 'Supabase anonymous (publishable) key',
    validate: (value) => (value.length < 20 ? 'Supabase anon key appears invalid' : true),
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    requiredInStrict: false,
    description: 'Supabase service role key (server-only)',
    validate: (value) => (value.length < 20 ? 'Service role key appears invalid' : true),
  },
  {
    name: 'VITE_STRIPE_PUBLISHABLE_KEY',
    requiredInStrict: false,
    description: 'Stripe publishable key (client)',
    validate: (value) => (!value.startsWith('pk_') ? 'Must start with pk_' : true),
  },
  {
    name: 'STRIPE_SECRET_KEY',
    requiredInStrict: false,
    description: 'Stripe secret key (server-only)',
    validate: (value) => (!value.startsWith('sk_') ? 'Must start with sk_' : true),
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    requiredInStrict: false,
    description: 'Stripe webhook signing secret (server-only)',
    validate: (value) => (!value.startsWith('whsec_') ? 'Must start with whsec_' : true),
  },
  {
    name: 'VITE_SITE_URL',
    requiredInStrict: true,
    description: 'Public site URL',
    validate: (value) =>
      !value.match(/^https?:\/\//) ? 'Must start with http:// or https://' : true,
  },
  {
    name: 'RESEND_API_KEY',
    requiredInStrict: false,
    description: 'Resend API key (order receipts)',
    validate: (value) => (value && !value.startsWith('re_') ? 'Must start with re_' : true),
  },
  {
    name: 'PRINTFUL_API_KEY',
    requiredInStrict: false,
    description: 'Printful API key (POD fulfillment)',
  },
];

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes('your-') ||
    lower.includes('placeholder') ||
    lower === 'pk_test_...' ||
    lower === 'sk_test_...' ||
    lower === 'whsec_...'
  );
}

export function validateEnvironment(strict = false): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  const mode = strict ? 'strict' : 'local';

  const hasSupabaseUrl = !!process.env.VITE_SUPABASE_URL && !isPlaceholder(process.env.VITE_SUPABASE_URL);
  const hasSupabaseAnon =
    !!process.env.VITE_SUPABASE_ANON_KEY && !isPlaceholder(process.env.VITE_SUPABASE_ANON_KEY);

  if (!strict && !hasSupabaseUrl && !hasSupabaseAnon) {
    warnings.push(
      'No Supabase config — app will use local seed data (src/lib/data.ts). Copy .env.local.example → .env.local when ready.'
    );
  }

  for (const config of envConfigs) {
    const value = process.env[config.name];

    if (strict && config.requiredInStrict && (!value || isPlaceholder(value))) {
      missing.push(config.name);
      continue;
    }

    if (value && !isPlaceholder(value) && config.validate) {
      const result = config.validate(value);
      if (result !== true) {
        warnings.push(`${config.name}: ${result}`);
      }
    }

    if (strict && value && isPlaceholder(value)) {
      missing.push(`${config.name} (still placeholder)`);
    }
  }

  const stripePub = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET;
  const anyStripe = [stripePub, stripeSecret, stripeWebhook].some(
    (v) => v && !isPlaceholder(v)
  );

  if (anyStripe) {
    if (!stripePub || isPlaceholder(stripePub)) {
      warnings.push('Stripe publishable key missing (required when using Stripe)');
    }
    if (!stripeSecret || isPlaceholder(stripeSecret)) {
      warnings.push('STRIPE_SECRET_KEY missing — payments need a server/Edge Function');
    }
    if (!stripeWebhook || isPlaceholder(stripeWebhook)) {
      warnings.push('STRIPE_WEBHOOK_SECRET missing — order confirmation needs webhooks');
    }
  }

  if (strict && hasSupabaseUrl && hasSupabaseAnon) {
  }

  return { valid: missing.length === 0, missing, warnings, mode };
}

export function printValidationResults(result: EnvValidationResult): void {
  console.log(`Mode: ${result.mode === 'strict' ? 'strict (production-ready)' : 'local (seed data OK)'}\n`);

  if (result.valid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed');
    return;
  }

  if (result.missing.length > 0) {
    console.error('❌ Missing or placeholder variables:');
    for (const name of result.missing) {
      const config = envConfigs.find((c) => c.name === name || name.startsWith(c.name));
      console.error(`   - ${name}: ${config?.description ?? 'Required in strict mode'}`);
    }
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.warn(`   - ${warning}`);
    }
  }
}
