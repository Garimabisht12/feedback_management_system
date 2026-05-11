const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createAssignment, getAllAssignments, getAssignedSubjectByTeacherId, deleteAssignment, updateAssignment } = require('../controllers/teacherAssignmentController');




const router = express.Router();


router.post('/', authMiddleware, createAssignment);
router.get('/',authMiddleware, getAllAssignments);
router.get('/teacher/:teacherId', authMiddleware, getAssignedSubjectByTeacherId);
router.delete('/:id',authMiddleware, deleteAssignment);
router.put('/:id', authMiddleware, updateAssignment);



module.exports = router;