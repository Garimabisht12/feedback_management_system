const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController')

const router = express.Router();

router.get('/', authMiddleware, getAllTeachers)
router.get('/:id', authMiddleware, getTeacherById)
router.post('/', authMiddleware, createTeacher )
router.put('/:id', authMiddleware, updateTeacher)
router.delete('/:id', authMiddleware, deleteTeacher)


module.exports = router;