import React, { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "@/api/apiClient"
import { triggerPartyPopperConfetti } from "@/lib/celebration"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await apiClient.auth.getCurrentUser()
        // Check saved profile photo from localStorage
        const savedAvatar = localStorage.getItem("user_profile_avatar")
        let customProfile = {}
        try {
          customProfile = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
        } catch (e) {}
        if (currentUser) {
          const merged = { ...currentUser, ...customProfile, avatarUrl: savedAvatar || currentUser.avatarUrl }
          setUser(merged)
          localStorage.setItem("campussphere_current_user", JSON.stringify(merged))
        } else {
          // Check local stored session fallback
          const localStored = localStorage.getItem("campussphere_current_user")
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored)
              if (parsed && typeof parsed === "object") {
                setUser({ ...parsed, ...customProfile, avatarUrl: savedAvatar || parsed.avatarUrl })
              } else {
                setUser(null)
              }
            } catch (e) {
              setUser(null)
            }
          } else {
            setUser(null)
          }
        }
      } catch (err) {
        console.warn("Auth initialization warning, checking local session:", err)
        const localStored = localStorage.getItem("campussphere_current_user")
        if (localStored) {
          try {
            setUser(JSON.parse(localStored))
          } catch (e) {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const loginDirect = (userData) => {
    const savedAvatar = localStorage.getItem("user_profile_avatar")
    const updated = { ...userData, avatarUrl: savedAvatar || userData.avatarUrl }
    setUser(updated)
    try {
      localStorage.setItem("campussphere_current_user", JSON.stringify(updated))
    } catch (e) {}
    sessionStorage.setItem("show_welcome_celebration", "true")
    triggerPartyPopperConfetti()
    return updated
  }

  const login = async (email, password) => {
    const loggedUser = await apiClient.auth.login(email, password)
    const savedAvatar = localStorage.getItem("user_profile_avatar")
    let customProfile = {}
    try {
      customProfile = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
    } catch (e) {}
    const updated = { ...loggedUser, ...customProfile, avatarUrl: savedAvatar || loggedUser.avatarUrl }
    setUser(updated)
    try {
      localStorage.setItem("campussphere_current_user", JSON.stringify(updated))
    } catch (e) {}
    sessionStorage.setItem("show_welcome_celebration", "true")
    triggerPartyPopperConfetti()
    return updated
  }

  const register = async (userData) => {
    const newUser = await apiClient.auth.register(userData)
    setUser(newUser)
    try {
      localStorage.setItem("campussphere_current_user", JSON.stringify(newUser))
    } catch (e) {}
    sessionStorage.setItem("show_welcome_celebration", "true")
    triggerPartyPopperConfetti()
    return newUser
  }

  const loginWithGoogle = async () => {
    const googleUser = await apiClient.auth.loginWithGoogle()
    setUser(googleUser)
    try {
      localStorage.setItem("campussphere_current_user", JSON.stringify(googleUser))
    } catch (e) {}
    return googleUser
  }

  const updateProfile = async (data) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...data }
      if (data.avatarUrl) {
        localStorage.setItem("user_profile_avatar", data.avatarUrl)
      }
      try {
        const storedCustomData = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
        localStorage.setItem("user_custom_profile", JSON.stringify({ ...storedCustomData, ...data }))
        localStorage.setItem("campussphere_current_user", JSON.stringify(updated))
      } catch (e) {}
      return updated
    })
    try {
      const targetId = data?.id || user?.id || user?.uid
      if (targetId) {
        await apiClient.auth.updateProfile(targetId, data)
      }
    } catch (e) {
      console.warn("Could not sync profile update:", e)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("campussphere_current_user")
      localStorage.removeItem("user_profile_avatar")
      localStorage.removeItem("user_custom_profile")
      localStorage.removeItem("campushub_conversations")
      localStorage.removeItem("campushub_messages_map")
    } catch {}
    try {
      await apiClient.auth.logout()
    } catch (e) {}
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginDirect,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
