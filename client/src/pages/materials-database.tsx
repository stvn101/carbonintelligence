import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState } from "react";
// @ts-ignore - TODO: Convert EmbodiedCarbonDatabase to TypeScript
import EmbodiedCarbonDatabase from "@/components/carbon-intelligence/EmbodiedCarbonDatabase";

export default function MaterialsDatabasePage() {
    const [aiChatOpen, setAiChatOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
            <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />

            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <Header onAiChatOpen={() => setAiChatOpen(true)} />

                <div className="flex-1 overflow-y-auto">
                    <EmbodiedCarbonDatabase />
                </div>
            </div>

            <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
        </div>
    );
}
