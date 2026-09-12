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
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    
    // Medical Information
    height: '',
    weight: '',
    bloodPressure: '',
    medicalConditions: '',
    currentMedications: '',
    allergies: '',
    surgeries: '',
    familyHistory: '',
    
    // Lifestyle Information
    smoking: '',
    alcohol: '',
    exercise: '',
    diet: '',
    sleepHours: ''
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
      gender: user.gender || '',
      bloodGroup: user.bloodGroup || '',
      emergencyContact: user.emergencyContact || '',
      emergencyPhone: user.emergencyPhone || '',
      address: user.address || '',
      height: user.height || '',
      weight: user.weight || '',
      bloodPressure: user.bloodPressure || '',
      medicalConditions: user.medicalConditions || '',
      currentMedications: user.currentMedications || '',
      allergies: user.allergies || '',
      surgeries: user.surgeries || '',
      familyHistory: user.familyHistory || '',
      smoking: user.smoking || '',
      alcohol: user.alcohol || '',
      exercise: user.exercise || '',
      diet: user.diet || '',
      sleepHours: user.sleepHours || ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('healthinsight_token');
      
      if (!token) {
        alert('Please login again to update your profile.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Update user data in context and localStorage
        updateUser(data.user);
        localStorage.setItem('healthinsight_user', JSON.stringify(data.user));
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      bloodGroup: user.bloodGroup || '',
      emergencyContact: user.emergencyContact || '',
      emergencyPhone: user.emergencyPhone || '',
      address: user.address || '',
      height: user.height || '',
      weight: user.weight || '',
      bloodPressure: user.bloodPressure || '',
      medicalConditions: user.medicalConditions || '',
      currentMedications: user.currentMedications || '',
      allergies: user.allergies || '',
      surgeries: user.surgeries || '',
      familyHistory: user.familyHistory || '',
      smoking: user.smoking || '',
      alcohol: user.alcohol || '',
      exercise: user.exercise || '',
      diet: user.diet || '',
      sleepHours: user.sleepHours || ''
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
                <div className="profile-info-label">Last Updated:</div>
                <div className="profile-info-value">
                  {new Date(user.updatedAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              {user.bloodGroup && (
                <div className="profile-info-item">
                  <div className="profile-info-label">Blood Group:</div>
                  <div className="profile-info-value">{user.bloodGroup}</div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <h3>Quick Actions</h3>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', marginBottom: '0.5rem' }}
                onClick={() => navigate('/medication-finder')}
              >
                <i className="fas fa-search"></i> Find Medications
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', marginBottom: '0.5rem' }}
                onClick={() => navigate('/history')}
              >
                <i className="fas fa-history"></i> Consultation History
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                <i className="fas fa-prescription"></i> Medication List
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%' }}
              >
                <i className="fas fa-file-medical"></i> Medical Reports
              </button>
            </div>

            {user.emergencyContact && (
              <div className="profile-section">
                <h3>Emergency Contact</h3>
                <div className="profile-info-item">
                  <div className="profile-info-label">Contact:</div>
                  <div className="profile-info-value">{user.emergencyContact}</div>
                </div>
                <div className="profile-info-item">
                  <div className="profile-info-label">Phone:</div>
                  <div className="profile-info-value">{user.emergencyPhone}</div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-main">
            {/* Personal Information Section */}
            <div className="profile-section">
              <h3><i className="fas fa-user-circle"></i> Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  ) : (
                    <div className="profile-info-value">{user.fullName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
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
                      placeholder="+1 (555) 123-4567"
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
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      className="form-control"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      className="form-control"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.bloodGroup || 'Not provided'}
                    </div>
                  )}
                </div>
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
                    placeholder="Enter your complete address"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.address || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="profile-section">
              <h3><i className="fas fa-phone-emergency"></i> Emergency Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact"
                      className="form-control"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Name of emergency contact"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.emergencyContact || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Emergency Contact Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyPhone"
                      className="form-control"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone number"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.emergencyPhone || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vital Statistics Section */}
            <div className="profile-section">
              <h3><i className="fas fa-heartbeat"></i> Vital Statistics</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Height</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="height"
                      className="form-control"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="e.g., 5'9\ or 175 cm"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.height || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Weight</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="weight"
                      className="form-control"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 70 kg or 154 lbs"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.weight || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Blood Pressure</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bloodPressure"
                      className="form-control"
                      value={formData.bloodPressure}
                      onChange={handleInputChange}
                      placeholder="e.g., 120/80 mmHg"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.bloodPressure || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="profile-section">
              <h3><i className="fas fa-file-medical"></i> Medical History</h3>
              
              <div className="form-group">
                <label>Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    name="medicalConditions"
                    className="form-control"
                    rows="3"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    placeholder="List any chronic or current medical conditions (e.g., Diabetes, Hypertension, Asthma)"
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
                    placeholder="List all current medications with dosages"
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
                    placeholder="List any drug, food, or environmental allergies"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.allergies || 'None specified'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Previous Surgeries</label>
                {isEditing ? (
                  <textarea
                    name="surgeries"
                    className="form-control"
                    rows="2"
                    value={formData.surgeries}
                    onChange={handleInputChange}
                    placeholder="List any previous surgeries with dates"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.surgeries || 'None specified'}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Family Medical History</label>
                {isEditing ? (
                  <textarea
                    name="familyHistory"
                    className="form-control"
                    rows="2"
                    value={formData.familyHistory}
                    onChange={handleInputChange}
                    placeholder="List significant family medical history"
                  />
                ) : (
                  <div className="profile-info-value">
                    {user.familyHistory || 'None specified'}
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle Information Section */}
            <div className="profile-section">
              <h3><i className="fas fa-running"></i> Lifestyle Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Smoking</label>
                  {isEditing ? (
                    <select
                      name="smoking"
                      className="form-control"
                      value={formData.smoking}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="never">Never</option>
                      <option value="former">Former Smoker</option>
                      <option value="current">Current Smoker</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.smoking ? user.smoking.charAt(0).toUpperCase() + user.smoking.slice(1) : 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Alcohol Consumption</label>
                  {isEditing ? (
                    <select
                      name="alcohol"
                      className="form-control"
                      value={formData.alcohol}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="never">Never</option>
                      <option value="occasional">Occasional</option>
                      <option value="regular">Regular</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.alcohol ? user.alcohol.charAt(0).toUpperCase() + user.alcohol.slice(1) : 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Exercise Frequency</label>
                  {isEditing ? (
                    <select
                      name="exercise"
                      className="form-control"
                      value={formData.exercise}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light (1-2 times/week)</option>
                      <option value="moderate">Moderate (3-4 times/week)</option>
                      <option value="active">Active (5+ times/week)</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.exercise ? user.exercise.charAt(0).toUpperCase() + user.exercise.slice(1) : 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Diet Type</label>
                  {isEditing ? (
                    <select
                      name="diet"
                      className="form-control"
                      value={formData.diet}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="omnivore">Omnivore</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="pescatarian">Pescatarian</option>
                      <option value="keto">Keto</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">
                      {user.diet ? user.diet.charAt(0).toUpperCase() + user.diet.slice(1) : 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Average Sleep (hours)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="sleepHours"
                      className="form-control"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      min="0"
                      max="24"
                      placeholder="e.g., 7"
                    />
                  ) : (
                    <div className="profile-info-value">
                      {user.sleepHours ? `${user.sleepHours} hours/night` : 'Not specified'}
                    </div>
                  )}
                </div>
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