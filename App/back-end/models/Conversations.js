const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isClosed: { type: Boolean, default: false },
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
