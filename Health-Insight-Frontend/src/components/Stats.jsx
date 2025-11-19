import React, { useEffect, useRef } from 'react';

const Stats = () => {
  const statsRef = useRef(null);
  const animatedRef = useRef(false);

  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const finalValue = parseInt(stat.textContent);
      let currentValue = 0;
      const increment = finalValue / 50;
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          stat.textContent = finalValue + (stat.textContent.includes('%') ? '%' : '+');
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(currentValue) + (stat.textContent.includes('%') ? '%' : '+');
        }
      }, 30);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedRef.current) {
          animateStats();
          animatedRef.current = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <section className="stats-section" ref={statsRef}>
      <div className="section-title">
        <h2>Trusted by Thousands</h2>
        <p>Join our growing community of health-conscious individuals</p>
      </div>
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Medications Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">98%</div>
          <div className="stat-label">User Satisfaction</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support Available</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;