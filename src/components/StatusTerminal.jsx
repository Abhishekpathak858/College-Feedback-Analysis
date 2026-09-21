import React, { useState, useEffect, useRef } from "react"
import { apiClient } from "@/api/apiClient"
import { Terminal, Shield, CheckCircle, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StatusTerminal() {
  const [logs, setLogs] = useState([])
  const [isLive, setIsLive] = useState(true)
  const logContainerRef = useRef(null)

  const fetchLogs = async () => {
    const freshLogs = await apiClient.getSystemLogs()
    setLogs(freshLogs)
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(() => {
      if (isLive) {
        fetchLogs()
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [isLive])

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="rounded-xl border bg-slate-950 text-slate-100 shadow-xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-slate-300 font-semibold text-xs">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>analysis-worker@college-feedback-core:~</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI Stream Active</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchLogs}
            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Refresh logs"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearLogs}
            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Clear logs"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Logs Content */}
      <div
        ref={logContainerRef}
        className="p-4 max-h-56 overflow-y-auto space-y-1.5 bg-slate-950/90 selection:bg-primary/30"
      >
        <div className="text-slate-500">
          # Continuous NLP Feedback Sentiment & Entity Classification Pipeline
        </div>
        <div className="text-slate-500">
          # Listening for student submissions & updating analytical matrices...
        </div>

        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-2">
            No recent activity captured. Submit a feedback entry above to see live analysis.
          </div>
        ) : (
          logs.map((log, index) => {
            const isPositive = log.includes("Positive")
            const isNegative = log.includes("Negative")
            const isNeutral = log.includes("Neutral")
            const isReceived = log.includes("FEEDBACK_RECEIVED")

            return (
              <div key={index} className="leading-relaxed flex items-start gap-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span
                  className={`
                    ${isReceived ? "font-semibold" : ""}
                    ${isPositive ? "text-emerald-400" : ""}
                    ${isNegative ? "text-rose-400" : ""}
                    ${isNeutral ? "text-amber-300" : ""}
                    ${!isPositive && !isNegative && !isNeutral ? "text-slate-300" : ""}
                  `}
                >
                  {log}
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span>Channel: production-feedback-v1</span>
        <span>Latency: 12ms</span>
      </div>
    </div>
  )
}
