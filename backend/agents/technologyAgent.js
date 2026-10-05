import { BaseAgent } from './baseAgent.js';
import { callGemini } from '../services/geminiService.js';
import { aiConfig } from '../config/aiConfig.js';

export class TechnologyAgent extends BaseAgent {
  constructor() {
    super('Technology Agent', 'Recommends modern, practical, and student-accessible tech stack with rationale.');
  }

  async run(projectData, researchFindings = {}) {
    const systemPrompt = `You are a Software Architect and Technology Advisor for college minor projects.
Your goal is to recommend an optimal, modern, and realistic technology stack for the project idea.
Analyze:
1. Frontend
2. Backend
3. Database
4. AI/ML technologies
5. APIs & External integrations
6. Authentication
7. Hosting / Deployment
8. Optional technologies (2-3 items)
For EVERY category, provide:
- "name": The recommended tech (e.g. React / Next.js, Express, MongoDB / PostgreSQL, etc.)
- "reason": A crisp 1-sentence reason tailored to why this fits the project and student scope.
Also provide a concise summary (1-2 sentences) of the overall architectural philosophy.`;

    const expectedSchema = `{
      "frontend": { "name": "string", "reason": "string" },
      "backend": { "name": "string", "reason": "string" },
      "database": { "name": "string", "reason": "string" },
      "aiTechnologies": { "name": "string", "reason": "string" },
      "apis": { "name": "string", "reason": "string" },
      "authentication": { "name": "string", "reason": "string" },
      "hosting": { "name": "string", "reason": "string" },
      "optional": [
        { "name": "string", "reason": "string" },
        { "name": "string", "reason": "string" }
      ],
      "summary": "string"
    }`;

    const promptContext = `
${this.formatProjectPrompt(projectData)}
Research Agent Novelty & Landscape:
Novelty Level: ${researchFindings.noveltyLevel || 'N/A'}
Similar Categories: ${(researchFindings.similarCategories || []).join(', ')}
    `.trim();

    if (aiConfig.isConfigured()) {
      try {
        const result = await callGemini(systemPrompt, promptContext, expectedSchema);
        if (result && result.frontend && result.backend && result.database) {
          return result;
        }
      } catch (err) {
        console.warn(`[TechnologyAgent AI call failed, using heuristic fallback]: ${err.message}`);
      }
    }

    return this.fallbackAnalysis(projectData);
  }

  fallbackAnalysis(projectData) {
    const text = `${projectData.title} ${projectData.idea} ${projectData.preferredTech} ${projectData.projectType}`.toLowerCase();
    const isIoT = text.includes('iot') || text.includes('sensor') || text.includes('raspberry') || text.includes('bin') || projectData.projectType === 'IoT';
    const isMobile = projectData.projectType === 'Mobile Application' || text.includes('flutter') || text.includes('react native');

    if (isIoT) {
      return {
        frontend: {
          name: 'React + Vite with Chart.js',
          reason: 'Provides a fast, reactive telemetry dashboard for real-time sensor updates and device telemetry.'
        },
        backend: {
          name: 'Python (FastAPI) & Node.js Bridge',
          reason: 'FastAPI efficiently processes camera image streams and edge data, while Node.js manages web socket events.'
        },
        database: {
          name: 'MongoDB or SQLite',
          reason: 'Flexible document storage for telemetry event logs and bin sensor time-series data.'
        },
        aiTechnologies: {
          name: 'TensorFlow Lite / MobileNetV2',
          reason: 'Optimized for high-fps, low-latency quantized computer vision inference directly on embedded edge hardware.'
        },
        apis: {
          name: 'MQTT Protocol & WebSockets',
          reason: 'Lightweight publish-subscribe protocol ideal for low-bandwidth microcontroller communication.'
        },
        authentication: {
          name: 'JWT (JSON Web Tokens)',
          reason: 'Stateless, lightweight token authentication suitable for securing telemetry endpoints and admin portals.'
        },
        hosting: {
          name: 'Render / Railway (Cloud) & Raspberry Pi OS (Edge)',
          reason: 'Zero-cost student cloud tiers for the central server combined with Linux edge hardware.'
        },
        optional: [
          { name: 'Redis Cache', reason: 'Speeds up live device status checks without overloading disk storage.' },
          { name: 'Docker', reason: 'Ensures containerized reproducibility between the student laptop and target hardware.' }
        ],
        summary: 'A hybrid edge-cloud architecture that separates real-time hardware inference from user-facing cloud analytics.'
      };
    }

    if (isMobile) {
      return {
        frontend: {
          name: 'Flutter or React Native',
          reason: 'Single codebase compiles natively to both Android and iOS devices, minimizing student development workload.'
        },
        backend: {
          name: 'Node.js + Express.js',
          reason: 'Lightweight REST API backend that easily integrates asynchronous AI orchestrations.'
        },
        database: {
          name: 'MongoDB with Mongoose',
          reason: 'Schema-flexible NoSQL database that allows rapid iteration as project feature requirements evolve.'
        },
        aiTechnologies: {
          name: 'Google Gemini 2.5 Flash API',
          reason: 'Fast latency, generous developer tier, and native support for structured JSON schemas.'
        },
        apis: {
          name: 'RESTful API & Firebase Cloud Messaging (FCM)',
          reason: 'Essential for delivering push notifications and background synchronization to mobile devices.'
        },
        authentication: {
          name: 'Firebase Auth or JWT',
          reason: 'Provides out-of-the-box email/password and social login without manual auth boilerplate.'
        },
        hosting: {
          name: 'Vercel / Render (Backend) & Expo EAS / Play Store',
          reason: 'Frictionless continuous deployment for cloud services with generous student quotas.'
        },
        optional: [
          { name: 'Pinecone Vector DB', reason: 'Enables semantic similarity search over mobile queries.' },
          { name: 'Sentry', reason: 'Monitors unhandled exceptions and client crashes during testing.' }
        ],
        summary: 'A cross-platform mobile architecture emphasizing rapid API integration and robust offline-first user experience.'
      };
    }

    // Default Web Application (e.g. AI-Based Smart Campus Assistant)
    return {
      frontend: {
        name: 'React + Vite (Vanilla CSS / Tailwind)',
        reason: 'Offers instantaneous hot module reloading, high responsiveness, and clean component-driven state architecture.'
      },
      backend: {
        name: 'Node.js + Express.js',
        reason: 'Robust non-blocking asynchronous event loop, ideal for coordinating multiple downstream AI agent calls.'
      },
      database: {
        name: 'MongoDB (Mongoose ODM)',
        reason: 'Highly adaptable JSON-native document model that stores heterogeneous project states and query histories easily.'
      },
      aiTechnologies: {
        name: 'Google Gemini 2.5 Flash API + LangChain / RAG',
        reason: 'Delivers high token throughput, low latency, and dependable structured output formatting.'
      },
      apis: {
        name: 'Campus / Institutional REST APIs & Server-Sent Events (SSE)',
        reason: 'Permits live streaming of agent analytical steps and integration with external student information systems.'
      },
      authentication: {
        name: 'JWT with bcryptjs password hashing',
        reason: 'Self-contained, industry-standard stateless authentication suitable for college academic evaluation.'
      },
      hosting: {
        name: 'Vercel (Frontend) + Render / Railway (Backend)',
        reason: 'Free student-friendly cloud deployment tiers with automatic continuous integration from GitHub.'
      },
      optional: [
        { name: 'ChromaDB / Pinecone', reason: 'Stores vectorized document chunks for contextual syllabus and handbook retrieval.' },
        { name: 'jsPDF / html2canvas', reason: 'Enables client-side PDF export of analysis reports and transcripts.' }
      ],
      summary: 'A production-tested MERN + GenAI stack providing rapid development velocity, clean separation of concerns, and zero student hosting fees.'
    };
  }
}
