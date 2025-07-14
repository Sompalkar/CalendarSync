"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/auth/login-screen";
import { useUserStore } from "@/store/user-store";

export default function HomePage() {
  const { user, loading, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (user.isGoogleConnected) {
        router.replace("/calendar");
      } else {
        router.replace("/connect-google");
      }
    }
    // eslint-disable-next-line
  }, [user, loading]);

  if (loading) return null;
  if (user) return null;

  return <LoginScreen />;
}
