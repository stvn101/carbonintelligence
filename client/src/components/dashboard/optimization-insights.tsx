import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Route, Bolt } from "lucide-react";

export function OptimizationInsights() {
  const { data: recommendations, isLoading, isError } = useQuery({
    queryKey: ["/api/optimization/recommendations"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const insights = recommendations?.recommendations || [];

  const getIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "materials": return Lightbulb;
      case "transportation": return Route;
      case "energy": return Bolt;
      default: return Lightbulb;
    }
  };

  const getColorScheme = (priority: string) => {
    switch (priority) {
      case "high": return "from-secondary-50 to-primary-50 border-secondary-500 text-secondary-600";
      case "medium": return "from-blue-50 to-indigo-50 border-blue-500 text-blue-600";
      default: return "from-amber-50 to-orange-50 border-amber-500 text-amber-600";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "bg-secondary-100 text-secondary-700";
      case "medium": return "bg-blue-100 text-blue-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">AI Optimization Insights</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-neutral-500">Live Analysis</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.length > 0 ? insights.slice(0, 3).map((insight, index) => {
          const IconComponent = getIcon(insight.category);
          const colorScheme = getColorScheme(insight.priority);
          const badgeColor = getPriorityBadge(insight.priority);
          
          return (
            <div key={index} className={`bg-gradient-to-r rounded-lg p-4 border-l-4 ${colorScheme}`}>
              <div className="flex items-start space-x-3">
                <IconComponent className="mt-1 w-5 h-5" />
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-neutral-600 mb-2">{insight.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded ${badgeColor}`}>
                      {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Impact
                    </span>
                    <span className="text-xs text-neutral-500">{insight.roi}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No optimization insights available yet</p>
            <p className="text-sm text-neutral-400">AI analysis will appear here as data becomes available</p>
          </div>
        )}
      </div>

      <button className="w-full mt-4 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
        Generate Detailed Action Plan
      </button>
    </div>
  );
}
