import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { receiveNewMessage } from '../../redux/conversationsSlice';
import { socket } from '../../services/socket.service';
import { useConversation } from '../../hooks/useConversation';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './Inbox.css';
import playSound from '../../../public/sounds/sound.js';

export default function Inbox() {
  const dispatch = useDispatch();

  const {
    loadConversations,
    activeConversationId,
    conversations
  } = useConversation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 🔥 1. Create a Ref to always know the current active chat
  const activeChatRef = useRef(activeConversationId);

  // 🔥 2. Update the Ref silently whenever you click a new chat
  useEffect(() => {
    activeChatRef.current = activeConversationId;
  }, [activeConversationId]);

  // =========================================================
  // REAL-TIME SOCKET.IO LISTENER
  // =========================================================
  useEffect(() => {
    socket.connect();
    socket.emit("join_dashboard");

    const handleNewMessage = (data) => {
      dispatch(receiveNewMessage(data));

      // 🔥 3. Play sound ONLY if the message is for the currently open chat
      // AND it wasn't sent by the human agent (you don't want a ding when you type)
      if (
        data.conversationId === activeChatRef.current &&
        data.message.senderRole !== 'human'
      ) {
        playSound()
      }
    };

    socket.on("receive_new_message", handleNewMessage);

    return () => {
      socket.off("receive_new_message", handleNewMessage);
    };
  }, [dispatch]);
  // =========================================================

  // Initial Data Load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Window Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Sidebar Auto-Close
  useEffect(() => {
    if (isMobile && activeConversationId) {
      setIsSidebarOpen(false);
    }
  }, [activeConversationId, isMobile]);

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="inbox-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        isMobile={isMobile}
      />
      <ChatWindow
        onOpenSidebar={handleOpenSidebar}
        isMobile={isMobile}
      />

      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
        />
      )}
    </div>
  );
}