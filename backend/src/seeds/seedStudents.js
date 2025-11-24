require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student'); 

const MONGO_URI = process.env.MONGO_URI;

const students = [
  { rollNo: 1, studentName: 'Garima Bisht', course: 'MCA', branch: 'CSE' },
  { rollNo: 2, studentName: 'Rohan Sharma', course: 'MCA', branch: 'IT' },
  { rollNo: 3, studentName: 'Anita Singh', course: 'BTech', branch: 'ECE' },

];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    await Student.deleteMany({});
    console.log("Existing students removed");

    const created = await Student.insertMany(students);
    console.log(`Seeded ${created.length} students`);

    mongoose.connection.close();
    console.log("MongoDB connection closed");
  })
  .catch(err => console.error("MongoDB connection error:", err));
