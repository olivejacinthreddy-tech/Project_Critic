import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class FeasibilityAgent extends BaseAgent {
  constructor() {
    super('Feasibility Agent', 'Evaluates technical, temporal, skill, resource, and AI dimensions on 1-10 scales.');
  }

  async run(projectData, techStack = {}) {
    const systemPrompt = `You are a Technical Feasibility Assessor for college minor projects.
Evaluate the feasibility of building this project specifically within the context of a student minor project (typically 2-4 team members, 3-8 weeks, limited budget).
Analyze the following 5 dimensions:
1. Technical feasibility (score 1-10)
2. Time feasibility (score 1-10)
3. Skill feasibility (score 1-10, taking into account the user's declared skill level: ${projectData.skillLevel || 'Intermediate'})
4. Resource feasibility (score 1-10, considering student hardware, APIs, hosting)
5. AI feasibility (score 1-10, viability of GenAI/ML models in delivering reliable results)
Explain EACH score in simple, transparent, student-friendly language (1-2 sentences each).
Also compute an overall feasibilityScore average (1-10).`;

    const expectedSchema = `{
      "technicalScore": 8.5,
      "timeScore": 7.5,
      "skillScore": 8.0,
      "resourceScore": 8.5,
      "aiScore": 9.0,
      "overallFeasibilityScore": 8.3,
      "explanations": {
        "technical": "Clear explanation of technical hurdles or strengths...",
        "time": "Explanation regarding the stated timeline...",
        "skill": "Explanation calibrated to skill level...",
        "resource": "Explanation of required hardware/cloud resources...",
        "ai": "Explanation of AI reliability and hallucinations..."
      },
      "summary": "Overall feasibility assessment verdict in 1-2 sentences."
    }`;

    const promptContext = `
${this.formatProjectPrompt(projectData)}
Recommended Stack:
Frontend: ${techStack.frontend?.name || 'React'}
Backend: ${techStack.backend?.name || 'Node.js'}
AI: ${techStack.aiTechnologies?.name || 'Gemini API'}
    `.trim();

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, promptContext, expectedSchema);
        if (result && typeof result.technicalScore === 'number') {
          return result;
        }
      } catch (err) {
        console.warn(`[FeasibilityAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData);
  }

  fallbackAnalysis(projectData) {
    const skill = (projectData.skillLevel || 'intermediate').toLowerCase();
    const isBeginner = skill.includes('begin');
    const isAdvanced = skill.includes('adv');

    const techScore = isBeginner ? 7.2 : (isAdvanced ? 8.8 : 8.2);
    const timeScore = 7.8;
    const skillScore = isBeginner ? 6.9 : (isAdvanced ? 9.0 : 8.1);
    const resourceScore = 8.5;
    const aiScore = 8.6;
    const overall = Number(((techScore + timeScore + skillScore + resourceScore + aiScore) / 5).toFixed(1));

    return {
      technicalScore: techScore,
      timeScore: timeScore,
      skillScore: skillScore,
      resourceScore: resourceScore,
      aiScore: aiScore,
      overallFeasibilityScore: overall,
      explanations: {
        technical: 'Standard web frameworks and established REST patterns make the core architecture reliable and well-documented for minor project development.',
        time: `With a team of ${projectData.teamSize || '2-3'} students, a prototype can be completed within 4–6 weeks by scoping to essential core MVP features first.`,
        skill: `Appropriate for an ${projectData.skillLevel || 'Intermediate'} skill level; developers familiar with modern JavaScript and basic API calls can implement the logic comfortably.`,
        resource: 'All development can be conducted on standard student laptops with free-tier cloud hosting (Render/Vercel) and free API developer quotas.',
        ai: 'Modern LLMs like Gemini provide predictable structured JSON extraction and RAG capabilities with minimal prompt tuning.'
      },
      summary: `High overall feasibility (${overall}/10). The technical stack is well within minor project bounds if the initial release focuses strictly on core workflows.`
    };
  }
}
