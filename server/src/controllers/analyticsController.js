const TrainingSession = require('../models/TrainingSession');

const average = (values) => {
  if (!values.length) return 0;
  return Number((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(1));
};

const buildInsights = (metrics) => {
  const tips = [];
  if (metrics.averageFatigue > 7) tips.push('Fatigue trending high. Add an extra low-intensity or recovery day.');
  if (metrics.recoveryScore && metrics.recoveryScore < 6) tips.push('Recovery scores are low. Prioritise sleep hygiene and mobility work.');
  if (metrics.sparringToDrillRatio > 2) tips.push('Large sparring-to-drill ratio detected. Consider more technical drilling to balance load.');
  if (metrics.redFlags.length) tips.push('Log injuries/red flags in detail and share with coach for adjustments.');
  return tips;
};

exports.getAthleteAnalytics = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const days = Number(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessions = await TrainingSession.find({ athlete: athleteId, date: { $gte: since } })
      .sort({ date: 1 })
      .lean();

    if (!sessions.length) {
      return res.json({ message: 'No sessions in selected window', sessions: [] });
    }

    const intensity = [];
    const fatigue = [];
    const readiness = [];
    const recoveryScore = [];
    const loadByWeek = {};
    const focusMap = {};
    const sessionTypeCounts = {};
    const redFlags = [];

    sessions.forEach((session) => {
      if (session.intensity) intensity.push(session.intensity);
      if (session.fatigue) fatigue.push(session.fatigue);
      if (session.readinessScore) readiness.push(session.readinessScore);
      if (session.recoveryScore) recoveryScore.push(session.recoveryScore);

      const weekKey = new Date(session.date).toISOString().slice(0, 10);
      const load = (session.intensity || 0) * (session.durationMinutes || 0);
      loadByWeek[weekKey] = (loadByWeek[weekKey] || 0) + load;

      session.focusAreas?.forEach((tag) => {
        focusMap[tag] = (focusMap[tag] || 0) + 1;
      });

      sessionTypeCounts[session.sessionType] = (sessionTypeCounts[session.sessionType] || 0) + 1;

      session.injuries?.forEach((injury) => {
        if (injury.needsMedicalReview || (injury.severity || 0) >= 7) {
          redFlags.push({ date: session.date, ...injury });
        }
      });
    });

    const loadValues = Object.values(loadByWeek);
    const topFocusAreas = Object.entries(focusMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count]) => ({ label, count }));

    const metrics = {
      totalSessions: sessions.length,
      totalMinutes: sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      averageIntensity: average(intensity),
      averageFatigue: average(fatigue),
      averageReadiness: average(readiness),
      recoveryScore: average(recoveryScore),
      totalTrainingLoad: loadValues.reduce((sum, v) => sum + v, 0),
      loadByDay: loadByWeek,
      sessionTypeCounts,
      topFocusAreas,
      redFlags,
      sparringToDrillRatio: (sessionTypeCounts.sparring || 0) / Math.max(sessionTypeCounts.drilling || 1, 1),
    };

    const insights = buildInsights(metrics);

    res.json({
      windowDays: days,
      metrics,
      insights,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to build analytics' });
  }
};

