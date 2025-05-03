const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Регистрация на потребител
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Проверка дали потребителят съществува
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Имейлът вече се използва' });
    }

    // Създаване на нов потребител
    const user = await User.create({ username, email, password, firstName, lastName, role });

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Грешка при регистрация' });
  }
};

// Вход на потребител
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    };

    const user = await User.findOne({ email }); // 

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Wrong credentials or invalid user!' });
    };

    const token = generateToken(user._id);

    console.log(token);

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: 'Грешка при влизане' });
  }
};

// Генериране на JWT токен
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser };
