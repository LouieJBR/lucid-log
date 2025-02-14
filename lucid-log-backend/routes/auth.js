const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Auth0 Login Route
router.get('/login',
    passport.authenticate('auth0', { scope: 'openid email profile' })
);

// Auth0 Callback Route
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  async (req, res) => {
      try {
          console.log("Auth0 User Profile:", req.user);

          // Extract Auth0 profile details
          const oauthId = req.user.oauthId; // Unique Auth0 ID
          const email = req.user.email || null; // Get email safely
          const userName = req.user.displayName || req.user.name || "Anonymous User";

          if (!oauthId) {
              console.error("Auth0 did not return an oauthId!");
              return res.status(400).json({ error: "Invalid OAuth login response" });
          }

          // 🔹 Ensure user lookup works correctly before inserting
          let user = await User.findOne({ oauthId });

          if (!user) {
              console.log("Creating new user:", { oauthId, name: userName, email });

              user = new User({ 
                  oauthId, // This is correctly set
                  name: userName, 
                  email 
              });

              await user.save();
          } else {
              console.log("User already exists:", user);
          }

          // Generate and return JWT token
          const token = generateToken(user);
          res.redirect(`https://black-mushroom-00d3c8703.4.azurestaticapps.net/login-success?token=${token}`);
      } catch (error) {
          console.error("MongoDB Error:", error);
          res.status(500).json({ error: error.message });
      }
  }
);

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

// ✅ Get User Profile from MongoDB
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('https://black-mushroom-00d3c8703.4.azurestaticapps.net');
});

module.exports = router;
