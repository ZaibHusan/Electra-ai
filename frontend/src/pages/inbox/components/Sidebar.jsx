// pages/inbox/components/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { useConversation } from "../../../hooks/useConversation";
import { 
  Search, 
  X, 
  Inbox as InboxIcon,
  Filter,
  SlidersHorizontal,
  MessageSquare,
  Users,
  Clock,
  Star,
  Archive,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, isMobile }) {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    isLoadingList,
  } = useConversation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all, auto, human
  const [filterStatus, setFilterStatus] = useState("all"); // all, unread, hot_lead, closed
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced filtering
  const filteredConversations = useMemo(() => {
    return conversations.filter((chat) => {
      // Search filter
      const searchMatch = 
        !searchTerm ||
        chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

      // Mode filter
      const modeMatch = 
        filterMode === "all" ||
        (filterMode === "auto" && chat.isAutoMode) ||
        (filterMode === "human" && !chat.isAutoMode);

      // Status filter
      const statusMatch = 
        filterStatus === "all" ||
        (filterStatus === "unread" && chat.unreadCount > 0) ||
        (filterStatus === "hot_lead" && chat.status === "hot_lead") ||
        (filterStatus === "closed" && chat.status === "closed");

      return searchMatch && modeMatch && statusMatch;
    });
  }, [conversations, searchTerm, filterMode, filterStatus]);

  // Sort conversations
  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      // Hot leads first
      if (a.status === "hot_lead" && b.status !== "hot_lead") return -1;
      if (a.status !== "hot_lead" && b.status === "hot_lead") return 1;
      
      // Then by last message time
      return new Date(b.time || b.lastMessageAt) - new Date(a.time || a.lastMessageAt);
    });
  }, [filteredConversations]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "";
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    if (!name) return "CU";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSelectConversation = (id) => {
    selectConversation(id);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "whatsapp":
        return "WA";
      case "instagram":
        return "IG";
      case "messenger":
        return "MS";
      default:
        return "??";
    }
  };

  return (
    <>
      <aside className={`inbox-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <div className="sidebar-title-section">
              <h2 className="sidebar-title">Inbox</h2>
              <span className="total-badge">{conversations.length}</span>
            </div>
            
            <div className="sidebar-actions">
              <button 
                className="icon-btn"
                onClick={() => setShowFilters(!showFilters)}
                title="Filters"
              >
                <SlidersHorizontal size={16} />
              </button>
              {isMobile && (
                <button className="icon-btn" onClick={onClose}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label className="filter-label">Mode</label>
                <div className="filter-options">
                  <button 
                    className={`filter-chip ${filterMode === "all" ? "active" : ""}`}
                    onClick={() => setFilterMode("all")}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-chip auto ${filterMode === "auto" ? "active" : ""}`}
                    onClick={() => setFilterMode("auto")}
                  >
                    <span className="dot auto-dot"></span>
                    Auto
                  </button>
                  <button 
                    className={`filter-chip human ${filterMode === "human" ? "active" : ""}`}
                    onClick={() => setFilterMode("human")}
                  >
                    <span className="dot human-dot"></span>
                    Human
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <div className="filter-options">
                  <button 
                    className={`filter-chip ${filterStatus === "all" ? "active" : ""}`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-chip ${filterStatus === "unread" ? "active" : ""}`}
                    onClick={() => setFilterStatus("unread")}
                  >
                    Unread
                  </button>
                  <button 
                    className={`filter-chip hot ${filterStatus === "hot_lead" ? "active" : ""}`}
                    onClick={() => setFilterStatus("hot_lead")}
                  >
                    🔥 Hot
                  </button>
                  <button 
                    className={`filter-chip ${filterStatus === "closed" ? "active" : ""}`}
                    onClick={() => setFilterStatus("closed")}
                  >
                    Closed
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">{conversations.filter(c => c.status === "hot_lead").length}</span>
            <span className="stat-label">Hot Leads</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{conversations.filter(c => !c.isAutoMode).length}</span>
            <span className="stat-label">Human Mode</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{conversations.filter(c => c.unreadCount > 0).length}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>

        {/* Conversation List */}
        <div className="conversation-list">
          {isLoadingList ? (
            <div className="loading-state">
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
              <div className="skeleton skeleton-item"></div>
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="empty-state">
              <InboxIcon size={32} className="empty-icon" />
              <p>No conversations found</p>
              <span>Try adjusting your filters</span>
            </div>
          ) : (
            sortedConversations.map((chat) => {
              const isActive = chat.id === activeConversationId;
              const initials = getInitials(chat.name);
              const platformIcon = getPlatformIcon(chat.source);

              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelectConversation(chat.id)}
                  className={`conversation-item ${isActive ? "active" : ""}`}
                >
                  {/* Avatar */}
                  <div className="avatar-wrapper">
                    <div className={`avatar ${chat.status === "hot_lead" ? "hot-lead" : ""}`}>
                      {initials}
                    </div>
                    <span className={`platform-badge platform-${chat.source}`}>
                      {platformIcon}
                    </span>
                    
                    {/* Online indicator */}
                    {chat.isOnline && (
                      <span className="online-indicator"></span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="conversation-info">
                    <div className="conversation-top-row">
                      <div className="name-section">
                        <span className="customer-name">{chat.name}</span>
                        {chat.status === "hot_lead" && (
                          <span className="hot-lead-badge">🔥</span>
                        )}
                      </div>
                      <span className="message-time">{formatTime(chat.time)}</span>
                    </div>

                    <div className="conversation-bottom-row">
                      <p className="last-message">
                        {chat.lastMessage || "No messages yet"}
                      </p>

                      <div className="status-pills">
                        {/* Mode indicator */}
                        <span 
                          className={`mode-indicator-dot ${chat.isAutoMode ? "auto" : "human"}`}
                          title={chat.isAutoMode ? "AI Mode" : "Human Mode"}
                        ></span>

                        {/* Unread Counter */}
                        {chat.unreadCount > 0 && (
                          <span className="unread-badge">{chat.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-info">
            <span className="footer-status">
              <span className="status-dot"></span>
              All systems operational
            </span>
            <span className="footer-version">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}