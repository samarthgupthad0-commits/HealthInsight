import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    medicalConditions: '',
    currentMedications: '',
    allergies: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Initialize form data with user data
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      medicalConditions: user.medicalConditions || '',
      currentMedications: user.currentMedications || '',
      allergies: user.allergies || ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update user data in context and localStorage
    updateUser({
      ...user,
      ...formData
    });
    
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      medicalConditions: user.medicalConditions || '',
      currentMedications: user.currentMedications || '',
      allergies: user.allergies || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="App">
      <Navbar />
      
      <div className="profile">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <h1>{user.fullName}</h1>
          <p>{user.email}</p>
          
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                style={{ marginRight: '1rem' }}
              >
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleCancel}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="profile-section">
              <h3>Account Overview</h3>
              <div className="profile-info-item">
                <div className="profile-info-label">Member Since:</div>
                <div className="profile-info-value">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <div className="profile-info-item">
                <div className="profile-info-label">Last Login:</div>
                <div className="profile-info-value">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Quick Actions</h3>
              <button className="btn btn-outline" style={{ width: '100%', marginBottom: '0.5rem' }}>
                <i className="fas fa-history"></i> Consultation History
              </button>
              <button className="btn btn-outline" style={{ width: '100%', marginBottom: '0.5rem' }}>
                <i className="fas fa-prescription"></i> Medication List
              </button>
              <button className="btn btn-outline" style={{ width: '100%' }}>
                <i className="fas fa-bell"></i> Notifications
              </button>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="profile-info-value">{user.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="profile-info-value">{user.email}</div>
                )}
              </div>

              <div className="form-group">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.phone || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.dateOfBirth || 'Not provided'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.address || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h3>Medical Information</h3>
              <div className="form-group">
                <label>Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    name="medicalConditions"
                    className="form-control"
                    rows="3"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    placeholder="List any medical conditions you have"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.medicalConditions || 'None specified'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Current Medications</label>
                {isEditing ? (
                  <textarea
                    name="currentMedications"
                    className="form-control"
                    rows="3"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="List your current medications"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.currentMedications || 'None specified'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Allergies</label>
                {isEditing ? (
                  <textarea
                    name="allergies"
                    className="form-control"
                    rows="3"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies you have"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.allergies || 'None specified'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;