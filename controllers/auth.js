const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
                errors: ['Email is already in use']
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    tokenType: 'Bearer',
                    expiresIn: '1h',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid user data',
                errors: ['Could not create user']
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            errors: [error.message]
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password',
                errors: []
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                errors: ['User not found']
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                errors: ['Password incorrect']
            });
        }

        // Create token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: {
                token,
                tokenType: 'Bearer',
                expiresIn: '1h',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            errors: [error.message]
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile retrieved',
        data: {
            user: req.user
        }
    });
};
