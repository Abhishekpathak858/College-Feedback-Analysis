import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import { Card } from "@/components/ui/card"
import { Bookmark } from "lucide-react"

export default function SavedPostsPage() {
  const [savedFeedbacks, setSavedFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSaved() {
      try {
        setLoading(true)
        const allFeedbacks = await base44Client.entities.Feedback.list()
        let localPosts = []
        try {
          localPosts = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
        } catch (e) {}
        const combined = [...localPosts, ...allFeedbacks]
        const unique = Array.from(new Map(combined.map(i => [i.id, i])).values())

        const savedMap = JSON.parse(localStorage.getItem("campushub_saved_posts") || "{}")
        const filteredSaved = unique.filter(f => !!savedMap[f.id])
        setSavedFeedbacks(filteredSaved)
      } catch (err) {
        console.error("Error loading saved posts:", err)
      } finally {
        setLoading(false)
      }
    }
    loadSaved()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl campushub-card border border-blue-500/30 text-white shadow-2xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400" /> Saved Posts
          </h3>
          <p className="text-xs text-slate-300 mt-1">Review feedback, campus announcements, and posts you saved.</p>
        </div>
        <span className="text-xs font-black bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30">
          Total {savedFeedbacks.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs">Loading saved posts...</div>
      ) : savedFeedbacks.length === 0 ? (
        <div className="p-12 text-center campushub-card rounded-3xl border border-blue-500/25 text-white shadow-xl space-y-2">
          <Bookmark className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Saved Posts Yet</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Save any post on Campus Pulse feed using the save icon to view it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedFeedbacks.map((post) => (
            <Card key={post.id} className="campushub-card border-blue-500/25 p-5 shadow-xl rounded-2xl text-white">
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Saved
                  </span>
                  <span className="text-xs font-bold text-blue-300">{post.collegeName}</span>
                </div>
                <span className="text-xs font-bold text-amber-400">⭐ {post.rating}/5</span>
              </div>

              <h4 className="font-bold text-base text-white mt-3">{post.title}</h4>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{post.comment}</p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-blue-500/20">
                <span className="font-bold text-blue-400">Category: {post.category}</span>
                <span className="font-semibold text-slate-400">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Saved"}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
