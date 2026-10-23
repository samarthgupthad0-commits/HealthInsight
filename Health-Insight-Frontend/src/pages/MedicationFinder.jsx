import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { consultationAPI } from '../services/api';

const MedicationFinder = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Symptoms section
    primarySymptom: '',
    additionalSymptoms: [],
    symptomDuration: '',
    symptomSeverity: '',
    
    // Health history section
    age: '',
    gender: '',
    conditions: [],
    currentMeds: '',
    allergies: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [medicationResults, setMedicationResults] = useState([]);

  const formSections = [
    {
      id: 'symptoms',
      title: 'What symptoms are you experiencing?',
      icon: 'fas fa-thermometer-half'
    },
    {
      id: 'health',
      title: 'Your Health History',
      icon: 'fas fa-medkit'
    },
    {
      id: 'results',
      title: 'Medication Recommendations',
      icon: 'fas fa-pills'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const navigateToSection = (sectionIndex) => {
    setCurrentSection(sectionIndex);
  };

  const validateCurrentSection = () => {
    const currentSectionData = formSections[currentSection];
    
    if (currentSectionData.id === 'symptoms') {
      if (!formData.primarySymptom || !formData.symptomDuration || !formData.symptomSeverity) {
        alert('Please fill out all required fields before proceeding.');
        return false;
      }
    }
    
    if (currentSectionData.id === 'health') {
      if (!formData.age || !formData.gender) {
        alert('Please fill out all required fields before proceeding.');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      navigateToSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    navigateToSection(currentSection - 1);
  };

  const handleSearch = async () => {
    if (validateCurrentSection()) {
      setIsLoading(true);
      navigateToSection(2);
      
      // Simulate recommendation retrieval
      setTimeout(async () => {
        const results = getMedicationsForSymptoms(
          formData.primarySymptom, 
          formData.additionalSymptoms, 
          formData.conditions
        );
        setMedicationResults(results);

        // Save to local storage for immediate/offline access
        const savedHistory = JSON.parse(localStorage.getItem('healthinsight_history') || '[]');
        const newEntry = {
          id: Date.now(),
          symptom: formData.primarySymptom,
          medications: results.map(result => result.name),
          createdAt: new Date().toISOString()
        };
        savedHistory.unshift(newEntry);
        localStorage.setItem('healthinsight_history', JSON.stringify(savedHistory.slice(0, 20)));

        // If authenticated, sync with backend database
        const authToken = token || localStorage.getItem('healthinsight_token');
        if (authToken) {
          try {
            await consultationAPI.saveConsultation({
              primarySymptom: formData.primarySymptom,
              additionalSymptoms: formData.additionalSymptoms,
              symptomDuration: formData.symptomDuration,
              symptomSeverity: formData.symptomSeverity,
              age: formData.age,
              gender: formData.gender,
              conditions: formData.conditions,
              currentMeds: formData.currentMeds,
              allergies: formData.allergies,
              medications: results
            }, authToken);
          } catch (err) {
            console.error('Failed to sync consultation with backend:', err);
          }
        }

        setIsLoading(false);
      }, 1500);
    }
  };

  const handleNewSearch = () => {
    setFormData({
      primarySymptom: '',
      additionalSymptoms: [],
      symptomDuration: '',
      symptomSeverity: '',
      age: '',
      gender: '',
      conditions: [],
      currentMeds: '',
      allergies: ''
    });
    setMedicationResults([]);
    navigateToSection(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPrintableCopy = () => {
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
    const details = medicationResults.length
      ? medicationResults.map((medication) => `
        <article class="medication">
          <h2>${escapeHtml(medication.name)}</h2>
          <p><strong>Type:</strong> ${escapeHtml(medication.type)}</p>
          <p><strong>Purpose:</strong> ${escapeHtml(medication.purpose)}</p>
          <p><strong>Dosage:</strong> ${escapeHtml(medication.dosage)}</p>
          <p><strong>Side effects:</strong> ${escapeHtml(medication.sideEffects.join(', '))}</p>
          ${medication.interactions?.length ? `<p><strong>Interactions:</strong> ${escapeHtml(medication.interactions.join(', '))}</p>` : ''}
          ${medication.warnings?.length ? `<p><strong>Warnings:</strong> ${escapeHtml(medication.warnings.join(' '))}</p>` : ''}
          <p><strong>More information:</strong> <a href="${escapeHtml(medication.link)}">${escapeHtml(medication.link)}</a></p>
        </article>
      `).join('')
      : '<p>No specific medication recommendations were found. Consider consulting a healthcare provider for personalized advice.</p>';
    const report = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>HealthInsight Medication Recommendations</title>
          <style>
            body { max-width: 800px; margin: 40px auto; padding: 0 24px; color: #222; font: 16px/1.5 Arial, sans-serif; }
            h1 { color: #064f8c; }
            .medication { margin: 24px 0; padding: 16px; border: 1px solid #bbb; break-inside: avoid; }
            .disclaimer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #bbb; }
            @media print { body { margin: 0 auto; } }
          </style>
        </head>
        <body>
          <h1>HealthInsight Medication Recommendations</h1>
          <p><strong>Symptom:</strong> ${escapeHtml(formData.primarySymptom || 'Not specified')}</p>
          <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
          ${details}
          <section class="disclaimer">
            <p><strong>Disclaimer:</strong> These recommendations are for informational purposes only and do not constitute medical advice. Consult a qualified healthcare provider before starting any medication.</p>
            <p>Recommendations are simulated for demonstration purposes.</p>
          </section>
        </body>
      </html>`;
    const file = new Blob([report], { type: 'text/html;charset=utf-8' });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `HealthInsight-Recommendations-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  };

  const getMedicationsForSymptoms = (primarySymptom, additionalSymptoms, conditions) => {
    const medicationBySymptom = {
      headache: {
        name: 'Acetaminophen (Tylenol)',
        purpose: 'Pain relief and fever reduction',
        dosage: '500-1000mg every 4-6 hours as needed (max 4000mg/day)',
        sideEffects: ['Liver damage if overdosed', 'Allergic reactions'],
        warnings: conditions.includes('liver disease') ? ['Not recommended for people with liver disease'] : [],
        interactions: ['Alcohol', 'Warfarin'],
        link: 'https://www.drugs.com/acetaminophen.html'
      },
      fever: {
        name: 'Acetaminophen (Tylenol)',
        purpose: 'Fever reduction and relief of minor aches',
        dosage: '500-1000mg every 4-6 hours as needed (max 4000mg/day)',
        sideEffects: ['Liver damage if overdosed', 'Allergic reactions'],
        warnings: conditions.includes('liver disease') ? ['Not recommended for people with liver disease'] : [],
        interactions: ['Alcohol', 'Warfarin'],
        link: 'https://www.drugs.com/acetaminophen.html'
      },
      cough: {
        name: 'Dextromethorphan',
        purpose: 'Temporary relief of cough',
        dosage: 'Follow the product label and do not exceed the recommended dose',
        sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
        warnings: [],
        interactions: ['MAO inhibitors', 'Some antidepressants'],
        link: 'https://www.drugs.com/dextromethorphan.html'
      },
      'sore throat': {
        name: 'Benzocaine Lozenges',
        purpose: 'Temporary relief of minor sore throat pain',
        dosage: 'Use as directed on the product label',
        sideEffects: ['Mouth irritation', 'Allergic reactions'],
        warnings: [],
        interactions: [],
        link: 'https://www.drugs.com/mtm/benzocaine-oral.html'
      },
      'nasal congestion': {
        name: 'Pseudoephedrine',
        purpose: 'Temporary relief of nasal congestion',
        dosage: 'Follow the product label and do not exceed the recommended dose',
        sideEffects: ['Nervousness', 'Insomnia', 'Increased blood pressure'],
        warnings: conditions.includes('high blood pressure') ? ['Ask a healthcare provider before use because it may raise blood pressure'] : [],
        interactions: ['MAO inhibitors'],
        link: 'https://www.drugs.com/pseudoephedrine.html'
      },
      'body aches': {
        name: 'Ibuprofen (Advil, Motrin)',
        purpose: 'Temporary relief of minor muscle and body aches',
        dosage: '200-400mg every 4-6 hours as needed; follow the product label',
        sideEffects: ['Stomach upset', 'Heartburn', 'Allergic reactions'],
        warnings: conditions.includes('kidney disease') || conditions.includes('heart disease') ? ['Ask a healthcare provider before use because of your health history'] : [],
        interactions: ['Blood thinners', 'Aspirin'],
        link: 'https://www.drugs.com/ibuprofen.html'
      },
      heartburn: {
        name: 'Calcium Carbonate (Tums)',
        purpose: 'Relief of occasional heartburn and acid indigestion',
        dosage: 'Chew tablets as directed on the product label',
        sideEffects: ['Constipation', 'Stomach discomfort'],
        warnings: conditions.includes('kidney disease') ? ['Ask a healthcare provider before use because of your kidney disease'] : [],
        interactions: ['Some antibiotics', 'Iron supplements'],
        link: 'https://www.drugs.com/mtm/calcium-carbonate.html'
      },
      diarrhea: {
        name: 'Loperamide (Imodium)',
        purpose: 'Control of occasional diarrhea',
        dosage: 'Follow the product label and do not exceed the recommended dose',
        sideEffects: ['Constipation', 'Stomach cramps', 'Dizziness'],
        warnings: [],
        interactions: [],
        link: 'https://www.drugs.com/loperamide.html'
      },
      constipation: {
        name: 'Polyethylene Glycol 3350 (MiraLAX)',
        purpose: 'Relief of occasional constipation',
        dosage: 'Dissolve the label-directed dose in a beverage once daily',
        sideEffects: ['Bloating', 'Gas', 'Stomach cramps'],
        warnings: [],
        interactions: [],
        link: 'https://www.drugs.com/mtm/polyethylene-glycol-3350.html'
      },
      rash: {
        name: 'Hydrocortisone 1% Cream',
        purpose: 'Temporary relief of minor skin irritation and itching',
        dosage: 'Apply a thin layer as directed on the product label',
        sideEffects: ['Skin irritation', 'Dryness'],
        warnings: [],
        interactions: [],
        link: 'https://www.drugs.com/mtm/hydrocortisone-topical.html'
      }
    };

    const medication = medicationBySymptom[primarySymptom];
    if (!medication) {
      return [];
    }

    return [{
      ...medication,
      type: 'Over-the-counter'
    }];
  };

  return (
    <div className="medication-finder">
      <header>
        <div className="header-content">
          <div className="logo">
            <div>
              <h1>HealthInsight</h1>
              <p className="tagline">Smart medication recommendations powered by Drugs.com</p>
            </div>
          </div>
          <button 
            className="profile-btn" 
            onClick={() => navigate('/profile')}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </button>
        </div>
      </header>

      <main className="container">
        <div className="progress-bar">
          {formSections.map((section, index) => (
            <div 
              key={section.id}
              className={`progress-step ${index === currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}
              data-step={index + 1}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{section.title.split(' ')[0]}</div>
            </div>
          ))}
        </div>
        
        {/* Symptoms Section */}
        {currentSection === 0 && (
          <div className="form-section active">
            <h2><i className="fas fa-thermometer-half"></i> What symptoms are you experiencing?</h2>
            
            <div className="form-group">
              <label>Primary Symptom</label>
              <select 
                className="form-control" 
                value={formData.primarySymptom}
                onChange={(e) => handleInputChange('primarySymptom', e.target.value)}
                required
              >
                <option value="">Select your main symptom</option>
                <option value="headache">Headache</option>
                <option value="fever">Fever</option>
                <option value="cough">Cough</option>
                <option value="sore throat">Sore Throat</option>
                <option value="nasal congestion">Nasal Congestion</option>
                <option value="body aches">Body Aches</option>
                <option value="heartburn">Heartburn</option>
                <option value="diarrhea">Diarrhea</option>
                <option value="constipation">Constipation</option>
                <option value="rash">Skin Rash</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Additional Symptoms (select all that apply)</label>
              <div className="checkbox-group">
                {['Cold', 'Chills', 'Fatigue', 'Nausea', 'Dizziness', 'Sneezing'].map(symptom => (
                  <label key={symptom} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      value={symptom.toLowerCase()}
                      checked={formData.additionalSymptoms.includes(symptom.toLowerCase())}
                      onChange={(e) => handleCheckboxChange('additionalSymptoms', symptom.toLowerCase(), e.target.checked)}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>How long have you had these symptoms?</label>
              <select 
                className="form-control" 
                value={formData.symptomDuration}
                onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
                required
              >
                <option value="">Select duration</option>
                <option value="less than 24 hours">Less than 24 hours</option>
                <option value="1-3 days">1-3 days</option>
                <option value="4-7 days">4-7 days</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="over 2 weeks">Over 2 weeks</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Symptom Severity</label>
              <select 
                className="form-control" 
                value={formData.symptomSeverity}
                onChange={(e) => handleInputChange('symptomSeverity', e.target.value)}
                required
              >
                <option value="">Select severity</option>
                <option value="mild">Mild - Annoying but doesn't interfere with daily activities</option>
                <option value="moderate">Moderate - Limits some daily activities</option>
                <option value="severe">Severe - Prevents most daily activities</option>
              </select>
            </div>
            
            <div className="btn-group">
              <button type="button" className="btn btn-outline" disabled>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Health History Section */}
        {currentSection === 1 && (
          <div className="form-section active">
            <h2><i className="fas fa-medkit"></i> Your Health History</h2>
            
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="1" 
                max="120" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select 
                className="form-control" 
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other/Prefer not to say</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Do you have any of these medical conditions? (select all that apply)</label>
              <div className="checkbox-group">
                {[
                  'High Blood Pressure', 'Diabetes', 'Heart Disease', 
                  'Liver Disease', 'Kidney Disease', 'Asthma', 
                  'Pregnant or Breastfeeding', 'None of the above'
                ].map(condition => (
                  <label key={condition} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      value={condition.toLowerCase()}
                      checked={formData.conditions.includes(condition.toLowerCase())}
                      onChange={(e) => handleCheckboxChange('conditions', condition.toLowerCase(), e.target.checked)}
                    />
                    {condition}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Are you currently taking any medications? (please list)</label>
              <textarea 
                className="form-control" 
                value={formData.currentMeds}
                onChange={(e) => handleInputChange('currentMeds', e.target.value)}
                rows="3" 
                placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily"
              />
            </div>
            
            <div className="form-group">
              <label>Do you have any known allergies to medications?</label>
              <textarea 
                className="form-control" 
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                rows="2" 
                placeholder="e.g., Penicillin causes rash"
              />
            </div>
            
            <div className="btn-group">
              <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSearch}>
                <i className="fas fa-search"></i> Search Medications
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentSection === 2 && (
          <div className="form-section active">
            <h2><i className="fas fa-pills"></i> Medication Recommendations</h2>
            
            {isLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Searching for medication recommendations based on your symptoms...</p>
              </div>
            )}
            
            {!isLoading && (
              <div className="results-container">
                <div id="medicationResults">
                  {medicationResults.length === 0 ? (
                    <div className="medication-card">
                      <h3 className="medication-name">No specific medications found</h3>
                      <div className="medication-details">
                        <p>Based on your symptoms and health history, we couldn't find specific medication recommendations.</p>
                        <p>Consider consulting with a healthcare provider for personalized advice.</p>
                      </div>
                    </div>
                  ) : (
                    medicationResults.map((med, index) => (
                      <div key={index} className="medication-card">
                        <div className="medication-header">
                          <h3 className="medication-name">{med.name}</h3>
                          <span className="medication-type">{med.type}</span>
                        </div>
                        <div className="medication-details">
                          <div className="detail-row">
                            <div className="detail-label">Purpose:</div>
                            <div className="detail-value">{med.purpose}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Dosage:</div>
                            <div className="detail-value">{med.dosage}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Side Effects:</div>
                            <div className="detail-value">{med.sideEffects.join(', ')}</div>
                          </div>
                          {med.interactions && med.interactions.length > 0 && (
                            <div className="detail-row">
                              <div className="detail-label">Interactions:</div>
                              <div className="detail-value">{med.interactions.join(', ')}</div>
                            </div>
                          )}
                          <div className="detail-row">
                            <div className="detail-label">More Info:</div>
                            <div className="detail-value">
                              <a href={med.link} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)'}}>
                                View on Drugs.com
                              </a>
                            </div>
                          </div>
                        </div>
                        {med.warnings && med.warnings.length > 0 && (
                          <div className="medication-details warning">
                            Warnings: {med.warnings.join(' ')}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  {/* Demo Note */}
                  <div className="medication-card">
                    <h3 className="medication-name"><i className="fas fa-info-circle"></i> Note About This Demo</h3>
                    <div className="medication-details">
                      <p>In a real implementation, this section would display actual medication data from Drugs.com's API based on your symptoms and health history. The results above are simulated for demonstration purposes.</p>
                    </div>
                  </div>
                </div>
                
                <div className="disclaimer">
                  <p><strong>Disclaimer:</strong> These medication recommendations are provided for informational purposes only and do not constitute medical advice. Always consult with a qualified healthcare provider before starting any new medication.</p>
                  <p>Results are powered by Drugs.com's database and are not endorsed by HealthInsight.</p>
                </div>
              </div>
            )}
            
            <div className="btn-group">
              <button type="button" className="btn btn-outline" onClick={handlePrevious}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button type="button" className="btn btn-primary" onClick={handleNewSearch}>
                <i className="fas fa-redo"></i> New Search
              </button>
              <button type="button" className="btn btn-primary" onClick={handlePrint}>
                Print Recommendations
              </button>
              <button type="button" className="btn btn-outline" onClick={handleDownloadPrintableCopy}>
                Download Printable Copy
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer>
        <div className="container">
          <p>HealthInsight &copy; 2025 | This tool is for educational purposes only | Powered by Drugs.com API</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicationFinder;