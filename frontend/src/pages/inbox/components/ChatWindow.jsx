// pages/inbox/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '../../../hooks/useConversation';
import { 
  ArrowLeft, 
  MessageSquare, 
  Bot, 
  User, 
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  AlertCircle,
  Check,
  CheckCheck
} from 'lucide-react';

export default function ChatWindow({ onOpenSidebar, isMobile }) {
  const { 
    activeConversationId, 
    activeConversationData,
    activeConversation,
    isLoadingMessages,
    isSending,
    sendMessage,
    toggleMode
  } = useConversation();

  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation]);

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversationId && activeConversationData?.isAutoMode === false) {
      inputRef.current?.focus();
    }
  }, [activeConversationId, activeConversationData?.isAutoMode]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && !isSending && !activeConversationData?.isAutoMode) {
      sendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return '';
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Group messages by date
  const groupedMessages = activeConversation.reduce((groups, message) => {
    const date = formatDate(message.timestamp || message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!activeConversationId) {
    return (
      <div className="chat-window">
        <div className="welcome-state">
          <div className="welcome-icon">
            <MessageSquare size={40} color="#4F46E5" />
          </div>
          <h3 className="welcome-title">Welcome to Electra Inbox</h3>
          <p className="welcome-subtitle">
            Select a conversation to start managing your customer interactions
          </p>
          <div className="welcome-features">
            <div className="feature-item">
              <Bot size={16} />
              <span>AI Auto-Responses</span>
            </div>
            <div className="feature-item">
              <User size={16} />
              <span>Human Takeover</span>
            </div>
            <div className="feature-item">
              <CheckCheck size={16} />
              <span>Read Receipts</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAutoMode = activeConversationData?.isAutoMode;
  const initials = getInitials(activeConversationData?.name);

  return (
    <div className="chat-window">
      {/* Mode Indicator Strip */}
      <div className={`mode-indicator-strip ${isAutoMode ? 'auto' : 'human'}`}></div>

      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          {isMobile && (
            <button className="icon-btn back-btn" onClick={onOpenSidebar}>
              <ArrowLeft size={18} />
            </button>
          )}
          
          <div className="header-avatar">
            {initials}
            <span className="avatar-status-dot"></span>
          </div>
          
          <div className="header-info">
            <h3 className="header-name">{activeConversationData?.name}</h3>
            <div className="header-meta">
              <span className={`header-status ${isAutoMode ? 'auto' : 'human'}`}>
                {isAutoMode ? '🤖 AI Active' : '👤 Human Active'}
              </span>
              <span className="header-separator">·</span>
              <span className="header-source">{activeConversationData?.source}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          {/* Quick actions */}
          <button className="icon-btn" title="Call">
            <Phone size={16} />
          </button>
          <button className="icon-btn" title="Video">
            <Video size={16} />
          </button>
          <button className="icon-btn" title="Star">
            <Star size={16} />
          </button>
          
          {/* Mode Toggle */}
          <button
            onClick={() => toggleMode(!isAutoMode)}
            className={`mode-toggle-btn ${isAutoMode ? 'auto' : 'human'}`}
            title={isAutoMode ? 'Switch to Human Mode' : 'Switch to Auto Mode'}
          >
            <span className="toggle-track">
              <span className={`toggle-thumb ${isAutoMode ? 'auto' : 'human'}`}></span>
            </span>
            <span className="toggle-label">
              {isAutoMode ? 'Auto' : 'Human'}
            </span>
          </button>

          {/* More options */}
          <div className="options-wrapper">
            <button 
              className="icon-btn"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={16} />
            </button>
            
            {showOptions && (
              <div className="options-menu">
                <button className="option-item">
                  <Archive size={14} />
                  Archive Conversation
                </button>
                <button className="option-item danger">
                  <Trash2 size={14} />
                  Delete Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="message-list">
        {isLoadingMessages ? (
          <div className="loading-state">
            <div className="skeleton skeleton-message"></div>
            <div className="skeleton skeleton-message short"></div>
            <div className="skeleton skeleton-message"></div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="message-group">
              <div className="date-separator">
                <span>{date}</span>
              </div>
              
              {messages.map((msg, index) => {
                const isUser = msg.senderRole === 'user';
                const isAI = msg.senderRole === 'ai';
                const isHuman = msg.senderRole === 'human';
                
                return (
                  <div 
                    key={msg.id || index} 
                    className={`message-wrapper ${isUser ? 'user' : isAI ? 'ai' : 'human'}`}
                  >
                    <div className="message-bubble">
                      {msg.text}
                      <div className="message-meta">
                        <span className="message-time">
                          {formatTime(msg.timestamp || msg.createdAt)}
                        </span>
                        {!isUser && (
                          <span className="message-status">
                            <CheckCheck size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Mode Banner */}
      {isAutoMode && (
        <div className="ai-mode-banner">
          <Bot size={14} />
          <span>Electra AI is handling this conversation automatically</span>
          <button 
            className="take-control-btn"
            onClick={() => toggleMode(false)}
          >
            Take Control
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <form onSubmit={handleSend} className="chat-input-form">
          <button type="button" className="input-action-btn" title="Attach">
            <Paperclip size={16} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isAutoMode ? 'Switch to Human Mode to send messages...' : 'Type your message...'}
            className="chat-input-field"
            disabled={isAutoMode || isSending}
          />
          
          <button type="button" className="input-action-btn" title="Emoji">
            <Smile size={16} />
          </button>
          
          <button 
            type="submit" 
            className="send-button"
            disabled={isAutoMode || isSending || !message.trim()}
          >
            {isSending ? (
              <span className="sending-spinner"></span>
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
        
        <div className="input-footer">
          <span className="input-hint">
            {isAutoMode ? 'Auto mode enabled - AI will respond' : 'Press Enter to send'}
          </span>
        </div>
      </div>
    </div>
  );
}