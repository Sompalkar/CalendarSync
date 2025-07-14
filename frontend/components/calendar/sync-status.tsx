"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  WifiOff,
  Clock,
} from "lucide-react";
import { useCalendarStore } from "@/store/calendar-store";

export function SyncStatus() {
  const { isLoading, error, lastSync, syncEvents, isOnline, syncRetryCount } =
    useCalendarStore();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLastSyncText = () => {
    if (!lastSync) return "Never";
    const diff = currentTime - lastSync;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    }
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds < 10) return "Just now";
    return `${seconds}s ago`;
  };

  const getSyncStatus = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: "Offline",
        variant: "secondary" as const,
        description: "Using cached data",
      };
    }
    if (isLoading) {
      return {
        icon: RefreshCw,
        text: "Syncing...",
        variant: "default" as const,
        description: "Updating events",
      };
    }
    if (error) {
      return {
        icon: AlertCircle,
        text: `Sync Error ${syncRetryCount > 0 ? `(${syncRetryCount})` : ""}`,
        variant: "destructive" as const,
        description: error,
      };
    }
    return {
      icon: CheckCircle,
      text: "Synced",
      variant: "default" as const,
      description: "All events up to date",
    };
  };

  const status = getSyncStatus();
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Badge
          variant={status.variant}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs ${
            status.variant === "default" && !error
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : ""
          }`}
        >
          <StatusIcon
            className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
          />
          <span className="font-medium">{status.text}</span>
        </Badge>
        <div className="flex items-center space-x-1.5 text-xs text-neutral-500">
          <Clock className="h-3 w-3" />
          <span>Last sync: {getLastSyncText()}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {error && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="h-7 px-2 text-xs"
          >
            Reload
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={syncEvents}
          disabled={isLoading || !isOnline}
          className="h-7 px-2 hover:bg-neutral-100"
          title={status.description}
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          <span className="ml-1 text-xs font-medium">Sync</span>
        </Button>
      </div>
    </div>
  );
}
