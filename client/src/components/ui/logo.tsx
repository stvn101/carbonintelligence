import { Leaf } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-white dark:bg-blue-600 flex items-center justify-center transition-colors ${className}`}>
      <Leaf className={`${iconSizes[size]} text-green-600 dark:text-white`} />
    </div>
  );
}
