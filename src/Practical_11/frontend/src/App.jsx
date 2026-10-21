import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStatus();
    fetchTasks();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      const data = await res.json();
      setBackendStatus(`Connected (${data.database})`);
    } catch (e) {
      setBackendStatus('Backend unreachable');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (e) {
      alert('Error saving task');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <span className="badge">🐳 Practical 11 Containerized Stack</span>
        <h1>Docker & Docker Compose Orchestration</h1>
        <p className="status-bar">
          <strong>Backend Status:</strong> <span className="status-tag">{backendStatus}</span>
          <span className="network-tag">Network: app-network (bridge)</span>
        </p>
      </header>

      <section className="form-card">
        <h3>Create Task via Containerized REST API</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Task Title (e.g. Verify Docker volumes)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </section>

      <section className="list-card">
        <div className="list-header">
          <h3>Current Tasks in Containerized Database</h3>
          <button onClick={fetchTasks} className="refresh-btn">🔄 Refresh</button>
        </div>

        {loading ? (
          <p className="loading">Loading tasks from Docker backend...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks found. Create one above!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t._id || t.id} className="task-item">
                <div>
                  <strong>{t.title}</strong>
                  {t.description && <p>{t.description}</p>}
                </div>
                <span className={t.completed ? 'completed-badge' : 'pending-badge'}>
                  {t.completed ? 'Done' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
