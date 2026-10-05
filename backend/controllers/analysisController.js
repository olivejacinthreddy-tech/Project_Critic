import { AgentCoordinator } from '../agents/agentCoordinator.js';
import { Project } from '../models/Project.js';
import { sampleProjects } from '../utils/sampleProjects.js';

const coordinator = new AgentCoordinator();

export const analyzeProject = async (req, res) => {
  const {
    idea,
    title,
    description,
    targetUsers,
    problemStatement,
    preferredTech,
    projectType,
    timeline,
    teamSize,
    skillLevel,
    budget,
    isSample
  } = req.body;

  // Validation: Project Idea is strictly required
  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Project Idea is required. Please provide a clear description of your project concept.'
    });
  }

  const projectInput = {
    title: (title && title.trim()) ? title.trim() : (idea.length > 50 ? `${idea.slice(0, 47)}...` : idea),
    idea: idea.trim(),
    description: (description && description.trim()) ? description.trim() : '',
    targetUsers: (targetUsers && targetUsers.trim()) ? targetUsers.trim() : 'Undergraduate students and university campus community',
    problemStatement: (problemStatement && problemStatement.trim()) ? problemStatement.trim() : 'Fragmented processes and lack of centralized assistance.',
    preferredTech: preferredTech || '',
    projectType: projectType || 'Web Application',
    timeline: timeline || '4–6 weeks',
    teamSize: teamSize || '2-3',
    skillLevel: skillLevel || 'Intermediate',
    budget: budget || 'Student Free Tier',
    isSample: Boolean(isSample)
  };

  const isSSE = req.headers.accept === 'text/event-stream';

  if (isSSE) {
    // Server-Sent Events for live pipeline progress
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      sendEvent('pipeline_start', { message: 'Agentic AI Pipeline Initialized' });

      const finalReport = await coordinator.runAnalysis(projectInput, (progress) => {
        sendEvent('agent_step', progress);
      });

      // Save to database
      const savedDoc = await Project.create(finalReport);

      sendEvent('pipeline_complete', {
        success: true,
        projectId: savedDoc._id,
        project: savedDoc
      });
      res.end();
    } catch (err) {
      console.error('[Analysis SSE Error]:', err);
      sendEvent('pipeline_error', {
        success: false,
        error: err.message || 'An unexpected error occurred during agent analysis.'
      });
      res.end();
    }
  } else {
    // Standard JSON response
    try {
      const finalReport = await coordinator.runAnalysis(projectInput);
      const savedDoc = await Project.create(finalReport);
      return res.status(200).json({
        success: true,
        projectId: savedDoc._id,
        project: savedDoc
      });
    } catch (err) {
      console.error('[Analysis Error]:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error during project analysis.'
      });
    }
  }
};

export const getSamples = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      samples: sampleProjects
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve sample projects.'
    });
  }
};
