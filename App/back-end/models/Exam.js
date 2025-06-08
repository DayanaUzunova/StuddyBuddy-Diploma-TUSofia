const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ['multiple', 'open'], required: true },
    answers: [answerSchema] // само за multiple-type
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // ✅ добавено
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Exam', examSchema);
