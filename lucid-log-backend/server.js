require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const User = require('./models/User');

const app = express();
app.use(cors({
    origin: [
        'https://black-mushroom-00d3c8703.4.azurestaticapps.net',
        'https://lucid-log-api-araahcdcfwcvc8cm.uksouth-01.azurewebsites.net'
    ],
    credentials: true
}));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Auth0 Strategy
passport.use(new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/api/auth/callback'
}, async (accessToken, refreshToken, extraParams, profile, done) => {
    let user = await User.findOne({ oauthId: profile.id });

    if (!user) {
        user = new User({ oauthId: profile.id, name: profile.displayName, email: profile.emails[0].value });
        await user.save();
    }

    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Connect Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${8080}`));

const dreamRoutes = require('./routes/dreams');
app.use('/api/dreams', dreamRoutes);
