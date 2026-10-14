import { z } from 'zod';

export interface StructuredBriefResult {
  provider: 'openai' | 'gemini';
  extracted: {
    title?: string;
    description?: string;
    industry?: string;
    campaignGoal?: string;
    targetAudience?: string;
    contentType?: string;
    styles?: string[];
    platform?: string;
    aspectRatio?: string;
    resolution?: string;
    deliverables?: string[];
    budget?: number;
    currency?: string;
    deadline?: string;
    commercialUse?: string;
    quantity?: number;
  };
  suggested: Record<string, any>;
  missing_fields: string[];
  latencyMs: number;
  correlationId: string;
}

export interface AiOperationalMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  fallbackActivations: number;
  openaiErrors: number;
  geminiErrors: number;
  averageLatencyMs: number;
  lastProviderUsed: string;
  lastUpdated: string;
}

// In-memory operational metrics accumulator
const metrics: AiOperationalMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  fallbackActivations: 0,
  openaiErrors: 0,
  geminiErrors: 0,
  averageLatencyMs: 0,
  lastProviderUsed: 'none',
  lastUpdated: new Date().toISOString()
};

let totalLatencyAccum = 0;

export function getAiOperationalMetrics(): AiOperationalMetrics {
  return { ...metrics };
}

function updateMetrics(provider: string, success: boolean, latencyMs: number, usedFallback: boolean) {
  metrics.totalRequests++;
  if (success) {
    metrics.successfulRequests++;
    totalLatencyAccum += latencyMs;
    metrics.averageLatencyMs = Math.round(totalLatencyAccum / metrics.successfulRequests);
    metrics.lastProviderUsed = provider;
  } else {
    metrics.failedRequests++;
  }
  if (usedFallback) {
    metrics.fallbackActivations++;
  }
  metrics.lastUpdated = new Date().toISOString();
}

// Universal Schema for campaign briefs
const briefOutputSchema = z.object({
  extracted: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    industry: z.string().optional(),
    campaignGoal: z.string().optional(),
    targetAudience: z.string().optional(),
    contentType: z.string().optional(),
    styles: z.array(z.string()).optional(),
    platform: z.string().optional(),
    aspectRatio: z.string().optional(),
    resolution: z.string().optional(),
    deliverables: z.array(z.string()).optional(),
    budget: z.number().optional(),
    currency: z.string().optional(),
    deadline: z.string().optional(),
    commercialUse: z.string().optional(),
    quantity: z.number().optional()
  }).default({}),
  suggested: z.record(z.unknown()).default({}),
  missing_fields: z.array(z.string()).default([])
});

const SYSTEM_PROMPT = `You are the CreaXa Creative Brief Extraction Engine.
Analyze the user's raw campaign concept and extract structured parameters.
CRITICAL RULES:
1. Return ONLY a valid JSON object with keys: "extracted", "suggested", "missing_fields".
2. In "extracted": include ONLY parameters explicitly mentioned or directly implied by user input (title, description, industry, campaignGoal, targetAudience, contentType, styles, platform, aspectRatio, resolution, deliverables, budget, currency, deadline, commercialUse, quantity).
3. In "suggested": recommend plausible values for missing creative attributes (e.g. recommended styles, target platform, typical turnaround).
4. In "missing_fields": list standard production requirements that were NOT provided by the user (e.g. "budget", "deadline", "aspectRatio", "commercialUse").
5. NEVER fabricate client names, confirmed budgets, or legal rights that were not supplied.
6. Unknown budget or deadline MUST stay absent from "extracted".`;

/**
 * Call primary OpenAI provider with strict timeout
 */
async function callOpenAI(apiKey: string, idea: string, timeoutMs = 9000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: idea }
        ],
        temperature: 0.2
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data: any = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned empty message content');
    }
    return JSON.parse(content);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Call secondary Google Gemini provider with strict timeout
 */
async function callGemini(apiKey: string, idea: string, timeoutMs = 9000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nUSER IDEA:\n${idea}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const data: any = await res.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
      throw new Error('Gemini returned empty candidate content');
    }
    return JSON.parse(textOutput);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Dual-Provider Orchestrator:
 * Attempts OpenAI primary -> On 429/5xx/timeout/error -> Fallback to Google Gemini
 */
export async function generateStructuredBrief(
  idea: string,
  envVars: Record<string, any> = {}
): Promise<StructuredBriefResult> {
  const correlationId = 'cx_ai_' + Math.random().toString(36).slice(2, 10);
  const startTime = Date.now();

  const openaiKey = envVars.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const geminiKey = envVars.GEMINI_API_KEY || process.env.GEMINI_API_KEY || envVars.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (!openaiKey && !geminiKey) {
    throw new Error('AI brief assistant is not currently configured. You can create your campaign brief manually.');
  }

  let rawOutput: any = null;
  let providerUsed: 'openai' | 'gemini' = 'openai';
  let usedFallback = false;

  // 1. Attempt Primary Provider: OpenAI
  if (openaiKey) {
    try {
      rawOutput = await callOpenAI(openaiKey, idea);
      providerUsed = 'openai';
    } catch (openaiErr: any) {
      console.warn(`[CreaXa AI] OpenAI primary failed (${openaiErr.message}). Initiating Gemini fallback.`);
      metrics.openaiErrors++;

      if (geminiKey) {
        usedFallback = true;
        try {
          rawOutput = await callGemini(geminiKey, idea);
          providerUsed = 'gemini';
        } catch (geminiErr: any) {
          console.error(`[CreaXa AI] Gemini fallback also failed: ${geminiErr.message}`);
          metrics.geminiErrors++;
          updateMetrics('all', false, Date.now() - startTime, true);
          throw new Error('Creative brief AI is temporarily unavailable across all providers. Please use the manual brief form.');
        }
      } else {
        updateMetrics('openai', false, Date.now() - startTime, false);
        throw new Error('AI brief service is temporarily unavailable. Please create your brief manually.');
      }
    }
  } else if (geminiKey) {
    // Only Gemini configured
    try {
      rawOutput = await callGemini(geminiKey, idea);
      providerUsed = 'gemini';
    } catch (geminiErr: any) {
      metrics.geminiErrors++;
      updateMetrics('gemini', false, Date.now() - startTime, false);
      throw new Error('Creative brief AI is temporarily unavailable. Please use the manual brief form.');
    }
  }

  // 2. Normalize and validate output schema
  const parsed = briefOutputSchema.safeParse(rawOutput);
  if (!parsed.success) {
    console.warn('[CreaXa AI] Schema validation fallback:', parsed.error.issues);
    // Provide safe defaults if structure differed slightly
    const safeExtracted = rawOutput?.extracted || rawOutput || {};
    const safeMissing = Array.isArray(rawOutput?.missing_fields)
      ? rawOutput.missing_fields
      : ['budget', 'deadline', 'aspectRatio'];
    const safeSuggested = rawOutput?.suggested || {};

    const latencyMs = Date.now() - startTime;
    updateMetrics(providerUsed, true, latencyMs, usedFallback);

    return {
      provider: providerUsed,
      extracted: safeExtracted,
      suggested: safeSuggested,
      missing_fields: safeMissing,
      latencyMs,
      correlationId
    };
  }

  const latencyMs = Date.now() - startTime;
  updateMetrics(providerUsed, true, latencyMs, usedFallback);

  return {
    provider: providerUsed,
    extracted: parsed.data.extracted,
    suggested: parsed.data.suggested,
    missing_fields: parsed.data.missing_fields,
    latencyMs,
    correlationId
  };
}
