const express = require('express');
const {loginStudent, loginAdmin} = require('../../controllers/modifiedControllers/loginController')
const authMiddleware = require('../../middleware/authMiddleware')

const router = express.Router();

// Student Login
router.post('/student', loginStudent)

// Admin Login
router.post('/admin', loginAdmin)


module.exports = router;