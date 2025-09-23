import { PageShell } from "@/components/layout/page-shell";
import { MLInsights } from "@/components/dashboard/ml-insights";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";

export default function ML() {
  // Fetch ML insights data
  const { data: mlData, isLoading } = useQuery<{
    insights?: any[];
    patterns?: any[];
  }>({
    queryKey: ["/api/ml/insights"],
  });

  // Fetch ML performance metrics
  const { data: mlMetrics } = useQuery<{
    modelAccuracy?: number;
    predictionsToday?: number;
    modelsActive?: number;
    forecastConfidence?: number;
  }>({
    queryKey: ["/api/ml/performance"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <PageShell
      title="ML Models & Forecasting"
      description="ML Models & Forecasting - CarbonConstruct AI"
      pageTitle="ML Models & Forecasting"
      pageSubtitle="Advanced machine learning insights and carbon forecasting models"
      metaDescription="Leverage advanced machine learning for carbon forecasting, pattern recognition, and predictive analytics. Train custom models and access AI-powered insights."
      testId="page-title-ml"
    >
      {/* ML Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Model Accuracy"
          value={`${mlMetrics?.modelAccuracy || 87}%`}
          change="↑ 2%"
          changeType="positive"
          icon="target"
          progress={mlMetrics?.modelAccuracy || 87}
          subtitle="Average prediction accuracy"
        />
        <KPICard
          title="Predictions Today"
          value={mlMetrics?.predictionsToday?.toString() || "2,847"}
          change="↑ 18%"
          changeType="positive"
          icon="target"
          subtitle="AI forecasts generated"
        />
        <KPICard
          title="Active Models"
          value={mlMetrics?.modelsActive?.toString() || "12"}
          change="3 Custom"
          changeType="positive"
          icon="target"
          subtitle="Production ML models"
        />
        <KPICard
          title="Forecast Confidence"
          value={`${mlMetrics?.forecastConfidence || 92}%`}
          change="High"
          changeType="positive"
          icon="target"
          progress={mlMetrics?.forecastConfidence || 92}
          subtitle="Next quarter predictions"
        />
      </div>

      {/* ML Insights Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <MLInsights />
      </div>
    </PageShell>
  );
}