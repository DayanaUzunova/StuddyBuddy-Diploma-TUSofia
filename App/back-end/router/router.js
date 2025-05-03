const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLanguage } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.post('/api/users/register', registerUser); // Register
router.post('/api/users/login', loginUser); // login
router.get('/api/language', authenticate, getLanguage); // get language

module.exports = router;
