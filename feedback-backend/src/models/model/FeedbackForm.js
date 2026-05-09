const mongoose = require('mongoose')

const FeedbackFormSchema =  mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  course: {
      type: String,
      require: true,
    },
    branch: {
      type: String,
      required : true,
    },
  batch: {
        type: Number,
        required: true,
    },
  semester: {
        type: Number,
        required: true,
    },
  session: {
    type: String,
    required: true,
  },
}, { timestamps: true })


module.exports = mongoose.model('FeedbackForm', FeedbackFormSchema)