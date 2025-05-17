const RepoCardSkeleton = () => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md border border-gray-700 w-full sm:w-80 animate-pulse">
      {/* Title and labels */}
      <div className="flex justify-between items-center mb-2">
        <div className="h-5 w-24 bg-gray-700 rounded"></div>
        <div className="flex gap-1">
          <div className="h-4 w-12 bg-yellow-600 rounded"></div>
          <div className="h-4 w-12 bg-gray-600 rounded"></div>
          <div className="h-4 w-12 bg-blue-600 rounded"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1 mt-2">
        <div className="h-3 w-full bg-gray-700 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-700 rounded"></div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-20 bg-gray-700 rounded"></div>
        <div className="h-8 w-16 bg-red-600 rounded"></div>
      </div>
    </div>
  );
};

export default RepoCardSkeleton;
