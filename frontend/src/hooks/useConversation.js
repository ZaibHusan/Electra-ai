import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { conversationFeature } from "../features/converstation.feature.js";
import { socket } from "../services/socket.service.js"; // 🔥 Import your socket instance
import {
  setConversations,
  setActiveConversationId,
  setMessages,
  receiveNewMessage,
  updateConversationMode,
  markAsReadInState,
  setLoadingState,
  setError,
} from "../redux/conversationsSlice.js";

export const useConversation = () => {
  const dispatch = useDispatch();

  // Redux Selectors
  const {
    conversations,
    activeConversationId,
    activeConversation,
    isLoadingList,
    isLoadingMessages,
    isSending,
    error,
  } = useSelector((state) => state.conversations);

  // Computed Active Conversation Metadata
  const activeConversationData = conversations.find(
    (c) => c.id === activeConversationId
  );

  // =========================================================
  // 🔥 REAL-TIME SOCKET.IO LISTENER
  // =========================================================



  // =========================================================
  // ACTIONS
  // =========================================================

  // 1. Fetch all conversations
  const loadConversations = useCallback(async () => {
    dispatch(setLoadingState({ key: "isLoadingList", value: true }));
    try {
      const res = await conversationFeature.getConversations();
      if (res.success) {
        dispatch(setConversations(res.conversations));
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to load conversations"));
    }
  }, [dispatch]);

  // 2. Select a conversation & mark as read
  const selectConversation = useCallback(
    async (id) => {
      dispatch(setActiveConversationId(id));
      dispatch(setLoadingState({ key: "isLoadingMessages", value: true }));

      try {
        // Fetch transcript
        const res = await conversationFeature.getMessages(id);
        if (res.success) {
          dispatch(setMessages(res.messages));
        }

        // Mark as read on backend and Redux state
        await conversationFeature.markAsRead(id);
        dispatch(markAsReadInState(id));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to load messages"));
      }
    },
    [dispatch]
  );

  // 3. Send a message as a human agent
  const sendMessage = useCallback(
    async (text) => {
      if (!activeConversationId || !text.trim()) return;

      dispatch(setLoadingState({ key: "isSending", value: true }));
      try {
        const res = await conversationFeature.sendHumanMessage(activeConversationId, text);
        if (res.success) {
          // Push new message into transcript & update sidebar
          dispatch(
            receiveNewMessage({
              conversationId: activeConversationId,
              message: res.message,
            })
          );
        }
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to send message"));
      } finally {
        dispatch(setLoadingState({ key: "isSending", value: false }));
      }
    },
    [activeConversationId, dispatch]
  );

  // 4. Toggle AI Mode
  const toggleMode = useCallback(
    async (isAutoMode) => {
      if (!activeConversationId) return;

      try {
        const res = await conversationFeature.toggleMode(activeConversationId, isAutoMode);
        if (res.success) {
          dispatch(
            updateConversationMode({
              conversationId: activeConversationId,
              isAutoMode: res.isAutoMode,
            })
          );
        }
      } catch (err) {
        dispatch(setError(err.response?.data?.message || "Failed to toggle mode"));
      }
    },
    [activeConversationId, dispatch]
  );

  return {
    // State
    conversations,
    activeConversationId,
    activeConversation,
    activeConversationData,
    isLoadingList,
    isLoadingMessages,
    isSending,
    error,

    // Actions
    loadConversations,
    selectConversation,
    sendMessage,
    toggleMode,
  };
};