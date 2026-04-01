# FirstContact: AI-Powered Healthcare System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-v3.9+-blue.svg)](https://python.org/)

FirstContact is a comprehensive digital healthcare platform that bridges the gap between patient symptoms and professional medical care. By integrating AI-driven diagnosis with telemedicine, hospital location services, and insurance analysis, it provides a seamless, "one-stop" medical solution.

---

## 🚀 Core Modules

### 1. Medidose (AI Diagnosis Engine)
A supervised machine learning engine that provides preliminary disease diagnosis based on user demographics, vitals, and symptoms.
- **Algorithm**: Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`).
- **Input**: Age, BMI, Blood Pressure, Heart Rate, Symptoms, Family History, and Lifestyle factors.
- **Output**: Top 3 potential conditions with confidence scores.
- **Accuracy**: Designed for >90% accuracy on structured clinical data.

### 2. Consultation & Telemedicine
Seamlessly transitions from diagnosis to actionable medical advice.
- **Appointment Booking**: Browse doctor profiles, check availability, and book slots.
- **Video Consultations**: Integrated video conferencing for remote care.
- **Hospital Locator**: Real-time nearby hospital discovery via Google Maps API.
- **Payment Integration**: Secure consultation fee processing with Stripe.

### 3. Insurance Policy Analyzer
Simplifies financial planning for medical treatments.
- **PDF Analysis**: Upload insurance policy documents for automated parsing.
- **Coverage Check**: Automatically determines if a diagnosed condition is covered under your current policy.

### 4. MediSecure (Authentication & Security)
Enterprise-grade security for sensitive medical data.
- **JWT Authentication**: Secure, stateless user sessions.
- **Role-Based Access Control (RBAC)**: Support for Patients, Doctors, Nurses, and Admins.
- **Security Hardening**: Implementation of `helmet`, `xss-clean`, `hpp`, and `express-rate-limit`.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Frontend** | [React.js](https://reactjs.org/) (Vite), [Tailwind CSS](https://tailwindcss.com/) |
| **ML Engine** | [Python](https://python.org/), [Scikit-learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Mongoose ODM) |
| **Security** | [JWT](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Deployment** | [Docker](https://www.docker.com/) |

---

## 📂 Project Structure

```text
├── client/              # React frontend (Vite)
├── ml_engine/           # Python ML diagnosis engine (Random Forest)
├── models/              # Mongoose database models
├── routes/              # Express API routes
├── controllers/         # Backend business logic
├── middleware/          # Security and auth middleware
├── server.js            # Main application entry point
└── requirements.txt     # Python dependencies
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd FIRSTCONTACT-COMPLETE-MEDICAL-SOLUTION

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, JWT Secret, and API keys
```

### 2. Machine Learning Engine Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# (Optional) Retrain the model
python ml_engine/train.py
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/me` - Get current user profile (Protected)

### Appointments & Consultation
- `GET /api/consultation/doctors` - List all available doctors
- `POST /api/appointment/book` - Book an appointment
- `POST /api/predict/disease` - Run ML diagnosis (Protected)

---

## 📜 Research & Documentation
This project is backed by academic research and detailed documentation:
- **Research Paper**: [PROJECT_Q1_RESEARCH_PAPER.tex](file:///c:/Users/ayush/Downloads/FIRSTCONTACT-/FIRSTCONTACT-%20COMPLETE%20MEDICAL%20SOLUTION/PROJECT_Q1_RESEARCH_PAPER.tex)
- **Patent Draft**: [PROJECT_PATENT_DRAFT.docx](file:///c:/Users/ayush/Downloads/FIRSTCONTACT-/FIRSTCONTACT-%20COMPLETE%20MEDICAL%20SOLUTION/PROJECT_PATENT_DRAFT.docx)
- **Architecture**: [architecture_placeholder.png](file:///c:/Users/ayush/Downloads/FIRSTCONTACT-/FIRSTCONTACT-%20COMPLETE%20MEDICAL%20SOLUTION/architecture_placeholder.png)

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
