import React, { useEffect } from 'react';
import { useSystem } from '../../hooks/useSystem';
import './Settings.css';

export default function Settings() {
    const { isAiActive, isLoading, error, successMessage, fetchSystemStatus, toggleSystem } = useSystem();

    useEffect(() => {
        fetchSystemStatus();
    }, [fetchSystemStatus]);

    const handleToggleChange = () => {
        toggleSystem(!isAiActive);
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>System Settings</h2>
                <p>Manage global preferences and emergency controls for your Electra AI agent.</p>
            </div>

            {error && <div className="settings-alert error">{error}</div>}
            {successMessage && <div className="settings-alert success">{successMessage}</div>}

            <div className="settings-card">
                <div className="setting-info">
                    <div className="setting-title-row">
                        <h3>AI Kill Switch</h3>
                        <span className={`status-badge ${isAiActive ? 'active' : 'disabled'}`}>
                            {isAiActive ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                    <p>
                        When disabled, the AI agent completely halts all workflow execution, stops answering chats, and yields no responses.
                    </p>
                </div>

                <div className="setting-action">
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={isAiActive} 
                            onChange={handleToggleChange} 
                            disabled={isLoading} 
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    );
}