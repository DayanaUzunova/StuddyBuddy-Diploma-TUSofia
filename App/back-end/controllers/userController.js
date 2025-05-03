const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    };

    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid user or password!' })
    };

    const jwt = generateToken(user?.id, user?.username, user?.email, user?.role);

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      token: jwt
    });
  } catch (err) {
    console.log(err);
  }
};

const generateToken = (id, username, email, role) => {
  return jwt.sign({ id, username, email, role }, process.env.JWT_SECRET, { expiresIn: '10s' });
};

module.exports = { registerUser, loginUser };
