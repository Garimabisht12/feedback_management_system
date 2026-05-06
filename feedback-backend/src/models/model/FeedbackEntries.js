const mongoose = require("mongoose");

const FeedbackEntriesSchema =  mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedbackForm'

  },

  teaching_assignments_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeachingAssignment'
  },

  overall: {
    type: Object,
  },
  ratings: {
    type: Object,
  },
  comments: {
        type: String,
        required: true,
    },
  createdAt: Date,
})


module.exports = mongoose.model('FeedbackEntries', FeedbackEntriesSchema)