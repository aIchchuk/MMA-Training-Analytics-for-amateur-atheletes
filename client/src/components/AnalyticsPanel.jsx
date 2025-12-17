import dayjs from 'dayjs';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatLoadSeries = (loadByDay = {}) =>
  Object.entries(loadByDay)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, load]) => ({ date: dayjs(date).format('MMM D'), load }));

const formatTypeSeries = (sessionTypeCounts = {}) =>
  Object.entries(sessionTypeCounts).map(([label, count]) => ({ label, count }));

const AnalyticsPanel = ({ analytics }) => {
  if (!analytics?.metrics) {
    return (
      <div className="card analytics-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Analytics</h3>
        <p className="muted">Select an athlete to view training analytics and trends.</p>
      </div>
    );
  }

  const { metrics, insights } = analytics;
  const loadSeries = formatLoadSeries(metrics.loadByDay);
  const typeSeries = formatTypeSeries(metrics.sessionTypeCounts);

  return (
    <section className="analytics-grid">
      <div className="card metric-card">
        <div className="card-header">
          <h3>30-day headline metrics</h3>
        </div>
        <div className="metrics-row">
          <div>
            <span className="metric-label">Sessions</span>
            <strong>{metrics.totalSessions}</strong>
          </div>
          <div>
            <span className="metric-label">Training mins</span>
            <strong>{metrics.totalMinutes}</strong>
          </div>
          <div>
            <span className="metric-label">Avg intensity</span>
            <strong>{metrics.averageIntensity}</strong>
          </div>
          <div>
            <span className="metric-label">Avg fatigue</span>
            <strong>{metrics.averageFatigue}</strong>
          </div>
          <div>
            <span className="metric-label">Avg readiness</span>
            <strong>{metrics.averageReadiness}</strong>
          </div>
          <div>
            <span className="metric-label">Recovery score</span>
            <strong>{metrics.recoveryScore}</strong>
          </div>
        </div>
        <div className="chips">
          {metrics.topFocusAreas?.map((item) => (
            <span key={item.label} className="chip">
              {item.label} • {item.count}
            </span>
          ))}
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-header">
          <h4>Daily load (intensity × minutes)</h4>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={loadSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="load" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ fill: '#3b82f6', r: 3 }} 
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <div className="chart-header">
          <h4>Session mix</h4>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={typeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6">
              {typeSeries.map((entry, index) => {
                const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card insights-card">
        <div className="card-header">
          <h3>Performance & recovery insights</h3>
        </div>
        {!insights?.length && <p className="muted">No alerts from recent data. Keep logging sessions.</p>}
        <ul>
          {insights?.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        {!!metrics.redFlags?.length && (
          <div className="red-flag">
            <strong>Red flags / injuries</strong>
            <ul>
              {metrics.redFlags.map((flag, idx) => (
                <li key={`${flag.bodyPart}-${idx}`}>
                  {dayjs(flag.date).format('MMM D')}: {flag.bodyPart} (severity {flag.severity}) {flag.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalyticsPanel;

