const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Security Middleware
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
// cors was already declared at the top, removing duplicate declaration here

const path = require('path');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON

// Serve static files
app.use(express.static(path.join(__dirname)));

// Sanitize data
// app.use(mongoSanitize()); // Disabled due to compatibility issue with latest Express/Mongoose versions in this environment

// Set security headers
app.use(helmet());

// Prevent XSS attacks
// app.use(xss()); // Disabled due to compatibility with newer Express versions

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));

// Health Check API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'System operational',
        timestamp: new Date().toISOString()
    });
});

app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
