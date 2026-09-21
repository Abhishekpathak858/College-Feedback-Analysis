import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import { useAuth } from "@/lib/AuthContext"
import { Image, Trash2 } from "lucide-react"

export default function MyPostsPage() {
  const { user } = useAuth()
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    try {
      setLoading(true)
      const allFeedbacks = await base44Client.entities.Feedback.list()
      let localPosts = []
      try {
        localPosts = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
      } catch (e) {}
      const combined = [...localPosts, ...allFeedbacks]
      const unique = Array.from(new Map(combined.map(i => [i.id, i])).values())

      const userPosts = unique.filter(post => 
        (post.studentEmail && user?.email && post.studentEmail.toLowerCase() === user.email.toLowerCase()) ||
        (post.authorName && user?.fullName && post.authorName.toLowerCase() === user.fullName.toLowerCase()) ||
        (localPosts.some(lp => lp.id === post.id))
      )
      setMyPosts(userPosts)
    } catch (err) {
      console.error("Error loading my posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [user])

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    try {
      await base44Client.entities.Feedback.delete(postId)
      try {
        const localPosts = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
        const updatedLocal = localPosts.filter(p => p.id !== postId)
        localStorage.setItem("campushub_user_posts", JSON.stringify(updatedLocal))
      } catch (e) {}
      setMyPosts(prev => prev.filter(p => p.id !== postId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="p-6 rounded-3xl campushub-card border border-blue-500/30 text-white shadow-2xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-2">
            <Image className="w-6 h-6 text-blue-400" /> My Posts
          </h3>
          <p className="text-xs text-slate-300 mt-1">Manage and view your published campus feedback and posts.</p>
        </div>
        <span className="text-xs font-black bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30">
          Total {myPosts.length} Posts
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs">Loading your posts...</div>
      ) : myPosts.length === 0 ? (
        <div className="p-12 text-center campushub-card rounded-3xl border border-blue-500/25 text-white shadow-xl space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-950/60 flex items-center justify-center text-blue-400 border border-blue-500/30">
            <Image className="w-7 h-7" />
          </div>
          <h4 className="text-base font-black text-white">No Posts Published Yet</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            You haven't published any campus posts yet. Share your campus experience from the feed!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myPosts.map((post) => (
            <div key={post.id} className="campushub-card border border-blue-500/25 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-blue-400/40 transition-colors">
              {post.evidencePhotoUrl ? (
                <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {post.evidencePhotoUrl.includes("video") ? (
                    <video src={post.evidencePhotoUrl} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={post.evidencePhotoUrl} alt="Post Media" className="w-full h-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="h-28 bg-blue-950/40 flex items-center justify-center p-4 text-center border-b border-blue-500/20">
                  <span className="text-xs font-black text-white line-clamp-2">{post.title}</span>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {post.category || "Campus Post"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : "Recently"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white line-clamp-1">{post.title}</h4>
                  {post.comment && (
                    <p className="text-xs text-slate-300 font-medium line-clamp-2 mt-1">{post.comment}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Live on Pulse
                  </span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
