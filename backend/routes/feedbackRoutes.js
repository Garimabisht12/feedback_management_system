// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const { submitFeedback, checkFeedbackStatus } = require('../controllers/feedbackController');

router.post('/feedback', submitFeedback);
router.get("/feedback-status/:rollNumber", checkFeedbackStatus);


module.exports = router;
