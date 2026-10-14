import assert from 'node:assert/strict';
import { generateStructuredBrief, getAiOperationalMetrics } from '../lib/ai.ts';

console.log('Testing Dual-Provider AI Engine (OpenAI + Gemini Fallback)...');

// Test 1: Missing credentials should fail gracefully without crash
try {
  await generateStructuredBrief('A luxury perfume cinematic commercial in 9:16 vertical video', {});
  assert.fail('Should fail when no API keys are provided');
} catch (err) {
  assert.ok(err.message.includes('not currently configured') || err.message.includes('manually'));
  console.log('   ✓ Graceful fallback message when unconfigured');
}

// Test 2: Fallback logic simulation with mock keys
const mockEnv = {
  OPENAI_API_KEY: 'invalid-openai-key-for-test',
  GEMINI_API_KEY: 'invalid-gemini-key-for-test'
};

try {
  await generateStructuredBrief('Futuristic fashion editorial campaign in 4K', mockEnv);
} catch (err) {
  // It should attempt OpenAI, fail, attempt Gemini, fail, and throw clean error
  const metrics = getAiOperationalMetrics();
  console.log('   Metrics after fallback attempt:', metrics);
  assert.ok(metrics.openaiErrors > 0, 'Should record OpenAI failure');
  assert.ok(metrics.geminiErrors > 0, 'Should record Gemini fallback failure');
  console.log('   ✓ Automatic failover from OpenAI to Gemini verified in telemetry');
}

console.log('\n✓ Dual-Provider AI Unit Tests Passed Successfully!');
