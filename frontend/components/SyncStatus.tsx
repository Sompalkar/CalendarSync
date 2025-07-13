"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { useCalendarStore } from "@/store/calendar-store"

export function SyncStatus() {
  const { isLoading, error, lastSync, syncEvents } = useCalendarStore()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getLastSyncText = () => {
    if (!lastSync) return "Never"
    const diff = Date.now() - lastSync
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    if (minutes > 0) return `${minutes}m ago`
    return `${seconds}s ago`
  }

  const getSyncStatus = () => {
    if (!isOnline) return { icon: WifiOff, text: "Offline", variant: "secondary" as const }
    if (isLoading) return { icon: RefreshCw, text: "Syncing...", variant: "default" as const }
    if (error) return { icon: AlertCircle, text: "Sync Error", variant: "destructive" as const }
    return { icon: CheckCircle, text: "Synced", variant: "success" as const }
  }

  const status = getSyncStatus()
  const StatusIcon = status.icon

  return (
    <div className="flex items-center space-x-3">
      <Badge variant={status.variant} className="flex items-center space-x-1">
        <StatusIcon className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
        <span>{status.text}</span>
      </Badge>

      <span className="text-xs text-gray-500">Last sync: {getLastSyncText()}</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={syncEvents}
        disabled={isLoading || !isOnline}
        className="h-8 px-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}