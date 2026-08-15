import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  activeConversationId: null,
  activeConversation: [], // Message objects array
  isLoadingList: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.isLoadingList = false;
    },

    addNewConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    setActiveConversationId: (state, action) => {
      state.activeConversationId = action.payload;
      state.activeConversation = []; // Prevent flashing previous chat
    },

    setMessages: (state, action) => {
      state.activeConversation = action.payload;
      state.isLoadingMessages = false;
    },

    receiveNewMessage: (state, action) => {
      const { conversationId, message, isAutoMode } = action.payload;

      // Append to active chat transcript if open
      if (state.activeConversationId === conversationId) {
        state.activeConversation.push(message);
      }

      // Update sidebar item
      const chatIndex = state.conversations.findIndex((c) => c.id === conversationId);

      if (chatIndex > -1) {
        const updatedChat = { ...state.conversations[chatIndex] };
        
        updatedChat.lastMessage = message.text;
        updatedChat.time = message.timestamp || new Date().toISOString();
        if (isAutoMode !== undefined) updatedChat.isAutoMode = isAutoMode;

        // Increment unread count if not currently looking at this chat
        if (state.activeConversationId !== conversationId && message.senderRole === "user") {
          updatedChat.unreadCount = (updatedChat.unreadCount || 0) + 1;
        }

        // Move to top of list
        state.conversations.splice(chatIndex, 1);
        state.conversations.unshift(updatedChat);
      }
    },

    updateConversationMode: (state, action) => {
      const { conversationId, isAutoMode } = action.payload;
      const chat = state.conversations.find((c) => c.id === conversationId);
      if (chat) {
        chat.isAutoMode = isAutoMode;
      }
    },

    markAsReadInState: (state, action) => {
      const conversationId = action.payload;
      const chat = state.conversations.find((c) => c.id === conversationId);
      if (chat) {
        chat.unreadCount = 0;
      }
    },

    setLoadingState: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoadingList = false;
      state.isLoadingMessages = false;
      state.isSending = false;
    },
  },
});

export const {
  setConversations,
  addNewConversation,
  setActiveConversationId,
  setMessages,
  receiveNewMessage,
  updateConversationMode,
  markAsReadInState,
  setLoadingState,
  setError,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;