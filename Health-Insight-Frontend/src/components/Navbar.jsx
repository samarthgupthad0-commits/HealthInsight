import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenLogin, onOpenSignup }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSignup = () => {
    if (onOpenSignup) {
      onOpenSignup();
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Do you want to logout?')) {
      logout();
      navigate('/');
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
        <a href="/#features">Features</a>
        <a href="/#how-it-works">How It Works</a>
        <a href="/#testimonials">Testimonials</a>
      </div>
      <Link to="/medication-finder" className="nav-link">
        Medication Finder
      </Link>
      <Link to="/history" className="nav-link">
        History
      </Link>
      <div className="auth-buttons">
        {user ? (
          <>
            <Link to="/profile" className="btn btn-primary">
              <i className="fas fa-user"></i> {user.fullName}
            </Link>
            <button className="btn btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={handleLogin}>
              Sign in
            </button>
            <button className="btn btn-primary" onClick={handleSignup}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;