import { PageShell } from "@/components/layout/page-shell";
import { CarbonBudget } from "@/components/dashboard/carbon-budget";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";

export default function Budget() {
  // Fetch carbon budget data
  const { data: budgetData, isLoading } = useQuery<{
    totalBudget?: string;
    allocatedBudget?: string;
    consumedBudget?: string;
  }>({
    queryKey: ["/api/carbon-budget/2025"],
  });

  // Fetch budget metrics
  const { data: budgetMetrics } = useQuery<{
    totalBudget?: number;
    consumed?: number;
    remaining?: number;
    variance?: string;
  }>({
    queryKey: ["/api/budget/metrics"],
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
      title="Carbon Budget Planning"
      description="Carbon Budget Planning - CarbonConstruct AI"
      pageTitle="Carbon Budget Planning"
      pageSubtitle="Plan and track carbon budgets across your construction portfolio"
      metaDescription="Plan, track, and optimize carbon budgets across your construction portfolio. Monitor allocations, forecast emissions, and ensure sustainable project delivery."
      testId="page-title-budget"
    >
      {/* Budget KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Budget"
          value={`${(budgetMetrics?.totalBudget || 2800)/1000}k tCO₂e`}
          change="FY 2025"
          changeType="positive"
          icon="target"
          subtitle="Annual carbon allocation"
        />
        <KPICard
          title="Consumed"
          value={`${(budgetMetrics?.consumed || 2100)/1000}k tCO₂e`}
          change="75% used"
          changeType="warning"
          icon="target"
          progress={75}
          subtitle="Budget consumption rate"
        />
        <KPICard
          title="Remaining"
          value={`${(budgetMetrics?.remaining || 700)/1000}k tCO₂e`}
          change="Q4 available"
          changeType="positive"
          icon="target"
          subtitle="Available budget"
        />
        <KPICard
          title="Variance"
          value={budgetMetrics?.variance || "-8%"}
          change="Under budget"
          changeType="positive"
          icon="target"
          subtitle="Performance vs plan"
        />
      </div>

      {/* Carbon Budget Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <CarbonBudget />
      </div>
    </PageShell>
  );
}