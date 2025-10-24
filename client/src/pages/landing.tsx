import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, BarChart3, Shield, Zap, TrendingDown, Building2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = `/login?redirect=/`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CarbonIntelligence</h1>
          </div>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="button-login"
          >
            Sign In
          </Button>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Strategic Carbon Management for Construction
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              AI-powered insights for portfolio optimization, regulatory compliance, and carbon budget planning tailored for the Australian construction industry.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" data-testid="card-feature-1">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-gray-900 dark:text-white">Portfolio Optimization</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Analyze emissions across your entire construction portfolio and identify optimization opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" data-testid="card-feature-2">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-gray-900 dark:text-white">Regulatory Compliance</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Stay compliant with NGER and Safeguard Mechanism requirements with automated monitoring.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" data-testid="card-feature-3">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  <CardTitle className="text-gray-900 dark:text-white">AI-Powered Insights</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Leverage GPT-4o for intelligent analysis and strategic recommendations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg mb-16 border border-gray-200 dark:border-gray-700" data-testid="section-key-features">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Comprehensive Carbon Management
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <TrendingDown className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Carbon Budget Planning</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Plan and track carbon budgets with predictive modeling and forecasting.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Building2 className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Platform Integrations</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connect with Procore, Autodesk, Bluebeam, and PlanSwift for seamless data flow.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Leaf className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Material Carbon Tracking</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access Australian-specific emission factors for accurate carbon calculations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Investment Analysis</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Evaluate ROI on carbon reduction initiatives and identify opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ready to transform your carbon management strategy?
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-start-now"
            >
              Start Now
            </Button>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 CarbonIntelligence. Strategic carbon management for the construction industry.</p>
        </footer>
      </div>
    </div>
  );
}
