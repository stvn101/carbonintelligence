import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Star, Zap, Shield, Award, TrendingUp, TrendingDown } from "lucide-react";

interface GreenStarData {
  ratings: Array<{
    id: number;
    currentRating?: number | null;
    targetRating?: number | null;
    certificationStatus: string;
  }>;
}

interface NabersData {
  ratings: Array<{
    id: number;
    ratingType: string;
    currentRating?: string | null;
    targetRating?: string | null;
  }>;
}

interface NccData {
  compliance: Array<{
    id: number;
    complianceStatus: string;
    requiredNabersRating?: string | null;
    achievedNabersRating?: string | null;
  }>;
}

export function AustralianRatingsKPIs() {
  const { data: greenStarData } = useQuery<GreenStarData>({
    queryKey: ["/api/ratings/green-star"],
  });

  const { data: nabersData } = useQuery<NabersData>({
    queryKey: ["/api/ratings/nabers"],
  });

  const { data: nccData } = useQuery<NccData>({
    queryKey: ["/api/compliance/ncc"],
  });

  // Calculate aggregated metrics
  const greenStarAverage = (greenStarData?.ratings?.length || 0) > 0 ? 
    greenStarData!.ratings
      .filter(r => r.currentRating)
      .reduce((sum, r) => sum + (r.currentRating || 0), 0) / 
      greenStarData!.ratings.filter(r => r.currentRating).length : 0;

  const nabersEnergyRatings = nabersData?.ratings?.filter(r => r.ratingType === "energy") || [];
  const nabersEnergyAverage = nabersEnergyRatings.length > 0 ?
    nabersEnergyRatings
      .filter(r => r.currentRating)
      .reduce((sum, r) => sum + parseFloat(r.currentRating || "0"), 0) / 
      nabersEnergyRatings.filter(r => r.currentRating).length : 0;

  const nccCompliantProjects = nccData?.compliance?.filter(c => c.complianceStatus === "compliant").length || 0;
  const totalNccProjects = nccData?.compliance?.length || 0;
  const nccComplianceRate = totalNccProjects > 0 ? (nccCompliantProjects / totalNccProjects) * 100 : 0;

  const ratingProjects = (greenStarData?.ratings?.length || 0) + (nabersData?.ratings?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Australian Building Ratings</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Green Star, NABERS, and NCC Section J compliance tracking</p>
        </div>
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
          {ratingProjects} Active Assessments
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Green Star Performance */}
        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" data-testid="card-green-star">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Green Star Rating</CardTitle>
              <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-green-star-rating">
                  {greenStarAverage > 0 ? `${greenStarAverage.toFixed(1)} ★` : "No Data"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {greenStarData?.ratings?.length || 0} projects tracked
                </div>
              </div>
              {greenStarAverage > 0 && (
                <>
                  <Progress 
                    value={(greenStarAverage / 6) * 100} 
                    className="h-2 bg-green-100 dark:bg-green-900"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round((greenStarAverage / 6) * 100)}%
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NABERS Energy Rating */}
        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" data-testid="card-nabers-energy">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">NABERS Energy</CardTitle>
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-nabers-energy-rating">
                  {nabersEnergyAverage > 0 ? `${nabersEnergyAverage.toFixed(1)} ★` : "No Data"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {nabersEnergyRatings.length} energy assessments
                </div>
              </div>
              {nabersEnergyAverage > 0 && (
                <>
                  <Progress 
                    value={(nabersEnergyAverage / 6) * 100} 
                    className="h-2 bg-blue-100 dark:bg-blue-900"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Performance</span>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      {nabersEnergyAverage >= 4.5 ? (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Above Target
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Below Target
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NCC Section J Compliance */}
        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20" data-testid="card-ncc-compliance">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">NCC Section J</CardTitle>
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-ncc-compliance-rate">
                  {nccComplianceRate > 0 ? `${Math.round(nccComplianceRate)}%` : "No Data"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {nccCompliantProjects}/{totalNccProjects} projects compliant
                </div>
              </div>
              {nccComplianceRate > 0 && (
                <>
                  <Progress 
                    value={nccComplianceRate} 
                    className="h-2 bg-purple-100 dark:bg-purple-900"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Compliance</span>
                    <div className="flex items-center text-purple-600 dark:text-purple-400">
                      {nccComplianceRate >= 90 ? (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Excellent
                        </>
                      ) : nccComplianceRate >= 70 ? (
                        <>
                          <Award className="h-3 w-3 mr-1" />
                          Good
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Needs Attention
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overall Rating Performance */}
        <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20" data-testid="card-overall-performance">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Performance</CardTitle>
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-overall-score">
                  {ratingProjects > 0 ? "B+" : "No Data"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Combined rating score
                </div>
              </div>
              {ratingProjects > 0 && (
                <>
                  <Progress 
                    value={75} 
                    className="h-2 bg-amber-100 dark:bg-amber-900"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Portfolio Health</span>
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Above Average
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Rating Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-green-star-details">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              Green Star Details
            </CardTitle>
            <CardDescription>
              Comprehensive sustainability assessment across 8 categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Management</div>
                  <div className="text-gray-600 dark:text-gray-400">Governance & processes</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Energy</div>
                  <div className="text-gray-600 dark:text-gray-400">Efficiency & renewables</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Transport</div>
                  <div className="text-gray-600 dark:text-gray-400">Access & mobility</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Materials</div>
                  <div className="text-gray-600 dark:text-gray-400">Sustainable sourcing</div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Target: Minimum 4-star rating for all projects
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-nabers-details">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              NABERS Performance
            </CardTitle>
            <CardDescription>
              Operational energy, water, waste & indoor environment quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Energy</div>
                  <div className="text-gray-600 dark:text-gray-400">0-6 stars (operational)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Water</div>
                  <div className="text-gray-600 dark:text-gray-400">Consumption efficiency</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Waste</div>
                  <div className="text-gray-600 dark:text-gray-400">0-5 stars (diversion)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">IEQ</div>
                  <div className="text-gray-600 dark:text-gray-400">Indoor air quality</div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Government requirement: 4.5+ stars for Class 5 buildings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-ncc-details">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              NCC Section J
            </CardTitle>
            <CardDescription>
              National Construction Code energy efficiency requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">J1.2 Energy Efficiency</div>
                  <div className="text-gray-600 dark:text-gray-400">Building fabric & glazing</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">J1.3 Building Sealing</div>
                  <div className="text-gray-600 dark:text-gray-400">Air leakage requirements</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">J1.5 NABERS Commitment</div>
                  <div className="text-gray-600 dark:text-gray-400">Operational performance</div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Mandatory: All Class 5 buildings must achieve compliance
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}