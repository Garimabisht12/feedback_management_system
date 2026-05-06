const mongoose = require('mongoose')

const SubjectSchema = mongoose.Schema({
  name: {
        type: String,
        required: true,
    },
    
  semester: {
        type: Number,
        required: true,
    },
  subjectCode: {
        type: String,
        required: true,
    },
  createdAt: Date,
});

module.exports = mongoose.model('Subject', SubjectSchema)