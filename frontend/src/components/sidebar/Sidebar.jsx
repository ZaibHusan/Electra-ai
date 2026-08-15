import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Sparkles,
    Database,
    LayoutDashboard,
    Settings,
    User,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

export default function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [LogoutLoading, setLogoutLoading] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setLogoutLoading(true);
        await logout();
        setLogoutLoading(false);
        navigate('/login');
    };

    const navLinks = [
        { path: '/inbox', icon: MessageSquare, label: 'Inbox' },
        { path: '/prompts', icon: Sparkles, label: 'Prompts' },
        { path: '/knowledge', icon: Database, label: 'Knowledge' },
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="sidebar-container">
            {/* Brand Logo - Square E */}
            <div className="sidebar-brand" onClick={() => navigate('/')}>
                <div className="brand-icon" title="Electra AI" />
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        title={link.label}
                    >
                        <link.icon size={20} strokeWidth={2} />
                        <span className="nav-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Profile & Logout */}
            <div className="sidebar-footer" style={{ padding: 10 }} ref={menuRef}>
                <button
                    className={`profile-btn ${showProfileMenu ? 'active' : ''}`}
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-label="User Profile"
                    title={user?.name || 'Profile'}
                >
                    <User size={18} strokeWidth={2} />
                </button>

                {showProfileMenu && (
                    <div className="profile-menu">
                        <div style={{
                            padding: '8px 12px',
                            borderBottom: '1px solid #E5E7EA',
                            marginBottom: '4px'
                        }}>
                            <p style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#14171F',
                                margin: 0
                            }}>
                                {user?.name || 'Admin'}
                            </p>
                            <p style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '10px',
                                color: '#6B7280',
                                margin: '2px 0 0 0'
                            }}>
                                {user?.email || 'admin@electra.ai'}
                            </p>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={16} />
                            <span>{LogoutLoading ? 'Logging out...' : 'sign out'}</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}