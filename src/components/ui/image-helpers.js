export function getFallbackImageUrl(seed = "college", width = 400, height = 300) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

export function isValidImageUrl(url) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
