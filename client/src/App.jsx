import React from 'react'

function App() {
    return (
        <div className="app-container">
            {/* Navigation */}
            <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div className="brand-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    Combat<span className="glow-text">Analytics</span>
                </div>
                <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    <span>DASHBOARD</span>
                    <span>SESSIONS</span>
                    <span>ACADEMY</span>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="hero">
                <div className="badge">KATHMANDU VALLEY • AMATEUR MMA</div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Elevate Your <span className="glow-text">Fight Game</span></h1>
                <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                    The first AI-driven coaching system specifically designed for amateur MMA practitioners in Kathmandu.
                    Analyze your shadow boxing, track your level changes, and secure your guard with biometric precision.
                </p>
                <button className="btn-primary">Start New Analysis</button>
            </main>

            {/* Quick Stats Placeholder */}
            <section style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '10px' }}>GUARD STABILITY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>88%</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Top 5% in Kathmandu</div>
                </div>
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '10px' }}>TAKEDOWN ENTRY</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>420ms</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px', color: 'var(--accent-secondary)' }}>0.5s improvement needed</div>
                </div>
                <div className="glass-panel" style={{ padding: '25px' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '10px' }}>STRIKE VOLUME</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>142</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Last Session Total</div>
                </div>
            </section>
        </div>
    )
}

export default App
