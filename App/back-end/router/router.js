const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser } = require('../controllers/userController');
const { authenticateUser } = require('../services/userService');
const { createGame, getMyGames, editCardGame, deleteCardGame, getGames, getCardGame } = require('../controllers/gameController');

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

module.exports = router;
