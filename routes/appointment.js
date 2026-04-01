const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'doctor-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Get list of doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json({ success: true, data: doctors });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Register a new doctor
router.post('/doctors', upload.single('image'), async (req, res) => {
    try {
        // Parse availability string to array
        let availability = req.body.availability;
        if (typeof availability === 'string') {
            availability = availability.split(',').map(s => s.trim());
        }

        const doctorData = {
            ...req.body,
            availability: availability,
            image: req.file ? `uploads/${req.file.filename}` : undefined
        };

        const doctor = await Doctor.create(doctorData);
        res.status(201).json({ success: true, data: doctor });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, doctorName } = req.body;

        if (!amount || !doctorName) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in paise (smallest currency unit)
            currency: 'inr',
            description: `Consultation with ${doctorName}`,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get doctor profile
router.get('/doctor/me', protect, authorize('Doctor'), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Update doctor profile
router.put('/doctor/me', protect, authorize('Doctor'), upload.single('image'), async (req, res) => {
    try {
        let doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        // Parse availability string to array
        let availability = req.body.availability;
        if (typeof availability === 'string') {
            availability = availability.split(',').map(s => s.trim());
        }

        const updateData = {
            ...req.body,
            availability: availability || doctor.availability,
            image: req.file ? `uploads/${req.file.filename}` : doctor.image
        };

        doctor = await Doctor.findByIdAndUpdate(doctor._id, updateData, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: doctor });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
