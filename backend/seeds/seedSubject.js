require('dotenv').config();
const mongoose = require('mongoose');
const Subjects = require('../models/Subjects'); 

const MONGO_URI = process.env.MONGO_URI;

const subjects = [
  { session: '2025-26', semester: 4, batch: 1, subjectCode: 'CAT017', subjectName: 'Network Security', teacherName: 'Ms. Apoorva' },
  { session: '2025-26', semester: 4, batch: 1, subjectCode: 'AHT411', subjectName: 'Digital Marketing', teacherName: 'Mr. Nitin Chhimwal' },
  { session: '2025-26', semester: 4, batch: 1, subjectCode: 'CAT027', subjectName: 'Machine Learning', teacherName: 'Mr. Kaushal Bhatt' },
  { session: '2025-26', semester: 4, batch: 1, subjectCode: 'CAT032', subjectName: 'Natural Language Processing', teacherName: 'Mr. S. Dey' },
];



mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected!");

    await Subjects.deleteMany({});
    console.log("Existing subjects removed");

    const created = await Subjects.insertMany(subjects);
    console.log(`Seeded ${created.length} subjects`);

    mongoose.connection.close();
    console.log("MongoDB connection closed");
  })
  .catch(err => console.error("MongoDB connection error:", err));
