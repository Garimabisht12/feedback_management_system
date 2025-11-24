require('dotenv').config();
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');

const MONGO_URI = process.env.MONGO_URI;

const feedbacks = [
    {
        studentRoll: 101,
        session: '2025-26',
        semester: 4,
        batch: 1,
        ratings: new Map([
            ['CAT017', [5, 3, 3, 4, 3, 3, 5, 3, 3, 5]],
            ['AHT411', [3, 3, 4, 3, 3, 2, 3, 3, 4, 3]],
            ['CAT027', [5, 5, 3, 4, 5, 5, 5, 3, 3, 5]],
            ['CAT032', [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]]
        ]),

        overallData: new Map([
            ['CAT017', { syllabus: '90%', voice: 'Good', regularity: 'Good', ranking: 5, overall: 'Good' }],
            ['AHT411', { syllabus: '60%', voice: 'Good', regularity: 'Good', ranking: 5, overall: 'Good' }],
            ['CAT027', { syllabus: '90%', voice: 'Good', regularity: 'Good', ranking: 6, overall: 'Good' }],
            ['CAT032', { syllabus: '100%', voice: 'Excellent', regularity: 'Excellent', ranking: 7, overall: 'Excellent' }]
        ]),
        comments: 'Very interactive classes.',
        bestTeachers: ['Mr. S. Dey', 'Ms. Apoorva', 'Mr. Kaushal Bhatt'],
        suggestions: 'More lab sessions.',
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
