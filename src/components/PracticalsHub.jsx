import React, { useState } from 'react';
import { 
  Shield, 
  Layers, 
  Zap, 
  Clock, 
  Server, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Copy, 
  RefreshCw,
  Terminal,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function PracticalsHub() {
  const [activeTab, setActiveTab] = useState('pr10');

  // Practical 7: Auth Simulator State
  const [authEmail, setAuthEmail] = useState('pratham@charusat.edu.in');
  const [authPassword, setAuthPassword] = useState('Admin@123');
  const [jwtToken, setJwtToken] = useState('');
  const [authStatus, setAuthStatus] = useState('Unauthenticated');
  const [authResponse, setAuthResponse] = useState(null);

  // Practical 8: HATEOAS Simulator State
  const [hateoasTask, setHateoasTask] = useState({
    id: 1,
    title: 'Study Richardson Maturity Model',
    completed: false,
    links: {
      self: { href: 'http://localhost:5002/tasks/1', method: 'GET' },
      complete: { href: 'http://localhost:5002/tasks/1/complete', method: 'PATCH' },
      delete: { href: 'http://localhost:5002/tasks/1', method: 'DELETE' },
      collection: { href: 'http://localhost:5002/tasks', method: 'GET' }
    }
  });

  // Practical 9: Caching Simulator State
  const [cacheStats, setCacheStats] = useState({ hits: 4, misses: 2 });
  const [cacheLogs, setCacheLogs] = useState([
    { id: 1, type: 'MISS', latency: '28.4 ms', note: 'Fetched from MongoDB, saved to in-memory cache' },
    { id: 2, type: 'HIT', latency: '0.8 ms', note: 'Served from Node.js V8 process memory' }
  ]);

  // Practical 10: Event-Driven Async State
  const [taskTitle, setTaskTitle] = useState('Build Docker containerization pipeline');
  const [eventLogs, setEventLogs] = useState([
    {
      step: 1,
      type: 'API Response',
      time: '15:50:02.533Z',
      latency: '3.2 ms',
      msg: 'HTTP 201 Created sent to client immediately'
    },
    {
      step: 2,
      type: 'Background Worker',
      time: '15:50:04.047Z',
      latency: '+1514 ms',
      msg: 'Notification delivered via listeners.js (Non-blocking)'
    }
  ]);
  const [isEmitting, setIsEmitting] = useState(false);

  // Practical 12: CI/CD Pipeline Simulator State
  const [ciStatus, setCiStatus] = useState('idle'); // 'idle' | 'running' | 'passed' | 'failed'
  const [ciLogs, setCiLogs] = useState([]);

  // Practical 13: AI Generator State
  const [aiTitle, setAiTitle] = useState('Secure password reset token expiry flow');
  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProvider, setAiProvider] = useState('');
  const [aiFallback, setAiFallback] = useState(false);
  const [copied, setCopied] = useState('');

  // Handlers
  const handleAuthLogin = () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByYXRoYW0iLCJpYXQiOjE1MTYyMzkwMjJ9.456xyz';
    setJwtToken(fakeToken);
    setAuthStatus('Authenticated (JWT Active)');
    setAuthResponse({
      status: 200,
      token: fakeToken,
      user: { name: 'Pratham Patel', email: authEmail, role: 'Student' }
    });
  };

  const handleTestProtected = (withToken) => {
    if (withToken && jwtToken) {
      setAuthResponse({
        status: 200,
        message: 'Protected tasks retrieved successfully using Bearer token verification.',
        tasks: [
          { id: 101, title: 'Complete Practical 07 Submission', isProtected: true },
          { id: 102, title: 'Verify JWT expiration middleware', isProtected: true }
        ]
      });
    } else {
      setAuthResponse({
        status: 401,
        error: 'Unauthorized: No Authorization header provided (or token invalid)'
      });
    }
  };

  const handleHateoasAction = (action) => {
    if (action === 'complete') {
      setHateoasTask(prev => ({
        ...prev,
        completed: true,
        links: {
          self: { href: 'http://localhost:5002/tasks/1', method: 'GET' },
          reopen: { href: 'http://localhost:5002/tasks/1/reopen', method: 'PATCH' },
          delete: { href: 'http://localhost:5002/tasks/1', method: 'DELETE' },
          collection: { href: 'http://localhost:5002/tasks', method: 'GET' }
        }
      }));
    } else if (action === 'reopen') {
      setHateoasTask(prev => ({
        ...prev,
        completed: false,
        links: {
          self: { href: 'http://localhost:5002/tasks/1', method: 'GET' },
          complete: { href: 'http://localhost:5002/tasks/1/complete', method: 'PATCH' },
          delete: { href: 'http://localhost:5002/tasks/1', method: 'DELETE' },
          collection: { href: 'http://localhost:5002/tasks', method: 'GET' }
        }
      }));
    }
  };

  const simulateCacheHit = () => {
    setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
    setCacheLogs(prev => [
      { id: Date.now(), type: 'HIT', latency: `${(Math.random() * 0.9 + 0.3).toFixed(1)} ms`, note: 'In-memory cache lookup. MongoDB bypassed!' },
      ...prev.slice(0, 4)
    ]);
  };

  const simulateCacheMiss = () => {
    setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    setCacheLogs(prev => [
      { id: Date.now(), type: 'MISS', latency: `${(Math.random() * 15 + 20).toFixed(1)} ms`, note: 'Queried MongoDB disk, populated new cache entry.' },
      ...prev.slice(0, 4)
    ]);
  };

  const triggerEventEmitter = () => {
    setIsEmitting(true);
    const apiNow = new Date().toISOString();
    const newEntry = {
      step: 1,
      type: 'API Response (Synchronous)',
      time: apiNow,
      latency: '2.8 ms',
      msg: `Task "${taskTitle.slice(0, 28)}..." created. HTTP 201 sent to client.`
    };
    setEventLogs([newEntry]);

    setTimeout(() => {
      const workerNow = new Date().toISOString();
      const workerEntry = {
        step: 2,
        type: 'Notification Listener (Asynchronous)',
        time: workerNow,
        latency: '+1500 ms (Non-blocking)',
        msg: `Task notification delivered via listeners.js event loop`
      };
      setEventLogs([newEntry, workerEntry]);
      setIsEmitting(false);
    }, 1500);
  };

  const runCiPipeline = (shouldPass) => {
    setCiStatus('running');
    setCiLogs(['[Workflow] Triggered on: push (branch: refs/heads/main)']);

    setTimeout(() => {
      setCiLogs(prev => [...prev, '  ✓ actions/checkout@v4 - Workspace code cloned']);
    }, 500);

    setTimeout(() => {
      setCiLogs(prev => [...prev, '  ✓ actions/setup-node@v4 - Node.js 18.x environment ready']);
    }, 1000);

    setTimeout(() => {
      setCiLogs(prev => [...prev, '  ✓ npm install - Dependencies resolved and locked']);
    }, 1500);

    setTimeout(() => {
      if (shouldPass) {
        setCiLogs(prev => [
          ...prev,
          '  ✓ npm test - Jest test suite passed (5/5 tests passing)',
          '🎉 Status: PASSED (Green checkmark). PR safe to merge!'
        ]);
        setCiStatus('passed');
      } else {
        setCiLogs(prev => [
          ...prev,
          '  ✗ npm test - Jest failure: Expected status 500, received 200 in tests/task.test.js:14',
          '❌ Status: FAILED (Red X). Pull request merge blocked!'
        ]);
        setCiStatus('failed');
      }
    }, 2200);
  };

  const generateAiDescription = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiDescription(
        `Architect and implement the '${aiTitle}' mechanism. Ensure end-to-end token encryption, configure 15-minute expiration lifespans, enforce single-use revocation upon redemption, and validate audit logs.`
      );
      setAiProvider('Local Heuristic Engine (Graceful Degradation)');
      setAiFallback(true);
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="practicals-hub">
      <div className="hub-hero">
        <div className="badge-row">
          <span className="hub-badge primary">ITUE301 — Advanced Web Development Frameworks</span>
          <span className="hub-badge secondary">CHARUSAT Lab Manual Practicals 7 to 13</span>
        </div>
        <h2>Interactive Practicals Hub & Architecture Showcase</h2>
        <p className="hero-desc">
          Test live simulators, examine architecture dataflows, view Postman specifications, and review viva conceptual questions for every single practical module.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-bar">
        <button className={activeTab === 'pr7' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr7')}>
          <Shield size={16} /> Pr 7: Auth & JWT
        </button>
        <button className={activeTab === 'pr8' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr8')}>
          <Layers size={16} /> Pr 8: HATEOAS
        </button>
        <button className={activeTab === 'pr9' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr9')}>
          <Zap size={16} /> Pr 9: Caching
        </button>
        <button className={activeTab === 'pr10' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr10')}>
          <Clock size={16} /> Pr 10: Event-Driven
        </button>
        <button className={activeTab === 'pr11' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr11')}>
          <Server size={16} /> Pr 11: Docker Stack
        </button>
        <button className={activeTab === 'pr12' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr12')}>
          <GitBranch size={16} /> Pr 12: CI/CD Pipeline
        </button>
        <button className={activeTab === 'pr13' ? 'tab-btn active' : 'tab-btn'} onClick={() => setActiveTab('pr13')}>
          <Sparkles size={16} /> Pr 13: AI Integration
        </button>
      </div>

      {/* Tab 7: JWT Authentication */}
      {activeTab === 'pr7' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 07: User Authentication & Route Protection</h3>
            <span className="port-tag">Backend Port: 5000</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Interactive Auth Simulator</h4>
              <p className="hint">Simulate registering, logging in, and testing protected route access with and without the Bearer token:</p>
              
              <div className="input-group">
                <label>Email Address</label>
                <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
              </div>

              <div className="btn-row">
                <button className="primary-btn" onClick={handleAuthLogin}>
                  <Lock size={14} /> POST /auth/login (Issue JWT)
                </button>
              </div>

              <div className="token-display">
                <strong>Current State:</strong> <span className={jwtToken ? 'success-text' : 'muted-text'}>{authStatus}</span>
                {jwtToken && (
                  <div className="token-box">
                    <code>{jwtToken}</code>
                  </div>
                )}
              </div>

              <div className="btn-row" style={{ marginTop: '12px' }}>
                <button className="secondary-btn" onClick={() => handleTestProtected(false)}>
                  Test Protected GET /tasks (No Token ➔ 401)
                </button>
                <button className="success-btn" onClick={() => handleTestProtected(true)} disabled={!jwtToken}>
                  Test Protected GET /tasks (With Token ➔ 200)
                </button>
              </div>

              {authResponse && (
                <div className="response-preview">
                  <div className="resp-head">
                    <span>HTTP Response: <strong>{authResponse.status}</strong></span>
                  </div>
                  <pre>{JSON.stringify(authResponse, null, 2)}</pre>
                </div>
              )}
            </div>

            <div className="card">
              <h4>How This Works & Viva Questions</h4>
              <div className="flow-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Password Hashing with bcrypt:</strong>
                  <p>Passwords are never stored in plaintext. They are salted and hashed via <code>bcrypt.hash(password, 10)</code> before persisting to MongoDB.</p>
                </div>
              </div>

              <div className="flow-step">
                <span className="step-num">2</span>
                <div>
                  <strong>JWT Token Issuance:</strong>
                  <p>On valid credentials, the server signs a payload containing <code>userId</code> with an HMAC secret using <code>jsonwebtoken</code>.</p>
                </div>
              </div>

              <div className="flow-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Authorization Middleware:</strong>
                  <p>Protected routes extract the <code>Authorization: Bearer &lt;token&gt;</code> header and verify its digital signature before calling <code>next()</code>.</p>
                </div>
              </div>

              <div className="postman-snippet">
                <div className="snippet-head">
                  <span>Postman cURL Command</span>
                  <button onClick={() => copyToClipboard('curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/tasks', 'pr7')}>
                    <Copy size={12} /> {copied === 'pr7' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code>curl -H "Authorization: Bearer &lt;TOKEN&gt;" http://localhost:5000/tasks</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: HATEOAS */}
      {activeTab === 'pr8' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 08: RESTful API with HATEOAS (Level 3 Maturity)</h3>
            <span className="port-tag">Backend Port: 5002</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Interactive Hypermedia Navigator</h4>
              <p className="hint">In HATEOAS, the client navigates via <code>_links</code> returned in responses. Notice how available actions dynamically change when the resource state changes:</p>

              <div className="hateoas-card">
                <div className="hateoas-state">
                  <h4>Task #{hateoasTask.id}: {hateoasTask.title}</h4>
                  <span className={hateoasTask.completed ? 'status-badge completed' : 'status-badge pending'}>
                    {hateoasTask.completed ? 'Status: Completed' : 'Status: Pending'}
                  </span>
                </div>

                <h5>Available Hypermedia Controls (_links):</h5>
                <div className="links-list">
                  {Object.entries(hateoasTask.links).map(([rel, val]) => (
                    <div key={rel} className="link-item">
                      <span className="rel-tag">{rel}</span>
                      <span className="method-tag">{val.method}</span>
                      <code className="href-text">{val.href}</code>
                      {rel === 'complete' && (
                        <button className="action-pill green" onClick={() => handleHateoasAction('complete')}>
                          Execute Action
                        </button>
                      )}
                      {rel === 'reopen' && (
                        <button className="action-pill yellow" onClick={() => handleHateoasAction('reopen')}>
                          Execute Action
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h4>Richardson Maturity Model</h4>
              <ul className="concept-list">
                <li><strong>Level 0 (The Swamp):</strong> Single URI, single HTTP POST method for everything.</li>
                <li><strong>Level 1 (Resources):</strong> Distinct URIs for individual resources (e.g. <code>/tasks/1</code>).</li>
                <li><strong>Level 2 (HTTP Verbs):</strong> Standard verbs (GET, POST, PUT, DELETE) + proper status codes.</li>
                <li><strong>Level 3 (HATEOAS):</strong> Hypermedia controls embedded in the representation. Clients discover all transitions dynamically.</li>
              </ul>

              <div className="postman-snippet">
                <div className="snippet-head">
                  <span>Discover Endpoints</span>
                  <button onClick={() => copyToClipboard('curl http://localhost:5002/', 'pr8')}>
                    <Copy size={12} /> {copied === 'pr8' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code>curl http://localhost:5002/</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Caching */}
      {activeTab === 'pr9' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 09: In-Memory Caching with node-cache</h3>
            <span className="port-tag">Backend Port: 5001</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Live Cache Hit vs Miss Visualizer</h4>
              <p className="hint">Simulate requests to compare latency between database queries and in-memory hits:</p>

              <div className="stats-counter-row">
                <div className="stat-box hit">
                  <span className="stat-label">Cache Hits</span>
                  <span className="stat-val">{cacheStats.hits}</span>
                  <span className="stat-sub">~0.8 ms (Memory)</span>
                </div>
                <div className="stat-box miss">
                  <span className="stat-label">Cache Misses</span>
                  <span className="stat-val">{cacheStats.misses}</span>
                  <span className="stat-sub">~25 ms (MongoDB Disk)</span>
                </div>
              </div>

              <div className="btn-row">
                <button className="success-btn" onClick={simulateCacheHit}>
                  Simulate Cached Request (Cache HIT)
                </button>
                <button className="secondary-btn" onClick={simulateCacheMiss}>
                  Simulate Fresh Request (Cache MISS)
                </button>
              </div>

              <h5 style={{ marginTop: '16px' }}>Request Latency Audit Log:</h5>
              <div className="log-list">
                {cacheLogs.map(log => (
                  <div key={log.id} className="log-item">
                    <span className={`log-badge ${log.type.toLowerCase()}`}>{log.type}</span>
                    <span className="latency-time">{log.latency}</span>
                    <span className="log-desc">{log.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4>Key Cache Invalidation Rule</h4>
              <p>Whenever a mutation occurs (<code>POST /tasks</code>, <code>PUT /tasks/:id</code>, <code>DELETE /tasks/:id</code>), the server calls:</p>
              <div className="token-box">
                <code>cache.del('all_tasks'); // Prevents stale read anomalies</code>
              </div>
              <p>On the subsequent <code>GET /tasks</code>, the system experiences a single <strong>MISS</strong>, repopulates with the latest data, and caches it for 60 seconds (TTL).</p>

              <div className="postman-snippet">
                <div className="snippet-head">
                  <span>Inspect Cache Stats</span>
                  <button onClick={() => copyToClipboard('curl http://localhost:5001/debug/cache-stats', 'pr9')}>
                    <Copy size={12} /> {copied === 'pr9' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code>curl http://localhost:5001/debug/cache-stats</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Event-Driven Async */}
      {activeTab === 'pr10' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 10: Asynchronous Processing with EventEmitter</h3>
            <span className="port-tag">Backend Port: 5003</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Live Timestamp Ordering Proof</h4>
              <p className="hint">Click "Trigger POST /tasks". Watch the API return immediately (~3ms) with a timestamp, while the notification listener finishes ~1500ms later in the background:</p>

              <div className="input-group">
                <label>Task Title</label>
                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              </div>

              <button className="primary-btn" onClick={triggerEventEmitter} disabled={isEmitting}>
                {isEmitting ? <RefreshCw className="spin" size={14} /> : <Play size={14} />} 
                {isEmitting ? 'Background Worker Processing (1.5s delay)...' : 'POST /tasks (Emit Event)'}
              </button>

              <div className="timeline-container">
                <h5>Execution Timeline Evidence:</h5>
                {eventLogs.map((log, idx) => (
                  <div key={idx} className="timeline-item">
                    <span className="timeline-step">{log.step}</span>
                    <div className="timeline-content">
                      <div className="tl-head">
                        <strong>{log.type}</strong>
                        <span className="time-badge">{log.time}</span>
                      </div>
                      <p>{log.msg}</p>
                      <span className="latency-badge">{log.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4>Faculty Lab Viva Answers</h4>
              <div className="flow-step">
                <span className="step-num">Q1</span>
                <div>
                  <strong>Why does emit() not block the response?</strong>
                  <p>In Node.js single-threaded event loop, <code>res.status(201).json()</code> flushes the HTTP socket synchronously. Any async operation (e.g. <code>setTimeout</code> or I/O) in the listener is queued in the event loop without stalling the main call stack.</p>
                </div>
              </div>

              <div className="flow-step">
                <span className="step-num">Q2</span>
                <div>
                  <strong>Why not write notifications inside POST route?</strong>
                  <p>If notification logic was inline, the HTTP client would freeze for 1.5–3 seconds. Decoupling with EventEmitter drops API latency to ~5ms.</p>
                </div>
              </div>

              <div className="postman-snippet">
                <div className="snippet-head">
                  <span>Create Task with Event Trigger</span>
                  <button onClick={() => copyToClipboard('curl -X POST -H "Content-Type: application/json" -d \'{"title":"Test"}\' http://localhost:5003/tasks', 'pr10')}>
                    <Copy size={12} /> {copied === 'pr10' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code>curl -X POST -H "Content-Type: application/json" -d '&#123;"title":"Test"&#125;' http://localhost:5003/tasks</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: Docker Containerization */}
      {activeTab === 'pr11' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 11: Containerization with Docker & Docker Compose</h3>
            <span className="port-tag">Stack Ports: 5173, 5000, 27017</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Docker Compose 3-Tier Architecture Map</h4>
              <div className="docker-stack-visual">
                <div className="docker-node frontend">
                  <div className="node-head">
                    <span className="node-icon">🌐</span>
                    <strong>task_frontend</strong>
                  </div>
                  <span className="port-badge">Port 5173:5173</span>
                  <p>Vite + React (Multi-stage build)</p>
                </div>

                <div className="arrow-down">
                  <ArrowRight size={18} /> app-network (Bridge)
                </div>

                <div className="docker-node backend">
                  <div className="node-head">
                    <span className="node-icon">⚡</span>
                    <strong>task_backend</strong>
                  </div>
                  <span className="port-badge">Port 5000:5000</span>
                  <p>Node.js 18 Express REST API</p>
                </div>

                <div className="arrow-down">
                  <ArrowRight size={18} /> mongodb://mongodb:27017/taskdb
                </div>

                <div className="docker-node db">
                  <div className="node-head">
                    <span className="node-icon">🗄️</span>
                    <strong>task_mongodb</strong>
                  </div>
                  <span className="port-badge">Port 27017:27017</span>
                  <p>Volume: mongodb_data:/data/db</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h4>Single-Command Verification</h4>
              <p>Run all 3 containers with a single terminal command:</p>
              <div className="token-box">
                <code>docker-compose up --build</code>
              </div>

              <h5>Check Running Containers:</h5>
              <div className="token-box">
                <code>docker ps</code>
              </div>

              <h5>Common Viva Question:</h5>
              <p><strong>Why use 'mongodb' instead of 'localhost' in MONGO_URI?</strong></p>
              <p className="hint">Each container has its own private loopback. Docker's embedded DNS automatically resolves the service name <code>mongodb</code> to the database container's IP on the bridge network.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 12: CI/CD Pipeline */}
      {activeTab === 'pr12' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 12: CI/CD Pipeline with GitHub Actions</h3>
            <span className="port-tag">Workflow: .github/workflows/ci.yml</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>Interactive GitHub Actions Pipeline Simulator</h4>
              <p className="hint">Simulate a commit push and observe automated Jest tests executing inside the virtual runner:</p>

              <div className="btn-row">
                <button className="success-btn" onClick={() => runCiPipeline(true)} disabled={ciStatus === 'running'}>
                  Trigger Push (Passing Test Suite ➔ Green ✓)
                </button>
                <button className="danger-btn" onClick={() => runCiPipeline(false)} disabled={ciStatus === 'running'}>
                  Trigger Push (Deliberate Failure ➔ Red ✗)
                </button>
              </div>

              <div className="terminal-window">
                <div className="terminal-header">
                  <Terminal size={14} /> GitHub Actions Runner (ubuntu-latest)
                  {ciStatus === 'passed' && <span className="ci-badge pass"><CheckCircle2 size={12} /> PASSED</span>}
                  {ciStatus === 'failed' && <span className="ci-badge fail"><XCircle size={12} /> FAILED</span>}
                </div>
                <div className="terminal-body">
                  {ciLogs.length === 0 ? (
                    <span className="muted-text">Click a button above to run the CI test pipeline...</span>
                  ) : (
                    ciLogs.map((line, idx) => (
                      <div key={idx} className={line.includes('✓') ? 'log-pass' : line.includes('✗') ? 'log-fail' : ''}>
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h4>Pipeline Configuration & Rubrics</h4>
              <p>The workflow file at <code>.github/workflows/ci.yml</code> defines the automated verification steps on every push:</p>
              <div className="token-box">
                <code>
                  - uses: actions/checkout@v4<br />
                  - uses: actions/setup-node@v4 (node: 18)<br />
                  - run: npm install<br />
                  - run: npm test
                </code>
              </div>
              <h5>Rubric Check:</h5>
              <p>The practical requires demonstrating both a failed build and a fixed passing build to receive full marks.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 13: AI API Integration */}
      {activeTab === 'pr13' && (
        <div className="tab-pane">
          <div className="pane-header">
            <h3>Practical 13: AI API Integration & Graceful Degradation</h3>
            <span className="port-tag">Backend Port: 5005</span>
          </div>

          <div className="grid-two">
            <div className="card">
              <h4>AI Task Description Generator</h4>
              <p className="hint">Type a task title and click "Generate Description with AI":</p>

              <div className="input-group">
                <label>Task Title</label>
                <input value={aiTitle} onChange={e => setAiTitle(e.target.value)} />
              </div>

              <button className="primary-btn" onClick={generateAiDescription} disabled={isGenerating}>
                {isGenerating ? <RefreshCw className="spin" size={14} /> : <Sparkles size={14} />}
                {isGenerating ? 'Querying AI Service...' : 'Generate Description with AI'}
              </button>

              {aiDescription && (
                <div className="ai-result-box">
                  <div className="ai-head">
                    <span className="provider-tag">{aiProvider}</span>
                    {aiFallback && <span className="fallback-tag">Graceful Fallback Active</span>}
                  </div>
                  <textarea 
                    value={aiDescription} 
                    onChange={e => setAiDescription(e.target.value)} 
                    rows={4}
                  />
                  <div className="ai-disclaimer">
                    ⚠️ <strong>Responsible AI Disclaimer:</strong> Content generated via AI is advisory and should be reviewed and edited before saving.
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h4>Architectural Security & Reliability</h4>
              <div className="flow-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Backend Proxy Pattern:</strong>
                  <p>The API key is stored exclusively in backend <code>.env</code>. Frontend never makes direct requests to OpenAI or Gemini, preventing key theft via browser DevTools.</p>
                </div>
              </div>

              <div className="flow-step">
                <span className="step-num">2</span>
                <div>
                  <strong>Graceful Degradation:</strong>
                  <p>If third-party API rates are exceeded or network goes offline, the backend catches the error and generates a structured fallback suggestion. The application never crashes!</p>
                </div>
              </div>

              <div className="postman-snippet">
                <div className="snippet-head">
                  <span>AI Generate Endpoint</span>
                  <button onClick={() => copyToClipboard('curl -X POST -H "Content-Type: application/json" -d \'{"title":"Login Bug"}\' http://localhost:5005/api/ai/generate-description', 'pr13')}>
                    <Copy size={12} /> {copied === 'pr13' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code>curl -X POST -H "Content-Type: application/json" -d '&#123;"title":"Login Bug"&#125;' http://localhost:5005/api/ai/generate-description</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
