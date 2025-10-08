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

  // Remove page-level loading gate to allow KPI cards to render with fallback data

  return (
    <PageShell
      title="Investment Analysis"
      description="Investment Analysis - CarbonIntelligence"
      pageTitle="Investment Analysis"
      pageSubtitle="Analyze carbon reduction investments and ROI opportunities"
      metaDescription="Analyze carbon reduction investments, track ROI performance, and identify new opportunities. Optimize capital allocation for maximum environmental impact."
      testId="page-title-investments"
    >
      {/* Investment KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Invested"
          value={`A$${(investmentMetrics?.totalInvested || 37000000)/1000000}M`}
          change="↑ A$4.8M"
          changeType="positive"
          icon="dollar-sign"
          subtitle="Australian climate investments to date"
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
          value={`A$${(investmentMetrics?.projectedSavings || 12300000)/1000000}M`}
          change="Next 5 years"
          changeType="positive"
          icon="dollar-sign"
          subtitle="Expected cost savings (AUD)"
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