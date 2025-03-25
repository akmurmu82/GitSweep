import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import RepoCard from "./components/RepoCard";
import { deleteSelectedRepos } from "./utils/deleteSelectedRepos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "./redux/features/slices/repoSlice";

function App() {
  const dispatch = useDispatch();
  const { filteredList, status } = useSelector((state) => state.repos);
  const [accessToken, setAccessToken] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchRepos());
  }, [dispatch]);

  const handleDelete = (repoFullName) => {
    deleteSelectedRepos(repoFullName, dispatch);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  // Filtering repositories based on selection
  const filteredRepos = filteredList.filter((repo) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Private" && repo.private) ||
      (filter === "Forked" && repo.fork) ||
      (filter === "Public" && !repo.private && !repo.fork);

    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 mt-20">
        <h2 className="text-xl font-bold mb-4">Your personal assistant for GitHub repo management</h2>

        {/* Filter Buttons & Search Bar */}
        <div className="flex gap-3 mb-6 align-center">
          {["All", "Private", "Forked", "Public"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded text-sm font-semibold transition ${filter === type ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
            >
              {type}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border rounded bg-gray-300 text-black hover:bg-gray-400"
          />
        </div>

        {/* Repository Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {status === "loading" ? (
            <p>Loading repositories...</p>
          ) : filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} handleDelete={handleDelete} />
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
