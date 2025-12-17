import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AthleteForm from './components/AthleteForm';
import AnalyticsPanel from './components/AnalyticsPanel';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';
import CSVUpload from './components/CSVUpload';
import { createAthlete, createSession, fetchAnalytics, fetchAthletes, fetchSessions } from './services/api';

const App = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState(30);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [savingAthlete, setSavingAthlete] = useState(false);
  const [savingSession, setSavingSession] = useState(false);
  const [error, setError] = useState('');

  const selectedAthleteObj = useMemo(() => athletes.find((athlete) => athlete._id === selectedAthlete), [athletes, selectedAthlete]);

  useEffect(() => {
    loadAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthlete) {
      loadSessions(selectedAthlete);
      loadAnalytics(selectedAthlete, range);
    } else {
      setSessions([]);
      setAnalytics(null);
    }
  }, [selectedAthlete, range]);

  const loadAthletes = async () => {
    setError('');
    try {
      const data = await fetchAthletes();
      setAthletes(data);
      if (!selectedAthlete && data.length) {
        setSelectedAthlete(data[0]._id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSessions = async (athleteId) => {
    if (!athleteId) return;
    try {
      const data = await fetchSessions(athleteId, 25);
      setSessions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadAnalytics = async (athleteId, days) => {
    if (!athleteId) return;
    setLoadingAnalytics(true);
    try {
      const data = await fetchAnalytics(athleteId, days);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleCreateAthlete = async (payload) => {
    setSavingAthlete(true);
    setError('');
    try {
      const athlete = await createAthlete(payload);
      setAthletes((prev) => [athlete, ...prev]);
      setSelectedAthlete(athlete._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAthlete(false);
    }
  };

  const handleCreateSession = async (payload) => {
    setSavingSession(true);
    setError('');
    try {
      await createSession(payload);
      await loadSessions(payload.athlete);
      await loadAnalytics(payload.athlete, range);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSession(false);
    }
  };

  const handleAthletesImported = async () => {
    await loadAthletes();
  };

  const handleSessionsImported = async () => {
    if (selectedAthlete) {
      await loadSessions(selectedAthlete);
      await loadAnalytics(selectedAthlete, range);
    }
  };

  return (
    <main>
      <header>
        <h1>MMA Training Analytics System</h1>
        <p>
          Track your training sessions, sparring rounds, and recovery to improve performance with data-driven insights.
        </p>
      </header>

      <div className="card">
        <div className="selector-row">
          <label>
            Athlete in focus
            <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)}>
              <option value="">Select athlete</option>
              {athletes.map((athlete) => (
                <option key={athlete._id} value={athlete._id}>
                  {athlete.fullName} • {athlete.weightClass || 'open'}
                </option>
              ))}
            </select>
          </label>
          <label>
            Analytics window
            <select value={range} onChange={(e) => setRange(Number(e.target.value))}>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
            </select>
          </label>
          {selectedAthleteObj && (
            <div className="athlete-summary">
              <strong>{selectedAthleteObj.fullName}</strong>
              <span>{selectedAthleteObj.gym || 'Independent'}</span>
              <span>{selectedAthleteObj.focusAreas?.join(', ')}</span>
            </div>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        {loadingAnalytics && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <div className="spinner"></div>
            <span className="muted">Refreshing analytics...</span>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <AthleteForm onSubmit={handleCreateAthlete} isSubmitting={savingAthlete} />
        <SessionForm athleteId={selectedAthlete} onSubmit={handleCreateSession} disabled={savingSession} />
      </div>

      <AnalyticsPanel analytics={analytics} />

      <CSVUpload 
        athletes={athletes} 
        onAthletesImported={handleAthletesImported}
        onSessionsImported={handleSessionsImported}
      />

      <div className="dashboard-grid">
        <SessionList sessions={sessions} />
        <div className="card research-card">
          <h3>Field research checklist</h3>
          <p className="muted">Guide interviews with Kathmandu Valley athletes & coaches.</p>
          <ul>
            <li>Document current logging habits (WhatsApp, notebooks, whiteboards).</li>
            <li>Identify bottlenecks in measuring sparring quality, fatigue, and recovery.</li>
            <li>Rank digital signals with coaches: intensity, injuries, readiness, workload.</li>
            <li>Compare app usability vs. global trackers (WHOOP, Strava, TrainHeroic).</li>
            <li>Capture needs for video uploads + AI notes for movement feedback.</li>
            <li>Log recommendations for expanding to boxing, Muay Thai, and wrestling clubs.</li>
          </ul>
          <p className="muted small">
            Tip: tag every interview or gym visit under <strong>focus areas</strong> to see how quickly the community profile evolves.
          </p>
        </div>
      </div>
    </main>
  );
};

export default App;
