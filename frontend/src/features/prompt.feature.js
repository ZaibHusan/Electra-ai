import api from "../api/api.js";

export const promptFeature = {
    getPromptConfig: async () => {
        const response = await api.get('/api/prompt');
        return response.data;
    },

    updatePromptConfig: async (configData) => {
        const response = await api.put('/api/prompt', configData);
        return response.data;
    }
};