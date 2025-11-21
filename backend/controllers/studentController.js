const Student = require('../models/Student');

exports.getStudentByRoll = async (req, res) => {
  try {
    const { rollNo } = req.params;

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
