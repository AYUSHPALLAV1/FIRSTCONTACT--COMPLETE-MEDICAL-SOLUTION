# FirstContact: ML Diagnosis Engine (Medidose)

This is the core diagnostic component of FirstContact, utilizing a Supervised Machine Learning approach to provide preliminary health assessments.

## 🧠 Model Architecture
- **Algorithm**: Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`).
- **Data Generation**: Trained on a synthetic clinical dataset of 50,000 samples derived from a clinical reference matrix (`DiagnoDose_Disease_Reference.csv`).
- **Feature Engineering**:
  - **Numerical**: Age, BMI, Blood Pressure, Heart Rate, etc.
  - **Categorical**: Gender, Symptoms, Family History, Lifestyle.
- **Model Storage**: Uses `joblib` for model persistence and efficient loading.

## 🚀 Files
- `train.py`: Script for training the model on the clinical dataset.
- `predict.py`: Inference script used by the backend to process user inputs.
- `disease_lookup.json`: Mapping of disease IDs to human-readable names.
- `feature_columns.joblib`: Persisted feature column definitions for consistent input processing.
- `label_encoder.joblib`: Persisted label encoder for consistent output decoding.

## 🛠 Usage

### Prerequisites
- Python (v3.9+)
- Scikit-learn, Pandas, NumPy, Joblib

### Training
```bash
python train.py
```

### Inference (CLI)
```bash
python predict.py <input-json-file>
```

---

For more details on the full project, see the [Root README](file:///c:/Users/ayush/Downloads/FIRSTCONTACT-/FIRSTCONTACT-%20COMPLETE%20MEDICAL%20SOLUTION/README.md).
