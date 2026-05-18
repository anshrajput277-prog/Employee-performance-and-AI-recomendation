const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

/**
 * Validation rules for signup
 */
const signupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signupValidation, validate, signup);

// @route   POST /api/auth/login
// @desc    Login and get token
router.post('/login', loginValidation, validate, login);

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
router.get('/profile', protect, getProfile);

module.exports = router;
