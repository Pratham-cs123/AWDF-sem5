// RepoList.jsx

function RepoList({ repos }) {
  return (
    <div>
      <h2>GitHub Repositories</h2>

      {repos.map((repo) => (
        <div
          key={repo.id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{repo.name}</h3>

          <p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {repo.html_url}
            </a>
          </p>

          <p>⭐ Stars: {repo.stargazers_count}</p>
        </div>
      ))}
    </div>
  );
}

export default RepoList;