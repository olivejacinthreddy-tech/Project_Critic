import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class CriticAgent extends BaseAgent {
  constructor() {
    super('Critic / Decision Agent', 'Synthesizes all multi-agent findings, performs SWOT & risk evaluation, and issues the final verdict.');
  }

  async run(projectData, agentPipelineResults = {}) {
    const systemPrompt = `You are the Chief Academic Evaluator and Critic Agent.
You have received detailed diagnostic reports from 5 specialized agents:
- Research Agent (market landscape, novelty classification, similar solutions)
- Technology Agent (frontend, backend, db, AI, hosting)
- Feasibility Agent (technical, time, skill, resource, AI feasibility scores)
- Originality Agent (originality score, clichés to avoid, differentiation angles)
- Cost & Complexity Agent (complexity, timeline, budget range)

Your job is to synthesize these findings and generate the definitive project verdict:
1. Identify 3-5 key Strengths of the project.
2. Identify 3-4 Weaknesses / vulnerabilities.
3. Identify 3-4 critical Technical or Execution Risks.
4. Evaluate Suitability: Explicitly confirm whether this is appropriate for a college minor project.
5. Provide Feature Roadmap grouped into:
   - Must Have (Core MVP features essential for presentation)
   - Should Have (High-value differentiators)
   - Optional (Stretch goals / future enhancements)
6. Generate an Overall Score from 1.0 to 10.0 (calibrated weighted average of Feasibility, Originality, Practical Utility, Complexity).
7. Assign a Final Recommendation strictly from one of:
   - "Highly Recommended"
   - "Recommended with Improvements"
   - "Needs Major Changes"
   - "Not Recommended"
8. Provide a comprehensive, inspiring yet realistic Conclusion paragraph.`;

    const expectedSchema = `{
      "overallScore": 8.3,
      "verdict": "Recommended with Improvements" | "Highly Recommended" | "Needs Major Changes" | "Not Recommended",
      "suitabilityVerdict": "Detailed statement on academic minor project appropriateness...",
      "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
      "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
      "risks": ["Risk 1", "Risk 2", "Risk 3"],
      "recommendedFeatures": {
        "mustHave": ["Feature 1", "Feature 2", "Feature 3"],
        "shouldHave": ["Feature 4", "Feature 5"],
        "optional": ["Feature 6", "Feature 7"]
      },
      "conclusion": "Final inspiring conclusion summarizing why this project will impress college evaluators with the proper execution."
    }`;

    const promptContext = `
${this.formatProjectPrompt(projectData)}

PREVIOUS AGENT FINDINGS:
1. Research Agent:
Novelty: ${agentPipelineResults.research?.noveltyLevel}
Similar Existing Systems: ${(agentPipelineResults.research?.commonSolutions || []).join(', ')}
Summary: ${agentPipelineResults.research?.findingsSummary}

2. Technology Agent:
Frontend: ${agentPipelineResults.technology?.frontend?.name}
Backend: ${agentPipelineResults.technology?.backend?.name}
DB: ${agentPipelineResults.technology?.database?.name}
AI: ${agentPipelineResults.technology?.aiTechnologies?.name}

3. Feasibility Agent:
Feasibility Score: ${agentPipelineResults.feasibility?.overallFeasibilityScore || 8.0}/10
Technical: ${agentPipelineResults.feasibility?.technicalScore}
Time: ${agentPipelineResults.feasibility?.timeScore}
Skill: ${agentPipelineResults.feasibility?.skillScore}

4. Originality Agent:
Originality Score: ${agentPipelineResults.originality?.originalityScore || 7.5}/10
Unique Angles: ${(agentPipelineResults.originality?.uniqueAngleSuggestions || []).join('; ')}

5. Cost & Complexity Agent:
Complexity: ${agentPipelineResults.costAndComplexity?.complexityLevel}
Timeline: ${agentPipelineResults.costAndComplexity?.estimatedDuration}
Cost: ${agentPipelineResults.costAndComplexity?.estimatedCostRange}
    `.trim();

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, promptContext, expectedSchema);
        if (result && typeof result.overallScore === 'number' && result.verdict) {
          return result;
        }
      } catch (err) {
        console.warn(`[CriticAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData, agentPipelineResults);
  }

  fallbackAnalysis(projectData, agentPipelineResults) {
    const text = `${projectData.title} ${projectData.idea}`.toLowerCase();
    const isCampus = text.includes('campus') || text.includes('university') || text.includes('student');

    if (isCampus) {
      return {
        overallScore: 8.4,
        verdict: 'Recommended with Improvements',
        suitabilityVerdict: 'Exceptionally well-suited for a college minor project. The problem domain is directly relatable to academic faculty, demonstrating practical software engineering, vector search RAG, and live API integration.',
        strengths: [
          'High practical relevance with immediate usability for students and faculty on campus.',
          'Demonstrates contemporary GenAI techniques (RAG, prompt grounding) beyond simple prompt wrappers.',
          'Clear modular boundaries allowing team members to divide frontend, API backend, and AI pipeline efficiently.',
          'Strong demonstration potential during project viva with live queries and room availability checks.'
        ],
        weaknesses: [
          'Risk of being perceived as a generic chatbot if the physical campus telemetry and RAG citations are omitted.',
          'Potential API latency when querying large document indexes on low-tier student hosting.',
          'Dependency on initial manual data ingestion of campus handbooks and timetables.'
        ],
        risks: [
          'Hallucination risk: Generative AI providing outdated exam rules without strict RAG source grounding.',
          'Data drift: Timetable changes or room reallocations requiring automated synchronization mechanisms.',
          'Scope creep: Attempting to build an entire ERP campus portal rather than polishing the core AI assistant.'
        ],
        recommendedFeatures: {
          mustHave: [
            'Conversational RAG query engine grounded in departmental FAQ & syllabus documents',
            'Real-time lecture schedule viewer with room locator',
            'Role-based interface separating student views from admin document uploaders',
            'Clean response citation tags showing source document and section'
          ],
          shouldHave: [
            'Proactive notification alerts for upcoming assignment deadlines and room changes',
            'Study room / library desk occupancy estimation indicator',
            'Offline query caching for frequently asked campus policies'
          ],
          optional: [
            'Multilingual audio query input using Speech-to-Text for international exchange students',
            'Interactive 2D campus map route guidance with SVG floor plans'
          ]
        },
        conclusion: 'This project is a stellar contender for a college minor project. By prioritizing grounded RAG answers with citations and adding a live occupancy angle, the team will easily exceed academic grading criteria while delivering real campus value.'
      };
    }

    const origScore = agentPipelineResults.originality?.originalityScore || 7.2;
    const feasScore = agentPipelineResults.feasibility?.overallFeasibilityScore || 8.0;
    const computedOverall = Number(((origScore * 0.4) + (feasScore * 0.6)).toFixed(1));

    return {
      overallScore: computedOverall,
      verdict: 'Recommended with Improvements',
      suitabilityVerdict: 'Suitable for a college minor project. The scope is achievable within standard semester constraints, offering clear opportunities to showcase full-stack development and modern AI integration.',
      strengths: [
        'Clear problem statement addressing an identifiable target audience.',
        'Pragmatic architectural choices that fit student skill levels and free-tier infrastructure.',
        'High testability and interactive viva demonstration potential.'
      ],
      weaknesses: [
        'Requires clear differentiation from existing open-source counterparts on GitHub.',
        'Initial setup may require robust edge-case validation to prevent unpredictable AI output.'
      ],
      risks: [
        'Over-reliance on external third-party API availability without local fallbacks.',
        'Timeline pressure if non-essential secondary features are prioritized ahead of core MVP functionality.'
      ],
      recommendedFeatures: {
        mustHave: [
          'Core responsive user dashboard with interactive state management',
          'Structured AI integration with error-handled responses',
          'Persistent data storage for user sessions and history'
        ],
        shouldHave: [
          'Exportable analytical reports (PDF / JSON download)',
          'Filterable search and comparison tool for historical records'
        ],
        optional: [
          'Dark / Light mode theme customization',
          'Automated webhook notifications'
        ]
      },
      conclusion: 'A well-rounded project concept with solid feasibility. Implementing the suggested differentiation tips will guarantee a top-tier evaluation from academic examiners.'
    };
  }
}
