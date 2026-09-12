import React from 'react';
import './App.css';

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Medication guidance platform</p>
        <h1>HealthInsight</h1>
        <p className="subtitle">
          Discover safer medication choices with personalized guidance, symptom-aware recommendations,
          and clear health insights.
        </p>
        <div className="actions">
          <button type="button" className="primary-btn">Get Started</button>
          <button type="button" className="secondary-btn">Learn More</button>
        </div>
      </section>
    </main>
  );
}

export default App;