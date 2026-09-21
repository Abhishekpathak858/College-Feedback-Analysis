import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  Repeat,
  Share2,
  MapPin,
  Flame,
  AlertTriangle,
  MoreVertical,
  Flag,
  CheckCircle2,
  Hand,
  ShieldAlert,
  Send,
  Bookmark,
  Mail,
  UserCheck,
  FileText,
  Info,
  X,
  ShieldCheck,
  Building2,
  Clock,
  Trash2
} from "lucide-react"
import { base44Client } from "@/api/base44Client"

function formatPostTime(dateString) {
  if (!dateString) return "2 hours ago"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const now = new Date()
  const diffSec = Math.floor((now - date) / 1000)

  if (diffSec < 60) return "Just now"
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`
  if (diffSec < 172800) return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function SocialFeed({ feedbacks, onStartChat }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [hiddenPosts, setHiddenPosts] = useState([])
  const [reportReason, setReportReason] = useState("")
  const [likedPosts, setLikedPosts] = useState({})
  const [endorsedPosts, setEndorsedPosts] = useState({})
  const [failedMedia, setFailedMedia] = useState({})
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("campushub_saved_posts")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  
  // Interactive comment box state per post
  const [openCommentPostId, setOpenCommentPostId] = useState(null)
  const [commentInput, setCommentInput] = useState("")
  const [commentsMap, setCommentsMap] = useState({
    1: ["I face the same issue in B-Block hostel!", "Authorities must take immediate action."],
  })

  // Three-dots menu dropdown state
  const [activeMenuPostId, setActiveMenuPostId] = useState(null)
  
  // Modals state
  const [reportPost, setReportPost] = useState(null)
  const [detailsPost, setDetailsPost] = useState(null)

  const feedList = Array.isArray(feedbacks) ? feedbacks : []
  const sortedFeedbacks = [...feedList]
    .filter(f => f && !hiddenPosts.includes(f.id) && Boolean(f.evidencePhotoUrl || f.mediaUrl || f.isMediaPost))
    .sort((a, b) => new Date(b.createdAt || b.created_at || Date.now()) - new Date(a.createdAt || a.created_at || Date.now()))

  const handleReportSubmit = () => {
    if (!reportPost) return
    setHiddenPosts(prev => [...prev, reportPost.id])
    toast({
      title: "Post Reported & Submitted",
      description: "Thank you for helping keep CampusPulse clean. The post has been hidden for review.",
      variant: "destructive",
    })
    setReportReason("")
    setReportPost(null)
  }

  const handleDeletePost = async (postToDelete) => {
    if (!postToDelete) return
    setActiveMenuPostId(null)

    // Optimistically hide from UI immediately
    setHiddenPosts(prev => [...prev, postToDelete.id])

    // Remove from local storage user posts if present
    try {
      const local = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
      const updatedLocal = local.filter(p => p.id !== postToDelete.id)
      localStorage.setItem("campushub_user_posts", JSON.stringify(updatedLocal))
    } catch (e) {}

    // Remove from Firestore if it has a string ID
    try {
      if (typeof postToDelete.id === "string") {
        await base44Client.entities.Feedback.delete(postToDelete.id)
      }
    } catch (err) {
      console.error("Error deleting from database:", err)
    }

    toast({
      title: "🗑️ Post Deleted Successfully",
      description: `"${postToDelete.title || 'Your post'}" has been removed from the campus feed.`,
      variant: "success",
    })
  }

  const handleLodgeComplaintAboutPost = (post) => {
    toast({
      title: "Grievance Form Redirect",
      description: `Initiating formal grievance for "${post.title || 'Campus Issue'}".`,
      variant: "success",
    })
    navigate("/submit")
  }

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const toggleEndorse = (postId) => {
    setEndorsedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const toggleBookmark = (postId) => {
    const isSaved = !savedPosts[postId]
    setSavedPosts(prev => {
      const updated = { ...prev, [postId]: isSaved }
      localStorage.setItem("campushub_saved_posts", JSON.stringify(updated))
      return updated
    })
    toast({
      title: isSaved ? "Post Bookmarked 🔖" : "Post Removed",
      description: isSaved ? "Saved to your bookmarked campus posts." : "Removed from your bookmarks.",
    })
  }

  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return
    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput.trim()]
    }))
    setCommentInput("")
    toast({
      title: "Comment Added!",
      description: "Your comment is posted on this campus complaint.",
    })
  }

  return (
    <div className="space-y-6 pb-20 max-w-xl mx-auto animate-in fade-in duration-500">
      

      {sortedFeedbacks.length === 0 ? (
        <div className="p-12 text-center campushub-card rounded-2xl border border-white/[0.08] shadow-xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/15 text-[#3B82F6] flex items-center justify-center mx-auto border border-blue-500/20 shadow-inner">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-[#F8FAFC]">No campus media posts yet</h3>
          <p className="text-xs text-[#A8B5CC] max-w-sm mx-auto leading-relaxed">
            Click the <span className="text-[#3B82F6] font-bold text-sm">+</span> button at the top to upload and share your first photo or video post!
          </p>
          <Button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open_create_post_modal"))}
            className="mt-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl gap-1.5 cursor-pointer shadow-md"
          >
            + Create Campus Post
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedFeedbacks.map((post) => {
            const isLiked = !!likedPosts[post.id]
            const isEndorsed = !!endorsedPosts[post.id]
            const isSaved = !!savedPosts[post.id]
            const likesCount = (post.likes || 12) + (isLiked ? 1 : 0)
            const endorseCount = (post.endorsements || 18) + (isEndorsed ? 1 : 0)
            const postComments = commentsMap[post.id] || []

            return (
              <div 
                key={post.id} 
                className="campushub-card rounded-2xl overflow-hidden shadow-lg border border-white/[0.08] hover:border-[#3B82F6]/30 transition-all duration-200 group"
              >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/[0.06] bg-[#07142F]/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 border border-blue-400/30 shrink-0">
                      {post.avatarUrl && <AvatarImage src={post.avatarUrl} alt={post.authorName} />}
                      <AvatarFallback className="bg-[#2563EB] text-white font-bold text-xs">
                        {post.authorName?.substring(0, 2).toUpperCase() || post.studentId?.substring(0, 2).toUpperCase() || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold text-[#F8FAFC] truncate">
                          {post.isAnonymous ? "@anonymous_student" : (post.authorName || `@${post.studentId || "student"}`)}
                        </p>
                        {(post.isAdminPost || 
                          (typeof post.authorName === "string" && post.authorName.toLowerCase().includes("admin")) || 
                          (typeof post.studentEmail === "string" && post.studentEmail.toLowerCase().includes("abhishekpathakrp_ds24@its.edu.in"))) ? (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-amber-300" /> Admin Post 👑
                          </span>
                        ) : !post.isAnonymous ? (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/25 shrink-0">
                            Verified Student ✓
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs font-medium text-[#A8B5CC] flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3B82F6]" />
                        <span className="truncate font-semibold text-[#F8FAFC]">{post.collegeName || "Verified College"}</span>
                        {post.location && <span className="text-[#7182A3]">({post.location})</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 relative">
                    {Number(post.rating) >= 4 ? (
                      <div className="text-xs font-bold bg-[#22C55E]/15 text-[#22C55E] px-2.5 py-0.5 rounded-full border border-[#22C55E]/30">
                        ★ {post.rating}
                      </div>
                    ) : Number(post.rating) === 3 ? (
                      <div className="text-xs font-bold bg-[#F59E0B]/15 text-[#F59E0B] px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30">
                        ★ {post.rating}
                      </div>
                    ) : (
                      <div className="text-xs font-bold bg-[#EF4444]/15 text-[#EF4444] px-2.5 py-0.5 rounded-full border border-[#EF4444]/30">
                        ★ {post.rating}
                      </div>
                    )}
                    
                    {/* Three Dots Button (⋮) */}
                    <button
                      onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                      className="text-[#7182A3] hover:text-[#F8FAFC] transition-colors p-1.5 rounded-xl hover:bg-[#102A56] cursor-pointer"
                      title="Post Options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Three-Dots Menu Dropdown */}
                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-10 w-56 campushub-card-elevated p-2 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-rose-500/15 transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0" />
                          <span>Delete Post</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuPostId(null)
                            setReportPost(post)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A8B5CC] hover:text-[#F8FAFC] hover:bg-[#2563EB]/20 transition-colors text-left cursor-pointer"
                        >
                          <Flag className="w-4 h-4 text-[#F59E0B] shrink-0" />
                          <span>Report Post</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuPostId(null)
                            setDetailsPost(post)
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A8B5CC] hover:text-[#F8FAFC] hover:bg-[#2563EB]/20 transition-colors text-left cursor-pointer"
                        >
                          <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
                          <span>View Full Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Container: Natural aspect ratio, full image/video display without any cropping */}
                {post.evidencePhotoUrl && !failedMedia[post.id] ? (
                  <div className="w-full bg-[#050e24] relative flex items-center justify-center overflow-hidden border-y border-white/[0.08] my-1">
                    {post.evidencePhotoUrl.includes("video") || post.mediaType === "video" ? (
                      <video 
                        src={post.evidencePhotoUrl} 
                        className="w-full h-auto max-h-[580px] object-contain block mx-auto" 
                        controls 
                        playsInline
                        onError={() => setFailedMedia(prev => ({ ...prev, [post.id]: true }))}
                      />
                    ) : (
                      <img 
                        src={post.evidencePhotoUrl} 
                        alt={post.title || "Campus Post"} 
                        className="w-full h-auto max-h-[580px] object-contain block mx-auto select-none" 
                        onError={() => setFailedMedia(prev => ({ ...prev, [post.id]: true }))}
                      />
                    )}
                  </div>
                ) : null}

                {/* Post Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/25">
                      {post.category || "General"}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#F8FAFC] text-base leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#A8B5CC] font-normal leading-relaxed">
                    {post.comment}
                  </p>

                  {/* Timestamp Displayed Below Post Content */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#7182A3] pt-2 mt-2 border-t border-white/[0.06]">
                    <Clock className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                    <span>Posted {formatPostTime(post.createdAt || post.created_at || post.submittedAt)}</span>
                  </div>
                </div>

                {/* Post Actions Bar */}
                <div className="px-4 py-2.5 bg-[#07142F]/50 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* ThumbsUp Like Button */}
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isLiked 
                          ? "bg-[#2563EB] text-white shadow-xs" 
                          : "text-[#A8B5CC] hover:text-[#60A5FA] hover:bg-[#2563EB]/15"
                      }`}
                      title="Like Post"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-white text-white" : ""}`} />
                      <span>{(Number(post.likes) || 0) + (isLiked ? 1 : 0)}</span>
                    </button>

                    {/* Comment Button */}
                    <button 
                      onClick={() => setOpenCommentPostId(openCommentPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        openCommentPostId === post.id
                          ? "bg-[#2563EB] text-white"
                          : "text-[#A8B5CC] hover:text-[#60A5FA] hover:bg-[#2563EB]/15"
                      }`}
                      title="Comments"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{(commentsMap[post.id] || []).length}</span>
                    </button>

                    {/* Reshare Button */}
                    <button 
                      onClick={() => toggleEndorse(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isEndorsed 
                          ? "bg-[#8B5CF6] text-white shadow-xs" 
                          : "text-[#A8B5CC] hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/15"
                      }`}
                      title="Reshare Post"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      <span>{(Number(post.endorsements) || 0) + (isEndorsed ? 1 : 0)}</span>
                    </button>

                    {/* Contact Author */}
                    {onStartChat && (
                      <button 
                        onClick={() => onStartChat({
                          id: post.id,
                          authorName: post.isAnonymous ? "Anonymous Student" : (post.authorName || "Verified Student"),
                          title: post.title,
                          collegeName: post.collegeName
                        })}
                        className="flex items-center justify-center p-2 rounded-xl text-[#A8B5CC] hover:text-[#22C55E] hover:bg-[#22C55E]/15 transition-colors cursor-pointer"
                        title="Contact Author"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => toggleBookmark(post.id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
                      isSaved 
                        ? "bg-[#F59E0B] text-white shadow-xs" 
                        : "text-[#7182A3] hover:text-[#F59E0B] hover:bg-[#F59E0B]/15"
                    }`}
                    title="Bookmark Post"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* In-Card Comment Drawer */}
                {openCommentPostId === post.id && (
                  <div className="p-4 bg-[#0B1B3A] border-t border-white/[0.06] space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-[#F8FAFC]">
                      <span>Comments ({postComments.length})</span>
                      <button onClick={() => setOpenCommentPostId(null)} className="text-[#7182A3] hover:text-[#F8FAFC] cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                      {postComments.length === 0 ? (
                        <p className="text-[#7182A3] italic">No comments yet. Share your thoughts!</p>
                      ) : (
                        postComments.map((c, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-[#0D2145] border border-white/[0.06] text-[#F8FAFC] font-normal">
                            {c}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="campushub-input text-xs"
                      />
                      <Button size="sm" onClick={() => handleAddComment(post.id)} className="btn-hub-primary px-3 rounded-xl shrink-0">
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 1. Report Post Dialog */}
      <Dialog open={!!reportPost} onOpenChange={() => setReportPost(null)}>
        <DialogContent className="w-[90%] max-w-md rounded-2xl p-6 campushub-card-elevated text-[#F8FAFC] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#EF4444] font-bold">
              <AlertTriangle className="w-5 h-5" /> Report Post
            </DialogTitle>
            <DialogDescription className="pt-2 text-[#A8B5CC] text-xs">
              Help keep CampusPulse accurate and constructive. Reported posts are reviewed by campus moderators.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <label className="text-xs font-bold uppercase text-[#A8B5CC]">Select Reason</label>
            <select 
              className="w-full bg-[#0B1B3A] border border-white/[0.1] rounded-xl px-3 py-2 text-xs font-medium text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="fake">Inaccurate or Fabricated Information</option>
              <option value="abusive">Harassment or Abusive Content</option>
              <option value="spam">Spam / Duplicate Submission</option>
              <option value="misleading">Misleading Institution Claims</option>
            </select>
          </div>

          <DialogFooter>
            <Button 
              variant="destructive" 
              disabled={!reportReason}
              onClick={handleReportSubmit}
              className="w-full gap-2 font-bold rounded-xl"
            >
              <Flag className="w-4 h-4" /> Submit Report & Hide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. View Post Details Modal */}
      <Dialog open={!!detailsPost} onOpenChange={() => setDetailsPost(null)}>
        <DialogContent className="w-[92%] max-w-lg rounded-2xl p-6 campushub-card-elevated text-[#F8FAFC] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#F8FAFC]">
              <Info className="w-5 h-5 text-[#3B82F6]" /> Post Details & Analysis
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A8B5CC]">
              Complete verification and review record for this submission.
            </DialogDescription>
          </DialogHeader>

          {detailsPost && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-4 rounded-xl bg-[#0B1B3A] border border-white/[0.08] space-y-2">
                <p className="text-sm font-bold text-[#F8FAFC]">{detailsPost.title}</p>
                <p className="text-[#A8B5CC] font-normal leading-relaxed">{detailsPost.comment}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0B1B3A] border border-white/[0.06] space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#7182A3] uppercase">Institution</span>
                  <p className="font-bold text-[#F8FAFC] truncate">{detailsPost.collegeName || "Verified Campus"}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1B3A] border border-white/[0.06] space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#7182A3] uppercase">Category</span>
                  <p className="font-bold text-[#60A5FA]">{detailsPost.category || "General"}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1B3A] border border-white/[0.06] space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#7182A3] uppercase">Rating</span>
                  <p className="font-bold text-[#F59E0B]">★ {detailsPost.rating || 5} / 5</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1B3A] border border-white/[0.06] space-y-0.5">
                  <span className="text-[10px] font-semibold text-[#7182A3] uppercase">Author</span>
                  <p className="font-bold text-[#F8FAFC] truncate">
                    {detailsPost.isAnonymous ? "Anonymous Student" : (detailsPost.authorName || "Verified Student")}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/25 flex items-center gap-2 text-[#22C55E] font-medium">
                <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
                <span>Verified CampusSphere Review Record</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
