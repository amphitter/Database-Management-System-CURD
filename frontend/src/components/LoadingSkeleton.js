// components/LoadingSkeleton.js
export default function LoadingSkeleton({ type = "student-details" }) {
    if (type === "student-details") {
      return (
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar Skeleton */}
          <div className="w-64 bg-white shadow-lg animate-pulse"></div>
  
          {/* Main Content Skeleton */}
          <div className="flex-1 p-8">
            {/* Back Button Skeleton */}
            <div className="h-8 w-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
  
            {/* Profile Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-xl">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-white/30 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-white/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
  
            {/* Main Content Grid Skeleton */}
            <div className="grid md:grid-cols-3 gap-8 p-8 bg-white rounded-b-xl shadow-lg">
              {/* Left Column Skeleton */}
              <div className="md:col-span-2 space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
  
              {/* Right Column Skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
  
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  
    return null;
  }