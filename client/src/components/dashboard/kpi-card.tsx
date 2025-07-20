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
      case "positive": return "text-secondary-700 bg-secondary-100";
      case "negative": return "text-red-700 bg-red-100";
      case "warning": return "text-red-700 bg-red-100";
      default: return "text-neutral-700 bg-neutral-100";
    }
  };

  const getIconBg = () => {
    switch (icon) {
      case "leaf": return "bg-primary-100 text-primary-600";
      case "dollar-sign": return "bg-amber-100 text-amber-600";
      case "exclamation-triangle": return "bg-red-100 text-red-600";
      case "target": return "bg-blue-100 text-blue-600";
      default: return "bg-neutral-100 text-neutral-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg()}`}>
          <IconComponent className="text-lg w-5 h-5" />
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getChangeColor()}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-1">{value}</h3>
      <p className="text-sm text-neutral-500">{title}</p>
      {progress !== undefined && (
        <div className="mt-4 bg-neutral-100 rounded-full h-2">
          <div 
            className="bg-secondary-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
      <p className="text-xs text-neutral-400 mt-2">{subtitle}</p>
    </div>
  );
}
