import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

const Home = () => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login'
  });

  const openLoginModal = () => {
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const openSignupModal = () => {
    setAuthModal({ isOpen: true, mode: 'signup' });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="App">
      <Navbar onOpenLogin={openLoginModal} onOpenSignup={openSignupModal} />
      <Hero onOpenSignup={openSignupModal} />
      <Stats />
      <Features />
      
      {/* Graphics Section */}
      <section className="graphics-section">
        <div className="section-title">
          <h2>How We Help You</h2>
          <p>Our comprehensive approach ensures you get the right medication information</p>
        </div>
        <div className="graphics-container">
          <div className="graphic-card">
            <div className="graphic-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Symptom Analysis</h3>
            <p>Advanced algorithms analyze your symptoms to identify potential conditions.</p>
          </div>
          <div className="graphic-card">
            <div className="graphic-icon">
              <i className="fas fa-capsules"></i>
            </div>
            <h3>Medication Matching</h3>
            <p>Match your condition with appropriate medications based on efficacy and safety.</p>
          </div>
          <div className="graphic-card">
            <div className="graphic-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Interaction Checker</h3>
            <p>Identify potential drug interactions with your current medications.</p>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      
      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Find the Right Medication?</h2>
        <p>Join thousands of users who trust HealthInsight for personalized medication recommendations</p>
        <button className="btn btn-primary" onClick={openSignupModal}>
          <i className="fas fa-user-plus"></i> Get Started for Free
        </button>
      </section>

      <Footer />
      
      <AuthModal 
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        mode={authModal.mode}
      />
    </div>
  );
};

export default Home;