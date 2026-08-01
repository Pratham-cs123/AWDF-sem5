import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ message = "Loading data from GitHub REST API..." }) {
  return (
    <div className="loader-wrapper">
      {/* Readymade CSS Spinner Loader */}
      <div className="custom-loader"></div>
      <p className="loader-message">
        <Loader2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px', animation: 'rotation 1s linear infinite' }} />
        {message}
      </p>
      <span className="loader-subtext"></span>
    </div>
  );
}
