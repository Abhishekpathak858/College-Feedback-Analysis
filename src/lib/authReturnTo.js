const RETURN_TO_KEY = "cfa_auth_return_to"

export function setReturnTo(path) {
  try {
    sessionStorage.setItem(RETURN_TO_KEY, path)
  } catch {
    // fallback
  }
}

export function getReturnTo() {
  try {
    const fromParam = safeReturnTo()
    if (fromParam && fromParam !== "/") return fromParam
    const path = sessionStorage.getItem(RETURN_TO_KEY)
    sessionStorage.removeItem(RETURN_TO_KEY)
    return path || "/"
  } catch {
    return "/"
  }
}

export function safeReturnTo() {
  const raw = new URLSearchParams(window.location.search).get("returnTo")
  if (!raw) return "/"
  try {
    const url = new URL(raw, window.location.origin)
    if (url.origin !== window.location.origin) return "/"
    for (const p of ["access_token", "clear_access_token", "app_id", "app_base_url", "functions_version", "from_url"]) {
      url.searchParams.delete(p)
    }
    const path = url.pathname + url.search
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/"
    return path
  } catch {
    return "/"
  }
}
