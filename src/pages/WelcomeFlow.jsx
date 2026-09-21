import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/AuthContext"
import SplashScreen from "@/components/SplashScreen"
import OnboardingPage from "@/pages/OnboardingPage"
import Login from "@/pages/Login"

export default function WelcomeFlow() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState("splash") // "splash" | "onboarding" | "login"

  useEffect(() => {
    if (!loading && user) {
      navigate("/feed", { replace: true })
    }
  }, [user, loading, navigate])

  const handleSplashFinish = () => {
    const onboardingDone = localStorage.getItem("campussphere_onboarding_completed")
    if (onboardingDone) {
      setStep("login")
    } else {
      setStep("onboarding")
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("campussphere_onboarding_completed", "true")
    setStep("login")
  }

  if (step === "splash") {
    return <SplashScreen onFinish={handleSplashFinish} duration={2000} />
  }

  if (step === "onboarding") {
    return <OnboardingPage onComplete={handleOnboardingComplete} />
  }

  return <Login />
}
