const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();



const loginRoutes = require('./routes/login');
const subjectRoutes = require('./routes/subjectsRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const studentRoutes = require('./routes/studentRoutes');

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

const PORT  = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(() => {
        console.log("MONGODB successfully connected!!!")
        app.listen(PORT, () => {
            console.log(`server running on ${PORT}`);
        })
    })
    .catch(err =>{
        console.log(`error connecting db: ${err}`)
    })
    
    