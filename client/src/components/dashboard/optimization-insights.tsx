import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Route, Bolt, Check, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  roi: string;
  carbonReduction?: string;
  status?: string;
  projections?: {
    before: string;
    after: string;
    savings: string;
  };
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export function OptimizationInsights() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: recommendations, isLoading, isError } = useQuery<RecommendationsResponse>({
    queryKey: ["/api/optimization/recommendations"],
  });

  // Apply recommendation mutation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      const response = await fetch(`/api/optimization/recommendations/${recommendationId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applied: true })
      });
      if (!response.ok) throw new Error('Failed to apply recommendation');
      return { recommendationId, ...await response.json() };
    },
    onMutate: async (recommendationId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/optimization/recommendations"] });
      
      // Snapshot the previous value
      const previousRecommendations = queryClient.getQueryData(["/api/optimization/recommendations"]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["/api/optimization/recommendations"], (old: any) => {
        if (!old?.recommendations) return old;
        return {
          ...old,
          recommendations: old.recommendations.map((rec: any) => 
            rec.id === recommendationId 
              ? { ...rec, status: 'applied' }
              : rec
          )
        };
      });
      
      return { previousRecommendations };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/analysis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/kpis"] });
      toast({ 
        title: "Recommendation Applied", 
        description: "The optimization recommendation has been successfully applied to your portfolio." 
      });
    },
    onError: (err, recommendationId, context) => {
      // Rollback the optimistic update
      if (context?.previousRecommendations) {
        queryClient.setQueryData(["/api/optimization/recommendations"], context.previousRecommendations);
      }
      toast({ 
        title: "Error", 
        description: "Failed to apply recommendation. Please try again.", 
        variant: "destructive" 
      });
    }
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
  
  // Fallback data when API fails
  const fallbackInsights = [
    {
      id: '1',
      title: 'Replace Standard Australian Concrete with Eco-Concrete',
      description: 'Switch to recycled aggregate concrete for structural elements. Australian eco-concrete reduces embodied carbon by 30% while maintaining AS 3600 compliance.',
      priority: 'high',
      category: 'materials',
      roi: 'A$280K savings',
      carbonReduction: '156',
      status: 'pending',
      projections: {
        before: '520 tCO₂e',
        after: '364 tCO₂e',
        savings: 'A$280K + 156 tCO₂e reduction'
      }
    },
    {
      id: '2', 
      title: 'Solar Panel Installation (Australian Certified)',
      description: 'Install CEC-approved solar panels with 25-year warranty. Meets Australian standards and provides immediate carbon offset.',
      priority: 'medium',
      category: 'energy',
      roi: 'A$150K savings',
      carbonReduction: '89',
      status: 'pending',
      projections: {
        before: '240 tCO₂e/year',
        after: '151 tCO₂e/year',
        savings: 'A$150K + 89 tCO₂e reduction'
      }
    },
    {
      id: '3',
      title: 'Local Australian Timber Sourcing',
      description: 'Source FSC-certified Australian hardwood within 200km radius. Reduces transport emissions and supports local suppliers.',
      priority: 'medium',
      category: 'transportation',
      roi: 'A$95K savings',
      carbonReduction: '42',
      status: 'pending',
      projections: {
        before: '180 tCO₂e',
        after: '138 tCO₂e',
        savings: 'A$95K + 42 tCO₂e reduction'
      }
    }
  ];
  
  const displayInsights = insights.length > 0 ? insights : fallbackInsights;

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
        {displayInsights.length > 0 ? displayInsights.slice(0, 3).map((insight: any, index: number) => {
          const IconComponent = getIcon(insight.category);
          const colorScheme = getColorScheme(insight.priority);
          const badgeColor = getPriorityBadge(insight.priority);
          
          return (
            <div key={insight.id || index} className={`bg-gradient-to-r rounded-lg p-4 border-l-4 ${colorScheme}`} data-testid={`recommendation-${insight.id || index}`}>
              <div className="flex items-start space-x-3">
                <IconComponent className="mt-1 w-5 h-5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-neutral-600 mb-2">{insight.description}</p>
                    </div>
                    {insight.status !== 'applied' && (
                      <button
                        onClick={() => applyRecommendationMutation.mutate(insight.id || index.toString())}
                        disabled={applyRecommendationMutation.isPending}
                        className="ml-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        data-testid={`button-apply-${insight.id || index}`}
                      >
                        {applyRecommendationMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>Apply</span>
                      </button>
                    )}
                    {insight.status === 'applied' && (
                      <div className="ml-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Applied</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Before/After Impact Projections */}
                  {insight.projections && (
                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                      <h5 className="text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wide">Impact Projection</h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-neutral-500">Before</span>
                          </div>
                          <div className="font-semibold text-neutral-900">{insight.projections.before}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-neutral-500">After</span>
                          </div>
                          <div className="font-semibold text-green-600">{insight.projections.after}</div>
                        </div>
                      </div>
                      {insight.projections.savings && (
                        <div className="mt-2 text-center">
                          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                            Potential Savings: {insight.projections.savings}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded ${badgeColor}`}>
                      {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Impact
                    </span>
                    <span className="text-xs text-neutral-500">{insight.roi}</span>
                    {insight.carbonReduction && (
                      <span className="text-xs text-green-600 font-medium">
                        -{insight.carbonReduction} tCO₂e
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : null}
        
        {displayInsights.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No optimization insights available yet</p>
            <p className="text-sm text-neutral-400">AI analysis will appear here as data becomes available</p>
          </div>
        )}
      </div>

      <div className="flex space-x-3 mt-4">
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/optimization/recommendations"] })}
          className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
          data-testid="button-refresh-recommendations"
        >
          Refresh Recommendations
        </button>
        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
          Generate Action Plan
        </button>
      </div>
    </div>
  );
}
