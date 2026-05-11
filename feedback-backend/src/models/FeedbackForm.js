const mongoose = require('mongoose')

const FeedbackFormSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },

  course: {
    type: String,
    required: true,
  },

  branch: {
    type: String,
    required: true,
  },

  batch: {
    type: Number,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
  },

 feedback_entries: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedbackEntry",
  }
],

  best_teachers: [String],

  suggestions: {
    type: String,
  },

}, {
  timestamps: true,
});


FeedbackFormSchema.index(
  { studentId: 1, semester: 1, batch: 1 },
  { unique: true }
);


module.exports = mongoose.model("FeedbackForm", FeedbackFormSchema);

