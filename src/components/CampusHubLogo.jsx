import React from "react"
import { GraduationCap } from "lucide-react"

export default function CampusHubLogo({ 
  size = "md", 
  showIcon = true, 
  className = "" 
}) {
  const sizeStyles = {
    sm: {
      text: "text-lg",
      iconSize: "w-8 h-8 rounded-xl",
      iconInner: "w-4 h-4",
      dot: "w-1 h-1",
    },
    md: {
      text: "text-xl sm:text-2xl",
      iconSize: "w-10 h-10 rounded-2xl",
      iconInner: "w-5 h-5",
      dot: "w-1.5 h-1.5",
    },
    lg: {
      text: "text-2xl sm:text-3xl",
      iconSize: "w-12 h-12 rounded-2xl",
      iconInner: "w-6 h-6",
      dot: "w-2 h-2",
    },
    xl: {
      text: "text-3xl sm:text-4xl",
      iconSize: "w-14 h-14 rounded-3xl",
      iconInner: "w-7 h-7",
      dot: "w-2.5 h-2.5",
    }
  }[size] || {
    text: "text-xl sm:text-2xl",
    iconSize: "w-10 h-10 rounded-2xl",
    iconInner: "w-5 h-5",
    dot: "w-1.5 h-1.5",
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {showIcon && (
        <div className={`${sizeStyles.iconSize} bg-[#07142F] flex items-center justify-center text-white shadow-lg shadow-blue-600/20 border border-white/[0.08] shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform`}>
          <img src="/campushub-icon-192.png" alt="CampusHub Icon" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center">
        <span 
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }} 
          className={`${sizeStyles.text} font-black tracking-[-0.03em] leading-none text-white`}
        >
          <span>Campus</span>
          <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent ml-0.5">
            Sphere
          </span>
          <span className={`inline-block ${sizeStyles.dot} rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] ml-1 align-baseline animate-pulse`} />
        </span>
      </div>
    </div>
  )
}
