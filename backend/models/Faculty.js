const mongoose = require('mongoose');


const FacultySchema = mongoose.Schema({
    teacherName:{
        type: String,
        required: true,
    }, 
    department:{
        type: String,
        required: true,
    }, 
    subjectsTaught: {
        type: Array
    }
})

module.exports = mongoose.model('Faculty', FacultySchema);


