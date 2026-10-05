import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let runtimeApiKey = null;
let runtimeModel = null;

export const aiConfig = {
  getApiKey: () => runtimeApiKey || process.env.GEMINI_API_KEY || '',
  setRuntimeApiKey: (key) => {
    runtimeApiKey = (key && key.trim()) ? key.trim() : null;
  },
  getModel: () => runtimeModel || process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  setRuntimeModel: (model) => {
    runtimeModel = (model && model.trim()) ? model.trim() : null;
  },
  isConfigured: () => {
    const key = runtimeApiKey || process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() && key.trim() !== 'your_gemini_api_key_here');
  },
  getEndpoint: (model) => {
    const chosenModel = model || aiConfig.getModel();
    return `https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent`;
  }
};
