import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import AuthLayout from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, Mail, Phone, Lock, Eye, EyeOff, User } from "lucide-react"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Full Name: Compulsory
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name to create an account.",
        variant: "destructive",
      })
      return
    }

    const cleanDigits = formData.mobileNumber.replace(/\D/g, "")
    if (!cleanDigits || cleanDigits.length < 10) {
      toast({
        title: "Valid Number Required",
        description: "Please enter your 10-digit mobile number.",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address (Personal Gmail/Yahoo or College Email).",
        variant: "destructive",
      })
      return
    }

    if (!formData.password.trim() || formData.password.length < 4) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 4 characters.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure Password and Confirm Password are the same.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      
      const emailLower = formData.email.trim().toLowerCase()
      const isAdminRegistration = cleanDigits === "9625212204" || emailLower === "abhishekpathakrp_ds24@its.edu.in"

      await register({
        fullName: isAdminRegistration ? "Abhishek Pathak" : formData.fullName.trim(),
        phone: cleanDigits,
        email: formData.email.trim(),
        password: formData.password,
        collegeName: "",
        department: "",
        role: isAdminRegistration ? "admin" : "student",
        isSuperAdmin: isAdminRegistration,
        isProfileCompleted: isAdminRegistration
      })

      toast({
        title: isAdminRegistration ? "👑 Super Admin Account Created!" : "🎉 Sign Up Successful!",
        description: isAdminRegistration ? "Welcome Abhishek Pathak! All admin privileges granted." : "Let's complete your college details next.",
        variant: "success",
      })

      if (isAdminRegistration) {
        navigate("/feed")
      } else {
        navigate("/know-more")
      }
    } catch (err) {
      console.error("Signup error:", err)
      toast({
        title: "Sign Up Failed",
        description: err.message || "Could not create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="New Student Sign Up"
      subtitle="Enter your number, email, and password. Complete college info in the next step."
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in" autoComplete="off">
        <input type="text" style={{ display: "none" }} />
        <input type="password" style={{ display: "none" }} />

        {/* Student Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="signup_name" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-400" /> Student Full Name <span className="text-rose-400">*</span>
          </Label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              id="signup_name"
              name="campushub_signup_name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              className="pl-9 bg-slate-900/80 border-blue-500/30 text-white placeholder:text-slate-500 text-sm font-medium rounded-xl focus-visible:border-blue-400"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <Label htmlFor="signup_mobile" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-blue-400" /> Mobile Number <span className="text-rose-400">*</span>
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400">
              +91
            </div>
            <Input
              id="signup_mobile"
              name="campushub_signup_mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              maxLength={10}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              data-lpignore="true"
              className="pl-12 bg-slate-900/80 border-blue-500/30 text-white placeholder:text-slate-500 text-sm font-bold tracking-widest rounded-xl focus-visible:border-blue-400"
              value={formData.mobileNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, "") }))}
              required
            />
          </div>
        </div>

        {/* Email ID - Personal or College Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signup_email" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-400" /> Email ID (Personal or College) <span className="text-rose-400">*</span>
          </Label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              id="signup_email"
              name="campushub_signup_email"
              type="email"
              placeholder="e.g. student@gmail.com or student@college.edu.in"
              autoComplete="email"
              className="pl-9 bg-slate-900/80 border-blue-500/30 text-white placeholder:text-slate-500 text-sm font-medium rounded-xl focus-visible:border-blue-400"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <p className="text-[11px] text-slate-400">Personal email (Gmail, Yahoo, etc.) ya College official email ID - koi sa bhi daal sakte hain.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup_pwd" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-400" /> Password
          </Label>
          <div className="relative">
            <Input
              id="signup_pwd"
              name="campushub_signup_pwd"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password (min 4 chars)"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              data-lpignore="true"
              className="pl-4 pr-10 bg-slate-900/80 border-blue-500/30 text-white placeholder:text-slate-500 text-sm font-bold rounded-xl focus-visible:border-blue-400"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup_cpwd" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-400" /> Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="signup_cpwd"
              name="campushub_signup_cpwd"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              data-lpignore="true"
              className="pl-4 pr-10 bg-slate-900/80 border-blue-500/30 text-white placeholder:text-slate-500 text-sm font-bold rounded-xl focus-visible:border-blue-400"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-5 rounded-2xl shadow-lg shadow-blue-600/30 gap-2 mt-3 cursor-pointer transition-transform active:scale-95" 
          disabled={submitting}
        >
          <UserPlus className="w-4 h-4" />
          <span>{submitting ? "Creating Account..." : "Continue to College Details →"}</span>
        </Button>
      </form>

      <div className="text-center text-xs text-slate-300 pt-4 border-t border-blue-500/20 space-y-1.5">
        <p className="text-slate-400">Already registered?</p>
        <Link to="/login" className="inline-block font-bold text-blue-400 hover:text-blue-300 hover:underline">
          ← Sign In with Mobile & Password
        </Link>
      </div>
    </AuthLayout>
  )
}
