const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// REGISTER route
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create and save user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // create JWT including username, role, and id
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route (any logged-in user)
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your profile',
    user: req.user
  });
});

// Admin-only route
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({
    message: 'Welcome Admin!',
    user: req.user
  });
});

module.exports = router;
