import React from 'react';
import {
  FiMessageSquare,
  FiDatabase,
  FiUsers,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiClock,
  FiArrowUpRight,
  FiPlus,
  FiUploadCloud,
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  // Sample data
  const stats = [
    { label: 'Total Conversations', value: '1,284', icon: <FiMessageSquare size={20} />, change: '+12%' },
    { label: 'Knowledge Sources', value: '24', icon: <FiDatabase size={20} />, change: '+3' },
    { label: 'Active Users', value: '57', icon: <FiUsers size={20} />, change: '+5%' },
    { label: 'Avg Response Time', value: '1.2s', icon: <FiClock size={20} />, change: '-8%' },
  ];

  const recentConversations = [
    { id: 1, user: 'John Doe', query: 'What is our refund policy?', time: '2 min ago', status: 'resolved' },
    { id: 2, user: 'Jane Smith', query: 'How do I reset my password?', time: '15 min ago', status: 'pending' },
    { id: 3, user: 'Mike Johnson', query: 'Upcoming product updates?', time: '1 hour ago', status: 'resolved' },
    { id: 4, user: 'Emily Brown', query: 'Billing issue with invoice #1234', time: '3 hours ago', status: 'escalated' },
    { id: 5, user: 'Chris Lee', query: 'Integration with Salesforce', time: '5 hours ago', status: 'resolved' },
  ];

  const topKnowledge = [
    { title: 'Company FAQ', type: 'text', hits: 342 },
    { title: 'Product Manual v2', type: 'pdf', hits: 289 },
    { title: 'API Documentation', type: 'text', hits: 251 },
    { title: 'Troubleshooting Guide', type: 'pdf', hits: 198 },
    { title: 'Pricing & Plans', type: 'text', hits: 176 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-outline">
            <FiUploadCloud size={16} />
            Import Data
          </button>
          <button className="btn-primary">
            <FiPlus size={16} />
            New Conversation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3>{stat.value}</h3>
              <span className="stat-change">{stat.change}</span>
            </div>
            <FiArrowUpRight className="stat-arrow" size={16} />
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Conversation Trends</h3>
          <span>Last 7 days</span>
        </div>
        <div className="chart-placeholder">
          {/* Simple CSS bar chart mock */}
          {[45, 65, 50, 80, 70, 90, 75].map((height, i) => (
            <div key={i} className="bar" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="dashboard-lower">
        {/* Recent Conversations */}
        <div className="panel">
          <div className="panel-header">
            <h3>Recent Conversations</h3>
            <button className="text-btn">View all</button>
          </div>
          <ul className="conversation-list">
            {recentConversations.map((conv) => (
              <li key={conv.id} className="conversation-item">
                <div className="conv-user">{conv.user[0]}</div>
                <div className="conv-details">
                  <p className="conv-query">{conv.query}</p>
                  <span className="conv-meta">
                    {conv.user} • {conv.time}
                  </span>
                </div>
                <span className={`status-badge status-${conv.status}`}>
                  {conv.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Knowledge Sources */}
        <div className="panel">
          <div className="panel-header">
            <h3>Top Knowledge Sources</h3>
            <button className="text-btn">Manage</button>
          </div>
          <ul className="knowledge-list">
            {topKnowledge.map((src, i) => (
              <li key={i} className="knowledge-item">
                <div className="knowledge-icon">
                  {src.type === 'pdf' ? <FiFileText size={16} /> : <FiDatabase size={16} />}
                </div>
                <div className="knowledge-info">
                  <p className="knowledge-title">{src.title}</p>
                  <span className="knowledge-type">{src.type.toUpperCase()}</span>
                </div>
                <div className="knowledge-hits">
                  <span>{src.hits}</span> hits
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn"><FiPlus size={18} /> Add Knowledge</button>
          <button className="action-btn"><FiMessageSquare size={18} /> Start Chat</button>
          <button className="action-btn"><FiUsers size={18} /> Manage Users</button>
          <button className="action-btn"><FiActivity size={18} /> View Analytics</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;