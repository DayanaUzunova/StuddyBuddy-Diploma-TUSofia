const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserOnLogin } = require('../services/userService');

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      throw new Error('Invalid params in register user!');
    };

    if (role === 'admin') {
      throw new Error('Cannot register an admin!');
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      throw new Error('Invalid email!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    const jwt = generateToken(user?.id, username, email, role);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      token: jwt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Моля, попълнете всички полета' });
    }

    const user = await getUserOnLogin(email);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid user or password!' });
    }

    const jwt = generateToken(user.id, user.username, user.email, user.role);

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


const getUser = async (req, res) => {
  try {
    const { id, username, email, role } = req.user;
    res.json({ id, username, email, role });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message })
  }
}

const generateToken = (id, username, email, role) => {
  return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { registerUser, loginUser, getUser, logoutUser };
