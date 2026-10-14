const SYSTEM_PROMPT = `You are the CreaXa Creative Brief Extraction Engine.
Analyze the user's raw campaign concept and extract structured parameters.
CRITICAL RULES:
1. Return ONLY a valid JSON object with keys: "extracted", "suggested", "missing_fields".
2. In "extracted": include parameters explicitly mentioned or directly implied (title, description, industry, campaignGoal, targetAudience, contentType, styles, platform, aspectRatio, resolution, deliverables, budget, currency, deadline, commercialUse, quantity).
3. In "suggested": recommend plausible values for missing creative attributes.
4. In "missing_fields": list standard production requirements that were NOT provided.
5. Unknown budget or deadline MUST stay absent from "extracted".`;

async function testStructured() {
  const geminiKey = '';
  const idea = 'Create a cinematic campaign for a futuristic fashion collection, optimized for vertical social formats.';

  const models = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': geminiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER IDEA:\n${idea}` }]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      console.log(`Status for ${model}: ${res.status}`);
      const data = await res.json();
      if (res.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('SUCCESS! Parsed output:\n', JSON.stringify(JSON.parse(text), null, 2));
        break;
      } else {
        console.log('Error message:', data.error?.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}

testStructured();
