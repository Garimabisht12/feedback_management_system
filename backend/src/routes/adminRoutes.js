// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
    // Feedback Management
    getAllFeedbacks,
    getFeedbackCount,
    getFeedbackById,
    deleteFeedback,

    // Teacher Management
    getAllTeachers,
    getTeacherById,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addSubjectToTeacher,
    removeSubjectFromTeacher,
    getTeachersByDepartment,
    getTeachersAnalytics
} = require('../controllers/adminController');

const { uploadSubjects } = require('../controllers/feedbackController');

// ================== FEEDBACK ROUTES ==================

// Get all feedbacks
router.get('/feedbacks', getAllFeedbacks);

// Get total feedback count
router.get('/feedbacks/count', getFeedbackCount);

// Get single feedback by ID
router.get('/feedbacks/:id', getFeedbackById);

// Delete feedback
router.delete('/feedbacks/:id', deleteFeedback);

// ================== TEACHER ROUTES ==================

// Get all teachers
router.get('/teachers', getAllTeachers);

// Aggregated analytics for all teachers (uses subjectsTaught + feedback data) - MUST BE BEFORE :id
router.get('/teachers/analytics', getTeachersAnalytics);

// Get teachers by department
router.get('/teachers/department/:department', getTeachersByDepartment);

// Get single teacher by ID
router.get('/teachers/:id', getTeacherById);

// Add new teacher
router.post('/teachers', addTeacher);

// Update teacher
router.put('/teachers/:id', updateTeacher);

// Delete teacher
router.delete('/teachers/:id', deleteTeacher);

// Add subject to teacher
router.patch('/teachers/:id/subjects', addSubjectToTeacher);

// Remove subject from teacher
router.patch('/teachers/:id/subjects/remove', removeSubjectFromTeacher);

// ================== UPLOAD ROUTES ==================

// Upload subjects and faculty
router.post('/uploadSubjects', uploadSubjects);

module.exports = router;
