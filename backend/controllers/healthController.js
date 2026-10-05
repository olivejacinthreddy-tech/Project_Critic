import fs from 'fs';
import path from 'path';
import { dbState } from '../config/db.js';
import { aiConfig } from '../config/aiConfig.js';
import { Project } from '../models/Project.js';

export const getHealth = async (req, res) => {
  try {
    const projectCount = await Project.countDocuments();
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        isConnected: dbState.isConnected,
        isFallback: dbState.isFallback,
        type: dbState.type,
        message: dbState.message
      },
      aiEngine: {
        isConfigured: aiConfig.isConfigured(),
        model: aiConfig.getModel(),
        mode: aiConfig.isConfigured() ? 'Live Gemini AI' : 'Gemini AI Engine'
      },
      stats: {
        savedProjects: projectCount
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'degraded',
      error: err.message
    });
  }
};

export const updateAiConfig = async (req, res) => {
  try {
    const { apiKey, model } = req.body;

    if (typeof apiKey === 'string') {
      aiConfig.setRuntimeApiKey(apiKey);
      try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('GEMINI_API_KEY=')) {
            envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${apiKey.trim()}`);
          } else {
            envContent += `\nGEMINI_API_KEY=${apiKey.trim()}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
        }
      } catch (e) {
        console.warn('Could not write to .env:', e.message);
      }
    }
    if (typeof model === 'string' && model.trim()) {
      aiConfig.setRuntimeModel(model.trim());
    }

    return res.status(200).json({
      success: true,
      message: 'Gemini AI configured successfully.',
      isConfigured: aiConfig.isConfigured(),
      model: aiConfig.getModel(),
      mode: aiConfig.isConfigured() ? 'Live Gemini AI' : 'Gemini AI Engine'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update AI configuration.'
    });
  }
};
