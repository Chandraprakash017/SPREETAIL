const authService = require('../services/authService');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);

    res.status(200).json({ message: 'Login successful', ...data });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
};
