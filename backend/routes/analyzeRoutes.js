import express from 'express';
import { analyzeProject, getSamples } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/analyze', analyzeProject);
router.get('/samples', getSamples);

export default router;
