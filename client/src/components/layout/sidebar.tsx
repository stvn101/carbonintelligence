import { Leaf, ChartLine, ChartGantt, ShieldHalf, File, Calculator, ChartBar, Bot, Settings, Brain, Zap } from "lucide-react";

interface SidebarProps {
  onAiChatOpen: () => void;
}

export function Sidebar({ onAiChatOpen }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-neutral-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-neutral-900">
            <img 
              src="/attached_assets/A77859E5-E5A0-423F-9B71-25DDB54D6537_1753020499508.png" 
              alt="CarbonConstruct Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">CarbonConstruct AI</h1>
            <p className="text-xs text-neutral-500">Strategic Carbon Agent</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <div className="px-4 space-y-2">
          <div className="bg-primary-50 text-primary-700 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <ChartLine className="text-lg" />
            <span className="font-medium">Strategic Dashboard</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <ChartGantt className="text-lg" />
            <span>Portfolio Optimization</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <ShieldHalf className="text-lg" />
            <span>Regulatory Intelligence</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <File className="text-lg" />
            <span>Compliance Reports</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <Calculator className="text-lg" />
            <span>Carbon Budget Planning</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <ChartBar className="text-lg" />
            <span>Investment Analysis</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <Brain className="text-lg" />
            <span>ML Models & Forecasting</span>
          </div>
          
          <div className="text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer">
            <Zap className="text-lg" />
            <span>Platform Integrations</span>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="px-4 mt-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Bot />
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
