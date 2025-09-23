import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, TrendingDown } from "lucide-react";

export default function Reports() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fetch projects data for reports
  const { data: projects, isLoading } = useQuery<{
    projects?: any[];
  }>({
    queryKey: ["/api/projects"],
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
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAiChatOpen={() => setAiChatOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white" data-testid="page-title-reports">Compliance Reports</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Generate comprehensive carbon footprint and compliance reports</p>
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
        </div>
      </div>

      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}