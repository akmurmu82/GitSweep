import { useState, useEffect } from "react";
import api from "./utils/api";
import Navbar from "./Navbar";
import RepoCard from "./components/RepoCard";
import RepoModal from "./components/RepoModal";
import FilterBar from "./components/FilterBar";
import { deleteSelectedRepos } from "./utils/deleteSelectedRepos";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "./redux/features/slices/repoSlice";
import RepoCardSkeleton from "./components/RepoCardSkeleton";
import { AlertTriangle, Github } from "lucide-react";
import AuthCallback from "./components/AuthCallback";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

function App() {
  const dispatch = useDispatch();
  const { filteredList, status, error } = useSelector((state) => state.repos);

  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle auth callback
  console.log("Checkig pathame")
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  // Fetch user info on initial load
  useEffect(() => {
    // Check if we have a token in localStorage first
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      console.log('🔑 Found stored token and user, using localStorage');
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
      setUserLoading(false);
      return;
    }

    console.log("🔍 Fetching user authentication status...");
    console.log("🔍 Backend URL:", backendUrl);
    console.log("🔍 Current origin:", window.location.origin);

    api
      .get('/auth/user')
      .then((res) => {
        console.log("✅ Authentication check successful:", res.data);
        if (res.data.isLoggedIn) {
          console.log('💾 Storing user data in localStorage');
          setUser(res.data.user);
          setAccessToken(localStorage.getItem('accessToken') || "valid");
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          console.log("ℹ️ User not authenticated");
        }
      })
      .catch((err) => {
        console.error("❌ Authentication check failed:", err);
        console.error("❌ Error response:", err.response?.data);
        if (err.response?.status === 401) {
          console.log("ℹ️ User not authenticated (401)");
          // Clear any stale data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        } else {
          toast.error("Failed to check authentication status. Please try refreshing the page.");
        }
      })
      .finally(() => setUserLoading(false));
  }, []);

  // Fetch repos once user is authenticated
  useEffect(() => {
    if (accessToken && !userLoading) {
      console.log("🔑 User verified, fetching repos...");
      dispatch(fetchRepos());
    }
  }, [dispatch, accessToken, userLoading]);

  // Handle API errors
  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(`Failed to load repositories: ${error}`);
    }
  }, [status, error]);

  const handleDelete = async (repoFullName) => {
    const loadingToast = toast.info(`Deleting ${repoFullName}...`, { autoClose: false });

    try {
      await deleteSelectedRepos(repoFullName, dispatch);
      toast.dismiss(loadingToast);
      setIsModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to delete ${repoFullName}`);
    }
  };

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const handleArchive = async (repoFullName) => {
    const loadingToast = toast.info(`Archiving ${repoFullName}...`, { autoClose: false });

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archived: true }),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(`Repository ${repoFullName} archived successfully`);
        dispatch(fetchRepos()); // Refresh the list
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to archive: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Error archiving repository: ${error.message}`);
    }
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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <Github className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to GitSweep</h1>
            <p className="text-gray-600 mb-8">
              Your personal assistant for GitHub repository management. Clean up, organize, and manage your repositories with ease.
            </p>
            <button
              onClick={() => window.open(`${backendUrl}/auth/github`, "_self")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Github className="h-5 w-5" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Repositories</h1>
          <p className="text-gray-600">
            Manage and organize your GitHub repositories. Click on any repository to view details and perform actions.
          </p>
        </div>

        {/* Filter and Search Section */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalRepos={filteredList.length}
          filteredCount={filteredRepos.length}
        />

        {/* Repository Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredRepos.length} {filteredRepos.length === 1 ? 'Repository' : 'Repositories'}
            </h2>
          </div>

          {status === "loading" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <RepoCardSkeleton key={i} />
              ))}
            </div>
          ) : status === "failed" ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load repositories</h3>
              <p className="text-gray-600 mb-4">{error || "An unexpected error occurred"}</p>
              <button
                onClick={() => dispatch(fetchRepos())}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onClick={() => handleRepoClick(repo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Github className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No repositories found</h3>
              <p className="text-gray-600">
                {searchQuery ? `No repositories match "${searchQuery}"` : "You don't have any repositories yet"}
              </p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        {filteredRepos.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
            <p className="text-red-700 text-sm">
              Repository deletion is permanent and cannot be undone. Please be careful when deleting repositories.
              Always ensure you have backups of important code before proceeding.
            </p>
          </div>
        )}
      </div>

      {/* Repository Modal */}
      {selectedRepo && (
        <RepoModal
          repo={selectedRepo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          onArchive={handleArchive}
        />
      )}
    </div>
  );
}

export default App;