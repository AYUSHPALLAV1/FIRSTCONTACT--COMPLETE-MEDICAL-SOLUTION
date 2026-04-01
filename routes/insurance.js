const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
// Use the key provided by the user directly or from env
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBAb5sDdjlX0rapwcM8qmwdQX_-TqgsS0E";
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/analyze', upload.single('policyPdf'), async (req, res) => {
    try {
        console.log("Analyze request received.");
        if (!req.file) {
            console.error("No file uploaded.");
            return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
        }
        
        const diseaseName = req.body.diseaseName;
        if (!diseaseName) {
            console.error("No disease name provided.");
            return res.status(400).json({ success: false, message: 'Disease name is required' });
        }

        console.log(`Processing file: ${req.file.originalname} (${req.file.size} bytes) for disease: ${diseaseName}`);

        // 1. Extract text from PDF
        let policyText = "";
        try {
            const pdfBuffer = req.file.buffer;
            const pdfData = await pdf(pdfBuffer);
            policyText = pdfData.text;
            console.log(`PDF Text extracted, length: ${policyText.length} characters.`);
        } catch (pdfError) {
            console.error("PDF Parsing Error:", pdfError);
            return res.status(400).json({ success: false, message: 'Failed to extract text from PDF. The file might be corrupted or password protected.' });
        }

        // 2. Prepare Prompt for Gemini
        // Using 'gemini-flash-latest' as it is confirmed working and available
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
            You are an expert insurance policy analyst with OCR capabilities.
            Context: The user has uploaded an insurance policy document (text extracted below) and wants to verify coverage for a specific medical condition.
            
            Target Condition/Disease: "${diseaseName}"
            
            Policy Document Content (Extracted Text):
            """
            ${policyText.substring(0, 50000)}
            """
            (Note: Text truncated to first 50k chars to fit context window if very large)

            Task:
            1. OCR & Analysis: Scan the provided text thoroughly as if performing OCR on a document. Look for keywords, synonyms, and specific clauses related to "${diseaseName}".
            2. Determine Coverage: Check for explicit mentions, category coverage, exclusion clauses, and waiting periods.
            3. Availment Process: Outline claim steps if covered.
            4. Limitations: Identify co-pay, sub-limits, waiting periods (e.g., "covered after 2 years").

            Output Requirement:
            Provide the response strictly in valid JSON format with the following structure:
            {
                "isCovered": boolean, // true if covered, false otherwise
                "coverageDetails": "Detailed explanation of why it is covered or not, citing specific clauses if found.",
                "availmentProcess": ["Step 1...", "Step 2...", "Step 3..."], // Array of strings.
                "limitations": "Any specific limitations, waiting periods, or exclusions."
            }
            
            Do not use Markdown code blocks (e.g., \`\`\`json). Return only the raw JSON string.
        `;

        // 3. Generate Content
        console.log("Sending request to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log("Gemini API response received.");

        // Cleanup potential markdown formatting if Gemini adds it despite instructions
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // 4. Parse JSON
        let analysisResult;
        try {
            analysisResult = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON. Raw text:", text);
            // Attempt to recover if it's just a partial JSON or text
            return res.status(500).json({ success: false, message: 'Failed to parse AI response. The AI might have returned unstructured text.', raw: text });
        }

        res.json({
            success: true,
            data: analysisResult
        });

    } catch (error) {
        console.error('Error processing policy:', error);
        
        let errorMessage = 'Server error processing request';
        if (error.status === 404) {
            errorMessage = 'AI Model not found or API endpoint unavailable.';
        } else if (error.status === 429) {
            errorMessage = 'Service is busy (Quota Exceeded). Please try again in a few moments.';
        } else if (error.message && error.message.includes("fetch")) {
             errorMessage = 'Network error connecting to AI service.';
        }

        res.status(500).json({ 
            success: false, 
            message: errorMessage, 
            error: error.message,
            details: error.statusText || 'No details'
        });
    }
});

const GovernmentScheme = require('../models/GovernmentScheme');
const PrivateInsurance = require('../models/PrivateInsurance');

router.post('/available-policies', async (req, res) => {
    try {
        const { type, disease } = req.body;
        console.log(`Fetching available policies. Type: ${type}, Disease: ${disease || 'None'}`);

        let policies = [];

        // 1. Fetch data based on type
        if (type === 'government' || type === 'all') {
            const govSchemes = await GovernmentScheme.find({});
            const formattedGov = govSchemes.map(p => ({
                id: p._id,
                name: p.schemeName,
                type: 'Government',
                description: p.diseasesCovered, // Using diseasesCovered as main description for checking
                coverage: p.coverageAmount,
                link: p.officialWebsite,
                features: [`Target: ${p.targetBeneficiaries}`, `Launch: ${p.launchedYear}`],
                raw: p // Keep raw for detailed display if needed
            }));
            policies = [...policies, ...formattedGov];
        }

        if (type === 'private' || type === 'all') {
            const privateInsurances = await PrivateInsurance.find({});
            const formattedPvt = privateInsurances.map(p => ({
                id: p._id,
                name: p.companyName,
                type: 'Private',
                description: p.diseasesCovered,
                coverage: p.sumInsuredRange,
                link: p.officialWebsite,
                features: [`Network Hospitals: ${p.networkHospitals}`, `Settlement Ratio: ${p.claimSettlementRatio}%`],
                raw: p
            }));
            policies = [...policies, ...formattedPvt];
        }

        // 2. Filter by Disease using Gemini if provided
        if (disease && disease.trim() !== '') {
            console.log(`Verifying coverage for disease: ${disease} using Gemini...`);
            
            // Prepare a simplified list for the AI to process (reduce token usage)
            const policiesForAI = policies.map(p => ({
                id: p.id,
                name: p.name,
                diseases: p.description
            }));

            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const prompt = `
                You are an insurance verification assistant.
                
                User Query Disease: "${disease}"
                
                Task: Identify which of the following insurance policies cover this disease based on their description.
                
                List of Policies:
                ${JSON.stringify(policiesForAI)}
                
                Instructions:
                1. Analyze the "diseases" field for each policy.
                2. Return a JSON array containing ONLY the "id" of the policies that cover the disease.
                3. Be generous with matching (e.g., "Heart attack" matches "Cardiac diseases").
                4. Output format: { "coveredPolicyIds": ["id1", "id2"] }
                5. Do not output markdown.
            `;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                
                const aiResult = JSON.parse(text);
                const coveredIds = aiResult.coveredPolicyIds || [];
                
                console.log(`Gemini found ${coveredIds.length} matching policies.`);
                
                // Filter the main list
                policies = policies.filter(p => coveredIds.includes(p.id.toString()));

            } catch (aiError) {
                console.error("Gemini Verification Failed:", aiError);
                // Fallback: Simple text match
                console.log("Falling back to simple text match.");
                const lowerDisease = disease.toLowerCase();
                policies = policies.filter(p => p.description.toLowerCase().includes(lowerDisease));
            }
        }

        res.json({
            success: true,
            count: policies.length,
            data: policies
        });

    } catch (error) {
        console.error("Error fetching policies:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching policies' });
    }
});

module.exports = router;
