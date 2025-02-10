const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dream', DreamSchema);
