import api from '../api/api.js';

const systemFeature = {
    getStatus: async () => {
        const response = await api.get('/api/system/status');
        return response.data;
    },
    toggleStatus: async (isActive) => {
        const response = await api.post('/api/system/toggle', { isActive });
        return response.data;
    }
};

export default systemFeature;