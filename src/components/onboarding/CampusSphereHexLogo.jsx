import React from "react"

export default function CampusSphereHexLogo({ size = "md", showText = true, textBelow = true, className = "" }) {
  const sizeMap = {
    sm: { icon: "w-10 h-10", svg: 24, font: "text-lg", sub: "text-[10px]" },
    md: { icon: "w-16 h-16", svg: 36, font: "text-2xl", sub: "text-xs" },
    lg: { icon: "w-24 h-24", svg: 54, font: "text-3xl", sub: "text-sm" },
    xl: { icon: "w-28 h-28", svg: 64, font: "text-4xl", sub: "text-base" },
  }

  const s = sizeMap[size] || sizeMap.md

  return (
    <div className={`flex ${textBelow ? "flex-col" : "flex-row"} items-center gap-3 ${className}`}>
      {/* Glowing Hexagon Badge */}
      <div className={`relative ${s.icon} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] to-[#00D0FF] rounded-2xl blur-lg opacity-40 animate-pulse" />
        
        {/* Hexagon / Squircle Container with Gradient Border */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0F2347] to-[#061226] border border-[#38BDF8]/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center justify-center overflow-hidden">
          {/* Subtle inner reflection */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* SVG Graduation Cap + Book */}
          <svg
            width={s.svg}
            height={s.svg}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-md"
          >
            {/* Graduation Cap (White) */}
            <path
              d="M50 16L18 32L50 48L82 32L50 16Z"
              fill="#FFFFFF"
            />
            <path
              d="M32 40V54C32 54 40 62 50 62C60 62 68 54 68 54V40L50 49L32 40Z"
              fill="#E2E8F0"
            />
            {/* Tassel */}
            <path
              d="M78 34V52C78 54 75 56 75 58"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="75" cy="59" r="2.5" fill="#38BDF8" />

            {/* Open Book Wings (Electric Blue Gradient) */}
            {/* Left Page */}
            <path
              d="M20 62C30 60 42 66 48 72C48 76 34 74 20 78C18 78 18 64 20 62Z"
              fill="url(#leftWingGrad)"
            />
            <path
              d="M20 70C30 68 40 73 48 78C48 81 34 79 20 84C18 84 18 72 20 70Z"
              fill="#0284C7"
            />

            {/* Right Page */}
            <path
              d="M80 62C70 60 58 66 52 72C52 76 66 74 80 78C82 78 82 64 80 62Z"
              fill="url(#rightWingGrad)"
            />
            <path
              d="M80 70C70 68 60 73 52 78C52 81 66 79 80 84C82 84 82 72 80 70Z"
              fill="#0284C7"
            />

            <defs>
              <linearGradient id="leftWingGrad" x1="20" y1="62" x2="48" y2="76" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="rightWingGrad" x1="80" y1="62" x2="52" y2="76" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex flex-col ${textBelow ? "items-center text-center" : "items-start"}`}>
          <div className={`font-extrabold tracking-tight flex items-baseline ${s.font} font-['Outfit']`}>
            <span className="text-white drop-shadow-sm">Campus</span>
            <span className="bg-gradient-to-r from-[#00D0FF] to-[#3B82F6] bg-clip-text text-transparent drop-shadow-sm ml-0.5">Sphere</span>
          </div>
        </div>
      )}
    </div>
  )
}
