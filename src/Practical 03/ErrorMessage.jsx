import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card">
      <h3>
        <AlertTriangle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
        Error Fetching API Data
      </h3>
      <p>{message || "Failed to retrieve repository data."}</p>
      {onRetry && (
        <div>
          <button className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Retry Fetch
          </button>
        </div>
      )}
    </div>
  );
}
