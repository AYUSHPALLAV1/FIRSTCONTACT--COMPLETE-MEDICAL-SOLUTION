import sys
import json
import joblib
import pandas as pd
import numpy as np
import os

def load_artifacts():
    base_path = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(base_path, 'disease_model.joblib'))
    le = joblib.load(os.path.join(base_path, 'label_encoder.joblib'))
    feature_cols = joblib.load(os.path.join(base_path, 'feature_columns.joblib'))
    with open(os.path.join(base_path, 'disease_lookup.json'), 'r') as f:
        lookup = json.load(f)
    return model, le, feature_cols, lookup

def get_float(value, default):
    try:
        if value is None or str(value).strip() == '':
            return float(default)
        return float(value)
    except (ValueError, TypeError):
        return float(default)

def predict(data):
    try:
        model, le, feature_cols, lookup = load_artifacts()
        
        # Prepare Input DataFrame
        input_record = {}
        
        # Basic Info
        input_record['Age'] = get_float(data.get('age'), 30)
        input_record['Gender'] = 0 if data.get('gender') == 'Male' else 1
        
        # Calculate BMI if weight/height provided, else default
        weight = get_float(data.get('weight'), 70)
        height = get_float(data.get('height'), 1.75)
        # Handle cm vs m
        if height > 3: height = height / 100
        input_record['BMI'] = weight / (height * height)
        
        # Vitals
        input_record['SystolicBP'] = get_float(data.get('systolicBP'), 120)
        input_record['DiastolicBP'] = get_float(data.get('diastolicBP'), 80)
        input_record['HeartRate'] = get_float(data.get('heartRate'), 72)
        input_record['BodyTemp'] = get_float(data.get('bodyTemp'), 37.0)
        
        # Blood Tests
        input_record['Glucose'] = get_float(data.get('glucose'), 100)
        input_record['Cholesterol'] = get_float(data.get('cholesterol'), 180)
        input_record['Hemoglobin'] = get_float(data.get('hemoglobin'), 14)
        input_record['WBC'] = get_float(data.get('wbc'), 6000)
        input_record['Platelet'] = get_float(data.get('platelet'), 250000)
        
        # One-Hot Features (Symptoms, History, Lifestyle)
        # Initialize all potential features to 0
        current_features = {col: 0 for col in feature_cols if col not in input_record}
        
        # Set active features to 1
        active_symptoms = data.get('symptoms', [])
        for sym in active_symptoms:
            key = f'Symptom_{sym}'
            if key in current_features:
                current_features[key] = 1
                
        active_history = data.get('familyHistory', [])
        for hist in active_history:
            key = f'History_{hist}'
            if key in current_features:
                current_features[key] = 1
                
        active_lifestyle = data.get('lifestyle', [])
        for life in active_lifestyle:
            key = f'Lifestyle_{life}'
            if key in current_features:
                current_features[key] = 1
                
        # Merge dictionaries
        full_record = {**input_record, **current_features}
        
        # Create DataFrame with correct column order
        df_input = pd.DataFrame([full_record])
        df_input = df_input[feature_cols] # Ensure order matches training
        
        # Predict
        probs = model.predict_proba(df_input)[0]
        
        # Get top 3 predictions
        top_indices = probs.argsort()[-3:][::-1]
        results = []
        
        for idx in top_indices:
            disease_name = le.inverse_transform([idx])[0]
            confidence = float(probs[idx])
            
            if confidence > 0.01: # Filter very low confidence
                details = lookup.get(disease_name, {})
                results.append({
                    'disease': disease_name,
                    'confidence': round(confidence * 100, 2),
                    'severity': details.get('Severity', 'Unknown'),
                    'urgency': details.get('Urgency', 'Unknown'),
                    'treatment': details.get('Treatment', 'Consult a doctor'),
                    'specialist': details.get('Specialist', 'General Practitioner'),
                    'duration': details.get('Duration', 'Variable')
                })
        
        return json.dumps({'success': True, 'predictions': results})
        
    except Exception as e:
        return json.dumps({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # Read input from stdin
    input_str = sys.stdin.read()
    if not input_str:
        print(json.dumps({'success': False, 'error': 'No input data provided'}))
    else:
        try:
            data = json.loads(input_str)
            print(predict(data))
        except json.JSONDecodeError:
            print(json.dumps({'success': False, 'error': 'Invalid JSON input'}))
