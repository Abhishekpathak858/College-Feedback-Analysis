import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { apiClient } from "@/api/apiClient"
import Hero from "@/components/Hero"
import FeedbackForm from "@/components/FeedbackForm"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import SocialFeed from "@/components/SocialFeed"
import Messages from "@/components/Messages"
import AdminDashboard from "@/components/AdminDashboard"
import { useToast } from "@/components/ui/use-toast"
import AIRecommender from "@/components/AIRecommender"
import StatusTerminal from "@/components/StatusTerminal"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  LogIn,
  UserPlus,
  LogOut,
  FileText,
  BarChart2,
  User,
  HelpCircle,
  Building2,
  Compass,
  Home as HomeIcon,
  Plus,
  Send,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react"

export default function Home() {
  const { user, logout } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("feed")
  const [activeChatUser, setActiveChatUser] = useState(null)

  const handleStartChat = (post) => {
    setActiveChatUser({
      name: post.studentName || post.authorName || "Student",
      email: post.studentEmail || post.authorEmail || "",
      college: post.collegeName || "AKTU College",
    })
    setActiveTab("messages")
  }

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.entities.Feedback.list()
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

  const handleFeedbackSubmitted = (newFeedback) => {
    loadFeedbacks()
    setActiveTab("feed") // Switch to Campus Feed after submitting to see the new post
  }

  // Aggregate stats for Hero
  const stats = {
    total: feedbacks.length,
    positiveRatio: feedbacks.length
      ? Math.round((feedbacks.filter((f) => f.sentiment?.includes("Good")).length / feedbacks.length) * 100)
      : 85,
    avgRating: feedbacks.length
      ? (feedbacks.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / feedbacks.length).toFixed(1)
      : "4.5",
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 pb-16">
      {/* Top Navigation Bar (Action Bar) */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-6xl">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 font-bold text-lg text-foreground cursor-pointer" onClick={() => setActiveTab("feed")}>
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm font-black">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none text-sm font-extrabold">AKTU University</span>
              <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Central Feedback Portal</span>
            </div>
          </div>

          {/* User Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold leading-none">{user.fullName}</span>
                  <span className="text-[9px] text-muted-foreground uppercase">{user.role}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveTab("messages")} className="relative h-9 w-9 rounded-full hover:bg-primary/10 transition-colors">
                  <MessageCircle className={`w-5 h-5 ${activeTab === 'messages' ? 'fill-foreground' : 'text-foreground'}`} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Link to="/login">
                    <LogIn className="w-3.5 h-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-8 px-3 text-xs shadow-sm">
                  <Link to="/register">
                    <UserPlus className="w-3.5 h-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Welcome Banner */}
        {user && activeTab !== "messages" && (
          <div className="mx-4 mt-6 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full hidden sm:block">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl sm:text-2xl text-foreground">
                Welcome, {user.fullName || user.email?.split("@")[0] || "Student"}! <span className="text-2xl">👋</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                Logged in as <span className="font-bold text-primary">{user.username ? `@${user.username}` : (user.role ? user.role.toUpperCase() : "STUDENT")}</span> &bull; {user.collegeName || "AKTU Affiliated College"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "feed" && (
          <SocialFeed feedbacks={feedbacks} onStartChat={handleStartChat} />
        )}

        {activeTab === "messages" && (
          <Messages onClose={() => setActiveTab("feed")} initialChat={activeChatUser} />
        )}

        {activeTab === "submit" && (
          <div className="space-y-6 pb-6 pt-6">
            <div className="px-4 text-center">
              <h2 className="text-xl font-black">Create Post</h2>
              <p className="text-xs text-muted-foreground mt-1">Share your campus experience with photo or video.</p>
            </div>
            <div className="px-4">
              <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="p-4 pt-6">
            <AnalyticsDashboard feedbacks={feedbacks} onDataUpdated={loadFeedbacks} />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-4 pt-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold">Account & Settings</h3>
              <p className="text-xs text-muted-foreground">
                Manage your personal data and access the help centre.
              </p>
            </div>

            {/* Personal Data Section */}
            <div className="p-5 rounded-xl border bg-card shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{user?.fullName || "Guest"}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role || "Student"}</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">College Official Email ID</p>
                  <p className="text-sm font-medium text-primary">{user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    Verified Roll Number
                    <span className="bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded-full ml-1">Strict Tracking</span>
                  </p>
                  <p className="text-sm font-black text-foreground tracking-widest">{user?.rollNumber || "Not Provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">College Name</p>
                  <p className="text-sm font-medium">{user?.collegeName || "AKTU Affiliated College"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Department & Branch Courses</p>
                  <p className="text-sm font-medium">{user?.department || "N/A"} - B.Tech (Core)</p>
                </div>
              </div>
            </div>

            {/* Admin Dashboard (Only for Admin/Faculty) */}
            {(user?.role === "admin" || user?.role === "management" || user?.role === "faculty") && (
              <AdminDashboard feedbacks={feedbacks} onUpdate={loadFeedbacks} />
            )}

            {/* Help Centre */}
            <div className="p-5 rounded-xl border bg-card shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b pb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Help Centre & Contacts</h4>
              </div>
              
              {/* College Contacts */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider bg-muted/50 py-1 px-2 rounded w-max">
                  {user?.collegeName || "Your College"} Contacts
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">support@{user?.collegeName?.replace(/[^a-zA-Z]/g, '').toLowerCase() || "college"}.ac.in</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">+91 (800) 123-4567</span>
                </div>
              </div>

              {/* AKTU Central Contacts */}
              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider bg-muted/50 py-1 px-2 rounded w-max">
                  AKTU Central Helpdesk
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">grievance@aktu.ac.in</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium">0522-2771079</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Button onClick={logout} variant="destructive" className="w-full gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="pb-16">
            <AIRecommender feedbacks={feedbacks} />
          </div>
        )}
      </main>

      {/* Bottom Navigation (Instagram Style) */}
      {activeTab !== "messages" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg pb-safe">
          <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
            
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                activeTab === "feed" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HomeIcon className={`w-6 h-6 ${activeTab === "feed" ? "fill-primary/20" : ""}`} />
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                activeTab === "analytics" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart2 className={`w-6 h-6 ${activeTab === "analytics" ? "fill-primary/20" : ""}`} />
            </button>
            
            {/* Middle Plus Button */}
            <button
              onClick={() => setActiveTab("submit")}
              className="flex items-center justify-center w-full h-full -mt-6 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-105 ${
                activeTab === "submit" ? "bg-primary" : "bg-primary/90"
              }`}>
                <Plus className="w-6 h-6 font-bold" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                activeTab === "ai" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className={`w-6 h-6 ${activeTab === "ai" ? "fill-primary/20" : ""}`} />
            </button>
            
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className={`w-6 h-6 ${activeTab === "profile" ? "fill-primary/20" : ""}`} />
            </button>
            
          </div>
        </div>
      )}
    </div>
  )
}
