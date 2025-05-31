const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser, sendResetCode, verifyResetCode, resetPassword } = require('../controllers/userController');
const { authenticateUser } = require('../services/userService');
const { createGame, getMyGames, editCardGame, deleteCardGame, getGames, getCardGame, approveGame } = require('../controllers/gameController');
const { getAllUsers, getAllGames, updateUser, deleteUser } = require('../controllers/adminController');
const { createConversation, deleteConversation, closeConversation, getConversations, addComment } = require('../controllers/conversationsController');

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
router.put('/api/admin/approve-game/:id', authenticateUser, approveGame);// Create a conversation
router.post('/api/create-conversation', authenticateUser, createConversation);
router.delete('/api/delete-conversation/:id', authenticateUser, deleteConversation);
router.patch('/api/close-conversation/:id', authenticateUser, closeConversation);
router.get('/api/conversations', authenticateUser, getConversations);
router.post('/api/conversations/:id/comment', authenticateUser, addComment);
router.get('/api/conversations/:id', authenticateUser, getConversations);
router.post('/api/users/forgot-password', sendResetCode);
router.post('/api/users/verify-code', verifyResetCode);
router.post('/api/users/reset-password', resetPassword);


module.exports = router;
