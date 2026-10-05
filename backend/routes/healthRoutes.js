import express from 'express';
import { getHealth, updateAiConfig } from '../controllers/healthController.js';

const router = express.Router();

router.get('/health', getHealth);
router.post('/settings/ai-config', updateAiConfig);

export default router;
