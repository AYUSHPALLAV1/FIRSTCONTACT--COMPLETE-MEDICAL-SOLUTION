const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post('/', (req, res) => {
    const inputData = req.body;
    
    // Path to python script
    const scriptPath = path.join(__dirname, '../ml_engine/predict.py');
    
    const pythonProcess = spawn('python3', [scriptPath]);
    
    let result = '';
    let error = '';

    // Send data to python script via stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Script Exit Code:', code);
            console.error('Python Script Error Output:', error);
            return res.status(500).json({ success: false, message: 'Prediction failed', error: error || 'Unknown error' });
        }
        
        try {
            console.log('Python Output:', result); // Log output for debugging
            // Find the last JSON object in the output (in case of print statements)
            const jsonStart = result.indexOf('{');
            const jsonEnd = result.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = result.substring(jsonStart, jsonEnd + 1);
                const jsonResult = JSON.parse(jsonString);
                res.json(jsonResult);
            } else {
                 throw new Error('No JSON found in output');
            }
        } catch (e) {
            console.error('JSON Parse Error:', e, 'Output:', result);
            res.status(500).json({ success: false, message: 'Invalid response from ML engine' });
        }
    });
});

module.exports = router;
