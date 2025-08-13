import { useState } from "react";
import { 
  X, 
  Star, 
  GitFork, 
  Eye, 
  EyeOff, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  Archive,
  AlertTriangle,
  Code,
  Users,
  GitBranch
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const RepoModal = ({ repo, isOpen, onClose, onDelete, onArchive }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  if (!isOpen) return null;

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      "C#": "#239120",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Shell: "#89e051",
      Vue: "#2c3e50",
      React: "#61dafb",
    };
    return colors[language] || "#6b7280";
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return "Unknown";
    }
  };

  const formatRelativeDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete(repo.full_name);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleArchiveClick = () => {
    if (showArchiveConfirm) {
      onArchive(repo.full_name);
      setShowArchiveConfirm(false);
    } else {
      setShowArchiveConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: repo.language ? getLanguageColor(repo.language) : "#6b7280" }}
            />
            <h2 className="text-xl font-semibold text-gray-900">{repo.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Repository Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {repo.private ? (
                <div className="flex items-center gap-1 text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  <EyeOff className="h-4 w-4" />
                  Private
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  <Eye className="h-4 w-4" />
                  Public
                </div>
              )}
              {repo.fork && (
                <div className="flex items-center gap-1 text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  <GitFork className="h-4 w-4" />
                  Fork
                </div>
              )}
              {repo.archived && (
                <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  <Archive className="h-4 w-4" />
                  Archived
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              {repo.description || "No description available"}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{repo.stargazers_count || 0}</div>
                <div className="text-xs text-gray-500">Stars</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <GitFork className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{repo.forks_count || 0}</div>
                <div className="text-xs text-gray-500">Forks</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{repo.watchers_count || 0}</div>
                <div className="text-xs text-gray-500">Watchers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Code className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <div className="text-lg font-semibold text-gray-900">{Math.round((repo.size || 0) / 1024) || 0}</div>
                <div className="text-xs text-gray-500">MB</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              {repo.language && (
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Primary language:</span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                    <span className="font-medium">{repo.language}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Default branch:</span>
                <span className="font-medium">{repo.default_branch || "main"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(repo.created_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Last updated:</span>
                <span className="font-medium">{formatRelativeDate(repo.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open on GitHub
              </a>
              
              {!repo.archived && (
                <button
                  onClick={handleArchiveClick}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showArchiveConfirm
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-orange-100 hover:bg-orange-200 text-orange-700"
                  }`}
                >
                  <Archive className="h-4 w-4" />
                  {showArchiveConfirm ? "Confirm Archive" : "Archive"}
                </button>
              )}
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 pt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-900">Danger Zone</h4>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  Deleting this repository is permanent and cannot be undone. All issues, pull requests, and wiki data will be lost.
                </p>
                <button
                  onClick={handleDeleteClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showDeleteConfirm
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  {showDeleteConfirm ? "Confirm Delete" : "Delete Repository"}
                </button>
                {showDeleteConfirm && (
                  <p className="text-red-600 text-xs mt-2">
                    Click again to permanently delete this repository
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoModal;