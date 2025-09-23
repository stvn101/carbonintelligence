import { useQuery } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import type { CarbonBudget } from "@shared/schema";

interface BudgetForecast {
  recommendations: string[];
}

interface CarbonBudgetResponse {
  budget: CarbonBudget;
  forecast: BudgetForecast;
}

export function CarbonBudget() {
  const currentYear = new Date().getFullYear();
  
  const { data: budgetData, isLoading, isError } = useQuery<CarbonBudgetResponse>({
    queryKey: [`/api/carbon-budget/${currentYear}`],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-neutral-200 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const budget = budgetData?.budget;
  const forecast = budgetData?.forecast;
  
  // Default values if no data
  const allocated = parseFloat(budget?.allocatedBudget || "2800000");
  const consumed = parseFloat(budget?.consumedBudget || "2100000");
  const remaining = allocated - consumed;
  const progressPercent = allocated > 0 ? (consumed / allocated * 100) : 0;

  const categories = [
    { name: "Materials", amount: "1.4M tCO₂e", percentage: "50%", color: "bg-blue-500" },
    { name: "Transportation", amount: "0.7M tCO₂e", percentage: "25%", color: "bg-green-500" },
    { name: "Energy", amount: "0.5M tCO₂e", percentage: "18%", color: "bg-purple-500" },
    { name: "Other", amount: "0.2M tCO₂e", percentage: "7%", color: "bg-orange-500" }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Carbon Budget Planning</h3>
        <select className="text-sm border border-neutral-300 rounded px-3 py-1">
          <option>FY {currentYear}</option>
          <option>FY {currentYear + 1}</option>
          <option>FY {currentYear + 2}</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Budget Overview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-neutral-900">{formatNumber(allocated)}</div>
            <div className="text-xs text-neutral-500">Allocated (tCO₂e)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-600">{formatNumber(consumed)}</div>
            <div className="text-xs text-neutral-500">Consumed (tCO₂e)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-secondary-600">{formatNumber(remaining)}</div>
            <div className="text-xs text-neutral-500">Remaining (tCO₂e)</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-neutral-600">Budget Progress</span>
            <span className="text-neutral-900 font-medium">{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-500 to-red-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-neutral-500 mt-1">Based on current consumption rate</div>
        </div>

        {/* Allocation by Category */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">Budget Allocation</h4>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                  <span className="text-sm text-neutral-700">{category.name}</span>
                </div>
                <div className="text-sm font-medium text-neutral-900">{category.amount} ({category.percentage})</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Forecast */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="text-blue-600 w-4 h-4" />
            <span className="font-medium text-blue-900">AI Forecast</span>
          </div>
          <p className="text-sm text-blue-800">
            {forecast?.recommendations?.[0] || 
             "At current trajectory, you'll exceed budget by 180k tCO₂e. Implementing suggested optimizations could reduce overrun to 45k tCO₂e."}
          </p>
        </div>
      </div>
    </div>
  );
}
