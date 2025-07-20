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
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Strategic Planning Dashboard</h2>
          <p className="text-sm text-neutral-500">Portfolio-wide carbon performance insights powered by AI</p>
        </div>
        
        {/* AI Query Interface */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask me: How can we reduce portfolio emissions by 25%?"
              className="w-96 px-4 py-2 pl-10 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={queryMutation.isPending}
            />
            <Search className="absolute left-3 top-3 text-neutral-400 w-4 h-4" />
            <button 
              className="absolute right-2 top-2 bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 disabled:opacity-50"
              onClick={handleQuery}
              disabled={queryMutation.isPending}
            >
              {queryMutation.isPending ? "Processing..." : "Ask AI"}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-neutral-600">Live Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
