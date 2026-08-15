import api from "../api/api.js";



export const conversationFeature = {
  getConversations: async () => {
    const response = await api.get("/api/conversations/getconversations");
    return response.data; // { success: true, conversations: [...] }
  },


  getMessages: async (conversationId) => {
    const response = await api.get(`/api/conversations/getmessages/${conversationId}`);
    return response.data; // { success: true, messages: [...] }
  },


  sendHumanMessage: async (conversationId, text) => {
    const response = await api.post(`/api/conversations/${conversationId}/messages`, { text });
    return response.data; // { success: true, message: {...} }
  },

  // 4. Toggle AI Auto Mode ON / OFF
  toggleMode: async (conversationId, isAutoMode) => {
    const response = await api.patch(`/api/conversations/${conversationId}/mode`, { isAutoMode });
    return response.data; // { success: true, isAutoMode: boolean }
  },

  // 5. Mark conversation as read
  markAsRead: async (conversationId) => {
    const response = await api.patch(`/api/conversations/${conversationId}/read`);
    return response.data; // { success: true, unreadCount: 0 }
  },
};