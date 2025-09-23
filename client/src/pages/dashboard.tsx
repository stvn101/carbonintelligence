import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { OptimizationInsights } from "@/components/dashboard/optimization-insights";
import { RegulatoryIntelligence } from "@/components/dashboard/regulatory-intelligence";
import { ProjectPortfolio } from "@/components/dashboard/project-portfolio";
import { InvestmentAnalysis } from "@/components/dashboard/investment-analysis";
import { CarbonBudget } from "@/components/dashboard/carbon-budget";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { MLInsights } from "@/components/dashboard/ml-insights";
import { PlatformIntegrations } from "@/components/dashboard/platform-integrations";
import { LiveCarbonFeed } from "@/components/dashboard/live-carbon-feed";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Dashboard() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fetch dashboard overview data
  const { data: overview, isLoading } = useQuery<{
    totalEmissions?: string;
    savingsOpportunity?: string;
    activeAlerts?: number;
    netZeroProgress?: number;
  }>({
    queryKey: ["/api/dashboard/overview"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
      <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onAiChatOpen={() => setAiChatOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard
              title="Total CO₂e (tonnes)"
              value={overview?.totalEmissions || "0"}
              change="↓ 12%"
              changeType="positive"
              icon="leaf"
              progress={75}
              subtitle="75% of Australian industry average"
            />
            <KPICard
              title="Savings Opportunity"
              value={overview?.savingsOpportunity || "A$0"}
              change="↑ 18%"
              changeType="positive"
              icon="dollar-sign"
              progress={60}
              subtitle="60% identified opportunities (AUD)"
            />
            <KPICard
              title="Regulatory Alerts"
              value={overview?.activeAlerts?.toString() || "0"}
              change="3 Active"
              changeType="warning"
              icon="exclamation-triangle"
              subtitle="NCC updates • NGER reporting • Green Star changes"
            />
            <KPICard
              title="Net Zero Progress"
              value={`${overview?.netZeroProgress || 0}%`}
              change="On Track"
              changeType="positive"
              icon="target"
              progress={overview?.netZeroProgress || 0}
              subtitle="Target: Net Zero by 2030"
            />
          </div>

          {/* Live Carbon Feed - Featured Section */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <LiveCarbonFeed />
          </div>

          {/* Charts and Analysis Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PortfolioChart />
            <OptimizationInsights />
          </div>

          {/* ML Insights Full Width */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <MLInsights />
          </div>

          {/* Platform Integrations Full Width */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <PlatformIntegrations />
          </div>

          {/* Regulatory Intelligence and Project Portfolio Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <RegulatoryIntelligence />
            <div className="lg:col-span-2">
              <ProjectPortfolio />
            </div>
          </div>

          {/* Investment Analysis and Carbon Budget Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InvestmentAnalysis />
            <CarbonBudget />
          </div>
        </div>
      </div>

      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
