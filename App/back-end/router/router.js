const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser, sendResetCode, verifyResetCode, resetPassword, markGameCompleted, getUserGameCount, changeLang } = require('../controllers/userController');
const { authenticateUser } = require('../services/userService');
const { createGame, getMyGames, editCardGame, deleteCardGame, getGames, getCardGame, approveGame } = require('../controllers/gameController');
const { getAllUsers, getAllGames, updateUser, deleteUser } = require('../controllers/adminController');
const { createConversation, deleteConversation, closeConversation, getConversations, addComment, getConversation } = require('../controllers/conversationsController');
const { createCourse, getMyCourses, getAllCourses, getCourseById, editCourse, deleteCourse, enrollInCourse, getEnrolledUsers, getEnrolledCoursesbyStudnet } = require('../controllers/courseController');
const {
    createExam,
    getMyExams,
    editExam,
    deleteExam,
    getExams,
    getExam,
    approveExam,
    getAllExams,
    getExamById,
    getExamsByCourseId
} = require('../controllers/examController');
const { submitExamResult, getResultsForTeacher, gradeExamResult, logExamViolation, getStudentResultsForCourse, getResultsByCourseId, getExamResultById } = require('../controllers/examResultController');

router.post('/api/users/register', registerUser); // Register
router.post('/api/users/login', loginUser); // login
router.post('/api/users/logout', logoutUser); // logout
router.get('/api/users/me', authenticateUser, getUser); // get user
router.post('/api/create-game', authenticateUser, createGame); // create game
router.get('/api/games/my', authenticateUser, getMyGames); // get my games
router.post('/api/games/edit/:id', authenticateUser, editCardGame); // edit game
router.post('/api/games/delete/:id', authenticateUser, deleteCardGame); // delete card game
router.get('/api/games', authenticateUser, getGames) // get all games for the student to see
router.get('/api/game/:gameId', authenticateUser, getCardGame) // get card game
router.get('/api/admin/get-users', authenticateUser, getAllUsers) // get all users admin
router.get('/api/admin/get-games', authenticateUser, getAllGames); // get games admin
router.put('/api/admin/update-user/:id', authenticateUser, updateUser);
router.delete('/api/admin/delete-user/:id', authenticateUser, deleteUser);
router.delete('/api/admin/delete-game/:id', authenticateUser, deleteCardGame);
router.delete('/api/games/:id', authenticateUser, deleteCardGame);
router.put('/api/admin/approve-game/:id', authenticateUser, approveGame);// Create a conversation
router.post('/api/create-conversation', authenticateUser, createConversation);
router.delete('/api/delete-conversation/:id', authenticateUser, deleteConversation);
router.patch('/api/close-conversation/:id', authenticateUser, closeConversation);
router.get('/api/conversations', authenticateUser, getConversations);
router.post('/api/conversations/:id/comment', authenticateUser, addComment);
router.get('/api/conversations/:id', authenticateUser, getConversation);
router.post('/api/users/forgot-password', sendResetCode);
router.post('/api/users/verify-code', verifyResetCode);
router.post('/api/users/reset-password', resetPassword);
router.post('/api/courses/create', authenticateUser, createCourse);
router.get('/api/courses/my', authenticateUser, getMyCourses);
router.get('/api/courses/all', authenticateUser, getAllCourses);
router.get('/api/courses/:id', authenticateUser, getCourseById);
router.put('/api/courses/:id', authenticateUser, editCourse);
router.delete('/api/courses/:id', authenticateUser, deleteCourse);
router.post('/api/courses/:id/enroll', authenticateUser, enrollInCourse);
router.post('/api/create-exam', authenticateUser, createExam);
router.get('/api/exams/my', authenticateUser, getMyExams);
router.get('/api/exams/:id', authenticateUser, getExamById);
router.get('/api/admin/get-exams', authenticateUser, getAllExams);
router.post('/api/exams/edit/:id', authenticateUser, editExam);
router.delete('/api/admin/delete-exam/:id', authenticateUser, deleteExam);
router.put('/api/admin/approve-exam/:id', authenticateUser, approveExam);
router.post('/api/submit-exam', authenticateUser, submitExamResult);
router.get('api/exam/:examId', authenticateUser, getResultsForTeacher);
router.get('/api/exams/by-course/:courseId', authenticateUser, getExamsByCourseId);
router.post('/log-exam-violation', authenticateUser, logExamViolation);
router.get('/api/exam-results/mine/:courseId', authenticateUser, getStudentResultsForCourse);
router.get('/api/exams/by-course/:courseId/results', authenticateUser, getResultsByCourseId);
router.get('/api/courses/:id/enrolled-users', authenticateUser, getEnrolledUsers);
router.get('/api/examResults/:id', authenticateUser, getExamResultById);
router.put('/api/examResults/grade/:id', authenticateUser, gradeExamResult);
router.delete('/api/exams/:id', authenticateUser, deleteExam);
router.put('/api/exams/edit/:id', authenticateUser, editExam);
router.get('/api/courses/my/student', authenticateUser, getEnrolledCoursesbyStudnet);
router.post('/api/user/increment-games-played', authenticateUser, markGameCompleted)
router.get('/api/games/completed/count', authenticateUser, getUserGameCount);
router.post('/api/user/change-lang', authenticateUser, changeLang);

module.exports = router;
