import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { UserX, UserPlus, LogIn } from "lucide-react"

export default function UserNotRegisteredError({ email }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
        <UserX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Account Not Found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {email ? (
          <>No registered college account found for <span className="font-semibold text-foreground">{email}</span>.</>
        ) : (
          "We could not locate your user account in the college registry."
        )}
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/login" className="gap-1.5">
            <LogIn className="w-4 h-4" /> Try Again
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/register" className="gap-1.5">
            <UserPlus className="w-4 h-4" /> Create Student Account
          </Link>
        </Button>
      </div>
    </div>
  )
}
