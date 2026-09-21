import React, { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {}
})

const THEME_STORAGE_KEY = "campussphere_theme"

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "dark"
    } catch {
      return "dark"
    }
  })

  const [resolvedTheme, setResolvedTheme] = useState("dark")

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const applyTheme = (currentTheme) => {
      let resolved = currentTheme
      if (currentTheme === "system") {
        resolved = mediaQuery.matches ? "dark" : "light"
      }

      setResolvedTheme(resolved)

      if (resolved === "dark") {
        root.classList.add("dark")
        root.classList.remove("light")
        root.setAttribute("data-theme", "dark")
        root.style.colorScheme = "dark"
      } else {
        root.classList.add("light")
        root.classList.remove("dark")
        root.setAttribute("data-theme", "light")
        root.style.colorScheme = "light"
      }
    }

    applyTheme(theme)

    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleSystemChange)
    return () => mediaQuery.removeEventListener("change", handleSystemChange)
  }, [theme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (e) {
      console.error("Failed to save theme:", e)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
