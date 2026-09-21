import React from "react"
import { Link } from "react-router-dom"
import { GraduationCap, Heart, Shield, Github, CheckCircle2 } from "lucide-react"

export default function TerminalFooter() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span>College Feedback Intelligence</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Empowering academic institutions with automated sentiment analysis, real-time student feedback aggregation, and actionable institutional improvement insights.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Online
              </span>
              <span>•</span>
              <span>CampusSphere Core v1.0.0</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Overview & Dashboard
                </Link>
              </li>
              <li>
                <a href="#feedback-form" className="hover:text-foreground transition-colors">
                  Submit Feedback
                </a>
              </li>
              <li>
                <a href="#analytics-section" className="hover:text-foreground transition-colors">
                  Sentiment Analytics
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Faculty & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Institutional Policy</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>100% Anonymous Option</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>AI Polarity Tagging</span>
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                Student Grievance Cell
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                Privacy & Data Security
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} College Feedback & Sentiment Analysis System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for Academic Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
