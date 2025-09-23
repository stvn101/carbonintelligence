import { PageShell } from "@/components/layout/page-shell";
import { RegulatoryIntelligence } from "@/components/dashboard/regulatory-intelligence";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Clock, Globe, AlertTriangle, CheckCircle, Bell, Filter, X, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Regulatory() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const { toast } = useToast();
  
  // Fetch regulatory alerts data with filtering
  const { data: alerts, isLoading } = useQuery<{
    alerts?: any[];
  }>({
    queryKey: ["/api/regulatory/alerts", selectedRegion],
    queryFn: selectedRegion 
      ? () => fetch(`/api/regulatory/alerts?region=${selectedRegion}`).then(res => res.json())
      : undefined
  });

  // Fetch regulatory compliance metrics
  const { data: complianceData } = useQuery<{
    activeAlerts?: number;
    complianceScore?: number;
    jurisdictions?: number;
    nextDeadline?: string;
  }>({
    queryKey: ["/api/regulatory/compliance-score"],
  });
  
  // Dismiss alert mutation
  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      const response = await fetch(`/api/regulatory/alerts/${alertId}/dismiss`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dismissed' })
      });
      if (!response.ok) throw new Error('Failed to dismiss alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulatory/alerts"] });
      toast({ title: "Alert dismissed", description: "The regulatory alert has been dismissed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to dismiss alert.", variant: "destructive" });
    }
  });
  
  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      const response = await fetch(`/api/regulatory/alerts/${alertId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (!response.ok) throw new Error('Failed to resolve alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulatory/alerts"] });
      toast({ title: "Alert resolved", description: "The regulatory alert has been marked as resolved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to resolve alert.", variant: "destructive" });
    }
  });
  
  // Filter alerts by priority and region
  const filteredAlerts = alerts?.alerts?.filter(alert => {
    const matchesPriority = !priorityFilter || alert.priority === priorityFilter;
    return matchesPriority && alert.status === 'active';
  }) || [];
  
  // Get priority color and icon
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return Bell;
      default: return Bell;
    }
  };

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
          value={filteredAlerts.length.toString()}
          change={`${filteredAlerts.filter(a => a.priority === 'high').length} High Priority`}
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
          {/* High Priority Alerts Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Australian Regulatory Intelligence</h3>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-testid="indicator-monitoring"></div>
            </div>
            
            {/* Overall Compliance Score */}
            <div className={`rounded-lg p-4 mb-6 ${(complianceData?.complianceScore || 0) >= 80 ? 'bg-green-100 dark:bg-green-900/20' : (complianceData?.complianceScore || 0) >= 60 ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-red-100 dark:bg-red-900/20'}`} data-testid="card-compliance-score">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Overall Compliance Score</h4>
                  <div className={`text-2xl font-bold ${(complianceData?.complianceScore || 0) >= 80 ? 'text-green-600 dark:text-green-400' : (complianceData?.complianceScore || 0) >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} data-testid="text-compliance-score">
                    {complianceData?.complianceScore || 0}%
                  </div>
                </div>
                <Globe className={`w-8 h-8 ${(complianceData?.complianceScore || 0) >= 80 ? 'text-green-600 dark:text-green-400' : (complianceData?.complianceScore || 0) >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
            </div>
            
            {/* High Priority Alerts */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">High Priority Alerts</h4>
              <div className="space-y-3">
                {filteredAlerts
                  .filter(alert => alert.priority === "high")
                  .slice(0, 2)
                  .map((alert: any, index: number) => (
                  <div key={alert.id} className="border-l-4 border-red-500 pl-4" data-testid={`alert-${index}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{alert.title}</span>
                      <span className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                        High Priority
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{alert.description}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {alert.region?.toUpperCase()} • {alert.impact || 'Compliance Impact'}
                    </p>
                  </div>
                ))}
                
                {filteredAlerts.filter(alert => alert.priority === "high").length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-green-600 dark:text-green-400">No high priority alerts</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {[
                  "Consider implementing additional Green Star initiatives to improve compliance score",
                  "Review NGER reporting processes to ensure timely compliance",
                  "Evaluate Safeguard Mechanism baseline and implement reduction strategies"
                ].map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                View All Alerts
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Generate Report
              </button>
            </div>
          </div>
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

      {/* Alert Notifications with Filtering */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Regulatory Alerts</h3>
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-neutral-500" />
            <span className="text-sm text-neutral-500">{filteredAlerts.length} active alerts</span>
          </div>
        </div>
        
        {/* Filtering Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Filters:</span>
          </div>
          
          {/* Region Filter */}
          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1 text-sm border border-neutral-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral-900 dark:text-white"
            data-testid="filter-region"
          >
            <option value="">All Regions</option>
            <option value="australia">Federal (Australia)</option>
            <option value="nsw">NSW</option>
            <option value="vic">Victoria</option>
            <option value="qld">Queensland</option>
            <option value="wa">Western Australia</option>
            <option value="sa">South Australia</option>
            <option value="tas">Tasmania</option>
            <option value="act">ACT</option>
            <option value="nt">Northern Territory</option>
          </select>
          
          {/* Priority Filter */}
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1 text-sm border border-neutral-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral-900 dark:text-white"
            data-testid="filter-priority"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          {/* Clear Filters */}
          {(selectedRegion || priorityFilter) && (
            <button
              onClick={() => { setSelectedRegion(''); setPriorityFilter(''); }}
              className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              data-testid="button-clear-filters"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {/* Alert List */}
        <div className="space-y-3" data-testid="alerts-list">
          {isLoading ? (
            <div className="text-center py-4 text-neutral-500">Loading alerts...</div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-4 text-neutral-500">
              {alerts?.alerts?.length === 0 ? 'No active regulatory alerts' : 'No alerts match the current filters'}
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const color = getPriorityColor(alert.priority);
              const IconComponent = getPriorityIcon(alert.priority);
              
              return (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border-l-4 border-${color}-500`}
                  data-testid={`alert-${alert.id}`}
                >
                  <IconComponent className={`w-5 h-5 text-${color}-600 mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`font-medium text-${color}-800 dark:text-${color}-300`}>{alert.title}</p>
                        <p className={`text-sm text-${color}-600 dark:text-${color}-400 mt-1`}>{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className={`text-xs text-${color}-500 dark:text-${color}-500`}>
                            {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority • {alert.region?.toUpperCase()}
                          </p>
                          {alert.deadline && (
                            <p className={`text-xs text-${color}-500 dark:text-${color}-500`}>
                              Due: {new Date(alert.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => resolveAlertMutation.mutate(alert.id)}
                          disabled={resolveAlertMutation.isPending}
                          className={`p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 transition-colors disabled:opacity-50`}
                          title="Mark as resolved"
                          data-testid={`button-resolve-${alert.id}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dismissAlertMutation.mutate(alert.id)}
                          disabled={dismissAlertMutation.isPending}
                          className={`p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50`}
                          title="Dismiss alert"
                          data-testid={`button-dismiss-${alert.id}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageShell>
  );
}