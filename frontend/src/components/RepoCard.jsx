import { Star, GitFork, Eye, EyeOff, Calendar, Code, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RepoCard({ repo, onClick }) {
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
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="p-4 sm:p-6">
        {/* Header with name and visibility */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {repo.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {repo.private ? (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                  <EyeOff className="h-3 w-3 sm:h-3 sm:w-3" />
                  Private
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                  <Eye className="h-3 w-3 sm:h-3 sm:w-3" />
                  Public
                </div>
              )}
              {repo.fork && (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">
                  <GitFork className="h-3 w-3 sm:h-3 sm:w-3" />
                  Fork
                </div>
              )}
              {repo.archived && (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  <Archive className="h-3 w-3 sm:h-3 sm:w-3" />
                  Archived
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-[12px] sm:text-sm mb-4 line-clamp-2">
          {repo.description || "No description available"}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-[10px] sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{repo.stargazers_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{repo.forks_count || 0}</span>
          </div>
          {repo.language && (
            <div className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <span className="text-[10px] sm:text-sm">{repo.language}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-100 gap-1 sm:gap-0">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-3 sm:w-3" />
            <span>Updated {formatDate(repo.updated_at)}</span>
          </div>
          <div className="text-gray-400 text-[9px] sm:text-xs">
            Click to view details
          </div>
        </div>
      </div>
    </div>

  );
}

export default RepoCard;