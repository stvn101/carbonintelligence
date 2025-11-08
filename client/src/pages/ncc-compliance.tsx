import NCCComplianceExample from "@/components/carbon-intelligence/NCCComplianceExample";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";

export function NCCCompliancePage() {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
      <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header onAiChatOpen={() => setAiChatOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <NCCComplianceExample />
        </main>
      </div>
      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
