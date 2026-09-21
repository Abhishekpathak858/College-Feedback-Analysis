import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { base44Client } from "@/api/base44Client"
import { useAuth } from "@/lib/AuthContext"
import SocialFeed from "@/components/SocialFeed"
import { Search, Filter, Flame, RefreshCw, Plus, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function FeedPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "Student"
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)
  const navigate = useNavigate()

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await base44Client.entities.Feedback.list()
      
      // Merge with newly created posts saved in localStorage
      let localPosts = []
      try {
        localPosts = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
      } catch {}

      // Deduplicate posts by ID so duplicate items never render twice (server data takes precedence)
      const combined = [...localPosts, ...data]
      const uniquePosts = Array.from(new Map(combined.filter(Boolean).map(item => [item.id, item])).values())

      // STRICT: Only keep posts created with photo or video (via '+' button). Exclude pure review data.
      const mediaPostsOnly = uniquePosts.filter(item => {
        return Boolean(item.evidencePhotoUrl || item.mediaUrl || item.isMediaPost)
      })

      // Sync local storage so corrected server posts overwrite any stale local cache
      if (localPosts.length > 0 && data.length > 0) {
        const serverMap = new Map(data.map(d => [d.id, d]))
        const updatedLocal = localPosts.map(p => serverMap.get(p.id) || p)
        try {
          localStorage.setItem("campushub_user_posts", JSON.stringify(updatedLocal))
        } catch {}
      }

      setFeedbacks(mediaPostsOnly)
    } catch (e) {
      console.error("Error loading feedbacks:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()

    // Check unread notifications count
    const updateUnreadCount = () => {
      try {
        const saved = localStorage.getItem("campussphere_notifications_list")
        if (saved) {
          const parsed = JSON.parse(saved)
          const realNotifs = Array.isArray(parsed) ? parsed.filter(n => n && !n.id?.toString().startsWith("notif-")) : []
          setUnreadNotifCount(realNotifs.filter(n => !n.isRead).length)
        } else {
          setUnreadNotifCount(0)
        }
      } catch {
        setUnreadNotifCount(0)
      }
    }
    updateUnreadCount()
    window.addEventListener("focus", updateUnreadCount)

    // Real-time listener for newly created posts (with deduplication & media check)
    const handleNewPost = (e) => {
      if (e.detail && (e.detail.evidencePhotoUrl || e.detail.mediaUrl || e.detail.isMediaPost)) {
        setFeedbacks(prev => {
          if (prev.some(p => p.id === e.detail.id)) return prev
          return [e.detail, ...prev]
        })
      }
    }
    window.addEventListener("campushub_post_created", handleNewPost)
    return () => {
      window.removeEventListener("campushub_post_created", handleNewPost)
      window.removeEventListener("focus", updateUnreadCount)
    }
  }, [])

  // Filter feedbacks based on search query and category (strictly media posts only)
  const filteredFeedbacks = feedbacks.filter(f => {
    if (!f) return false
    // Compulsory: Only show posts that have image or video
    if (!f.evidencePhotoUrl && !f.mediaUrl && !f.isMediaPost) return false

    const q = (searchQuery || "").toLowerCase().trim()
    const matchesSearch = !q || [
      f.collegeName,
      f.title,
      f.comment,
      f.authorName,
      f.studentName,
      f.category,
      f.department
    ].some(field => typeof field === "string" && field.toLowerCase().includes(q))

    const matchesCategory = selectedCategory === "all" || 
      (typeof f.category === "string" && f.category.toLowerCase() === selectedCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  const handleStartChat = (post) => {
    navigate("/messages", { state: { initialChat: post } })
  }

  return (
    <div className="space-y-4">
      
      {/* ================= TOP HEADER (MATCHING EXACT REFERENCE SCREENSHOT) ================= */}
      <div className="flex items-center justify-between gap-3 pt-0.5 pb-1">
        {/* Left Side: Plus (+) Button to Create Post + Greeting */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open_create_post_modal"))}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-md shadow-blue-600/30 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            title="Create Post"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5 leading-tight">
              <span>Hello,</span>
              <span className="text-[#F87171]">{firstName}</span>
              <span className="text-base">👋</span>
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium leading-snug">
              Good to see you!
            </p>
          </div>
        </div>

        {/* Right Side: Notification Icon Button */}
        <button 
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative w-10 h-10 rounded-full bg-[#0B1A3A] hover:bg-[#102A56] border border-white/10 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
          title="Campus Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 border-2 border-[#0B1A3A] text-white text-[10px] font-bold flex items-center justify-center shadow">
              {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
            </span>
          ) : (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-slate-500/50" />
          )}
        </button>
      </div>

      {/* ================= FULL-WIDTH WHITE SEARCH BAR (MATCHING SCREENSHOT) ================= */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search campus posts, colleges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium shadow-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Category Pills & Refresh Bar */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar py-0.5 min-w-0 flex-1">
          {[
            { id: "all", label: "All Feed" },
            { id: "Teacher & Faculty", label: "Faculty" },
            { id: "Hostel & Mess", label: "Hostel & Mess" },
            { id: "Infrastructure & Labs", label: "Infrastructure" },
            { id: "Placement & Training", label: "Placements" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={loadFeedbacks}
          className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
        </Button>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#A8B5CC]">Loading Campus Pulse...</p>
        </div>
      ) : (
        <SocialFeed feedbacks={filteredFeedbacks} onStartChat={handleStartChat} />
      )}
    </div>
  )
}
