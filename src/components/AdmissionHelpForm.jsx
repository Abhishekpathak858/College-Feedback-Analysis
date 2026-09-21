import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import { useAuth } from "@/lib/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  GraduationCap, 
  Send, 
  Download, 
  Phone, 
  User, 
  MapPin, 
  FileText, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  Trash2, 
  FileSpreadsheet,
  Upload,
  Image,
  Eye,
  X
} from "lucide-react"
import { validateMediaFile, checkRateLimit, sanitizeInput, validateContactDetails } from "@/lib/utils"

export default function AdmissionHelpForm() {
  const { user } = useAuth()
  const { toast } = useToast()

  const isAdmin = user?.role === "admin" || user?.isSuperAdmin || user?.email?.toLowerCase().includes("abhishekpathakrp_ds24@its.edu.in")

  // Form State
  const [formData, setFormData] = useState({
    studentName: user?.fullName || "",
    studentPhone: "",
    studentEmail: user?.email || "",
    address: "",
    fatherName: "",
    parentsPhone: "",
    preferredCourse: "",
    otherDetails: "",
    // Photos of marksheets
    tenthMarksheetPhoto: "",
    twelfthMarksheetPhoto: "",
    jeeScorecardPhoto: ""
  })

  const [previewModalUrl, setPreviewModalUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)

  // In-browser image compressor with security validation
  const handlePhotoUpload = (e, fieldKey) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateMediaFile(file, ["image/jpeg", "image/png", "image/webp"])
    if (!validation.valid) {
      toast({
        title: "File Rejected",
        description: validation.error,
        variant: "destructive"
      })
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const MAX_DIM = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75)
        setFormData(prev => ({ ...prev, [fieldKey]: compressedDataUrl }))
        toast({
          title: "Marksheet Photo Uploaded! 📄",
          description: "Image compressed & attached successfully.",
          variant: "success"
        })
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Load applications for Admin
  const loadApplications = async () => {
    if (!isAdmin) return
    try {
      setLoadingApps(true)
      const list = await base44Client.entities.AdmissionApplication.list()
      setApplications(list)
    } catch (err) {
      console.error("Error loading admission applications:", err)
    } finally {
      setLoadingApps(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadApplications()
    }
  }, [isAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.studentName || !formData.studentPhone || !formData.fatherName || !formData.parentsPhone) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in student name, student phone, father's name and parent phone.",
        variant: "destructive"
      })
      return
    }

    if (!formData.tenthMarksheetPhoto && !formData.twelfthMarksheetPhoto) {
      toast({
        title: "Marksheet Photo Required",
        description: "Please upload at least your 10th or 12th class marksheet photo for verification.",
        variant: "destructive"
      })
      return
    }

    // Security Check 1: Phone numbers validation
    const studentPhoneCheck = validateContactDetails(formData.studentPhone, formData.studentEmail)
    if (!studentPhoneCheck.valid) {
      toast({
        title: "Invalid Contact",
        description: `Student: ${studentPhoneCheck.error}`,
        variant: "destructive"
      })
      return
    }

    const parentPhoneCheck = validateContactDetails(formData.parentsPhone)
    if (!parentPhoneCheck.valid) {
      toast({
        title: "Invalid Contact",
        description: `Parent: ${parentPhoneCheck.error}`,
        variant: "destructive"
      })
      return
    }

    // Security Check 2: Anti-Spam Rate Limit (Max 2 admission apps per minute)
    const rateLimit = checkRateLimit("admission_app", 2, 60000)
    if (!rateLimit.allowed) {
      toast({
        title: "Rate Limit Exceeded",
        description: rateLimit.error,
        variant: "destructive"
      })
      return
    }

    try {
      setSubmitting(true)

      const sanitizedData = {
        ...formData,
        studentName: sanitizeInput(formData.studentName),
        fatherName: sanitizeInput(formData.fatherName),
        address: sanitizeInput(formData.address),
        otherDetails: sanitizeInput(formData.otherDetails || ""),
      }

      await base44Client.entities.AdmissionApplication.create(sanitizedData)
      setHasSubmitted(true)
      toast({
        title: "🎉 Application Received!",
        description: "CampusSphere admission support team will verify your marksheets and contact you shortly.",
        variant: "success"
      })
      if (isAdmin) loadApplications()
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Could not submit your application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Admin Export to CSV
  const handleExportCSV = () => {
    if (!applications.length) {
      toast({
        title: "No Data",
        description: "There are no admission applications to export.",
        variant: "destructive"
      })
      return
    }

    const headers = [
      "Application ID",
      "Student Name",
      "Phone Number",
      "Email",
      "Address",
      "Father Name",
      "Parents Contact",
      "Preferred Course",
      "Has 10th Marksheet",
      "Has 12th Marksheet",
      "Has JEE Scorecard",
      "Date Applied"
    ]

    const rows = applications.map(app => [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", AKTU_Admission_Leads_.csv)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "📁 Export Downloaded",
      description: "Admission data CSV file has been exported successfully.",
      variant: "success"
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admission application?")) return
    try {
      await base44Client.entities.AdmissionApplication.delete(id)
      setApplications(prev => prev.filter(a => a.id !== id))
      toast({
        title: "Application Deleted",
        description: "Record removed successfully.",
        variant: "success"
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl campushub-card border border-blue-500/30 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> Admission Assistance & Guidance
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Direct Admission Guidance by CampusSphere Team
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              If you want to take admission guidance from our <strong className="text-cyan-300 font-bold">CampusSphere Support Team</strong>, upload your result marksheet photos & details below. Our counsellors will directly review and contact you!
            </p>
          </div>

          {isAdmin && (
            <div className="shrink-0 bg-slate-900/80 p-3.5 rounded-2xl border border-blue-500/30 text-right space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-300 block">👑 Admin Only Control</span>
              <Button 
                onClick={handleExportCSV}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs gap-1.5 rounded-xl shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Student Data (CSV)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ADMIN VIEW: ALL RECEIVED APPLICATIONS WITH MARKSHEET PREVIEWS */}
      {isAdmin && (
        <div className="p-6 rounded-3xl campushub-card border border-blue-500/30 shadow-2xl space-y-4 text-white">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="font-black text-white text-base">Admission Leads & Marksheets Received</h4>
                <p className="text-xs text-slate-400">Visible only to Super Admin (abhishekpathakrp_ds24@its.edu.in)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full border border-blue-500/30">
                Total: {applications.length} Candidates
              </span>
              <Button 
                onClick={handleExportCSV}
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs font-bold border-blue-500/30 text-blue-300 hover:bg-blue-600/20 rounded-xl"
              >
                <Download className="w-4 h-4" /> Export CSV
              </Button>
            </div>
          </div>

          {loadingApps ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400">
              Loading admission applicants...
            </div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/60 border border-blue-500/20 rounded-2xl">
              No admission applications received yet. Students will appear here immediately upon submission.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-blue-500/20 bg-slate-900/80 text-blue-300 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-3 rounded-l-xl">Student Name</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Parents Info</th>
                    <th className="p-3">Marksheets</th>
                    <th className="p-3">Course</th>
                    <th className="p-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-600/10 transition-colors">
                      <td className="p-3 font-bold text-white">{app.studentName}</td>
                      <td className="p-3 text-slate-300">{app.studentPhone}<br/>{app.studentEmail}</td>
                      <td className="p-3 text-slate-300">{app.fatherName}<br/>{app.parentsPhone}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {app.tenthMarksheetPhoto && (
                            <button onClick={() => setPreviewModalUrl(app.tenthMarksheetPhoto)} className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">10th</button>
                          )}
                          {app.twelfthMarksheetPhoto && (
                            <button onClick={() => setPreviewModalUrl(app.twelfthMarksheetPhoto)} className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">12th</button>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">{app.preferredCourse}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDelete(app.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* STUDENT APPLICATION FORM */}
      <div className="p-6 sm:p-8 rounded-3xl campushub-card border border-blue-500/25 shadow-2xl space-y-6 text-white">
        <div className="border-b border-blue-500/20 pb-4">
          <h4 className="text-xl font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Apply For Admission Counselling
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">Please provide genuine parent contact details and upload clear photos of your result marksheets.</p>
        </div>

        {hasSubmitted ? (
          <div className="p-10 text-center bg-blue-950/60 rounded-3xl border border-emerald-500/40 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-black text-white">Application & Marksheets Submitted Successfully!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Thank you for submitting your result marksheets. The <strong className="text-cyan-300">CampusSphere Admission Guidance Cell</strong> will verify your documents and contact you on <strong className="text-white">{formData.studentPhone}</strong>.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setHasSubmitted(false)}
              className="text-xs font-bold rounded-xl border-blue-500/30 text-blue-300 hover:bg-blue-600/20 mt-2"
            >
              Submit Another Application
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Student Personal Details */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-400" /> 1. Candidate Personal Details
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Full Name of Student <span className="text-rose-400">*</span></Label>
                  <Input 
                    placeholder="e.g. Rahul Sharma"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    required
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Student Contact Number <span className="text-rose-400">*</span></Label>
                  <Input 
                    placeholder="e.g. +91 9876543210"
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentPhone: e.target.value }))}
                    required
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Student Email Address</Label>
                  <Input 
                    placeholder="e.g. student@gmail.com"
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Permanent Address & City <span className="text-rose-400">*</span></Label>
                  <Input 
                    placeholder="e.g. Sector 62, Noida, Uttar Pradesh"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Parents Details */}
            <div className="space-y-4 pt-2 border-t border-blue-500/20">
              <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-400" /> 2. Parents / Guardian Information
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Father's / Guardian's Full Name <span className="text-rose-400">*</span></Label>
                  <Input 
                    placeholder="e.g. Shri Rajesh Sharma"
                    value={formData.fatherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                    required
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-300">Parents Contact Number <span className="text-rose-400">*</span></Label>
                  <Input 
                    placeholder="e.g. +91 9412345678"
                    type="tel"
                    value={formData.parentsPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentsPhone: e.target.value }))}
                    required
                    className="bg-slate-900/80 border-blue-500/30 text-white text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Result Marksheet Photo Uploads */}
            <div className="space-y-4 pt-2 border-t border-blue-500/20">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-400" /> 3. Upload Result Marksheet Photos <span className="text-rose-400">*</span>
                </h5>
                <span className="text-[10px] text-slate-400 font-bold">Formats: JPG, PNG, JPEG</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 10th Marksheet Photo */}
                <div className="space-y-2 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/25">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black text-white">
                      10th Class Marksheet <span className="text-rose-400">*</span>
                    </Label>
                    {formData.tenthMarksheetPhoto && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Attached
                      </span>
                    )}
                  </div>

                  {formData.tenthMarksheetPhoto ? (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-blue-500/30 group">
                      <img src={formData.tenthMarksheetPhoto} alt="10th Marksheet" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tenthMarksheetPhoto: "" }))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 cursor-pointer"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-blue-500/30 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-900/60 transition-colors p-2 text-center space-y-1">
                      <Upload className="w-6 h-6 text-blue-400" />
                      <span className="text-[11px] font-bold text-slate-200">Upload 10th Photo</span>
                      <span className="text-[9px] text-slate-400">Click to choose image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, "tenthMarksheetPhoto")} 
                      />
                    </label>
                  )}
                </div>

                {/* 12th Marksheet Photo */}
                <div className="space-y-2 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/25">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black text-white">
                      12th Class Marksheet <span className="text-rose-400">*</span>
                    </Label>
                    {formData.twelfthMarksheetPhoto && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Attached
                      </span>
                    )}
                  </div>

                  {formData.twelfthMarksheetPhoto ? (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-blue-500/30 group">
                      <img src={formData.twelfthMarksheetPhoto} alt="12th Marksheet" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, twelfthMarksheetPhoto: "" }))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 cursor-pointer"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-blue-500/30 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-900/60 transition-colors p-2 text-center space-y-1">
                      <Upload className="w-6 h-6 text-blue-400" />
                      <span className="text-[11px] font-bold text-slate-200">Upload 12th Photo</span>
                      <span className="text-[9px] text-slate-400">Click to choose image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, "twelfthMarksheetPhoto")} 
                      />
                    </label>
                  )}
                </div>

                {/* JEE Scorecard Photo */}
                <div className="space-y-2 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/25">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black text-white">
                      JEE Main Scorecard <span className="text-slate-400 font-normal">(Optional)</span>
                    </Label>
                    {formData.jeeScorecardPhoto && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Attached
                      </span>
                    )}
                  </div>

                  {formData.jeeScorecardPhoto ? (
                    <div className="relative h-28 rounded-xl overflow-hidden border border-blue-500/30 group">
                      <img src={formData.jeeScorecardPhoto} alt="JEE Scorecard" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, jeeScorecardPhoto: "" }))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 cursor-pointer"
                        title="Remove Photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-blue-500/30 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-900/60 transition-colors p-2 text-center space-y-1">
                      <Upload className="w-6 h-6 text-cyan-400" />
                      <span className="text-[11px] font-bold text-slate-200">Upload JEE Scorecard</span>
                      <span className="text-[9px] text-slate-400">Click to choose image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, "jeeScorecardPhoto")} 
                      />
                    </label>
                  )}
                </div>

              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-300">Preferred College / Branch / Extra Remarks</Label>
                <Textarea 
                  rows={2}
                  placeholder="e.g. Interested in CSE/Data Science branch or hostel query..."
                  value={formData.otherDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherDetails: e.target.value }))}
                  className="bg-slate-900/80 border-blue-500/30 text-white text-xs"
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-6 rounded-2xl shadow-lg shadow-blue-600/30 gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Submitting Application Details..." : "Submit Admission Details & Marksheets to CampusHub Team"}
            </Button>
          </form>
        )}
      </div>

      {/* PHOTO PREVIEW MODAL */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full p-4 space-y-3 relative">
            <div className="flex items-center justify-between border-b pb-2">
              <h5 className="font-bold text-sm text-slate-900">Result Marksheet Photo Preview</h5>
              <button 
                onClick={() => setPreviewModalUrl(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2">
              <img src={previewModalUrl} alt="Marksheet Preview" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
