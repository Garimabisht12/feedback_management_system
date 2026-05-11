const express = require('express');
const { fetchSubjects } = require('../../controllers/modifiedControllers/studentController');
const authStudent = require('../../middleware/authStudent');
const router = express.Router();


router.get('/subjects', authStudent ,fetchSubjects);


module.exports = router;