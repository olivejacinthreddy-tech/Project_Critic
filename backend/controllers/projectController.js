import { Project } from '../models/Project.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (err) {
    console.error('[getAllProjects Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects history.'
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      project
    });
  } catch (err) {
    console.error('[getProjectById Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve project details.'
    });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${id} not found or already deleted.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Project analysis deleted successfully.',
      id
    });
  } catch (err) {
    console.error('[deleteProjectById Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete project.'
    });
  }
};

export const compareProjects = async (req, res) => {
  try {
    const { projectAId, projectBId } = req.body;

    if (!projectAId || !projectBId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both projectAId and projectBId to perform comparison.'
      });
    }

    const [projA, projB] = await Promise.all([
      Project.findById(projectAId),
      Project.findById(projectBId)
    ]);

    if (!projA || !projB) {
      return res.status(404).json({
        success: false,
        error: 'One or both projects could not be found for comparison.'
      });
    }

    const comparison = {
      projectA: projA,
      projectB: projB,
      metrics: {
        overallWinner: projA.scores.overallScore >= projB.scores.overallScore ? projA.projectOverview.title : projB.projectOverview.title,
        scoreDiff: Math.abs(projA.scores.overallScore - projB.scores.overallScore).toFixed(1),
        originalityComparison: {
          projectA: projA.scores.originality,
          projectB: projB.scores.originality,
          higher: projA.scores.originality >= projB.scores.originality ? 'A' : 'B'
        },
        feasibilityComparison: {
          projectA: projA.scores.feasibility,
          projectB: projB.scores.feasibility,
          higher: projA.scores.feasibility >= projB.scores.feasibility ? 'A' : 'B'
        },
        complexityComparison: {
          projectA: projA.agentResults.costAndComplexity?.complexityLevel || 'Moderate',
          projectB: projB.agentResults.costAndComplexity?.complexityLevel || 'Moderate'
        },
        costComparison: {
          projectA: projA.agentResults.costAndComplexity?.estimatedCostRange || '$0 - $15',
          projectB: projB.agentResults.costAndComplexity?.estimatedCostRange || '$0 - $15'
        },
        aiSuitabilityComparison: {
          projectA: projA.scores.aiSuitability,
          projectB: projB.scores.aiSuitability,
          higher: projA.scores.aiSuitability >= projB.scores.aiSuitability ? 'A' : 'B'
        }
      },
      comparativeSummary: `Comparing "${projA.projectOverview.title}" (${projA.scores.overallScore}/10) vs "${projB.projectOverview.title}" (${projB.scores.overallScore}/10). ${
        projA.scores.overallScore > projB.scores.overallScore
          ? `Project A demonstrates a stronger overall balance with higher feasibility and clear academic execution.`
          : projA.scores.overallScore < projB.scores.overallScore
          ? `Project B demonstrates higher evaluation metrics, offering stronger innovation potential and practical value.`
          : `Both project concepts are closely matched in their overall viability for a college minor project.`
      }`
    };

    return res.status(200).json({
      success: true,
      comparison
    });
  } catch (err) {
    console.error('[compareProjects Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to perform project comparison.'
    });
  }
};
