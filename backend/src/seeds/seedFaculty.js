require('dotenv').config();
const mongoose = require('mongoose');
const Faculty = require('../models/Faculty'); 

const MONGO_URI = process.env.MONGO_URI;

const faculties = [
  { teacherName: 'Dr. Shilpi', department: 'CSE', subjectsTaught: ['EMATH'] },
  { teacherName: 'Mr. Harendra', department: 'CSE', subjectsTaught: ['PHY'] },
  { teacherName: 'Mr. Indra', department: 'EEE', subjectsTaught: ['BEE'] },
  { teacherName: 'Dr. Sandesh', department: 'CSE', subjectsTaught: ['PPS'] },
  { teacherName: 'Mr. Kuber', department: 'CSE', subjectsTaught: ['EG', 'MECH'] },
  { teacherName: 'Mr. Nitin', department: 'CSE', subjectsTaught: ['IE'] },
  { teacherName: 'Mr. Himanshu', department: 'ECE', subjectsTaught: ['EVS', 'MECH'] },
  { teacherName: 'Mr. Rohit', department: 'CSE', subjectsTaught: ['DM'] },
  { teacherName: 'Dr. Neha', department: 'CSE', subjectsTaught: ['EMATH'] },
  { teacherName: 'Dr. Devendra', department: 'CSE', subjectsTaught: ['ECHEM'] },
  { teacherName: 'Mr. Rakesh', department: 'EEE', subjectsTaught: ['BE'] },
  { teacherName: 'Mr. Abhilash', department: 'CSE', subjectsTaught: ['IOT', 'ET'] },
  { teacherName: 'Dr. Tanuja', department: 'ECE', subjectsTaught: [] },
  { teacherName: 'Mr. Peeyush', department: 'ECE', subjectsTaught: [] },
];




mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    await Faculty.deleteMany({});
    console.log("Existing faculty removed");

    const created = await Faculty.insertMany(faculties);
    console.log(`Seeded ${created.length} faculty`);

    mongoose.connection.close();
    console.log("MongoDB connection closed");
  })
  .catch(err => console.error("MongoDB connection error:", err));
