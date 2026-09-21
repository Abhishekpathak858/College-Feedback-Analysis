import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import AdminDashboard from "@/components/AdminDashboard"

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await base44Client.entities.Feedback.list()
      setFeedbacks(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {loading ? (
        <div className="py-20 text-center text-indigo-300">
          Loading Admin Resolution Hub...
        </div>
      ) : (
        <AdminDashboard feedbacks={feedbacks} onUpdate={loadFeedbacks} />
      )}
    </div>
  )
}
