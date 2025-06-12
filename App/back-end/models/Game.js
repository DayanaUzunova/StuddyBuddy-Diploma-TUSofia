const mongoose = require('mongoose');

const allowedSubjects = [
  'Math', 'Science', 'History', 'Geography',
  'Language', 'Art', 'Music', 'Technology'
];

const allowedGameTypes = ['card', 'quiz'];

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subject: {
    type: String,
    required: true,
    trim: true,
    enum: { values: allowedSubjects, message: 'Subject is not valid' }
  },
  type: {
    type: String,
    required: true,
    enum: { values: allowedGameTypes, message: 'Game type must be either card or quiz' }
  },
  description: { type: String, default: '', trim: true },
  cards: [
    {
      question: { type: String, required: true, trim: true },
      correctAnswer: { type: String, required: true, trim: true },
      wrongAnswers: {
        type: [String],
        validate: {
          validator: (val) => Array.isArray(val) && val.length === 2,
          message: 'There must be exactly 2 wrong answers.'
        },
        required: true
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
  timePerQuestion: {
    type: Number,
    default: 15,
    min: 5,
    max: 120
  },
  isChallenge: {
    type: Boolean,
    default: false
  },

});

module.exports = mongoose.model('Game', gameSchema);
