import { PageShell } from "@/components/layout/page-shell";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { ProjectPortfolio } from "@/components/dashboard/project-portfolio";
import { OptimizationInsights } from "@/components/dashboard/optimization-insights";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";

export default function Portfolio() {
  // Fetch portfolio analysis data
  const { data: portfolioData, isLoading } = useQuery<{
    analysis?: any;
  }>({
    queryKey: ["/api/portfolio/analysis"],
  });

  // Fetch portfolio KPIs
  const { data: kpiData } = useQuery<{
    totalProjects?: number;
    totalEmissions?: string;
    averageScore?: number;
    topPerformer?: string;
  }>({
    queryKey: ["/api/portfolio/kpis"],
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
      title="Portfolio Optimization"
      description="Portfolio Optimization - CarbonConstruct AI"
      pageTitle="Portfolio Optimization"
      pageSubtitle="Optimize your construction portfolio for maximum carbon impact and cost efficiency"
      metaDescription="Optimize your construction portfolio with AI-powered insights. Track carbon performance, identify cost savings, and maximize environmental impact across all projects."
      testId="page-title-portfolio"
    >
      {/* Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Projects"
          value={kpiData?.totalProjects?.toString() || "24"}
          change="↑ 3 new"
          changeType="positive"
          icon="target"
          subtitle="Active projects in portfolio"
        />
        <KPICard
          title="Portfolio Emissions"
          value={kpiData?.totalEmissions || "42.8k tCO₂e"}
          change="↓ 8%"
          changeType="positive"
          icon="leaf"
          progress={72}
          subtitle="72% below industry average"
        />
        <KPICard
          title="Avg Performance Score"
          value={`${kpiData?.averageScore || 87}/100`}
          change="↑ 4 pts"
          changeType="positive"
          icon="target"
          progress={87}
          subtitle="Portfolio sustainability rating"
        />
        <KPICard
          title="Top Performer"
          value={kpiData?.topPerformer || "Green Tower"}
          change="95% Score"
          changeType="positive"
          icon="target"
          subtitle="Highest scoring project"
        />
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PortfolioChart />
        <OptimizationInsights />
      </div>

      {/* Projects Portfolio */}
      <div className="grid grid-cols-1 gap-6">
        <ProjectPortfolio />
      </div>
    </PageShell>
  );
}