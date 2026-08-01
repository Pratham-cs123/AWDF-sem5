import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const MAX_CHAR_LIMIT = 200;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmittedData({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmittedData(null);
  };

  return (
    <div className="page-container">
      <h2>Practical 2: Controlled Form & State Management</h2>
      <p className="page-desc">Using React <code>useState</code> to manage form state, real-time input preview, and live character limit.</p>

      <div className="contact-layout">
        <form onSubmit={handleSubmit} className="card">
          <h3>Contact Form</h3>

          <div className="form-group">
            <label htmlFor="name-input">Full Name:</label>
            <input 
              id="name-input"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter full name..."
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email Address:</label>
            <input 
              id="email-input"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter email address..."
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject-input">Subject:</label>
            <input 
              id="subject-input"
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Enter subject..."
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message-input">Message:</label>
            <textarea 
              id="message-input"
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              maxLength={MAX_CHAR_LIMIT}
              placeholder="Type message here..."
              className="form-control textarea-control"
              required
            />
            {/* Live Character Count (Practical 2 Supplementary) */}
            <div className="char-counter">
              {message.length} / {MAX_CHAR_LIMIT} characters
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="submit" className="btn btn-primary">Submit Form</button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">Reset</button>
          </div>
        </form>

        {/* Real-time State Preview Card */}
        <div className="preview-box">
          <h3>Real-time State Preview</h3>
          <p className="page-desc" style={{ marginBottom: '14px' }}>
            Input values update React component state instantly on keypress without page reloads.
          </p>

          <div className="preview-item">
            <strong>Name:</strong> {name || <em>(empty)</em>}
          </div>

          <div className="preview-item">
            <strong>Email:</strong> {email || <em>(empty)</em>}
          </div>

          <div className="preview-item">
            <strong>Subject:</strong> {subject || <em>(empty)</em>}
          </div>

          <div className="preview-item">
            <strong>Message Live Display:</strong>
            <p style={{ marginTop: '4px', fontStyle: message ? 'normal' : 'italic' }}>
              {message || '(Type above to see message here in real-time)'}
            </p>
          </div>

          {submittedData && (
            <div className="success-alert">
              ✅ <strong>Form Submitted!</strong> Recorded at {submittedData.timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
