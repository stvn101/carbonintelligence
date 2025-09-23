import { Leaf, ChartLine, ChartGantt, ShieldHalf, File, Calculator, ChartBar, Bot, Settings, Brain, Zap, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

interface SidebarProps {
  onAiChatOpen: () => void;
}

export function Sidebar({ onAiChatOpen }: SidebarProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to determine if a route is active
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    return location === path;
  };

  // Helper function to get navigation item classes
  const getNavItemClasses = (path: string) => {
    return isActive(path)
      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer border border-green-200 dark:border-green-700 shadow-sm transition-all duration-200"
      : "text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200";
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-neutral-200 dark:border-gray-700"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        data-testid="mobile-menu-toggle"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
        ) : (
          <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-200" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          data-testid="mobile-menu-overlay"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-80 min-w-80 max-w-96 
          bg-white dark:bg-gray-900 shadow-lg border-r border-neutral-200 dark:border-gray-700 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        data-testid="sidebar"
      >
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
              <img 
                src="/attached_assets/A77859E5-E5A0-423F-9B71-25DDB54D6537_1753020499508.png" 
                alt="CarbonConstruct Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-neutral-900 dark:text-white truncate">CarbonConstruct Tech</h1>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">AI Agentic Platform V1</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 space-y-3">
          {/* Strategic Dashboard */}
          <Link href="/dashboard" data-testid="nav-dashboard">
            <div className={getNavItemClasses("/dashboard")}>
              <ChartLine className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/dashboard") ? "font-semibold" : "font-medium"}`}>Strategic Dashboard</span>
            </div>
          </Link>
          
          {/* Portfolio Optimization */}
          <Link href="/portfolio" data-testid="nav-portfolio">
            <div className={getNavItemClasses("/portfolio")}>
              <ChartGantt className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/portfolio") ? "font-semibold" : "font-medium"}`}>Portfolio Optimization</span>
            </div>
          </Link>
          
          {/* Regulatory Intelligence */}
          <Link href="/regulatory" data-testid="nav-regulatory">
            <div className={getNavItemClasses("/regulatory")}>
              <ShieldHalf className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/regulatory") ? "font-semibold" : "font-medium"}`}>Regulatory Intelligence</span>
            </div>
          </Link>
          
          {/* Compliance Reports */}
          <Link href="/reports" data-testid="nav-reports">
            <div className={getNavItemClasses("/reports")}>
              <File className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/reports") ? "font-semibold" : "font-medium"}`}>Compliance Reports</span>
            </div>
          </Link>
          
          {/* Carbon Budget Planning */}
          <Link href="/budget" data-testid="nav-budget">
            <div className={getNavItemClasses("/budget")}>
              <Calculator className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/budget") ? "font-semibold" : "font-medium"}`}>Carbon Budget Planning</span>
            </div>
          </Link>
          
          {/* Investment Analysis */}
          <Link href="/investments" data-testid="nav-investments">
            <div className={getNavItemClasses("/investments")}>
              <ChartBar className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/investments") ? "font-semibold" : "font-medium"}`}>Investment Analysis</span>
            </div>
          </Link>
          
          {/* ML Models & Forecasting */}
          <Link href="/ml" data-testid="nav-ml">
            <div className={getNavItemClasses("/ml")}>
              <Brain className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/ml") ? "font-semibold" : "font-medium"}`}>ML Models & Forecasting</span>
            </div>
          </Link>
          
          {/* Platform Integrations */}
          <Link href="/integrations" data-testid="nav-integrations">
            <div className={getNavItemClasses("/integrations")}>
              <Zap className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${isActive("/integrations") ? "font-semibold" : "font-medium"}`}>Platform Integrations</span>
            </div>
          </Link>
        </div>

        {/* AI Assistant Section */}
        <div className="px-4 mt-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Bot className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-base">AI Assistant</span>
            </div>
            <p className="text-sm opacity-95 mb-4 leading-relaxed">Ask strategic questions about your carbon portfolio and get intelligent insights</p>
            <button 
              className="w-full mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/20"
              onClick={onAiChatOpen}
            >
              Start Conversation
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-neutral-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">John Doe</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">Chief Sustainability Officer</p>
          </div>
          <Settings className="text-neutral-500 dark:text-neutral-400 cursor-pointer hover:text-green-600 dark:hover:text-green-400 w-5 h-5 transition-colors flex-shrink-0" />
        </div>
      </div>
      </div>
    </>
  );
}
