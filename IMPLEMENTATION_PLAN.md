# Implementation Plan: Combat Analytics AI
**Project:** AI-Driven Analytics System for Amateur MMA Athletes in Kathmandu Valley

---

## 🏗️ 1. System Architecture
We will use a **Microservices Architecture** to separate the web logic from the heavy AI processing.

- **Frontend (Client):** React + Vite (Premium Performance UI)
- **Backend (API):** Node.js + Express + MongoDB
- **ML Service (AI):** Python + Flask + MediaPipe
- **Cloud Infrastructure:** Cloudinary (Video Storage) + Redis (Queue Management)

---

## 📅 Phase 1: Foundation & Authentication (COMPLETED) ✅
*Goal: Setup secure user accounts and the local gym profiles.*

- [x] **Database Setup:** Implement Mongoose models for `User` and `TrainingSession`.
- [x] **Auth System:** JWT-based login/register with Gmail OTP Verification.
- [x] **User Dashboard:** Premium Base Camp with sidebar, stats, and real-time session fetching.

---

## 🎥 Phase 2: Video Management (IN PROGRESS) 🏗️
*Goal: Securely handle heavy video files and prepare for analysis.*

- [x] **Cloudinary Integration:** Setup Multer and Cloudinary for secure video uploads.
- [x] **Analysis Trigger:** Automatic creation of "Pending" session records in MongoDB.
- [ ] **Background Processing Queue:** Implement Redis/Bull to manage the handshake between Node.js and the Python AI service.

---

## 🤖 Phase 3: The AI "Brain" (Week 5-7) 🧠
*Goal: The core research part of the dissertation.*

- [ ] **Python ML Bridge:** Setup a Flask API that receives a Cloudinary URL and returns skeletal landmarks.
- [ ] **Striking Module (Shadow Boxing):** 
    - Detect "Guard" position (Wrist vs Ear landmarks).
    - Measure punch extension and hip pivoting (using angle calculations).
- [ ] **Transition Module (Takedown Entry):** 
    - Track "Vertical Hip Displacement" to detect level changes.
    - Measure the time from "Stance" to "Maximum Depth" (Explosiveness metric).
- [ ] **Expert Benchmarking:** Hardcode the "Optimal Angles" (Expert Reference) to compare against athlete data.

---

## 📊 Phase 4: Analytics & Visualization (Week 8-10)
*Goal: Turning messy AI data into coaching feedback.*

- [ ] **Feedback Engine:** Convert Python numbers into human-readable tips (e.g., *"Lower your hips by 10cm before shooting"*).
- [ ] **Data Visualization:** Use `Recharts` to show "Guard Stability Over Time" and "Reaction Speed Trends."
- [ ] **Dynamic Overlay:** Create a feature that displays the "Green/Red" AI skeleton over the athlete's original video.

---

## ⛰️ Phase 5: Local Validation & Dissertation (Week 11-12)
*Goal: Ensuring the system works for the Kathmandu MMA community.*

- [ ] **Data Collection:** Gather sample footage from local gyms (e.g., Lock n' Roll, United Kathmandu).
- [ ] **Testing:** Compare AI feedback with real-world feedback from local coaches.
- [ ] **Performance Optimization:** Ensure the system runs smoothly on standard student-grade hardware.

---

## 🎯 Dissertation Priority Markers (For the High Grade)
1. **The "Transition" Research:** Focus heavily on the math behind the Takedown Entry. This is the "Unique Research Contribution."
2. **Kathmandu Focus:** Include a "Local Gym Leaderboard" to show community impact.
3. **Accuracy Comparison:** Comparison section: AI calculations vs. manual coaching eye.

---

**Next Immediate Task:** Setup the **Python AI Service (ML Bridge)** using MediaPipe to start extracting skeletal coordinates from uploaded videos.
