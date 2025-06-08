const Exam = require('../models/Exam');
const Course = require('../models/Course');
const ExamResult = require('../models/ExamResult');

const createExam = async (req, res) => {
    try {
        const { title, subject, questions, courseId } = req.body;
        const userId = req.user?.id;

        if (!title || !subject || !questions || !Array.isArray(questions) || !userId || !courseId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        for (const question of questions) {
            if (!question.questionText || !question.type) {
                return res.status(400).json({ message: 'Each question must have text and type.' });
            }

            if (question.type === 'multiple') {
                if (!Array.isArray(question.answers) || question.answers.length < 2) {
                    return res.status(400).json({ message: 'Multiple choice questions must have at least 2 answers.' });
                }

                for (const ans of question.answers) {
                    if (!ans.text) {
                        return res.status(400).json({ message: 'Each answer must have text.' });
                    }
                }
            }
        }

        const newExam = new Exam({
            title,
            subject,
            courseId,
            questions,
            createdBy: userId
        });

        const savedExam = await newExam.save();

        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { exams: savedExam._id }
        });

        res.status(201).json(savedExam);
    } catch (err) {
        console.error('Error creating exam:', err);
        res.status(500).json({ message: 'Server error while creating exam.', error: err.message });
    }
};


const getMyExams = async (req, res) => {
    try {
        const userId = req.user.id;
        const exams = await Exam.find({ createdBy: userId });
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your exams.' });
    }
};

const getExamById = async (req, res) => {
    try {
        const examId = req.params.id;
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found.' });
        res.status(200).json(exam);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch exam.' });
    }
};

const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch exams' });
    }
};

const editExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, questions } = req.body;

        if (!title || !subject || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid exam data.' });
        }

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: 'Exam not found.' });
        if (exam.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        exam.title = title;
        exam.subject = subject;
        exam.questions = questions;

        const updated = await exam.save();
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating exam.' });
    }
};

const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.json({ message: 'Exam deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete exam' });
    }
};

const approveExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });

        exam.isApproved = true;
        await exam.save();
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: 'Failed to approve exam' });
    }
};


const submitExam = async (req, res) => {
    try {
        const { examId, studentId, answers } = req.body;
        if (!examId || !studentId || !answers) {
            return res.status(400).json({ message: 'Missing fields.' });
        }

        const result = new ExamResult({
            exam: examId,
            student: studentId,
            answers,
            submittedAt: new Date()
        });

        await result.save();
        res.status(201).json({ message: 'Result saved.' });
    } catch (err) {
        console.error('Submit error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getExamsByCourseId = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        if (!courseId) {
            return res.status(400).json({ message: 'Missing course ID.' });
        }

        const course = await Course.findById(courseId).populate('exams');

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        res.status(200).json(course.exams);
    } catch (err) {
        console.error('Error fetching exams by course:', err);
        res.status(500).json({ message: 'Failed to fetch exams for this course.' });
    }
};



module.exports = {
    createExam,
    getMyExams,
    getExamById,
    getAllExams,
    editExam,
    deleteExam,
    approveExam,
    submitExam,
    getExamsByCourseId
};
