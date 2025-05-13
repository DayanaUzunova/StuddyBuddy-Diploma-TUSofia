const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser } = require('../controllers/userController');
const { authenticateUser } = require('../services/userService');
const { createGame } = require('../controllers/gameController');

router.post('/api/users/register', registerUser); // Register
router.post('/api/users/login', loginUser); // login
router.post('/api/users/logout', logoutUser); // logout
router.get('/api/users/me', authenticateUser, getUser); // get user
router.post('/api/create-game', authenticateUser, createGame); // create game

module.exports = router;
