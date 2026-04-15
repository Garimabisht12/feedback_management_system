// models/Subjects.js
const mongoose = require('mongoose');

const SubjectsSchema = new mongoose.Schema({
  session: { type: String, required: true },
  semester: { type: Number, required: true },
  batch: { type: Number },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  teacherName: { type: String, required: true }
});

SubjectsSchema.index(
  { session: 1, semester: 1, batch: 1, subjectCode: 1 },
  { unique: true }
);

module.exports = mongoose.model('Subject', SubjectsSchema);
