import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LearnMore = () => {
  return (
    <div className="App">
      <Navbar />
      
      <section className="hero">
        <div className="hero-content">
          <h1>Learn More About HealthInsight</h1>
          <p>Discover how our AI-powered platform revolutionizes medication recommendations</p>
        </div>
      </section>

      <section className="features">
        <div className="section-title">
          <h2>Our Technology</h2>
          <p>Advanced AI algorithms combined with medical expertise</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3>AI-Powered Analysis</h3>
            <p>Our machine learning models analyze symptoms and medical history to provide accurate recommendations.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-database"></i>
            </div>
            <h3>Comprehensive Database</h3>
            <p>Access to thousands of medications, interactions, and medical guidelines from trusted sources.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Safety First</h3>
            <p>Real-time interaction checking and contraindication analysis to ensure your safety.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LearnMore;