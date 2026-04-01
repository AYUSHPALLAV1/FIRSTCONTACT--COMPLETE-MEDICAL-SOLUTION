const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  launchedYear: {
    type: String, // Keeping as String to accommodate potential non-numeric formats or just years
    trim: true
  },
  targetBeneficiaries: {
    type: String,
    trim: true
  },
  coverageAmount: {
    type: String,
    trim: true
  },
  diseasesCovered: {
    type: String,
    trim: true
  },
  notCovered: {
    type: String,
    trim: true
  },
  preExistingConditions: {
    type: String,
    trim: true
  },
  officialWebsite: {
    type: String,
    trim: true
  },
  beneficiaryPortal: {
    type: String,
    trim: true
  },
  helpline: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
