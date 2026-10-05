import express from 'express';
import {
  getAllProjects,
  getProjectById,
  deleteProjectById,
  compareProjects
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProjectById);
router.post('/compare', compareProjects);

export default router;
