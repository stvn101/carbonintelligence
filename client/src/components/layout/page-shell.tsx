import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AIChatModal } from "@/components/dashboard/ai-chat-modal";
import { useState, useEffect } from "react";

interface PageShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
  pageTitle: string;
  pageSubtitle: string;
  metaDescription: string;
  testId: string;
}

export function PageShell({
  children,
  title,
  description,
  pageTitle,
  pageSubtitle,
  metaDescription,
  testId
}: PageShellProps) {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Update document title and meta description
  useEffect(() => {
    document.title = `${title} | CarbonIntelligence`;
    
    // Update meta description
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.setAttribute('content', metaDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaDescription;
      document.head.appendChild(meta);
    }

    // Update Open Graph title
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', `${title} | CarbonIntelligence`);
    } else {
      const ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.content = `${title} | CarbonIntelligence`;
      document.head.appendChild(ogTitle);
    }

    // Update Open Graph description
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) {
      ogDescriptionTag.setAttribute('content', metaDescription);
    } else {
      const ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.content = metaDescription;
      document.head.appendChild(ogDescription);
    }

    // Update Open Graph type
    const ogTypeTag = document.querySelector('meta[property="og:type"]');
    if (!ogTypeTag) {
      const ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      ogType.content = 'website';
      document.head.appendChild(ogType);
    }

    // Update Twitter Card
    const twitterCardTag = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCardTag) {
      const twitterCard = document.createElement('meta');
      twitterCard.name = 'twitter:card';
      twitterCard.content = 'summary_large_image';
      document.head.appendChild(twitterCard);
    }

    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute('content', `${title} | CarbonIntelligence`);
    } else {
      const twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      twitterTitle.content = `${title} | CarbonIntelligence`;
      document.head.appendChild(twitterTitle);
    }

    const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescriptionTag) {
      twitterDescriptionTag.setAttribute('content', metaDescription);
    } else {
      const twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      twitterDescription.content = metaDescription;
      document.head.appendChild(twitterDescription);
    }
  }, [title, metaDescription]);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-gray-950">
      <Sidebar onAiChatOpen={() => setAiChatOpen(true)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onAiChatOpen={() => setAiChatOpen(true)} />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white" data-testid={testId}>
              {pageTitle}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              {pageSubtitle}
            </p>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </div>

      <AIChatModal isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}