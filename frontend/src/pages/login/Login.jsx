import React, { useEffect, useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States - LOCAL ONLY
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (isSubmitting) return;

        // Clear old errors and start spinner
        setErrorMessage('');
        setIsSubmitting(true);

        const credentials = { email, password };

        // Call the hook and wait for the result
        const response = await login(credentials);

        // Handle the result
        if (response?.success) {
            // Success: navigate to dashboard
            navigate('/', { replace: true });
            // Component will unmount, no need to reset state
        } else {
            // Failure: show error message
            setErrorMessage(response?.message || "Invalid email or password.");
            setIsSubmitting(false);
        }
    };

    // Auto-redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="login-container">
            {/* Ambient Background Elements */}
            <div className="ambient-background" aria-hidden="true">
                <div className="ambient-blob blob-primary"></div>
                <div className="ambient-blob blob-secondary"></div>
            </div>

            <main className="login-main">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="login-header"
                >
                    <div className="brand-logo">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <h1 className="brand-title">Electra AI</h1>
                    <p className="brand-subtitle">Operations Portal</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="login-card"
                >
                    <form onSubmit={handleSubmit} className="login-form">

                        {/* Error Message Banner */}
                        {/* Error Message Banner */}
                        {errorMessage && (
                            <div
                                role="alert"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: '#FEF2F2',
                                    border: '1px solid #F87171',
                                    color: '#B91C1C',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    marginBottom: '16px'
                                }}
                            >
                                <AlertCircle size={16} color="#B91C1C" style={{ flexShrink: 0 }} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@electra.ai"
                                    required
                                    autoComplete="email"
                                    className="form-input"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <label htmlFor="password" className="input-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="form-input"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            <span>
                                {isSubmitting ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Authenticating...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </span>
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>

                    </form>
                </motion.div>

                {/* Footer Metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="login-footer"
                >
                    <span className="system-status">
                        <span className="status-dot"></span>
                        System Operational
                    </span>
                    <span className="system-version">v2.4.19-beta</span>
                </motion.div>
            </main>
        </div>
    );
}