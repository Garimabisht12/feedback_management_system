const express = require('express');

const router = express.Router();

const {loginStudent} = require('../controllers/loginController')

router.post('/login', loginStudent)

module.exports = router;

