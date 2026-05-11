const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// const subjectRoutes = require('./src/routes/studentRoutes');


const loginRoutes = require('./src/routes/loginRoutes')
const teacherRoutes = require('./src/routes/teacherRoutes')
const subjectRoutes = require('./src/routes/subjectRoutes')
const assignmentRoutes = require('./src/routes/assignmentRoutes')
const studentRoutes = require('./src/routes/studentRoutes')


const feedbackRoutes = require('./src/routes/feedbackRoutes');

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

app.use('/api', loginRoutes)
app.use('/api/admin/teacher', teacherRoutes)
app.use('/api/admin/subject', subjectRoutes)
app.use('/api/admin/feedback', feedbackRoutes)
app.use('/api/admin/assignment', assignmentRoutes)
app.use('/api/student', studentRoutes)


// app.use('/test', loginRoutes)
// app.use('/test/admin/teacher', teacherRoutes)
// app.use('/test/admin/subject', subjectRoutes)
// app.use('/test/admin/assignment', assignmentRoutes)
// app.use('/test/student', studentRoutes)


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

