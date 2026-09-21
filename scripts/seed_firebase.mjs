import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync('./aktu-feedback-app-firebase-adminsdk-fbsvc-9bfc21f82e.json', 'utf8')
);

const app = initializeApp({
  credential: cert(serviceAccount)
});

// Access default database
const db = getFirestore(app);

async function seedData() {
  console.log("Seeding initial collections into aktudatabase...");

  // Seed sample feedback document
  const feedbackRef = db.collection('feedbacks').doc();
  await feedbackRef.set({
    authorName: "Abhishek Pathak",
    authorUsername: "abhishek_p",
    collegeName: "ITS Engineering College, Greater Noida",
    department: "Computer Science & Engineering",
    category: "Infrastructure & Labs",
    rating: 5,
    comment: "The computer labs have been upgraded with high-speed internet and modern workstations! Great experience.",
    sentiment: "positive",
    status: "Resolved",
    likes: 15,
    createdAt: new Date().toISOString()
  });

  // Seed another feedback document
  const feedbackRef2 = db.collection('feedbacks').doc();
  await feedbackRef2.set({
    authorName: "Priya Sharma",
    authorUsername: "priya_cs",
    collegeName: "Galgotias College of Engineering",
    department: "Computer Science",
    category: "Canteen & Food Quality",
    rating: 4,
    comment: "Canteen food quality has improved significantly after student feedback submission.",
    sentiment: "positive",
    status: "Pending",
    likes: 8,
    createdAt: new Date().toISOString()
  });

  // Seed sample user document
  const userRef = db.collection('users').doc('admin_user_01');
  await userRef.set({
    fullName: "Abhishek Pathak",
    username: "abhishek_p",
    email: "abhishekpathakrp_ds24@its.edu.in",
    collegeName: "ITS Engineering College, Greater Noida",
    department: "Computer Science",
    rollNumber: "2100000000",
    role: "admin",
    createdAt: new Date().toISOString()
  });

  console.log("SUCCESS: Created 'feedbacks' and 'users' collections in aktudatabase!");
}

seedData().catch((err) => {
  console.error("Seeding Error:", err);
});
