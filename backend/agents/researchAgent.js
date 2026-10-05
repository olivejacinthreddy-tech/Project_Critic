import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class ResearchAgent extends BaseAgent {
  constructor() {
    super('Research Agent', 'Analyzes existing solutions, prior art, market category, and common patterns.');
  }

  async run(projectData) {
    const systemPrompt = `You are an academic software project Research Agent.
Your job is to thoroughly analyze whether similar software project ideas already exist in academic or commercial spaces.
Guidelines:
- Identify 3-4 common or existing solutions related to this idea (e.g. existing commercial apps, open-source projects, or common student repositories).
- Identify similar project categories and domains.
- Classify the idea novelty strictly into one of: "Common", "Moderately differentiated", or "Relatively distinctive".
- Explain why similar systems already exist (the underlying market demand or natural progression of technology).
- Suggest 3 concrete areas where this student idea can be meaningfully differentiated.
- Provide a concise findingsSummary (1-2 sentences).
CRITICAL: Never claim that any idea is completely unique or 100% novel. Use measured academic tone. Note that this analysis is based on model domain knowledge and should not be treated as a legal patent search.`;

    const expectedSchema = `{
      "commonSolutions": ["Name/Description of existing system 1", "Existing system 2", "Existing system 3"],
      "similarCategories": ["Category 1", "Category 2"],
      "noveltyLevel": "Common" | "Moderately differentiated" | "Relatively distinctive",
      "explanation": "Why similar solutions exist and current market landscape...",
      "differentiationAreas": ["Specific differentiation angle 1", "Angle 2", "Angle 3"],
      "findingsSummary": "Concise 1-2 sentence takeaway of the research."
    }`;

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, this.formatProjectPrompt(projectData), expectedSchema);
        if (result && Array.isArray(result.commonSolutions)) {
          return result;
        }
      } catch (err) {
        console.warn(`[ResearchAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData);
  }

  fallbackAnalysis(projectData) {
    const text = `${projectData.title} ${projectData.idea} ${projectData.description}`.toLowerCase();
    const isCampus = text.includes('campus') || text.includes('university') || text.includes('student') || text.includes('college');
    const isHealth = text.includes('health') || text.includes('patient') || text.includes('medical') || text.includes('doctor');
    const isIoT = text.includes('iot') || text.includes('sensor') || text.includes('waste') || text.includes('hardware');

    if (isCampus) {
      return {
        commonSolutions: [
          'Ellucian Mobile / Campus Consortium Apps (Standard University Portals)',
          'Canvas / Blackboard LMS mobile companion apps',
          'Discord / Slack bots configured for student clubs and coursework reminders'
        ],
        similarCategories: ['Campus Information Systems (CIS)', 'Educational Conversational AI', 'Smart Campus Facility Management'],
        noveltyLevel: 'Moderately differentiated',
        explanation: 'Campus portal and query chatbots are common in university repositories. However, systems that combine real-time sensor occupancy (vacant labs/study spots) with verified institutional RAG knowledge bases are moderately differentiated compared to basic static FAQ bots.',
        differentiationAreas: [
          'Integration with live IoT desk/room availability occupancy sensors rather than static timetables.',
          'RAG system with verifiable citations pointing directly to departmental handbook clauses.',
          'Offline-first progressive web app capability for low-connectivity auditorium basements.'
        ],
        findingsSummary: 'While general student portals are common, integrating real-time physical space telemetry with conversational departmental RAG provides a strong competitive edge for a minor project.'
      };
    } else if (isHealth) {
      return {
        commonSolutions: [
          'Ada Health & Babylon Health (Conversational symptom assessment)',
          'MyChart / Epic Systems Patient Portals (Clinical records access)',
          'OpenMRS (Open source medical record management)'
        ],
        similarCategories: ['Digital Health', 'Clinical Triage AI', 'Patient Health Information Systems'],
        noveltyLevel: 'Moderately differentiated',
        explanation: 'Patient portals and AI symptom triage are active commercial spaces. Similar solutions exist because healthcare fragmentation and appointment bottlenecks are universal challenges. Academic projects in this domain require clear disclaimers and stringent privacy safeguards.',
        differentiationAreas: [
          'Client-side zero-knowledge encryption before record synchronization.',
          'Department triage guidance rather than direct diagnostic conclusions, lowering regulatory risk.',
          'FHIR (Fast Healthcare Interoperability Resources) JSON standard export compatibility.'
        ],
        findingsSummary: 'Healthcare portals are well-established; differentiating through zero-knowledge patient cryptography and specialist triage routing makes this feasible and defensible.'
      };
    } else if (isIoT) {
      return {
        commonSolutions: [
          'CleanCube / Bigbelly Smart Waste Bins',
          'Raspberry Pi OpenCV Garbage Classifier open-source projects',
          'TrashBot by CleanRobotics'
        ],
        similarCategories: ['Smart Cities', 'Edge Computer Vision IoT', 'Automated Waste Segregation'],
        noveltyLevel: 'Moderately differentiated',
        explanation: 'Computer vision waste classification is a popular engineering capstone theme. Hardware-software segregation bins exist commercially in municipal sectors, but low-cost edge prototypes built with Raspberry Pi and lightweight models remain appealing for college demonstrations.',
        differentiationAreas: [
          'Edge quantized inference model (e.g. MobileNetV2 INT8) operating without continuous internet access.',
          'Mechanical multi-compartment flap mechanism with jam-detection sensors.',
          'Cloud analytics telemetry tracking contamination percentage and bin fill levels.'
        ],
        findingsSummary: 'Automated waste sorting is a known concept; differentiating via on-device quantized edge inference and real-time fleet telemetry elevates it above generic capstones.'
      };
    }

    return {
      commonSolutions: [
        'Generic web-based productivity and tracking dashboards',
        'Standard LLM wrapper applications available on GitHub',
        'Traditional database-backed CRUD portals'
      ],
      similarCategories: [projectData.projectType || 'Software System', 'Interactive Productivity Web Application'],
      noveltyLevel: 'Moderately differentiated',
      explanation: 'Similar workflow and task management tools exist across consumer and enterprise sectors because digital automation is a widespread need. The concept has established benchmarks.',
      differentiationAreas: [
        'Focus on a specialized, underserved sub-demographic with customized UX workflows.',
        'Incorporate multi-modal or automated agentic verification rather than manual single-step input.',
        'Provide actionable exportable analytics with lightweight local persistence.'
      ],
      findingsSummary: 'The project targets a recognized problem space with existing parallels; distinctive value will depend on specialized workflow integration and tailored execution.'
    };
  }
}
