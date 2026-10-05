import { ResearchAgent } from './researchAgent.js';
import { TechnologyAgent } from './technologyAgent.js';
import { FeasibilityAgent } from './feasibilityAgent.js';
import { OriginalityAgent } from './originalityAgent.js';
import { CostAndComplexityAgent } from './costAgent.js';
import { CriticAgent } from './criticAgent.js';
import { aiConfig } from '../config/aiConfig.js';

export class AgentCoordinator {
  constructor() {
    this.researchAgent = new ResearchAgent();
    this.technologyAgent = new TechnologyAgent();
    this.feasibilityAgent = new FeasibilityAgent();
    this.originalityAgent = new OriginalityAgent();
    this.costAgent = new CostAndComplexityAgent();
    this.criticAgent = new CriticAgent();
  }

  async runAnalysis(projectData, onProgress = () => {}) {
    const notify = (step, agent, status, message, data = null) => {
      onProgress({
        step,
        agent,
        status, // 'running' | 'completed' | 'failed'
        message,
        data,
        timestamp: new Date().toISOString()
      });
    };

    const agentResults = {};
    const engineUsed = 'Gemini 2.5 Flash';

    // Step 1: Research Agent
    notify(1, 'Research Agent', 'running', 'Scanning academic repositories and existing commercial software...');
    try {
      agentResults.research = await this.researchAgent.run(projectData);
      notify(1, 'Research Agent', 'completed', `Completed: Classified novelty as "${agentResults.research.noveltyLevel}"`, {
        noveltyLevel: agentResults.research.noveltyLevel,
        commonSolutions: agentResults.research.commonSolutions?.slice(0, 2)
      });
    } catch (err) {
      notify(1, 'Research Agent', 'failed', `Error in research phase: ${err.message}`);
      throw err;
    }

    // Step 2: Technology Agent
    notify(2, 'Technology Agent', 'running', 'Formulating optimal frontend, backend, database & AI stack...');
    try {
      agentResults.technology = await this.technologyAgent.run(projectData, agentResults.research);
      notify(2, 'Technology Agent', 'completed', `Completed: Recommended ${agentResults.technology.frontend?.name} + ${agentResults.technology.backend?.name}`, {
        frontend: agentResults.technology.frontend?.name,
        backend: agentResults.technology.backend?.name,
        database: agentResults.technology.database?.name
      });
    } catch (err) {
      notify(2, 'Technology Agent', 'failed', `Error in technology phase: ${err.message}`);
      throw err;
    }

    // Step 3: Feasibility Agent
    notify(3, 'Feasibility Agent', 'running', 'Scoring technical, temporal, skill, and resource feasibility...');
    try {
      agentResults.feasibility = await this.feasibilityAgent.run(projectData, agentResults.technology);
      notify(3, 'Feasibility Agent', 'completed', `Completed: Feasibility rated at ${agentResults.feasibility.overallFeasibilityScore || 8.0}/10`, {
        overallFeasibilityScore: agentResults.feasibility.overallFeasibilityScore,
        technicalScore: agentResults.feasibility.technicalScore
      });
    } catch (err) {
      notify(3, 'Feasibility Agent', 'failed', `Error in feasibility phase: ${err.message}`);
      throw err;
    }

    // Step 4: Originality Agent
    notify(4, 'Originality Agent', 'running', 'Benchmarking novelty and identifying differentiation angles...');
    try {
      agentResults.originality = await this.originalityAgent.run(projectData, agentResults.research);
      notify(4, 'Originality Agent', 'completed', `Completed: Originality rated at ${agentResults.originality.originalityScore || 7.5}/10`, {
        originalityScore: agentResults.originality.originalityScore
      });
    } catch (err) {
      notify(4, 'Originality Agent', 'failed', `Error in originality phase: ${err.message}`);
      throw err;
    }

    // Step 5: Cost & Complexity Agent
    notify(5, 'Cost & Complexity Agent', 'running', 'Estimating student development duration, cloud budget & complexity...');
    try {
      agentResults.costAndComplexity = await this.costAgent.run(projectData, agentResults.technology, agentResults.feasibility);
      notify(5, 'Cost & Complexity Agent', 'completed', `Completed: Complexity rated as "${agentResults.costAndComplexity.complexityLevel}" (${agentResults.costAndComplexity.estimatedDuration})`, {
        complexityLevel: agentResults.costAndComplexity.complexityLevel,
        estimatedDuration: agentResults.costAndComplexity.estimatedDuration,
        costRange: agentResults.costAndComplexity.estimatedCostRange
      });
    } catch (err) {
      notify(5, 'Cost & Complexity Agent', 'failed', `Error in cost estimation phase: ${err.message}`);
      throw err;
    }

    // Step 6: Critic Agent
    notify(6, 'Critic Agent', 'running', 'Synthesizing all agent data, performing SWOT analysis and final verdict...');
    try {
      agentResults.critic = await this.criticAgent.run(projectData, agentResults);
      notify(6, 'Critic Agent', 'completed', `Completed: Final Verdict "${agentResults.critic.verdict}" (Overall Score: ${agentResults.critic.overallScore}/10)`, {
        verdict: agentResults.critic.verdict,
        overallScore: agentResults.critic.overallScore
      });
    } catch (err) {
      notify(6, 'Critic Agent', 'failed', `Error in critic synthesis phase: ${err.message}`);
      throw err;
    }

    // Synthesize multi-dimensional scores
    const overallScore = Number(agentResults.critic.overallScore || 8.0);
    const originality = Number(agentResults.originality.originalityScore || 7.5);
    const feasibility = Number(agentResults.feasibility.overallFeasibilityScore || 8.0);
    const techScore = Number(agentResults.feasibility.technicalScore || 8.0);

    const scores = {
      overallScore,
      originality,
      feasibility,
      technicalComplexity: agentResults.costAndComplexity.complexityLevel === 'Difficult' ? 8.8 : (agentResults.costAndComplexity.complexityLevel === 'Easy' ? 5.0 : 7.2),
      practicalValue: Number(Math.min(9.5, Math.max(6.0, (feasibility * 0.6 + overallScore * 0.4))).toFixed(1)),
      aiSuitability: Number(agentResults.feasibility.aiScore || 8.5),
      innovationPotential: Number(Math.min(9.5, Math.max(5.5, (originality * 0.8 + 1.2))).toFixed(1))
    };

    const finalReport = {
      projectOverview: {
        title: projectData.title || 'Untitled Project Idea',
        idea: projectData.idea,
        description: projectData.description || '',
        targetUsers: projectData.targetUsers || 'General users / students',
        problemStatement: projectData.problemStatement || 'Problem statement as specified in the proposal.',
        preferredTech: projectData.preferredTech || '',
        projectType: projectData.projectType || 'Web Application',
        timeline: projectData.timeline || agentResults.costAndComplexity.estimatedDuration,
        teamSize: projectData.teamSize || '1',
        skillLevel: projectData.skillLevel || 'Intermediate',
        budget: projectData.budget || agentResults.costAndComplexity.estimatedCostRange
      },
      scores,
      verdict: agentResults.critic.verdict,
      agentResults,
      metadata: {
        engineUsed,
        isSample: Boolean(projectData.isSample)
      }
    };

    return finalReport;
  }
}
