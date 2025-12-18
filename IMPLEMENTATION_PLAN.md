# Implementation Plan: Combat Analytics AI
**Project:** AI-Driven Analytics System for Amateur MMA Athletes in Kathmandu Valley

---

## 🏗️ 1. System Architecture
We will use a **Microservices Architecture** to separate the web logic from the heavy AI processing.

- **Frontend (Client):** React + Vite (Premium Dark UI)
- **Backend (API):** Node.js + Express + MongoDB
- **ML Service (AI):** Python + Flask + MediaPipe
- **Cloud Infrastructure:** Cloudinary (Video Storage) + Redis (Queue Management)

---

## 📅 Phase 1: Foundation & Authentication (Week 1-2)
*Goal: Setup secure user accounts and the local gym profiles.*

- [ ] **Database Setup:** Implement Mongoose models for `User` and `TrainingSession`.
- [ ] **Auth System:** JWT-based login/register (specifically for Kathmandu-based athletes).
- [ ] **User Dashboard:** A "Base Camp" where athletes see their session history and overall progress scores.

---

## 🎥 Phase 2: Video Management (Week 3-4)
*Goal: Securely handle heavy video files and prepare for analysis.*

- [ ] **Cloudinary Integration:** Setup Multer for secure video uploads to the cloud.
- [ ] **Analysis Trigger:** When a video is uploaded, create a "Pending" session record in MongoDB.
- [ ] **Video Processing Queue:** Implement Redis/Bull to handle video analysis in the background without crashing the server.

---

## 🤖 Phase 3: The AI "Brain" (Week 5-7) 🧠
*Goal: The core research part of your dissertation.*

- [ ] **Python ML Service:** Setup a Flask API that receives a Cloudinary URL.
- [ ] **Striking Module (Shadow Boxing):** 
    - Detect "Guard" position (Wrist vs Ear landmarks).
    - Measure punch extension and hip pivoting.
- [ ] **Transition Module (Takedown Entry):** 
    - Track "Vertical Hip Displacement" to detect level changes.
    - Measure the time from "Stance" to "Maximum Depth".
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

- [ ] **Data Collection:** Visit local Kathmandu gyms to record sample footage of amateur athletes.
- [ ] **Testing:** Compare AI feedback with real-world feedback from a local MMA coach.
- [ ] **Performance Optimization:** Ensure the system runs smoothly on standard laptops used by students.

---

## 🎯 Dissertation Priority Markers (For the High Grade)
1. **The "Transition" Research:** Focus heavily on the math behind the Takedown Entry. This is your "Unique Research Contribution."
2. **Kathmandu Focus:** Include a "Local Gym Leaderboard" or "Standardized Test for Valley Athletes" to show local impact.
3. **Accuracy Comparison:** Include a section comparing the AI's angle calculations vs. manual measurements.

---

**Next Immediate Task:** Setup the **Cloudinary Upload logic** in the Backend so we can start accepting videos for testing.
