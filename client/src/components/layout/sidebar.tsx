import { Leaf, ChartLine, ChartGantt, ShieldHalf, File, Calculator, ChartBar, Bot, Settings, Brain, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarProps {
  onAiChatOpen: () => void;
}

export function Sidebar({ onAiChatOpen }: SidebarProps) {
  return (
    <div className="w-80 min-w-80 max-w-96 bg-white dark:bg-gray-900 shadow-lg border-r border-neutral-200 dark:border-gray-700 flex flex-col">
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
          {/* Strategic Dashboard - Active State */}
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer border border-green-200 dark:border-green-700 shadow-sm">
            <ChartLine className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm">Strategic Dashboard</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <ChartGantt className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Portfolio Optimization</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <ShieldHalf className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Regulatory Intelligence</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <File className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Compliance Reports</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <Calculator className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Carbon Budget Planning</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <ChartBar className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Investment Analysis</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <Brain className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">ML Models & Forecasting</span>
          </div>
          
          <div className="text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-700 dark:hover:text-green-300 rounded-xl px-4 py-4 flex items-center space-x-3 cursor-pointer transition-all duration-200">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Platform Integrations</span>
          </div>
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
  );
}
