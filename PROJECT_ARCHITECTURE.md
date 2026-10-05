# 🏛️ AI Project Idea Critic Agent — System Architecture

This document provides an in-depth architectural blueprint of the **AI Project Idea Critic Agent**, explaining the design patterns, agent communication protocols, persistence layers, and error recovery strategies.

---

## 1. High-Level Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             CLIENT TIER (React 18 + Vite)                     |
|                                                                               |
|  [Landing Page]  [New Analysis Form]  [Agent Visualizer]  [Report Dashboard]  |
|  [History List]  [Comparison Matrix]  [Settings Panel]    [PDF / Copy Export] |
+-------------------------------------------------------------------------------+
                                      ▲
                                      │ HTTP / Server-Sent Events (SSE)
                                      ▼
+-------------------------------------------------------------------------------+
|                           BACKEND TIER (Node.js + Express)                    |
|                                                                               |
|  Controllers:   analysisController, projectController, healthController       |
|  Routes:        /api/analyze, /api/projects, /api/health, /api/settings       |
|  Coordinator:   AgentCoordinator (sequential stage runner + event emitter)    |
|                                                                               |
|    +-------------------+    +--------------------+    +--------------------+  |
|    | 1. Research Agent |==> | 2. Technology Agent|==> | 3. Feasibility Agent| |
|    +-------------------+    +--------------------+    +--------------------+  |
|              ▲                        ▲                        ▲              |
|              ▼                        ▼                        ▼              |
|    +--------------------+    +--------------------+    +--------------------+ |
|    | 4. Originality Agt |==> | 5. Cost & Complexity|==>| 6. Critic Agent    | |
|    +--------------------+    +--------------------+    +--------------------+ |
+-------------------------------------------------------------------------------+
           │                                                │
           ▼ (Structured JSON Prompts)                      ▼ (Unified Data Adapter)
+---------------------------+                   +-------------------------------+
|     AI INFERENCE TIER     |                   |       PERSISTENCE TIER        |
|                           |                   |                               |
| • Google Gemini 2.5 Flash |                   | Primary:   MongoDB (Mongoose) |
| • Google Gemini 1.5 Flash |                   | Fallback:  Persistent JSON   |
| • Offline Heuristics Engine|                   |            Store (LocalDisk)  |
+---------------------------+                   +-------------------------------+
```

---

## 2. The 6-Agent Sequential Pipeline Design

Rather than attempting to extract all evaluation metrics in a single massive prompt, the system breaks the evaluation into **six discrete agent personas**. Each agent has a focused domain mandate and feeds its conclusions into downstream agents:

### Agent 1: Research Agent (`server/agents/researchAgent.js`)
- **Domain:** Prior art, industry/open-source parallels, market context.
- **Responsibilities:**
  - Evaluates whether the proposed idea is common, moderately differentiated, or distinctive.
  - Documents 3–4 existing solutions (commercial apps or open-source student repositories).
  - Explains the economic or operational factors driving similar solutions.
  - Proposes 3 initial differentiation axes.
- **Contract:** Passes `commonSolutions`, `similarCategories`, and `noveltyLevel` to Agent 2 and Agent 4.

### Agent 2: Technology Agent (`server/agents/technologyAgent.js`)
- **Domain:** Systems engineering, stack compatibility, student ergonomics.
- **Responsibilities:**
  - Recommends Frontend, Backend, Database, AI/ML models, APIs, Authentication, and Hosting.
  - Provides a 1-sentence justification for every selection tailored to college project constraints.
  - Suggests optional enhancements (e.g., Vector DBs, Redis cache, Web Crypto).
- **Contract:** Supplies stack specifications to Agent 3 and Agent 5.

### Agent 3: Feasibility Agent (`server/agents/feasibilityAgent.js`)
- **Domain:** Academic execution risk, resource requirements, developer skill levels.
- **Responsibilities:**
  - Evaluates five distinct dimensions on 1.0–10.0 scales:
    1. Technical Feasibility
    2. Time Feasibility (calibrated to the student's declared timeline)
    3. Skill Feasibility (calibrated to Beginner, Intermediate, or Advanced team skill)
    4. Resource Feasibility (hardware, cloud compute, zero-cost limits)
    5. AI Feasibility (hallucination probability, prompt stability)
  - Computes the weighted `overallFeasibilityScore`.
- **Contract:** Feeds dimension scores to Agent 5 and Agent 6.

### Agent 4: Originality Agent (`server/agents/originalityAgent.js`)
- **Domain:** Academic novelty, cliché detection, unique angle synthesis.
- **Responsibilities:**
  - Assesses how common the project concept is in university repositories.
  - Lists conventional features that risk evaluator disinterest.
  - Proposes 3–5 novel differentiating features to elevate the project.
  - Assigns an `originalityScore` (1.0–10.0).
  - *Strict Rule:* Never falsely promises absolute uniqueness.

### Agent 5: Cost & Complexity Agent (`server/agents/costAgent.js`)
- **Domain:** Project management, infrastructure expenditure, student budgets.
- **Responsibilities:**
  - Categorizes complexity into `Easy`, `Moderate`, or `Difficult`.
  - Estimates realistic duration (e.g., 4–6 weeks for an intermediate team).
  - Formulates approximate budget ranges and highlights free student tiers (Vercel, Render, Atlas M0, Google AI Studio).
  - Outlines storage, database, and API token limits.

### Agent 6: Critic / Decision Agent (`server/agents/criticAgent.js`)
- **Domain:** Chief Academic Evaluator & Viva Board Chair.
- **Responsibilities:**
  - Ingests all outputs from Agents 1 through 5.
  - Performs SWOT analysis (Strengths, Weaknesses, Risks, Suitability).
  - Divides recommended features into Must-Have, Should-Have, and Optional tiers.
  - Computes the final `overallScore` (1.0–10.0).
  - Issues the authoritative verdict:
    - `"Highly Recommended"`
    - `"Recommended with Improvements"`
    - `"Needs Major Changes"`
    - `"Not Recommended"`
  - Drafts an inspiring, comprehensive viva conclusion.

---

## 3. Communication Protocols: Server-Sent Events (SSE)

To provide transparency into agent deliberations without exposing unformatted internal reasoning, the backend supports real-time **Server-Sent Events (SSE)** via `POST /api/analyze` when `Accept: text/event-stream` is requested:

```
Client Request -> POST /api/analyze (Accept: text/event-stream)
   │
   ├──> event: pipeline_start     { message: "Agentic AI Pipeline Initialized" }
   ├──> event: agent_step         { step: 1, agent: "Research Agent", status: "running" }
   ├──> event: agent_step         { step: 1, agent: "Research Agent", status: "completed", message: "..." }
   ├──> event: agent_step         { step: 2, agent: "Technology Agent", status: "running" }
   ...
   ├──> event: agent_step         { step: 6, agent: "Critic Agent", status: "completed" }
   └──> event: pipeline_complete  { success: true, projectId: "...", project: {...} }
```

If SSE streaming is unsupported by an environment or client, the same endpoint cleanly falls back to standard synchronous JSON.

---

## 4. Zero-Crash Dual-Engine Strategy

A common failure mode in college viva evaluations is a third-party API outage, expired API key, or lack of internet connectivity. To prevent runtime failures:

1. **Live Gemini API Path:**
   - Uses native `fetch` targeting Google Generative Language API (`/models/${model}:generateContent`).
   - Enforces structured JSON output mode (`responseMimeType: "application/json"`).
   - Sanitizes output using `server/utils/jsonParser.js` to strip code fences and handle trailing commas.
2. **Heuristic Fallback Engine:**
   - If `GEMINI_API_KEY` is missing or the external API returns 429 / 5xx, the system seamlessly transitions to a context-aware domain heuristic engine.
   - Evaluates the student's project domain (Smart Campus, Health, IoT, Web, Cybersecurity), team size, timeline, and skill level to return a realistic, structured multi-agent dossier.
   - Clearly labels reports as `[Hybrid Heuristic Engine (Offline Mode)]` so evaluators appreciate the fault tolerance.

---

## 5. Resilient Storage Layer (MongoDB + FileStore Adapter)

The persistence layer uses a unified Data Access Object (DAO) pattern (`server/models/Project.js`):

- **MongoDB Connected:** Standard Mongoose schema with automated timestamps, validation, and indices.
- **MongoDB Unavailable:** Automatically detects connection refusal and stores documents in an atomic JSON file database at `server/data/projects.json`.
- **Identical Interface:** Both engines support `find()`, `findById()`, `create()`, and `findByIdAndDelete()`. The frontend and API controllers remain entirely agnostic of which engine is active.

---

## 6. Security & Best Practices

- **Zero Key Exposure:** API keys are never bundled into client scripts or sent in browser payloads.
- **Runtime Key Setting:** Keys can be provided via `.env` or set dynamically in the server session via the Settings dashboard.
- **Input Validation:** Required field assertions, type verification, and length bounds.
- **CORS Protection:** Configurable origin filters preventing unauthorized cross-site requests.
- **Safe Error Formatting:** Internal stack traces are logged server-side; clients receive sanitized, user-friendly error banners.
