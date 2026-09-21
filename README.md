# CampusSphere — Centralized College Feedback & Real-Time Sentiment Analytics Platform

> A verified, privacy-preserving institutional web platform bridging students, departmental faculty, and administrative leadership into an actionable, real-time feedback loop.

[![Production Deployment](https://img.shields.io/badge/Vercel-24%2F7%20Live-brightgreen?logo=vercel)](https://college-feedback-analysis.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Live Application
- **Production URL**: [https://college-feedback-analysis.vercel.app](https://college-feedback-analysis.vercel.app)
- **Status**: Active, 24/7 Cloud Edge Hosted (Mumbai `bom1` CDN)

---

## 📌 Problem Statement & Context

In higher education institutions—especially across technical universities such as Dr. A.P.J. Abdul Kalam Technical University (AKTU) and affiliated colleges—institutional feedback is required for statutory quality assurance (**NAAC Criterion 1.4** and **NBA**). However, conventional feedback channels suffer from four critical systemic failures:

1. **Fear of Identity Disclosure & Retaliation**: Students routinely hesitate to submit candid reviews regarding teaching quality or broken lab equipment due to fear of internal marks reduction or faculty bias.
2. **Unstructured Manual Surveys (<20% Turnaround)**: Annual paper forms and generic Google Forms lack enrollment verification, leaving datasets prone to external spam and duplicate submissions.
3. **Absence of Sentiment Depth**: Flat numerical averages (e.g. 3.8 / 5.0) obscure critical root causes. A department may appear satisfactory overall while laboratory hardware or hostel hygiene are in emergency states.
4. **Delayed Administrative Action (6-Month Reporting Lag)**: Manual report compilation takes months. By the time Deans and HODs review the feedback, the affected student cohort has already completed the semester or graduated.

---

## 💡 Solution: The CampusSphere Platform

CampusSphere introduces a multi-tier, decoupled architecture designed to establish a transparent, fear-free feedback loop:

### 1. Verified Anonymity Protocol
- Enforces institutional authentication (validating student credentials and enrollment status to prevent spam).
- Public review documents are decoupled from user PII (Personally Identifiable Information). Student names and email addresses are permanently excluded from review records, replacing them with a verified identity token (`"Verified Student"`).
- Zero administrative backdoor: College authorities and database administrators cannot trace reviews back to individual student profiles.

### 2. Multi-Domain Evaluation Rubrics
Structured 5-star criteria evaluating specific campus parameters:
- **Academic & Teaching Quality**: Concept delivery, syllabus coverage, and mentorship.
- **Laboratory Infrastructure**: Equipment availability, PC hardware, and high-speed Wi-Fi.
- **Campus Life & Hostels**: Cleanliness, mess food hygiene, safety, and sports facilities.
- **Placement Transparency**: Placement cell support, recruitment drives, and salary disclosure.

### 3. Real-Time Sentiment Intelligence
- Automated deterministic sentiment engine categorizing reviews into **Positive (80-100%)**, **Neutral (50-79%)**, and **Critical Alert (<50%)**.
- Keyword-triggered grievance detection flags critical infrastructure or safety issues immediately on administrative dashboards.

### 4. Dynamic Digital Student ID
- Dynamic 2D QR-code generation rendering verifiable student identity cards (`CS-XXXXXX`) for on-campus student verification.

### 5. Synchronous Tri-Lingual Localization
- Real-time client-side switching between **English**, **हिन्दी (Hindi)**, and **Hinglish** without full-page reloads, ensuring accessibility for rural and state-board students.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Justification |
|---|---|---|
| **Frontend Framework** | React 18.3, Vite 5.4 | Component modularity, Virtual DOM, and Hot Module Replacement (HMR) |
| **Routing** | React Router DOM v6 | Seamless client-side Single Page Application (SPA) routing |
| **UI & Styling** | Tailwind CSS, Radix UI (Shadcn), Lucide Icons | Accessible, high-contrast, mobile-first design tokens |
| **State & Async Caching** | TanStack React Query v5, Context API | Intelligent background refetching, client cache deduplication |
| **Data Visualization** | Recharts | Dynamic interactive bar charts and sentiment distribution graphs |
| **Identity & Security** | Canvas QRCode, SHA-derived hash masking | Dynamic verified identity payloads |
| **Cloud Hosting & CDN** | Vercel Global Edge Network | Sub-50ms TTFB latency across India via Mumbai (`bom1`) edge nodes |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone Repository
```bash
git clone https://github.com/Abhishekpathak858/College-Feedback-Analysis.git
cd College-Feedback-Analysis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

### 4. Production Build & Optimization
```bash
npm run build
```
Generates an optimized static bundle in `dist/` with manual chunk splitting (isolating React Core to ~161 KB).

---

## 📂 Project Directory Structure

```text
College-Feedback-Analysis/
├── public/                 # Static assets, official campus images, manifest
├── scripts/                # Data seeders, coordinate mappers & utility scripts
├── src/
│   ├── api/                # Cloud data client & sentiment classification engine
│   ├── components/         # Reusable UI components (Feed, Forms, Dashboard, QR ID)
│   ├── hooks/              # Custom reactive hooks (useMobile, useToast)
│   ├── lib/                # AuthContext, LanguageContext, master college data
│   ├── pages/              # Primary routes (Home, Explore, Reviews, Analytics, Profile)
│   ├── App.jsx             # Master route registry & navigation layout
│   ├── index.css           # Global Tailwind directives & glassmorphic tokens
│   └── main.jsx            # Application root entry point
├── vercel.json             # SPA edge rewrites for 24/7 cloud hosting
├── vite.config.js          # Vite configuration & Rollup bundle splitting
└── package.json            # Dependencies and build scripts
```

---

## 📊 NAAC & NBA Accreditation Alignment

CampusSphere directly supports higher education institutions in fulfilling statutory accreditation parameters:
- **NAAC Criterion 1.4 (Feedback System)**: Sub-criteria 1.4.1 and 1.4.2 require structured stakeholder feedback and comprehensive Action Taken Reports (ATR). CampusSphere generates timestamped, auditable, department-wise analytics satisfying peer team evidentiary requirements.
- **NBA Criterion 10**: Continuous institutional improvement documentation through empirical student metrics.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
