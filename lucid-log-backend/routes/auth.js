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
          res.redirect(`http://localhost:4200/login-success?token=${token}`);
      } catch (error) {
          console.error("MongoDB Error:", error);
          res.status(500).json({ error: error.message });
      }
  }
);

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:4200');
});

module.exports = router;
