import { ragAdminService } from "../services/rag.admin.service.js";

export const getSources = async (req, res) => {
    try {
        const sources = await ragAdminService.getSources();
        res.json(sources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const ingestData = async (req, res) => {
    try {
        const result = await ragAdminService.ingestSource(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSource = async (req, res) => {
    try {
        const result = await ragAdminService.deleteSource(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const clearData = async (req, res) => {
    try {
        const result = await ragAdminService.clearAllData();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};