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
 
}, { timestamps: true })


module.exports = mongoose.model('FeedbackEntries', FeedbackEntriesSchema)