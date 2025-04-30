"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/modeToggle";
import {
  Bell,
  Key,
  Paintbrush,
  Save,
  Trash,
  User,
  type LucideIcon,
} from "lucide-react";

const Icons = {
  bell: Bell,
  key: Key,
  paintbrush: Paintbrush,
  save: Save,
  trash: Trash,
  user: User,
} satisfies Record<string, LucideIcon>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings.
          </p>
        </div>
        <ModeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="email-notifications">
                Email notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for updates and alerts
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked={true} />
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="marketing">
                Marketing emails
              </Label>
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
          <CardTitle className="flex items-center gap-2">
            <Icons.paintbrush className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the appearance of the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base" htmlFor="theme">
                Dark mode
              </Label>
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
          <CardTitle className="flex items-center gap-2">
            <Icons.user className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Icons.key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Icons.save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
