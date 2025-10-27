// controllers/subjectController.js
const Subjects = require('../models/Subjects');

exports.getSubjects = async (req, res) => {
  try {
    const { session, semester, batch } = req.query;

    if (!session || !semester || !batch) {
      return res.status(400).json({
        message: "session, semester and batch are required as query parameters"
      });
    }

    const subjects = await Subjects.find({
      session,
      semester: Number(semester),
      batch: Number(batch)
    });

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this selection' });
    }

    return res.status(200).json({
      message: 'Subjects fetched successfully',
      subjects
    });

  } catch (err) {
    console.error("Subjects fetch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
