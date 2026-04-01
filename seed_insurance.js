const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const GovernmentScheme = require('./models/GovernmentScheme');
const PrivateInsurance = require('./models/PrivateInsurance');

// Load env vars
dotenv.config();

console.log('Script started...');

const connectDB = async () => {
  console.log('Connecting to MongoDB...');
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error('MONGO_URI is not defined in .env file');
    }
    console.log(`Attempting to connect to MongoDB with URI: ${mongoURI.substring(0, 20)}...`);
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  const govFile = '/Users/suvo/Downloads/FirstContact/Government_Health_Insurance_Schemes_With_Diseases.csv';
  const privateFile = '/Users/suvo/Downloads/FirstContact/Private_Health_Insurance_Companies_With_Diseases.csv';

  const govSchemes = [];
  const privateInsurances = [];

  // Helper to read CSV
  const readCSV = (filePath, type) => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv({
            mapHeaders: ({ header, index }) => header.trim().replace(/^\uFEFF/, '')
        }))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  };

  try {
    // 1. Clear existing data
    console.log('Clearing existing data...');
    await GovernmentScheme.deleteMany({});
    await PrivateInsurance.deleteMany({});
    console.log('Data cleared.');

    // 2. Read and Insert Government Schemes
    console.log('Reading Government Schemes CSV...');
    const govData = await readCSV(govFile);
    
    if (govData.length > 0) {
        const firstKey = Object.keys(govData[0])[0];
        console.log('First key:', firstKey);
        console.log('First key char codes:', firstKey.split('').map(c => c.charCodeAt(0)));
        console.log('First row data:', govData[0]);
    }

    // Map CSV keys to Model keys
    // CSV Header: Scheme Name,Type,Launched Year,Target Beneficiaries,Coverage Amount,Diseases Covered,Not Covered,Pre-existing Conditions,Official Website,Beneficiary Portal,Helpline
    const govDocs = govData.map(row => ({
      schemeName: row['Scheme Name'],
      type: row['Type'],
      launchedYear: row['Launched Year'],
      targetBeneficiaries: row['Target Beneficiaries'],
      coverageAmount: row['Coverage Amount'],
      diseasesCovered: row['Diseases Covered'],
      notCovered: row['Not Covered'],
      preExistingConditions: row['Pre-existing Conditions'],
      officialWebsite: row['Official Website'],
      beneficiaryPortal: row['Beneficiary Portal'],
      helpline: row['Helpline']
    }));

    if (govDocs.length > 0) {
      await GovernmentScheme.insertMany(govDocs);
      console.log(`Imported ${govDocs.length} Government Schemes.`);
    }

    // 3. Read and Insert Private Insurance
    console.log('Reading Private Insurance CSV...');
    const privateData = await readCSV(privateFile);

    // CSV Header: Company Name,Type,Claim Settlement Ratio (%),Network Hospitals,Sum Insured Range,Diseases Covered,Official Website,Toll-Free Number
    const privateDocs = privateData.map(row => ({
      companyName: row['Company Name'],
      type: row['Type'],
      claimSettlementRatio: row['Claim Settlement Ratio (%)'],
      networkHospitals: row['Network Hospitals'],
      sumInsuredRange: row['Sum Insured Range'],
      diseasesCovered: row['Diseases Covered'],
      officialWebsite: row['Official Website'],
      tollFreeNumber: row['Toll-Free Number']
    }));

    if (privateDocs.length > 0) {
      await PrivateInsurance.insertMany(privateDocs);
      console.log(`Imported ${privateDocs.length} Private Insurance Companies.`);
    }

    console.log('Data Import Completed Successfully!');
    process.exit();

  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();
