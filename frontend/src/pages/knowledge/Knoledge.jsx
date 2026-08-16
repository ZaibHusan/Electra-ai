import React, { useState, useEffect } from 'react';
import { useKnowledge } from '../../hooks/useKnowledge';
import {
    FiDatabase,
    FiUploadCloud,
    FiFileText,
    FiTrash2,
    FiAlertCircle,
    FiCheckCircle,
    FiPlus,
    FiFile,
    FiLayers,
    FiX,
    FiLoader
} from 'react-icons/fi';
import './Knowledge.css';

const Knowledge = () => {
    const {
        sources,
        isLoading,
        error,
        successMessage,
        fetchSources,
        ingest,
        removeSource,
        clearAll,
        clearMessages
    } = useKnowledge();

    const [activeTab, setActiveTab] = useState('sources');
    const [inputType, setInputType] = useState('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Fetch sources on mount
    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    // Auto-dismiss success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                clearMessages();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, clearMessages]);

    const handleSubmitText = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        try {
            await ingest({ title: title.trim(), type: 'text', content: content.trim() });
            resetForm();
            setActiveTab('sources');
        } catch (error) {
            console.error('Failed to ingest text:', error);
        }
    };

    const handleSubmitPdf = async (e) => {
        e.preventDefault();
        if (!title.trim() || !file) return;

        // Validate file type and size
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please select a valid PDF file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('File size should be less than 10MB');
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('type', 'pdf');
        formData.append('file', file);

        try {
            await ingest(formData);
            resetForm();
            setActiveTab('sources');
        } catch (error) {
            console.error('Failed to upload PDF:', error);
        }
    };

    const handleClearAll = async () => {
        setShowClearConfirm(false);
        try {
            await clearAll();
            await fetchSources();
        } catch (error) {
            console.error('Failed to clear all:', error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setFile(null);
        const fileInput = document.getElementById('pdf-input');
        if (fileInput) fileInput.value = '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="knowledge-container">
            {/* Header */}
            <div className="knowledge-header">
                <div className="header-title">
                    <div className="header-icon">
                        <FiDatabase size={24} />
                    </div>
                    <div>
                        <h1>Knowledge Base</h1>
                        <p>Manage your AI's knowledge sources and vector embeddings</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className={`btn-tab ${activeTab === 'sources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sources')}
                    >
                        <FiLayers size={16} />
                        Sources ({sources?.length || 0})
                    </button>
                    <button
                        className={`btn-tab btn-primary ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        <FiPlus size={16} />
                        Add Knowledge
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-error">
                    <FiAlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={clearMessages} className="alert-close">
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success">
                    <FiCheckCircle size={18} />
                    <span>{successMessage}</span>
                    <button onClick={clearMessages} className="alert-close">
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="knowledge-content">
                {activeTab === 'sources' ? (
                    <div className="sources-section">
                        {sources?.length > 0 && (
                            <div className="sources-toolbar">
                                <h3>All Sources ({sources.length})</h3>
                                <button
                                    className="btn-danger"
                                    onClick={() => setShowClearConfirm(true)}
                                >
                                    <FiTrash2 size={16} />
                                    Clear All
                                </button>
                            </div>
                        )}

                        {isLoading && (!sources || sources.length === 0) ? (
                            <div className="state-loading">
                                <FiLoader className="spinner" size={32} />
                                <p>Loading sources...</p>
                            </div>
                        ) : !sources || sources.length === 0 ? (
                            <div className="state-empty">
                                <FiDatabase size={48} />
                                <h3>No Sources Yet</h3>
                                <p>Add text notes or upload PDFs to build your AI's knowledge base.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => setActiveTab('add')}
                                >
                                    <FiPlus size={16} />
                                    Add Your First Source
                                </button>
                            </div>
                        ) : (
                            <div className="sources-grid">
                                {sources.map((source) => (
                                    <div className="source-card" key={source._id || source.id}>
                                        <div className="source-card-header">
                                            <span className={`source-type type-${source.type}`}>
                                                {source.type === 'pdf' ? <FiFile size={14} /> : <FiFileText size={14} />}
                                                {source.type?.toUpperCase() || 'TEXT'}
                                            </span>
                                            <button
                                                className="btn-icon"
                                                onClick={() => removeSource(source._id || source.id)}
                                                title="Delete source"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                        <h4>{source.title}</h4>
                                        <p className="source-snippet">
                                            {source.content || 'Document processed and embedded in vector database'}
                                        </p>
                                        <div className="source-footer">
                                            <span>Updated: {formatDate(source.updatedAt || source.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="add-source-section">
                        <div className="form-container">
                            <h3>Add Knowledge Source</h3>

                            <div className="type-selector">
                                <button
                                    className={`type-btn ${inputType === 'text' ? 'active' : ''}`}
                                    onClick={() => setInputType('text')}
                                >
                                    <FiFileText size={16} />
                                    Text
                                </button>
                                <button
                                    className={`type-btn ${inputType === 'pdf' ? 'active' : ''}`}
                                    onClick={() => setInputType('pdf')}
                                >
                                    <FiFile size={16} />
                                    PDF Upload
                                </button>
                            </div>

                            {inputType === 'text' ? (
                                <form onSubmit={handleSubmitText} className="knowledge-form">
                                    <div className="form-group">
                                        <label htmlFor="text-title">Title</label>
                                        <input
                                            id="text-title"
                                            type="text"
                                            placeholder="Enter a descriptive title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={200}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="text-content">Content</label>
                                        <textarea
                                            id="text-content"
                                            rows="8"
                                            placeholder="Paste the knowledge content here..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={isLoading || !title.trim() || !content.trim()}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FiLoader className="spinner" size={16} />
                                                Processing...
                                            </>
                                        ) : (
                                            'Add to Knowledge Base'
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmitPdf} className="knowledge-form">
                                    <div className="form-group">
                                        <label htmlFor="pdf-title">Document Title</label>
                                        <input
                                            id="pdf-title"
                                            type="text"
                                            placeholder="Enter document title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={200}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>PDF File</label>
                                        <div className={`file-upload ${file ? 'has-file' : ''}`}>
                                            <input
                                                id="pdf-input"
                                                type="file"
                                                accept=".pdf,application/pdf"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                required
                                            />
                                            <div className="file-upload-content">
                                                {file ? (
                                                    <>
                                                        <FiFile size={24} />
                                                        <span className="file-name">{file.name}</span>
                                                        <span className="file-size">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiUploadCloud size={24} />
                                                        <span>Click to upload or drag and drop</span>
                                                        <span className="file-hint">PDF files only, max 10MB</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={isLoading || !title.trim() || !file}
                                    >
                                        {isLoading ? (
                                            <>
                                                <FiLoader className="spinner" size={16} />
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload & Process PDF'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Clear All Knowledge?</h3>
                        <p>This will permanently delete all sources and their vector embeddings. This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleClearAll}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Clearing...' : 'Yes, Clear Everything'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Knowledge;