const axios = require('axios');
const Employee = require('../models/Employee');

/**
 * @desc    Get AI-powered recommendation for a single employee
 * @route   POST /api/ai/recommend
 * @access  Protected
 * @body    { employeeId } OR { employee: { name, department, skills, performanceScore, experience } }
 */
const getAIRecommendation = async (req, res) => {
  try {
    let employeeData;

    // Accept either an ID (look up from DB) or raw employee data
    if (req.body.employeeId) {
      const employee = await Employee.findById(req.body.employeeId);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        });
      }
      employeeData = employee;
    } else if (req.body.employee) {
      employeeData = req.body.employee;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide employeeId or employee data',
      });
    }

    const { name, department, skills, performanceScore, experience } = employeeData;

    // Build AI prompt
    const prompt = `You are an expert HR analytics AI. Analyze the following employee data and provide:
1. Promotion Recommendation (Yes/No with justification)
2. Performance Ranking (Excellent/Good/Average/Below Average)
3. Training Suggestions (list 2-3 specific courses/skills to improve)
4. AI Feedback (2-3 sentences of personalized career advice)

Employee Data:
- Name: ${name}
- Department: ${department}
- Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
- Performance Score: ${performanceScore}/100
- Years of Experience: ${experience}

Respond in this exact JSON format:
{
  "promotionRecommendation": { "eligible": true/false, "reason": "..." },
  "performanceRanking": "Excellent/Good/Average/Below Average",
  "trainingSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "aiFeedback": "..."
}`;

    // Call OpenRouter API (OpenAI compatible)
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'ESE Employee Analytics',
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;

    // Parse JSON from AI response
    let aiResult;
    try {
      // Extract JSON block if AI wraps it in markdown
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawContent);
    } catch (parseErr) {
      // Return raw text if JSON parsing fails
      aiResult = { rawResponse: rawContent };
    }

    res.status(200).json({
      success: true,
      message: 'AI recommendation generated successfully',
      employee: { name, department, performanceScore, experience },
      recommendation: aiResult,
    });
  } catch (error) {
    // Handle API key / network errors gracefully
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'AI API error',
        error: error.response.data?.error?.message || error.response.data,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during AI recommendation',
      error: error.message,
    });
  }
};

/**
 * @desc    Rank all employees using AI analysis
 * @route   POST /api/ai/rank-all
 * @access  Protected
 */
const rankAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No employees found in the database',
      });
    }

    const employeeList = employees.map((e, index) => ({
      rank: index + 1,
      name: e.name,
      department: e.department,
      performanceScore: e.performanceScore,
      experience: e.experience,
      skills: e.skills,
    }));

    const prompt = `You are an HR Analytics AI. Rank the following employees and provide insights.

Employees (sorted by performance score):
${JSON.stringify(employeeList, null, 2)}

Provide a JSON response with:
{
  "topPerformer": { "name": "...", "reason": "..." },
  "promotionCandidates": ["name1", "name2"],
  "needsImprovement": ["name1", "name2"],
  "overallInsight": "2-3 sentences about the team"
}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'ESE Employee Analytics',
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;
    let aiResult;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawContent);
    } catch {
      aiResult = { rawResponse: rawContent };
    }

    res.status(200).json({
      success: true,
      message: 'Employee ranking generated successfully',
      totalEmployees: employees.length,
      rankedEmployees: employeeList,
      aiAnalysis: aiResult,
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'AI API error',
        error: error.response.data?.error?.message || error.response.data,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during AI ranking',
      error: error.message,
    });
  }
};

module.exports = { getAIRecommendation, rankAllEmployees };
