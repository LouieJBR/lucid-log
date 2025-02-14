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

//  Save a Dream
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

//  Get Dreams for a User
router.get('/user-dreams', async (req, res) => {
    try {
        console.log("🔹 Incoming Request: ", req.headers.authorization);

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.error("❌ No token provided");
            return res.status(401).json({ error: "Unauthorized" });
        }

        //  Decode token and find user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log(" User ID from Token:", userId);

        // ❌ FIX: REMOVE ORDER-BY IF INDEX DOESN'T EXIST
        const dreams = await Dream.find({ userId }); // ❌ REMOVE `.sort({ date: -1 })` IF NOT INDEXED

        res.json(dreams);
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:dreamId', authenticate, async (req, res) => {
    try {
        const { dreamId } = req.params;
        const userId = req.user.id;

        const deletedDream = await Dream.findOneAndDelete({ _id: dreamId, userId });

        if (!deletedDream) {
            return res.status(404).json({ error: 'Dream not found or unauthorized' });
        }

        res.json({ message: 'Dream deleted successfully', dreamId: deletedDream._id });
    } catch (error) {
        console.error("❌ Error deleting dream:", error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
