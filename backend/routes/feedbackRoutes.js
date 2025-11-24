// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, checkFeedbackStatus, getFeedbackAnalytics, getTeacherAnalytics } = require('../src/controllers/feedbackController');

router.post('/feedback', submitFeedback);
router.get("/feedback-status/:rollNumber", checkFeedbackStatus);
router.get("/feedback/analytics", getFeedbackAnalytics);
router.get("/feedback/teacher/:teacherName", getTeacherAnalytics);


module.exports = router;
