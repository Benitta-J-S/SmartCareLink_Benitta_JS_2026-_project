const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const user = new User({ name, email, password, phone, role: role || 'patient' });
        await user.save();
        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;