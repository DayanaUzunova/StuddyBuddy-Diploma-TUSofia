const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Регистрация
router.post('/register', registerUser);

// Логин
router.post('/login', loginUser);

module.exports = router;
