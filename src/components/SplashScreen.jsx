import React, { useEffect, useState } from "react"

export default function SplashScreen({ onFinish, duration = 2400 }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => {
            if (onFinish) onFinish()
          }, 400)
        }, 200)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [duration, onFinish])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-12 px-6 bg-[#070F22] text-white select-none transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(124, 58, 237, 0.25) 0%, rgba(7, 15, 34, 1) 70%)"
      }}
    >
      {/* Top Spacer */}
      <div className="w-full h-8" />

      {/* Center Hero: Official Book + Cap Logo, Brand Name & Tagline */}
      <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-[32px] blur-xl opacity-60 animate-pulse" />
          <img 
            src="/campushub-icon-512.png" 
            alt="CampusSphere Logo" 
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-[28px] object-cover shadow-[0_16px_40px_rgba(0,0,0,0.8)] border border-white/15"
          />
        </div>

        <p className="text-sm sm:text-base font-medium text-[#94A3B8] max-w-xs tracking-wide pt-2">
          Your Campus. <span className="text-[#38BDF8] font-semibold">Your Voice.</span> Your Future.
        </p>

        {/* Animated Progress Bar */}
        <div className="w-64 sm:w-72 pt-8">
          <div className="relative h-2 w-full bg-[#1E293B] rounded-full overflow-hidden shadow-inner border border-white/5">
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#00D0FF] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(0,208,255,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Version Tag */}
      <div className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
        v2.0
      </div>
    </div>
  )
}
