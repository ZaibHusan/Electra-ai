import api from "../api/api.js";


const authFeature = {
    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        return response
    },

    logout: async () => {
        const response = await api.post('/api/auth/logout');
        return response.data;
    },

    // 3. Check if user is already logged in (auto-call on startup)
    isLogin: async () => {
        const response = await api.get('/api/auth/user');
        return response.data;
    }
}

export default authFeature;