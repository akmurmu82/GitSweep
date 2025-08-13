function RepoCard({ repo, handleDelete }) {
    return (
        <div key={repo.id} className="bg-gray-900 text-white p-4 rounded-lg shadow-md border border-gray-700 w-full">
            {/* Labels for Forked, Archived, Private */}
            <div className="flex gap-2 items-center justify-between">
                <h2 className="text-lg font-semibold">{repo.name}</h2>

                {repo.fork && <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs">Forked</span>}
                {repo.archived && <span className="bg-gray-500 text-black px-2 py-0.5 rounded text-xs">Archived</span>}
                {repo.private && <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">Private</span>}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 mt-2">
                {repo.description ? repo.description.substring(0, 50) + (repo.description.length > 50 ? "..." : "") : "No description available"}
            </p>

            {/* Forks Count & Delete Button */}
            <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-300">Forks: {repo.forks_count}</span>
                <button
                    onClick={() => handleDelete(repo.full_name)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default RepoCard;
