let currentStep = 1;
const totalSteps = 5;

document.addEventListener('DOMContentLoaded', () => {
    updateStepUI();

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepUI();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });
});

function updateStepUI() {
    // Manage Video Sidebar Visibility
    const videoSidebar = document.getElementById('videoSidebar');
    const videoIntro = document.getElementById('videoIntro');
    const videoSymptoms = document.getElementById('videoSymptoms');
    const videoFamily = document.getElementById('videoFamily');
    const videoLifestyle = document.getElementById('videoLifestyle');

    if (videoSidebar) {
        // Helper to pause all videos
        const pauseAll = () => {
            if (videoIntro) videoIntro.pause();
            if (videoSymptoms) videoSymptoms.pause();
            if (videoFamily) videoFamily.pause();
            if (videoLifestyle) videoLifestyle.pause();
        };

        // Helper to hide all videos
        const hideAll = () => {
            if (videoIntro) videoIntro.style.display = 'none';
            if (videoSymptoms) videoSymptoms.style.display = 'none';
            if (videoFamily) videoFamily.style.display = 'none';
            if (videoLifestyle) videoLifestyle.style.display = 'none';
        };

        // Step 1 & 2: Show Intro Video
        if (currentStep === 1 || currentStep === 2) {
            videoSidebar.classList.remove('hidden');
            hideAll();
            pauseAll();
            if (videoIntro) {
                videoIntro.style.display = 'block';
                videoIntro.play().catch(() => {});
            }
        } 
        // Step 3: Show Symptoms Video
        else if (currentStep === 3) {
            videoSidebar.classList.remove('hidden');
            hideAll();
            pauseAll();
            if (videoSymptoms) {
                videoSymptoms.style.display = 'block';
                videoSymptoms.play().catch(() => {});
            }
        }
        // Step 4: Show Family Video
        else if (currentStep === 4) {
            videoSidebar.classList.remove('hidden');
            hideAll();
            pauseAll();
            if (videoFamily) {
                videoFamily.style.display = 'block';
                videoFamily.play().catch(() => {});
            }
        } 
        // Step 5: Show Lifestyle Video
        else if (currentStep === 5) {
            videoSidebar.classList.remove('hidden');
            hideAll();
            pauseAll();
            if (videoLifestyle) {
                videoLifestyle.style.display = 'block';
                videoLifestyle.play().catch(() => {});
            }
        }
        // Other Steps: Hide Sidebar
        else {
            videoSidebar.classList.add('hidden');
            pauseAll();
        }
    }

    // Update Form Steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
        }
    });

    // Update Stepper
    document.querySelectorAll('.stepper-item').forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            item.classList.add('active');
        } else if (stepNum < currentStep) {
            item.classList.add('completed');
        }
    });

    // Update Buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const indicator = document.querySelector('.step-indicator-text');

    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }

    if (indicator) {
        indicator.textContent = `${currentStep} of ${totalSteps}`;
    }
}

function validateStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepEl.querySelectorAll('input, select');
    let isValid = true;

    // We only check the first invalid input to show the popup
    for (const input of inputs) {
        if (!input.checkValidity()) {
            isValid = false;
            input.reportValidity();
            break; 
        }
    }

    return isValid;
}

document.getElementById('diagnosisForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Loading State
    const form = document.getElementById('diagnosisForm');
    const loader = document.getElementById('loader');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    
    // Hide the form container/wizard instead of just the form if needed, 
    // but here form.style.display = 'none' hides the whole form tag which contains the wizard.
    form.style.display = 'none';
    loader.style.display = 'block';
    resultsDiv.style.display = 'none';
    
    // Collect Data
    const formData = new FormData(form);
    const data = {
        age: formData.get('age'),
        gender: formData.get('gender'),
        weight: formData.get('weight'),
        height: formData.get('height'),
        systolicBP: formData.get('systolicBP'),
        diastolicBP: formData.get('diastolicBP'),
        heartRate: formData.get('heartRate'),
        bodyTemp: formData.get('bodyTemp'),
        glucose: formData.get('glucose'),
        cholesterol: formData.get('cholesterol'),
        hemoglobin: formData.get('hemoglobin'),
        wbc: formData.get('wbc'),
        platelet: formData.get('platelet'),
        symptoms: [],
        familyHistory: [],
        lifestyle: []
    };
    
    // Collect Checkboxes
    form.querySelectorAll('input[name="symptoms"]:checked').forEach(el => data.symptoms.push(el.value));
    form.querySelectorAll('input[name="familyHistory"]:checked').forEach(el => data.familyHistory.push(el.value));
    form.querySelectorAll('input[name="lifestyle"]:checked').forEach(el => data.lifestyle.push(el.value));
    
    try {
        const res = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        loader.style.display = 'none';
        
        if (result.success && result.predictions.length > 0) {
            // Save results to localStorage for Consultation page
            localStorage.setItem('latestDiagnosis', JSON.stringify(result.predictions));
            
            resultsDiv.style.display = 'block';
            
            // Show Results Video
            const videoSidebar = document.getElementById('videoSidebar');
            const videoIntro = document.getElementById('videoIntro');
            const videoSymptoms = document.getElementById('videoSymptoms');
            const videoFamily = document.getElementById('videoFamily');
            const videoLifestyle = document.getElementById('videoLifestyle');
            const videoResults = document.getElementById('videoResults');

            if (videoSidebar && videoResults) {
                videoSidebar.classList.remove('hidden');
                
                // Hide and pause others
                if (videoIntro) { videoIntro.style.display = 'none'; videoIntro.pause(); }
                if (videoSymptoms) { videoSymptoms.style.display = 'none'; videoSymptoms.pause(); }
                if (videoFamily) { videoFamily.style.display = 'none'; videoFamily.pause(); }
                if (videoLifestyle) { videoLifestyle.style.display = 'none'; videoLifestyle.pause(); }

                // Show Results Video
                videoResults.style.display = 'block';
                videoResults.play().catch(() => {});
            }

            renderResults(result.predictions);
        } else {
            alert('Analysis could not determine a specific condition. Please consult a doctor directly.');
            form.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none';
        form.style.display = 'block';
        alert('An error occurred during analysis. Please try again.');
    }
});

function renderResults(predictions) {
    const container = document.getElementById('resultsContent');
    container.innerHTML = '';
    
    let isSevere = false;
    
    predictions.forEach((pred, index) => {
        const isTop = index === 0;
        const severityClass = getSeverityClass(pred.severity);
        
        if (isTop && (pred.severity.toUpperCase().includes('EMERGENCY') || pred.urgency.toUpperCase().includes('IMMEDIATE'))) {
            isSevere = true;
        }
        
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div class="disease-header">
                <h3>${pred.disease}</h3>
                <span class="severity-badge ${severityClass}">${pred.severity}</span>
            </div>
            
            <p><strong>Confidence:</strong> ${pred.confidence}%</p>
            <div class="confidence-bar-container">
                <div class="confidence-bar" style="width: ${pred.confidence}%"></div>
            </div>
            
            <div class="grid-2" style="margin-top: 1rem;">
                <div>
                    <p><strong>Urgency:</strong> ${pred.urgency}</p>
                    <p><strong>Specialist:</strong> ${pred.specialist}</p>
                    <p><strong>Typical Duration:</strong> ${pred.duration}</p>
                </div>
                <div>
                    <p><strong>Treatment Approach:</strong></p>
                    <p>${pred.treatment}</p>
                </div>
            </div>
            
            ${isTop ? `
            <div class="medication-section">
                <h4><i class="fas fa-pills"></i> Recommended Action / Medication</h4>
                <p>Based on the diagnosis of <strong>${pred.disease}</strong>, the standard protocol includes:</p>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <li>Consultation with <strong>${pred.specialist}</strong> (${pred.urgency})</li>
                    <li>Clinical verification of symptoms: ${pred.treatment}</li>
                </ul>
                <div style="margin-top: 1.5rem; text-align: center;">
                    <a href="consultation.html?type=hospitals" class="btn-primary" style="text-decoration: none; display: inline-block; padding: 0.8rem 1.5rem; border-radius: 8px; background: #2b6cb0; color: white;">
                        <i class="fas fa-map-marker-alt"></i> Find Nearby ${pred.specialist} / Hospitals
                    </a>
                </div>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #718096;">*Disclaimer: This is an AI-generated suggestion. Do not take medication without doctor prescription.</p>
            </div>
            ` : ''}
        `;
        
        container.appendChild(card);
    });
    
    // Show Emergency Popup if needed
    if (isSevere) {
        setTimeout(() => {
            document.getElementById('emergencyOverlay').style.display = 'block';
            document.getElementById('emergencyPopup').style.display = 'block';
        }, 1000);
    }
}

function getSeverityClass(severity) {
    const s = severity.toUpperCase();
    if (s.includes('EMERGENCY')) return 'severity-emergency';
    if (s.includes('URGENT')) return 'severity-urgent';
    if (s.includes('MODERATE')) return 'severity-moderate';
    return 'severity-mild';
}

function closeEmergency() {
    document.getElementById('emergencyOverlay').style.display = 'none';
    document.getElementById('emergencyPopup').style.display = 'none';
}
