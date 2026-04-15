const express = require('express');
const router = express.Router();
const { getStudentByRoll, getSubjects } = require('../controllers/studentController');
const Subject = require('../models/Subject');
const { loginStudent } = require('../controllers/loginController');

//login route for students
router.post('/login', loginStudent);

// Check if student exists
router.get('/student/:rollNo', getStudentByRoll);
router.get('/subjects/:session/:semester/:batch', getSubjects);

// Get all subjects (for admin)
router.get('/subjects/all', async (req, res) => {
    try {
        const subjects = await Subject.find({});
        return res.status(200).json(subjects);
    } catch (err) {
        console.error("Error fetching all subjects:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
