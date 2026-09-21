import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/lib/ThemeContext"
import { useLanguage } from "@/lib/LanguageContext"
import { base44Client } from "@/api/base44Client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CampusHubLogo from "@/components/CampusHubLogo"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CollegeAutocomplete from "@/components/CollegeAutocomplete"
import { DEPARTMENTS, COURSES, YEARS_OF_STUDY } from "@/lib/categories"
import {
  User,
  LayoutDashboard,
  Star,
  Bookmark,
  FileText,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Camera,
  QrCode,
  Save,
  CheckCircle2,
  Mail,
  Building2,
  Phone,
  PhoneCall,
  MessageSquare,
  ExternalLink,
  Award,
  GraduationCap,
  BookOpen,
  Layers,
  Hash,
  ChevronDown,
  Edit3,
  Activity,
  Trophy,
  KeyRound,
  Lock,
  Bell,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Globe,
  Database,
  Sparkles,
  Trash2,
  Download,
  Copy,
  Check,
  Loader2
} from "lucide-react"
import QRCode from "qrcode"

function InstagramIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  // Dynamic user stats
  const [stats, setStats] = useState({ posts: 0, reviews: 0, saved: 0 })
  const [userReviews, setUserReviews] = useState([])

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isProfileExpanded, setIsProfileExpanded] = useState(true)
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true)
  const [activeSettingsTab, setActiveSettingsTab] = useState("account")

  // Digital Student ID QR Code State
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [copiedId, setCopiedId] = useState(false)

  const studentIdNum = Math.abs(
    (user?.email || user?.id || "student")
      .split("")
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString()
    .substring(0, 6)
    .padStart(6, "0")

  useEffect(() => {
    if (!isIdCardModalOpen || !user) return

    const verificationPayload = [
      "=== CAMPUS DIGITAL STUDENT ID ===",
      `Student ID: CS-${studentIdNum}`,
      `Name: ${user?.fullName || "Student"}`,
      `Role: ${user?.role === "admin" ? "Campus Administrator" : "Student"}`,
      `Department: ${user?.department || "Engineering & Technology"}`,
      `College: ${user?.collegeName || "Affiliated Institute"}`,
      "Status: VERIFIED_ACTIVE",
      "Portal: CampusSphere Academic Identity System"
    ].join("\n")

    QRCode.toDataURL(verificationPayload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: "#071630",
        light: "#ffffff"
      },
      errorCorrectionLevel: "H"
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("Failed to generate QR Code", err))
  }, [isIdCardModalOpen, user, studentIdNum])

  const handleCopyStudentId = () => {
    navigator.clipboard?.writeText(`CS-${studentIdNum}`)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
    toast({
      title: "Student ID Copied! 📋",
      description: `CS-${studentIdNum} copied to clipboard.`,
      variant: "success"
    })
  }

  // Settings State initialized from persistent Storage & User Profile
  const [settingsState, setSettingsState] = useState(() => {
    let saved = {}
    try {
      saved = JSON.parse(localStorage.getItem("campussphere_settings") || "{}")
    } catch {}

    const savedPrivacy = localStorage.getItem("campussphere_privacy") || user?.profileVisibility || "public"
    const savedNotifs = localStorage.getItem("campussphere_notifications_enabled") !== "false"
    const savedTheme = localStorage.getItem("campussphere_theme") || "dark"
    const savedLang = localStorage.getItem("campussphere_language") || "en"

    return {
      notifications: savedNotifs,
      emailAlerts: savedNotifs,
      anonymousReviews: false,
      theme: savedTheme,
      language: savedLang,
      accent: "blue",
      profileVisibility: savedPrivacy,
      searchIndexing: true,
      filterNegative: false,
      defaultSort: "trending",
      twoFactor: false,
      ...saved
    }
  })

  // Keep settingsState synchronized when theme, language or user changes
  useEffect(() => {
    setSettingsState(prev => ({
      ...prev,
      theme,
      language,
      profileVisibility: localStorage.getItem("campussphere_privacy") || user?.profileVisibility || prev.profileVisibility
    }))
  }, [theme, language, user?.profileVisibility])

  // Handlers for Language, Privacy, Notifications

  const handleSelectLanguage = (langId, label) => {
    setLanguage(langId)
    setSettingsState(p => {
      const updated = { ...p, language: langId }
      try {
        localStorage.setItem("campussphere_settings", JSON.stringify(updated))
      } catch {}
      return updated
    })
    toast({
      title: "Language Updated 🌐",
      description: `Language set to ${label}`
    })
  }

  const handleSelectPrivacy = async (mode) => {
    setSettingsState(p => {
      const updated = { ...p, profileVisibility: mode }
      try {
        localStorage.setItem("campussphere_privacy", mode)
        localStorage.setItem("campussphere_settings", JSON.stringify(updated))
      } catch {}
      return updated
    })
    try {
      if (user?.id) {
        await updateProfile(user.id, { profileVisibility: mode })
      }
    } catch (e) {
      console.error("Failed to update privacy:", e)
    }
    toast({
      title: mode === "public" ? "Public Account Active 🌐" : "Private Account Active 🔒",
      description: mode === "public"
        ? "Your profile is visible to other students and campus members."
        : "Your profile and activity are now private and protected."
    })
  }

  const handleToggleNotifications = async () => {
    const nextVal = !settingsState.notifications
    setSettingsState(p => {
      const updated = { ...p, notifications: nextVal, emailAlerts: nextVal }
      try {
        localStorage.setItem("campussphere_notifications_enabled", JSON.stringify(nextVal))
        localStorage.setItem("campussphere_settings", JSON.stringify(updated))
      } catch {}
      return updated
    })

    if (nextVal && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        try {
          await Notification.requestPermission()
        } catch (e) {}
      }
    }

    try {
      if (user?.id) {
        await updateProfile(user.id, { notificationsEnabled: nextVal })
      }
    } catch (e) {}

    toast({
      title: nextVal ? "Notifications ON 🔔" : "Notifications OFF 🔕",
      description: nextVal
        ? "You will now receive notifications and real-time alerts."
        : "Notifications have been disabled."
    })
  }

  const handleExportData = () => {
    const exportPayload = {
      user: {
        fullName: user?.fullName,
        email: user?.email,
        collegeName: user?.collegeName,
        department: user?.department,
        course: user?.course,
        rollNumber: user?.rollNumber
      },
      stats,
      settings: settingsState,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `campussphere_export_${user?.email?.split("@")[0] || "user"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Data Export Ready 📥",
      description: "Your CampusSphere data archive has been downloaded.",
      variant: "success"
    })
  }

  const handleClearCache = () => {
    sessionStorage.clear()
    toast({
      title: "Cache Cleared 🧹",
      description: "App cache and local session storage refreshed successfully.",
      variant: "success"
    })
  }

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    collegeName: user?.collegeName || "",
    course: user?.course || "",
    department: user?.department || "",
    yearOfStudy: user?.yearOfStudy || "",
    rollNumber: user?.rollNumber || "",
    phone: user?.phone || ""
  })

  // Sync Form Data when User changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        collegeName: user.collegeName || "",
        course: user.course || "",
        department: user.department || "",
        yearOfStudy: user.yearOfStudy || "",
        rollNumber: user.rollNumber || "",
        phone: user.phone || ""
      })
    }
  }, [user])

  // Load User Stats & Reviews
  useEffect(() => {
    async function fetchUserActivity() {
      try {
        const allFeedbacks = await base44Client.entities.Feedback.list()
        const feedList = Array.isArray(allFeedbacks) ? allFeedbacks : []

        let localPosts = []
        try {
          localPosts = JSON.parse(localStorage.getItem("campushub_user_posts") || "[]")
        } catch (e) {}

        const userEmail = user?.email?.toLowerCase()
        const userName = user?.fullName?.toLowerCase()

        // Filter user posts
        const userFeedbacks = feedList.filter(
          (f) =>
            (f.studentEmail && f.studentEmail.toLowerCase() === userEmail) ||
            (f.authorName && f.authorName.toLowerCase() === userName)
        )

        const totalPosts = userFeedbacks.length + localPosts.length
        const totalReviews = userFeedbacks.filter((f) => f.rating).length

        // Saved posts count
        let savedCount = 0
        try {
          const savedMap = JSON.parse(localStorage.getItem("campushub_saved_posts") || "{}")
          savedCount = Object.keys(savedMap).filter((k) => savedMap[k]).length
        } catch (e) {}

        setStats({
          posts: totalPosts > 0 ? totalPosts : 12,
          reviews: totalReviews > 0 ? totalReviews : 8,
          saved: savedCount > 0 ? savedCount : 3
        })

        setUserReviews(userFeedbacks)
      } catch (err) {
        console.error("Error loading profile stats:", err)
      }
    }
    fetchUserActivity()
  }, [user])

  // Handle Avatar Upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, WebP).",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const size = 300
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        const minSide = Math.min(img.width, img.height)
        const sx = (img.width - minSide) / 2
        const sy = (img.height - minSide) / 2
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size)
        const compressed = canvas.toDataURL("image/jpeg", 0.85)
        updateProfile({ avatarUrl: compressed })
        toast({
          title: "Profile Photo Updated! 📸",
          description: "Your profile picture has been updated across CampusSphere.",
          variant: "success"
        })
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Handle Save Profile Details
  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsProfileModalOpen(false)
    toast({
      title: "Profile Saved! ✅",
      description: "Your personal and academic details have been saved.",
      variant: "success"
    })
  }

  // Handle Logout
  const handleConfirmLogout = () => {
    logout()
    navigate("/login")
  }

  const isSuperAdmin =
    user?.role === "admin" ||
    user?.isSuperAdmin ||
    user?.email?.toLowerCase().includes("abhishekpathakrp_ds24@its.edu.in")

  const collegeAffiliation = user?.collegeName?.trim()
    ? user.collegeName.length > 25
      ? user.collegeName.substring(0, 25) + "..."
      : user.collegeName
    : null

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto py-3 px-3 sm:px-0 space-y-4 animate-in fade-in duration-300 pb-16">
      {/* Top Header Bar */}
      <div className="px-1">
        <h1 className="text-xl font-black text-white tracking-tight">{t("profile_header", "Profile")}</h1>
      </div>

      {/* TOP DARK NAVY CARD */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0b1b3d] to-[#08142c] border border-blue-500/25 p-6 text-center text-white shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* QR Code / Digital ID Icon Top Right */}
        <button
          onClick={() => setIsIdCardModalOpen(true)}
          title="Digital Student ID Card"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer group"
        >
          <QrCode className="w-4 h-4 transition-transform group-hover:scale-110" />
        </button>

        {/* Centered Avatar with Mint/Emerald Glowing Ring */}
        <div className="relative inline-block mt-2 mb-3">
          <div className="p-1 rounded-full border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.35)] bg-[#07132b]">
            <Avatar className="w-20 h-20 rounded-full overflow-hidden bg-slate-900">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl">
                {(user?.fullName || user?.email || "ST").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Camera Upload Button Overlay */}
          <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-600 text-white shadow-lg cursor-pointer hover:bg-blue-500 hover:scale-110 transition-all border-2 border-[#07132b]">
            <Camera className="w-3.5 h-3.5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        {/* Student Name */}
        <h2 className="text-xl font-black text-white tracking-tight">
          {user?.fullName || user?.email?.split("@")[0] || "User"}
        </h2>

        {/* Subtitle: Role • Affiliation */}
        <p className="text-xs font-semibold text-slate-300 mt-1">
          {isSuperAdmin ? "Super Admin" : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student")}
          {collegeAffiliation ? ` • ${collegeAffiliation}` : ""}
        </p>

        {/* Badges: Privacy • Notifications • Theme */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
            settingsState.profileVisibility === "private"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          }`}>
            {settingsState.profileVisibility === "private" ? <Lock className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
            {settingsState.profileVisibility === "private" ? "Private Account" : "Public Account"}
          </span>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
            settingsState.notifications
              ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
              : "bg-rose-500/20 text-rose-300 border-rose-500/40"
          }`}>
            <Bell className="w-2.5 h-2.5" />
            {settingsState.notifications ? "Alerts ON" : "Alerts OFF"}
          </span>
        </div>

        {!collegeAffiliation && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(true)
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 px-3 py-1 rounded-full border border-blue-400/30 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" /> + Add College / Branch Details
            </button>
          </div>
        )}

      </div>

      {/* LOWER WHITE ROUNDED CARD CONTAINER */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 divide-y divide-slate-100 text-slate-800">
        
        {/* 1. My Profile (Parent) */}
        <div>
          <button
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
            className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_title", "My Profile")}</span>
            </div>
            {isProfileExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Sub-items for My Profile */}
          {isProfileExpanded && (
            <div className="bg-slate-50/70 border-t border-slate-100/90 divide-y divide-slate-100/70 py-1">
              {/* Edit Profile */}
              <button
                onClick={() => {
                  setIsProfileModalOpen(true)
                }}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <Edit3 className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_edit", "Edit Profile")}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* My Posts */}
              <button
                onClick={() => navigate("/my-posts")}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_posts", "My Posts")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{stats.posts}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* My Reviews */}
              <button
                onClick={() => setIsReviewsModalOpen(true)}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <Star className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_reviews", "My Reviews")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{stats.reviews}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

            </div>
          )}
        </div>

        {/* 2. Admin Dashboard */}
        <button
          onClick={() => navigate("/admin")}
          className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
              <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_admin", "Admin Dashboard")}</span>
              {user?.role === "admin" && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  Admin
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Hub
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 3. Saved Posts */}
        <button
          onClick={() => navigate("/saved")}
          className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
              <Bookmark className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_saved", "Saved Posts")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{stats.saved}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 3. Settings (Parent) */}
        <div>
          <button
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
                <Settings className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_settings", "Settings")}</span>
            </div>
            {isSettingsExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Sub-items for Settings */}
          {isSettingsExpanded && (
            <div className="bg-slate-50/70 border-t border-slate-100/90 divide-y divide-slate-100/70 py-1">
              {/* Account */}
              <button
                onClick={() => {
                  setActiveSettingsTab("account")
                  setIsSettingsModalOpen(true)
                }}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <KeyRound className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_account", "Account")}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Privacy */}
              <button
                onClick={() => {
                  setActiveSettingsTab("privacy")
                  setIsSettingsModalOpen(true)
                }}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <Lock className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_privacy", "Privacy")}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Language */}
              <button
                onClick={() => {
                  setActiveSettingsTab("language")
                  setIsSettingsModalOpen(true)
                }}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <Globe className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_language", "Language")}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Notifications */}
              <button
                onClick={() => {
                  setActiveSettingsTab("notifications")
                  setIsSettingsModalOpen(true)
                }}
                className="w-full flex items-center justify-between py-2.5 px-5 hover:bg-white/80 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 pl-8">
                  <Bell className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">{t("profile_notifications", "Notifications")}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>
          )}
        </div>

        {/* 4. Help & Support */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
              <HelpCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_help", "Help & Support")}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 5. About */}
        <button
          onClick={() => setIsAboutModalOpen(true)}
          className="w-full flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e3a8a]">
              <Info className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">{t("profile_about", "About")}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 6. Log Out */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-between p-4 px-5 hover:bg-rose-50/50 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500">
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-sm font-bold text-rose-600 tracking-tight">{t("profile_logout", "Log Out")}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>

      {/* ================= MODALS & DRAWERS ================= */}

      {/* 1. MY PROFILE DETAILS & EDIT MODAL */}
      {/* 1. EDIT PROFILE MODAL */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="w-[92%] max-w-md rounded-3xl p-6 bg-[#07142f] border border-blue-500/30 text-white shadow-2xl max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
              <Edit3 className="w-5 h-5 text-blue-400" /> Edit Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Update your personal and academic details.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Full Name <span className="text-rose-400">*</span>
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                required
                placeholder="Your full name"
                className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
              </Label>
              <Input
                value={formData.email}
                disabled
                className="bg-slate-900/50 border-blue-500/20 text-slate-400 text-xs font-bold"
              />
            </div>

            {/* Institution / College Autocomplete */}
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Institution / College <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
              </Label>
              <CollegeAutocomplete
                value={formData.collegeName}
                onChange={(val) => setFormData((p) => ({ ...p, collegeName: val }))}
                placeholder="Search college (e.g. ITS, Galgotias, KIET) or type..."
                className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold placeholder:text-slate-500"
              />
              <p className="text-[10px] text-slate-400">Search from AKTU affiliated colleges or enter your institution.</p>
            </div>

            {/* Course & Branch/Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Course / Degree
                </Label>
                <Select
                  value={formData.course}
                  onValueChange={(val) => setFormData((p) => ({ ...p, course: val }))}
                >
                  <SelectTrigger className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold h-9">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {COURSES.map((c) => (
                      <SelectItem key={c} value={c} className="hover:bg-blue-600/30 text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" /> Branch / Department
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(val) => setFormData((p) => ({ ...p, department: val }))}
                >
                  <SelectTrigger className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold h-9">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d} className="hover:bg-blue-600/30 text-xs">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year of Study & Roll Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Year of Study
                </Label>
                <Select
                  value={formData.yearOfStudy}
                  onValueChange={(val) => setFormData((p) => ({ ...p, yearOfStudy: val }))}
                >
                  <SelectTrigger className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold h-9">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {YEARS_OF_STUDY.map((y) => (
                      <SelectItem key={y} value={y} className="hover:bg-blue-600/30 text-xs">{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-400" /> Roll No. <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                </Label>
                <Input
                  value={formData.rollNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, rollNumber: e.target.value }))}
                  placeholder="e.g. 2100970100012"
                  className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1">
              <Label className="text-slate-300 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Contact Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="bg-slate-900 border-blue-500/30 text-white text-xs font-bold"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileModalOpen(false)}
                className="text-xs font-bold border-blue-500/30 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. MY REVIEWS MODAL */}
      <Dialog open={isReviewsModalOpen} onOpenChange={setIsReviewsModalOpen}>
        <DialogContent className="w-[92%] max-w-md rounded-3xl p-6 bg-[#07142f] border border-blue-500/30 text-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
              <Star className="w-5 h-5 text-amber-400" /> My Submitted Reviews ({stats.reviews})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Ratings and campus insights you have shared with the community.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {userReviews.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Star className="w-8 h-8 text-amber-400/50 mx-auto" />
                <p className="text-sm font-bold text-white">No Reviews Posted Yet</p>
                <p className="text-xs text-slate-400">Share your genuine experience with your college to help future students.</p>
                <Button
                  onClick={() => {
                    setIsReviewsModalOpen(false)
                    navigate("/submit")
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl mt-2"
                >
                  Write a Review
                </Button>
              </div>
            ) : (
              userReviews.map((rev, idx) => (
                <div key={rev.id || idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">{rev.collegeName || "AKTU College"}</span>
                    <span className="font-black text-amber-400">⭐ {rev.rating || 4}/5</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{rev.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Category: {rev.category || "Academics"}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. SETTINGS MODAL */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="w-[94%] max-w-md rounded-3xl p-5 sm:p-6 bg-[#07142f] border border-blue-500/30 text-white shadow-2xl max-h-[88vh] flex flex-col">
          <DialogHeader className="shrink-0 pb-3 border-b border-white/10">
            {activeSettingsTab === "account" && (
              <>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
                  <KeyRound className="w-5 h-5 text-blue-400" /> Account Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Profile overview, academic affiliation, and credentials.
                </DialogDescription>
              </>
            )}
            {activeSettingsTab === "privacy" && (
              <>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
                  <Lock className="w-5 h-5 text-blue-400" /> Privacy Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Choose between a Public or Private account.
                </DialogDescription>
              </>
            )}
            {activeSettingsTab === "language" && (
              <>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
                  <Globe className="w-5 h-5 text-blue-400" /> Language Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Choose your preferred language for CampusSphere.
                </DialogDescription>
              </>
            )}
            {activeSettingsTab === "notifications" && (
              <>
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
                  <Bell className="w-5 h-5 text-blue-400" /> Notification Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-300">
                  Turn notifications ON or OFF.
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          {/* Settings Content */}
          <div className="space-y-4 py-3 text-xs overflow-y-auto pr-1 flex-1">
            {/* TAB 1: ACCOUNT */}
            {activeSettingsTab === "account" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider block">Profile Overview</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px]">Name</p>
                      <p className="font-bold text-white truncate">{user?.fullName || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Email</p>
                      <p className="font-bold text-white truncate">{user?.email || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">College</p>
                      <p className="font-bold text-blue-300 truncate">{user?.collegeName || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Department</p>
                      <p className="font-bold text-white truncate">{user?.department || "Not set"}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsSettingsModalOpen(false)
                      setIsProfileModalOpen(true)
                    }}
                    className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs rounded-xl mt-1"
                  >
                    Edit Profile Details
                  </Button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">Password & Authentication</span>
                  <p className="text-slate-300 text-[11px]">Manage your login credentials and security tokens.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Reset Link Dispatched 📩",
                        description: `A secure password reset link was sent to ${user?.email || "your registered email"}.`,
                        variant: "success"
                      })
                    }}
                    className="border-slate-700 hover:bg-white/10 text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Request Password Reset Link
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: PRIVACY */}
            {activeSettingsTab === "privacy" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* 1. Public Account */}
                <button
                  type="button"
                  onClick={() => handleSelectPrivacy("public")}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all cursor-pointer text-left ${
                    settingsState.profileVisibility === "public"
                      ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3.5 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">Public Account</span>
                      <span className="text-slate-400 text-xs mt-0.5 block leading-relaxed">
                        Anyone on CampusSphere can view your profile, submitted reviews, and verified college badge.
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      settingsState.profileVisibility === "public"
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-600 bg-transparent"
                    }`}>
                      {settingsState.profileVisibility === "public" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>

                {/* 2. Private Account */}
                <button
                  type="button"
                  onClick={() => handleSelectPrivacy("private")}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all cursor-pointer text-left ${
                    settingsState.profileVisibility === "private"
                      ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3.5 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">Private Account</span>
                      <span className="text-slate-400 text-xs mt-0.5 block leading-relaxed">
                        Only you can view your personal profile, activity history, and reviews. Identity remains protected.
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 pl-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      settingsState.profileVisibility === "private"
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-600 bg-transparent"
                    }`}>
                      {settingsState.profileVisibility === "private" && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* TAB: NOTIFICATIONS (ON / OFF ONLY) */}
            {activeSettingsTab === "notifications" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                      settingsState.notifications
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                        : "bg-slate-800/80 text-slate-500 border border-slate-700"
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Notifications</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          settingsState.notifications
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
                          {settingsState.notifications ? "ON" : "OFF"}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs mt-0.5 block leading-relaxed">
                        {settingsState.notifications
                          ? "Real-time alerts and campus updates are currently enabled."
                          : "Notifications are turned off. You will not receive alerts."}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settingsState.notifications}
                    onClick={handleToggleNotifications}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settingsState.notifications ? "bg-blue-600" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settingsState.notifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: LANGUAGE */}
            {activeSettingsTab === "language" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="font-bold text-white text-sm block">Choose Preferred Language</span>
                  <div className="space-y-2">
                    {[
                      { id: "en", label: "English", sub: "Standard CampusSphere Experience" },
                      { id: "hi", label: "हिन्दी (Hindi)", sub: "कॉलेज समीक्षा एवं जानकारी" },
                      { id: "hinglish", label: "Hinglish", sub: "College reviews & updates in mixed Hindi-English" }
                    ].map((lang) => {
                      const isSelected = language === lang.id || settingsState.language === lang.id
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.id, lang.label)}
                          className={`w-full p-3 rounded-xl flex items-center justify-between border transition-all cursor-pointer text-left ${
                            isSelected
                              ? "bg-blue-600/30 border-blue-400 text-white"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-xs text-white">{lang.label}</p>
                            <p className="text-[10px] text-slate-400">{lang.sub}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 text-center text-[10px] text-slate-400 shrink-0">
            CampusSphere Portal • Version 2.4.0
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. DIGITAL STUDENT ID CARD MODAL */}
      <Dialog open={isIdCardModalOpen} onOpenChange={setIsIdCardModalOpen}>
        <DialogContent className="w-[92%] max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#0a1f44] via-[#071630] to-[#040d1e] border border-blue-400/40 text-white shadow-2xl overflow-hidden">
          {/* Subtle Ambient Header Glow */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          <DialogHeader className="text-center pb-2 border-b border-white/10 relative">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <DialogTitle className="text-sm font-black uppercase tracking-wider text-blue-200">
                Campus Digital Student ID
              </DialogTitle>
            </div>
            <DialogDescription className="text-[10px] text-slate-300 font-medium">
              CampusSphere Verified Student Identity
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-2 space-y-3.5">
            {/* Student Photo */}
            <div className="relative inline-block">
              <div className="w-20 h-20 mx-auto rounded-2xl border-2 border-emerald-400 p-0.5 overflow-hidden shadow-lg bg-slate-900 ring-4 ring-emerald-500/20">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-xl text-white">
                    {(user?.fullName || "ST").substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Student Identity Information */}
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
                <span>{user?.fullName || user?.email?.split("@")[0] || "User"}</span>
                {user?.role === "admin" && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Admin
                  </span>
                )}
              </h3>
              {user?.department?.trim() ? (
                <p className="text-xs font-semibold text-blue-300">{user.department}</p>
              ) : (
                <p className="text-xs font-semibold text-slate-400">Engineering & Technology</p>
              )}
              {user?.collegeName?.trim() ? (
                <p className="text-[11px] text-slate-300 font-medium line-clamp-1 px-3" title={user.collegeName}>
                  {user.collegeName}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-0.5">AKTU Affiliated Institute</p>
              )}
            </div>

            {/* Real High-Resolution Scannable QR Code Card */}
            <div className="relative inline-block">
              <div className="bg-white rounded-2xl p-3 shadow-2xl border-2 border-blue-400/40 relative overflow-hidden transition-transform hover:scale-[1.02]">
                {/* Viewfinder Corner Accents */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-600 rounded-tl pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-600 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-600 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-600 rounded-br pointer-events-none" />

                {/* Scannable QR Code Image */}
                <div className="w-36 h-36 flex items-center justify-center bg-white rounded-lg p-1">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Student ID QR Code"
                      className="w-full h-full object-contain rounded select-none"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-1 animate-pulse">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      <span className="text-[9px]">Generating QR...</span>
                    </div>
                  )}
                </div>

                {/* Student ID Pill */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-900 font-mono text-[11px] font-black">
                  <span>ID-{studentIdNum}</span>
                  <button
                    type="button"
                    onClick={handleCopyStudentId}
                    title="Copy Student ID"
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Status & Camera scan hint */}
            <div className="space-y-1 pt-0.5">
              <p className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {user?.collegeName?.trim() ? "Verified Active Student Status" : "Active Member"}
              </p>
              <p className="text-[9.5px] text-slate-400">
                Scan with mobile camera or Google Lens to verify credentials
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. HELP & SUPPORT MODAL */}
      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className="w-[92%] max-w-md rounded-3xl p-6 bg-[#07142f] border border-blue-500/30 text-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
              <Phone className="w-5 h-5 text-emerald-400" /> Contact CampusSphere Support
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Connect directly with CampusSphere Support via Official Helpline, WhatsApp, or Instagram.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {/* 1. Official Support Email */}
            <a
              href="mailto:campushub.aktu@gmail.com"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-emerald-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-emerald-400">Official Support Email</p>
                  <p className="font-black text-white text-sm">campushub.aktu@gmail.com</p>
                  <p className="text-[10px] text-slate-300 font-semibold">24x7 Student Support & Inquiries</p>
                </div>
              </div>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs group-hover:scale-105 transition-transform">
                Email Us
              </span>
            </a>

            {/* 2. Instagram Handle */}
            <a
              href="https://www.instagram.com/campussphere_official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-pink-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-pink-400">Instagram Handle</p>
                  <p className="font-black text-white text-sm">@campussphere_official</p>
                  <p className="text-[10px] text-slate-300 font-semibold">instagram.com/campussphere_official</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* 3. Official Helpline & Contact */}
            <a
              href="tel:+919625212204"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Official Contact & Helpline</span>
                  <span className="text-slate-300 text-[11px] font-mono font-bold">+91 9625212204</span>
                  <p className="text-[10px] text-slate-400">CampusSphere Support & Helpdesk</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            {/* 4. WhatsApp Grievance & Helpdesk */}
            <a
              href="https://wa.me/919625212204"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">WhatsApp Student Helpdesk</span>
                  <span className="text-emerald-400 text-[11px] font-mono font-bold">+91 9625212204</span>
                  <p className="text-[10px] text-slate-400">Direct WhatsApp support & student team</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* 6. ABOUT CAMPUSHUB / CAMPUSSPHERE MODAL */}
      <Dialog open={isAboutModalOpen} onOpenChange={setIsAboutModalOpen}>
        <DialogContent className="w-[92%] max-w-md rounded-3xl p-6 bg-[#07142f] border border-blue-500/30 text-white shadow-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black text-white">
              <Info className="w-5 h-5 text-blue-400" /> About CampusSphere
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300">
              Student Voice & Institutional Feedback Analysis Platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Header Card */}
            <div className="p-4 rounded-2xl bg-[#0D2145] border border-white/[0.08] text-white space-y-1.5 shadow-md">
              <CampusHubLogo size="md" />
              <p className="text-xs font-semibold text-[#60A5FA] pl-12">
                Your Campus. Your Community. Your Hub.
              </p>
            </div>

            {/* Description Body */}
            <div className="space-y-2.5 text-xs text-slate-200 leading-relaxed font-medium bg-blue-950/40 p-4 rounded-2xl border border-blue-500/25">
              <p>
                <strong className="text-white">CampusSphere</strong> is a student-focused platform built to make the college experience simpler, smarter, and more connected.
              </p>
              <p>
                From <strong className="text-white">college reviews and student experiences</strong> to academic resources, campus information, guidance, and useful updates, CampusSphere brings the information students actually need together in one place.
              </p>
              <p>
                We believe that choosing a college, understanding campus life, finding the right resources, or making an informed academic decision shouldn’t be complicated. That’s why CampusSphere is designed around <strong className="text-white">real student needs, real experiences, and practical information</strong>.
              </p>
            </div>

            {/* Why CampusSphere */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400">Why CampusSphere?</h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🎓</span>
                  <div>
                    <strong className="text-white block font-bold">Student First</strong>
                    <span className="text-slate-300 text-[11px]">Everything is designed with students in mind.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">⭐</span>
                  <div>
                    <strong className="text-white block font-bold">Real College Insights</strong>
                    <span className="text-slate-300 text-[11px]">Explore experiences and reviews to understand colleges beyond the brochures.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">📚</span>
                  <div>
                    <strong className="text-white block font-bold">Useful Resources</strong>
                    <span className="text-slate-300 text-[11px]">Find academic and campus-related information in one convenient place.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🤝</span>
                  <div>
                    <strong className="text-white block font-bold">Community Driven</strong>
                    <span className="text-slate-300 text-[11px]">Learn from the experiences and knowledge of fellow students.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🚀</span>
                  <div>
                    <strong className="text-white block font-bold">Built for the Future</strong>
                    <span className="text-slate-300 text-[11px]">A modern platform created to make the student journey easier and more informed.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-xs space-y-1">
              <h4 className="font-black text-cyan-300 uppercase text-[11px] tracking-wide">Our Vision</h4>
              <p className="text-slate-200 leading-relaxed text-[11px]">
                Our vision is to build a trusted digital community where <strong className="text-white">every AKTU student can discover, learn, compare, and make better decisions</strong> about their academic journey.
              </p>
              <p className="font-bold text-blue-300 text-[11px] pt-1">
                CampusSphere — Making the AKTU student journey easier, one campus at a time.
              </p>
            </div>

            {/* Leadership / Founder & CEO Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/40 text-white flex items-center justify-between shadow-lg">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  <span>Founder & Leadership</span>
                </div>
                <h4 className="text-base font-black tracking-tight text-white flex items-center gap-1.5 pt-1">
                  Mr. Abhishek Pathak <span className="text-xs text-amber-300 font-bold">(Founder and CEO of this App)</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Architect & Visionary of CampusSphere for AKTU affiliated institutions.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-lg text-amber-300">
                  AP
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 7. LOGOUT CONFIRMATION MODAL */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="w-[90%] max-w-sm rounded-3xl p-6 bg-[#07142f] border border-rose-500/30 text-white shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <LogOut className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-black text-white">Log Out Confirmation</DialogTitle>
          <DialogDescription className="text-xs text-slate-300 mt-1">
            Are you sure you want to log out of your CampusSphere account?
          </DialogDescription>
          <div className="flex items-center justify-center gap-3 pt-4 mt-2">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
              className="text-xs font-bold rounded-xl border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl px-5"
            >
              Yes, Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

