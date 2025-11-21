// routes/subjects.js
const express = require('express');
const router = express.Router();
const { getSubjects } = require('../controllers/subjectController');

router.get('/subjects', getSubjects);

module.exports = router;
