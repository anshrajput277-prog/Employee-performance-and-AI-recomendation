const express = require('express');
const router = express.Router();
const { getAIRecommendation, rankAllEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// ─── Routes ──────────────────────────────────────────────────────────────────

// @route   POST /api/ai/recommend
// @desc    Get AI recommendation for a single employee
// @body    { employeeId } OR { employee: { name, department, skills, performanceScore, experience } }
router.post('/recommend', protect, getAIRecommendation);

// @route   POST /api/ai/rank-all
// @desc    AI-powered ranking of all employees
router.post('/rank-all', protect, rankAllEmployees);

module.exports = router;
