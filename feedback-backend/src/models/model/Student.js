const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema({
  rollNo:{
    type: Number,
    required: true,
    unique: true,
  },
  name: {
        type: String,
        required: true,
    },
  password: {
        type: String,
        required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required : true,
    },
  semester: {
        type: Number,
        required: true,
    },
  batch: {
        type: Number,
        required: true,
    }


}, { timestamps: true });


module.exports = mongoose.model('Student', StudentSchema);