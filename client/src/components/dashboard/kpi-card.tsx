import { Leaf, DollarSign, TriangleAlert, Target, LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "warning";
  icon: string;
  progress?: number;
  subtitle: string;
}

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  "dollar-sign": DollarSign,
  "exclamation-triangle": TriangleAlert,
  target: Target
};

export function KPICard({ title, value, change, changeType, icon, progress, subtitle }: KPICardProps) {
  const IconComponent = iconMap[icon];
  
  const getChangeColor = () => {
    switch (changeType) {
      case "positive": return "text-primary dark:text-primary bg-primary/20 dark:bg-primary/20";
      case "negative": return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      case "warning": return "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20";
      default: return "text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-gray-700";
    }
  };

  const getIconBg = () => {
    switch (icon) {
      case "leaf": return "bg-primary/20 text-primary";
      case "dollar-sign": return "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case "exclamation-triangle": return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      case "target": return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      default: return "bg-neutral-100 dark:bg-gray-700 text-neutral-600 dark:text-neutral-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg()}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getChangeColor()}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
      {progress !== undefined && (
        <div className="mt-4 bg-neutral-100 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">{subtitle}</p>
    </div>
  );
}
