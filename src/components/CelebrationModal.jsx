import React, { useEffect } from "react"
import { PartyPopper, GraduationCap, X, ArrowRight } from "lucide-react"
import { triggerPartyPopperConfetti } from "@/lib/celebration"

export default function CelebrationModal({ isOpen, onClose, userName }) {
  useEffect(() => {
    if (isOpen) {
      try {
        triggerPartyPopperConfetti()
      } catch (err) {
        console.warn("Confetti effect caught safely:", err)
      }

      // Auto-dismiss after 2 seconds so it doesn't linger
      const timer = setTimeout(() => {
        onClose?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-[92%] max-w-lg rounded-3xl p-8 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-indigo-500/40 text-white shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing Background Spheres */}
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl pointer-events-none animate-pulse" />

        {/* 3D Party Popper Icon Badge */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-0.5 shadow-xl shadow-indigo-500/30 flex items-center justify-center animate-bounce mb-4">
          <div className="w-full h-full rounded-[22px] bg-slate-900/90 flex items-center justify-center">
            <PartyPopper className="w-10 h-10 text-amber-300" />
          </div>
        </div>

        {/* Student Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30 mx-auto mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
          <span>Student Voice & Community Platform</span>
        </div>

        {/* Main Requested Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 tracking-tight leading-tight mb-2">
          WELCOME TO CAMPUSSPHERE
        </h2>

        {/* User Greeting & Description */}
        <p className="text-sm font-bold text-indigo-100 mb-2">
          Hello {userName || "AKTU Student"}!
        </p>

        <p className="text-xs text-indigo-200/80 font-medium leading-relaxed max-w-sm mx-auto mb-6">
          Your verified student account is active. Connect with 750+ AKTU colleges and share campus pulse posts!
        </p>

        {/* Interactive Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-600/40 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore Campus Pulse Now</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </div>
  )
}
