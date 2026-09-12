import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setHistory(JSON.parse(localStorage.getItem('healthinsight_history') || '[]'));
  }, [user, navigate]);

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
          {history.length === 0 ? (
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
                <div>
                  <h2>{entry.symptom}</h2>
                  <p>{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <div className="history-medications">
                  {entry.medications.map((medication) => (
                    <span key={medication}>{medication}</span>
                  ))}
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