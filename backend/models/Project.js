import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dbState } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbackDbFile = path.resolve(__dirname, '../data/projects.json');

// Mongoose Schema Definition
const projectSchema = new mongoose.Schema(
  {
    projectOverview: {
      title: { type: String, required: true },
      idea: { type: String, required: true },
      description: { type: String, default: '' },
      targetUsers: { type: String, default: '' },
      problemStatement: { type: String, default: '' },
      preferredTech: { type: String, default: '' },
      projectType: { type: String, default: 'Web Application' },
      timeline: { type: String, default: '' },
      teamSize: { type: String, default: '1' },
      skillLevel: { type: String, default: 'Intermediate' },
      budget: { type: String, default: '' }
    },
    scores: {
      overallScore: { type: Number, required: true, min: 1, max: 10 },
      originality: { type: Number, required: true, min: 1, max: 10 },
      feasibility: { type: Number, required: true, min: 1, max: 10 },
      technicalComplexity: { type: Number, required: true, min: 1, max: 10 },
      practicalValue: { type: Number, required: true, min: 1, max: 10 },
      aiSuitability: { type: Number, required: true, min: 1, max: 10 },
      innovationPotential: { type: Number, required: true, min: 1, max: 10 }
    },
    verdict: {
      type: String,
      required: true,
      enum: [
        'Highly Recommended',
        'Recommended with Improvements',
        'Needs Major Changes',
        'Not Recommended'
      ]
    },
    agentResults: {
      research: {
        commonSolutions: [String],
        similarCategories: [String],
        noveltyLevel: String, // 'Common', 'Moderately differentiated', 'Relatively distinctive'
        explanation: String,
        differentiationAreas: [String],
        findingsSummary: String
      },
      technology: {
        frontend: { name: String, reason: String },
        backend: { name: String, reason: String },
        database: { name: String, reason: String },
        aiTechnologies: { name: String, reason: String },
        apis: { name: String, reason: String },
        authentication: { name: String, reason: String },
        hosting: { name: String, reason: String },
        optional: [{ name: String, reason: String }],
        summary: String
      },
      feasibility: {
        technicalScore: Number,
        timeScore: Number,
        skillScore: Number,
        resourceScore: Number,
        aiScore: Number,
        explanations: {
          technical: String,
          time: String,
          skill: String,
          resource: String,
          ai: String
        },
        summary: String
      },
      originality: {
        originalityScore: Number,
        commonalityAssessment: String,
        existingResemblance: [String],
        uniqueAngleSuggestions: [String],
        differentiationTips: [String]
      },
      costAndComplexity: {
        complexityLevel: {
          type: String,
          enum: ['Easy', 'Moderate', 'Difficult']
        },
        estimatedDuration: String,
        estimatedCostRange: String,
        costExplanation: String,
        thirdPartyServices: [String],
        apiRequirements: String,
        databaseRequirements: String,
        hostingRequirements: String
      },
      critic: {
        strengths: [String],
        weaknesses: [String],
        risks: [String],
        suitabilityVerdict: String,
        recommendedFeatures: {
          mustHave: [String],
          shouldHave: [String],
          optional: [String]
        },
        conclusion: String
      }
    },
    metadata: {
      engineUsed: { type: String, default: 'Gemini AI' },
      isSample: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

const MongooseProject = mongoose.models.Project || mongoose.model('Project', projectSchema);

// File-based Storage Helper Functions
const readJsonFile = () => {
  try {
    if (!fs.existsSync(fallbackDbFile)) {
      fs.writeFileSync(fallbackDbFile, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(fallbackDbFile, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('[FileStore] Read error:', err.message);
    return [];
  }
};

const writeJsonFile = (items) => {
  try {
    fs.writeFileSync(fallbackDbFile, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[FileStore] Write error:', err.message);
    return false;
  }
};

// Unified Data Access Object (Works with either MongoDB or File-Store seamlessly)
export const Project = {
  find: async (filter = {}) => {
    if (dbState.isConnected) {
      try {
        return await MongooseProject.find(filter).sort({ createdAt: -1 });
      } catch (err) {
        console.warn('[MongoDB find failed, falling back to FileStore]:', err.message);
      }
    }
    const items = readJsonFile();
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findById: async (id) => {
    if (dbState.isConnected) {
      try {
        const doc = await MongooseProject.findById(id);
        if (doc) return doc;
      } catch (err) {
        console.warn('[MongoDB findById failed, falling back to FileStore]:', err.message);
      }
    }
    const items = readJsonFile();
    return items.find((item) => String(item._id) === String(id)) || null;
  },

  create: async (docData) => {
    if (dbState.isConnected) {
      try {
        return await MongooseProject.create(docData);
      } catch (err) {
        console.warn('[MongoDB create failed, falling back to FileStore]:', err.message);
      }
    }
    const items = readJsonFile();
    const now = new Date().toISOString();
    const newItem = {
      ...docData,
      _id: docData._id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    items.unshift(newItem);
    writeJsonFile(items);
    return newItem;
  },

  findByIdAndDelete: async (id) => {
    if (dbState.isConnected) {
      try {
        const deleted = await MongooseProject.findByIdAndDelete(id);
        if (deleted) return deleted;
      } catch (err) {
        console.warn('[MongoDB findByIdAndDelete failed, falling back to FileStore]:', err.message);
      }
    }
    const items = readJsonFile();
    const index = items.findIndex((item) => String(item._id) === String(id));
    if (index === -1) return null;
    const [deleted] = items.splice(index, 1);
    writeJsonFile(items);
    return deleted;
  },

  countDocuments: async () => {
    if (dbState.isConnected) {
      try {
        return await MongooseProject.countDocuments();
      } catch (err) {
        console.warn('[MongoDB countDocuments failed, falling back to FileStore]:', err.message);
      }
    }
    const items = readJsonFile();
    return items.length;
  }
};
