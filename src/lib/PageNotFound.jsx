import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="w-20 h-20 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-sm border border-destructive/20">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The feedback page or analysis report you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
