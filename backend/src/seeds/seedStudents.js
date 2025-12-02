require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');

const MONGO_URI = process.env.MONGO_URI;

const students = [
  // Batch 1 (Roll No: 1–10)
  { rollNo: 1, studentName: 'Arjun Singh', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 2, studentName: 'Riya Sharma', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 3, studentName: 'Vivek Kumar', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 4, studentName: 'Aditi Verma', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 5, studentName: 'Manish Gupta', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 6, studentName: 'Divya Mital', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 7, studentName: 'Harshit Mehra', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 8, studentName: 'Sneha Rawat', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 9, studentName: 'Rahul Sati', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },
  { rollNo: 10, studentName: 'Nisha Dobhal', course: 'BTech', branch: 'CSE', semester: 1, batch: 1, session: '2025-26' },

  // Batch 2 (Roll No: 11–20)
  { rollNo: 11, studentName: 'Kunal Joshi', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 12, studentName: 'Priya Chauhan', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 13, studentName: 'Aditya Negi', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 14, studentName: 'Ishita Khanna', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 15, studentName: 'Rohit Kandpal', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 16, studentName: 'Tanya Bhandari', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 17, studentName: 'Ayush Raj', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 18, studentName: 'Heena Saxena', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 19, studentName: 'Sarthak Mishra', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },
  { rollNo: 20, studentName: 'Deepika Bhatt', course: 'BTech', branch: 'CSE', semester: 1, batch: 2, session: '2025-26' },

  // Batch 3 (Roll No: 21–30)
  { rollNo: 21, studentName: 'Aman Tiwari', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 22, studentName: 'Muskan Agarwal', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 23, studentName: 'Shubham Rawal', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 24, studentName: 'Preeti Singh', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 25, studentName: 'Kartik Nautiyal', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 26, studentName: 'Ruchika Phonia', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 27, studentName: 'Shivam Yadav', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 28, studentName: 'Anjali Thapa', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 29, studentName: 'Harsh Vohra', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
  { rollNo: 30, studentName: 'Naman Uniyal', course: 'BTech', branch: 'CSE', semester: 1, batch: 3, session: '2025-26' },
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
