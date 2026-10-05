/**
 * API Client Service for AI Project Idea Critic Agent
 * Connects frontend to backend with streaming SSE support and resilient fallbacks
 */

const API_BASE = '/api';

export const api = {
  // Check backend and AI engine health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[API] Health check error:', err.message);
      return {
        status: 'offline',
        database: { isConnected: false, isFallback: true, type: 'Local Cache' },
        aiEngine: { isConfigured: true, mode: 'Gemini AI Engine' }
      };
    }
  },

  // Get sample projects
  async getSamples() {
    try {
      const res = await fetch(`${API_BASE}/samples`);
      if (!res.ok) throw new Error(`Failed to load samples: ${res.status}`);
      const data = await res.json();
      return data.samples || [];
    } catch (err) {
      console.warn('[API] getSamples error:', err.message);
      return [];
    }
  },

  // Analyze project with SSE streaming progress callbacks
  async analyzeProject(projectData, onProgress = null) {
    if (!onProgress) {
      // Direct standard JSON fetch
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete project analysis.');
      }
      return data;
    }

    // Server-Sent Events (SSE) Streaming fetch
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      let errText = await response.text();
      try {
        const json = JSON.parse(errText);
        errText = json.error || errText;
      } catch (e) {
        // use raw errText
      }
      throw new Error(errText || 'Analysis request rejected by server.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let finalResult = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // keep last incomplete chunk

      for (const block of lines) {
        if (!block.trim()) continue;
        const eventMatch = block.match(/event:\s*(.+)/);
        const dataMatch = block.match(/data:\s*(.+)/);

        if (eventMatch && dataMatch) {
          const eventType = eventMatch[1].trim();
          try {
            const payload = JSON.parse(dataMatch[1].trim());

            if (eventType === 'agent_step') {
              onProgress(payload);
            } else if (eventType === 'pipeline_complete') {
              finalResult = payload;
            } else if (eventType === 'pipeline_error') {
              throw new Error(payload.error || 'Error during pipeline execution.');
            }
          } catch (e) {
            console.error('[API] Error parsing SSE payload:', e);
          }
        }
      }
    }

    if (!finalResult) {
      throw new Error('Analysis completed but did not return final report.');
    }

    return finalResult;
  },

  // Get all saved project analyses
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to retrieve saved projects.');
    const data = await res.json();
    return data.projects || [];
  },

  // Get project by ID
  async getProjectById(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project details.');
    const data = await res.json();
    return data.project;
  },

  // Delete project
  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project.');
    return await res.json();
  },

  // Compare two projects
  async compareProjects(projectAId, projectBId) {
    const res = await fetch(`${API_BASE}/projects/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectAId, projectBId })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Comparison calculation failed.');
    }
    return data.comparison;
  },

  // Update AI settings
  async updateAiSettings(apiKey, model) {
    const res = await fetch(`${API_BASE}/settings/ai-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model })
    });
    if (!res.ok) throw new Error('Failed to save AI settings.');
    return await res.json();
  }
};
