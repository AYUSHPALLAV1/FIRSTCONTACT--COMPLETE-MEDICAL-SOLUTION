import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib
import json
import random
import re

# Load Reference CSV
csv_path = '../DiagnoDose_Disease_Reference.csv'
try:
    df_ref = pd.read_csv(csv_path)
except FileNotFoundError:
    # Fallback for when running from ml_engine dir or root
    try:
        df_ref = pd.read_csv('DiagnoDose_Disease_Reference.csv')
    except:
        # Fallback absolute path
        df_ref = pd.read_csv('/Users/suvo/Downloads/FirstContact/DiagnoDose_Disease_Reference.csv')

# --- Feature Definition ---
symptoms_list = [
    "Fever", "Shortness of breath", "Fatigue", "Headache", "Sore throat", 
    "Muscle pain", "Chest pain", "Abdominal pain", "Nausea", "Vomiting", 
    "Diarrhea", "Loss of taste or smell", "Rash", "Joint pain", "Dizziness", "Cough",
    "Confusion", "Bleeding", "Swelling"
]

family_history_list = [
    "Diabetes", "Heart disease", "Hypertension", "Cancer", "Stroke", 
    "Asthma", "Alzheimer's disease", "Arthritis", "Depression", "Obesity"
]

lifestyle_list = [
    "Smoking", "Alcohol consumption", "Sedentary lifestyle", "Regular exercise", 
    "Balanced diet", "High stress levels", "Poor sleep", "Drug use"
]

# --- Synthetic Data Generation Helper ---

def parse_indicators(indicators_text):
    """Parses the text description to find matching symptoms."""
    text = str(indicators_text).lower()
    active_symptoms = []
    
    # Map text keywords to structured symptoms
    mappings = {
        "fever": "Fever", "temperature": "Fever",
        "breath": "Shortness of breath", "dyspnea": "Shortness of breath",
        "fatigue": "Fatigue", "weakness": "Fatigue",
        "headache": "Headache",
        "throat": "Sore throat",
        "muscle": "Muscle pain", "ache": "Muscle pain",
        "chest": "Chest pain",
        "abdominal": "Abdominal pain", "stomach": "Abdominal pain",
        "nausea": "Nausea",
        "vomit": "Vomiting",
        "diarrhea": "Diarrhea", "stool": "Diarrhea",
        "rash": "Rash", "spots": "Rash",
        "joint": "Joint pain",
        "dizzy": "Dizziness", "confusion": "Confusion",
        "cough": "Cough",
        "bleeding": "Bleeding", "hemorrhage": "Bleeding",
        "swelling": "Swelling", "edema": "Swelling"
    }
    
    for key, val in mappings.items():
        if key in text:
            active_symptoms.append(val)
            
    return list(set(active_symptoms))

def generate_synthetic_data(num_samples=50000):
    data = []
    
    diseases = df_ref['Disease Name'].tolist()
    
    samples_per_disease = num_samples // len(diseases)
    
    for _, row in df_ref.iterrows():
        disease = row['Disease Name']
        indicators = row['Key Clinical Indicators']
        active_symptoms = parse_indicators(indicators)
        
        # Determine likely vitals based on disease keywords
        is_hypertensive = "BP" in str(indicators) or "Hypertension" in disease
        is_hypotensive = "Low BP" in str(indicators) or "Sepsis" in disease or "Bleeding" in disease
        is_feverish = "Fever" in str(indicators) or "Infection" in str(row['General Treatment Approach'])
        is_tachycardic = "heart rate" in str(indicators)
        is_diabetic = "Glucose" in str(indicators) or "Diabetes" in disease
        
        for _ in range(samples_per_disease):
            record = {}
            
            # Basic Info
            record['Age'] = random.randint(18, 90)
            record['Gender'] = random.choice(['Male', 'Female'])
            record['BMI'] = random.uniform(18.5, 35.0) # Combined weight/height into BMI for simplicity in generation
            
            # Vitals
            if is_hypertensive:
                record['SystolicBP'] = random.randint(140, 200)
                record['DiastolicBP'] = random.randint(90, 120)
            elif is_hypotensive:
                record['SystolicBP'] = random.randint(70, 90)
                record['DiastolicBP'] = random.randint(40, 60)
            else:
                record['SystolicBP'] = random.randint(110, 130)
                record['DiastolicBP'] = random.randint(70, 85)
                
            if is_tachycardic:
                record['HeartRate'] = random.randint(100, 140)
            else:
                record['HeartRate'] = random.randint(60, 90)
                
            if is_feverish:
                record['BodyTemp'] = random.uniform(38.0, 41.0)
            else:
                record['BodyTemp'] = random.uniform(36.5, 37.2)
                
            # Symptoms (High probability if in indicators, low random noise otherwise)
            for sym in symptoms_list:
                if sym in active_symptoms:
                    record[f'Symptom_{sym}'] = 1 if random.random() > 0.1 else 0 # 90% chance to have it
                else:
                    record[f'Symptom_{sym}'] = 1 if random.random() < 0.05 else 0 # 5% noise
            
            # Blood Tests
            if is_diabetic:
                record['Glucose'] = random.randint(140, 400)
            else:
                record['Glucose'] = random.randint(70, 110)
            
            record['Cholesterol'] = random.randint(150, 250)
            record['Hemoglobin'] = random.uniform(10, 16)
            
            if "Infection" in str(row['General Treatment Approach']) or is_feverish:
                record['WBC'] = random.randint(11000, 20000)
            else:
                record['WBC'] = random.randint(4500, 10000)
                
            record['Platelet'] = random.randint(150000, 450000)
            if "Dengue" in disease or "Thrombocytopenia" in disease:
                 record['Platelet'] = random.randint(10000, 50000)

            # Family History & Lifestyle (Randomized for now, but could be correlated)
            for fh in family_history_list:
                record[f'History_{fh}'] = 1 if random.random() < 0.1 else 0
            
            for ls in lifestyle_list:
                record[f'Lifestyle_{ls}'] = 1 if random.random() < 0.2 else 0
                
            record['Target_Disease'] = disease
            data.append(record)
            
    return pd.DataFrame(data)

# --- Main Execution ---
print("Generating 50,000 synthetic records...")
df_train = generate_synthetic_data(50000)
print(f"Generated {len(df_train)} records.")

# Prepare X and y
X = df_train.drop(columns=['Target_Disease'])
y = df_train['Target_Disease']

# Preprocessing: Map Gender to numeric
X['Gender'] = X['Gender'].map({'Male': 0, 'Female': 1})

# Preprocessing Pipeline
feature_cols = X.columns.tolist()

# Encode Target
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train Model
print("Training Random Forest Classifier...")
clf = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42, n_jobs=-1)
clf.fit(X, y_encoded)

# Save Artifacts
print("Saving model and artifacts...")
joblib.dump(clf, 'ml_engine/disease_model.joblib')
joblib.dump(le, 'ml_engine/label_encoder.joblib')
joblib.dump(feature_cols, 'ml_engine/feature_columns.joblib')

# Also save the reference CSV data as a JSON for quick lookup in prediction
lookup_dict = {}
for _, row in df_ref.iterrows():
    lookup_dict[row['Disease Name']] = {
        'Severity': row['Severity Level'],
        'Urgency': row['Urgency'],
        'Treatment': row['General Treatment Approach'],
        'Specialist': row['Specialist Required'],
        'Duration': row['Typical Duration']
    }
    
with open('ml_engine/disease_lookup.json', 'w') as f:
    json.dump(lookup_dict, f)

print("Training Complete. Model saved.")
