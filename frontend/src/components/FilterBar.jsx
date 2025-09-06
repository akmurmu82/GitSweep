import { Search, Filter } from "lucide-react";

const FilterBar = ({ filter, setFilter, searchQuery, setSearchQuery, totalRepos, filteredCount }) => {
  const filterOptions = [
    { key: "All", label: "All", count: totalRepos },
    { key: "Private", label: "Private" },
    { key: "Forked", label: "Forked" },
    { key: "Public", label: "Public" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${filter === option.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {option.label}
                {option.count !== undefined && (
                  <span
                    className={`ml-1 sm:ml-2 ${filter === option.key ? "text-blue-200" : "text-gray-500"
                      }`}
                  >
                    ({option.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 w-full lg:w-80 border border-gray-300 rounded-md sm:rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Results Summary */}
      {searchQuery && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {filteredCount} of {totalRepos} repositories
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>

  );
};

export default FilterBar;