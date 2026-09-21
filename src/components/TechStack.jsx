import React from "react"
import { Badge } from "@/components/ui/badge"
import { Cpu, Layers, ShieldCheck, Database, BarChart3, Radio, Code2 } from "lucide-react"

const STACK_ITEMS = [
  { label: "React 18 & Vite", category: "Core Framework", icon: Layers },
  { label: "AI Sentiment Polarity Engine", category: "NLP & AI", icon: Code2 },
  { label: "Tailwind CSS & Shadcn UI", category: "Design System", icon: Cpu },
  { label: "Recharts Visualizations", category: "Analytics", icon: BarChart3 },
  { label: "Firebase Firestore & Cloud REST API", category: "Backend / Database", icon: Database },
  { label: "Role-Based Auth & OAuth", category: "Security", icon: ShieldCheck },
  { label: "Real-time Event Stream", category: "Monitoring", icon: Radio },
]

export default function TechStack() {
  return (
    <section className="py-12 border-t bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-2 uppercase tracking-wider text-xs font-semibold">
            System Architecture
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight">Enterprise-Grade Intelligence Stack</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-1">
            Built with modern web technologies, automated NLP sentiment scoring, and reactive charts.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {STACK_ITEMS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-4 rounded-xl border bg-card/60 hover:bg-card hover:shadow-sm hover:border-primary/40 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-foreground line-clamp-1">{item.label}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{item.category}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
