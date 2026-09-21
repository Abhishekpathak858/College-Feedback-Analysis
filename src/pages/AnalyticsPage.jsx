import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import AIRecommender from "@/components/AIRecommender"

export default function AnalyticsPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await base44Client.entities.Feedback.list()
        setFeedbacks(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {loading ? (
        <div className="py-20 text-center text-indigo-300">
          Loading AI College Discovery & Compare...
        </div>
      ) : (
        <AIRecommender feedbacks={feedbacks} />
      )}
    </div>
  )
}
