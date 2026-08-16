import express from 'express';
import { getStatus, toggleStatus } from '../controllers/system.controller.js';

const systemRouter = express.Router();

// GET /api/admin/system/status
systemRouter.get('/status', getStatus);

// POST /api/admin/system/toggle
systemRouter.post('/toggle', toggleStatus);

export default systemRouter;