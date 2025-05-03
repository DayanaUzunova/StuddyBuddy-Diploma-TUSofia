const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/api/users/register', registerUser); // register
router.post('/api/users/login', loginUser); // login

module.exports = router;
