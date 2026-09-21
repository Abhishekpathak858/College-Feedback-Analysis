import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { setReturnTo } from "@/lib/authReturnTo"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    setReturnTo(location.pathname + location.search)
    return <Navigate to="/register" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          Your account role (<span className="font-semibold text-foreground">{user.role}</span>) does not have authorization to access this specific module.
        </p>
      </div>
    )
  }

  return children
}
