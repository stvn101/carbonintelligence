import { Leaf, ChartLine, ChartGantt, ShieldHalf, File, Calculator, ChartBar, Bot, Settings, Brain, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarProps {
  onAiChatOpen: () => void;
}

export function Sidebar({ onAiChatOpen }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-neutral-200 dark:border-gray-700 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-primary">
              <img 
                src="/attached_assets/A77859E5-E5A0-423F-9B71-25DDB54D6537_1753020499508.png" 
                alt="CarbonConstruct Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900 dark:text-white">CarbonConstruct Tech</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">AI Agentic V1</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <div className="px-4 space-y-2">
          <div className="bg-primary/20 text-primary rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer border border-primary/30">
            <ChartLine className="w-5 h-5" />
            <span className="font-medium">Strategic Dashboard</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <ChartGantt className="w-5 h-5" />
            <span>Portfolio Optimization</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <ShieldHalf className="w-5 h-5" />
            <span>Regulatory Intelligence</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <File className="w-5 h-5" />
            <span>Compliance Reports</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <Calculator className="w-5 h-5" />
            <span>Carbon Budget Planning</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <ChartBar className="w-5 h-5" />
            <span>Investment Analysis</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <Brain className="w-5 h-5" />
            <span>ML Models & Forecasting</span>
          </div>
          
          <div className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors">
            <Zap className="w-5 h-5" />
            <span>Platform Integrations</span>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="px-4 mt-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <p className="text-xs opacity-90">Ask strategic questions about your carbon portfolio</p>
            <button 
              className="mt-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-3 py-1 text-xs transition-colors"
              onClick={onAiChatOpen}
            >
              Start Conversation
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">John Doe</p>
            <p className="text-xs text-neutral-500">Chief Sustainability Officer</p>
          </div>
          <Settings className="text-neutral-500 cursor-pointer hover:text-neutral-700 w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
