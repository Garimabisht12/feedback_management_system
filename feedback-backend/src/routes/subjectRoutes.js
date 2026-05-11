const express = require('express')
const router = express.Router();

const {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject
  } = require('../controllers/subjectController')

router.get('/', getAllSubjects);

router.post('/', createSubject);


// router.put('/:id', updateSubject);

// router.delete('/:id', deleteSubject);


module.exports = router;