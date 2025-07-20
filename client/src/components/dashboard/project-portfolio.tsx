import { useQuery } from "@tanstack/react-query";

export function ProjectPortfolio() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const projectList = projects?.projects || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "on track": return "bg-green-100 text-green-700";
      case "in-progress":
      case "in progress": return "bg-amber-100 text-amber-700";
      case "at risk": return "bg-red-100 text-red-700";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getRecommendationColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "on track": return "bg-green-50 text-green-700 hover:bg-green-100";
      case "in-progress":
      case "in progress": return "bg-primary-50 text-primary-700 hover:bg-primary-100";
      default: return "bg-red-50 text-red-700 hover:bg-red-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Project Portfolio Overview</h3>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-primary-600 hover:text-primary-700">Filter</button>
          <button className="text-sm text-primary-600 hover:text-primary-700">Export</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {projectList.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 font-medium text-neutral-600">Project</th>
                <th className="text-left py-3 font-medium text-neutral-600">Carbon Footprint</th>
                <th className="text-left py-3 font-medium text-neutral-600">Status</th>
                <th className="text-left py-3 font-medium text-neutral-600">Target Progress</th>
                <th className="text-left py-3 font-medium text-neutral-600">AI Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {projectList.map((project, index) => {
                const progress = project.progress || Math.floor(Math.random() * 100);
                const carbonFootprint = parseFloat(project.carbonFootprint) || 0;
                const targetEmissions = parseFloat(project.targetEmissions) || carbonFootprint;
                const variance = targetEmissions > 0 ? ((carbonFootprint - targetEmissions) / targetEmissions * 100) : 0;
                
                return (
                  <tr key={project.id || index} className="border-b border-neutral-100">
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-neutral-900">{project.name}</div>
                        <div className="text-xs text-neutral-500">{project.type} • {project.location}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-neutral-900">{carbonFootprint.toFixed(0)} tCO₂e</div>
                      <div className={`text-xs ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance > 0 ? '↑' : '↓'} {Math.abs(variance).toFixed(1)}% vs target
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-neutral-200 rounded-full h-2 w-16">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(progress)}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600">{progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <button className={`text-xs px-2 py-1 rounded ${getRecommendationColor(project.status)}`}>
                        {variance > 10 ? "Urgent intervention" : 
                         variance > 0 ? "Material swap suggested" : 
                         "Best practice model"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-neutral-400 text-2xl">📊</span>
            </div>
            <p className="text-neutral-500 mb-2">No projects found</p>
            <p className="text-sm text-neutral-400">Projects will appear here when added to your portfolio</p>
            <button className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
              Add Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
