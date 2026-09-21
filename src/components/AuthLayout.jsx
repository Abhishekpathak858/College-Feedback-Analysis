import React from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, CheckCircle2 } from "lucide-react"
import CampusHubLogo from "@/components/CampusHubLogo"

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#07142F] text-white">
      {/* Left side branding banner (visible on desktop) */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0B1B3A] text-white p-12 relative overflow-hidden border-r border-white/[0.08]">
        {/* Background decorative subtle glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <CampusHubLogo size="lg" />
          <p className="text-xs text-[#A8B5CC] font-semibold mt-2 pl-14">Student Voice • College Reviews • Campus Intelligence</p>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/20 border border-blue-500/30 text-xs font-semibold text-[#60A5FA]">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Real-time Campus Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight text-white tracking-tight">
            Authentic student reviews, college ratings, and verified campus stories.
          </h2>
          <div className="space-y-3 pt-2">
            {[
              "Real-time sentiment scoring & campus reviews",
              "Cutoff predictor & side-by-side college comparison",
              "Anonymous community pulse + verified feedback channel",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-[#A8B5CC]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#7182A3]">
          © {new Date().getFullYear()} CampusSphere • College Feedback Analysis.
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-[#07142F] text-white">
        <div className="w-full max-w-md space-y-6 bg-[#0D2145] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-2xl">
          <div className="text-center lg:text-left space-y-1.5">
            <div className="lg:hidden flex items-center justify-center mb-4">
              <CampusHubLogo size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-[#A8B5CC] font-medium leading-relaxed">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
