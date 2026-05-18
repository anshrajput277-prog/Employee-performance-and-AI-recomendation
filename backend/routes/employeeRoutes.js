const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

/**
 * Validation rules for creating/updating an employee
 */
const employeeValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('department')
    .notEmpty().withMessage('Department is required')
    .isIn(['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'])
    .withMessage('Invalid department'),
  body('skills')
    .isArray({ min: 1 }).withMessage('Skills must be a non-empty array'),
  body('performanceScore')
    .notEmpty().withMessage('Performance score is required')
    .isFloat({ min: 0, max: 100 }).withMessage('Performance score must be between 0 and 100'),
  body('experience')
    .notEmpty().withMessage('Experience is required')
    .isFloat({ min: 0 }).withMessage('Experience cannot be negative'),
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// @route   GET /api/employees/search
// @desc    Search employees by filters (must be before /:id)
router.get('/search', protect, searchEmployees);

// @route   POST /api/employees
// @desc    Add new employee
router.post('/', protect, employeeValidation, validate, addEmployee);

// @route   GET /api/employees
// @desc    Get all employees
router.get('/', protect, getAllEmployees);

// @route   GET /api/employees/:id
// @desc    Get single employee by ID
router.get('/:id', protect, getEmployeeById);

// @route   PUT /api/employees/:id
// @desc    Update employee
router.put('/:id', protect, updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
