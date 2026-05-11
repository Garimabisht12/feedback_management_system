const mongoose = require('mongoose')

const TeachingAssignmentSchema = mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  },
  semester: {
        type: Number,
        required: true,
    },
  batch: {
        type: Number,
        required: true,
    },
    course: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    }
}, { timestamps: true })


module.exports = mongoose.model('TeachingAssignment', TeachingAssignmentSchema)