"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDashboard } from "@/components/calendar/calendar-dashboard";

export default function CalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return null;

  return <CalendarDashboard />;
}
