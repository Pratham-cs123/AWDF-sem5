import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/tasks";

function App() {
    const [activePractical, setActivePractical] = useState("p6");
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [apiConnected, setApiConnected] = useState(false);

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 3000);
    };

    const serverDownMessage =
        "Unable to connect to the server. Make sure the Express backend is running on localhost:5000.";

    const formatError = (err) => {
        const msg = err.message || "";
        if (/failed to fetch|networkerror|typeerror|status code 50|502|503|504|connection refused|socket hang up/i.test(msg)) {
            return serverDownMessage;
        }
        return msg || "Something went wrong.";
    };

    const isServerDown = (res) =>
        res.status === 502 || res.status === 503 || res.status === 504;

    const requestJson = async (url, options) => {
        let res;
        try {
            res = await fetch(url, options);
        } catch (err) {
            throw new Error(serverDownMessage);
        }
        if (isServerDown(res)) {
            throw new Error(serverDownMessage);
        }
        if (!res.ok) {
            const data = await res.json().catch(() => null);
            if (data && data.errors) {
                throw new Error((data.errors && data.errors.title) || data.message || "Validation failed");
            }
            if (data && data.message) {
                const e = new Error(data.message);
                e.status = res.status;
                if (res.status === 404) {
                    e.statusText = "Task not found";
                }
                throw e;
            }
            throw new Error("Something went wrong.");
        }
        return res;
    };

    const fetchTasks = async () => {
        try {
            setIsFetching(true);
            setError("");
            const res = await requestJson(API_URL);
            const data = await res.json();
            setTasks(data);
            setApiConnected(true);
        } catch (err) {
            setApiConnected(false);
            setError(formatError(err));
        } finally {
            setIsFetching(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Please enter a task title.");
            return;
        }

        const tempId = "temp-" + Date.now();
        const tempTask = {
            _id: tempId,
            title: title.trim(),
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTasks((prev) => [...prev, tempTask]);
        const savedTitle = title.trim();
        const savedDescription = description.trim();
        setTitle("");
        setDescription("");

        try {
            setIsAdding(true);
            setError("");
            const res = await requestJson(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: savedTitle,
                    description: savedDescription,
                    completed: false
                })
            });

            const data = await res.json();
            setTasks((prev) =>
                prev.map((t) => (t._id === tempId ? data.task : t))
            );
            showMessage("Task created successfully");
        } catch (err) {
            setTasks((prev) => prev.filter((t) => t._id !== tempId));
            setError(formatError(err));
        } finally {
            setIsAdding(false);
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setShowEditModal(true);
        setError("");
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingTask(null);
    };

    const saveTask = async (e) => {
        e.preventDefault();
        if (!editingTask) return;
        if (!editTitle.trim()) {
            setError("Please enter a task title.");
            return;
        }

        try {
            setIsSaving(true);
            setError("");
            const res = await requestJson(`${API_URL}/${editingTask._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    completed: editingTask.completed
                })
            });

            const data = await res.json();
            setTasks((prev) =>
                prev.map((t) => (t._id === editingTask._id ? data.task : t))
            );
            showMessage("Task updated successfully");
            closeEditModal();
        } catch (err) {
            setError(formatError(err));
        } finally {
            setIsSaving(false);
        }
    };

    const toggleComplete = async (task) => {
        setTasks((prev) =>
            prev.map((t) =>
                t._id === task._id ? { ...t, completed: !t.completed } : t
            )
        );

        try {
            const res = await requestJson(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    completed: !task.completed
                })
            });

            const data = await res.json();
            setTasks((prev) =>
                prev.map((t) => (t._id === task._id ? data.task : t))
            );
        } catch (err) {
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === task._id ? { ...t, completed: task.completed } : t
                )
            );
            setError(formatError(err));
        }
    };

    const openDeleteDialog = (task) => {
        setDeleteTarget(task);
        setShowDeleteDialog(true);
        setError("");
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setDeleteTarget(null);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        const id = deleteTarget._id;
        closeDeleteDialog();

        try {
            setIsDeleting(true);
            setError("");
            await requestJson(`${API_URL}/${id}`, { method: "DELETE" });
            setTasks((prev) => prev.filter((t) => t._id !== id));
            showMessage("Task deleted successfully");
        } catch (err) {
            setError(formatError(err));
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const day = date.getDate();
            const year = date.getFullYear();
            const time = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });
            return `Created ${month} ${day}, ${year} · ${time}`;
        } catch {
            return "";
        }
    };

    const subtitles = {
        p4: { title: "Task Manager — REST API", sub: "Express CRUD & Middleware" },
        p5: { title: "Task Manager — MongoDB", sub: "Mongoose & Persistent Storage" },
        p6: { title: "Task Manager — Full Stack", sub: "React + Express + MongoDB" }
    };

    const current = subtitles[activePractical];

    return (
        <div className="app">
            <header className="header">
                <div className="header-inner">
                    <div className="header-left">
                        <h1 className="app-title">Task Manager</h1>
                        <span className={"conn-status " + (apiConnected ? "connected" : "disconnected")}>
                            <span className="conn-dot" />
                            API {apiConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>

                <div className="header-inner">
                    <nav className="tabs">
                        <button
                            className={"tab " + (activePractical === "p4" ? "active" : "")}
                            onClick={() => setActivePractical("p4")}
                        >
                            <span className="tab-num">P4</span>
                            <span className="tab-label">REST API</span>
                        </button>
                        <button
                            className={"tab " + (activePractical === "p5" ? "active" : "")}
                            onClick={() => setActivePractical("p5")}
                        >
                            <span className="tab-num">P5</span>
                            <span className="tab-label">MongoDB</span>
                        </button>
                        <button
                            className={"tab " + (activePractical === "p6" ? "active" : "")}
                            onClick={() => setActivePractical("p6")}
                        >
                            <span className="tab-num">P6</span>
                            <span className="tab-label">Full Stack</span>
                        </button>
                    </nav>
                </div>

                <div className="header-subtitle">
                    <span className="subtitle-title">{current.title}</span>
                    <span className="subtitle-sep">—</span>
                    <span className="subtitle-sub">{current.sub}</span>
                </div>
            </header>

            <main className="main">
                <div className="progression">
                    <span className={"prog-step " + (activePractical === "p4" ? "active" : "done")}>
                        P4 REST API
                    </span>
                    <span className="prog-arrow">→</span>
                    <span className={"prog-step " + (activePractical === "p5" ? "active" : activePractical === "p6" ? "done" : "")}>
                        P5 MongoDB
                    </span>
                    <span className="prog-arrow">→</span>
                    <span className={"prog-step " + (activePractical === "p6" ? "active" : "")}>
                        P6 Full Stack
                    </span>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-msg">{error}</span>
                        <button className="btn-retry" onClick={fetchTasks}>
                            Try again
                        </button>
                        <button className="alert-close" onClick={() => setError("")} aria-label="Dismiss">
                            ×
                        </button>
                    </div>
                )}

                {message && (
                    <div className="alert alert-success">
                        <span>✓</span>
                        <span>{message}</span>
                    </div>
                )}

                {activePractical === "p4" && <Practical4View />}
                {activePractical === "p5" && <Practical5View apiConnected={apiConnected} />}
                {activePractical === "p6" && <Practical6View />}

                <section className="section">
                    <h2 className="section-title">Add a task</h2>
                    <form className="task-form" onSubmit={addTask}>
                        <div className="form-row">
                            <div className="field">
                                <label className="field-label" htmlFor="task-title">Task title</label>
                                <input
                                    id="task-title"
                                    type="text"
                                    className="field-input"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isAdding}
                                />
                            </div>
                            <div className="field">
                                <label className="field-label" htmlFor="task-desc">Description</label>
                                <textarea
                                    id="task-desc"
                                    className="field-input field-textarea"
                                    rows="2"
                                    placeholder="Optional details"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isAdding}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={isAdding || !title.trim()}>
                                {isAdding ? "Adding…" : "Add Task"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">Tasks</h2>
                        <span className="task-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
                    </div>

                    {isFetching && tasks.length === 0 ? (
                        <div className="empty">
                            <div className="spinner" />
                            <p>Loading tasks…</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty">
                            <p className="empty-title">No tasks yet</p>
                            <p className="empty-text">Create your first task to get started.</p>
                        </div>
                    ) : (
                        <ul className="task-list">
                            {tasks.map((task) => (
                                <li key={task._id} className={"task-item " + (task.completed ? "completed" : "")}>
                                    <button
                                        className="task-check"
                                        onClick={() => toggleComplete(task)}
                                        aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </button>
                                    <div className="task-body">
                                        <span className="task-title">{task.title}</span>
                                        {task.description && <span className="task-desc">{task.description}</span>}
                                        <span className="task-meta">
                                            <span className={"task-status " + (task.completed ? "done" : "pending")}>
                                                {task.completed ? "Completed" : "Pending"}
                                            </span>
                                            <span className="task-date">{formatDate(task.createdAt)}</span>
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <button className="btn-action edit" onClick={() => openEditModal(task)} aria-label="Edit task">
                                            Edit
                                        </button>
                                        <button className="btn-action delete" onClick={() => openDeleteDialog(task)} aria-label="Delete task" disabled={isDeleting}>
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <footer className="footer">
                    Task Manager — Practical 4, 5 & 6
                </footer>
            </main>

            {showEditModal && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit task</h3>
                            <button className="modal-close" onClick={closeEditModal} aria-label="Close">×</button>
                        </div>
                        <form onSubmit={saveTask}>
                            <div className="field">
                                <label className="field-label" htmlFor="edit-title">Title</label>
                                <input
                                    id="edit-title"
                                    type="text"
                                    className="field-input"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label className="field-label" htmlFor="edit-desc">Description</label>
                                <textarea
                                    id="edit-desc"
                                    className="field-input field-textarea"
                                    rows="3"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSaving || !editTitle.trim()}>
                                    {isSaving ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteDialog && (
                <div className="modal-overlay" onClick={closeDeleteDialog}>
                    <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete task</h3>
                        </div>
                        <p className="modal-body">This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-secondary" onClick={closeDeleteDialog}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                                {isDeleting ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Practical4View() {
    return (
        <section className="section">
            <div className="arch-card">
                <h3 className="arch-title">Architecture</h3>
                <div className="arch-flow">
                    <div className="arch-node">Client</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Express</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Routes</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node highlight">In-Memory Tasks</div>
                </div>
            </div>

            <div className="arch-card">
                <h3 className="arch-title">Endpoints</h3>
                <div className="endpoint-list">
                    <div className="endpoint">
                        <span className="method get">GET</span>
                        <code>/tasks</code>
                    </div>
                    <div className="endpoint">
                        <span className="method post">POST</span>
                        <code>/tasks</code>
                    </div>
                    <div className="endpoint">
                        <span className="method put">PUT</span>
                        <code>/tasks/:id</code>
                    </div>
                    <div className="endpoint">
                        <span className="method delete">DELETE</span>
                        <code>/tasks/:id</code>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Practical5View({ apiConnected }) {
    return (
        <section className="section">
            <div className="arch-card">
                <h3 className="arch-title">Architecture</h3>
                <div className="arch-flow">
                    <div className="arch-node">Express</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Routes</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Mongoose</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node highlight">MongoDB</div>
                </div>
            </div>

            <div className="arch-card">
                <h3 className="arch-title">Database</h3>
                <div className="info-grid">
                    <div className="info-row">
                        <span className="info-label">Status</span>
                        <span className={"conn-status " + (apiConnected ? "connected" : "disconnected")}>
                            <span className="conn-dot" />
                            {apiConnected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Database</span>
                        <span className="info-value">taskdb</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Collection</span>
                        <span className="info-value">tasks</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Model</span>
                        <span className="info-value">Task</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Fields</span>
                        <span className="info-value">title, description, completed, createdAt</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Practical6View() {
    return (
        <section className="section">
            <div className="arch-card">
                <h3 className="arch-title">Architecture</h3>
                <div className="arch-flow">
                    <div className="arch-node">React</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">REST API</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Express</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node">Mongoose</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node highlight">MongoDB</div>
                </div>
            </div>
        </section>
    );
}

export default App;
