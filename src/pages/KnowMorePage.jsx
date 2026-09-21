import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import { AKTU_COLLEGES, DEPARTMENTS, COURSES, YEARS_OF_STUDY } from "@/lib/categories"
import CollegeAutocomplete from "@/components/CollegeAutocomplete"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { GraduationCap, Building2, BookOpen, Layers, Mail, Hash, ArrowRight, User, Phone } from "lucide-react"

export default function KnowMorePage() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || user?.collegeEmail || "",
    collegeName: "",
    rollNumber: "",
    course: "",
    department: "",
    yearOfStudy: "",
  })

  const [submitting, setSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || user.collegeEmail || "",
      }))
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Student Full Name: Required
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      toast({
        title: "Student Name Required",
        description: "Please enter your full student name to proceed.",
        variant: "destructive"
      })
      return
    }

    // 2. Mobile Number: Required
    const cleanDigits = formData.phone.replace(/\D/g, "")
    if (!cleanDigits || cleanDigits.length < 10) {
      toast({
        title: "Valid Mobile Number Required",
        description: "Please enter your 10-digit mobile number.",
        variant: "destructive"
      })
      return
    }

    // 3. Email ID: Required (Personal or College)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      toast({
        title: "Valid Email ID is Required",
        description: "Please enter a valid email address (Personal Gmail/Yahoo or College Email).",
        variant: "destructive"
      })
      return
    }


    try {
      setSubmitting(true)
      
      const updatedProfile = {
        ...user,
        fullName: formData.fullName.trim(),
        phone: cleanDigits,
        email: formData.email.trim().toLowerCase(),
        collegeEmail: formData.email.trim().toLowerCase(),
        collegeName: formData.collegeName?.trim() || "",
        rollNumber: formData.rollNumber?.trim() || "",
        course: formData.course || "",
        department: formData.department || "",
        yearOfStudy: formData.yearOfStudy || "",
        isProfileCompleted: true,
      }

      await updateProfile(updatedProfile)

      toast({
        title: "🎓 Profile Completed!",
        description: "Your profile details have been saved successfully.",
        variant: "success",
        duration: 1800
      })

      navigate("/feed")
    } catch (err) {
      console.error("Save profile error:", err)
      toast({
        title: "Profile Save Failed",
        description: err.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Skip option for new students who don't have college details yet
  const handleSkip = () => {
    toast({
      title: "Welcome to CampusSphere!",
      description: "You can update your college details anytime from your Profile.",
      variant: "success",
      duration: 4000
    })
    navigate("/feed")
  }

  return (
    <div className="min-h-screen bg-know-more-theme flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden">
      
      {/* Subtle Wave Mesh Pattern from Mockup */}
      <div className="fixed inset-0 bg-wave-pattern pointer-events-none opacity-40 z-0" />

      {/* Glow Effects */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="w-full max-w-xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Step 2: Know More About You</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 tracking-tight leading-tight mb-2">
          AKTU Student Details 🎓
        </h1>
        <p className="text-center text-xs sm:text-sm text-indigo-200/80 mb-6 font-medium">
          Welcome, <strong>{user?.fullName || formData.fullName || "Student"}</strong>! Please complete your verified student details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input type="text" style={{ display: 'none' }} />
          
          {/* 1. Student Full Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" /> Student Full Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              type="text"
              placeholder="Enter your full name"
              className="bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-indigo-400 font-medium"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>

          {/* 2. Mobile Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-400" /> Mobile Number <span className="text-rose-400">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-300">
                +91
              </div>
              <Input
                type="tel"
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="pl-12 bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-indigo-400 font-medium tracking-wider"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))}
                required
              />
            </div>
          </div>

          {/* 3. Email ID - Personal or College Email */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" /> Email ID (Personal or College) <span className="text-rose-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="e.g. yourname@gmail.com or student@college.edu.in"
              className="bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-indigo-400 font-medium"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <p className="text-[11px] text-indigo-300/70">Personal email ID (Gmail, Yahoo, Outlook) ya College official email ID - koi sa bhi daal sakte hain.</p>
          </div>

          {/* 3. AKTU College Name Autocomplete (Optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" /> AKTU College Name <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
            </Label>
            <CollegeAutocomplete
              colleges={AKTU_COLLEGES}
              value={formData.collegeName}
              onChange={(val) => setFormData(prev => ({ ...prev, collegeName: val }))}
              placeholder="Search or enter your AKTU college..."
              className="bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 text-xs rounded-xl focus:border-indigo-400"
            />
          </div>

          {/* Course & Department in 2-Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Course */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Course / Degree
              </Label>
              <Select
                value={formData.course}
                onValueChange={(val) => setFormData(prev => ({ ...prev, course: val }))}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white text-xs rounded-xl">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {COURSES.map(c => (
                    <SelectItem key={c} value={c} className="hover:bg-indigo-600/30">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department / Branch */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> Branch / Department
              </Label>
              <Select
                value={formData.department}
                onValueChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white text-xs rounded-xl">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {DEPARTMENTS.map(d => (
                    <SelectItem key={d} value={d} className="hover:bg-indigo-600/30">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Year of Study & AKTU Roll Number in 2-Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Year of Study */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Year of Study
              </Label>
              <Select
                value={formData.yearOfStudy}
                onValueChange={(val) => setFormData(prev => ({ ...prev, yearOfStudy: val }))}
              >
                <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white text-xs rounded-xl">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {YEARS_OF_STUDY.map(y => (
                    <SelectItem key={y} value={y} className="hover:bg-indigo-600/30">{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Roll Number / University Roll */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-indigo-400" /> AKTU Roll No. (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g. 2100970100012"
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-indigo-500 font-mono"
                value={formData.rollNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
              />
            </div>

          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-sm shadow-xl shadow-indigo-600/40 gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{submitting ? "Saving Profile..." : "Complete & Start"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Skip for Now Option (for new students) */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-slate-400 hover:text-amber-300 transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>I am a new student / Skip for now →</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}
