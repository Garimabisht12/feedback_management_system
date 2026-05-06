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
  createdAt: Date,
})


module.exports = mongoose.model('TeachingAssignment', TeachingAssignmentSchema)