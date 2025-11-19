document.addEventListener('DOMContentLoaded', function() {
            
            const formSections = document.querySelectorAll('.form-section');
            const progressSteps = document.querySelectorAll('.progress-step');
            const nextButtons = document.querySelectorAll('.next-btn');
            const prevButtons = document.querySelectorAll('.prev-btn');
            const searchButton = document.getElementById('search-btn');
            const newSearchButton = document.getElementById('new-search-btn');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const resultsContainer = document.getElementById('resultsContainer');
            const medicationResults = document.getElementById('medicationResults');
            const printButton = document.getElementById('print-btn');
            
            let currentSection = 0;
            
         
            nextButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if(validateSection(currentSection)) {
                        navigateToSection(currentSection + 1);
                    }
                });
            });
            
          
            prevButtons.forEach(button => {
                button.addEventListener('click', function() {
                    navigateToSection(currentSection - 1);
                });
            });
            
           
            searchButton.addEventListener('click', function() {
                if (validateSection(currentSection)) {
                    navigateToSection(currentSection + 1);
                    searchDrugsCom();
                }
            });
            
      
            newSearchButton.addEventListener('click', function() {
                navigateToSection(0);
                document.getElementById('medicationForm').reset();
                medicationResults.innerHTML = '';
                
                
                progressSteps.forEach(step => {
                    step.classList.remove('completed');
                    if (step.dataset.step === "1") {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            });

        
            printButton.addEventListener('click', function() {
                window.print();
            });
            
           
            function navigateToSection(sectionIndex) {
                formSections[currentSection].classList.remove('active');
                progressSteps[currentSection].classList.remove('active');
                
                currentSection = sectionIndex;
                
                formSections[currentSection].classList.add('active');
                progressSteps[currentSection].classList.add('active');
                
               
                for (let i = 0; i < sectionIndex; i++) {
                    progressSteps[i].classList.add('completed');
                }
            }
            
         
            function validateSection(sectionIndex) {
                const currentSection = formSections[sectionIndex];
                const requiredInputs = currentSection.querySelectorAll('[required]');
                let isValid = true;
                
                requiredInputs.forEach(input => {
                    if (!input.value) {
                        input.style.borderColor = 'var(--danger)';
                        isValid = false;
                        
                        
                        input.addEventListener('input', function() {
                            this.style.borderColor = 'var(--light-gray)';
                        });
                    }
                });
                
                if (!isValid) {
                    alert('Please fill out all required fields before proceeding.');
                }
                
                return isValid;
            }
            
       
            function searchDrugsCom() {
                
                loadingSpinner.style.display = 'block';
                resultsContainer.style.display = 'none';
                
                
                const primarySymptom = document.getElementById('primarySymptom').value;
                const additionalSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(el => el.value);
                const duration = document.getElementById('symptomDuration').value;
                const severity = document.getElementById('symptomSeverity').value;
                const age = document.getElementById('age').value;
                const gender = document.getElementById('gender').value;
                const conditions = Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(el => el.value);
                const currentMeds = document.getElementById('currentMeds').value;
                const allergies = document.getElementById('allergies').value;
                
               
                const searchParams = {
                    primarySymptom: primarySymptom,
                    additionalSymptoms: additionalSymptoms,
                    duration: duration,
                    severity: severity,
                    age: age,
                    gender: gender,
                    conditions: conditions,
                    currentMeds: currentMeds,
                    allergies: allergies
                };
                
                console.log("Search parameters:", searchParams);
                
             
                setTimeout(() => {
                   
                    loadingSpinner.style.display = 'none';
                    resultsContainer.style.display = 'block';
                    
                 
                    displayMedicationResults(searchParams);
                }, 2000);
            }
            
         
            function displayMedicationResults(params) {
                medicationResults.innerHTML = '';
                
              
                const medications = getMedicationsForSymptoms(params.primarySymptom, params.additionalSymptoms, params.conditions);
                
                if (medications.length === 0) {
                    const noResults = document.createElement('div');
                    noResults.className = 'medication-card';
                    noResults.innerHTML = `
                        <h3 class="medication-name">No specific medications found</h3>
                        <div class="medication-details">
                            <p>Based on your symptoms and health history, we couldn't find specific medication recommendations.</p>
                            <p>Consider consulting with a healthcare provider for personalized advice.</p>
                        </div>
                    `;
                    medicationResults.appendChild(noResults);
                    return;
                }
                
          
                medications.forEach(med => {
                    const medCard = document.createElement('div');
                    medCard.className = 'medication-card';
                    
                    let warnings = '';
                    if (med.warnings && med.warnings.length > 0) {
                        warnings = `<div class="medication-details warning">Warnings: ${med.warnings.join(' ')}</div>`;
                    }
                    
                    let interactions = '';
                    if (med.interactions && med.interactions.length > 0) {
                        interactions = `
                            <div class="detail-row">
                                <div class="detail-label">Interactions:</div>
                                <div class="detail-value">${med.interactions.join(', ')}</div>
                            </div>
                        `;
                    }
                    
                    medCard.innerHTML = `
                        <div class="medication-header">
                            <h3 class="medication-name">${med.name}</h3>
                            <span class="medication-type">${med.type}</span>
                        </div>
                        <div class="medication-details">
                            <div class="detail-row">
                                <div class="detail-label">Purpose:</div>
                                <div class="detail-value">${med.purpose}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Dosage:</div>
                                <div class="detail-value">${med.dosage}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Side Effects:</div>
                                <div class="detail-value">${med.sideEffects.join(', ')}</div>
                            </div>
                            ${interactions}
                            <div class="detail-row">
                                <div class="detail-label">More Info:</div>
                                <div class="detail-value"><a href="${med.link}" target="_blank" style="color: var(--primary);">View on Drugs.com</a></div>
                            </div>
                        </div>
                        ${warnings}
                    `;
                    medicationResults.appendChild(medCard);
                });
                
              
                const noteCard = document.createElement('div');
                noteCard.className = 'medication-card';
                noteCard.innerHTML = `
                    <h3 class="medication-name"><i class="fas fa-info-circle"></i> Note About This Demo</h3>
                    <div class="medication-details">
                        <p>In a real implementation, this section would display actual medication data from Drugs.com's API based on your symptoms and health history. The results above are simulated for demonstration purposes.</p>
                        <p>To implement this with Drugs.com's API, you would need to:</p>
                        <ol>
                            <li>Register for a Drugs.com API key</li>
                            <li>Make API calls to their medication database</li>
                            <li>Filter results based on user's health profile</li>
                            <li>Display the returned medication information</li>
                        </ol>
                        <p>Drugs.com provides comprehensive drug information including side effects, interactions, and dosage guidelines :cite[1].</p>
                    </div>
                `;
                medicationResults.appendChild(noteCard);
            }
            
            
            function getMedicationsForSymptoms(primarySymptom, additionalSymptoms, conditions) {
                const allMedications = [];
                

                if (primarySymptom === 'headache') {
                    allMedications.push({
                        name: 'Acetaminophen (Tylenol)',
                        type: 'Over-the-counter',
                        purpose: 'Pain relief and fever reduction',
                        dosage: '500-1000mg every 4-6 hours as needed (max 4000mg/day)',
                        sideEffects: ['Liver damage (if overdosed)', 'Allergic reactions'],
                        warnings: conditions.includes('liver disease') ? ['Not recommended for people with liver disease'] : [],
                        interactions: ['Alcohol', 'Warfarin'],
                        link: 'https://www.drugs.com/acetaminophen.html'
                    });
                    
                    if (!additionalSymptoms.includes('fever') && !conditions.includes('liver disease')) {
                        allMedications.push({
                            name: 'Ibuprofen (Advil, Motrin)',
                            type: 'Over-the-counter',
                            purpose: 'Pain relief, fever reduction, and anti-inflammatory',
                            dosage: '200-400mg every 4-6 hours as needed',
                            sideEffects: ['Stomach upset', 'Increased bleeding risk', 'Kidney problems'],
                            warnings: conditions.includes('kidney disease') ? ['Not recommended for people with kidney disease'] : [],
                            interactions: ['Aspirin', 'Blood pressure medications'],
                            link: 'https://www.drugs.com/ibuprofen.html'
                        });
                    }
                }
                
                if (primarySymptom === 'fever' || additionalSymptoms.includes('fever')) {
                    allMedications.push({
                        name: 'Acetaminophen (Tylenol)',
                        type: 'Over-the-counter',
                        purpose: 'Fever reduction and pain relief',
                        dosage: '500-1000mg every 4-6 hours as needed (max 4000mg/day)',
                        sideEffects: ['Liver damage (if overdosed)', 'Allergic reactions'],
                        warnings: conditions.includes('liver disease') ? ['Not recommended for people with liver disease'] : [],
                        interactions: ['Alcohol', 'Warfarin'],
                        link: 'https://www.drugs.com/acetaminophen.html'
                    });
                    
                    if (!conditions.includes('kidney disease')) {
                        allMedications.push({
                            name: 'Ibuprofen (Advil, Motrin)',
                            type: 'Over-the-counter',
                            purpose: 'Fever reduction and pain relief',
                            dosage: '200-400mg every 6-8 hours as needed',
                            sideEffects: ['Stomach upset', 'Increased bleeding risk', 'Kidney problems'],
                            warnings: [],
                            interactions: ['Aspirin', 'Blood pressure medications'],
                            link: 'https://www.drugs.com/ibuprofen.html'
                        });
                    }
                }
                
                if (primarySymptom === 'cough') {
                    if (additionalSymptoms.includes('nasal congestion')) {
                        allMedications.push({
                            name: 'Dextromethorphan/Guaifenesin (Robitussin DM)',
                            type: 'Over-the-counter',
                            purpose: 'Cough suppression and mucus relief',
                            dosage: '10-20mL every 4 hours as needed',
                            sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
                            warnings: [],
                            interactions: ['MAO inhibitors', 'Other cough medicines'],
                            link: 'https://www.drugs.com/robitussin-dm.html'
                        });
                    } else {
                        allMedications.push({
                            name: 'Dextromethorphan (Delsym)',
                            type: 'Over-the-counter',
                            purpose: 'Cough suppression',
                            dosage: '10-20mg every 4 hours as needed',
                            sideEffects: ['Drowsiness', 'Dizziness'],
                            warnings: [],
                            interactions: ['MAO inhibitors', 'Other cough medicines'],
                            link: 'https://www.drugs.com/dextromethorphan.html'
                        });
                    }
                }
                
                if (primarySymptom === 'sore throat') {
                    allMedications.push({
                        name: 'Benzocaine (Chloraseptic)',
                        type: 'Over-the-counter',
                        purpose: 'Sore throat pain relief',
                        dosage: 'Spray or lozenge as directed every 2 hours',
                        sideEffects: ['Mild stinging', 'Numbness'],
                        warnings: ['Do not use for more than 2 days without consulting doctor'],
                        interactions: [],
                        link: 'https://www.drugs.com/chloraseptic.html'
                    });
                }
                
                if (primarySymptom === 'heartburn') {
                    allMedications.push({
                        name: 'Famotidine (Pepcid)',
                        type: 'Over-the-counter',
                        purpose: 'Heartburn relief',
                        dosage: '10-20mg every 12 hours as needed',
                        sideEffects: ['Headache', 'Constipation', 'Diarrhea'],
                        warnings: [],
                        interactions: ['Atazanavir', 'Dasatinib'],
                        link: 'https://www.drugs.com/famotidine.html'
                    });
                    
                    if (!conditions.includes('kidney disease')) {
                        allMedications.push({
                            name: 'Omeprazole (Prilosec OTC)',
                            type: 'Over-the-counter',
                            purpose: 'Frequent heartburn relief',
                            dosage: '20mg once daily for 14 days',
                            sideEffects: ['Headache', 'Abdominal pain', 'Diarrhea'],
                            warnings: ['Do not use for more than 14 days without consulting doctor'],
                            interactions: ['Clopidogrel', 'Methotrexate'],
                            link: 'https://www.drugs.com/omeprazole.html'
                        });
                    }
                }
                
                if (primarySymptom === 'diarrhea') {
                    allMedications.push({
                        name: 'Loperamide (Imodium)',
                        type: 'Over-the-counter',
                        purpose: 'Diarrhea relief',
                        dosage: '2mg after first loose stool, then 1mg after each subsequent stool (max 8mg/24hr)',
                        sideEffects: ['Constipation', 'Dizziness', 'Drowsiness'],
                        warnings: ['Do not use if you have fever or bloody stools'],
                        interactions: ['Quinidine', 'Ritonavir'],
                        link: 'https://www.drugs.com/loperamide.html'
                    });
                }
                
                if (primarySymptom === 'constipation') {
                    allMedications.push({
                        name: 'Polyethylene Glycol (Miralax)',
                        type: 'Over-the-counter',
                        purpose: 'Constipation relief',
                        dosage: '17g powder in 4-8oz liquid daily',
                        sideEffects: ['Bloating', 'Gas', 'Nausea'],
                        warnings: conditions.includes('pregnant') ? ['Consult doctor before use if pregnant'] : [],
                        interactions: [],
                        link: 'https://www.drugs.com/miralax.html'
                    });
                }
                
                if (primarySymptom === 'rash') {
                    allMedications.push({
                        name: 'Hydrocortisone Cream 1%',
                        type: 'Over-the-counter',
                        purpose: 'Itch and rash relief',
                        dosage: 'Apply thin layer to affected area 1-2 times daily',
                        sideEffects: ['Skin thinning (with prolonged use)', 'Burning sensation'],
                        warnings: ['Do not use on face or genitals unless directed by doctor'],
                        interactions: [],
                        link: 'https://www.drugs.com/hydrocortisone-topical.html'
                    });
                }
                
            
                return allMedications.filter(med => {
                    
                    return true;
                });
            }
            
            // In a real implementation, you would have a function like this to call Drugs.com API:
            /*
            async function callDrugsComAPI(params) {
                const apiKey = 'YOUR_DRUGS_COM_API_KEY';
                const url = `https://api.drugs.com/v1/medications?primarySymptom=${encodeURIComponent(params.primarySymptom)}&conditions=${encodeURIComponent(params.conditions.join(','))}`;
                
                try {
                    const response = await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${apiKey}`
                        }
                    });
                    const data = await response.json();
                    return data.medications || [];
                } catch (error) {
                    console.error('Error calling Drugs.com API:', error);
                    return [];
                }
            }
            */
        });