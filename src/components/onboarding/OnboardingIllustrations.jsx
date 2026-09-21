import React from "react"

export function RealStudentExperiencesIllustration({ className = "w-64 h-56" }) {
  return (
    <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow */}
      <circle cx="160" cy="140" r="100" fill="#3B82F6" fillOpacity="0.15" filter="blur(40px)" />
      
      {/* Chat Bubble 1 (Left - Review) */}
      <g className="animate-pulse" style={{ animationDuration: "3s" }}>
        <rect x="35" y="35" width="105" height="42" rx="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="52" cy="56" r="8" fill="#38BDF8" fillOpacity="0.2" />
        <path d="M52 50L53.5 54.5H58L54.5 57L56 61.5L52 59L48 61.5L49.5 57L46 54.5H50.5L52 50Z" fill="#FBBF24" />
        <rect x="68" y="49" width="60" height="5" rx="2.5" fill="#F8FAFC" />
        <rect x="68" y="58" width="40" height="4" rx="2" fill="#94A3B8" />
        {/* Tail */}
        <path d="M70 77L78 84L82 77H70Z" fill="#1E293B" />
      </g>

      {/* Chat Bubble 2 (Right - Verified Badge) */}
      <g className="animate-pulse" style={{ animationDuration: "3.5s" }}>
        <rect x="185" y="25" width="100" height="38" rx="12" fill="#1E293B" stroke="#818CF8" strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="202" cy="44" r="7" fill="#22C55E" />
        <path d="M199 44L201 46L205 42" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="216" y="39" width="55" height="5" rx="2.5" fill="#F8FAFC" />
        <rect x="216" y="47" width="35" height="4" rx="2" fill="#94A3B8" />
        {/* Tail */}
        <path d="M220 63L225 70L232 63H220Z" fill="#1E293B" />
      </g>

      {/* Student 1 (Left - Male) */}
      <g>
        {/* Body / Clothes */}
        <path d="M90 240C90 205 105 190 120 185H140C155 190 170 205 170 240V260H90V240Z" fill="#3B82F6" />
        {/* Collar & Tie */}
        <path d="M125 185L130 210L135 185H125Z" fill="#FFFFFF" />
        <path d="M128 200L130 225L132 200H128Z" fill="#EF4444" />
        {/* Head */}
        <circle cx="130" cy="155" r="22" fill="#FBBF24" />
        {/* Hair */}
        <path d="M110 152C110 135 120 130 135 130C150 130 155 140 155 152C148 145 140 144 130 145C120 146 115 148 110 152Z" fill="#1E293B" />
        {/* Smile */}
        <path d="M126 164C128 166 132 166 134 164" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Student 2 (Center - Female with Notebook) */}
      <g>
        {/* Body */}
        <path d="M135 240C135 200 150 185 165 182H185C200 185 215 200 215 240V260H135V240Z" fill="#F43F5E" />
        {/* Notebook */}
        <rect x="155" y="210" width="38" height="48" rx="4" fill="#38BDF8" transform="rotate(-8 155 210)" />
        <line x1="162" y1="220" x2="182" y2="217" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="163" y1="228" x2="180" y2="225" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Head */}
        <circle cx="175" cy="150" r="20" fill="#FCD34D" />
        {/* Hair (Long) */}
        <path d="M155 152C155 130 168 126 182 126C196 126 200 135 200 155C200 180 192 188 190 190L186 160L160 160L156 190C154 185 155 168 155 152Z" fill="#0F172A" />
        {/* Smile */}
        <path d="M172 158C174 160 177 160 179 158" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Student 3 (Right - Female) */}
      <g>
        {/* Body */}
        <path d="M185 240C185 210 198 198 212 194H232C246 198 260 210 260 240V260H185V240Z" fill="#8B5CF6" />
        {/* Head */}
        <circle cx="222" cy="160" r="19" fill="#FDE68A" />
        {/* Hair (Bun) */}
        <circle cx="222" cy="138" r="10" fill="#475569" />
        <path d="M205 160C205 140 215 137 228 137C238 137 242 143 242 160C236 154 228 153 220 154C212 155 208 157 205 160Z" fill="#475569" />
      </g>
    </svg>
  )
}

export function CompareCollegesIllustration({ className = "w-64 h-56" }) {
  return (
    <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow */}
      <circle cx="160" cy="140" r="100" fill="#8B5CF6" fillOpacity="0.15" filter="blur(40px)" />
      
      {/* Moon / Sun Ring */}
      <circle cx="160" cy="80" r="50" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

      {/* Mountain Silhouettes */}
      <path d="M20 230L90 150L150 230H20Z" fill="#1E1B4B" fillOpacity="0.4" />
      <path d="M170 230L230 160L300 230H170Z" fill="#1E1B4B" fillOpacity="0.4" />

      {/* College Campus Building */}
      <g>
        {/* Ground Base */}
        <rect x="40" y="225" width="240" height="15" rx="4" fill="#1E293B" />
        
        {/* Left Wing */}
        <rect x="65" y="160" width="65" height="65" rx="4" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Left Windows */}
        <rect x="75" y="172" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="95" y="172" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="115" y="172" width="6" height="15" rx="1" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="75" y="198" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="95" y="198" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />

        {/* Right Wing */}
        <rect x="190" y="160" width="65" height="65" rx="4" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" />
        {/* Right Windows */}
        <rect x="200" y="172" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="220" y="172" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="240" y="172" width="6" height="15" rx="1" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="200" y="198" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />
        <rect x="220" y="198" width="12" height="15" rx="2" fill="#38BDF8" fillOpacity="0.8" />

        {/* Central Grand Hall */}
        <rect x="120" y="130" width="80" height="95" rx="4" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />

        {/* Neoclassical Pillars */}
        <line x1="135" y1="170" x2="135" y2="225" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="170" x2="150" y2="225" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <line x1="170" y1="170" x2="170" y2="225" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <line x1="185" y1="170" x2="185" y2="225" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

        {/* Grand Arch Door */}
        <path d="M152 225V200C152 195 156 192 160 192C164 192 168 195 168 200V225H152Z" fill="#38BDF8" />

        {/* Triangle Pediment */}
        <path d="M115 132L160 95L205 132H115Z" fill="#3B82F6" stroke="#60A5FA" strokeWidth="2" />

        {/* Clock in Pediment */}
        <circle cx="160" cy="116" r="8" fill="#FFFFFF" />
        <line x1="160" y1="116" x2="160" y2="111" stroke="#0F172A" strokeWidth="1.5" />
        <line x1="160" y1="116" x2="164" y2="116" stroke="#0F172A" strokeWidth="1.5" />

        {/* Spire & Flag */}
        <line x1="160" y1="95" x2="160" y2="70" stroke="#F8FAFC" strokeWidth="2" />
        <path d="M160 70L178 77L160 84V70Z" fill="#F43F5E" />

        {/* Trees on sides */}
        <circle cx="50" cy="210" r="16" fill="#10B981" />
        <rect x="48" y="218" width="4" height="12" fill="#78350F" />
        <circle cx="270" cy="210" r="16" fill="#10B981" />
        <rect x="268" y="218" width="4" height="12" fill="#78350F" />

        {/* Pathway with Glow */}
        <polygon points="145,225 175,225 190,260 130,260" fill="url(#pathGrad)" opacity="0.8" />
      </g>

      {/* Floating Rating Badges */}
      <g className="animate-bounce" style={{ animationDuration: "4s" }}>
        <rect x="40" y="90" width="55" height="24" rx="12" fill="#10B981" />
        <text x="67" y="106" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">★ 4.8</text>
      </g>
      <g className="animate-bounce" style={{ animationDuration: "4.5s" }}>
        <rect x="225" y="90" width="55" height="24" rx="12" fill="#6366F1" />
        <text x="252" y="106" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Rank #1</text>
      </g>

      <defs>
        <linearGradient id="pathGrad" x1="160" y1="225" x2="160" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function CommunityIllustration({ className = "w-64 h-56" }) {
  return (
    <svg className={className} viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Glow */}
      <circle cx="160" cy="140" r="100" fill="#00D0FF" fillOpacity="0.15" filter="blur(40px)" />

      {/* Floating Discussion Clouds */}
      <g className="animate-pulse" style={{ animationDuration: "2.8s" }}>
        <rect x="120" y="30" width="90" height="42" rx="14" fill="#1E293B" stroke="#00D0FF" strokeWidth="1.5" strokeOpacity="0.8" />
        {/* Chat text lines */}
        <rect x="135" y="44" width="60" height="5" rx="2.5" fill="#F8FAFC" />
        <rect x="135" y="53" width="42" height="4" rx="2" fill="#00D0FF" />
        {/* Tail */}
        <path d="M155 72L162 80L167 72H155Z" fill="#1E293B" />
      </g>

      {/* Left Person (Speaking with Phone) */}
      <g>
        <path d="M70 240C70 205 85 190 102 186H122C138 190 152 205 152 240V260H70V240Z" fill="#2563EB" />
        <circle cx="112" cy="155" r="20" fill="#FDE047" />
        {/* Short Dark Hair */}
        <path d="M94 150C94 132 105 130 118 130C130 130 135 136 135 150C128 144 120 144 112 144C104 144 98 146 94 150Z" fill="#0F172A" />
        {/* Raised Arm with Smartphone */}
        <path d="M135 200L150 175" stroke="#FDE047" strokeWidth="8" strokeLinecap="round" />
        <rect x="145" y="160" width="12" height="22" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
      </g>

      {/* Center Connected Icon Badge */}
      <g className="animate-pulse" style={{ animationDuration: "2s" }}>
        <circle cx="160" cy="190" r="18" fill="#6366F1" />
        {/* Heart / Pulse Icon */}
        <path d="M152 190C152 185 156 182 160 186C164 182 168 185 168 190C168 196 160 200 160 200C160 200 152 196 152 190Z" fill="white" />
      </g>

      {/* Right Person (Female Listening) */}
      <g>
        <path d="M175 240C175 205 190 190 205 186H225C240 190 255 205 255 240V260H175V240Z" fill="#7C3AED" />
        <circle cx="215" cy="155" r="20" fill="#FBBF24" />
        {/* Hair with Headband */}
        <path d="M195 152C195 128 210 126 225 126C238 126 242 136 242 155C242 175 235 182 232 185L228 162L202 162L198 185C195 178 195 168 195 152Z" fill="#1E293B" />
        <path d="M200 144C208 140 220 140 230 144" stroke="#00D0FF" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Floating Hearts / Like Icons */}
      <circle cx="85" cy="115" r="10" fill="#EF4444" fillOpacity="0.8" />
      <path d="M80 115C80 112 82 110 85 113C88 110 90 112 90 115C90 119 85 121 85 121C85 121 80 119 80 115Z" fill="white" />

      <circle cx="240" cy="105" r="10" fill="#3B82F6" fillOpacity="0.8" />
      <path d="M236 106L239 109L245 102" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
