import { PageShell } from "@/components/layout/page-shell";
import { RegulatoryIntelligence } from "@/components/dashboard/regulatory-intelligence";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";
import { Shield, Clock, Globe, AlertTriangle, CheckCircle, Bell } from "lucide-react";

export default function Regulatory() {
  // Fetch regulatory alerts data
  const { data: alerts, isLoading } = useQuery<{
    alerts?: any[];
  }>({
    queryKey: ["/api/regulatory/alerts"],
  });

  // Fetch regulatory compliance metrics
  const { data: complianceData } = useQuery<{
    activeAlerts?: number;
    complianceScore?: number;
    jurisdictions?: number;
    nextDeadline?: string;
  }>({
    queryKey: ["/api/regulatory/compliance-metrics"],
  });

  // Remove page-level loading gate to allow KPI cards to render with fallback data

  return (
    <PageShell
      title="Regulatory Intelligence"
      description="Regulatory Intelligence - CarbonConstruct AI"
      pageTitle="Regulatory Intelligence"
      pageSubtitle="Stay compliant with Australian carbon regulations and NGER reporting requirements"
      metaDescription="Monitor carbon regulations and compliance requirements across global jurisdictions. Get real-time regulatory alerts, track compliance scores, and ensure timely reporting."
      testId="page-title-regulatory"
    >
      {/* Regulatory Compliance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Active Alerts"
          value={complianceData?.activeAlerts?.toString() || "7"}
          change="2 New"
          changeType="warning"
          icon="exclamation-triangle"
          subtitle="Require immediate attention"
        />
        <KPICard
          title="Compliance Score"
          value={`${complianceData?.complianceScore || 92}%`}
          change="↑ 3%"
          changeType="positive"
          icon="target"
          progress={complianceData?.complianceScore || 92}
          subtitle="Overall regulatory compliance"
        />
        <KPICard
          title="Jurisdictions"
          value={complianceData?.jurisdictions?.toString() || "12"}
          change="AU, NSW, VIC"
          changeType="positive"
          icon="target"
          subtitle="Australian jurisdictions monitored"
        />
        <KPICard
          title="Next Deadline"
          value={complianceData?.nextDeadline || "Feb 28"}
          change="14 days"
          changeType="warning"
          icon="target"
          subtitle="NGER reporting deadline"
        />
      </div>

      {/* Regulatory Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RegulatoryIntelligence />
        </div>
        
        {/* Compliance Dashboard */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Compliance Dashboard</h3>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Green Star</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Compliant</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">98%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">NGER Reporting</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">Due Feb 28</p>
                </div>
              </div>
              <span className="text-amber-600 font-semibold">85%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">NABERS Rating</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">In Progress</p>
                </div>
              </div>
              <span className="text-blue-600 font-semibold">76%</span>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors">
            View All Regulations
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Regulatory Updates</h3>
          <Bell className="w-5 h-5 text-neutral-500" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">NCC Energy Efficiency Update</p>
              <p className="text-sm text-red-600 dark:text-red-400">New energy efficiency provisions for construction activities effective March 2025</p>
              <p className="text-xs text-red-500 dark:text-red-500 mt-1">2 hours ago • High Priority</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">NGER Reporting Deadline Reminder</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">NGER reporting must be submitted by February 28, 2025</p>
              <p className="text-xs text-amber-500 dark:text-amber-500 mt-1">1 day ago • Medium Priority</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}