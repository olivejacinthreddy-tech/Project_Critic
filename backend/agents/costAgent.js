import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class CostAndComplexityAgent extends BaseAgent {
  constructor() {
    super('Cost & Complexity Agent', 'Estimates student development duration, complexity tier, and infrastructure expenditure.');
  }

  async run(projectData, techStack = {}, feasibility = {}) {
    const systemPrompt = `You are a Project Management and Infrastructure Cost Consultant for student software projects.
Analyze the expected development complexity, duration, and budget requirements for college students:
1. Assign Complexity: strictly one of "Easy", "Moderate", or "Difficult".
2. Provide Estimated Development Duration: realistic student timeline (e.g. "3–5 weeks" or "4–6 weeks").
3. Provide Estimated Cost Range (e.g. "$0 (Free tier) to $15/month").
4. Cost Explanation: Explain the approximate breakdown (e.g. free cloud tiers on Vercel/Render vs pay-per-token API quotas). Explicitly state that actual costs depend on token consumption and traffic.
5. List 2-3 third-party services needed.
6. Detail API usage requirements, Database storage requirements, and Hosting specifications.`;

    const expectedSchema = `{
      "complexityLevel": "Easy" | "Moderate" | "Difficult",
      "estimatedDuration": "3–5 weeks",
      "estimatedCostRange": "$0 - $15 / month (Student Free Tier available)",
      "costExplanation": "Clear explanation stating that initial student development can be completed at $0 using free-tier allowances...",
      "thirdPartyServices": ["Google Gemini API", "Vercel / Render", "MongoDB Atlas"],
      "apiRequirements": "Details on token volumes and rate limits...",
      "databaseRequirements": "Storage and collection needs...",
      "hostingRequirements": "Frontend CDN and serverless backend specifications..."
    }`;

    const promptContext = `
${this.formatProjectPrompt(projectData)}
Tech Stack:
Frontend: ${techStack.frontend?.name || 'React'}
Backend: ${techStack.backend?.name || 'Node.js'}
DB: ${techStack.database?.name || 'MongoDB'}
AI: ${techStack.aiTechnologies?.name || 'Gemini'}
    `.trim();

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, promptContext, expectedSchema);
        if (result && ['Easy', 'Moderate', 'Difficult'].includes(result.complexityLevel)) {
          return result;
        }
      } catch (err) {
        console.warn(`[CostAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData);
  }

  fallbackAnalysis(projectData) {
    const text = `${projectData.title} ${projectData.idea} ${projectData.projectType}`.toLowerCase();
    const isIoT = text.includes('iot') || text.includes('hardware') || text.includes('sensor');

    if (isIoT) {
      return {
        complexityLevel: 'Difficult',
        estimatedDuration: '6–8 weeks',
        estimatedCostRange: '$40 - $90 (Hardware components + Cloud Free Tier)',
        costExplanation: 'Hardware procurement (Raspberry Pi/ESP32, camera module, servo motors) incurs a one-time student investment, whereas cloud backend telemetry can remain entirely on free tiers.',
        thirdPartyServices: ['Google Cloud / AWS IoT Core', 'Render free tier', 'MongoDB Atlas M0 Free Cluster'],
        apiRequirements: 'Minimal cloud API consumption if vision inference runs directly on-device; periodic telemetry syncing requires under 10k monthly requests.',
        databaseRequirements: 'Lightweight time-series collection under 512MB on MongoDB Atlas free cluster.',
        hostingRequirements: 'Static frontend hosted on Vercel; edge daemon operating on Linux systemd service.'
      };
    }

    return {
      complexityLevel: 'Moderate',
      estimatedDuration: projectData.timeline || '4–6 weeks',
      estimatedCostRange: '$0 - $10 / month (Fully achievable on Student Free Tiers)',
      costExplanation: 'For college academic evaluation, standard hosting on Vercel and Render is free. Google AI Studio provides generous free-tier API quotas. Actual future production costs depend on monthly token consumption and active concurrent user scale.',
      thirdPartyServices: ['Google Gemini API', 'MongoDB Atlas M0 Sandbox', 'Vercel / Render Free Hosting'],
      apiRequirements: 'Average of 2,000–5,000 token interactions per evaluation test session; well within free Google AI developer limits.',
      databaseRequirements: 'MongoDB Atlas free M0 cluster (512MB storage), sufficient for storing hundreds of user analyses, schedules, and document indexes.',
      hostingRequirements: 'Serverless frontend deployment with Node.js container or web service running on free cloud instance.'
    };
  }
}
