"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/modeToggle";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle theme change from switch
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  // Only show the theme options when mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <ModeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for updates and alerts
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked={true} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and promotions
              </p>
            </div>
            <Switch id="marketing" defaultChecked={false} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">Dark mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            {mounted && (
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
          <div className="flex gap-4">
            <Button variant="outline">Change Password</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
