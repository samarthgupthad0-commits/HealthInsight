import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h3>HealthInsight</h3>
          <p>Smart medication recommendations powered by AI and medical expertise.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className="footer-column">
          <h3>Product</h3>
          <ul className="footer-links">
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Integrations</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        &copy; 2023 HealthInsight. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;