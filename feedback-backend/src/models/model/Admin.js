const mongoose = require('mongoose')

const AdminSchema =  mongoose.Schema({
   email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
  createdAt: Date,
})


module.exports = mongoose.model('Admin', AdminSchema)