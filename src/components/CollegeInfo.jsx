import React from "react"
import { useAuth } from "@/lib/AuthContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building2, Users, BookOpen, GraduationCap, Phone, Mail, MapPin, Globe, ShieldAlert, Clock, History } from "lucide-react"
import { AKTU_COLLEGES } from "@/lib/categories"

export default function CollegeInfo() {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-primary/10 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Dr. A.P.J. Abdul Kalam Technical University</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Central University Information (AKTU Main Campus, Lucknow)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Affiliated Colleges</p>
              <p className="text-lg font-bold">{AKTU_COLLEGES.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <GraduationCap className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Faculty Members</p>
              <p className="text-lg font-bold">450+</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Departments</p>
              <p className="text-lg font-bold">12</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Campus Size</p>
              <p className="text-lg font-bold">200 Acres</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Courses Offered (Main Campus)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["B.Tech", "M.Tech", "MBA", "MCA", "B.Pharm", "M.Pharm", "B.Arch", "Ph.D."].map((course) => (
              <span key={course} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                {course}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About AKTU Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              About Dr. A.P.J. Abdul Kalam Technical University
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Formerly known as Uttar Pradesh Technical University (UPTU), AKTU was established on <strong>May 8, 2000</strong> by the Government of Uttar Pradesh. 
            </p>
            <p>
              It is one of the largest technical universities in Asia, affiliating engineering, management, pharmacy, architecture, and other professional colleges across the entire state of Uttar Pradesh. The university is dedicated to advancing technical education and research.
            </p>
            <p className="pt-2 border-t mt-2 text-xs font-semibold text-foreground flex flex-col gap-1">
              <span><strong>Chancellor:</strong> Hon'ble Governor of Uttar Pradesh</span>
              <span><strong>Vice-Chancellor:</strong> Prof. J. P. Pandey</span>
            </p>
          </CardContent>
        </Card>

        {/* Helplines & Info Centre */}
        <Card className="h-full border-primary/20">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4 text-primary" />
              Official Information Centre & Helplines
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-sm">
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Student Helpline (Registrar)</p>
                  <p className="text-muted-foreground">+91 522 277 1079</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Anti-Ragging Toll Free</p>
                  <p className="text-rose-500 font-bold">1800-180-5522</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">General Enquiries</p>
                  <p className="text-muted-foreground">info@aktu.ac.in</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Sec-11, Jankipuram Vistar, Lucknow, Uttar Pradesh, Pin- 226031</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href="https://aktu.ac.in" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  www.aktu.ac.in
                </a>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
