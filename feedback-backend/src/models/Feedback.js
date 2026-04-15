const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentRoll: String,
  session: String,
  semester: Number,
  batch: Number,

  ratings: {
    type: Map,
    of: [Number], // KEY FIX: array of numbers
  },

  overallData: {
    type: Map,
    of: {
      syllabus: Number,
      voice: Number,
      regularity: Number
    }
  },

  comments: String,
  bestTeachers: [String],
  suggestions: String,
  submittedAt: Date
});

module.exports = mongoose.model('Feedback', feedbackSchema);