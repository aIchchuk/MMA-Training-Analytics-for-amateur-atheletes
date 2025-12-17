import dayjs from 'dayjs';

const SessionList = ({ sessions }) => {
  if (!sessions?.length) {
    return (
      <div className="card">
        <h3>Recent sessions</h3>
        <p className="muted">No sessions logged yet. Add training to see trends.</p>
      </div>
    );
  }

  return (
    <div className="card session-list">
      <div className="list-header">
        <h3>Recent sessions</h3>
        <span>{sessions.length} entries</span>
      </div>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            <div>
              <strong>{session.sessionType}</strong>
              <span>{dayjs(session.date).format('MMM D, YYYY')}</span>
            </div>
            <div>
              <span>Intensity {session.intensity ?? '-'}</span>
              <span>Fatigue {session.fatigue ?? '-'}</span>
              <span>Minutes {session.durationMinutes ?? '-'}</span>
            </div>
            {session.focusAreas?.length ? <p>{session.focusAreas.join(', ')}</p> : null}
            {session.rounds?.length ? (
              <details>
                <summary>{session.rounds.length} round notes</summary>
                <ul className="round-summary">
                  {session.rounds.map((round, idx) => (
                    <li key={idx}>
                      R{round.roundNumber}: control {round.perceivedControl}/10, damage {round.damageTaken}/10, partner {round.partnerName || 'n/a'}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;

