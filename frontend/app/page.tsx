"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              CalendarSync
            </span>
          </div>
          <div>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 text-center">
          Your Calendar,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Synchronized
          </span>
        </h1>
        <p className="text-2xl text-gray-600 mb-12 max-w-2xl text-center">
          Experience real-time calendar synchronization with Google Calendar.
          Manage your events seamlessly across all devices with our modern
          interface.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-10 py-6 shadow-lg"
          >
            Get Started
          </Button>
        </Link>
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 mt-24 w-full max-w-5xl">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 mx-auto mb-6">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Real-time Sync
            </h3>
            <p className="text-gray-600 text-lg">
              Changes appear instantly across all your devices with our advanced
              synchronization.
            </p>
          </div>
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 mx-auto mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 text-lg">
              Your calendar data is encrypted and secure with industry-standard
              protection.
            </p>
          </div>
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 mx-auto mb-6">
              <svg
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-600 text-lg">
              Share and collaborate on events with your team members seamlessly.
            </p>
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
