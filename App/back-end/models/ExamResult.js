const mongoose = require('mongoose');

const ExamResultSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true
    },
    feedback: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    endedDueToViolation: {
        type: Boolean,
        default: false
    },
    score: {
        type: String,
        default: 'Not yet rated'
    }
});

module.exports = mongoose.model('ExamResult', ExamResultSchema);
