import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Zap, CheckCircle, AlertCircle, XCircle, RefreshCw, 
  Settings, Download, Upload, Calendar, Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Platform {
  platform: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  dataTypes: string[];
  carbonImpact: number;
  projectCount: number;
}

interface SyncHistory {
  platform: string;
  status: "success" | "error";
  timestamp: string;
  records: number;
}

export function PlatformIntegrations() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const { toast } = useToast();

  const { data: integrations, isLoading, isError } = useQuery<{ platforms: Platform[] }>({
    queryKey: ["/api/integrations/status"],
  });

  const { data: syncData } = useQuery<{ history: SyncHistory[] }>({
    queryKey: ["/api/integrations/sync-history"],
  });

  const syncMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest("POST", "/api/integrations/sync", { platform });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sync Complete",
        description: `Successfully synced data from ${data.platform}`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/status"] });
    },
    onError: () => {
      toast({
        title: "Sync Failed", 
        description: "Unable to sync platform data. Check your API credentials.",
        variant: "destructive"
      });
    }
  });

  const configureMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await apiRequest("POST", "/api/integrations/configure", config);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "Platform integration settings have been saved"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/status"] });
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const platformData = integrations?.platforms || [
    {
      platform: "procore",
      name: "Procore",
      status: "connected",
      lastSync: "2 hours ago",
      dataTypes: ["projects", "materials", "costs"],
      carbonImpact: 2400,
      projectCount: 12
    },
    {
      platform: "autodesk",
      name: "Autodesk Construction Cloud", 
      status: "connected",
      lastSync: "4 hours ago",
      dataTypes: ["models", "drawings", "quantities"],
      carbonImpact: 1800,
      projectCount: 8
    },
    {
      platform: "bluebeam",
      name: "Bluebeam Studio",
      status: "error",
      lastSync: "3 days ago",
      dataTypes: ["documents", "takeoffs"],
      carbonImpact: 0,
      projectCount: 0
    },
    {
      platform: "planswift",
      name: "PlanSwift",
      status: "disconnected",
      lastSync: "Never",
      dataTypes: ["takeoffs", "estimates"],
      carbonImpact: 0,
      projectCount: 0
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-5 h-5 text-secondary-600" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "disconnected": return <XCircle className="w-5 h-5 text-neutral-400" />;
      default: return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-secondary-50 border-secondary-200";
      case "error": return "bg-red-50 border-red-200";
      case "disconnected": return "bg-neutral-50 border-neutral-200";
      default: return "bg-amber-50 border-amber-200";
    }
  };

  const getButtonVariant = (status: string) => {
    switch (status) {
      case "connected": return "outline";
      case "error": return "destructive";
      case "disconnected": return "default";
      default: return "outline";
    }
  };

  const filteredPlatforms = selectedPlatform === "all" 
    ? platformData 
    : platformData.filter((p: Platform) => p?.status === selectedPlatform);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="text-primary-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-neutral-900">Platform Integrations</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="text-sm border border-neutral-300 rounded px-3 py-1"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="connected">Connected</option>
            <option value="error">Needs Attention</option>
            <option value="disconnected">Disconnected</option>
          </select>
          <Button 
            size="sm"
            onClick={() => syncMutation.mutate("all")}
            disabled={syncMutation.isPending}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Platform Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlatforms.map((platform: Platform) => (
            <div key={platform.platform} className={`border rounded-lg p-4 ${getStatusColor(platform.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(platform.status)}
                  <h4 className="font-medium text-neutral-900">{platform.name}</h4>
                </div>
                <Button 
                  size="sm"
                  variant={getButtonVariant(platform.status) as any}
                  onClick={() => {
                    if (platform.status === "connected") {
                      syncMutation.mutate(platform.platform);
                    } else {
                      // Trigger configuration modal or setup
                      toast({
                        title: "Setup Required",
                        description: `Configure ${platform.name} integration in settings`
                      });
                    }
                  }}
                  disabled={syncMutation.isPending}
                >
                  {platform.status === "connected" ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sync
                    </>
                  ) : platform.status === "error" ? (
                    <>
                      <Settings className="w-3 h-3 mr-1" />
                      Fix
                    </>
                  ) : (
                    <>
                      <Settings className="w-3 h-3 mr-1" />
                      Setup
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Status:</span>
                  <span className={`font-medium ${
                    platform?.status === 'connected' ? 'text-secondary-600' :
                    platform?.status === 'error' ? 'text-red-600' :
                    'text-neutral-500'
                  }`}>
                    {platform?.status ? 
                      platform.status.charAt(0).toUpperCase() + platform.status.slice(1) : 
                      'Unknown'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Last Sync:</span>
                  <span className="text-neutral-900">{platform.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Projects:</span>
                  <span className="text-neutral-900">{platform.projectCount || 0}</span>
                </div>
                {platform.carbonImpact > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Carbon Data:</span>
                    <span className="text-neutral-900">{(platform.carbonImpact || 0).toLocaleString()} tCO₂e</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-200">
                <div className="flex flex-wrap gap-1">
                  {platform.dataTypes.map((type: string) => (
                    <span key={type} className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sync History */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            Recent Sync Activity
          </h4>
          <div className="space-y-2">
            {(syncData?.history || [
              { platform: "Procore", status: "success", timestamp: "2 hours ago", records: 245 },
              { platform: "Autodesk", status: "success", timestamp: "4 hours ago", records: 189 },
              { platform: "Bluebeam", status: "error", timestamp: "3 days ago", records: 0 }
            ] as SyncHistory[]).map((sync: SyncHistory, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded">
                <div className="flex items-center space-x-3">
                  {sync.status === "success" ? 
                    <CheckCircle className="w-4 h-4 text-secondary-600" /> :
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  }
                  <span className="font-medium text-neutral-900">{sync.platform}</span>
                  <span className="text-sm text-neutral-600">{sync.timestamp}</span>
                </div>
                <div className="text-sm text-neutral-500">
                  {sync.records > 0 ? `${sync.records} records` : "Failed"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carbon Impact Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
          <h4 className="font-medium text-neutral-900 mb-2 flex items-center">
            <Download className="w-4 h-4 mr-2 text-primary-600" />
            Integration Carbon Impact
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary-600">
                {platformData.reduce((sum: number, p: Platform) => sum + (p.carbonImpact || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-neutral-600">Total tCO₂e Tracked</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary-600">
                {platformData.reduce((sum: number, p: Platform) => sum + (p.projectCount || 0), 0)}
              </div>
              <div className="text-xs text-neutral-600">Projects Synced</div>
            </div>
            <div>
              <div className="text-lg font-bold text-neutral-900">
                {platformData.filter((p: Platform) => p.status === "connected").length}
              </div>
              <div className="text-xs text-neutral-600">Active Integrations</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-neutral-200">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Manage Integrations
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import Data
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-1" />
            Schedule Sync
          </Button>
        </div>
      </div>
    </div>
  );
}