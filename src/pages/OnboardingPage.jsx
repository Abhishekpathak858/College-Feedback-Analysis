import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const SLIDES = [
  {
    id: "reviews",
    title: "Real Student Experiences",
    subtitle: "Read authentic reviews, complaints and insights from verified students.",
    image: "/onboarding/slide1_experiences.jpg",
    alt: "Real student experiences and authentic campus discussions",
  },
  {
    id: "compare",
    title: "Compare Colleges",
    subtitle: "Explore, compare and find the best fit for your future across AKTU.",
    image: "/onboarding/slide2_aktu.jpg",
    alt: "Dr. A.P.J. Abdul Kalam Technical University (AKTU) Campus",
  },
  {
    id: "community",
    title: "Be Part of the Community",
    subtitle: "Share, discuss and stay updated with your campus and peers.",
    image: "/onboarding/slide3_community.jpg?v=2",
    alt: "Authentic vibrant tech student community",
  },
]

export default function OnboardingPage({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const handleFinish = () => {
    try {
      localStorage.setItem("campussphere_onboarding_completed", "true")
    } catch {}

    if (onComplete) {
      onComplete()
    } else {
      navigate("/login")
    }
  }

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1)
    } else {
      handleFinish()
    }
  }

  const slide = SLIDES[currentSlide]
  const isLast = currentSlide === SLIDES.length - 1

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#070F22] text-white select-none"
      style={{
        background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(99, 102, 241, 0.18) 0%, rgba(7, 15, 34, 1) 75%)"
      }}
    >
      {/* Mobile Card Container matching the reference layout */}
      <div className="w-full max-w-md bg-[#0B1733] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-h-[620px] transition-all">
        
        {/* Top Slide Header: Title & Subtitle */}
        <div className="text-center pt-2 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white tracking-tight">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-normal leading-relaxed px-4">
            {slide.subtitle}
          </p>
        </div>

        {/* Center Image Container with smooth transition */}
        <div className="flex-1 flex items-center justify-center py-5">
          <div key={slide.id} className="animate-in fade-in zoom-in-95 duration-500 w-full flex justify-center">
            <div className="relative group w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1733]/60 via-transparent to-transparent z-10 pointer-events-none" />
              <img 
                src={slide.image} 
                alt={slide.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Area: Step Indicator Dots + Action Buttons */}
        <div className="space-y-6 pb-2">
          {/* 3-Dot Indicator */}
          <div className="flex items-center justify-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-7 h-2 bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons: Next / Get Started & Skip */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED] shadow-[0_8px_20px_rgba(99,102,241,0.35)] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isLast ? "Get Started" : "Next"}
            </button>

            {!isLast ? (
              <button
                onClick={handleFinish}
                className="text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer py-1"
              >
                Skip
              </button>
            ) : (
              <div className="h-6" />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
