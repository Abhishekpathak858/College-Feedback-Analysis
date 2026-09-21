import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import CreatePostModal from "@/components/CreatePostModal"
import SupportAboutModal from "@/components/SupportAboutModal"
import CelebrationModal from "@/components/CelebrationModal"
import CampusHubLogo from "@/components/CampusHubLogo"
import {
  GraduationCap,
  Flame,
  PlusCircle,
  Plus,
  BarChart2,
  Compass,
  User,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Building2,
  ChevronRight,
  Camera,
  FileText,
  Menu,
  X,
  MessageCircle,
  Settings,
  HelpCircle,
  Info,
  Phone,
  Bookmark,
  Image,
  Smartphone,
  Download,
  Home
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Navigation icons matching exact shapes from reference screenshot
function NavHomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5Z" />
      <path d="M9 21v-6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 15v6" />
    </svg>
  )
}

function NavExploreIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.35-4.35" />
    </svg>
  )
}

function NavReviewIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function NavInsightsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="11" width="3" height="9" rx="1.5" />
      <rect x="10.5" y="4" width="3" height="16" rx="1.5" />
      <rect x="16" y="8" width="3" height="12" rx="1.5" />
    </svg>
  )
}

function NavProfileIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  )
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false)
  const [supportAboutModal, setSupportAboutModal] = useState({ isOpen: false, mode: "support" })
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isAppInstalled, setIsAppInstalled] = useState(false)

  // Listen for native PWA install prompt
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsAppInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check if running as installed standalone app
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsAppInstalled(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallApp = async () => {
    // 1. Direct Download the APK file on phone
    const link = document.createElement("a")
    link.href = "/CAMPUSHUB_BY_AKTU.apk"
    link.download = "CAMPUSHUB_BY_AKTU.apk"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 2. Also trigger native PWA prompt if available
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        await deferredPrompt.userChoice
        setDeferredPrompt(null)
      } catch {}
    }
  }

  // Celebration modal auto-popup disabled per user instruction
  React.useEffect(() => {
    try {
      sessionStorage.removeItem("show_welcome_celebration")
      setIsCelebrationOpen(false)
    } catch {}
  }, [location.pathname])

  React.useEffect(() => {
    const handleOpenPost = () => setIsPostModalOpen(true)
    window.addEventListener("open_create_post_modal", handleOpenPost)
    return () => window.removeEventListener("open_create_post_modal", handleOpenPost)
  }, [])

  const handleCloseCelebration = () => {
    try {
      sessionStorage.removeItem("show_welcome_celebration")
    } catch {}
    setIsCelebrationOpen(false)
  }
  
  const currentPath = location.pathname

  const navItems = [
    { label: "Home", path: "/feed", icon: NavHomeIcon },
    { label: "Explore", path: "/explore", icon: NavExploreIcon },
    { label: "Review", path: "/submit", icon: NavReviewIcon },
    { label: "Analytics", path: "/analytics", icon: NavInsightsIcon },
    { label: "Profile", path: "/profile", icon: NavProfileIcon },
  ]

  const isUserAdmin = user?.role === "faculty" || user?.role === "admin" || user?.isSuperAdmin || user?.email?.toLowerCase().includes("abhishekpathakrp_ds24@its.edu.in");

  const sidebarNavItems = [
    ...navItems,
    ...(isUserAdmin ? [{ label: "Admin Resolution Hub", path: "/admin", icon: ShieldAlert, badge: "Admin" }] : [])
  ]

  const handlePostCreated = (newPost) => {
    if (currentPath !== "/feed") {
      navigate("/feed")
    }
  }

  return (
    <div className="min-h-screen bg-know-more-theme text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-600 selection:text-white relative">
      {/* Subtle Wave Mesh Overlay from CampusHub Design */}
      <div className="fixed inset-0 bg-wave-pattern pointer-events-none opacity-40 z-0" />
      {/* Ambient Deep Blue & Cyan Glow Spheres */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      
      {/* Create Media Post Modal (Photo or 45-sec Video) */}
      <CreatePostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Help & Support / About Us Modal */}
      <SupportAboutModal
        isOpen={supportAboutModal.isOpen}
        onClose={() => setSupportAboutModal(prev => ({ ...prev, isOpen: false }))}
        mode={supportAboutModal.mode}
      />

      {/* Welcome to CampusSphere Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={handleCloseCelebration}
        userName={user?.fullName}
      />

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-72 bg-[#07142F] backdrop-blur-2xl border-r border-white/[0.08] sticky top-0 h-screen z-30 p-5 shrink-0 justify-between shadow-2xl">
        <div className="space-y-6">
          
          {/* Logo & Brand Header */}
          <Link to="/feed" className="flex flex-col group px-2 py-1">
            <CampusHubLogo size="md" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A8B5CC] mt-1.5 pl-12">
              Student Voice & Campus Intelligence
            </p>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {sidebarNavItems.map((item, index) => {
              const Icon = item.icon

              if (item.isAction) {
                return (
                  <button
                    key={index}
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm bg-[#0D2145] text-[#60A5FA] hover:bg-[#102A56] hover:text-[#F8FAFC] border border-blue-500/20 transition-all duration-200 group shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                      <span>Post Media (45s)</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                      New
                    </span>
                  </button>
                )
              }

              const isActive = currentPath === item.path || 
                (item.path === "/explore" && (currentPath === "/predictor" || currentPath === "/explore")) || 
                (item.path === "/feed" && currentPath === "/")

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2563EB] text-[#F8FAFC] shadow-lg shadow-blue-600/25"
                      : "text-[#A8B5CC] hover:text-[#F8FAFC] hover:bg-[#0D2145]/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#F8FAFC]" : "text-[#7182A3] group-hover:text-[#3B82F6] transition-colors"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[#2563EB]/15 text-[#60A5FA] border border-blue-500/20"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2">
          <Link
            to="/profile"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-colors ${
              currentPath === "/profile" ? "bg-[#102A56] text-[#60A5FA] border border-blue-500/30" : "text-[#A8B5CC] hover:bg-[#0D2145]/70"
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#3B82F6]" /> My Profile
            </span>
            <ChevronRight className="w-4 h-4 text-[#7182A3]" />
          </Link>

          <button
            onClick={() => {
              logout()
              navigate("/login")
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-xs text-[#EF4444] hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Log Out
            </span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT & TOP HEADER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar (Desktop Only) */}
        <header className="hidden md:flex sticky top-0 z-30 bg-[#0B1B3A]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 py-3 items-center justify-between shadow-md relative">
          
          {/* Left Side: CampusSphere Brand Logo (Placed in corner where three lines were) */}
          <div className="flex items-center gap-3">
            <Link to="/feed" className="flex items-center group">
              <CampusHubLogo size="sm" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-medium text-[#A8B5CC]">
              Welcome, <span className="text-[#F8FAFC] font-bold">{user?.fullName || "Student"}</span>
            </span>
          </div>

          {/* Right Side: Create Post Action Button */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl btn-hub-primary text-xs font-bold cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Create Post
            </button>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-10">
          {children}
        </main>
      </div>

      {/* ================= EXACT 5-BUTTON BOTTOM NAVIGATION BAR (MATCHING REFERENCE IMAGE) ================= */}
      <nav 
        className="fixed bottom-0 left-0 right-0 md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-2xl z-40 bg-[#061229]/95 backdrop-blur-2xl border-t md:border border-[#38BDF8]/25 px-2 py-2 flex items-center justify-around select-none transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.85)] md:shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path || 
            (item.path === "/explore" && (currentPath === "/predictor" || currentPath === "/explore")) || 
            (item.path === "/feed" && currentPath === "/")

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "text-[#EDE9FE] scale-105" 
                  : "text-[#4878AF] hover:text-[#93C5FD]"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div className="absolute -inset-1.5 bg-[#818CF8]/25 blur-md rounded-full pointer-events-none" />
                )}
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive 
                      ? "text-[#EDE9FE] drop-shadow-[0_0_8px_rgba(199,210,254,0.9)]" 
                      : "text-[#4878AF] group-hover:text-[#93C5FD]"
                  }`} 
                />
              </div>
              <span 
                className={`text-[11px] font-medium tracking-normal transition-colors ${
                  isActive ? "text-[#EDE9FE] font-semibold" : "text-[#4878AF]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
