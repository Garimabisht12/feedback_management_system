const express = require('express');
const { fetchSubjects } = require('../../controllers/modifiedControllers/studentController');
const authStudent = require('../../middleware/authStudent');
const { submitFeedback, checkStatus } = require('../../controllers/modifiedControllers/feedbackController');
const router = express.Router();


router.get('/subjects', authStudent ,fetchSubjects);
router.post('/feedback/submit', authStudent, submitFeedback)
router.get('feedback/status', authStudent, checkStatus)

module.exports = router;