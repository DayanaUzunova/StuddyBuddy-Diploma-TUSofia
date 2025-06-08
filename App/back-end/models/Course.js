const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        games: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Game',
            },
        ],
        enrolledUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
