"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Shield, Zap, Users } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/store/user-store";
import { useToast } from "@/components/ui/use-toast";

export function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, register, loading, error } = useUserStore();
  const { toast } = useToast();
  const [localError, setLocalError] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    let success = false;
    if (mode === "login") {
      success = await login(email, password);
      if (!success) {
        setLocalError("Login failed. Please check your credentials.");
        toast({
          title: "Login failed",
          description: error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } else {
      if (!name.trim()) {
        setLocalError("Name is required for registration.");
        return;
      }
      success = await register(name, email, password);
      if (!success) {
        setLocalError("Registration failed. Please try again.");
        toast({
          title: "Registration failed",
          description: error || "Could not register",
          variant: "destructive",
        });
      }
    }
    // On success, the zustand store will trigger a redirect via the page logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              CalendarSync
            </span>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Calendar,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Synchronized
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience real-time calendar synchronization with Google
              Calendar. Manage your events seamlessly across all devices with
              our modern interface.
            </p>
            <Card className="max-w-md mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">
                  {mode === "login" ? "Login" : "Register"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in with your email and password or connect Google."
                    : "Create an account with your email and password."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                  {(localError || error) && (
                    <div className="text-red-600 text-sm">
                      {localError || error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
                    size="lg"
                    disabled={loading}
                  >
                    {loading
                      ? "Loading..."
                      : mode === "login"
                      ? "Login"
                      : "Register"}
                  </Button>
                </form>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() =>
                      setMode(mode === "login" ? "register" : "login")
                    }
                  >
                    {mode === "login"
                      ? "Create an account"
                      : "Already have an account? Login"}
                  </button>
                </div>
                <div className="my-4 text-center text-gray-500 text-xs">or</div>
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full h-12 text-base font-medium bg-red-500 hover:bg-red-600 transition-colors"
                  size="lg"
                  type="button"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Sync
              </h3>
              <p className="text-gray-600">
                Changes appear instantly across all your devices with our
                advanced synchronization
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your calendar data is encrypted and secure with
                industry-standard protection
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Share and collaborate on events with your team members
                seamlessly
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2024 CalendarSync. Built with Next.js and Google Calendar
              API.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
