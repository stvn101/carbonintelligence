import { useQuery } from "@tanstack/react-query";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, FileText } from "lucide-react";

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

interface ComplianceFactor {
  category: string;
  score: number;
  weight: number;
}

interface FederalCompliance {
  ngerComplianceStatus: "compliant" | "at_risk" | "non_compliant";
  safeguardThresholdStatus: "below_threshold" | "compliant" | "exceeding";
  currentEmissions: number;
  safeguardBaseline: number;
}

interface ComplianceScoreResponse {
  overallScore: number;
  factors: ComplianceFactor[];
  federalCompliance: FederalCompliance;
  ratingSystemsIntegration: {
    greenStarRatings: number;
    nabersRatings: number;
    nccCompliance: number;
  };
  recommendations: string[];
}

export function RegulatoryIntelligence() {
  const { data: alerts, isLoading: alertsLoading } = useQuery<RegulatoryAlertsResponse>({
    queryKey: ["/api/regulatory/alerts"],
  });

  const { data: complianceScore, isLoading: scoreLoading } = useQuery<ComplianceScoreResponse>({
    queryKey: ["/api/regulatory/compliance-score"],
  });

  if (alertsLoading || scoreLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const regulatoryAlerts = alerts?.alerts || [];
  const score = complianceScore?.overallScore || 0;
  const factors = complianceScore?.factors || [];
  const recommendations = complianceScore?.recommendations || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-amber-100 dark:bg-amber-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-500";
      case "medium": return "border-amber-500";
      default: return "border-green-500";
    }
  };

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300";
      case "medium": return "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300";
      default: return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300";
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "at_risk": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Australian Regulatory Intelligence</h3>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-testid="indicator-monitoring"></div>
      </div>

      {/* Overall Compliance Score */}
      <div className={`rounded-lg p-4 mb-6 ${getScoreBgColor(score)}`} data-testid="card-compliance-score">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Overall Compliance Score</h4>
            <div className={`text-2xl font-bold ${getScoreColor(score)}`} data-testid="text-compliance-score">
              {score}%
            </div>
          </div>
          <TrendingUp className={`w-8 h-8 ${getScoreColor(score)}`} />
        </div>
        
        {/* Federal Compliance Status */}
        {complianceScore?.federalCompliance && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {getComplianceIcon(complianceScore.federalCompliance.ngerComplianceStatus)}
                <span className="text-neutral-600 dark:text-neutral-400">NGER Compliance</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-white" data-testid="status-nger">
                {complianceScore.federalCompliance.ngerComplianceStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {getComplianceIcon(complianceScore.federalCompliance.safeguardThresholdStatus === "below_threshold" ? "compliant" : complianceScore.federalCompliance.safeguardThresholdStatus)}
                <span className="text-neutral-600 dark:text-neutral-400">Safeguard Mechanism</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-white" data-testid="status-safeguard">
                {complianceScore.federalCompliance.safeguardThresholdStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Factors Breakdown */}
      {factors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Compliance Factors</h4>
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between" data-testid={`factor-${factor.category.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{factor.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${factor.score >= 80 ? 'bg-green-500' : factor.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white w-8">{Math.round(factor.score)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Systems Integration */}
      {complianceScore?.ratingSystemsIntegration && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Rating Systems Integration</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
              <div className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="count-green-star">
                {complianceScore.ratingSystemsIntegration.greenStarRatings}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">Green Star</div>
            </div>
            <div className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400" data-testid="count-nabers">
                {complianceScore.ratingSystemsIntegration.nabersRatings}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">NABERS</div>
            </div>
            <div className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400" data-testid="count-ncc">
                {complianceScore.ratingSystemsIntegration.nccCompliance}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">NCC</div>
            </div>
          </div>
        </div>
      )}

      {/* High Priority Alerts */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">High Priority Alerts</h4>
        <div className="space-y-3">
          {regulatoryAlerts
            .filter(alert => alert.priority === "high")
            .slice(0, 2)
            .map((alert: RegulatoryAlert, index: number) => (
            <div key={index} className={`border-l-4 pl-4 ${getBorderColor(alert.priority)}`} data-testid={`alert-${index}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">{alert.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${getBadgeColor(alert.priority)}`}>
                  {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">{alert.description}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {alert.region} • {alert.impact}
              </p>
            </div>
          ))}
          
          {regulatoryAlerts.filter(alert => alert.priority === "high").length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-600 dark:text-green-400">No high priority alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">Recommendations</h4>
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm" data-testid={`recommendation-${index}`}>
                <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-600 dark:text-neutral-400">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button 
          className="flex-1 border border-primary-500 text-primary-600 dark:text-primary-400 py-2 px-4 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          data-testid="button-view-all-alerts"
        >
          View All Alerts
        </button>
        <button 
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          data-testid="button-compliance-report"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
