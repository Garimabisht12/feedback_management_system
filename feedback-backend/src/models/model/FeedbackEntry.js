const mongoose = require("mongoose");

const FeedbackEntrySchema = new mongoose.Schema({

  feedback_form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedbackForm",
    required: true,
  },

  subject_code: {
    type: String,
    required: true,
  },

  subject_name: {
    type: String,
    required: true,
  },

  teacher_name: {
    type: String,
    required: true,
  },

  syllabus_covered: {
    type: Number,
  },

  voice_communication: {
    type: Number,
    min: 1,
    max: 5,
  },

  regularity_punctuality: {
    type: Number,
    min: 1,
    max: 5,
  },

  ranking: {
    type: Number,
    min: 1,
    max: 10,
  },

  overall_performance: {
    type: Number,
    min: 1,
    max: 5,
  },

  parameter_ratings: {

    voice_skill: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    systematic_delivery: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    behaviour: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    interest_in_class: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    command_over_subject: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    discussion_examples: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    punctuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    class_control: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    accessibility: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    overall_teacher_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },

  total_score: {
    type: Number,
  },

  comment: {
    type: String,
  },

}, {
  timestamps: true,
});



module.exports = mongoose.model("FeedbackEntry", FeedbackEntrySchema);