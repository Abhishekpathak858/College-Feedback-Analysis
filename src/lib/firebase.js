import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh8tlvJBIrteunM5B32QBMl15aoeGA0mg",
  authDomain: "aktu-feedback-analysis.firebaseapp.com",
  projectId: "aktu-feedback-analysis",
  storageBucket: "aktu-feedback-analysis.firebasestorage.app",
  messagingSenderId: "757615525622",
  appId: "1:757615525622:web:30d0691cb7528ebfc836d7",
  measurementId: "G-4YX5M16T09"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
