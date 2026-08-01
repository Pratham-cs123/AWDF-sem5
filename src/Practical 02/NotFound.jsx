import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <h2>404 - Page Not Found</h2>
      <p className="page-desc" style={{ margin: '14px 0 20px' }}>
        The route path you entered does not exist in this React Router configuration.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
        ← Back to Homepage
      </Link>
    </div>
  );
}
