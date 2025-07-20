import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

export function PortfolioChart() {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ["/api/portfolio/analysis"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-40 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  const mockTrends = analysis?.trends || [
    { month: "Jan", emissions: 240 },
    { month: "Feb", emissions: 280 },
    { month: "Mar", emissions: 220 },
    { month: "Apr", emissions: 190 },
    { month: "May", emissions: 170 },
    { month: "Jun", emissions: 150 }
  ];

  const maxEmissions = Math.max(...mockTrends.map(t => t.emissions));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Portfolio Carbon Performance</h3>
        <div className="flex items-center space-x-2">
          <select className="text-sm border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded px-3 py-1">
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>YTD</option>
          </select>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="chart-container relative h-64">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {mockTrends.map((trend, index) => (
            <div key={trend.month} className="flex flex-col items-center space-y-2">
              <div 
                className={`rounded-t transition-all duration-700 ${
                  index >= 3 ? 'bg-primary' : 'bg-primary/70'
                }`}
                style={{ 
                  height: `${(trend.emissions / maxEmissions) * 160}px`, 
                  width: "24px" 
                }}
              ></div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{trend.month}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-gray-700">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <div className="w-3 h-3 bg-primary/70 rounded-full inline-block mr-2"></div>
          Current Period
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <div className="w-3 h-3 bg-primary rounded-full inline-block mr-2"></div>
          Target Trajectory
        </div>
      </div>
    </div>
  );
}
