import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class OriginalityAgent extends BaseAgent {
  constructor() {
    super('Originality Agent', 'Evaluates novelty versus academic clichés, providing concrete differentiation strategies.');
  }

  async run(projectData, researchFindings = {}) {
    const systemPrompt = `You are an Academic Project Evaluator specialized in assessing originality and innovation in college minor projects.
Evaluate the concept thoroughly:
1. Assess how common the project concept is in academic and industry settings.
2. List 3-4 existing or conventional features that this project resembles (e.g., standard login, generic chatbot FAQ, basic CRUD tables).
3. Propose 3-4 novel differentiating features that could transform this project from a standard assignment into a distinctive showcase.
4. Give actionable tips on how the student team can pitch and construct uniqueness without over-promising.
5. Assign an Originality Score from 1 to 10 (be realistic; minor projects with existing parallels typically range between 5.5 and 8.5).
CRITICAL: Do NOT claim that the project is completely unique. Emphasize distinctive execution and smart feature synthesis.`;

    const expectedSchema = `{
      "originalityScore": 7.4,
      "commonalityAssessment": "Explanation of where the idea sits on the common vs novel spectrum...",
      "existingResemblance": [
        "Resembles standard campus information portals",
        "Resembles basic LLM customer service bots",
        "Resembles static calendar reminder tools"
      ],
      "uniqueAngleSuggestions": [
        "Suggestion 1: Real-time sensor-augmented scheduling...",
        "Suggestion 2: Verifiable citation linking to official pdf handbooks...",
        "Suggestion 3: Decentralized student feedback verification..."
      ],
      "differentiationTips": [
        "Pitch the project as a localized agentic assistant rather than a generic chatbot.",
        "Emphasize the physical-to-digital integration."
      ]
    }`;

    const promptContext = `
${this.formatProjectPrompt(projectData)}
Research Findings:
Novelty Classification: ${researchFindings.noveltyLevel || 'Moderately differentiated'}
Existing Solutions: ${(researchFindings.commonSolutions || []).join('; ')}
Differentiation Areas: ${(researchFindings.differentiationAreas || []).join('; ')}
    `.trim();

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, promptContext, expectedSchema);
        if (result && typeof result.originalityScore === 'number') {
          return result;
        }
      } catch (err) {
        console.warn(`[OriginalityAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData, researchFindings);
  }

  fallbackAnalysis(projectData, researchFindings) {
    const text = `${projectData.title} ${projectData.idea}`.toLowerCase();
    const isCampus = text.includes('campus') || text.includes('university') || text.includes('student');

    return {
      originalityScore: isCampus ? 7.6 : 7.2,
      commonalityAssessment: 'The overarching concept tackles a widely-experienced problem with recognized commercial and academic precedents. While similar core solutions exist, the project achieves moderate differentiation through contextual agent specialization rather than broad generic automation.',
      existingResemblance: [
        'Resembles traditional university portal apps and departmental bulletin boards',
        'Resembles standard FAQ retrieval bots commonly found in college repositories',
        'Resembles static calendar schedule viewing interfaces'
      ],
      uniqueAngleSuggestions: [
        'Integrate autonomous proactive alerts (e.g. notify students of sudden room schedule changes or impending deadlines).',
        'Implement verifiable RAG grounded strictly in uploaded institutional syllabi and circulars with page references.',
        'Add crowd-sourced telemetry or study desk occupancy voting to create a live communal utility.'
      ],
      differentiationTips: [
        'Frame the project during college presentation as an Agentic Campus Assistant with multi-step reasoning, not merely a single-turn chatbot.',
        'Highlight data reliability through source citations to overcome evaluator skepticism regarding AI hallucinations.'
      ]
    };
  }
}
