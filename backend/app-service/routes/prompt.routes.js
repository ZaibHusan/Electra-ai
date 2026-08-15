import express from 'express';
import { getPromptConfig, updatePromptConfig } from '../controllers/prompt.controller.js';
// import { verifyAdmin } from '../middleware/auth.js'; // Add your admin auth middleware here

const promptRoute = express.Router();


promptRoute.get('/', getPromptConfig);
promptRoute.put('/', updatePromptConfig);

export default promptRoute;