const express = require('express');
const router = express.Router();
const { getStudentByRoll } = require('../controllers/studentController');

// Check if student exists
router.get('/student/:rollNo', getStudentByRoll);

module.exports = router;
