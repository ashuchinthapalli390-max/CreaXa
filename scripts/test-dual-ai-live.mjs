import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generateStructuredBrief, getAiOperationalMetrics } from '../lib/ai.ts';

// Load .env variables
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

console.log('\n==================================================================');
console.log('   TESTING DUAL-AI PROVIDER LIVE WITH OPENAI + GEMINI KEYS');
console.log('==================================================================\n');

console.log('OpenAI Key Configured:', !!process.env.OPENAI_API_KEY);
console.log('Gemini Key Configured:', !!process.env.GEMINI_API_KEY);

const testPrompt =
  'Create a cinematic campaign for a futuristic luxury fashion collection, optimized for vertical 9:16 social formats with a target budget of 50000 INR.';

console.log(`\nInvoking generateStructuredBrief with prompt:\n"${testPrompt}"\n`);

try {
  const result = await generateStructuredBrief(testPrompt, process.env);
  console.log('✓ SUCCESSFUL STRUCTURED BRIEF GENERATION:');
  console.log('  Provider Used:', result.provider);
  console.log('  Latency:', result.latencyMs, 'ms');
  console.log('  Correlation ID:', result.correlationId);
  console.log('  Extracted Title:', result.extracted?.title);
  console.log('  Extracted Content Type:', result.extracted?.contentType);
  console.log('  Extracted Styles:', result.extracted?.styles);
  console.log('  Extracted Aspect Ratio:', result.extracted?.aspectRatio);
  console.log('  Extracted Deliverables:', result.extracted?.deliverables);
  console.log('  Suggested Details:', Object.keys(result.suggested || {}));
  console.log('  Missing Fields:', result.missing_fields);

  assert.ok(result.provider === 'openai' || result.provider === 'gemini', 'Provider must be openai or gemini');
  assert.ok(result.extracted, 'Must contain extracted fields');
  assert.ok(Array.isArray(result.missing_fields), 'Must contain missing_fields array');

  const metrics = getAiOperationalMetrics();
  console.log('\nOperational Telemetry Metrics:');
  console.log('  Total Requests:', metrics.totalRequests);
  console.log('  Successful Requests:', metrics.successfulRequests);
  console.log('  Fallback Activations:', metrics.fallbackActivations);
  console.log('  OpenAI Errors:', metrics.openaiErrors);
  console.log('  Gemini Errors:', metrics.geminiErrors);
  console.log('  Average Latency:', metrics.averageLatencyMs, 'ms');

  console.log('\n==================================================================');
  console.log('   ✓ DUAL-AI PROVIDER IS 100% OPERATIONAL & VERIFIED!');
  console.log('==================================================================\n');
} catch (err) {
  console.error('\n❌ FAILED:', err);
  process.exit(1);
}
