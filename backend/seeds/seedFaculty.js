require('dotenv').config();
const mongoose = require('mongoose');
const Faculty = require('../models/Faculty'); 

const MONGO_URI = process.env.MONGO_URI;

const faculties = [
  { teacherName: 'Ms. Apoorva', department: 'CSE', subjectsTaught: ['CAT017'] },
  { teacherName: 'Mr. Nitin Chhimwal', department: 'MCA', subjectsTaught: ['AHT411'] },
  { teacherName: 'Mr. Kaushal Bhatt', department: 'CSE', subjectsTaught: ['CAT027'] },
  { teacherName: 'Mr. S. Dey', department: 'CSE', subjectsTaught: ['CAT032'] },
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
