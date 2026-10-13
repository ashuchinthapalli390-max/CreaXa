import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envPath = path.resolve('.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq !== -1) {
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }
  return env;
}

export async function verifySupabase() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('================================================================');
  console.log('CREAXA — SUPABASE DATABASE VERIFICATION & DIAGNOSTIC');
  console.log('================================================================');
  console.log('Target URL:     ', url || '(Not configured)');
  console.log('Anon/Pub Key:   ', anonKey ? anonKey.slice(0, 15) + '...' : '(Not configured)');
  console.log('Service Role:   ', serviceKey ? serviceKey.slice(0, 15) + '...' : '(Not configured)');

  if (!url || (!anonKey && !serviceKey)) {
    console.error('\n❌ ERROR: Supabase credentials are missing in .env');
    return false;
  }

  const clientKey = serviceKey || anonKey;
  const sb = createClient(url, clientKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const tables = [
    'accounts',
    'profiles',
    'portfolios',
    'campaigns',
    'invitations',
    'engagements',
    'events',
    'files',
    'notifications',
    'reviews',
    'saved_searches',
    'project_tasks',
    'favorites',
    'evidence',
    'support',
    'audit',
    'limits'
  ];

  console.log('\nChecking 17 PostgreSQL Tables on Supabase...');

  const results = await Promise.all(
    tables.map(async (table) => {
      try {
        const { data, count, error } = await sb.from(table).select('*', { count: 'exact' }).limit(1);
        if (error) {
          if (error.code === 'PGRST205' || String(error.message).includes('not find the table') || String(error.message).includes('does not exist')) {
            return { table, status: 'MISSING', error: error.message };
          }
          return { table, status: 'ERROR', error: error.message };
        }
        return { table, status: 'ONLINE', count: count || 0 };
      } catch (e) {
        return { table, status: 'EXCEPTION', error: e.message };
      }
    })
  );

  let readyCount = 0;
  let missingCount = 0;

  for (const res of results) {
    if (res.status === 'ONLINE') {
      console.log(`  ✓ ${res.table.padEnd(16)} ONLINE (${res.count} rows)`);
      readyCount++;
    } else if (res.status === 'MISSING') {
      console.log(`  ✗ ${res.table.padEnd(16)} NOT CREATED YET (PGRST205)`);
      missingCount++;
    } else {
      console.log(`  ! ${res.table.padEnd(16)} ${res.status}: ${res.error}`);
    }
  }

  console.log('\nSummary: ' + readyCount + '/17 tables online, ' + missingCount + '/17 tables missing.');

  if (missingCount > 0) {
    const projectRef = new URL(url).hostname.split('.')[0];
    console.log('\n----------------------------------------------------------------');
    console.log('HOW TO CREATE THE TABLES IN SUPABASE:');
    console.log(`1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('2. Open file: supabase/consolidated_schema.sql');
    console.log('3. Copy all, paste into SQL Editor, and click "Run" (Ctrl+Enter).');
    console.log('4. Re-run: node scripts/verify-supabase.mjs');
    console.log('----------------------------------------------------------------\n');
    return false;
  } else {
    console.log('\n🎉 ALL 17 TABLES ARE PROVISIONED AND ONLINE IN SUPABASE!\n');
    return true;
  }
}

if (process.argv[1]?.endsWith('verify-supabase.mjs')) {
  verifySupabase();
}
