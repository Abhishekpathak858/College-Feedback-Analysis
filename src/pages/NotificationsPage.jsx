import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Bell, 
  Star, 
  Heart, 
  MessageSquare, 
  Repeat, 
  ThumbsUp, 
  CheckCheck, 
  Trash2,
  Clock
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

const STORAGE_KEY = "campussphere_notifications_list"

const INITIAL_NOTIFICATIONS = []

const normalizeNotification = (n) => {
  const actorName = n.actorName || n.actor?.name || n.name || "Student"
  const actorAvatar = n.actorAvatar || n.actor?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
  const actorInitials = n.actorInitials || n.actor?.initials || (actorName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "ST")
  
  let actionText = n.actionText
  if (!actionText) {
    if (n.type === "like") actionText = "liked your post"
    else if (n.type === "comment") actionText = "commented on your post"
    else if (n.type === "reshare") actionText = "reshared your post"
    else if (n.type === "rating") actionText = "rated their college"
    else if (n.type === "helpful") actionText = "marked your review as helpful 👍"
    else actionText = "interacted with you"
  }

  return {
    ...n,
    actorName,
    actorAvatar,
    actorInitials,
    actionText,
    subject: n.subject || n.college || "",
    extra: n.extra || (n.rating ? `${n.rating} ⭐` : "")
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Strip out any stale mock notifications (e.g. notif-1, notif-2, etc.)
        const realOnly = Array.isArray(parsed)
          ? parsed.filter(n => n && !n.id?.toString().startsWith("notif-")).map(normalizeNotification)
          : []
        setNotifications(realOnly)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly))
      } else {
        setNotifications([])
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
      }
    } catch {
      setNotifications([])
    }
  }, [])

  const saveNotifications = (updated) => {
    setNotifications(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }))
    saveNotifications(updated)
    toast({
      title: "All Caught Up",
      description: "All notifications marked as read.",
      variant: "success"
    })
  }

  const handleClearAll = () => {
    saveNotifications([])
    toast({
      title: "Cleared",
      description: "All notifications cleared."
    })
  }

  const handleNotificationClick = (notif) => {
    // Mark this item as read
    const updated = notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
    saveNotifications(updated)

    // Navigate directly to the related content without extra popup dialog
    if (notif.targetUrl) {
      navigate(notif.targetUrl)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Helper to render type-specific action icon
  const renderTypeIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
      case "comment":
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
      case "reshare":
        return <Repeat className="w-3.5 h-3.5 text-emerald-400" />
      case "rating":
        return <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      case "helpful":
        return <ThumbsUp className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-300" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-all border border-white/10 shrink-0 cursor-pointer shadow-sm"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1 rounded hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-red-400 px-2.5 py-1 rounded hover:bg-white/5 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Unified Notifications Feed */}
      <div className="space-y-1.5 pt-1">
        {notifications.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-xl bg-slate-900/40 border border-white/10">
            <Bell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No new notifications</p>
            <p className="text-xs text-slate-500 mt-1">
              You're all caught up! Likes, comments, ratings and reviews will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.isRead

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl transition-all cursor-pointer border ${
                  isUnread
                    ? "bg-[#0d1c38] border-blue-500/30 hover:bg-[#112347]"
                    : "bg-[#09101f]/70 border-white/5 hover:bg-slate-800/40 hover:border-white/10"
                }`}
              >
                {/* User Avatar + Micro Activity Icon */}
                <div className="relative shrink-0">
                  <Avatar className="w-10 h-10 border border-white/15">
                    <AvatarImage src={notif.actorAvatar} alt={notif.actorName} />
                    <AvatarFallback className="bg-slate-800 text-xs text-white font-bold">
                      {notif.actorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B1528] border border-white/20 flex items-center justify-center shadow">
                    {renderTypeIcon(notif.type)}
                  </div>
                </div>

                {/* Notification Text Message */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm text-slate-200 leading-snug">
                    <span className="font-bold text-white tracking-wide mr-1.5">
                      {notif.actorName || "Student"}
                    </span>
                    <span className="text-slate-300">
                      {notif.actionText}
                    </span>{" "}
                    {notif.subject && (
                      <span className="font-medium text-blue-300">
                        {notif.subject}
                      </span>
                    )}
                    {notif.extra && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-xs inline-block">
                        {notif.extra}
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block font-medium">
                    {notif.time}
                  </span>
                </div>

                {/* Blue Unread Dot */}
                {isUnread && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-sm shadow-blue-500" />
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

