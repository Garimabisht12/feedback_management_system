const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();



const loginRoutes = require('./src/routes/login');
const subjectRoutes = require('./src/routes/studentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use('/api', loginRoutes);
app.use('/api', subjectRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', studentRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MONGODB successfully connected!!!")
        app.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        })
    })
    .catch(err => {
        console.log(`error connecting db: ${err}`)
    })

