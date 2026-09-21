import React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught An Error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-md w-full p-8 rounded-2xl border border-rose-500/20 bg-card shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Something went wrong loading this section
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We encountered a minor display issue. Click below to refresh the page and restore your session safely.
            </p>
            <Button onClick={this.handleReload} className="w-full gap-2 shadow-md">
              <RefreshCw className="w-4 h-4" /> Refresh & Restore Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
