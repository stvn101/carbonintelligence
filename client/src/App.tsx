import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/portfolio" component={Portfolio}/>
      <Route path="/regulatory" component={Regulatory}/>
      <Route path="/reports" component={Reports}/>
      <Route path="/budget" component={Budget}/>
      <Route path="/investments" component={Investments}/>
      <Route path="/ml" component={ML}/>
      <Route path="/integrations" component={Integrations}/>
      <Route path="/settings" component={Settings}/>
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
