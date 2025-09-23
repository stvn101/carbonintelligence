import { useQuery } from "@tanstack/react-query";

interface RegulatoryAlert {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  region: string;
  impact: string;
}

interface RegulatoryAlertsResponse {
  alerts: RegulatoryAlert[];
}

export function RegulatoryIntelligence() {
  const { data: alerts, isLoading, isError } = useQuery<RegulatoryAlertsResponse>({
    queryKey: ["/api/regulatory/alerts"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const regulatoryAlerts = alerts?.alerts || [];

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500";
      case "medium": return "border-amber-500";
      default: return "border-green-500";
    }
  };

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      default: return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Regulatory Intelligence</h3>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {regulatoryAlerts.length > 0 ? regulatoryAlerts.slice(0, 3).map((alert: RegulatoryAlert, index: number) => (
          <div key={index} className={`border-l-4 pl-4 ${getBorderColor(alert.priority)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-900">{alert.title}</span>
              <span className={`text-xs px-2 py-1 rounded ${getBadgeColor(alert.priority)}`}>
                {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-2">{alert.description}</p>
            <p className="text-xs text-neutral-500">
              {alert.region} • {alert.impact}
            </p>
          </div>
        )) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-neutral-400">📋</span>
            </div>
            <p className="text-neutral-500">No regulatory alerts</p>
            <p className="text-sm text-neutral-400">Monitoring regulations across jurisdictions</p>
          </div>
        )}
      </div>

      <button className="w-full mt-4 border border-primary-500 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors">
        View All Alerts
      </button>
    </div>
  );
}
