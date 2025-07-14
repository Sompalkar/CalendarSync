"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDashboard } from "@/components/calendar/calendar-dashboard";
import { useUserStore } from "@/store/user-store";

export default function CalendarPage() {
  const { user, loading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
    } else if (!user.isGoogleConnected) {
      router.replace("/connect-google");
    }
    // eslint-disable-next-line
  }, [user, loading]);

  if (loading || !user || !user.isGoogleConnected) return null;

  return <CalendarDashboard />;
}
