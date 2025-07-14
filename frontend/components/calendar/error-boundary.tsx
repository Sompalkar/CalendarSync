"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Calendar Error Boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-neutral-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-neutral-900">Something went wrong</CardTitle>
              <CardDescription className="text-neutral-600">
                The calendar encountered an unexpected error. This might be due to a network issue or a temporary
                problem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-neutral-100 p-3 rounded-md">
                  <p className="text-sm font-mono text-neutral-700">{this.state.error.message}</p>
                </div>
              )}
              <div className="flex flex-col space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full bg-neutral-900 hover:bg-neutral-800">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full border-neutral-200"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}
