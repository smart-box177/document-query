import { useState } from "react";
import {
  Save,
  Database,
  Shield,
  Bell,
  Globe,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "NCCC Data Query",
    maxSearchResults: 20,
    enableAISummaries: true,
    enableNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General
          </CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, siteName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxResults">Max Search Results</Label>
            <Input
              id="maxResults"
              type="number"
              value={settings.maxSearchResults}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maxSearchResults: parseInt(e.target.value) || 20,
                }))
              }
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of results returned per search query
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Features
          </CardTitle>
          <CardDescription>Enable or disable system features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Summaries</Label>
              <p className="text-sm text-muted-foreground">
                Generate AI-powered document summaries in search results
              </p>
            </div>
            <Switch
              checked={settings.enableAISummaries}
              onCheckedChange={() => handleToggle("enableAISummaries")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable system notifications for users
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={() => handleToggle("enableNotifications")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Authentication and access settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow new users to create accounts
              </p>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={() => handleToggle("allowRegistration")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">
                Users must verify email before accessing the system
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={() => handleToggle("requireEmailVerification")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Maintenance
          </CardTitle>
          <CardDescription>System maintenance options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                Maintenance Mode
                {settings.maintenanceMode && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-500 text-white rounded">
                    Active
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, only admins can access the system
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={() => handleToggle("maintenanceMode")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save indicator */}
      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4" />
        All changes are saved automatically
      </div>
    </div>
  );
};

export default Settings;
