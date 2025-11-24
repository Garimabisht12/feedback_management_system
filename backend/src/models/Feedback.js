// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  studentRoll: { type: Number, required: true, unique: true },
  session: { type: String, required: true },
  semester: { type: Number, required: true },
  batch: { type: Number, required: true },
  ratings: { type: Map, of: [Number], required: true }, // Example: { "Math": [4,5,5] }
  overallData: {
    type: Map,
    of: new mongoose.Schema({
      syllabus: String,
      voice: String,
      regularity: String,
      ranking: Number,
      overall: String
    }),
    required: true
  },
  comments: { type: String },
  bestTeachers: { type: [String], required: true },
  suggestions: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
