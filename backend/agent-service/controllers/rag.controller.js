import { 
    ingestData, 
    deleteIngestedData, 
    getAllKnowledgeSources, 
    clearAllKnowledge 
} from "../rag/ingestion/ingest.service.js";

export const handleGetSources = async (req, res) => {
    try {
        const sources = await getAllKnowledgeSources();
        res.status(200).json({ success: true, sources });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const handleIngest = async (req, res) => {
    try {
        const { title, type, content } = req.body;
        const filePath = req.file ? req.file.path : null;

        const result = await ingestData({ title, type, textContent: content, filePath });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const handleDeleteIngestion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteIngestedData(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const handleClearDatabase = async (req, res) => {
    try {
        const result = await clearAllKnowledge();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};