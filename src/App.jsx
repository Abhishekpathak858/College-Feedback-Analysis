import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { AuthProvider } from "@/lib/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import ScrollToTop from "@/components/ScrollToTop"
import AppLayout from "@/components/AppLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

// Pages
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import OAuthConsent from "@/pages/OAuthConsent"
import PageNotFound from "@/lib/PageNotFound"

// New Multi-Route Portal Pages
import FeedPage from "@/pages/FeedPage"
import SubmitPage from "@/pages/SubmitPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import PredictorPage from "@/pages/PredictorPage"
import ExploreCollegesPage from "@/pages/ExploreCollegesPage"
import MessagesPage from "@/pages/MessagesPage"
import ProfilePage from "@/pages/ProfilePage"
import AdminPage from "@/pages/AdminPage"
import AdmissionPage from "@/pages/AdmissionPage"
import MyPostsPage from "@/pages/MyPostsPage"
import SavedPostsPage from "@/pages/SavedPostsPage"
import KnowMorePage from "@/pages/KnowMorePage"
import WelcomeFlow from "@/pages/WelcomeFlow"
import SplashScreen from "@/components/SplashScreen"
import OnboardingPage from "@/pages/OnboardingPage"
import NotificationsPage from "@/pages/NotificationsPage"
import { ThemeProvider } from "@/lib/ThemeContext"
import { LanguageProvider } from "@/lib/LanguageContext"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <ScrollToTop />
          <Routes>
            {/* Initial Opening Flow: Splash -> Onboarding -> Login */}
            <Route path="/" element={<WelcomeFlow />} />
            <Route path="/index.html" element={<WelcomeFlow />} />
            <Route path="/splash" element={<SplashScreen onFinish={() => window.location.href = "/onboarding"} />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/oauth/consent" element={<OAuthConsent />} />
            <Route path="/know-more" element={
              <ProtectedRoute>
                <KnowMorePage />
              </ProtectedRoute>
            } />

            {/* Portal Routes */}
            <Route path="/feed" element={
              <AppLayout><FeedPage /></AppLayout>
            } />

            <Route path="/notifications" element={
              <AppLayout><NotificationsPage /></AppLayout>
            } />

            <Route path="/submit" element={
              <ProtectedRoute>
                <AppLayout><SubmitPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute>
                <AppLayout><AnalyticsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/predictor" element={
              <ProtectedRoute>
                <AppLayout><AnalyticsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/explore" element={
              <ProtectedRoute>
                <AppLayout><ExploreCollegesPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/messages" element={
              <ProtectedRoute>
                <AppLayout><MessagesPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><ProfilePage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AppLayout><AdminPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/admission" element={
              <ProtectedRoute>
                <AppLayout><AdmissionPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/my-posts" element={
              <ProtectedRoute>
                <AppLayout><MyPostsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/saved" element={
              <ProtectedRoute>
                <AppLayout><SavedPostsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</QueryClientProvider>
  )
}
