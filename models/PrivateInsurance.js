const mongoose = require('mongoose');

const PrivateInsuranceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  claimSettlementRatio: {
    type: String, // String to include '%' or 'N/A'
    trim: true
  },
  networkHospitals: {
    type: String,
    trim: true
  },
  sumInsuredRange: {
    type: String,
    trim: true
  },
  diseasesCovered: {
    type: String,
    trim: true
  },
  officialWebsite: {
    type: String,
    trim: true
  },
  tollFreeNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrivateInsurance', PrivateInsuranceSchema);
