import { aiConfig } from '../config/aiConfig.js';
import { cleanAndParseJSON } from '../utils/jsonParser.js';

/**
 * Call the Gemini API with structured prompt and JSON response format
 */
export async function callGemini(systemPrompt, userPrompt, expectedSchemaDescription = '') {
  const apiKey = aiConfig.getApiKey();
  const model = aiConfig.getModel();

  if (!aiConfig.isConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\n${expectedSchemaDescription ? `Return valid JSON matching this schema: ${expectedSchemaDescription}\n` : ''}\nINPUT DATA:\n${userPrompt}\n\nIMPORTANT: Return ONLY the JSON object. Do not wrap with explanation outside the JSON.`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.85,
      responseMimeType: 'application/json'
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      let parsedError = errBody;
      try {
        const jsonErr = JSON.parse(errBody);
        parsedError = jsonErr.error?.message || errBody;
      } catch (e) {
        // use raw errBody
      }
      throw new Error(`Gemini API error (${response.status}): ${parsedError}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini API returned empty response candidates.');
    }

    return cleanAndParseJSON(candidateText, null);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Gemini API request timed out after 45 seconds.');
    }
    throw error;
  }
}
