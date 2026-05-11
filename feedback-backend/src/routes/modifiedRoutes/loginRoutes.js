const express = require('express');
const {loginStudent, loginAdmin, registerStudent} = require('../../controllers/modifiedControllers/loginController')
const authMiddleware = require('../../middleware/authMiddleware')

const router = express.Router();

// Student Login
router.post('/student/login', loginStudent)

// Admin Login
router.post('/admin/login', loginAdmin)

router.post("/student/register", registerStudent)

module.exports = router;