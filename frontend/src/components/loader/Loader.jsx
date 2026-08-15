import React from 'react';
import { Zap } from 'lucide-react';
import './Loader.css';

export default function Loader({ status = "Initializing environment" }) {
  return (
    <div className="electra-loader-container">
      {/* The Core Animation */}
      <div className="electra-core-wrapper">
        <div className="electra-halo"></div>
        <div className="electra-orbit-ring"></div>
        <div className="electra-accent-ring"></div>
        <div className="electra-core">
          <Zap size={24} className="electra-zap-icon" strokeWidth={2.2} />
        </div>
      </div>

      {/* Brand & Status Text */}
      <div className="electra-loader-text">
        <h2 className="electra-brand-name">
          Electra<span> AI</span>
        </h2>
        <div className="electra-system-status">
          <div className="electra-status-chip">
            <span className="electra-status-dot"></span>
            {status}
          </div>
          <span className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
}