import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import ts from 'typescript';

const tmp = '.sites-runtime/currency-verification';
fs.mkdirSync(tmp, { recursive: true });

const transpile = (s) => ts.transpileModule(s, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
}).outputText;

fs.writeFileSync(`${tmp}/currency.mjs`, transpile(fs.readFileSync('lib/currency.ts', 'utf8')));
let matching = fs.readFileSync('lib/matching.ts', 'utf8').replace("from './currency'", "from './currency.mjs'");
fs.writeFileSync(`${tmp}/matching.mjs`, transpile(matching));
fs.writeFileSync(`${tmp}/enhancements.mjs`, transpile(fs.readFileSync('lib/enhancements.ts', 'utf8')));
fs.writeFileSync(`${tmp}/database.mjs`, transpile(fs.readFileSync('lib/database.ts', 'utf8')
  .replace(/import\s*\{\s*env\s*\}\s*from ['"]cloudflare:workers['"];?/, "const env=globalThis.__verificationEnv;")
  .replace(/import\s*\{[^}]*\}\s*from ['"]\.\/supabase['"];?/, "const isSupabaseConfigured=()=>false; const getSupabaseAdmin=()=>null;")));

let server = fs.readFileSync('lib/server.ts', 'utf8')
  .replace(/import\s*\{\s*env\s*\}\s*from ['"]cloudflare:workers['"];?/, "const env=globalThis.__verificationEnv;")
  .replace(/import\s*\{\s*getAuthUser\s*\}\s*from ['"]\.\.\/app\/auth['"];?/, "const getAuthUser=async()=>globalThis.__verificationUser;")
  .replace(/import\s*\{[^}]*getAuthenticatedUser[^}]*\}\s*from ['"]\.\/auth-edge['"];?/, "const getAuthenticatedUser=async()=>globalThis.__verificationUser; const verifyFirebaseIdToken=async()=>globalThis.__verificationUser;")
  .replace(/import\s*\{\s*getChatGPTUser\s*\}\s*from ['"]\.\.\/app\/chatgpt-auth['"];?/, "const getChatGPTUser=async()=>globalThis.__verificationUser;")
  .replace("from './matching'", "from './matching.mjs'")
  .replace("from './enhancements'", "from './enhancements.mjs'")
  .replace("from './database'", "from './database.mjs'")
  .replace("from './currency'", "from './currency.mjs'");
fs.writeFileSync(`${tmp}/server.mjs`, transpile(server));

const sql = new DatabaseSync(':memory:');
sql.exec('PRAGMA foreign_keys=ON');
for (const f of fs.readdirSync('drizzle').filter(s => s.endsWith('.sql')).sort()) {
  sql.exec(fs.readFileSync('drizzle/' + f, 'utf8'));
}

const bindValue = v => v === undefined ? null : typeof v === 'boolean' ? Number(v) : v;
function prepare(query) {
  return {
    args: [],
    bind(...args) { this.args = args.map(bindValue); return this; },
    async all() { return { results: sql.prepare(query).all(...this.args) }; },
    async first() { return sql.prepare(query).get(...this.args) || null; },
    async run() { const r = sql.prepare(query).run(...this.args); return { meta: { changes: Number(r.changes) } }; }
  };
}

globalThis.__verificationEnv = {
  DB: {
    prepare,
    async batch(statements) {
      sql.exec('BEGIN');
      try {
        const results = [];
        for (const s of statements) results.push(await s.run());
        sql.exec('COMMIT');
        return results;
      } catch (e) {
        sql.exec('ROLLBACK');
        throw e;
      }
    }
  },
  BUCKET: {
    async put() {},
    async get() { return null; },
    async delete() {}
  }
};

const { compareBudget, normalizeCurrency, formatMoney } = await import('../' + tmp + '/currency.mjs');
const { match } = await import('../' + tmp + '/matching.mjs');
const { handle } = await import('../' + tmp + '/server.mjs');

console.log('Testing centralized currency service...');

// 1. Currency normalization & validation
assert.equal(normalizeCurrency('inr'), 'INR');
assert.equal(normalizeCurrency('USD'), 'USD');
assert.equal(normalizeCurrency('eur'), 'EUR');
assert.equal(normalizeCurrency('invalid', 'USD'), 'USD');
assert.equal(normalizeCurrency(null, 'INR'), 'INR');

// 2. Money formatting
assert.ok(formatMoney(1000, 'INR').includes('1,000') || formatMoney(1000, 'INR').includes('1.000'));
assert.ok(formatMoney(500, 'USD').includes('500'));
assert.ok(formatMoney(250, 'EUR').includes('250'));

// 3. Same-currency comparisons
// INR with INR
const inrOk = compareBudget(10000, 'INR', 15000, 'INR');
assert.equal(inrOk.comparable, true);
assert.equal(inrOk.withinBudget, true);

// USD with USD
const usdOk = compareBudget(500, 'USD', 500, 'USD');
assert.equal(usdOk.comparable, true);
assert.equal(usdOk.withinBudget, true, 'Rate equal to budget should be inclusive');

// EUR with EUR
const eurExceed = compareBudget(1200, 'EUR', 1000, 'EUR');
assert.equal(eurExceed.comparable, true);
assert.equal(eurExceed.withinBudget, false, 'Rate exceeding budget should not be within budget');

// 4. Cross-currency comparisons (Option A baseline: not comparable without FX conversion)
const crossInrUsd = compareBudget(10000, 'INR', 500, 'USD');
assert.equal(crossInrUsd.comparable, false);
assert.equal(crossInrUsd.withinBudget, false);

const crossUsdEur = compareBudget(500, 'USD', 600, 'EUR');
assert.equal(crossUsdEur.comparable, false);
assert.equal(crossUsdEur.withinBudget, false);

// 5. Boundary values & unconstrained rates
assert.equal(compareBudget(0, 'USD', 500, 'USD').withinBudget, true, 'Rate on request is acceptable');
assert.equal(compareBudget(500, 'USD', 0, 'USD').withinBudget, true, 'Unconstrained budget accepts any rate');
assert.equal(compareBudget(null, 'USD', null, 'USD').withinBudget, true);

// 6. Matching algorithm tests
const baseCampaign = {
  title: 'Global Campaign',
  description: 'AI Video campaign',
  industry: 'Tech',
  contentType: 'AI Video',
  styles: ['Cinematic'],
  specializations: ['AI Filmmaking'],
  tools: ['Runway'],
  platform: 'Instagram',
  aspectRatio: '9:16',
  quantity: 1,
  budget: 1000,
  currency: 'USD',
  deadline: '2026-12-31',
  revisions: 2,
  commercialUse: 'Paid advertising',
  status: 'published'
};

const baseCreator = {
  name: 'USD Creator',
  slug: 'usd-creator',
  headline: 'AI Director',
  bio: 'Specialized in high-end visuals',
  specializations: ['AI Filmmaking'],
  styles: ['Cinematic'],
  tools: ['Runway'],
  industries: ['Tech'],
  contentTypes: ['AI Video'],
  aspectRatios: ['9:16'],
  rate: 800,
  currency: 'USD',
  turnaround: 5,
  availability: 'Available',
  commercial: true,
  revisions: 2,
  published: true
};

// USD campaign with USD creator within budget
const m1 = match(baseCampaign, { published: 1, data: baseCreator });
assert.ok(m1 !== null, 'USD campaign should match USD creator');
assert.equal(m1.reasons.find(r => r.label === 'Within budget').points, 10);

// USD campaign with creator exceeding budget
const mExceed = match(baseCampaign, { published: 1, data: { ...baseCreator, rate: 1500 } });
assert.equal(mExceed, null, 'Rate exceeding budget should disqualify creator');

// USD campaign with creator equal to budget (boundary)
const mEqual = match(baseCampaign, { published: 1, data: { ...baseCreator, rate: 1000 } });
assert.ok(mEqual !== null, 'Rate equal to budget should match');

// USD campaign with INR creator (cross currency)
const mCross = match(baseCampaign, { published: 1, data: { ...baseCreator, currency: 'INR', rate: 10000 } });
assert.equal(mCross, null, 'Cross currency without conversion should disqualify from strict budget match');

// EUR campaign with EUR creator
const eurCampaign = { ...baseCampaign, currency: 'EUR', budget: 750 };
const eurCreator = { ...baseCreator, currency: 'EUR', rate: 700 };
const mEur = match(eurCampaign, { published: 1, data: eurCreator });
assert.ok(mEur !== null, 'EUR campaign should match EUR creator');

console.log('Testing SQL database discovery with multi-currency filter...');

const origin = 'https://verification.invalid';
async function apiCall(path, user = null) {
  globalThis.__verificationUser = user ? { userId: user, email: user + '@test.local' } : null;
  const req = new Request(origin + '/api/' + path, {
    method: 'GET',
    headers: { origin }
  });
  const r = await handle(req, path.split('?')[0].split('/'));
  return await r.json();
}

// Seed accounts and creators in INR, USD, EUR
const creators = [
  { id: 'c_inr', email: 'inr@test.local', name: 'INR Creator', rate: 5000, currency: 'INR' },
  { id: 'c_usd1', email: 'usd1@test.local', name: 'USD Creator Low', rate: 100, currency: 'USD' },
  { id: 'c_usd2', email: 'usd2@test.local', name: 'USD Creator High', rate: 800, currency: 'USD' },
  { id: 'c_eur', email: 'eur@test.local', name: 'EUR Creator', rate: 300, currency: 'EUR' }
];

for (const cr of creators) {
  sql.exec(`INSERT INTO accounts (id, email, name, role, data, created, updated) VALUES ('${cr.id}', '${cr.email}', '${cr.name}', 'creator', '{}', 1, 1)`);
  const profileData = JSON.stringify({
    name: cr.name,
    headline: 'Creative talent',
    rate: cr.rate,
    currency: cr.currency,
    availability: 'Available',
    specializations: ['AI Filmmaking'],
    tools: ['Runway']
  });
  sql.exec(`INSERT INTO profiles (id, slug, published, verification, data, updated) VALUES ('${cr.id}', '${cr.id}', 1, 'self-declared', '${profileData}', 1)`);
}

// 7. Verify discovery without rate filter returns all 4 published creators
const allRes = await apiCall('discovery');
assert.equal(allRes.total, 4, 'Should list all 4 published creators without rate filter');

// 8. Verify INR discovery filter: default currency INR min=4000 max=6000
const inrRes = await apiCall('discovery?min=4000&max=6000');
assert.equal(inrRes.total, 1, 'Should find only INR Creator');
assert.equal(inrRes.items[0].id, 'c_inr');

// 9. Verify USD discovery filter: currency=USD min=50 max=500
const usdRes = await apiCall('discovery?currency=USD&min=50&max=500');
assert.equal(usdRes.total, 1, 'Should find only USD Creator Low');
assert.equal(usdRes.items[0].id, 'c_usd1');

// 10. Verify USD discovery filter with wider range: min=50 max=1000
const usdAllRes = await apiCall('discovery?currency=USD&min=50&max=1000');
assert.equal(usdAllRes.total, 2, 'Should find both USD creators');

// 11. Verify EUR discovery filter: currency=EUR min=200 max=400
const eurRes = await apiCall('discovery?currency=EUR&min=200&max=400');
assert.equal(eurRes.total, 1, 'Should find EUR Creator');
assert.equal(eurRes.items[0].id, 'c_eur');

// 12. Verify empty results when no creators match budget
const noneRes = await apiCall('discovery?currency=USD&min=2000');
assert.equal(noneRes.total, 0, 'Should return 0 creators when rate exceeds available creators');

sql.close();
fs.rmSync(tmp, { recursive: true });

console.log('All 12 Currency and Budget Filter verification tests PASSED cleanly!');
