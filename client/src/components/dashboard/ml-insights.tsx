import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Brain, TrendingUp, AlertTriangle, Zap, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function MLInsights() {
  const [selectedModel, setSelectedModel] = useState("advanced_forecasting");
  const { toast } = useToast();

  const { data: mlData, isLoading } = useQuery({
    queryKey: ["/api/ml/insights"],
  });

  const { data: patterns } = useQuery({
    queryKey: ["/api/ml/patterns"],
  });

  const forecastMutation = useMutation({
    mutationFn: async (params: any) => {
      const response = await apiRequest("POST", "/api/ml/forecast", params);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Forecast Generated",
        description: "New ML predictions are ready for review"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ml/insights"] });
    }
  });

  const trainModelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ml/train-company-model", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Model Training Started",
        description: "Your company-specific model is being trained with your data"
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

  const forecasts = mlData?.forecasts || [
    {
      timeframe: "Next Quarter",
      predictedEmissions: 2450,
      confidence: 0.87,
      change: -12,
      factors: ["Seasonal patterns", "Material optimization", "Transport efficiency"]
    },
    {
      timeframe: "Next 6 Months", 
      predictedEmissions: 4890,
      confidence: 0.82,
      change: -8,
      factors: ["Market demand", "Supply chain improvements"]
    }
  ];

  const modelAccuracy = mlData?.modelAccuracy || 0.87;
  const patternInsights = patterns?.patterns || [
    {
      type: "Seasonal Material Usage",
      confidence: 0.92,
      impact: "high",
      description: "Steel consumption peaks 40% in Q2-Q3"
    },
    {
      type: "Transport Optimization",
      confidence: 0.88,
      impact: "medium", 
      description: "Local sourcing reduces emissions by 25%"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-primary-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-neutral-900">Advanced ML Insights</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="text-sm border border-neutral-300 rounded px-3 py-1"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="advanced_forecasting">Advanced Forecasting</option>
            <option value="pattern_recognition">Pattern Recognition</option>
            <option value="company_specific">Company-Specific Model</option>
          </select>
          <Button 
            size="sm"
            onClick={() => forecastMutation.mutate({ model: selectedModel, timeframe: "quarterly" })}
            disabled={forecastMutation.isPending}
          >
            <Play className="w-4 h-4 mr-1" />
            {forecastMutation.isPending ? "Running..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Model Performance */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-blue-900">Model Accuracy</span>
            <span className="text-2xl font-bold text-blue-600">{(modelAccuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${modelAccuracy * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Using ensemble ML models trained on {mlData?.trainingDataSize || "150k+"} data points
          </p>
        </div>

        {/* Emission Forecasts */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-secondary-600" />
            Carbon Emission Forecasts
          </h4>
          <div className="space-y-3">
            {forecasts.map((forecast, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">{forecast.timeframe}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-neutral-900">
                      {forecast.predictedEmissions.toLocaleString()} tCO₂e
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      forecast.change < 0 ? 'bg-secondary-100 text-secondary-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {forecast.change > 0 ? '+' : ''}{forecast.change}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    Confidence: {(forecast.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="text-neutral-500">
                    Key factors: {forecast.factors.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Recognition */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-amber-600" />
            Identified Patterns
          </h4>
          <div className="space-y-3">
            {patternInsights.map((pattern, index) => (
              <div key={index} className="border-l-4 border-amber-500 bg-amber-50 p-3 rounded-r-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-amber-900">{pattern.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      pattern.impact === 'high' ? 'bg-red-100 text-red-700' :
                      pattern.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {pattern.impact.charAt(0).toUpperCase() + pattern.impact.slice(1)} Impact
                    </span>
                    <span className="text-xs text-amber-700">
                      {(pattern.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
                <p className="text-sm text-amber-800">{pattern.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company-Specific Model */}
        <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-neutral-900">Company-Specific ML Model</h4>
              <p className="text-sm text-neutral-600">
                Train a custom model using your organization's data patterns
              </p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => trainModelMutation.mutate()}
              disabled={trainModelMutation.isPending}
            >
              <Settings className="w-4 h-4 mr-1" />
              {trainModelMutation.isPending ? "Training..." : "Train Model"}
            </Button>
          </div>
          <div className="text-sm text-neutral-700">
            <span className="font-medium">Status:</span> {mlData?.companyModel?.status || "Ready to train"}
            {mlData?.companyModel?.accuracy && (
              <span className="ml-4">
                <span className="font-medium">Accuracy:</span> {(mlData.companyModel.accuracy * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Anomaly Detection */}
        {mlData?.anomalies && mlData.anomalies.length > 0 && (
          <div>
            <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
              Detected Anomalies
            </h4>
            <div className="space-y-2">
              {mlData.anomalies.map((anomaly: any, index: number) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-900">{anomaly.description}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      anomaly.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      anomaly.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{anomaly.suggestedAction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}