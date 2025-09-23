import { PageShell } from "@/components/layout/page-shell";
import { InvestmentAnalysis } from "@/components/dashboard/investment-analysis";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";

export default function Investments() {
  // Fetch investment analysis data
  const { data: investmentData, isLoading } = useQuery<{
    analysis?: any;
  }>({
    queryKey: ["/api/investments/analysis"],
  });

  // Fetch investment metrics
  const { data: investmentMetrics } = useQuery<{
    totalInvested?: number;
    currentROI?: number;
    projectedSavings?: number;
    activeProjects?: number;
  }>({
    queryKey: ["/api/investments/metrics"],
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
      title="Investment Analysis"
      description="Investment Analysis - CarbonConstruct AI"
      pageTitle="Investment Analysis"
      pageSubtitle="Analyze carbon reduction investments and ROI opportunities"
      metaDescription="Analyze carbon reduction investments, track ROI performance, and identify new opportunities. Optimize capital allocation for maximum environmental impact."
      testId="page-title-investments"
    >
      {/* Investment KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Invested"
          value={`$${(investmentMetrics?.totalInvested || 24500000)/1000000}M`}
          change="↑ $3.2M"
          changeType="positive"
          icon="dollar-sign"
          subtitle="Climate investments to date"
        />
        <KPICard
          title="Current ROI"
          value={`${investmentMetrics?.currentROI || 24}%`}
          change="↑ 3%"
          changeType="positive"
          icon="target"
          progress={investmentMetrics?.currentROI || 24}
          subtitle="Return on climate investments"
        />
        <KPICard
          title="Projected Savings"
          value={`$${(investmentMetrics?.projectedSavings || 8200000)/1000000}M`}
          change="Next 5 years"
          changeType="positive"
          icon="dollar-sign"
          subtitle="Expected cost savings"
        />
        <KPICard
          title="Active Projects"
          value={investmentMetrics?.activeProjects?.toString() || "18"}
          change="6 new"
          changeType="positive"
          icon="target"
          subtitle="Investment initiatives underway"
        />
      </div>

      {/* Investment Analysis Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <InvestmentAnalysis />
      </div>
    </PageShell>
  );
}