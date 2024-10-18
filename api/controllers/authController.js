const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const lowerRole = role.toLowerCase();

    const user = await User.create({ username, email, password: hashedPassword, role: lowerRole });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(422).json({ message: 'Error registering user', err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(422).json({ message: 'Error logging in', err });
  }
};

module.exports = { register, login };
