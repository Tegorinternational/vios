const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createUser, findUserByUsername } = require('../models/user');

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token function
const generateJWTToken = (user) => {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

// Signup Route
router.post('/signup', [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const existingUser = await findUserByUsername(username);

    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(username, hashedPassword);
    
    res.status(201).json({ userId, message: 'User created' });
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateJWTToken(user);
    
    // Send token as an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks
    });
    
    res.status(200).json({ message: 'Logged in successfully' });
});

// Check Auth Route
router.get('/check-auth', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: 'Authenticated', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.post('/logout', (req, res) => {
    // Clear the cookie
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    });

    res.json({ message: 'Logged out successfully' });
});


module.exports = router;




