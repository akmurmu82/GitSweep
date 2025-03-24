import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setAccessToken(token);
      localStorage.setItem("github_token", token); // Save token for future use
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/repos", { withCredentials: true })
      .then((res) => setRepos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteSelectedRepos = () => {
    const selectedRepos = [...document.querySelectorAll("input[type=checkbox]:checked")]
      .map((checkbox) => checkbox.value);

    if (selectedRepos.length === 0) {
      alert("Select at least one repo to delete!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRepos.length} repos?`)) {
      return;
    }

    selectedRepos.forEach((repoFullName) => {
      fetch(`https://api.github.com/repos/${repoFullName}`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${accessToken || localStorage.getItem("github_token")}`,
          Accept: "application/vnd.github+json",
        },
      })
        .then((res) => {
          if (res.ok) {
            alert(`Deleted: ${repoFullName}`);
            setRepos(repos.filter((repo) => repo.full_name !== repoFullName));
          } else {
            alert(`Failed to delete: ${repoFullName}`);
          }
        })
        .catch((err) => console.error("Error deleting repo", err));
    });
  };

  // =========

  const loginWithGitHub = () => {
    window.open("http://localhost:5000/auth/github", "_self");
  };



  return (
    <div>
      <h1>GitHub Repo Cleanup</h1>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
      <ul>
        {repos?.map((repo) => (
          <li key={repo.id}><input type="checkbox" value={repo.full_name} />
            {repo.name}
          </li>
        ))}
      </ul>
      <button onClick={deleteSelectedRepos}>Delete Selected</button>
    </div>
  );
}

export default App;
