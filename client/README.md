# Sparring & Training Analytics Client

React + Vite frontend for the Kathmandu Valley amateur MMA analytics platform. Athletes log sparring rounds, intensity, fatigue, and recovery work while coaches review workload trends and actionable insights.

## Key Features

- Athlete registry with stance, focus areas, coaches, and contact details.
- Session capture covering training type, intensity, fatigue, wellness, sparring rounds, injuries, and video/AI feedback links.
- 30/60-day analytics with training load charts, session mix comparisons, focus tags, and automated recovery tips powered by the backend analytics routes.
- Field research checklist that mirrors the project objectives (data habits, tooling gaps, video analysis, expansion recommendations).

## Getting Started

```bash
cd client
npm install
VITE_API_URL=http://localhost:4000/api npm run dev
```

The frontend expects the Node.js API (in `../server`) to be running locally on port 4000 or the value you set in `VITE_API_URL`.

## Project Structure

- `src/components` – Athlete and session forms, analytics dashboard widgets, session history.
- `src/services/api.js` – Axios client + helpers for athletes, sessions, and analytics.
- `src/App.jsx` – High-level layout, state orchestration, research checklist.

## Next Steps

- Extend the UI with athlete detail pages (injury history, baseline testing).
- Embed video players for sparring clips when `videoUrl` is provided.
- Plug in AI feedback services to enrich the `round.aiFeedback` field automatically.

Contributions and field notes from Kathmandu gyms are welcome—log them as focus tags to keep qualitative insights attached to athlete profiles.
