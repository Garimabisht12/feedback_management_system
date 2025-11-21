const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    rollNo: {
        type: Number,
        required: true,
        unique: true,
    },
    studentName: {
        type: String,
        required: true,
    }, 
    course:{
        type: String,
        required: true,
    }, 
    branch:{
        type: String,
        required: true,
    },

})

module.exports = mongoose.model('Student', StudentSchema);




