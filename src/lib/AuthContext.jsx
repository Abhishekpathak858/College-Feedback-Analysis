import React, { createContext, useContext, useState, useEffect } from "react"
import { base44Client } from "@/api/base44Client"
import { triggerPartyPopperConfetti } from "@/lib/celebration"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await base44Client.auth.getCurrentUser()
        // Check saved profile photo from localStorage
        const savedAvatar = localStorage.getItem("user_profile_avatar")
        let customProfile = {}
        try {
          customProfile = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
        } catch (e) {}
        if (currentUser) {
          setUser({ ...currentUser, ...customProfile, avatarUrl: savedAvatar || currentUser.avatarUrl })
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth initialization error:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const loggedUser = await base44Client.auth.login(email, password)
    const savedAvatar = localStorage.getItem("user_profile_avatar")
    let customProfile = {}
    try {
      customProfile = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
    } catch (e) {}
    const updated = { ...loggedUser, ...customProfile, avatarUrl: savedAvatar || loggedUser.avatarUrl }
    setUser(updated)
    sessionStorage.setItem("show_welcome_celebration", "true")
    triggerPartyPopperConfetti()
    return updated
  }

  const register = async (userData) => {
    const newUser = await base44Client.auth.register(userData)
    setUser(newUser)
    sessionStorage.setItem("show_welcome_celebration", "true")
    triggerPartyPopperConfetti()
    return newUser
  }

  const loginWithGoogle = async () => {
    const googleUser = await base44Client.auth.loginWithGoogle()
    setUser(googleUser)
    return googleUser
  }

  const updateProfile = async (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data }
      if (data.avatarUrl) {
        localStorage.setItem("user_profile_avatar", data.avatarUrl)
      }
      try {
        const storedCustomData = JSON.parse(localStorage.getItem("user_custom_profile") || "{}")
        localStorage.setItem("user_custom_profile", JSON.stringify({ ...storedCustomData, ...data }))
      } catch (e) {}
      return updated
    })
    try {
      const targetId = data?.id || user?.id || user?.uid
      if (targetId) {
        await base44Client.auth.updateProfile(targetId, data)
      }
    } catch (e) {
      console.warn("Could not sync profile update:", e)
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("user_profile_avatar")
      localStorage.removeItem("user_custom_profile")
      localStorage.removeItem("campushub_conversations")
      localStorage.removeItem("campushub_messages_map")
    } catch {}
    await base44Client.auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
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
