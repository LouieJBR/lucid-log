const express = require('express');
const Dream = require('../models/Dream');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

// ✅ Save a Dream
router.post('/save', authenticate, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Dream text is required' });
        }

        const newDream = new Dream({
            userId: req.user.id, // User ID from JWT
            text
        });

        await newDream.save();
        res.json({ message: 'Dream saved successfully', dream: newDream });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Dreams for a User
router.get('/user-dreams', authenticate, async (req, res) => {
    try {
        const dreams = await Dream.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(dreams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
