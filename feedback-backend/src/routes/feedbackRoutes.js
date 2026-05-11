const express = require('express')
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware')

const {getAllFeedback, getFeedbackById, getTeacherAnalytics, getSubjectAnalytics} = require('../controllers/adminFeedbackController')


router.get('/', authMiddleWare, getAllFeedback)
router.get('/:id', authMiddleWare, getFeedbackById)
router.get('/teacher/:teacherName', authMiddleWare, getTeacherAnalytics)
router.get('/subject/:subjectCode', authMiddleWare, getSubjectAnalytics)




module.exports = router;