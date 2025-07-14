"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bell, Lock, Palette, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/user-store";
import { useToast } from "@/components/ui/use-toast";

export function SettingsPage() {
  const { user, loading, logout } = useUserStore();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleConnect = async () => {
    setGoogleLoading(true);
    setError("");
    window.location.href = "/api/auth/google";
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setError("");
    try {
      await logout();
      toast({ title: "Logged out", description: "You have been logged out." });
      window.location.href = "/";
    } catch {
      setError("Logout failed");
      toast({
        title: "Logout failed",
        description: "Could not log out.",
        variant: "destructive",
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user)
    return (
      <div className="p-8 text-center text-red-600">Not authenticated</div>
    );

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    desktop: true,
    eventReminders: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    shareCalendar: false,
    showBusyTime: true,
    allowInvites: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calendar">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-gray-600">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.picture || "/placeholder.svg?height=80&width=80"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-lg">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Name</Label>
                  <Input id="firstName" value={user?.name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    readOnly
                  />
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about events and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Desktop Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Show notifications on your desktop
                    </p>
                  </div>
                  <Switch
                    checked={notifications.desktop}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, desktop: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Event Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Get reminded about upcoming events
                    </p>
                  </div>
                  <Switch
                    checked={notifications.eventReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        eventReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Digest</Label>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of your events
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        weeklyDigest: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Share Calendar</Label>
                    <p className="text-sm text-gray-500">
                      Allow others to view your calendar
                    </p>
                  </div>
                  <Switch
                    checked={privacy.shareCalendar}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, shareCalendar: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Busy Time</Label>
                    <p className="text-sm text-gray-500">
                      Show when you're busy without event details
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showBusyTime}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showBusyTime: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Invites</Label>
                    <p className="text-sm text-gray-500">
                      Let others invite you to events
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowInvites}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowInvites: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Connected Accounts</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-sm font-medium">G</span>
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-gray-500">
                        {user.isGoogleConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {user.isGoogleConnected ? (
                    <Badge variant="secondary">Active</Badge>
                  ) : (
                    <Button
                      onClick={handleGoogleConnect}
                      disabled={googleLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {googleLoading ? "Connecting..." : "Connect Google"}
                    </Button>
                  )}
                </div>
                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Choose your preferred theme
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border-2 border-blue-500 rounded-lg p-3 cursor-pointer">
                      <div className="w-full h-8 bg-white border rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-300">
                      <div className="w-full h-8 bg-gray-900 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-gray-300">
                      <div className="w-full h-8 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Default View</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Choose your default calendar view
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="justify-center bg-transparent"
                    >
                      Month
                    </Button>
                    <Button
                      variant="default"
                      className="justify-center bg-blue-600"
                    >
                      Week
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-center bg-transparent"
                    >
                      Day
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-900">Delete Account</h4>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end mt-8">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
