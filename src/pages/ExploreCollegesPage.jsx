import React, { useState, useMemo, useEffect } from "react"
import { Search, Heart, Star, Building2, MapPin, X, ChevronRight } from "lucide-react"
import { ALL_AKTU_COLLEGES } from "@/lib/collegeData"
import CollegeDetailsView from "@/components/CollegeDetailsView"
import { base44Client } from "@/api/base44Client"

export default function ExploreCollegesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all") // "all" | "top" | "nearby"
  const [displayCount, setDisplayCount] = useState(25)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("campussphere_favorite_colleges")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [realRatingsMap, setRealRatingsMap] = useState({})

  useEffect(() => {
    let isMounted = true
    const loadRealRatings = async () => {
      try {
        const allFeedbacks = await base44Client.entities.Feedback.list()
        if (!isMounted || !Array.isArray(allFeedbacks)) return

        const norm = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "")
        const ratingMap = {}

        allFeedbacks.forEach(item => {
          if (!item.collegeName || !item.rating) return
          const key = norm(item.collegeName)
          if (!ratingMap[key]) {
            ratingMap[key] = { total: 0, count: 0 }
          }
          ratingMap[key].total += Number(item.rating) || 0
          ratingMap[key].count += 1
        })

        setRealRatingsMap(ratingMap)
      } catch (e) {
        console.error("Error loading college ratings:", e)
      }
    }
    loadRealRatings()
    return () => { isMounted = false }
  }, [])

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem("campussphere_favorite_colleges", JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  // Multi-token smart search logic across all AKTU affiliated colleges
  const filteredColleges = useMemo(() => {
    const rawQuery = searchQuery.toLowerCase().trim()
    const tokens = rawQuery.split(/\s+/).filter(Boolean)
    const norm = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "")

    return ALL_AKTU_COLLEGES.filter(col => {
      if (tokens.length > 0) {
        const searchableCorpus = `${col.name} ${col.location} ${col.fullName || ""} ${col.region || ""} ${col.id || ""}`.toLowerCase()
        const matchesAllTokens = tokens.every(token => searchableCorpus.includes(token))
        if (!matchesAllTokens) return false
      }

      if (activeTab === "top") {
        const real = realRatingsMap[norm(col.name)]
        if (real && real.count > 0) {
          return (real.total / real.count) >= 4.0
        }
        return col.score >= 75
      }
      if (activeTab === "nearby") {
        const loc = col.location.toLowerCase()
        return loc.includes("noida") || 
               loc.includes("ghaziabad") || 
               loc.includes("meerut") || 
               loc.includes("lucknow") ||
               loc.includes("kanpur")
      }
      return true
    })
  }, [searchQuery, activeTab])

  // Slice for fast buttery-smooth rendering
  const visibleColleges = useMemo(() => {
    return filteredColleges.slice(0, displayCount)
  }, [filteredColleges, displayCount])

  if (selectedCollege) {
    return (
      <CollegeDetailsView
        college={selectedCollege}
        onBack={() => setSelectedCollege(null)}
      />
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto min-h-[85vh] flex flex-col pt-2 pb-24 text-white select-none">
      
      {/* Top Header: Circular Logo Badge + "Explore Colleges" */}
      <div className="flex items-center gap-3 px-2 py-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#0B1A3A] border border-blue-400/30 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.25)] shrink-0 overflow-hidden">
          <img src="/campushub-icon-192.png" alt="CampusSphere" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold font-['Outfit'] text-white tracking-tight leading-tight">
            Explore Colleges
          </h1>
        </div>
      </div>

      {/* Search Input matching reference image */}
      <div className="relative w-full px-1 mb-3.5">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search colleges, city, or district..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setDisplayCount(25) // reset pagination on new search
          }}
          className="w-full bg-[#0B1736] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs: [All] [Top Rated] [Nearby] */}
      <div className="flex items-center gap-2.5 px-1 mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab("all")
            setDisplayCount(25)
          }}
          className={`py-2 px-5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 scale-105"
              : "bg-[#0B1B3A] text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("top")
            setDisplayCount(25)
          }}
          className={`py-2 px-5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "top"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 scale-105"
              : "bg-[#0B1B3A] text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
          }`}
        >
          Top Rated
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("nearby")
            setDisplayCount(25)
          }}
          className={`py-2 px-5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === "nearby"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 scale-105"
              : "bg-[#0B1B3A] text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
          }`}
        >
          Nearby
        </button>
      </div>

      {/* Dark Navy Glassmorphism Container matching application theme */}
      <div className="bg-[#0B1B3A]/85 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 text-white space-y-1">
        {filteredColleges.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-slate-500" />
            <p className="text-sm font-semibold text-slate-200">No AKTU colleges found matching "{searchQuery}"</p>
            <p className="text-xs text-slate-400">Try searching by college name (e.g. JSS, KIET, ABES) or city (Lucknow, Kanpur, Noida).</p>
          </div>
        ) : (
          visibleColleges.map((college, index) => {
            const isFav = !!favorites[college.id]

            return (
              <div
                key={college.id}
                onClick={() => setSelectedCollege(college)}
                className={`flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.06] active:bg-white/[0.1] transition-all cursor-pointer group ${
                  index !== visibleColleges.length - 1 ? "border-b border-white/[0.06]" : ""
                }`}
              >
                {/* Left: Thumbnail & College Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Photo Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border border-white/15 bg-slate-900">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                      {college.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>{college.location}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-400 font-mono bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded-md text-[11px]">
                        {college.score}/100
                      </span>
                    </div>

                    {/* Rating or Not Rated Yet */}
                    {(() => {
                      const norm = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "")
                      const real = realRatingsMap[norm(college.name)]
                      if (real && real.count > 0) {
                        const avg = (Math.round((real.total / real.count) * 10) / 10).toFixed(1)
                        return (
                          <div className="flex items-center gap-1 pt-0.5">
                            <span className="text-xs font-bold text-amber-400 font-mono">{avg}</span>
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] text-slate-400">({real.count})</span>
                          </div>
                        )
                      }
                      return (
                        <div className="flex items-center gap-1 pt-0.5">
                          <Star className="w-3 h-3 text-slate-500" />
                          <span className="text-[11px] font-semibold text-slate-400">Not rated yet</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Right: Heart Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, college.id)}
                  className="p-2.5 rounded-full hover:bg-white/10 active:scale-90 transition-all cursor-pointer shrink-0"
                  aria-label="Save college"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFav
                        ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        : "text-slate-400 hover:text-rose-400"
                    }`}
                  />
                </button>
              </div>
            )
          })
        )}

        {/* Load More Button if filtered items exceed display count */}
        {filteredColleges.length > displayCount && (
          <div className="pt-3 pb-1 text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 30)}
              className="py-2.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer border border-white/10 shadow-xs hover:border-white/20"
            >
              Load More Colleges ({filteredColleges.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

