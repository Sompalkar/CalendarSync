import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/auth/login-screen";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          router.replace("/calendar");
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [router]);

  if (isAuthenticated === null) return null;
  if (isAuthenticated) return null;

  return <LoginScreen />;
}
