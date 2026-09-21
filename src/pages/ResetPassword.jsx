import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Lock, CheckCircle2 } from "lucide-react"

export default function ResetPassword() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Mismatch",
        description: "Please check that passwords match.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Password Updated",
        description: "You may now login with your new credentials.",
        variant: "success",
      })
      navigate("/login")
    }, 600)
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Set a secure password for your college feedback account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          <CheckCircle2 className="w-4 h-4" />
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </AuthLayout>
  )
}
