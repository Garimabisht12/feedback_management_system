const express = require('express');
const router = express.Router();
const { uploadSubjects } = require('../controllers/feedbackController');

// Route to handle uploading subjects and faculty
router.post('/uploadSubjects', uploadSubjects);

module.exports = router;