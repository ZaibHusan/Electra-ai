import React, { useState, useEffect, useCallback } from 'react';
import { usePrompt } from '../../hooks/usePrompt';
import { 
    Bot, 
    Plus, 
    X, 
    Check, 
    AlertCircle, 
    CheckCircle,
    Save,
    Loader,
    Cpu,
    Thermometer,
    Shield,
    Sparkles,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Wand2
} from 'lucide-react';
import './Prompts.css';

export default function Prompts() {
    const { config, loading, error, successMessage, getPrompt, updatePrompt, resetMessages } = usePrompt();

    // Form local states
    const [systemPrompt, setSystemPrompt] = useState('');
    const [dosList, setDosList] = useState([]);
    const [newDo, setNewDo] = useState('');
    const [dontsList, setDontsList] = useState([]);
    const [newDont, setNewDont] = useState('');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1000);
    const [modelName, setModelName] = useState('gemini-1.5-pro');
    const [configName, setConfigName] = useState('Production AI Config');
    const [hasChanges, setHasChanges] = useState(false);
    const [showDoSection, setShowDoSection] = useState(true);
    const [showDontSection, setShowDontSection] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Fetch config on mount
    useEffect(() => {
        getPrompt();
    }, [getPrompt]);

    // Sync Redux state to local form states
    useEffect(() => {
        if (config) {
            setSystemPrompt(config.systemPrompt || '');
            setDosList(config.dos || []);
            setDontsList(config.donts || []);
            setTemperature(config.temperature ?? 0.7);
            setMaxTokens(config.maxTokens || 1000);
            setModelName(config.modelName || 'gemini-1.5-pro');
            setConfigName(config.configName || 'Production AI Config');
            setHasChanges(false);
        }
    }, [config]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => resetMessages(), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, resetMessages]);

    // Track changes
    useEffect(() => {
        if (config) {
            const changed = 
                systemPrompt !== config.systemPrompt ||
                JSON.stringify(dosList) !== JSON.stringify(config.dos) ||
                JSON.stringify(dontsList) !== JSON.stringify(config.donts) ||
                Number(temperature) !== Number(config.temperature) ||
                Number(maxTokens) !== Number(config.maxTokens) ||
                modelName !== config.modelName ||
                configName !== config.configName;
            setHasChanges(changed);
        }
    }, [systemPrompt, dosList, dontsList, temperature, maxTokens, modelName, configName, config]);

    // Add/Remove handlers
    const handleAddDo = useCallback(() => {
        if (!newDo.trim()) return;
        setDosList(prev => [...prev, newDo.trim()]);
        setNewDo('');
    }, [newDo]);

    const handleRemoveDo = useCallback((index) => {
        setDosList(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleAddDont = useCallback(() => {
        if (!newDont.trim()) return;
        setDontsList(prev => [...prev, newDont.trim()]);
        setNewDont('');
    }, [newDont]);

    const handleRemoveDont = useCallback((index) => {
        setDontsList(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Keyboard handlers
    const handleDoKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddDo();
        }
    };

    const handleDontKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddDont();
        }
    };

    // Reset form
    const handleReset = () => {
        if (config) {
            setSystemPrompt(config.systemPrompt || '');
            setDosList(config.dos || []);
            setDontsList(config.donts || []);
            setTemperature(config.temperature ?? 0.7);
            setMaxTokens(config.maxTokens || 1000);
            setModelName(config.modelName || 'gemini-1.5-pro');
            setConfigName(config.configName || 'Production AI Config');
            setHasChanges(false);
        }
    };

    // Save handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!systemPrompt.trim()) {
            alert('System prompt is required');
            return;
        }

        updatePrompt({
            configName: configName.trim() || 'Production AI Config',
            systemPrompt: systemPrompt.trim(),
            dos: dosList,
            donts: dontsList,
            temperature: Number(temperature),
            maxTokens: Number(maxTokens),
            modelName
        });
    };

    // Loading state
    if (loading && !config) {
        return (
            <div className="prompt-loading">
                <div className="loading-spinner">
                    <Bot size={32} />
                </div>
                <h3>Loading AI Configuration</h3>
                <p>Fetching your production settings...</p>
            </div>
        );
    }

    return (
        <div className="prompt-page">
            {/* Header */}
            <header className="prompt-header">
                <div className="header-left">
                    <div className="header-icon">
                        <Bot size={24} />
                    </div>
                    <div className="header-text">
                        <h1>AI Prompt Control</h1>
                        <p>Configure your sales agent's behavior and guardrails</p>
                    </div>
                </div>
                <div className="header-right">
                    <span className="status-badge">
                        <span className="status-dot"></span>
                        Live
                    </span>
                    {hasChanges && (
                        <button className="btn-reset" onClick={handleReset}>
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    )}
                </div>
            </header>

            {/* Alerts */}
            {successMessage && (
                <div className="alert alert-success">
                    <CheckCircle size={18} />
                    <span>{successMessage}</span>
                    <button onClick={resetMessages} className="alert-close">
                        <X size={16} />
                    </button>
                </div>
            )}
            
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={resetMessages} className="alert-close">
                        <X size={16} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="prompt-form">
                {/* System Prompt Card */}
                <div className="card card-main">
                    <div className="card-header">
                        <div className="card-title">
                            <Sparkles size={18} />
                            <h2>System Prompt</h2>
                        </div>
                        <span className="badge-required">Required</span>
                    </div>
                    <div className="card-body">
                        <p className="card-desc">
                            Define the core persona and behavior of your AI sales agent
                        </p>
                        <textarea
                            className="system-prompt-textarea"
                            rows="6"
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            placeholder="You are Electra, an elite AI Sales Expert..."
                        />
                        <div className="char-count">
                            {systemPrompt.length} characters
                        </div>
                    </div>
                </div>

                {/* Do's Card */}
                <div className="card">
                    <div className="card-header" onClick={() => setShowDoSection(!showDoSection)}>
                        <div className="card-title">
                            <Check size={18} className="icon-green" />
                            <h2>Mandatory Behaviors</h2>
                            <span className="count-badge">{dosList.length}</span>
                        </div>
                        <button type="button" className="collapse-btn">
                            {showDoSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                    
                    {showDoSection && (
                        <div className="card-body">
                            <p className="card-desc">Rules the AI must always follow</p>
                            <div className="rule-input-group">
                                <input
                                    type="text"
                                    value={newDo}
                                    onChange={(e) => setNewDo(e.target.value)}
                                    onKeyPress={handleDoKeyPress}
                                    placeholder="Add a behavior rule..."
                                    className="rule-input"
                                />
                                <button type="button" onClick={handleAddDo} className="btn-add">
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                            <div className="rule-list">
                                {dosList.length === 0 ? (
                                    <p className="empty-rules">No rules defined yet</p>
                                ) : (
                                    dosList.map((item, idx) => (
                                        <div key={idx} className="rule-item rule-do">
                                            <Check size={14} />
                                            <span>{item}</span>
                                            <button type="button" onClick={() => handleRemoveDo(idx)} className="rule-remove">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Don'ts Card */}
                <div className="card">
                    <div className="card-header" onClick={() => setShowDontSection(!showDontSection)}>
                        <div className="card-title">
                            <Shield size={18} className="icon-red" />
                            <h2>Strict Guardrails</h2>
                            <span className="count-badge">{dontsList.length}</span>
                        </div>
                        <button type="button" className="collapse-btn">
                            {showDontSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                    
                    {showDontSection && (
                        <div className="card-body">
                            <p className="card-desc">Behaviors strictly prohibited for the AI</p>
                            <div className="rule-input-group">
                                <input
                                    type="text"
                                    value={newDont}
                                    onChange={(e) => setNewDont(e.target.value)}
                                    onKeyPress={handleDontKeyPress}
                                    placeholder="Add a restriction..."
                                    className="rule-input"
                                />
                                <button type="button" onClick={handleAddDont} className="btn-add btn-add-danger">
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                            <div className="rule-list">
                                {dontsList.length === 0 ? (
                                    <p className="empty-rules">No guardrails defined yet</p>
                                ) : (
                                    dontsList.map((item, idx) => (
                                        <div key={idx} className="rule-item rule-dont">
                                            <X size={14} />
                                            <span>{item}</span>
                                            <button type="button" onClick={() => handleRemoveDont(idx)} className="rule-remove">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Advanced Settings Card */}
                <div className="card">
                    <div className="card-header" onClick={() => setShowAdvanced(!showAdvanced)}>
                        <div className="card-title">
                            <Cpu size={18} />
                            <h2>Model Configuration</h2>
                        </div>
                        <button type="button" className="collapse-btn">
                            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                    
                    {showAdvanced && (
                        <div className="card-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Config Name</label>
                                    <input
                                        type="text"
                                        value={configName}
                                        onChange={(e) => setConfigName(e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Model</label>
                                    <select 
                                        value={modelName} 
                                        onChange={(e) => setModelName(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                    </select>
                                </div>

                                <div className="form-group form-group-full">
                                    <div className="label-row">
                                        <label className="form-label">
                                            <Thermometer size={14} />
                                            Temperature
                                        </label>
                                        <span className="value-badge">{temperature}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(e.target.value)}
                                        className="range-input"
                                    />
                                    <div className="range-labels">
                                        <span>Precise</span>
                                        <span>Balanced</span>
                                        <span>Creative</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Max Tokens</label>
                                    <input
                                        type="number"
                                        value={maxTokens}
                                        onChange={(e) => setMaxTokens(e.target.value)}
                                        min="100"
                                        max="8192"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="save-section">
                    <button 
                        type="submit" 
                        disabled={loading || !hasChanges}
                        className={`btn-save ${hasChanges ? 'active' : ''}`}
                    >
                        {loading ? (
                            <>
                                <Loader size={18} className="spin" />
                                Deploying...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save & Deploy Changes
                            </>
                        )}
                    </button>
                    {hasChanges && (
                        <p className="unsaved-text">You have unsaved changes</p>
                    )}
                </div>
            </form>
        </div>
    );
}