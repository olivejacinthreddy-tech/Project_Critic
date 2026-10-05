import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', analyzeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', healthRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AI Project Idea Critic Agent API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      analyze: 'POST /api/analyze',
      samples: '/api/samples',
      projects: '/api/projects',
      compare: 'POST /api/projects/compare',
      settings: 'POST /api/settings/ai-config'
    }
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found on this server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred. Please try again.'
  });
});

// Initialize DB and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 AI Project Idea Critic Agent Backend running on port ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👉 Projects API: http://localhost:${PORT}/api/projects`);
    console.log('====================================================');
  });
}

startServer();
