# 🧠 AI Project Idea Critic Agent
### Autonomous Multi-Agent Academic Project Advisor & Evaluator
*A College Minor Project demonstrating Generative AI, Multi-Agent Collaboration, and Full-Stack Engineering.*

---

## 📌 1. Project Overview & Problem Statement

College students and engineering graduates frequently struggle to select, refine, and defend viable software ideas for their minor projects and capstones. Common pitfalls include:
- Replicating generic internet tutorials (e.g., standard weather apps, basic CRUD portals, or trivial chatbot wrappers).
- Over-promising impossible scope within a 4–8 week semester timeframe.
- Incompatible or deprecated technology stack selections.
- Inability to articulate the project's true academic differentiation and practical utility during viva examinations.

**AI Project Idea Critic Agent** resolves these challenges by acting as an autonomous evaluation committee. Rather than returning a single generic chatbot response, the platform orchestrates **six specialized AI agents** that analyze the student's proposal from multiple angles: research & prior art, optimal technology selection, five-dimensional feasibility, originality and differentiation, student budget & complexity, and a final synthesizing Critic Agent that issues an authoritative academic verdict and feature roadmap.

---

## 🎯 2. Project Objectives

1. **Demonstrate Agentic AI in Higher Education:** Illustrate how autonomous, role-specific agents collaborate sequentially, passing validated structured outputs between stages.
2. **Eliminate Superficial Projects:** Direct students away from cliché implementations toward verifiable, distinctive software architectures (e.g., RAG with source citations, IoT edge inference, or zero-knowledge cryptography).
3. **Calibrate Feasibility:** Score technical, temporal, skill, and resource feasibility on a 1–10 scale tailored to student team sizes and developer tiers.
4. **Provide Actionable Roadmaps:** Split feature sets into Must-Have (core MVP for initial viva), Should-Have (high-value differentiators), and Optional (stretch goals).
5. **Generate Academic Dossiers:** Export structured PDF reports and Markdown summaries for project review meetings.

---

## 🚀 3. Key Features

- **6 Specialized AI Agents Workflow:**
  1. 🔍 **Research Agent:** Scans prior art, benchmarks commercial/academic parallels, classifies novelty (`Common`, `Moderately differentiated`, `Relatively distinctive`), and details market demand.
  2. ⚙️ **Technology Agent:** Recommends Frontend, Backend, Database, AI/ML, APIs, Auth, and Hosting stacks with specific justifications for each choice.
  3. ⏱️ **Feasibility Agent:** Evaluates Technical, Time, Skill, Resource, and AI feasibility on 1–10 scales with plain-English rationales.
  4. 💡 **Originality Agent:** Evaluates novelty, flags resemblance to common projects, and prescribes 3–5 actionable differentiation strategies.
  5. 💰 **Cost & Complexity Agent:** Computes complexity (`Easy`, `Moderate`, `Difficult`), realistic student timelines, student-level budget ranges, and free-tier cloud allowances.
  6. ⚖️ **Critic Agent:** Aggregates all reports, performs SWOT analysis, groups features by tier, issues an overall score (1.0–10.0), and delivers a final verdict (`Highly Recommended`, `Recommended with Improvements`, `Needs Major Changes`, `Not Recommended`).
- **Real-Time Visual Execution Pipeline:** Interactive pipeline visualization displaying step-by-step progress, active agent status (`Analyzing...` vs `Completed ✓`), and concise findings badges.
- **Evaluation Dashboard:** Circular SVG score gauge, 6-metric progress bars, SWOT cards, interactive tech stack pills, and risk breakdown.
- **Historical Archives:** Persistent database of all evaluated ideas with search, date tags, scores, and one-click deletion.
- **Side-by-Side Idea Comparison:** Direct comparative matrix comparing Project A vs Project B across overall score, originality, feasibility, tech complexity, and cost.
- **Export Capabilities:** 
  - 📄 **Download Report:** Clean, multi-page vector PDF generation using `jsPDF`.
  - 📋 **Copy Report:** Markdown export with formatted headings and checklists for docs or LaTeX.
- **Dual-Engine Architecture (Zero-Crash Guarantee):**
  - **Live Gemini 2.5 Flash:** Powered by Google Gemini API with structured JSON schemas.
  - **Hybrid Heuristic Fallback Engine:** Offline intelligence engine that ensures immediate out-of-the-box functionality even without an API key or internet connection.
- **Zero-Lockin Database:** Automatic MongoDB Mongoose connection with seamless fallback to persistent file-backed JSON storage (`server/data/projects.json`).
- **Dark & Light Mode:** Tailored modern CSS themes with smooth transitions.

---

## 🏗️ 4. System Architecture & Workflow

```
[Student Input Form] 
       │ (Project Idea + Details)
       ▼
[Agent Coordinator]
       │
       ├──► 1. Research Agent (Prior Art & Novelty Assessment)
       │           │
       ├──► 2. Technology Agent (Full-Stack Selection + Rationale)
       │           │
       ├──► 3. Feasibility Agent (5-Dimension 1-10 Scoring)
       │           │
       ├──► 4. Originality Agent (Cliché Detection & Differentiation)
       │           │
       ├──► 5. Cost & Complexity Agent (Timeline, Budget, Free Tiers)
       │           │
       └──► 6. Critic / Decision Agent (SWOT Synthesis, Verdict & Roadmap)
                   │
                   ▼
       [Database Layer: MongoDB / FileStore]
                   │
                   ▼
       [Frontend Evaluation Dashboard & PDF Export]
```

---

## 💻 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Vanilla CSS (Custom Design System), Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js (ES Modules), Server-Sent Events (SSE) Streaming |
| **AI Integration** | Google Gemini API (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-3.8-flash`), Structured JSON Schemas |
| **Database** | MongoDB (Mongoose ODM) + File-Backed Persistent Fallback Adapter (`projects.json`) |
| **Document Export** | `jsPDF`, HTML2Canvas, Markdown Formatter |
| **Tooling & Orchestration** | Concurrently, Dotenv, Native Fetch |

---

## ⚙️ 6. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: MongoDB local instance or MongoDB Atlas connection string. (If MongoDB is absent, the system automatically uses persistent file-based JSON storage).

### 1. Clone or Open the Repository
```bash
cd "c:/Users/olive/OneDrive/Desktop/project critic"
```

### 2. Install All Dependencies
Install root, backend, and frontend packages with a single command:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd backend && npm install`, `cd ../frontend && npm install`)*

---

## 🔑 7. Environment Variables Configuration

Create a `.env` file in the root directory (or in `backend/`) using the provided `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:

```env
# Server Port
PORT=5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Google Gemini API Key
# Get your free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model Selection (gemini-2.5-flash, gemini-1.5-flash, or gemini-3.8-flash)
GEMINI_MODEL=gemini-2.5-flash

# MongoDB Connection String (Optional)
# If left blank or unreachable, persistent local storage is used automatically
MONGODB_URI=mongodb://localhost:27017/critic_agent

# Node Environment
NODE_ENV=development
```

---

## ▶️ 8. How to Run the Application

### Running Both Frontend & Backend Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Running Services Separately
- **Backend Server:**
  ```bash
  npm run backend
  ```
  *Server runs at: `http://localhost:5000`*

- **Frontend Client:**
  ```bash
  npm run frontend
  ```
  *Client runs at: `http://localhost:5173`*

Open your browser and navigate to: **`http://localhost:5173`**

---

## 📡 9. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check, database status, AI engine mode, and stats |
| `GET` | `/api/samples` | Pre-configured demo projects (including *AI-Based Smart Campus Assistant*) |
| `POST` | `/api/analyze` | Initiates the 6-agent evaluation pipeline (supports JSON and SSE streaming) |
| `GET` | `/api/projects` | Retrieves list of all previous project evaluations |
| `GET` | `/api/projects/:id` | Retrieves complete evaluation report for a given project ID |
| `DELETE` | `/api/projects/:id` | Deletes a project evaluation from history |
| `POST` | `/api/projects/compare` | Compares two evaluated projects (`projectAId` vs `projectBId`) |
| `POST` | `/api/settings/ai-config` | Updates Gemini API key and active model at runtime |

---

## 🧪 10. Sample Test Ideas

The application comes pre-loaded with interactive presets:

1. **AI-Based Smart Campus Assistant (Primary Sample):**
   - *Premise:* Centralizes schedules, sensor-based study room availability, and academic queries using a verified campus RAG knowledge base.
   - *Verdict:* Recommended with Improvements (Overall Score: 8.4/10).
2. **Secure Health Records Portal with AI Pre-Screener:**
   - *Premise:* Role-based patient portal with zero-knowledge clinical record encryption and specialist triage pre-screening.
3. **EcoSort: Edge-AI Automated Waste Segregation Bin:**
   - *Premise:* IoT smart dustbin utilizing camera and Raspberry Pi computer vision inference for real-time recyclable sorting.

---

## 🔮 11. Future Enhancements

- **Autonomous Web Search Integration:** Live DuckDuckGo or Google Search API grounding to verify GitHub repository novelty in real-time.
- **Multi-Turn Chat Critique:** An interactive "Grill My Project" interrogation mode simulating a tough university viva panel.
- **Export to LaTeX:** One-click generation of the formal IEEE / University Project Synopsis chapter.
- **Architecture Diagram Generator:** Visual Mermaid.js or SVG component flowchart generation.

---

## 📜 12. License
Developed as a College Minor Project showcasing Agentic AI & Generative AI engineering. Open source under the MIT License.
