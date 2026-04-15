const express = require('express');
const router = express.Router();
const {loginAdmin} = require('../controllers/loginController');

const { getAllFeedbacks, getFeedbackCount, deleteFeedback,getAllTeachers, getTeacherById, addTeacher, updateTeacher, deleteTeacher, addSubjectToTeacher, removeSubjectFromTeacher, getTeachersByDepartment, getTeachersAnalytics,
    uploadSubjects,
    uploadStudents
  } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// LOGIN ROUTES
router.post('/login', loginAdmin);


// feedback related routes

router.get('/feedbacks',adminAuth, getAllFeedbacks); //get all feedbacks
router.get('/feedbacks/count',adminAuth, getFeedbackCount); //get total feedback count
router.delete('/feedbacks/:id',adminAuth, deleteFeedback); //delete feedback by id


// teacher related routes

router.get('/teachers',adminAuth, getAllTeachers); //get all teachers
router.get('/teachers/analytics',adminAuth, getTeachersAnalytics); //get aggregated analytics for all teachers (uses subjectsTaught + feedback data) - MUST BE BEFORE :id
router.get('/teachers/department/:department', adminAuth, getTeachersByDepartment); //get teachers by department
router.get('/teachers/:id', adminAuth,getTeacherById); //get single teacher by id
router.post('/teachers', adminAuth,addTeacher); //add new teacher
router.put('/teachers/:id', adminAuth, updateTeacher); //update teacher
router.delete('/teachers/:id', adminAuth,deleteTeacher); //delete teacher
router.post('/teachers/:id/subjects',adminAuth, addSubjectToTeacher); //add subject to teacher
router.delete('/teachers/:id/subjects',adminAuth, removeSubjectFromTeacher); //remove subject from teacher    


// upload routes for subjects and students
router.post('/uploadSubjects',adminAuth, uploadSubjects);
router.post('/uploadStudents',adminAuth, uploadStudents);    

module.exports = router;