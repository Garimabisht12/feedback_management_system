const mongoose = require('mongoose')

const StudentSchema = mongoose.schema({
  roll_no:{
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
      require: true,
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
    },

  createdAt: Date

});


module.exports = mongoose.model('Student', StudentSchema)