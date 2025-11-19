import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Describe Your Symptoms',
      description: 'Tell us about your primary symptoms, duration, and severity to help us understand your condition.'
    },
    {
      number: 2,
      title: 'Share Your Health History',
      description: 'Provide details about your medical conditions, current medications, and allergies for safer recommendations.'
    },
    {
      number: 3,
      title: 'Get Recommendations',
      description: 'Receive personalized medication suggestions with dosage instructions and safety information.'
    }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="section-title">
        <h2>How HealthInsight Works</h2>
        <p>Get personalized medication recommendations in just three simple steps</p>
      </div>
      <div className="steps">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;