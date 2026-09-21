import React, { useState } from "react"
import SplashScreen from "@/components/SplashScreen"
import OnboardingPage from "@/pages/OnboardingPage"
import Login from "@/pages/Login"

export default function WelcomeFlow() {
  const [step, setStep] = useState("splash") // "splash" | "onboarding" | "login"

  const handleSplashFinish = () => {
    setStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    setStep("login")
  }

  if (step === "splash") {
    return <SplashScreen onFinish={handleSplashFinish} duration={2400} />
  }

  if (step === "onboarding") {
    return <OnboardingPage onComplete={handleOnboardingComplete} />
  }

  return <Login />
}
