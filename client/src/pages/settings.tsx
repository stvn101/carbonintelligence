import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { User, Bell, Shield, Palette, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully"
    });
  };

  return (
    <PageShell
      title="Settings - CarbonIntelligence"
      description="Manage your account preferences and application settings"
      pageTitle="Settings"
      pageSubtitle="Manage your account preferences and application settings"
      metaDescription="Configure your CarbonIntelligence account settings, notifications, and preferences"
      testId="page-settings"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-700">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Privacy & Security</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors">
                <Palette className="w-5 h-5" />
                <span className="font-medium">Appearance</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors">
                <Database className="w-5 h-5" />
                <span className="font-medium">Data & Storage</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-200 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors">
                <Key className="w-5 h-5" />
                <span className="font-medium">API Keys</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  data-testid="input-full-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Job Title</label>
                <input 
                  type="text" 
                  defaultValue="Chief Sustainability Officer"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  data-testid="input-job-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="john.doe@company.com"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Company</label>
                <input 
                  type="text" 
                  defaultValue="Global Construction Group"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  data-testid="input-company"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive email updates about your carbon portfolio</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Regulatory Alerts</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified about new compliance requirements</p>
                </div>
                <Switch 
                  checked={alertNotifications}
                  onCheckedChange={setAlertNotifications}
                  data-testid="switch-alert-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Weekly Reports</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive weekly carbon performance summaries</p>
                </div>
                <Switch 
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                  data-testid="switch-weekly-reports"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2"
              data-testid="button-save-settings"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
