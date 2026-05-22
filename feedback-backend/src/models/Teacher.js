const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
 name: {
  type: String,
  required: true,
  unique: true
},
  department: {
        type: String,
        required: true,
    },

}, { timestamps: true });


module.exports = mongoose.model('Teacher', TeacherSchema)