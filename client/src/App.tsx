import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Portfolio from "@/pages/portfolio";
import Regulatory from "@/pages/regulatory";
import Reports from "@/pages/reports";
import Budget from "@/pages/budget";
import Investments from "@/pages/investments";
import ML from "@/pages/ml";
import Integrations from "@/pages/integrations";
import Settings from "@/pages/settings";
import CarbonIntelligenceProof from "@/ui/components/CarbonIntelligenceProof";
import CarbonDashboard from "@/pages/carbon-dashboard";
import MaterialComparison from "@/pages/material-comparison";
import ProjectAnalysisPage from "@/pages/project-analysis";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/demo" component={CarbonIntelligenceProof} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/regulatory" component={Regulatory} />
      <Route path="/reports" component={Reports} />
      <Route path="/budget" component={Budget} />
      <Route path="/investments" component={Investments} />
      <Route path="/ml" component={ML} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/settings" component={Settings} />
      <Route path="/carbon-dashboard" component={CarbonDashboard} />
      <Route path="/material-comparison" component={MaterialComparison} />
      <Route path="/project-analysis" component={ProjectAnalysisPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="carbonconstruct-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
