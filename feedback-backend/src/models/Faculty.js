const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  subjectsTaught: {
    type: [String]
  }
});

module.exports = mongoose.model('Faculty', FacultySchema);