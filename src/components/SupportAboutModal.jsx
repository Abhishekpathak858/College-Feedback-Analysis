import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { HelpCircle, Info, PhoneCall, Phone, ExternalLink, GraduationCap, ShieldCheck, Mail } from "lucide-react"
import CampusHubLogo from "@/components/CampusHubLogo"

// Clean SVG icons for Facebook, Instagram & WhatsApp
function FacebookIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function WhatsAppIcon(props) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  )
}

export default function SupportAboutModal({ isOpen, onClose, mode }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] max-w-lg rounded-3xl p-6 campushub-card border border-blue-500/30 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black text-white">
            {mode === "contact" && (
              <>
                <Phone className="w-6 h-6 text-emerald-400" /> Contact CampusSphere Support
              </>
            )}
            {mode === "about" && (
              <>
                <Info className="w-6 h-6 text-blue-400" /> About CampusSphere
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-300">
            {mode === "contact" && "Connect directly with CampusSphere Support via Helpline, WhatsApp, or Instagram."}
            {mode === "about" && "Student Voice & College Feedback Analysis Platform."}
          </DialogDescription>
        </DialogHeader>

        {/* MODE 1: CONTACT US (Helpline, WhatsApp, and Instagram) */}
        {mode === "contact" && (
          <div className="space-y-3 py-2 text-sm">
            
            {/* 1. Official Support Channel */}
            <a
              href="mailto:campushub.aktu@gmail.com"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-emerald-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-400">Official Support Email</p>
                  <p className="font-black text-white text-base">campushub.aktu@gmail.com</p>
                  <p className="text-[10px] text-slate-300 font-semibold">24x7 Student Support & Inquiries</p>
                </div>
              </div>
              <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs group-hover:scale-105 transition-transform">
                Email Us
              </span>
            </a>

            {/* 2. Instagram Link */}
            <a
              href="https://www.instagram.com/campussphere_official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-pink-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-pink-400">Instagram Handle</p>
                  <p className="font-black text-white text-base">@campussphere_official</p>
                  <p className="text-[10px] text-slate-300 font-semibold">instagram.com/campussphere_official</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-pink-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* 3. Official Helpline & Contact */}
            <a
              href="tel:+919625212204"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-blue-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-blue-400">Official Contact & Helpline</p>
                  <p className="font-black text-white text-base">+91 9625212204</p>
                  <p className="text-[10px] text-slate-300 font-semibold">CampusSphere Support & Helpdesk</p>
                </div>
              </div>
              <Phone className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* 4. WhatsApp Grievance */}
            <a
              href="https://wa.me/919625212204"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/50 hover:bg-blue-900/50 border border-emerald-500/30 transition-all group shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-emerald-400">WhatsApp Helpdesk</p>
                  <p className="font-black text-white text-base">+91 9625212204</p>
                  <p className="text-[10px] text-slate-300 font-semibold">Direct WhatsApp student support</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>

          </div>
        )}

        {/* MODE 2: ABOUT US */}
        {mode === "about" && (
          <div className="space-y-4 py-2 text-sm max-h-[75vh] overflow-y-auto pr-1">
            
            {/* Header Card */}
            <div className="p-4 rounded-2xl bg-[#0D2145] border border-white/[0.08] text-white space-y-1.5 shadow-md">
              <CampusHubLogo size="md" />
              <p className="text-xs font-semibold text-[#60A5FA] pl-12">
                Your Campus. Your Community. Your Hub.
              </p>
            </div>

            {/* Description Body */}
            <div className="space-y-2.5 text-xs text-slate-200 leading-relaxed font-medium bg-blue-950/40 p-4 rounded-2xl border border-blue-500/25">
              <p>
                <strong className="text-white">CampusSphere</strong> is a student-focused platform built to make the college experience simpler, smarter, and more connected.
              </p>
              <p>
                From <strong className="text-white">college reviews and student experiences</strong> to academic resources, campus information, guidance, and useful updates, CampusSphere brings the information students actually need together in one place.
              </p>
              <p>
                We believe that choosing a college, understanding campus life, finding the right resources, or making an informed academic decision shouldn’t be complicated. That’s why CampusSphere is designed around <strong className="text-white">real student needs, real experiences, and practical information</strong>.
              </p>
            </div>

            {/* Why CampusSphere */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400">Why CampusSphere?</h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🎓</span>
                  <div>
                    <strong className="text-white block font-bold">Student First</strong>
                    <span className="text-slate-300 text-[11px]">Everything is designed with students in mind.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">⭐</span>
                  <div>
                    <strong className="text-white block font-bold">Real College Insights</strong>
                    <span className="text-slate-300 text-[11px]">Explore experiences and reviews to understand colleges beyond the brochures.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">📚</span>
                  <div>
                    <strong className="text-white block font-bold">Useful Resources</strong>
                    <span className="text-slate-300 text-[11px]">Find academic and campus-related information in one convenient place.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🤝</span>
                  <div>
                    <strong className="text-white block font-bold">Community Driven</strong>
                    <span className="text-slate-300 text-[11px]">Learn from the experiences and knowledge of fellow students.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/25 flex items-start gap-2 shadow-xs">
                  <span className="text-base">🚀</span>
                  <div>
                    <strong className="text-white block font-bold">Built for the Future</strong>
                    <span className="text-slate-300 text-[11px]">A modern platform created to make the student journey easier and more informed.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-xs space-y-1">
              <h4 className="font-black text-cyan-300 uppercase text-[11px] tracking-wide">Our Vision</h4>
              <p className="text-slate-200 leading-relaxed text-[11px]">
                Our vision is to build a trusted digital community where <strong className="text-white">every AKTU student can discover, learn, compare, and make better decisions</strong> about their academic journey.
              </p>
              <p className="font-bold text-blue-300 text-[11px] pt-1">
                CampusSphere — Making the AKTU student journey easier, one campus at a time.
              </p>
            </div>

            {/* Leadership / Founder & CEO Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/40 text-white flex items-center justify-between shadow-lg">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  <span>Founder & Leadership</span>
                </div>
                <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 pt-1">
                  Mr. Abhishek Pathak <span className="text-xs text-amber-300 font-bold">(Founder and CEO of this App)</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Architect & Visionary of CampusSphere for AKTU affiliated institutions.
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-lg text-amber-300">
                  AP
                </div>
              </div>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
