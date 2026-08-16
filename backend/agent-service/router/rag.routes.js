import express from 'express';
import multer from 'multer';
import { 
    handleGetSources, 
    handleIngest, 
    handleDeleteIngestion, 
    handleClearDatabase 
} from "../controllers/rag.controller.js";

const upload = multer({ dest: 'agent-service/documents/' }); 
const ragRoutes = express.Router();

ragRoutes.get('/sources', handleGetSources);
ragRoutes.post('/ingest', upload.single('file'), handleIngest);
ragRoutes.delete('/ingest/:id', handleDeleteIngestion);
ragRoutes.delete('/clear', handleClearDatabase); // Route to completely wipe database & vector store

export default ragRoutes;