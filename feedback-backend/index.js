const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// const subjectRoutes = require('./src/routes/studentRoutes');


const loginRoutes = require('./src/routes/modifiedRoutes/loginRoutes')
const teacherRoutes = require('./src/routes/modifiedRoutes/teacherRoutes')
const subjectRoutes = require('./src/routes/modifiedRoutes/subjectRoutes')
const assignmentRoutes = require('./src/routes/modifiedRoutes/assignmentRoutes')
const studentRoutes = require('./src/routes/modifiedRoutes/studentRoutes')


const feedbackRoutes = require('./src/routes/feedbackRoutes');
// const studentRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express()
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

app.use(express.json())

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.get('/', (req, res)=>{
    res.send('Backend Working!')
})

app.use('/test', loginRoutes)
app.use('/test/admin/teacher', teacherRoutes)
app.use('/test/admin/subject', subjectRoutes)
app.use('/test/admin/assignment', assignmentRoutes)
app.use('/test/student', studentRoutes)

app.use('/api', studentRoutes);
app.use('/api', feedbackRoutes);
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

