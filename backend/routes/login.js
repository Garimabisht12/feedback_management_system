const express = require('express');

const router = express.Router();

const {loginStudent, loginAdmin} = require('../controllers/loginController');
// const adminAuth = require('../middleware/AdminAuth');

router.post('/login', loginStudent)
router.post('/admin/login', loginAdmin)

module.exports = router;

