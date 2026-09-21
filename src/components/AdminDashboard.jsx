import React, { useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import { ShieldAlert, CheckCircle2, MapPin, XCircle, Download, FileText, Printer, Users, Trash2, Mail, GraduationCap, Building2, Eye, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"

export default function AdminDashboard({ feedbacks, onUpdate }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("complaints") // "complaints" | "users" | "all_feedbacks"
  const [loadingId, setLoadingId] = useState(null)
  const [selectedPDFReport, setSelectedPDFReport] = useState(null)
  const [usersList, setUsersList] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const loadUsers = async () => {
    try {
      setLoadingUsers(true)
      const data = await base44Client.entities.User.list()
      setUsersList(data)
    } catch (e) {
      console.error("Error loading users:", e)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user account: ${userEmail}?`)) return
    try {
      await base44Client.entities.User.delete(userId)
      setUsersList(prev => prev.filter(u => u.id !== userId))
      toast({
        title: "User Account Deleted",
        description: `Account ${userEmail} has been deleted successfully.`,
        variant: "success",
      })
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Could not delete user account.",
        variant: "destructive"
      })
    }
  }

  // Filter complaints
  const feedList = Array.isArray(feedbacks) ? feedbacks : []
  const pendingFeedbacks = feedList.filter(f => f && (f.status === "Action Required" || !f.status || f.status === "Pending"))

  const handleResolve = async (id) => {
    try {
      setLoadingId(id)
      await base44Client.entities.Feedback.updateStatus(id, "Resolved")
      toast({
        title: "Complaint Resolved",
        description: "The feedback status has been updated successfully.",
        variant: "success",
      })
      if (onUpdate) onUpdate()
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to resolve complaint.",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handlePrintPDF = (post) => {
    const isAnon = Boolean(post.isAnonymous)
    const realName = post.realAuthorName || post.studentName || "Confidential Student"
    const realEmail = post.realAuthorEmail || post.studentEmail || "Confidential Email"
    const publicName = isAnon ? "Anonymous Student" : (post.authorName || post.studentName || "@student")

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CampusSphere Grievance Report - ${post.id}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.5; }
              .header { border-bottom: 3px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
              .brand { display: flex; align-items: center; gap: 12px; }
              .brand-title { font-size: 24px; font-weight: 900; color: #0f172a; tracking: -0.5px; }
              .brand-sub { font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; }
              .meta-right { text-align: right; font-size: 12px; color: #64748b; font-family: monospace; }
              .confidential-box { background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; }
              .confidential-title { font-size: 13px; font-weight: 800; color: #be123c; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
              .confidential-text { font-size: 12px; color: #9f1239; margin-bottom: 8px; }
              .audit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; background: white; padding: 10px 14px; border-radius: 8px; border: 1px solid #f43f5e20; }
              .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
              .meta-table td { padding: 10px 14px; border: 1px solid #e2e8f0; font-size: 13px; }
              .label { font-weight: 700; color: #475569; width: 32%; background: #f8fafc; }
              .val { color: #0f172a; font-weight: 600; }
              .criteria-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
              .criteria-table th { background: #0f172a; color: white; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
              .criteria-table td { padding: 8px 12px; border: 1px solid #e2e8f0; }
              .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 12px; font-size: 13px; margin-bottom: 24px; }
              .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; margin-top: 36px; }
              @media print {
                body { padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="brand">
                <div>
                  <div class="brand-title">CampusSphere</div>
                  <div class="brand-sub">Institutional Grievance & Student Review Document</div>
                </div>
              </div>
              <div class="meta-right">
                <strong>Ref ID:</strong> ${post.refNumber || `DOC-${post.id}`}<br/>
                <strong>Audit Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            ${isAnon ? `
            <div class="confidential-box">
              <div class="confidential-title">
                🛡️ CONFIDENTIAL ADMIN AUDIT (IDENTITY SHIELDED FROM PUBLIC)
              </div>
              <div class="confidential-text">
                Notice: This feedback was submitted under <strong>Anonymous Mode</strong>. Public display masks author as <em>"Anonymous Student"</em>. Real student identity is permanently archived below solely for admin audit and grievance resolution.
              </div>
              <div class="audit-grid">
                <div><strong>Real Student Name:</strong> ${realName}</div>
                <div><strong>Verified College Email:</strong> ${realEmail}</div>
                <div><strong>Submission Mode:</strong> Anonymous (100% Protected)</div>
                <div><strong>Institution:</strong> ${post.collegeName?.trim() ? post.collegeName.trim() : "N/A"}</div>
              </div>
            </div>
            ` : ''}

            <table class="meta-table">
              <tr>
                <td class="label">Public Display Name:</td>
                <td class="val">${publicName} ${isAnon ? '<span style="font-size: 11px; color: #6b7280;">(Anonymous Shield Active)</span>' : '✅ Verified Student'}</td>
              </tr>
              ${!isAnon ? `
              <tr>
                <td class="label">Student Email:</td>
                <td class="val">${post.studentEmail || realEmail}</td>
              </tr>
              ` : ''}
              <tr>
                <td class="label">College / Institution:</td>
                <td class="val"><strong>${post.collegeName?.trim() ? post.collegeName.trim() : "N/A"}</strong></td>
              </tr>
              <tr>
                <td class="label">Academic Department:</td>
                <td class="val">${post.department?.trim() ? post.department.trim() : "N/A"}</td>
              </tr>
              <tr>
                <td class="label">Feedback Category:</td>
                <td class="val">${post.category || "General Feedback"}</td>
              </tr>
              <tr>
                <td class="label">Overall Review Rating:</td>
                <td class="val" style="color: #d97706; font-weight: 800;">⭐ ${post.rating || 4} / 5 Stars</td>
              </tr>
              <tr>
                <td class="label">Administrative Status:</td>
                <td class="val"><strong>${post.status || "Active"}</strong></td>
              </tr>
            </table>

            ${post.criteriaRatings ? `
            <div style="margin-bottom: 16px;">
              <strong style="display: block; margin-bottom: 8px; font-size: 12px; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
                Campus Health Criteria Breakdown (1 - 5 Scale):
              </strong>
              <table class="criteria-table">
                <thead>
                  <tr>
                    <th>Evaluation Criteria</th>
                    <th>Score / 5</th>
                    <th>Evaluation Criteria</th>
                    <th>Score / 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Student Satisfaction</td>
                    <td>⭐ ${post.criteriaRatings.studentSatisfaction || 4}/5</td>
                    <td>Faculty Quality</td>
                    <td>⭐ ${post.criteriaRatings.facultyQuality || 4}/5</td>
                  </tr>
                  <tr>
                    <td>Campus Infrastructure</td>
                    <td>⭐ ${post.criteriaRatings.campusInfrastructure || 4}/5</td>
                    <td>Hostel Facilities</td>
                    <td>⭐ ${post.criteriaRatings.hostelFacilities || 4}/5</td>
                  </tr>
                  <tr>
                    <td>Mess & Food Quality</td>
                    <td>⭐ ${post.criteriaRatings.messFoodQuality || 4}/5</td>
                    <td>Administration Response</td>
                    <td>⭐ ${post.criteriaRatings.adminResponse || 4}/5</td>
                  </tr>
                  <tr>
                    <td>Complaint Resolution</td>
                    <td>⭐ ${post.criteriaRatings.complaintResolution || 4}/5</td>
                    <td>Placement Experience</td>
                    <td>⭐ ${post.criteriaRatings.placementExperience || 4}/5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="box">
              <strong style="display: block; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; color: #64748b;">Review Headline / Subject:</strong>
              <div style="font-weight: 800; font-size: 16px; margin-bottom: 12px; color: #0f172a;">${post.title || "Feedback Submission"}</div>
              <strong style="display: block; margin-bottom: 6px; font-size: 11px; text-transform: uppercase; color: #64748b;">Detailed Student Statement:</strong>
              <div style="line-height: 1.7; color: #334155; white-space: pre-wrap;">${post.comment || "No additional comments provided."}</div>
            </div>

            <div class="footer">
              This document is confidential and generated for Institutional Quality Assurance.<br/>
              CampusSphere • Verified Student Feedback & Grievance Report
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <div className="space-y-6">
      {/* Super Admin Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase bg-rose-500 text-white shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Access
              </span>
              <span className="text-xs text-indigo-200 font-bold">abhishekpathakrp_ds24@its.edu.in</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight">Central College Administration</h3>
            <p className="text-xs text-slate-300">Complete access to student user database, grievance resolutions, analytics, and college data.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 text-center">
              <div className="text-xl font-black text-white">{usersList.length}</div>
              <div className="text-[10px] uppercase font-bold text-indigo-200">Registered Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 text-center">
              <div className="text-xl font-black text-amber-300">{feedList.length}</div>
              <div className="text-[10px] uppercase font-bold text-indigo-200">Total Feedbacks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === "complaints"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Pending Complaints ({pendingFeedbacks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("all_feedbacks")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === "all_feedbacks"
              ? "bg-white text-blue-600 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>All Reviews & Audits ({feedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Student Directory ({usersList.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING COMPLAINTS */}
      {activeTab === "complaints" && (
        <div className="p-6 rounded-3xl border border-indigo-200 bg-white shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg">Grievance Resolution & PDF Reports</h4>
                <p className="text-xs text-slate-500 font-medium">Review and resolve issues or export student grievance PDF reports.</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-black text-xs border border-rose-200">
              {pendingFeedbacks.length} Action Required
            </span>
          </div>
          
          <div className="space-y-4">
            {pendingFeedbacks.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-slate-900">All Student Complaints Resolved!</h5>
                <p className="text-xs text-slate-500">There are no pending action-required grievances right now.</p>
              </div>
            ) : (
              pendingFeedbacks.map(post => {
                const isAnon = Boolean(post.isAnonymous)
                const realAuthor = post.realAuthorName || post.studentName || "Confidential Student"
                const realEmail = post.realAuthorEmail || post.studentEmail || "Email on record"

                return (
                  <div key={post.id} className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm transition-all space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                            {post.category || "General"}
                          </span>
                          <span className="text-xs font-black text-amber-600">
                            ⭐ {post.rating || 5}/5
                          </span>

                          {isAnon ? (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                              Anonymous Publicly • <strong>Real: {realAuthor} ({realEmail})</strong>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-600">
                              Author: {post.authorName || post.studentName} ({post.studentEmail || realEmail})
                            </span>
                          )}
                        </div>

                        <h5 className="font-black text-base text-slate-900">{post.title}</h5>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-2">{post.comment}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-400 pt-1">
                          <span>College: <strong className="text-slate-700">{post.collegeName?.trim() ? post.collegeName.trim() : "N/A"}</strong></span>
                          <span>•</span>
                          <span>Dept: <strong className="text-slate-700">{post.department?.trim() ? post.department.trim() : "N/A"}</strong></span>
                        </div>
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Download PDF (ADMIN ONLY) */}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1.5 text-xs font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl transition-all cursor-pointer"
                          onClick={() => handlePrintPDF(post)}
                        >
                          <Download className="w-4 h-4" /> Export PDF
                        </Button>

                        {/* Mark Resolved */}
                        <Button 
                          size="sm" 
                          className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                          onClick={() => handleResolve(post.id)}
                          disabled={loadingId === post.id}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {loadingId === post.id ? "Updating..." : "Mark Resolved"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALL REVIEWS & AUDIT VAULT */}
      {activeTab === "all_feedbacks" && (
        <div className="p-6 rounded-3xl border border-blue-200 bg-white shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg">All Student Reviews & Audit Vault</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Review all student submissions, view confidential identities of anonymous reviews, and export verified PDF reports.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-xs border border-blue-200">
              {feedList.length} Total Submissions
            </span>
          </div>

          <div className="space-y-4">
            {feedList.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-bold">
                No reviews found in the database.
              </div>
            ) : (
              feedList.map((post) => {
                const isAnon = Boolean(post.isAnonymous)
                const realAuthor = post.realAuthorName || post.studentName || "Confidential Student"
                const realEmail = post.realAuthorEmail || post.studentEmail || "Email on record"

                return (
                  <div key={post.id} className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                            {post.category || "General Feedback"}
                          </span>
                          <span className="text-xs font-black text-amber-600">
                            ⭐ {post.rating || 4}/5 Stars
                          </span>

                          {isAnon ? (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                              Anonymous Publicly • <strong>Real Author: {realAuthor} ({realEmail})</strong>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                              Student: {post.authorName || post.studentName} ({post.studentEmail || realEmail})
                            </span>
                          )}
                        </div>

                        <h5 className="font-black text-base text-slate-900">{post.title || "Feedback Submission"}</h5>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{post.comment}</p>

                        {/* Criteria rating pills if present */}
                        {post.criteriaRatings && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {Object.entries(post.criteriaRatings).map(([k, v]) => (
                              <span key={k} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 font-mono">
                                {k}: <strong className="text-amber-600">{v}★</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-400 pt-1">
                          <span>College: <strong className="text-slate-700">{post.collegeName?.trim() ? post.collegeName.trim() : "N/A"}</strong></span>
                          <span>•</span>
                          <span>Dept: <strong className="text-slate-700">{post.department?.trim() ? post.department.trim() : "N/A"}</strong></span>
                          <span>•</span>
                          <span>Status: <strong className="text-slate-700">{post.status || "Active"}</strong></span>
                        </div>
                      </div>

                      {/* Export PDF Button */}
                      <div className="shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1.5 text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
                          onClick={() => handlePrintPDF(post)}
                        >
                          <Printer className="w-4 h-4" /> Print / Save PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS & STUDENT DIRECTORY */}
      {activeTab === "users" && (
        <div className="p-6 rounded-3xl border border-indigo-200 bg-white shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg">Registered Students & Users Directory</h4>
                <p className="text-xs text-slate-500 font-medium">All student accounts registered in the database with their roll numbers, emails, and branches.</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={loadUsers}
              className="text-xs font-bold rounded-xl border-slate-200"
            >
              Refresh Directory
            </Button>
          </div>

          {loadingUsers ? (
            <div className="p-12 text-center text-slate-400 font-bold text-xs">
              Loading student accounts from Firestore...
            </div>
          ) : usersList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
              <Users className="w-10 h-10 text-slate-400 mx-auto" />
              <h5 className="font-bold text-slate-900">No Registered Users Found in Firestore</h5>
              <p className="text-xs text-slate-500">Newly registered students will automatically appear here with their full credentials.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-3 rounded-l-xl">Student Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">College & Department</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email || u.id}`}
                            alt="Avatar"
                            className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200"
                          />
                          <span>{u.fullName || "Student"}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase border ${
                          u.role === "admin" || u.isSuperAdmin
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {u.role === "admin" || u.isSuperAdmin ? "Super Admin" : "Student"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <div className="font-bold text-slate-800">{u.collegeName?.trim() ? u.collegeName.trim() : "N/A"}</div>
                        <div className="text-[10px] text-slate-400">{u.department?.trim() ? u.department.trim() : "N/A"}</div>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{u.rollNumber || "N/A"}</td>
                      <td className="p-3 text-right">
                        {u.email !== "abhishekpathakrp_ds24@its.edu.in" && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
