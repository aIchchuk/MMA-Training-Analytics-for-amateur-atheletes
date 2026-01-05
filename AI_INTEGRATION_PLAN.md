# AI Service Implementation Plan: The "Brain" 🧠
**Phase:** 3 (ML & Computer Vision Integration)
**Goal:** Extract actionable MMA biomechanics from raw video using MediaPipe and Python.

---

## 🛠️ Step 1: Environment & Architecture
- [ ] **Python Setup:** Initialize a `ai_service/` directory with a Virtual Environment.
- [ ] **Dependencies:** Install `mediapipe`, `opencv-python`, `flask`, `requests`, and `numpy`.
- [ ] **Flask API:** Create a lightweight server that listens for `POST /analyze` requests from our Node.js backend.

---

## 📡 Step 2: Communication Bridge (Node.js ↔ Python)
- [ ] **The "Handshake":**
    1. Node.js backend finishes Cloudinary upload.
    2. Node.js sends the `videoUrl` and `sessionId` to Python.
    3. Python responds immediately with "Processing started."
- [ ] **Cloudinary Stream:** Python will use `cv2.VideoCapture` to stream the video directly from the Cloudinary URL.

---

## 🦴 Step 3: Skeletal Landmark Extraction
- [ ] **MediaPipe Pose:** Initialize the `Pose` solution with high-confidence tracking.
- [ ] **Coordinate Normalization:** Convert raw pixel coordinates into a standardized $(\Delta x, \Delta y)$ space to ensure stability across different camera distances.
- [ ] **Data Smoothing:** Apply a Moving Average filter to the skeletal landmarks to remove "jitter" from the video.

---

## 🥋 Step 4: MMA Biomechanics Modules
### 🛡️ Module A: Guard Stability (Striking)
- **Logic:** Measure the distance between `LEFT_WRIST`/`RIGHT_WRIST` and `LEFT_EAR`/`RIGHT_EAR`.
- **Metric:** Calculate the % of frames where the hands are "In Position" (within 15cm of the face).
- **Feedback:** *"Your right hand drops when you throw a left hook."*

### 📉 Module B: Takedown Entry (Wrestling/Grappling)
- **Logic:** Track `LEFT_HIP` and `RIGHT_HIP` vertical $y$-coordinates.
- **Metric:** 
    1. **Level Change:** Measure the drop in hip height $(\Delta y)$.
    2. **Explosiveness:** Time elapsed from the start of the drop to maximum depth.
- **Feedback:** *"Good level change, but try to keep your chest more upright."*

### 📐 Module C: Strike Extension
- **Logic:** Use the Law of Cosines to calculate the angle at the `ELBOW` (Shoulder-Elbow-Wrist) and `KNEE` (Hip-Knee-Ankle).
- **Metric:** Peak extension angle (Goal: $> 165^\circ$ for maximum reach).

---

## 📊 Step 5: Results Feedback & Storage
- [ ] **Data Aggregation:** Bundle all scores and feedback into a single JSON object.
- [ ] **Database Update:** Python sends a `PATCH` request back to Node.js at `/api/sessions/:id/results`.
- [ ] **Status Change:** Update session status from `analyzing` to `completed`.

---

## 🎯 Immediate First Step (Turbo)
Create the `ai_service/` directory and build the **Video Connection Test** to ensure Python can read the Cloudinary videos.
