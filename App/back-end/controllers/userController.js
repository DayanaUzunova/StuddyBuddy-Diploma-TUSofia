const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserOnLogin } = require('../services/userService');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const passwordResetCodes = new Map();

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      throw new Error('Invalid params in register user!');
    }

    if (role === 'admin') {
      throw new Error('Cannot register an admin!');
    }

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
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

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

const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    passwordResetCodes.set(email, code);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset code sent' });
  } catch (error) {
    console.error('Error sending reset code:', error);
    res.status(500).json({ message: 'Failed to send reset code' });
  }
};

const verifyResetCode = (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const validCode = passwordResetCodes.get(email);

    if (!validCode || validCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.status(200).json({ message: 'Code verified' });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    res.status(500).json({ message: 'Failed to verify reset code' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    const validCode = passwordResetCodes.get(email);

    if (!validCode || validCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    passwordResetCodes.delete(email);
    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};


module.exports = { registerUser, loginUser, getUser, logoutUser, verifyResetCode, sendResetCode, resetPassword };
