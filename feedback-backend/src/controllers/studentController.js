const Student = require('../models/Student');
const Subject = require('../models/Subject');

exports.getStudentByRoll = async (req, res) => {
  try {
    const  {rollNo}  = req.params;
    
    if (!rollNo) {
      return res.status(400).json({ message: "rollNo is required" });
    }

    const student = await Student.findOne({ rollNo: Number(rollNo) });
    if (!student) {
      return res.status(404).json({ message: `No student found with rollNo ${rollNo}` });
    }

    res.status(200).json({ message: "Student found", student });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// controllers/subjectController.js

exports.getSubjects = async (req, res) => {
  try {
    const session = req.params.session;
    const semester = req.params.semester;
    const batch = req.params.batch;
    console.log(session, semester, batch)
    if (!session || !semester || !batch) {
      return res.status(400).json({
        message: "session, semester and batch are required"
      });
    }

    const subjects = await Subject.find({
      session:session.trim(),
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
