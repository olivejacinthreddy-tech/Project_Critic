/**
 * Robust JSON Parser for LLM outputs
 * Handles markdown code fences, leading/trailing conversational text, and common json formatting glitches.
 */
export function cleanAndParseJSON(rawText, fallback = {}) {
  if (!rawText || typeof rawText !== 'string') {
    return fallback;
  }

  let text = rawText.trim();

  // Remove markdown code fences like ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (initialErr) {
    // Attempt to locate first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted);
      } catch (err2) {
        // Remove trailing commas before } or ]
        const sanitized = extracted
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        try {
          return JSON.parse(sanitized);
        } catch (err3) {
          console.error('[jsonParser] Failed to parse sanitized JSON substring:', err3.message);
        }
      }
    }

    console.error('[jsonParser] JSON parse error on raw output. First 200 chars:', text.slice(0, 200));
    return fallback;
  }
}
