require('dotenv').config();
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');

const MONGO_URI = process.env.MONGO_URI;

const feedbacks = [
    {
    studentRoll: 102,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [4, 4, 3, 4, 4, 3, 4, 3, 4, 4]],
        ['AHT411', [3, 2, 3, 3, 3, 3, 3, 2, 3, 3]],
        ['CAT027', [5, 4, 4, 4, 5, 4, 5, 4, 4, 5]],
        ['CAT032', [5, 5, 5, 4, 5, 5, 5, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '85%', voice: '7', regularity: '8', ranking: 5, overall: 'Good' }],
        ['AHT411', { syllabus: '70%', voice: '6', regularity: '6', ranking: 4, overall: 'Average' }],
        ['CAT027', { syllabus: '95%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '100%', voice: '10', regularity: '10', ranking: 7, overall: 'Excellent' }]
    ]),
    comments: 'Good teaching overall.',
    bestTeachers: ['Mr. S. Dey', 'Mr. Kaushal Bhatt'],
    suggestions: 'Add more real-world projects.',
    submittedAt: new Date(),
},
{
    studentRoll: 103,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [5, 5, 4, 4, 5, 4, 5, 5, 4, 5]],
        ['AHT411', [3, 4, 3, 4, 3, 4, 3, 3, 4, 3]],
        ['CAT027', [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]],
        ['CAT032', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '92%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }],
        ['AHT411', { syllabus: '70%', voice: '7', regularity: '7', ranking: 5, overall: 'Good' }],
        ['CAT027', { syllabus: '88%', voice: '8', regularity: '8', ranking: 6, overall: 'Good' }],
        ['CAT032', { syllabus: '100%', voice: '10', regularity: '10', ranking: 7, overall: 'Outstanding' }]
    ]),
    comments: 'Classes were helpful.',
    bestTeachers: ['Ms. Apoorva', 'Mr. S. Dey'],
    suggestions: 'More lab examples required.',
    submittedAt: new Date(),
},
{
    studentRoll: 104,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [3, 3, 3, 3, 3, 4, 4, 3, 3, 4]],
        ['AHT411', [2, 3, 3, 2, 2, 3, 3, 2, 3, 2]],
        ['CAT027', [5, 5, 4, 5, 4, 5, 4, 4, 5, 5]],
        ['CAT032', [5, 4, 5, 5, 4, 5, 5, 4, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '80%', voice: '7', regularity: '7', ranking: 4, overall: 'Average' }],
        ['AHT411', { syllabus: '60%', voice: '5', regularity: '5', ranking: 3, overall: 'Average' }],
        ['CAT027', { syllabus: '90%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '95%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }]
    ]),
    comments: 'Some subjects need improvement.',
    bestTeachers: ['Mr. Kaushal Bhatt'],
    suggestions: 'Increase interaction.',
    submittedAt: new Date(),
},
{
    studentRoll: 105,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [4, 4, 4, 5, 4, 4, 5, 4, 4, 5]],
        ['AHT411', [3, 3, 4, 3, 4, 3, 4, 3, 3, 3]],
        ['CAT027', [4, 5, 5, 5, 4, 5, 5, 5, 5, 4]],
        ['CAT032', [5, 5, 4, 5, 5, 5, 4, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '88%', voice: '8', regularity: '8', ranking: 5, overall: 'Good' }],
        ['AHT411', { syllabus: '75%', voice: '7', regularity: '7', ranking: 5, overall: 'Good' }],
        ['CAT027', { syllabus: '92%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '98%', voice: '10', regularity: '10', ranking: 7, overall: 'Excellent' }]
    ]),
    comments: 'Overall great learning.',
    bestTeachers: ['Ms. Apoorva', 'Mr. Kaushal Bhatt'],
    suggestions: 'More doubt sessions.',
    submittedAt: new Date(),
},
{
    studentRoll: 106,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [3, 3, 4, 3, 3, 3, 4, 3, 4, 3]],
        ['AHT411', [2, 2, 3, 2, 3, 2, 3, 3, 2, 2]],
        ['CAT027', [5, 4, 5, 4, 5, 5, 4, 4, 5, 4]],
        ['CAT032', [4, 5, 4, 5, 4, 5, 4, 5, 4, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '75%', voice: '6', regularity: '7', ranking: 4, overall: 'Average' }],
        ['AHT411', { syllabus: '55%', voice: '5', regularity: '5', ranking: 3, overall: 'Average' }],
        ['CAT027', { syllabus: '90%', voice: '9', regularity: '9', ranking: 6, overall: 'Good' }],
        ['CAT032', { syllabus: '95%', voice: '9', regularity: '10', ranking: 6, overall: 'Very Good' }]
    ]),
    comments: 'Some subjects were difficult.',
    bestTeachers: ['Mr. S. Dey'],
    suggestions: 'Provide more notes.',
    submittedAt: new Date(),
},
{
    studentRoll: 107,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [4, 5, 4, 5, 4, 5, 4, 4, 5, 4]],
        ['AHT411', [3, 3, 3, 3, 4, 3, 3, 2, 3, 3]],
        ['CAT027', [4, 4, 4, 5, 5, 4, 5, 4, 5, 5]],
        ['CAT032', [5, 5, 5, 5, 5, 5, 5, 5, 4, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '90%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }],
        ['AHT411', { syllabus: '70%', voice: '7', regularity: '6', ranking: 4, overall: 'Good' }],
        ['CAT027', { syllabus: '93%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '100%', voice: '10', regularity: '10', ranking: 7, overall: 'Outstanding' }]
    ]),
    comments: 'Very supportive teachers.',
    bestTeachers: ['Mr. Kaushal Bhatt', 'Ms. Apoorva'],
    suggestions: 'Include quizzes.',
    submittedAt: new Date(),
},
{
    studentRoll: 108,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [3, 4, 3, 4, 3, 4, 4, 3, 4, 3]],
        ['AHT411', [3, 2, 3, 2, 3, 3, 2, 2, 3, 3]],
        ['CAT027', [5, 5, 5, 4, 4, 5, 5, 5, 5, 5]],
        ['CAT032', [5, 5, 5, 5, 4, 4, 5, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '82%', voice: '7', regularity: '7', ranking: 5, overall: 'Good' }],
        ['AHT411', { syllabus: '65%', voice: '6', regularity: '6', ranking: 4, overall: 'Average' }],
        ['CAT027', { syllabus: '94%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '97%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }]
    ]),
    comments: 'Good experience overall.',
    bestTeachers: ['Mr. S. Dey'],
    suggestions: 'Better explanation needed for theory topics.',
    submittedAt: new Date(),
},
{
    studentRoll: 109,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [5, 4, 4, 5, 4, 5, 4, 4, 5, 4]],
        ['AHT411', [2, 3, 2, 3, 2, 3, 3, 3, 2, 3]],
        ['CAT027', [4, 4, 4, 4, 5, 4, 4, 5, 5, 4]],
        ['CAT032', [5, 5, 4, 4, 5, 5, 4, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '88%', voice: '8', regularity: '9', ranking: 5, overall: 'Very Good' }],
        ['AHT411', { syllabus: '60%', voice: '6', regularity: '6', ranking: 3, overall: 'Average' }],
        ['CAT027', { syllabus: '90%', voice: '9', regularity: '9', ranking: 6, overall: 'Good' }],
        ['CAT032', { syllabus: '98%', voice: '10', regularity: '10', ranking: 7, overall: 'Excellent' }]
    ]),
    comments: 'Some subjects were boring.',
    bestTeachers: ['Ms. Apoorva'],
    suggestions: 'Improve presentation.',
    submittedAt: new Date(),
},
{
    studentRoll: 110,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [4, 4, 5, 5, 5, 4, 4, 5, 5, 4]],
        ['AHT411', [3, 3, 3, 4, 3, 3, 2, 3, 3, 3]],
        ['CAT027', [5, 4, 5, 5, 4, 5, 5, 5, 5, 5]],
        ['CAT032', [5, 5, 5, 5, 4, 5, 4, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '92%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }],
        ['AHT411', { syllabus: '75%', voice: '7', regularity: '7', ranking: 4, overall: 'Good' }],
        ['CAT027', { syllabus: '95%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '99%', voice: '10', regularity: '10', ranking: 7, overall: 'Outstanding' }]
    ]),
    comments: 'Great lectures.',
    bestTeachers: ['Mr. S. Dey', 'Mr. Kaushal Bhatt'],
    suggestions: 'More revision classes.',
    submittedAt: new Date(),
},
{
    studentRoll: 111,
    session: '2025-26',
    semester: 4,
    batch: 1,
    ratings: new Map([
        ['CAT017', [3, 4, 3, 4, 3, 4, 3, 4, 3, 4]],
        ['AHT411', [3, 3, 2, 2, 3, 3, 3, 2, 3, 2]],
        ['CAT027', [5, 5, 5, 5, 4, 5, 4, 5, 5, 5]],
        ['CAT032', [4, 4, 5, 4, 5, 4, 5, 5, 5, 5]]
    ]),
    overallData: new Map([
        ['CAT017', { syllabus: '78%', voice: '7', regularity: '7', ranking: 4, overall: 'Average' }],
        ['AHT411', { syllabus: '60%', voice: '6', regularity: '6', ranking: 3, overall: 'Average' }],
        ['CAT027', { syllabus: '95%', voice: '9', regularity: '9', ranking: 6, overall: 'Very Good' }],
        ['CAT032', { syllabus: '96%', voice: '9', regularity: '9', ranking: 6, overall: 'Excellent' }]
    ]),
    comments: 'Good but can improve.',
    bestTeachers: ['Mr. Kaushal Bhatt'],
    suggestions: 'Better examples in class.',
    submittedAt: new Date(),
}

];


mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected!");

        await Feedback.deleteMany({});
        console.log("Existing feedbacks removed");

        const created = await Feedback.insertMany(feedbacks);
        console.log(`Seeded ${created.length} feedbacks`);

        mongoose.connection.close();
        console.log("MongoDB connection closed");
    })
    .catch(err => console.error("MongoDB connection error:", err));




    