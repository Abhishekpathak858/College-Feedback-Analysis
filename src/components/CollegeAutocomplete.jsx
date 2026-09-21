import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Building2, Check, Search, X } from "lucide-react"
import { AKTU_COLLEGES } from "@/lib/categories"

export default function CollegeAutocomplete({ 
  value = "", 
  onChange, 
  placeholder = "Search college by name or city (e.g. ITS, Galgotia, KIET, Lucknow)...",
  id = "collegeName",
  required = false,
  className = ""
}) {
  const [query, setQuery] = useState(value || "")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredColleges, setFilteredColleges] = useState([])
  const containerRef = useRef(null)

  // Keep internal query in sync if parent value changes externally
  useEffect(() => {
    setQuery(value || "")
  }, [value])

  // Filter colleges live based on search query
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setFilteredColleges(AKTU_COLLEGES.slice(0, 15)) // Show first 15 by default on focus
    } else {
      const q = query.toLowerCase().trim()
      const matches = AKTU_COLLEGES.filter(c => c.toLowerCase().includes(q))
      setFilteredColleges(matches.slice(0, 20)) // Top 20 matches
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const newVal = e.target.value
    setQuery(newVal)
    if (onChange) onChange(newVal)
    setIsOpen(true)
  }

  const handleSelectCollege = (collegeName) => {
    setQuery(collegeName)
    if (onChange) onChange(collegeName)
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery("")
    if (onChange) onChange("")
    setIsOpen(true)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          className={`pl-9 pr-8 transition-all ${className}`}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-popover/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-border/40">
          
          {/* Header indicator */}
          <div className="px-3 py-1.5 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider sticky top-0 backdrop-blur z-10 flex items-center justify-between">
            <span>{filteredColleges.length > 0 ? `${filteredColleges.length} Matching Colleges` : "No Matching College Found"}</span>
            <span className="text-[9px] text-primary/70">AKTU Database</span>
          </div>

          {filteredColleges.length > 0 ? (
            filteredColleges.map((college, idx) => {
              const isSelected = query.toLowerCase() === college.toLowerCase()
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectCollege(college)}
                  className={`px-3.5 py-2.5 text-xs cursor-pointer flex items-center justify-between transition-colors hover:bg-primary/10 active:bg-primary/20 ${
                    isSelected ? "bg-primary/15 font-bold text-primary" : "text-foreground font-medium"
                  }`}
                >
                  <span className="line-clamp-1 pr-2">{college}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-primary" />}
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Can't find your college?
              </p>
              <p className="text-[11px] text-primary font-bold">
                You can keep typing your custom college name above!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
