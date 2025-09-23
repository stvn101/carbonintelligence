import { PageShell } from "@/components/layout/page-shell";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, TrendingDown, CheckCircle, Clock } from "lucide-react";

export default function Reports() {
  // Fetch projects data for reports
  const { data: projects, isLoading } = useQuery<{
    projects?: any[];
  }>({
    queryKey: ["/api/projects"],
  });

  // Fetch report metrics
  const { data: reportMetrics } = useQuery<{
    totalReports?: number;
    pendingReports?: number;
    complianceRate?: number;
    lastGenerated?: string;
  }>({
    queryKey: ["/api/reports/metrics"],
  });

  // Remove page-level loading gate to allow KPI cards to render with fallback data

  return (
    <PageShell
      title="Compliance Reports"
      description="Compliance Reports - CarbonConstruct AI"
      pageTitle="Compliance Reports"
      pageSubtitle="Generate comprehensive carbon footprint and compliance reports"
      metaDescription="Generate and manage carbon footprint reports, compliance summaries, and regulatory documentation. Download detailed analytics and track reporting requirements."
      testId="page-title-reports"
    >
      {/* Reports KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Reports"
          value={reportMetrics?.totalReports?.toString() || "127"}
          change="↑ 8 new"
          changeType="positive"
          icon="target"
          subtitle="Reports generated this year"
        />
        <KPICard
          title="Pending Reports"
          value={reportMetrics?.pendingReports?.toString() || "3"}
          change="Due soon"
          changeType="warning"
          icon="exclamation-triangle"
          subtitle="Require immediate attention"
        />
        <KPICard
          title="Compliance Rate"
          value={`${reportMetrics?.complianceRate || 98}%`}
          change="↑ 2%"
          changeType="positive"
          icon="target"
          progress={reportMetrics?.complianceRate || 98}
          subtitle="On-time report submissions"
        />
        <KPICard
          title="Last Generated"
          value={reportMetrics?.lastGenerated || "Yesterday"}
          change="Q3 Report"
          changeType="positive"
          icon="target"
          subtitle="Most recent report"
        />
      </div>

      {/* Report Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Carbon Footprint Report</span>
            </CardTitle>
            <CardDescription>Detailed analysis of Scope 1, 2, and 3 emissions across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" data-testid="button-generate-carbon-report">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Compliance Summary</span>
            </CardTitle>
            <CardDescription>Regulatory compliance status and upcoming requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-generate-compliance-report">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-purple-600" />
            <span>Recent Reports</span>
          </CardTitle>
          <CardDescription>Previously generated reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" data-testid="recent-reports-list">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Q3 2025 Carbon Report</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Generated on Sept 15, 2025</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">EU Taxonomy Compliance</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Generated on Sept 10, 2025</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}