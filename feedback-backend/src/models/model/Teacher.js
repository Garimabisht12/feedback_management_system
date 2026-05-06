const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
  name: {
        type: String,
        required: true,
    },
  department: {
        type: String,
        required: true,
    },
  createdAt: Date,
});


module.exports = mongoose.model('Teacher', TeacherSchema)