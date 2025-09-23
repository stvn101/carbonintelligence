import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CarbonBudget } from "@/components/dashboard/carbon-budget";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Budget() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fetch carbon budget data
  const { data: budgetData, isLoading } = useQuery<{
    totalBudget?: string;
    allocatedBudget?: string;
    consumedBudget?: string;
  }>({
    queryKey: ["/api/carbon-budget/2025"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
      <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAiChatOpen={() => setAiChatOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white" data-testid="page-title-budget">Carbon Budget Planning</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Plan and track carbon budgets across your construction portfolio</p>
          </div>

          {/* Carbon Budget Full Width */}
          <div className="grid grid-cols-1 gap-6">
            <CarbonBudget />
          </div>
        </div>
      </div>

      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}