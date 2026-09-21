import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function getSentimentBadgeColor(sentiment) {
  if (!sentiment) return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
  const s = sentiment.toLowerCase()
  if (s.includes("good")) {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  } else if (s.includes("urgent")) {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20"
  } else {
    // Average / Neutral
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
  }
}

// ================= SECURITY & SANITIZATION SUITE =================
// 1. Anti-XSS and Malicious Script Stripper
export function sanitizeInput(input) {
  if (typeof input !== "string") return input
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/onerror\s*=/gi, "")
    .replace(/onload\s*=/gi, "")
    .replace(/onclick\s*=/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .trim()
}

// 2. Anti-Spam Rate Limiter (Cooldown Engine)
export function checkRateLimit(actionKey = "general", maxRequests = 5, windowMs = 60000) {
  try {
    const storageKey = `campushub_rl_${actionKey}`
    const now = Date.now()
    let timestamps = JSON.parse(localStorage.getItem(storageKey) || "[]")

    // Remove timestamps older than window
    timestamps = timestamps.filter(ts => now - ts < windowMs)

    if (timestamps.length >= maxRequests) {
      const waitSeconds = Math.ceil((windowMs - (now - timestamps[0])) / 1000)
      return { 
        allowed: false, 
        error: `Security Alert: Cooldown active! Too many actions. Please wait ${waitSeconds}s before submitting again.` 
      }
    }

    timestamps.push(now)
    localStorage.setItem(storageKey, JSON.stringify(timestamps))
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

// 3. File Verification & Anti-Malware Guard
export function validateMediaFile(file, allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"]) {
  if (!file) return { valid: false, error: "No file selected." }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Security Check Failed: Disallowed file type (${file.type}). Only verified JPG, PNG, WEBP images & MP4/WEBM videos are allowed.` 
    }
  }

  const isVideo = file.type.startsWith("video/")
  const maxSize = isVideo ? 20 * 1024 * 1024 : 8 * 1024 * 1024
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File exceeds security limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed: ${isVideo ? '20MB' : '8MB'}.` 
    }
  }

  // Prevent dangerous double extensions like image.php.jpg
  const fileNameParts = (file.name || "").split('.')
  if (fileNameParts.length > 2) {
    const dangerousExts = ["php", "exe", "sh", "bat", "cmd", "js", "vbs", "jar", "py", "scr"]
    for (let part of fileNameParts) {
      if (dangerousExts.includes(part.toLowerCase())) {
        return { valid: false, error: "Security Warning: Dangerous file name or double extension detected!" }
      }
    }
  }

  return { valid: true }
}

// 4. Contact Format Validation
export function validateContactDetails(phone, email) {
  if (phone) {
    const cleanPhone = phone.replace(/[\s\-+()]/g, "")
    if (!/^\d{10,12}$/.test(cleanPhone)) {
      return { valid: false, error: "Please enter a genuine 10-digit phone number." }
    }
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: "Please enter a valid email format." }
    }
  }
  return { valid: true }
}
