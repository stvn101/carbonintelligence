import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PlatformIntegrations } from "@/components/dashboard/platform-integrations";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Integrations() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fetch integrations status data
  const { data: integrationsData, isLoading } = useQuery<{
    platforms?: any[];
  }>({
    queryKey: ["/api/integrations/status"],
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
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white" data-testid="page-title-integrations">Platform Integrations</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Connect and sync data from your construction platforms and tools</p>
          </div>

          {/* Platform Integrations Full Width */}
          <div className="grid grid-cols-1 gap-6">
            <PlatformIntegrations />
          </div>
        </div>
      </div>

      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}