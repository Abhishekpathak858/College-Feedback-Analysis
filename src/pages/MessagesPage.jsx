import React from "react"
import { useLocation } from "react-router-dom"
import Messages from "@/components/Messages"

export default function MessagesPage() {
  const location = useLocation()
  const initialChat = location.state?.initialChat

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Messages initialChat={initialChat} />
    </div>
  )
}
