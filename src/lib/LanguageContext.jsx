import React, { createContext, useContext, useState, useEffect } from "react"

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key, fallback) => fallback || key
})

const LANG_STORAGE_KEY = "campussphere_language"

const TRANSLATIONS = {
  en: {
    // Navigation
    nav_feed: "Home",
    nav_explore: "Explore",
    nav_notifications: "Notifications",
    nav_profile: "Profile",
    nav_admin: "Admin Dashboard",
    nav_submit: "Review",
    nav_predictor: "Cutoff Predictor",
    nav_analytics: "Analytics",
    
    // Profile & Settings
    profile_header: "Profile",
    profile_title: "My Profile",
    profile_digital_id: "Digital Student ID",
    profile_edit: "Edit Profile",
    profile_posts: "My Posts",
    profile_reviews: "My Reviews",
    profile_saved: "Saved Posts",
    profile_admin: "Admin Dashboard",
    profile_settings: "Settings",
    profile_account: "Account",
    profile_theme: "Theme",
    profile_language: "Language",
    profile_privacy: "Privacy",
    profile_notifications: "Notifications",
    profile_help: "Help & Support",
    profile_about: "About",
    profile_logout: "Log Out",
    
    // Theme options
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    theme_system: "System Default",
    theme_dark_sub: "Easy on the eyes, dark theme",
    theme_light_sub: "Bright, clean, high-contrast theme",
    theme_system_sub: "Match your device appearance",
    
    // Privacy
    privacy_public: "Public Account",
    privacy_public_sub: "Anyone can view your profile, submitted reviews, and college badge.",
    privacy_private: "Private Account",
    privacy_private_sub: "Only you can view your personal profile and activity. Identity is protected.",
    
    // Notifications
    notif_title: "Notifications",
    notif_on: "ON",
    notif_off: "OFF",
    notif_on_sub: "Real-time alerts and campus updates are currently enabled.",
    notif_off_sub: "Notifications are turned off. You will not receive alerts.",
    notif_empty: "No new notifications",
    notif_empty_sub: "You're all caught up! Likes, comments, ratings and reviews will appear here.",
    
    // Actions
    btn_save: "Save Changes",
    btn_cancel: "Cancel",
    btn_close: "Close"
  },
  hi: {
    // Navigation
    nav_feed: "होम",
    nav_explore: "कॉलेज",
    nav_notifications: "सूचनाएं",
    nav_profile: "प्रोफाइल",
    nav_admin: "एडमिन डैशबोर्ड",
    nav_submit: "रिव्यू",
    nav_predictor: "कटऑफ",
    nav_analytics: "विश्लेषण",
    
    // Profile & Settings
    profile_header: "मेरी प्रोफाइल",
    profile_title: "मेरी प्रोफाइल",
    profile_digital_id: "डिजिटल स्टूडेंट आईडी",
    profile_edit: "प्रोफाइल एडिट करें",
    profile_posts: "मेरी पोस्ट्स",
    profile_reviews: "मेरी समीक्षाएं",
    profile_saved: "सहेजी गई पोस्ट्स",
    profile_admin: "एडमिन डैशबोर्ड",
    profile_settings: "सेटिंग्स",
    profile_account: "खाता",
    profile_theme: "थीम",
    profile_language: "भाषा",
    profile_privacy: "गोपनीयता (Privacy)",
    profile_notifications: "सूचनाएं",
    profile_help: "सहायता एवं सपोर्ट",
    profile_about: "बारे में",
    profile_logout: "लॉगआउट",
    
    // Theme options
    theme_dark: "डार्क मोड",
    theme_light: "लाइट मोड",
    theme_system: "सिस्टम डिफॉल्ट",
    theme_dark_sub: "आंखों के लिए आरामदायक, डार्क थीम",
    theme_light_sub: "उज्ज्वल, स्वच्छ और स्पष्ट थीम",
    theme_system_sub: "डिवाइस की सेटिंग के अनुसार",
    
    // Privacy
    privacy_public: "पब्लिक अकाउंट (सार्वजनिक)",
    privacy_public_sub: "कोई भी छात्र आपकी प्रोफाइल और समीक्षाएं देख सकता है।",
    privacy_private: "प्राइवेट अकाउंट (निजी)",
    privacy_private_sub: "केवल आप अपनी गतिविधि देख सकते हैं। आपकी पहचान पूरी तरह सुरक्षित रहेगी।",
    
    // Notifications
    notif_title: "सूचनाएं (Notifications)",
    notif_on: "चालू (ON)",
    notif_off: "बंद (OFF)",
    notif_on_sub: "कैंपस अलर्ट और अपडेट चालू हैं।",
    notif_off_sub: "सूचनाएं बंद हैं। आपको नए अलर्ट प्राप्त नहीं होंगे।",
    notif_empty: "कोई नई सूचना नहीं है",
    notif_empty_sub: "सब कुछ अपडेट है! समीक्षाएं, लाइक्स और कमेंट्स यहां दिखेंगे।",
    
    // Actions
    btn_save: "बदलाव सहेजें",
    btn_cancel: "रद्द करें",
    btn_close: "बंद करें"
  },
  hinglish: {
    // Navigation
    nav_feed: "Home",
    nav_explore: "Colleges",
    nav_notifications: "Alerts",
    nav_profile: "Profile",
    nav_admin: "Admin Dashboard",
    nav_submit: "Review",
    nav_predictor: "Predictor",
    nav_analytics: "Analytics",
    
    // Profile & Settings
    profile_header: "Meri Profile",
    profile_title: "Meri Profile",
    profile_digital_id: "Digital Student ID",
    profile_edit: "Profile Edit Karein",
    profile_posts: "Meri Posts",
    profile_reviews: "Mere Reviews",
    profile_saved: "Saved Posts",
    profile_admin: "Admin Dashboard",
    profile_settings: "Settings",
    profile_account: "Account",
    profile_theme: "Theme",
    profile_language: "Language",
    profile_privacy: "Privacy Settings",
    profile_notifications: "Notifications",
    profile_help: "Help & Support",
    profile_about: "About",
    profile_logout: "Log Out Karein",
    
    // Theme options
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    theme_system: "System Default",
    theme_dark_sub: "Eyes ke liye comfortable, dark theme",
    theme_light_sub: "Clean aur bright light theme",
    theme_system_sub: "Apne phone/PC ki theme ke according",
    
    // Privacy
    privacy_public: "Public Account",
    privacy_public_sub: "Sabhi students aapki profile, reviews aur college dekh sakte hain.",
    privacy_private: "Private Account",
    privacy_private_sub: "Aapki profile private rahegi. Identity puri tarah safe rahegi.",
    
    // Notifications
    notif_title: "Notifications",
    notif_on: "ON",
    notif_off: "OFF",
    notif_on_sub: "Real-time alerts aur college updates enabled hain.",
    notif_off_sub: "Notifications disabled hain. Koi alert nahi aayega.",
    notif_empty: "Koi nayi notification nahi hai",
    notif_empty_sub: "Aapka sab caught up hai! Likes, comments aur reviews yahan dikhenge.",
    
    // Actions
    btn_save: "Save Karein",
    btn_cancel: "Cancel Karein",
    btn_close: "Close"
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en"

    // Optional Google Translate integration for deep text translation if desired
    if (language === "hi") {
      try {
        document.cookie = "googtrans=/en/hi; path=/"
      } catch {}
    } else {
      try {
        document.cookie = "googtrans=/en/en; path=/"
      } catch {}
    }
  }, [language])

  const setLanguage = (newLang) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang)
    } catch (e) {
      console.error("Failed to save language:", e)
    }
  }

  const t = (key, fallback) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en
    if (dict[key]) return dict[key]
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key]
    return fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
