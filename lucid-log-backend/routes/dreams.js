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

// Save a new dream
router.post('/', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        const newDream = new Dream({ userId: req.user.id, text });
        await newDream.save();
        res.status(201).json(newDream);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all dreams for a user
router.get('/:userId', authenticate, async (req, res) => {
    try {
        const dreams = await Dream.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(dreams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
