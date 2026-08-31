import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('Pratham3407');

  const fetchRepositories = (targetUser = username) => {
    setLoading(true);
    setError(null);
    setRepos([]);

    // 3-second delay to guarantee the loading spinner is clearly noticeable (Practical 3)
    setTimeout(() => {
      fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=30`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`API Error (${res.status}): Failed to fetch repos for user '${targetUser}'`);
          }
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setRepos(data);
          } else {
            setRepos([]);
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch repository data.');
        })
        .finally(() => {
          setLoading(false);
        });
    }, 3000);
  };

  useEffect(() => {
    fetchRepositories('Pratham3407');
  }, []);

  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      fetchRepositories(username.trim());
    }
  };

  // Filter repositories based on search input
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Control bar for searching GitHub users & filtering repos */}
      <div className="controls-section">
        <form onSubmit={handleUserSearchSubmit} className="user-form">
          <label htmlFor="user-input">GitHub Username:</label>
          <input
            id="user-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            placeholder="e.g. octocat"
          />
          <button type="submit" className="btn btn-primary">Fetch Repos</button>
        </form>

        <div className="filter-box">
          <label htmlFor="search-input">Filter Repositories:</label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            placeholder="Search by repo name..."
          />
        </div>


      </div>

      {/* 1. Loading State */}
      {loading && <Spinner message={`Fetching repositories for ${username}...`} />}

      {/* 2. Error State */}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchRepositories(username)}
        />
      )}

      {/* 3. Success State - Repo List */}
      {!loading && !error && (
        <>
          <div className="summary-bar">
            <strong>Showing {filteredRepos.length} of {repos.length} repositories for '{username}'</strong>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="empty-box">
              <p>No repositories match your filter term <code>"{searchTerm}"</code>.</p>
            </div>
          ) : (
            <div className="repo-grid">
              {filteredRepos.map((repo) => (
                <div key={repo.id} className="repo-card">
                  <div className="repo-header">
                    <h3 className="repo-title">{repo.name}</h3>
                    <span className="star-tag">⭐ {repo.stargazers_count} stars</span>
                  </div>

                  <p className="repo-description">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="repo-meta-bar">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {repo.language && <span className="badge">{repo.language}</span>}
                      <span className="badge">🍴 {repo.forks_count} forks</span>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-url"
                    >
                      View on GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
