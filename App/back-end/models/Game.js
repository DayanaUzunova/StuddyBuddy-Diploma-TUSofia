const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    cards: [
        {
            question: { type: String, required: true, trim: true },
            answer: { type: String, required: true, trim: true }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Game', gameSchema);
