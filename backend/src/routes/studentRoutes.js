const express = require('express');
const router = express.Router();
const { getStudentByRoll } = require('../controllers/studentController');
const { getSubjects } = require('../controllers/studentController');

// Check if student exists
router.get('/student/:rollNo', getStudentByRoll);
router.get('/subjects', getSubjects);

module.exports = router;
