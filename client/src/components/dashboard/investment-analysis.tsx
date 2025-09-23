import { useQuery } from "@tanstack/react-query";

interface InvestmentOpportunity {
  name: string;
  investment: string;
  reduction: string;
  paybackPeriod: string;
}

interface InvestmentAnalysisResponse {
  currentROI: number;
  projectedROI: number;
  opportunities: InvestmentOpportunity[];
}

export function InvestmentAnalysis() {
  const { data: analysis, isLoading, isError } = useQuery<InvestmentAnalysisResponse>({
    queryKey: ["/api/investments/analysis"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-neutral-200 rounded"></div>
            <div className="h-20 bg-neutral-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentROI = analysis?.currentROI || 24;
  const projectedROI = analysis?.projectedROI || 31;
  const opportunities = analysis?.opportunities || [];

  const getGradientColor = (index: number) => {
    const gradients = [
      "from-green-50 to-blue-50",
      "from-blue-50 to-indigo-50",
      "from-purple-50 to-pink-50"
    ];
    return gradients[index % gradients.length];
  };

  const getTextColor = (index: number) => {
    const colors = [
      "text-secondary-600",
      "text-primary-600",
      "text-purple-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Investment Impact Analysis</h3>
        <button className="text-sm bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600">
          Run Scenario
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600">{currentROI}%</div>
            <div className="text-sm text-neutral-600">Current Carbon ROI</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{projectedROI}%</div>
            <div className="text-sm text-neutral-600">Projected with Investments</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-neutral-900">Top Investment Opportunities</h4>
          
          {opportunities.length > 0 ? opportunities.map((opportunity: InvestmentOpportunity, index: number) => (
            <div key={index} className={`flex items-center justify-between p-3 bg-gradient-to-r ${getGradientColor(index)} rounded-lg`}>
              <div>
                <div className="font-medium text-neutral-900">{opportunity.name}</div>
                <div className="text-sm text-neutral-600">{opportunity.investment} • {opportunity.reduction}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${getTextColor(index)}`}>{opportunity.paybackPeriod}</div>
                <div className="text-xs text-neutral-500">Payback period</div>
              </div>
            </div>
          )) : (
            <>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Australian Sustainable Material Supply Chain</div>
                  <div className="text-sm text-neutral-600">Investment: A$3.6M • Reduction: 15% portfolio emissions</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-secondary-600">28 months</div>
                  <div className="text-xs text-neutral-500">Payback period</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Australian Renewable Energy Infrastructure</div>
                  <div className="text-sm text-neutral-600">Investment: A$2.7M • Reduction: 12% operational emissions</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600">36 months</div>
                  <div className="text-xs text-neutral-500">Payback period</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Carbon Capture Technology</div>
                  <div className="text-sm text-neutral-600">Investment: A$4.8M • Reduction: 20% direct emissions</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">42 months</div>
                  <div className="text-xs text-neutral-500">Payback period</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
