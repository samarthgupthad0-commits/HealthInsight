import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      if (window.confirm('Do you want to logout?')) {
        logout();
        alert('Logged out successfully!');
      }
    } else {
      onOpenLogin();
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="logo-text">HealthInsight</span>
        </Link>
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#about">About</a>
      </div>
      <div className="auth-buttons">
        {user ? (
          <>
            <Link to="/profile" className="btn btn-primary">
              <i className="fas fa-user"></i> {user.fullName}
            </Link>
            <button className="btn btn-outline" onClick={handleAuthClick}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={onOpenLogin}>
              Sign in
            </button>
            <button className="btn btn-primary" onClick={onOpenSignup}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;