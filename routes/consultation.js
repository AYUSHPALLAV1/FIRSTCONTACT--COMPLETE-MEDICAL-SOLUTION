const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
// NOTE: This uses the Gemini API Key, NOT the Google Maps API Key.
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBAb5sDdjlX0rapwcM8qmwdQX_-TqgsS0E";
const genAI = new GoogleGenerativeAI(API_KEY);

router.post('/map-diagnosis', async (req, res) => {
    try {
        const { diagnosis } = req.body;

        if (!diagnosis || !Array.isArray(diagnosis) || diagnosis.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid diagnosis data' });
        }

        console.log("Processing diagnosis for map mapping:", diagnosis.length, "items");

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are a medical triage assistant.
            Input: A list of predicted diseases/conditions with severity/urgency from an AI symptom checker.
            Data: ${JSON.stringify(diagnosis)}
            
            Task: 
            1. Analyze the overall severity and nature of the conditions.
            2. Determine the most appropriate type of medical facility to visit: "Hospital" (for severe/emergency/specialized care) or "Clinic" (for mild/routine/outpatient care).
            3. Provide specific search keywords for Google Maps to find the best place (e.g., "Cardiology Hospital", "General Clinic", "ENT Specialist").
            
            Output JSON format:
            {
                "facilityType": "Hospital" | "Clinic",
                "searchKeywords": "string",
                "reasoning": "string",
                "urgencyLevel": "High" | "Medium" | "Low"
            }
            Do not include markdown formatting. Just the JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const mapping = JSON.parse(text);

        res.json({
            success: true,
            mapping: mapping
        });

    } catch (error) {
        console.error("Error in map-diagnosis:", error);
        res.status(500).json({ success: false, message: 'Server Error processing diagnosis' });
    }
});

module.exports = router;
