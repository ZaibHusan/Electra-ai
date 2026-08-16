import express from 'express';
import multer from 'multer';
import { getSources, ingestData, deleteSource, clearData } from '../controllers/admin.rag.controller.js';

const upload = multer({ storage: multer.memoryStorage() });

const adminRagRouter = express.Router();

adminRagRouter.get('/sources', getSources);
adminRagRouter.post('/ingest', upload.single('file'), ingestData);
adminRagRouter.delete('/source/:id', deleteSource);
adminRagRouter.delete('/clear', clearData);

export default adminRagRouter;