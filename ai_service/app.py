from flask import Flask, request, jsonify
import threading
import requests
import os
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
from analytics.biomechanics import BiomechanicsProject
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

# Load environment variables from backend .env
load_dotenv(dotenv_path="../server/.env")

# Cloudinary Config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

app = Flask(__name__)
CORS(app)

# Configuration
NODE_API_URL = "http://127.0.0.1:5000/api/sessions"
MODEL_PATH = "pose_landmarker_heavy.task"
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task"

# Download model if missing (Required for Task API)
def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Downloading MediaPipe Pose Model (heavy)...")
        r = requests.get(MODEL_URL, allow_redirects=True)
        with open(MODEL_PATH, 'wb') as f:
            f.write(r.content)
        print("Model downloaded.")

download_model()

# MediaPipe Task Setup
base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    running_mode=vision.RunningMode.VIDEO
)

def analyze_video_task(video_url, session_id, session_type):
    """
    Real MediaPipe Analysis with Video Annotation Export.
    """
    print(f"Starting {session_type} analysis for session {session_id}...")
    
    detector = vision.PoseLandmarker.create_from_options(options)
    cap = cv2.VideoCapture(video_url)
    
    if not cap.isOpened():
        print(f"Error: Could not open video stream for {session_id}")
        requests.patch(f"{NODE_API_URL}/{session_id}/results", json={"status": "failed"})
        return

    # Video Writer Setup
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    output_filename = f"out_{session_id}.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_filename, fourcc, fps/3, (w, h)) # Every 3rd frame

    # Metrics trackers
    frame_count = 0
    guard_frames = 0
    hip_heights = []
    max_extension_angle = 0
    feedback_events = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        # Process every 3rd frame to save CPU
        if frame_count % 3 != 0:
            continue

        # Convert to RGB and then to MediaPipe Image
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        
        # Calculate timestamp in ms
        timestamp_ms = int((frame_count / fps) * 1000)
        
        # Detect landmarks
        detection_result = detector.detect_for_video(mp_image, timestamp_ms)

        if detection_result.pose_landmarks:
            # Result is a list of poses, we take the first one
            landmarks = detection_result.pose_landmarks[0]
            
            # Key indices in new API:
            # 11, 12: SHOULDER, 13, 14: ELBOW, 15, 16: WRIST, 23, 24: HIP, 25, 26: KNEE, 27, 28: ANKLE
            
            # Skeleton Map for drawing (standard pairs)
            pose_connections = [
                (11, 12), (11, 13), (13, 15), (12, 14), (14, 16), # Upper Body
                (11, 23), (12, 24), (23, 24),                     # Torso
                (23, 25), (25, 27), (24, 26), (26, 28)            # Lower Body
            ]

            # Draw Connections
            for start_idx, end_idx in pose_connections:
                s_lm = landmarks[start_idx]
                e_lm = landmarks[end_idx]
                cv2.line(frame, 
                         (int(s_lm.x * w), int(s_lm.y * h)), 
                         (int(e_lm.x * w), int(e_lm.y * h)), 
                         (0, 255, 0), 2)

            # Draw Joints
            for idx in [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]:
                lm = landmarks[idx]
                cv2.circle(frame, (int(lm.x * w), int(lm.y * h)), 5, (255, 0, 0), -1)

            def get_coords(idx): 
                lm = landmarks[idx]
                return [lm.x, lm.y]
            
            l_wrist = get_coords(15)
            r_wrist = get_coords(16)
            l_ear = get_coords(7)
            r_ear = get_coords(8)
            l_shoulder = get_coords(11)
            l_elbow = get_coords(13)
            l_hip = get_coords(23)
            r_hip = get_coords(24)

            # 1. Guard Check (Modified for Type)
            is_guard_up = BiomechanicsProject.check_guard(l_wrist, l_ear) and BiomechanicsProject.check_guard(r_wrist, r_ear)
            if is_guard_up:
                guard_frames += 1
            elif frame_count % 30 == 0 and session_type in ['boxing', 'muay_thai', 'sparring']:
                feedback_events.append({"timestamp": round(frame_count/fps,1), "issue": "Guard Dropped", "suggestion": "Keep hands up during striking"})

            # 2. Hip Height (Enhanced for Grappling)
            hh = BiomechanicsProject.get_hip_height(l_hip, r_hip)
            hip_heights.append(hh)
            if session_type == 'grappling' and hh < 0.3 and frame_count % 45 == 0:
                feedback_events.append({"timestamp": round(frame_count/fps,1), "issue": "Deep Level Change", "suggestion": "Good depth on the shot", "severity": "low"})

            # 3. Strike Angle
            angle = BiomechanicsProject.calculate_angle(l_shoulder, l_elbow, l_wrist)
            if angle > max_extension_angle: max_extension_angle = angle

        # Save annotated frame
        out.write(frame)

    cap.release()
    out.release()
    detector.close()

    # Upload Annotated Video to Cloudinary
    annotated_url = ""
    try:
        print(f"Uploading annotated video for {session_id}...")
        upload_result = cloudinary.uploader.upload(output_filename, resource_type="video", folder="mma_sessions/annotated")
        annotated_url = upload_result.get("secure_url")
        os.remove(output_filename) # Clean up local file
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")

    # Calculate Aggregated Metrics
    total_processed_frames = frame_count / 3
    guard_score = int((guard_frames / total_processed_frames) * 100) if total_processed_frames > 0 else 0
    
    level_change_depth = 0
    if hip_heights:
        level_change_depth = int((max(hip_heights) - min(hip_heights)) * 100)

    # Generate Analysis Summary: Strengths, Flaws, Improvement
    strengths = []
    flaws = []
    improvements = []

    if guard_score > 70:
        strengths.append("High Guard Consistency")
    elif session_type != 'grappling':
        flaws.append("Low Guard Placement")
        improvements.append("Increase hand height to ear level")

    if level_change_depth > 20:
        strengths.append("Explosive Level Change")
    elif session_type == 'grappling':
        flaws.append("Shallow Shot Entry")
        improvements.append("Focus on dropping hips before entry")

    if max_extension_angle > 160:
        strengths.append("Full Strike Extension")
    else:
        flaws.append("Shortened Strikes")
        improvements.append("Rotate shoulders for full reach")

    # Discipline-specific presets
    if session_type == 'muay_thai' and guard_score > 80:
        strengths.append("Solid Thai Long-Guard")

    final_results = {
        "metrics": {
            "guardStability": guard_score,
            "takedownSpeed": level_change_depth,
            "strikeVolume": int(max_extension_angle),
            "accuracyScore": 85
        },
        "feedback": feedback_events[:5],
        "analysisSummary": {
            "strengths": strengths or ["Consistent Output"],
            "flaws": flaws or ["Minor Timing Gaps"],
            "improvements": improvements or ["Maintain intensity"]
        },
        "annotatedVideoUrl": annotated_url,
        "status": "completed"
    }

    try:
        response = requests.patch(f"{NODE_API_URL}/{session_id}/results", json=final_results)
        print(f"Analysis complete for {session_id}. Handshake done.")
    except Exception as e:
        print(f"Error finalizing session {session_id}: {e}")

@app.route('/analyze', methods=['POST'])
def analyze():
    print("📥 Received analysis request...")
    data = request.json
    print(f"📦 Request Data: {data}")
    video_url = data.get('videoUrl')
    session_id = data.get('sessionId')
    session_type = data.get('sessionType', 'boxing')

    if not video_url or not session_id:
        return jsonify({"message": "Missing videoUrl or sessionId"}), 400

    # Run analysis in background
    thread = threading.Thread(target=analyze_video_task, args=(video_url, session_id, session_type))
    thread.start()

    return jsonify({"message": "Analysis started in background", "sessionId": session_id}), 202

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "AI Service is running with MediaPipe Tasks"}), 200

if __name__ == '__main__':
    app.run(port=5001, debug=False) # Turned off debug to avoid double initialization of MediaPipe
