import { PageShell } from "@/components/layout/page-shell";
import { PlatformIntegrations } from "@/components/dashboard/platform-integrations";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";

export default function Integrations() {
  // Fetch integrations status data
  const { data: integrationsData, isLoading } = useQuery<{
    platforms?: any[];
  }>({
    queryKey: ["/api/integrations/status"],
  });

  // Fetch integration metrics
  const { data: integrationMetrics } = useQuery<{
    connectedPlatforms?: number;
    totalPlatforms?: number;
    syncSuccessRate?: number;
    lastSync?: string;
  }>({
    queryKey: ["/api/integrations/metrics"],
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
      title="Platform Integrations"
      description="Platform Integrations - CarbonConstruct AI"
      pageTitle="Platform Integrations"
      pageSubtitle="Connect and sync data from your construction platforms and tools"
      metaDescription="Connect construction platforms and tools to CarbonConstruct AI. Sync data automatically, monitor integration health, and streamline carbon tracking workflows."
      testId="page-title-integrations"
    >
      {/* Integration KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Connected Platforms"
          value={`${integrationMetrics?.connectedPlatforms || 8}/${integrationMetrics?.totalPlatforms || 12}`}
          change="2 new"
          changeType="positive"
          icon="target"
          progress={((integrationMetrics?.connectedPlatforms || 8) / (integrationMetrics?.totalPlatforms || 12)) * 100}
          subtitle="Active integrations"
        />
        <KPICard
          title="Sync Success Rate"
          value={`${integrationMetrics?.syncSuccessRate || 97}%`}
          change="↑ 2%"
          changeType="positive"
          icon="target"
          progress={integrationMetrics?.syncSuccessRate || 97}
          subtitle="Data synchronization reliability"
        />
        <KPICard
          title="Data Sources"
          value="24"
          change="5 active"
          changeType="positive"
          icon="target"
          subtitle="Connected data streams"
        />
        <KPICard
          title="Last Sync"
          value={integrationMetrics?.lastSync || "2 min ago"}
          change="Auto sync"
          changeType="positive"
          icon="target"
          subtitle="Most recent data update"
        />
      </div>

      {/* Platform Integrations Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <PlatformIntegrations />
      </div>
    </PageShell>
  );
}