import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { apiClient, analyzeSentiment } from "@/api/apiClient"
import { FEEDBACK_CATEGORIES, FACULTY_FEEDBACK_CATEGORIES, DEPARTMENTS, YEARS_OF_STUDY, AKTU_COLLEGES, COURSES, UP_DISTRICTS } from "@/lib/categories"
import CollegeAutocomplete from "@/components/CollegeAutocomplete"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Send, 
  ShieldCheck, 
  UserX, 
  User,
  Smile,
  GraduationCap,
  Building2,
  Home,
  UtensilsCrossed,
  Users,
  Briefcase,
  Award
} from "lucide-react"
import { checkRateLimit, sanitizeInput } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export const HEALTH_EVALUATION_CRITERIA = [
  { id: "studentSatisfaction", label: "Student Satisfaction", icon: Smile, color: "text-cyan-400", desc: "Overall campus happiness & student experience" },
  { id: "facultyQuality", label: "Faculty Quality", icon: GraduationCap, color: "text-emerald-400", desc: "Teaching standard, guidance & mentorship" },
  { id: "campusInfrastructure", label: "Campus Infrastructure", icon: Building2, color: "text-blue-400", desc: "Labs, classrooms, library & Wi-Fi" },
  { id: "hostelFacilities", label: "Hostel Facilities", icon: Home, color: "text-amber-400", desc: "Room comfort, security & maintenance" },
  { id: "messFoodQuality", label: "Mess & Food Quality", icon: UtensilsCrossed, color: "text-rose-400", desc: "Hygiene, taste, menu variety & nutrition" },
  { id: "adminResponse", label: "Administration Response", icon: Users, color: "text-indigo-400", desc: "Staff assistance, dues & portal service" },
  { id: "complaintResolution", label: "Complaint Resolution", icon: ShieldCheck, color: "text-teal-400", desc: "Speed & fairness of grievance solving" },
  { id: "placementExperience", label: "Placement Experience", icon: Briefcase, color: "text-violet-400", desc: "Placement drives, packages & skill training" }
]

export default function FeedbackForm({ onFeedbackSubmitted }) {
  const { user } = useAuth()
  const { toast } = useToast()

  const isFaculty = user?.role === "faculty"
  const categoriesList = isFaculty ? FACULTY_FEEDBACK_CATEGORIES : FEEDBACK_CATEGORIES

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    collegeName: "",
    location: "",
    program: "",
    department: "",
    facultyName: "",
    courseName: "",
    yearOfStudy: "",
    criteriaRatings: {
      studentSatisfaction: 0,
      facultyQuality: 0,
      campusInfrastructure: 0,
      hostelFacilities: 0,
      messFoodQuality: 0,
      adminResponse: 0,
      complaintResolution: 0,
      placementExperience: 0,
    },
    rating: 0,
    subRatings: {
      r1: 0,
      r2: 0,
      r3: 0,
      r4: 0,
    },
    comment: "",
    isAnonymous: false,
    studentName: "",
    studentEmail: "",
  })

  const [sentimentPreview, setSentimentPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const filteredColleges = React.useMemo(() => {
    if (!formData.location) return AKTU_COLLEGES;
    const keywords = formData.location
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(' ')
      .filter(w => w.length > 2);

    if (keywords.length === 0) return AKTU_COLLEGES;

    const matched = AKTU_COLLEGES.filter(college => {
      if (college === "Other / Unlisted Affiliated College") return true;
      const cLower = college.toLowerCase();
      return keywords.some(kw => cLower.includes(kw));
    });

    return matched.length > 1 ? matched : AKTU_COLLEGES;
  }, [formData.location])

  // NOTE: Keep inputs completely blank so nothing is automatically filled!
  useEffect(() => {
    // Intentionally left blank to avoid autofilling fields
  }, [])

  // Live sentiment analysis preview
  useEffect(() => {
    if (formData.comment.trim().length > 3) {
      const result = analyzeSentiment(formData.comment, formData.rating)
      setSentimentPreview(result)
    } else {
      setSentimentPreview(null)
    }
  }, [formData.comment, formData.rating])

  const handleCriteriaRatingChange = (key, value) => {
    setFormData((prev) => {
      const currentVal = prev.criteriaRatings?.[key] || 0
      const nextVal = currentVal === value ? 0 : value
      const updatedCriteria = {
        ...prev.criteriaRatings,
        [key]: nextVal
      }

      // If user hasn't set an overall rating yet, compute average of selected criteria
      const ratedValues = Object.values(updatedCriteria).filter((v) => v > 0)
      const autoRating = ratedValues.length > 0 
        ? Math.round(ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length)
        : prev.rating

      return {
        ...prev,
        criteriaRatings: updatedCriteria,
        rating: prev.rating === 0 ? autoRating : prev.rating
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 1. Full Name: Compulsory for ALL reviews (even Anonymous, for backend admin audit)
    if (!formData.studentName?.trim() || formData.studentName.trim().toLowerCase() === "anonymous") {
      toast({
        title: "Full Name is Compulsory",
        description: "Please enter your real full name. In Anonymous Mode, your identity is kept 100% confidential and only visible to the administration.",
        variant: "destructive",
      })
      return
    }

    // 2. College Email: Compulsory for ALL reviews
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.studentEmail?.trim() || !emailRegex.test(formData.studentEmail.trim())) {
      toast({
        title: "College Email is Compulsory",
        description: "Please provide a valid College Email ID for verification.",
        variant: "destructive",
      })
      return
    }

    // 3. College Name: Compulsory
    if (!formData.collegeName?.trim()) {
      toast({
        title: "College Name is Compulsory",
        description: "Please select or search the college you are reviewing.",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a short headline for your review.",
        variant: "destructive",
      })
      return
    }

    if (!formData.rating || formData.rating < 1) {
      toast({
        title: "Rating Required",
        description: "Please select an overall rating (1 to 5 stars).",
        variant: "destructive",
      })
      return
    }

    if (!formData.comment.trim() || formData.comment.trim().length < 5) {
      toast({
        title: "Comment Required",
        description: "Please provide a review comment (at least 5 characters).",
        variant: "destructive",
      })
      return
    }

    // 4. Anti-Spam Rate Limit Check (Max 3 submissions per minute)
    const rateLimitResult = checkRateLimit("submit_feedback", 3, 60000)
    if (!rateLimitResult.allowed) {
      toast({
        title: "Rate Limit Exceeded",
        description: rateLimitResult.error,
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const submissionData = {
        ...formData,
        title: sanitizeInput(formData.title),
        comment: sanitizeInput(formData.comment),
        collegeName: sanitizeInput(formData.collegeName),
        // Public identity: Masked if anonymous
        authorName: formData.isAnonymous ? "Anonymous Student" : sanitizeInput(formData.studentName),
        studentName: formData.isAnonymous ? "Anonymous Student" : sanitizeInput(formData.studentName),
        // Confidential real identity for Admin PDF & verified records
        realAuthorName: sanitizeInput(formData.studentName),
        realAuthorEmail: sanitizeInput(formData.studentEmail),
        studentEmail: formData.isAnonymous ? "" : sanitizeInput(formData.studentEmail),
        isAnonymous: Boolean(formData.isAnonymous),
        criteriaRatings: formData.criteriaRatings,
        refNumber: `AKTU-REV-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toLocaleString()
      }

      const created = await apiClient.entities.Feedback.create(submissionData)

      toast({
        title: "Review Submitted Successfully! ⭐",
        description: formData.isAnonymous 
          ? "Your anonymous review has been published." 
          : "Your review has been successfully submitted.",
        variant: "success",
      })

      // Reset form completely blank
      setFormData({
        title: "",
        category: "",
        collegeName: "",
        location: "",
        program: "",
        department: "",
        facultyName: "",
        courseName: "",
        yearOfStudy: "",
        criteriaRatings: {
          studentSatisfaction: 0,
          facultyQuality: 0,
          campusInfrastructure: 0,
          hostelFacilities: 0,
          messFoodQuality: 0,
          adminResponse: 0,
          complaintResolution: 0,
          placementExperience: 0,
        },
        rating: 0,
        subRatings: { r1: 0, r2: 0, r3: 0, r4: 0 },
        comment: "",
        isAnonymous: false,
        studentName: "",
        studentEmail: "",
      })

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(created)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Submission Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card id="feedback-form" className="bg-[#0D2145] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl scroll-mt-20 text-white">
      <CardHeader className="border-b border-white/[0.08] bg-[#0B1B3A]/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 text-[#60A5FA] border border-blue-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" />
                {isFaculty ? "Faculty Official Portal" : "Student Official Portal"}
              </span>
              <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1">
                • Verified Institutional Feedback
              </span>
            </div>
            <CardTitle className="text-2xl font-black text-white tracking-tight">
              {isFaculty ? "Submit Staff & Faculty Feedback" : "Submit College Review"}
            </CardTitle>
            <CardDescription className="text-xs text-[#A8B5CC] mt-1">
              Share your genuine feedback & college experience. You can submit with your name or choose Anonymous mode.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit} autoComplete="off">
        <input type="text" style={{ display: 'none' }} />
        <CardContent className="p-6 space-y-6">
          
          {/* Review Identity & Anonymous Option */}
          <div className="p-5 rounded-2xl bg-[#102A56] border border-white/[0.08] space-y-4">
            
            {/* Top Row: Title + Anonymous Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-[#60A5FA]">
                {formData.isAnonymous ? (
                  <UserX className="w-4 h-4 text-purple-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {formData.isAnonymous ? "Anonymous Review Mode" : "Student Review Identity"}
                </span>
              </div>

              {/* Anonymous Toggle Option */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none bg-[#0B1B3A] px-3 py-1.5 rounded-xl border border-white/10 hover:border-purple-500/40 transition-colors">
                <span className="text-xs font-bold text-slate-200">Submit as Anonymous</span>
                <div className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => {
                      const isAnon = e.target.checked
                      setFormData(prev => ({
                        ...prev,
                        isAnonymous: isAnon
                      }))
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </div>
              </label>
            </div>

            {/* Anonymous notice banner if active */}
            {formData.isAnonymous && (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 animate-in fade-in duration-200">
                <UserX className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-purple-200">Anonymous Privacy Shield Active</p>
                  <p className="text-[11px] text-purple-300/90 leading-relaxed">
                    Your real Full Name & Official College Email are compulsory below for authenticity verification and will be saved in the confidential admin PDF archive. On public pages, your identity is 100% masked and will display as <strong className="text-white font-mono">"Anonymous Student"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Full Name & College Email are ALWAYS rendered and COMPULSORY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <Label htmlFor="studentName" className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC] flex items-center justify-between">
                  <span>Full Name <span className="text-[#EF4444]">*</span></span>
                  {formData.isAnonymous && (
                    <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                      Masked Publicly
                    </span>
                  )}
                </Label>
                <Input
                  id="studentName"
                  name="campushub_feedback_studentname"
                  placeholder="Enter your real full name"
                  value={formData.studentName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, studentName: e.target.value }))}
                  className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white font-medium rounded-xl placeholder:text-[#7182A3] focus-visible:border-[#3B82F6]"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="studentEmail" className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC] flex items-center justify-between">
                  <span>Official College Email <span className="text-[#EF4444]">*</span></span>
                  {formData.isAnonymous && (
                    <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                      Masked Publicly
                    </span>
                  )}
                </Label>
                <Input
                  id="studentEmail"
                  name="campushub_feedback_studentemail"
                  type="email"
                  placeholder="e.g. yourname@college.edu.in"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, studentEmail: e.target.value }))}
                  className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white font-medium rounded-xl placeholder:text-[#7182A3] focus-visible:border-[#3B82F6]"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  data-lpignore="true"
                  required
                />
                <span className="text-[11px] text-[#60A5FA] block font-normal">
                  Compulsory for authentic verification
                </span>
              </div>
            </div>
          </div>

          {/* Category & College Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">District / Region</Label>
              <Select
                value={formData.location}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, location: val }))}
              >
                <SelectTrigger className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white rounded-xl">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent className="bg-[#102A56] border-white/[0.12] text-white max-h-60">
                  {UP_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d} className="hover:bg-[#0B1B3A]">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">
                College / Institution <span className="text-[#EF4444]">*</span>
              </Label>
              <CollegeAutocomplete
                value={formData.collegeName}
                onChange={(val) => setFormData((prev) => ({ ...prev, collegeName: val }))}
                collegesList={filteredColleges}
                className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">Feedback Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#102A56] border-white/[0.12] text-white max-h-60">
                  {categoriesList.map((cat) => (
                    <SelectItem key={cat.label} value={cat.label} className="hover:bg-[#0B1B3A]">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, department: val }))}
              >
                <SelectTrigger className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white rounded-xl">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-[#102A56] border-white/[0.12] text-white max-h-60">
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept} className="hover:bg-[#0B1B3A]">{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ================= EVALUATION CRITERIA & OVERALL REVIEW SECTION ================= */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#102A56]/90 border border-white/[0.08] shadow-lg">
            <div className="border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Health Score Factor
                </h3>
              </div>
            </div>

            {/* 8 Evaluation Criteria Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {HEALTH_EVALUATION_CRITERIA.map((criterion) => {
                const Icon = criterion.icon
                const currentScore = formData.criteriaRatings?.[criterion.id] || 0

                return (
                  <div
                    key={criterion.id}
                    className="p-3 rounded-xl bg-[#0B1B3A] border border-white/[0.08] flex flex-col justify-between gap-2 hover:border-blue-500/30 transition-all group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg bg-white/5 shrink-0 ${criterion.color} border border-white/5 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block leading-tight truncate">
                            {criterion.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                            {criterion.desc}
                          </span>
                        </div>
                      </div>

                      {currentScore > 0 && (
                        <span className="text-[11px] font-black text-amber-400 font-mono px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25 shrink-0">
                          {currentScore}/5 ★
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleCriteriaRatingChange(criterion.id, star)}
                            className="p-0.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                            title={`${criterion.label}: Rate ${star} Star`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                currentScore >= star
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
                                  : "text-slate-600 hover:text-amber-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {currentScore === 0 ? "Tap to rate" : `${currentScore} Stars`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Overall Review Rating (LAST OPTION) */}
            <div className="pt-3 border-t border-white/10 mt-2">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0B1B3A] to-[#0d2145] border-2 border-blue-500/40 shadow-md space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Label className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" /> Overall Rating (Overall Review) <span className="text-rose-400">*</span>
                    </Label>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Your comprehensive rating for this institution.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#07132B] px-3 py-1 rounded-lg border border-white/10 font-mono text-sm font-black text-white shrink-0">
                    <span>{formData.rating}/5</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer group"
                        title={`Overall: Rate ${star} Star`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            formData.rating >= star
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                              : "text-slate-600 group-hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className={`text-xs font-bold ml-1 ${
                    formData.rating >= 4 ? "text-emerald-400" : formData.rating === 3 ? "text-amber-400" : formData.rating > 0 ? "text-rose-400" : "text-slate-400"
                  }`}>
                    {formData.rating === 0 && "Select overall stars"}
                    {formData.rating === 1 && "1/5 • Poor"}
                    {formData.rating === 2 && "2/5 • Needs Improvement"}
                    {formData.rating === 3 && "3/5 • Average Experience"}
                    {formData.rating === 4 && "4/5 • Good College"}
                    {formData.rating === 5 && "5/5 • Outstanding Experience"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Headline & Comment */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">
              Feedback Title / Headline <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              placeholder="e.g. Lab 3 Equipment Maintenance / Fast WiFi in Library"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="h-11 bg-[#0B1B3A] border-white/[0.08] text-white font-bold placeholder:text-[#7182A3] rounded-xl focus-visible:border-[#3B82F6]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#A8B5CC]">
              Detailed Feedback Comment <span className="text-[#EF4444]">*</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="Describe the issue, suggestions, or feedback in detail..."
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              className="bg-[#0B1B3A] border-white/[0.08] text-white font-medium placeholder:text-[#7182A3] rounded-xl focus-visible:border-[#3B82F6]"
              required
            />
          </div>

          {/* Live AI Sentiment Detection Preview */}
          {sentimentPreview && (
            <div className="p-4 rounded-xl bg-[#102A56] border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    AI Sentiment Analysis Preview
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  sentimentPreview.sentiment === "Positive"
                    ? "bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30"
                    : sentimentPreview.sentiment === "Negative"
                    ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                    : "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                }`}>
                  {sentimentPreview.sentiment} ({sentimentPreview.score > 0 ? `+${sentimentPreview.score}` : sentimentPreview.score})
                </span>
              </div>
            </div>
          )}

        </CardContent>

        <CardFooter className="border-t border-white/[0.08] bg-[#0B1B3A]/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A8B5CC] text-center sm:text-left font-medium">
            Official feedback is securely logged for institutional quality benchmarks.
          </p>
          <Button 
            type="submit" 
            size="lg" 
            disabled={submitting} 
            className="w-full sm:w-auto gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
