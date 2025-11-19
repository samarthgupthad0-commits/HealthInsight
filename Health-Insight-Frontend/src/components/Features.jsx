import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-user-md',
      title: 'Doctor-Approved',
      description: 'All recommendations are based on established medical guidelines and verified by healthcare professionals.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Safety First',
      description: 'We check for potential drug interactions and contraindications based on your health profile.'
    },
    {
      icon: 'fas fa-database',
      title: 'Comprehensive Database',
      description: 'Access information on thousands of medications from trusted sources like Drugs.com and FDA.'
    }
  ];

  return (
    <section className="features" id="features">
      <div className="section-title">
        <h2>Why Choose HealthInsight</h2>
        <p>Our platform combines medical expertise with advanced technology to deliver reliable recommendations</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <i className={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;