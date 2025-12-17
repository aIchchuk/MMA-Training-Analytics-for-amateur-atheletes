import { useState } from 'react';

const defaultSession = {
  sessionType: 'sparring',
  date: '',
  location: '',
  durationMinutes: '',
  intensity: 5,
  fatigue: 5,
  recoveryScore: 6,
  sleepHours: 7,
  readinessScore: 6,
  heartRateAvg: '',
  calories: '',
  focusAreas: '',
  subjectiveNotes: '',
};

const emptyRound = {
  roundNumber: 1,
  durationSeconds: 300,
  partnerName: '',
  focus: '',
  perceivedControl: 5,
  damageTaken: 3,
  notes: '',
  videoUrl: '',
  aiFeedback: '',
};

const sessionTypes = ['sparring', 'drilling', 'conditioning', 'recovery', 'competition'];

const SessionForm = ({ athleteId, onSubmit, disabled }) => {
  const [form, setForm] = useState(defaultSession);
  const [rounds, setRounds] = useState([]);
  const [recoveryNotes, setRecoveryNotes] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoundChange = (idx, field, value) => {
    setRounds((prev) => prev.map((round, i) => (i === idx ? { ...round, [field]: value } : round)));
  };

  const addRound = () => {
    setRounds((prev) => [...prev, { ...emptyRound, roundNumber: prev.length + 1 }]);
  };

  const removeRound = (idx) => {
    setRounds((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!athleteId) return;
    await onSubmit({
      athlete: athleteId,
      sessionType: form.sessionType,
      date: form.date,
      location: form.location || undefined,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
      intensity: Number(form.intensity),
      fatigue: Number(form.fatigue),
      recoveryScore: Number(form.recoveryScore),
      sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
      readinessScore: form.readinessScore ? Number(form.readinessScore) : undefined,
      heartRateAvg: form.heartRateAvg ? Number(form.heartRateAvg) : undefined,
      calories: form.calories ? Number(form.calories) : undefined,
      focusAreas: form.focusAreas ? form.focusAreas.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      subjectiveNotes: form.subjectiveNotes || undefined,
      rounds: rounds.map((round) => ({
        ...round,
        durationSeconds: Number(round.durationSeconds || 0),
        perceivedControl: Number(round.perceivedControl || 0),
        damageTaken: Number(round.damageTaken || 0),
      })),
      recoveryWork: recoveryNotes
        ? [
            {
              modality: 'manual entry',
              durationMinutes: 20,
              qualityScore: form.recoveryScore,
              notes: recoveryNotes,
            },
          ]
        : undefined,
    });
    setForm(defaultSession);
    setRounds([]);
    setRecoveryNotes('');
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>Log training session</h3>
        <p>Track sparring rounds, intensity, fatigue, and recovery touchpoints.</p>
      </div>
      <div className="form-grid">
        <label>
          Session type
          <select name="sessionType" value={form.sessionType} onChange={handleChange}>
            {sessionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date*
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>
          Duration (min)
          <input name="durationMinutes" type="number" min="0" value={form.durationMinutes} onChange={handleChange} />
        </label>
        <label>
          Intensity (1-10)
          <input name="intensity" type="number" min="1" max="10" value={form.intensity} onChange={handleChange} />
        </label>
        <label>
          Fatigue (1-10)
          <input name="fatigue" type="number" min="1" max="10" value={form.fatigue} onChange={handleChange} />
        </label>
        <label>
          Recovery score (1-10)
          <input name="recoveryScore" type="number" min="1" max="10" value={form.recoveryScore} onChange={handleChange} />
        </label>
        <label>
          Sleep hours
          <input name="sleepHours" type="number" min="0" max="24" value={form.sleepHours} onChange={handleChange} />
        </label>
        <label>
          Readiness (1-10)
          <input name="readinessScore" type="number" min="1" max="10" value={form.readinessScore} onChange={handleChange} />
        </label>
        <label>
          Avg heart rate
          <input name="heartRateAvg" type="number" min="0" value={form.heartRateAvg} onChange={handleChange} />
        </label>
        <label>
          Calories burned (kcal)
          <input 
            name="calories" 
            type="number" 
            min="0" 
            value={form.calories} 
            onChange={handleChange}
            placeholder="e.g. 450"
          />
        </label>
        <label>
          Focus tags
          <input name="focusAreas" value={form.focusAreas} onChange={handleChange} placeholder="Breathing, cage control" />
        </label>
        <label className="full-width">
          Session notes
          <textarea name="subjectiveNotes" rows={3} value={form.subjectiveNotes} onChange={handleChange} />
        </label>
      </div>

      <div className="rounds-block">
        <div className="rounds-header">
          <h4>Sparring rounds</h4>
          <button type="button" className="text" onClick={addRound}>
            + Add round
          </button>
        </div>
        {!rounds.length && <p className="muted">Add round-level insights (partner, control, damage, video link).</p>}
        {rounds.map((round, idx) => (
          <div key={round.roundNumber} className="round-card">
            <div className="round-title">
              <strong>Round {round.roundNumber}</strong>
              <button type="button" onClick={() => removeRound(idx)}>
                Remove
              </button>
            </div>
            <div className="round-grid">
              <label>
                Partner
                <input value={round.partnerName} onChange={(e) => handleRoundChange(idx, 'partnerName', e.target.value)} />
              </label>
              <label>
                Focus
                <input value={round.focus} onChange={(e) => handleRoundChange(idx, 'focus', e.target.value)} />
              </label>
              <label>
                Duration (sec)
                <input
                  type="number"
                  min="0"
                  value={round.durationSeconds}
                  onChange={(e) => handleRoundChange(idx, 'durationSeconds', e.target.value)}
                />
              </label>
              <label>
                Control (1-10)
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={round.perceivedControl}
                  onChange={(e) => handleRoundChange(idx, 'perceivedControl', e.target.value)}
                />
              </label>
              <label>
                Damage taken (0-10)
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={round.damageTaken}
                  onChange={(e) => handleRoundChange(idx, 'damageTaken', e.target.value)}
                />
              </label>
              <label>
                Video URL
                <input value={round.videoUrl} onChange={(e) => handleRoundChange(idx, 'videoUrl', e.target.value)} />
              </label>
        <label>
          AI / coach feedback
          <input value={round.aiFeedback} onChange={(e) => handleRoundChange(idx, 'aiFeedback', e.target.value)} />
        </label>
              <label className="full-width">
                Notes
                <textarea value={round.notes} rows={2} onChange={(e) => handleRoundChange(idx, 'notes', e.target.value)} />
              </label>
            </div>
          </div>
        ))}
      </div>

      <label className="full-width recovery-note">
        Recovery notes
        <textarea
          rows={2}
          placeholder="Ice bath, sauna, breathwork, physiotherapy, etc."
          value={recoveryNotes}
          onChange={(e) => setRecoveryNotes(e.target.value)}
        />
      </label>

      <button type="submit" className="primary" disabled={disabled || !athleteId}>
        {!athleteId ? 'Select athlete first' : disabled ? 'Saving...' : 'Log session'}
      </button>
    </form>
  );
};

export default SessionForm;

