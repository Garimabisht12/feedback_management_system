const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');

mongoose.connect(MONGO_URI)
    .then(async () =>{
        console.log('mongo db connected')
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await Admin.create({ email: "admin@123.com", password: hashedPassword });
      console.log("Admin created");
        mongoose.connection.close();
          console.log("MongoDB connection closed");
    })
    .catch(err => {
        console.log('error connecting')
    console.log(err)
    } )

