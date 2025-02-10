const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    oauthId: { type: String, required: true, unique: true }, // Ensure OAuth ID is unique
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a unique index on `oauthId`
UserSchema.index({ oauthId: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
