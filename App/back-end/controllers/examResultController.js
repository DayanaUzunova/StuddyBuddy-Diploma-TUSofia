const ExamResult = require('../models/ExamResult');
const Exam = require('../models/Exam');

const submitExamResult = async (req, res) => {
    try {
        const { examId, answers, endedDueToViolation = false } = req.body;
        const studentId = req.user.id;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found.' });

        const newResult = new ExamResult({
            examId,
            studentId,
            answers,
            endedDueToViolation,
            submittedAt: new Date()
        });

        await newResult.save();
        res.status(201).json({ message: 'Result submitted successfully.' });
    } catch (err) {
        console.error('Submit error:', err);
        res.status(500).json({ message: err.message || 'Server error during submission.' });
    }
};


const logExamViolation = async (req, res) => {
    try {
        const { examId, studentId, reason } = req.body;

        // If result already exists, mark it as violation
        let result = await ExamResult.findOne({ examId, studentId });

        if (!result) {
            result = new ExamResult({
                examId,
                studentId,
                answers: new Map(), // empty if exam not started
                endedDueToViolation: true,
                submittedAt: new Date()
            });
        } else {
            result.endedDueToViolation = true;
        }

        await result.save();
        res.status(200).json({ message: 'Violation logged.' });
    } catch (err) {
        console.error('Violation log error:', err);
        res.status(500).json({ message: 'Error logging violation.' });
    }
};

const getResultsForTeacher = async (req, res) => {
    try {
        const { examId } = req.params;
        const results = await ExamResult.find({ examId }).populate('studentId');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching results.' });
    }
};

const gradeExamResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, feedback } = req.body;

        const result = await ExamResult.findById(id);
        if (!result) return res.status(404).json({ message: 'Result not found.' });

        result.score = score;
        result.feedback = feedback;
        await result.save();

        res.status(200).json({ message: 'Grade and comment submitted.' });
    } catch (err) {
        console.error('Error grading exam:', err);
        res.status(500).json({ message: 'Server error grading exam.' });
    }
};


const getStudentResultsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        const exams = await Exam.find({ courseId }).select('_id title');
        const examIds = exams.map(e => e._id);

        const results = await ExamResult.find({
            examId: { $in: examIds },
            studentId
        })
            .populate('examId', 'title subject')
            .sort({ submittedAt: -1 });



        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching student results:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getResultsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const exams = await Exam.find({ courseId }).select('_id title');
        const examIds = exams.map(exam => exam._id);
        const results = await ExamResult.find({ examId: { $in: examIds } })
            .populate('studentId', 'username')
            .populate('examId', 'title');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching exam results.' });
    }
};

const getExamResultById = async (req, res) => {
    try {
        const result = await ExamResult.findById(req.params.id)
            .populate('studentId', 'username')
            .populate({
                path: 'examId',
                select: 'title questions',
            });

        if (!result) {
            return res.status(404).json({ message: 'Exam result not found.' });
        }

        const userAnswers = result.answers instanceof Map
            ? Object.fromEntries(result.answers)
            : result.answers || {};

        const formattedAnswers = [];

        const examQuestions = result.examId.questions || [];

        examQuestions.forEach((question, index) => {
            const answer = userAnswers[index];
            formattedAnswers.push({
                questionText: question.questionText,
                answerText: Array.isArray(answer)
                    ? answer.join(', ')
                    : answer || 'No answer',
            });
        });

        const formattedResult = {
            _id: result._id,
            studentId: result.studentId,
            studentName: result.studentId?.username,
            examId: result.examId._id,
            examTitle: result.examId.title,
            answers: formattedAnswers,
            grade: result.grade,
            score: result.score,
            feedback: result.feedback,
            submittedAt: result.submittedAt,
            endedDueToViolation: result.endedDueToViolation,
        };

        res.json(formattedResult);
    } catch (err) {
        console.error('❌ Error fetching exam result by ID:', err);
        res.status(500).json({ message: 'Failed to fetch exam result.' });
    }
};



module.exports = {
    submitExamResult,
    getResultsForTeacher,
    gradeExamResult,
    logExamViolation,
    getStudentResultsForCourse,
    getResultsByCourseId,
    getExamResultById
};
