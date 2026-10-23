import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ onOpenSignup }) => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="floating-element floating-1">
        <i className="fas fa-heartbeat"></i>
      </div>
      <div className="floating-element floating-2">
        <i className="fas fa-stethoscope"></i>
      </div>
      <div className="hero-content">
        <h1>Smart Medication Recommendations Powered by AI</h1>
        <p>HealthInsight analyzes your symptoms and health history to provide personalized medication suggestions from trusted medical sources.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={onOpenSignup}>
            <i className="fas fa-pills"></i> Try It Now
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/learnmore')}>
            <i className="fas fa-info-circle"></i> Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;