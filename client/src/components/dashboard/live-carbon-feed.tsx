import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Lightbulb,
  BarChart3,
  Clock,
  Zap,
  Leaf,
  Factory,
  Truck,
  Recycle
} from "lucide-react";

interface LiveMetric {
  id: number;
  metricType: string;
  value: string;
  unit: string;
  timestamp: string;
  projectId?: number;
  category: string;
  subcategory?: string;
  benchmark?: string;
  target?: string;
  trend: "increasing" | "decreasing" | "stable";
  changeFromPrevious?: string;
  alerts?: any[];
}

interface CarbonReductionTactic {
  id: number;
  title: string;
  description: string;
  category: string;
  potentialReduction: string;
  reductionPercentage: string;
  implementationCost?: string;
  priority: "critical" | "high" | "medium" | "low";
  timeline: "immediate" | "short_term" | "medium_term" | "long_term";
  feasibilityScore?: string;
  aiConfidence?: string;
}

interface EmbodiedCarbonData {
  materialType: string;
  totalEmbodiedCarbon: string;
  percentage: number;
  trend: "up" | "down" | "stable";
  change: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "materials": return <Factory className="w-4 h-4" />;
    case "energy": return <Zap className="w-4 h-4" />;
    case "transport": return <Truck className="w-4 h-4" />;
    case "waste": return <Recycle className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "text-red-600 bg-red-50 border-red-200";
    case "high": return "text-orange-600 bg-orange-50 border-orange-200";
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low": return "text-green-600 bg-green-50 border-green-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getTimelineIcon = (timeline: string) => {
  switch (timeline) {
    case "immediate": return "🚨";
    case "short_term": return "⚡";
    case "medium_term": return "📅";
    case "long_term": return "🎯";
    default: return "📋";
  }
};

export function LiveCarbonFeed() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(false); // Disabled by default to prevent flickering

  // Fetch live carbon metrics
  const { data: liveMetrics, isLoading: metricsLoading, isFetching: metricsFetching } = useQuery<LiveMetric[]>({
    queryKey: ["/api/carbon/live-metrics", selectedCategory],
    refetchInterval: autoRefresh ? 30000 : false, // 30 second refresh when enabled (reduced from 5s)
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });

  // Fetch carbon reduction tactics
  const { data: reductionTactics, isLoading: tacticsLoading } = useQuery<CarbonReductionTactic[]>({
    queryKey: ["/api/carbon/reduction-tactics"],
  });

  // Fetch embodied carbon breakdown
  const { data: embodiedBreakdown, isLoading: embodiedLoading } = useQuery<EmbodiedCarbonData[]>({
    queryKey: ["/api/carbon/embodied-breakdown"],
  });

  const categories = ["all", "materials", "energy", "transport", "waste"];

  // Only show loading skeleton on initial load, not when switching tabs
  const isInitialLoading = metricsLoading && !liveMetrics;
  
  if (isInitialLoading || (tacticsLoading && !reductionTactics) || (embodiedLoading && !embodiedBreakdown)) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredMetrics = selectedCategory === "all" 
    ? liveMetrics || []
    : (liveMetrics || []).filter(m => m.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 transition-colors">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Live Carbon Embodied Feed
              </h3>
              <p className="text-sm text-neutral-600 dark:text-gray-400">
                Real-time carbon tracking with AI-powered reduction strategies (NGER aligned)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                autoRefresh 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {autoRefresh ? "🟢 Live" : "⏸️ Paused"}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Real-time Metrics Grid */}
        <div>
          <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Live Carbon Metrics
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredMetrics.slice(0, 6).map((metric) => (
              <div key={metric.id} className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-800 dark:to-gray-850 rounded-lg border border-neutral-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(metric.category)}
                    <span className="text-xs font-medium text-neutral-600 dark:text-gray-400 uppercase">
                      {metric.subcategory || metric.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {metric.trend === "increasing" && <TrendingUp className="w-3 h-3 text-red-500" />}
                    {metric.trend === "decreasing" && <TrendingDown className="w-3 h-3 text-green-500" />}
                    {metric.alerts && metric.alerts.length > 0 && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {parseFloat(metric.value).toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-600 dark:text-gray-400">
                    {metric.unit} {metric.metricType}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-neutral-600 dark:text-gray-400">
                    {metric.changeFromPrevious && (
                      <span className={`font-medium ${
                        parseFloat(metric.changeFromPrevious) < 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {parseFloat(metric.changeFromPrevious) > 0 ? "+" : ""}{metric.changeFromPrevious}%
                      </span>
                    )}
                  </div>
                  <div className="text-neutral-500 dark:text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                {metric.target && (
                  <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600 dark:text-gray-400">Target:</span>
                      <span className="font-medium text-neutral-900 dark:text-white">{metric.target} {metric.unit}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Embodied Carbon Breakdown */}
        {embodiedBreakdown && embodiedBreakdown.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <Factory className="w-4 h-4 mr-2" />
              Embodied Carbon by Material (AU Supply Chain)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {embodiedBreakdown.map((material, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-neutral-900 dark:text-white capitalize">
                      {material.materialType.replace("_", " ")}
                    </h5>
                    <div className="flex items-center space-x-1">
                      {material.trend === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
                      {material.trend === "down" && <TrendingDown className="w-3 h-3 text-green-500" />}
                      <span className="text-xs text-neutral-600 dark:text-gray-400">
                        {material.change}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                    {parseFloat(material.totalEmbodiedCarbon).toLocaleString()} tCO₂e
                  </div>
                  
                  <div className="w-full bg-neutral-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${material.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-neutral-600 dark:text-gray-400">
                    {material.percentage.toFixed(1)}% of total embodied carbon
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI-Powered Carbon Reduction Tactics */}
        <div>
          <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI-Powered Carbon Reduction Tactics
            <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
              Powered by AI
            </span>
          </h4>

          <div className="space-y-4">
            {(reductionTactics || []).slice(0, 8).map((tactic) => (
              <div key={tactic.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(tactic.priority)} transition-colors`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-semibold text-neutral-900 dark:text-white">
                        {tactic.title}
                      </h5>
                      <span className="text-lg">{getTimelineIcon(tactic.timeline)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tactic.priority)}`}>
                        {tactic.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-neutral-700 dark:text-gray-300 mb-3">
                      {tactic.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {parseFloat(tactic.potentialReduction).toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-gray-400">tCO₂e Reduction</div>
                  </div>
                  
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {tactic.reductionPercentage}%
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-gray-400">% Reduction</div>
                  </div>
                  
                  {tactic.implementationCost && (
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        A$${(parseFloat(tactic.implementationCost) * 1.5).toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-gray-400">Cost</div>
                    </div>
                  )}
                  
                  {tactic.feasibilityScore && (
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {(parseFloat(tactic.feasibilityScore) * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-gray-400">Feasibility</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <span className="text-neutral-600 dark:text-gray-400">
                      Category: <span className="font-medium">{tactic.category.replace("_", " ")}</span>
                    </span>
                    <span className="text-neutral-600 dark:text-gray-400">
                      Timeline: <span className="font-medium">{tactic.timeline.replace("_", " ")}</span>
                    </span>
                  </div>
                  
                  {tactic.aiConfidence && (
                    <div className="flex items-center space-x-1">
                      <span className="text-neutral-500 dark:text-gray-500">AI Confidence:</span>
                      <span className="font-medium text-neutral-700 dark:text-gray-300">
                        {(parseFloat(tactic.aiConfidence) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-neutral-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Set Reduction Targets</span>
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Export Live Data</span>
            </button>
            
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>Generate More Tactics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}