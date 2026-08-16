import api from "../api/api.js";

const knowledgeFeature = {
    getSources: async () => {
        try {
            const response = await api.get('/api/admin/rag/sources');
            return response.data;
        } catch (error) {
            console.error('Error fetching sources:', error);
            throw error;
        }
    },

    ingestSource: async (payload) => {
        try {
            let response;
            if (payload instanceof FormData) {
                // For PDF upload - let browser set content-type
                response = await api.post('/api/admin/rag/ingest', payload);
            } else {
                // For text JSON
                response = await api.post('/api/admin/rag/ingest', payload, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return response.data;
        } catch (error) {
            console.error('Error ingesting source:', error);
            throw error;
        }
    },

    deleteSource: async (id) => {
        try {
            const response = await api.delete(`/api/admin/rag/source/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting source:', error);
            throw error;
        }
    },

    clearDatabase: async () => {
        try {
            const response = await api.delete('/api/admin/rag/clear');
            return response.data;
        } catch (error) {
            console.error('Error clearing database:', error);
            throw error;
        }
    }
};

export default knowledgeFeature;