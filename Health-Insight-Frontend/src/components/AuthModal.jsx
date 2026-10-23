import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  // Add default values for other fields
  gender: '',
  bloodGroup: '',
  smoking: '',
  alcohol: '',
  exercise: '',
  diet: ''
});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const { login } = useAuth();

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('auth-', '')]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors['auth-email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors['auth-email'] = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors['auth-password'] = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors['auth-password'] = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        newErrors['auth-fullName'] = 'Full name is required';
      }
      if (!formData.confirmPassword) {
        newErrors['auth-confirmPassword'] = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors['auth-confirmPassword'] = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (mode === 'login') {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
      }

      if (response.success) {
        setMessage({
          type: 'success',
          text: mode === 'login' 
            ? `✅ Welcome back, ${response.user.fullName}! Redirecting...`
            : '🎉 Account created successfully! Redirecting...'
        });
        
        login(response.user, response.token);
        
        setTimeout(() => {
          handleClose();
          window.location.href = mode === 'login' ? '/profile' : '/main';
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: response.message
        });
        
        // Set field-specific errors
        if (response.message.includes('email')) {
          setErrors(prev => ({ ...prev, 'auth-email': response.message }));
        }
        if (response.message.includes('password')) {
          setErrors(prev => ({ ...prev, 'auth-password': response.message }));
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please check if the backend server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={handleClose}>&times;</button>
        
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to your HealthInsight account'
              : 'Join HealthInsight to get personalized medication recommendations'
            }
          </p>
        </div>

        {message && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message-global'}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-fullName">Full Name *</label>
              <input
                type="text"
                id="auth-fullName"
                className={`form-control ${errors['auth-fullName'] ? 'error' : ''}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              {errors['auth-fullName'] && (
                <small className="error-message">{errors['auth-fullName']}</small>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address *</label>
            <input
              type="email"
              id="auth-email"
              className={`form-control ${errors['auth-email'] ? 'error' : ''}`}
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors['auth-email'] && (
              <small className="error-message">{errors['auth-email']}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password *</label>
            <input
              type="password"
              id="auth-password"
              className={`form-control ${errors['auth-password'] ? 'error' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {errors['auth-password'] && (
              <small className="error-message">{errors['auth-password']}</small>
            )}
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="auth-confirmPassword"
                className={`form-control ${errors['auth-confirmPassword'] ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              {errors['auth-confirmPassword'] && (
                <small className="error-message">{errors['auth-confirmPassword']}</small>
              )}
            </div>
          )}

          {mode === 'login' && (
            <div className="form-group" style={{ textAlign: 'right' }}>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer' }}
                onClick={() => alert('Password reset link will be sent to your email.')}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {mode === 'login' ? ' Signing In...' : ' Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <div className="form-footer">
            {mode === 'login' ? (
              <>Don't have an account? <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleSwitchMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }} onClick={() => handleSwitchMode('login')}>Sign in</button></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;