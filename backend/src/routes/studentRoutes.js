const express = require('express');
const router = express.Router();
const { getStudentByRoll } = require('../controllers/studentController');
const { getSubjects } = require('../controllers/studentController');
const Subjects = require('../models/Subjects');

// Check if student exists
router.get('/student/:rollNo', getStudentByRoll);
router.get('/subjects', getSubjects);

// Get all subjects (for admin)
router.get('/subjects/all', async (req, res) => {
    try {
        const subjects = await Subjects.find({});
        return res.status(200).json(subjects);
    } catch (err) {
        console.error("Error fetching all subjects:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
