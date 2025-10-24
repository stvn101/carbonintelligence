import { Search } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onAiChatOpen: () => void;
}

export function Header({ onAiChatOpen }: HeaderProps) {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/query", { query });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Analysis Complete",
        description: "View the detailed response in the AI chat."
      });
      onAiChatOpen();
    },
    onError: () => {
      toast({
        title: "Query Failed",
        description: "Unable to process your query. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleQuery = () => {
    if (query.trim()) {
      queryMutation.mutate(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  return (
    <>
      {/* Desktop/Tablet Header */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Strategic Planning Dashboard</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Portfolio-wide carbon performance insights powered by AI</p>
          </div>
          
          {/* AI Query Interface */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me: How can we reduce portfolio emissions by 25%?"
                className="w-96 px-4 py-2 pl-10 pr-12 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={queryMutation.isPending}
              />
              <Search className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500 w-4 h-4" />
              <button 
                className="absolute right-2 top-2 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                onClick={handleQuery}
                disabled={queryMutation.isPending}
              >
                {queryMutation.isPending ? "Processing..." : "Ask AI"}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header - Compact */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-700 pl-16 pr-4 py-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">Strategic Planning</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">AI Carbon Management</p>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">Live</span>
          </div>
        </div>
      </div>

      {/* Mobile Chat Bar - Fixed at Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-neutral-200 dark:border-gray-700 px-4 py-3 shadow-lg">
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Ask AI: Reduce emissions..."
            className="w-full px-4 py-3 pl-10 pr-20 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={queryMutation.isPending}
            data-testid="mobile-ai-chat-input"
          />
          <Search className="absolute left-3 top-3.5 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
          <button 
            className="absolute right-2 top-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
            onClick={handleQuery}
            disabled={queryMutation.isPending}
            data-testid="mobile-ai-chat-send"
          >
            {queryMutation.isPending ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </>
  );
}
