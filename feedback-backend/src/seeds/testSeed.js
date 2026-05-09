const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '../../.env' });

const Student = require('../models/model/Student');
const Admin = require('../models/model/Admin');

async function seed() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    // clear old data
    await Student.deleteMany({});
    await Admin.deleteMany({});

    // 🔐 hash passwords
    const studentPassword = await bcrypt.hash("student123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    // ✅ 1 Student
    const student = await Student.create({
      rollNo: 101,
      name: "Garima Bisht",
      password: studentPassword,
      course: "BTech",
      branch: "CSE",
      semester: 5,
      batch: 1
    });

    // ✅ 1 Admin
    const admin = await Admin.create({
      email: "admin@gmail.com",
      password: adminPassword
    });

    console.log("Seed successful");
    console.log({ student, admin });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();