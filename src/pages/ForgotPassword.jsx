import React, { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { KeyRound, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPassword() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast({
        title: "Password Reset Link Sent",
        description: `Instructions dispatched to ${email}.`,
        variant: "success",
      })
    }, 800)
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your college email address to receive password recovery instructions."
    >
      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Check Your Inbox</h3>
          <p className="text-sm text-muted-foreground">
            We have transmitted a secure password reset link to <span className="font-semibold text-foreground">{email}</span>.
          </p>
          <Button asChild className="w-full">
            <Link to="/login">Return to Sign In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Registered Email Address</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="student@college.edu"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <KeyRound className="w-4 h-4" />
            {loading ? "Sending link..." : "Send Reset Link"}
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
