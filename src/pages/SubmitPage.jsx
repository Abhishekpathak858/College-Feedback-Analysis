import React from "react"
import { useNavigate } from "react-router-dom"
import FeedbackForm from "@/components/FeedbackForm"

export default function SubmitPage() {
  const navigate = useNavigate()

  const handleFeedbackSubmitted = (newFeedback) => {
    navigate("/feed")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
    </div>
  )
}
