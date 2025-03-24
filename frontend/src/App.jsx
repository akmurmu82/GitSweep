import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function App() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/repos", { withCredentials: true })
      .then((res) => setRepos(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Your GitHub Repositories</h2>
        <ul className="space-y-2">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <li key={repo.id} className="bg-gray-100 p-2 rounded flex justify-between">
                <span>{repo.name}</span>
                <input type="checkbox" value={repo.full_name} />
              </li>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
