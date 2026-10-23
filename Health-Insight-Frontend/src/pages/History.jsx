import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { consultationAPI } from '../services/api';

const History = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      const authToken = token || localStorage.getItem('healthinsight_token');
      const localHistory = JSON.parse(localStorage.getItem('healthinsight_history') || '[]');

      if (authToken) {
        try {
          const res = await consultationAPI.getConsultations(authToken);
          if (res.success && res.consultations) {
            const mapped = res.consultations.map(c => ({
              id: c._id,
              symptom: c.primarySymptom,
              medications: (c.medications || []).map(m => (typeof m === 'string' ? m : m.name)),
              createdAt: c.createdAt,
              isBackend: true
            }));
            setHistory(mapped);
            localStorage.setItem('healthinsight_history', JSON.stringify(mapped));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not fetch consultations from backend, using local storage:', err);
        }
      }

      setHistory(localHistory);
      setLoading(false);
    };

    fetchHistory();
  }, [user, token, navigate]);

  const handleDelete = async (entryId, isBackend) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) {
      return;
    }

    const authToken = token || localStorage.getItem('healthinsight_token');
    if (isBackend && authToken) {
      try {
        await consultationAPI.deleteConsultation(entryId, authToken);
      } catch (err) {
        console.error('Failed to delete consultation from server:', err);
      }
    }

    const updated = history.filter(item => item.id !== entryId);
    setHistory(updated);
    localStorage.setItem('healthinsight_history', JSON.stringify(updated));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="App">
      <Navbar />
      <main className="profile history-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-history"></i>
          </div>
          <h1>Consultation History</h1>
          <p>Your previous medication recommendation searches</p>
        </div>

        <div className="profile-section history-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
              <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>Loading your history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              <i className="fas fa-notes-medical"></i>
              <h2>No consultation history yet</h2>
              <p>Complete a medication search and your recommendations will appear here.</p>
              <button className="btn btn-primary" onClick={() => navigate('/medication-finder')}>
                <i className="fas fa-search"></i> Find Medications
              </button>
            </div>
          ) : (
            history.map((entry) => (
              <article className="history-item" key={entry.id}>
                <div className="history-item-content">
                  <h2>{entry.symptom}</h2>
                  <p>{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <div className="history-medications">
                  {entry.medications && entry.medications.length > 0 ? (
                    entry.medications.map((medication, idx) => (
                      <span key={idx}>{medication}</span>
                    ))
                  ) : (
                    <span style={{ background: '#f1f1f1', color: '#666' }}>No medications recommended</span>
                  )}
                </div>
                <div className="history-actions">
                  <button 
                    className="history-delete-btn"
                    title="Delete consultation"
                    onClick={() => handleDelete(entry.id, entry.isBackend)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;