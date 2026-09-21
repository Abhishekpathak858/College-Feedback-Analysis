import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Image, Video, Send, AlertCircle, Camera, Upload, Film, PartyPopper, Star, Plus } from "lucide-react"
import { triggerPartyPopperConfetti } from "@/lib/celebration"
import { useAuth } from "@/lib/AuthContext"
import { base44Client, analyzeSentiment } from "@/api/base44Client"
import { validateMediaFile, checkRateLimit, sanitizeInput } from "@/lib/utils"

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [collegeName, setCollegeName] = useState(() => user?.collegeName || "")
  const [category, setCategory] = useState("Campus Life")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [hasUserChangedRating, setHasUserChangedRating] = useState(false)

  React.useEffect(() => {
    if (user?.collegeName) {
      setCollegeName(user.collegeName)
    }
  }, [user])

  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null) // "image" | "video"
  const [videoDuration, setVideoDuration] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Security check: Validate file type, size, and double extensions
    const validation = validateMediaFile(file)
    if (!validation.valid) {
      toast({
        title: "File Rejected",
        description: validation.error,
        variant: "destructive",
      })
      e.target.value = ""
      return
    }

    const isVid = file.type.startsWith("video")

    if (isVid) {
      // Check video length <= 45 seconds
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target.result
        const videoElement = document.createElement("video")
        videoElement.src = dataUrl
        videoElement.onloadedmetadata = () => {
          const durationSec = Math.round(videoElement.duration)
          setVideoDuration(durationSec)
          if (durationSec > 45) {
            toast({
              title: "Video Too Long (Max 45 Sec)",
              description: `Your video is ${durationSec} seconds. Please upload a short video under 45 seconds.`,
              variant: "destructive",
            })
            setMediaUrl(null)
            setMediaType(null)
          } else {
            setMediaUrl(dataUrl)
            setMediaType("video")
            toast({
              title: "Video Attached (Under 45s)",
              description: `Video duration: ${durationSec}s. Ready to post!`,
              variant: "success",
            })
          }
        }
      }
      reader.readAsDataURL(file)
    } else {
      // Compress and resize image using HTML5 Canvas so it uploads reliably and instantly
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 1000
          const MAX_HEIGHT = 1000
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          setMediaUrl(compressedDataUrl)
          setMediaType("image")
          toast({
            title: "Photo Attached 📸",
            description: "Photo optimized and ready to post!",
            variant: "success",
          })
        }
        img.onerror = () => {
          // Fallback to raw dataUrl if canvas fails
          setMediaUrl(event.target.result)
          setMediaType("image")
          toast({
            title: "Photo Attached 📸",
            description: "Photo attached successfully!",
            variant: "success",
          })
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a short headline for your post.",
        variant: "destructive",
      })
      return
    }

    if (!mediaUrl) {
      toast({
        title: "Photo or Video Required",
        description: "Please attach a photo or short video (max 45s) for your campus post.",
        variant: "destructive",
      })
      return
    }

    if (!rating || rating < 1) {
      toast({
        title: "Rating Required",
        description: "Please select your college rating (1 to 5 stars).",
        variant: "destructive",
      })
      return
    }

    // Anti-Spam Rate Limit: Max 4 posts per minute
    const rateLimit = checkRateLimit("create_post", 4, 60000)
    if (!rateLimit.allowed) {
      toast({
        title: "Rate Limit Exceeded",
        description: rateLimit.error,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    const isAdminUser = user?.role === "admin" || user?.isSuperAdmin || user?.email?.toLowerCase().includes("abhishekpathakrp_ds24@its.edu.in")

    const newPost = {
      title: sanitizeInput(title),
      comment: sanitizeInput(comment || title),
      collegeName: sanitizeInput(collegeName),
      category: sanitizeInput(category),
      evidencePhotoUrl: mediaUrl,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      isMediaPost: true,
      postType: "media_post",
      isAdminPost: isAdminUser,
      authorName: isAdminUser ? "Abhishek Pathak (College Admin)" : (user?.fullName || "Verified Student"),
      studentName: isAdminUser ? "Abhishek Pathak (College Admin)" : (user?.fullName || "Verified Student"),
      studentEmail: user?.email || "",
      rating: Number(rating) || 1,
      likes: 1,
      endorsements: 0,
      status: "Active",
      createdAt: new Date().toISOString()
    }

    try {
      // Save directly to Firestore Database
      const savedDoc = await base44Client.entities.Feedback.create(newPost)
      const postWithId = { ...newPost, id: savedDoc.id || Date.now() }

      // Also persist to localStorage for instant local availability
      try {
        const existingLocal = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
        existingLocal.unshift(postWithId)
        localStorage.setItem("campushub_user_posts", JSON.stringify(existingLocal))
        window.dispatchEvent(new CustomEvent("campushub_post_created", { detail: postWithId }))
      } catch (e) {}

      triggerPartyPopperConfetti()
      toast({
        title: "🎉 Post Published Successfully! 🎉",
        description: "Your post is now live on the feed!",
        variant: "success",
      })

      // Reset form
      setTitle("")
      setComment("")
      setRating(0)
      setHoveredRating(0)
      setHasUserChangedRating(false)
      setMediaUrl(null)
      setMediaType(null)

      if (onPostCreated) onPostCreated(postWithId)
      onClose()
    } catch (err) {
      console.error("Firestore post creation error, falling back to local:", err)
      const localOnly = { ...newPost, id: Date.now() }
      try {
        const existingLocal = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
        existingLocal.unshift(localOnly)
        localStorage.setItem("campushub_user_posts", JSON.stringify(existingLocal))
        window.dispatchEvent(new CustomEvent("campushub_post_created", { detail: localOnly }))
      } catch (e) {}

      triggerPartyPopperConfetti()
      toast({
        title: "🎉 Post Published! 🎉",
        description: "Your post is saved and live on your feed!",
        variant: "success",
      })

      setTitle("")
      setComment("")
      setRating(0)
      setHoveredRating(0)
      setHasUserChangedRating(false)
      setMediaUrl(null)
      setMediaType(null)

      if (onPostCreated) onPostCreated(localOnly)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] max-w-lg rounded-2xl p-6 campushub-card-elevated border border-white/[0.1] text-[#F8FAFC] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#F8FAFC]">
            <Plus className="w-5 h-5 text-[#3B82F6]" /> Create Campus Post
          </DialogTitle>
          <DialogDescription className="text-xs text-[#A8B5CC]">
            Share authentic campus moments, faculty reviews, or campus infrastructure. (Max 45s video)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          {/* Headline Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-[#A8B5CC]">Post Title <span className="text-[#EF4444]">*</span></Label>
            <Input
              placeholder="e.g. Campus Library Renovation / Placement Reality"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="campushub-input text-sm font-medium"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-[#A8B5CC]">Caption / Description</Label>
            <Textarea
              rows={2}
              placeholder="Add your honest thoughts or context..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="campushub-input text-xs"
            />
          </div>

          {/* Student Star Rating Selection */}
          <div className="space-y-2 bg-[#07142F]/80 p-3.5 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase text-[#A8B5CC] flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Your College Rating <span className="text-[#EF4444]">*</span>
              </Label>
              <span className={`text-xs font-black ${
                rating >= 4 ? "text-emerald-400" : rating === 3 ? "text-amber-400" : rating > 0 ? "text-rose-400" : "text-slate-400"
              }`}>
                {rating === 0 && "0/5 ⭐ (Click stars to rate)"}
                {rating === 1 && "🚨 1/5 - Urgent / Poor"}
                {rating === 2 && "⚠️ 2/5 - Needs Improvement"}
                {rating === 3 && "😐 3/5 - Average Experience"}
                {rating === 4 && "👍 4/5 - Good College"}
                {rating === 5 && "⭐ 5/5 - Outstanding / Excellent"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentVal = hoveredRating || rating
                  const isFilled = currentVal >= star
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star)
                        setHasUserChangedRating(true)
                      }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      title={`Rate ${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 transition-all ${
                          isFilled
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                            : "text-slate-600 fill-transparent hover:text-slate-400"
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
              <span className="text-[11px] font-medium text-[#7182A3]">
                {rating > 0 ? "✓ Rating Selected" : "0/5 Stars Selected"}
              </span>
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-[#A8B5CC]">College / Institution</Label>
            <Input
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="Enter your College / Institute name"
              className="campushub-input text-xs font-medium"
            />
          </div>

          {/* Media Attachment Area (Photo or 45s Video) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase text-[#A8B5CC]">
                Attach Photo or Short Video <span className="text-[#60A5FA]">(Max 45 Sec)</span>
              </Label>
              <span className="text-[10px] text-[#7182A3]">MP4, MOV, JPG, PNG</span>
            </div>

            {mediaUrl ? (
              <div className="relative rounded-xl overflow-hidden max-h-64 bg-[#050e24] border border-white/[0.08] flex items-center justify-center p-1">
                {mediaType === "video" ? (
                  <video src={mediaUrl} className="w-full h-auto max-h-60 object-contain rounded-lg" controls autoPlay muted />
                ) : (
                  <img src={mediaUrl} alt="Attached Media" className="w-full h-auto max-h-60 object-contain rounded-lg" />
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl(null)
                    setMediaType(null)
                  }}
                  className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md hover:bg-rose-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer bg-[#0B1B3A] hover:bg-[#102A56] transition-colors p-4 text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-[#0D2145] text-[#3B82F6] border border-white/[0.08]">
                    <Film className="w-4 h-4" />
                  </div>
                  <div className="p-2 rounded-xl bg-[#0D2145] text-[#60A5FA] border border-white/[0.08]">
                    <Upload className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#F8FAFC]">Click to Select Photo or Short Video</span>
                <span className="text-[10px] text-[#7182A3] mt-0.5">Videos under 45 seconds</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={submitting || !mediaUrl}
              className="w-full btn-hub-primary rounded-xl py-3 cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Publishing Post..." : "Post to CampusSphere"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
