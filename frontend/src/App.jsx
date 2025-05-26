import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import RepoCard from "./components/RepoCard";
import { deleteSelectedRepos } from "./utils/deleteSelectedRepos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "./redux/features/slices/repoSlice";
import RepoCardSkeleton from "./components/RepoCardSkeleton";

function App() {
  const dispatch = useDispatch();
  const { filteredList, status } = useSelector((state) => state.repos);

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user info on initial load
  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/user", { withCredentials: true })
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUser(res.data.user);
          setAccessToken("valid"); // Token exists server-side
        }
      })
      .catch((err) => console.log("❌ User fetch failed:", err))
      .finally(() => setUserLoading(false));
  }, []);

  // Fetch repos once user is authenticated
  useEffect(() => {
    if (accessToken && !userLoading) {
      console.log("🔑 User verified, fetching repos...");
      dispatch(fetchRepos());
    }
  }, [dispatch, accessToken, userLoading]);

  const handleDelete = (repoFullName) => {
    deleteSelectedRepos(repoFullName, dispatch);
  };

  // Filtered list based on type and search input
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
        <h2 className="text-xl font-bold mb-4">
          Your personal assistant for GitHub repo management
        </h2>

        {/* Filter Buttons & Search Bar */}
        <div className="flex flex-col mb-6 align-center">
          <div className="flex gap-2 align-center mb-1">
            {["All", "Private", "Forked", "Public"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded text-sm font-semibold px-4 py-2 transition ${filter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
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
          {userLoading ? (
            <p>Loading user info...</p>
          ) : status === "loading" ? (
            Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} />)
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
