import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import AuthLayout from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowRight, UserCheck } from "lucide-react"

export default function OAuthConsent() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Authorize Access"
      subtitle="College Feedback System requires student domain permissions."
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">{user?.fullName || "Student Account"}</h4>
              <p className="text-xs text-muted-foreground">{user?.email || "student@college.edu"}</p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-3 space-y-1.5">
            <p className="font-medium text-foreground">Requested Permissions:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>View your department affiliation and year of study</li>
              <li>Submit anonymous and signed feedback reviews</li>
              <li>View personal feedback submission history</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="w-1/2" onClick={() => navigate("/login")}>
            Cancel
          </Button>
          <Button className="w-1/2 gap-1.5" onClick={() => navigate("/")}>
            <span>Allow & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
