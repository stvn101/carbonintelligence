import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState } from "react";
import LCACalculator from "@/components/carbon-intelligence/LCACalculator";

export default function LCACalculatorPage() {
    const [aiChatOpen, setAiChatOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
            <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />

            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <Header onAiChatOpen={() => setAiChatOpen(true)} />

                <div className="flex-1 overflow-y-auto">
                    <LCACalculator />
                </div>
            </div>

            <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
        </div>
    );
}
