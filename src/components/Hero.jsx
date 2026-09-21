import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  BarChart3,
  MessageSquarePlus,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"

export default function Hero({ stats = { total: 0, positiveRatio: 0, avgRating: 0 }, onViewDashboard }) {
  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-24">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-card/80 backdrop-blur text-xs font-semibold text-primary shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI-Driven Academic Sentiment Analysis Engine</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span className="text-muted-foreground">Version 1.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Transforming Student Feedback into{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Submit your honest course, faculty, and campus feedback. Our natural language processing engine analyzes sentiment polarity in real-time to drive immediate institutional improvements.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <a href="#feedback-form">
                <MessageSquarePlus className="w-4 h-4" />
                Submit Feedback
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 bg-card" onClick={onViewDashboard}>
              <BarChart3 className="w-4 h-4" />
              View Sentiment Dashboard
            </Button>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
            <div className="p-4 rounded-xl border bg-card/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-lg mb-0.5">
                <Users className="w-4 h-4 text-primary" />
                <span>{stats.total}+ Submissions</span>
              </div>
              <p className="text-xs text-muted-foreground">Collected across 8 college departments</p>
            </div>

            <div className="p-4 rounded-xl border bg-card/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-0.5">
                <TrendingUp className="w-4 h-4" />
                <span>{stats.positiveRatio}% Positive</span>
              </div>
              <p className="text-xs text-muted-foreground">Automated polarity sentiment score</p>
            </div>

            <div className="p-4 rounded-xl border bg-card/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg mb-0.5">
                <Award className="w-4 h-4" />
                <span>{stats.avgRating} / 5.0 Rating</span>
              </div>
              <p className="text-xs text-muted-foreground">Institutional satisfaction index</p>
            </div>

            <div className="p-4 rounded-xl border bg-card/50 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Anonymous</span>
              </div>
              <p className="text-xs text-muted-foreground">Safe and encrypted student identity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
