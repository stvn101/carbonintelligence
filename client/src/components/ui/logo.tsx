import logoLight from "@assets/IMG_1374_1761339152880.png";
import logoDark from "@assets/IMG_1375_1761339152880.png";

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

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 ${className}`}>
      <img 
        src={logoLight} 
        alt="CarbonIntelligence Logo" 
        className="w-full h-full object-contain dark:hidden"
      />
      <img 
        src={logoDark} 
        alt="CarbonIntelligence Logo" 
        className="w-full h-full object-contain hidden dark:block"
      />
    </div>
  );
}
