// controllers/feedbackController.js
const Feedback = require('../models/Feedback');


// GET /feedback-status/:rollNumber
exports.checkFeedbackStatus = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const existingFeedback = await Feedback.findOne({studentRoll: Number(rollNumber) });
   
    
    if (!existingFeedback) {
      return res.json({ submitted: false });
    }
    return res.json({ submitted: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ submitted: false, message: "Server error" });
  }
};



exports.submitFeedback = async (req, res) => {
  try {
    const {
      studentRoll,
      session,
      semester,
      batch,
      ratings,
      overallData,
      comments,
      bestTeachers,
      suggestions,
      submittedAt
    } = req.body;

    // Validate required fields
    if (!studentRoll || !session || !semester || !batch || !ratings || !overallData || !bestTeachers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create feedback entry
    await Feedback.create({
      studentRoll,
      session,
      semester,
      batch,
      ratings,
      overallData,
      comments,
      bestTeachers,
      suggestions,
      submittedAt
    });

    return res.status(201).json({ message: 'Feedback submitted successfully' });

  } catch (err) {
    console.error('Error submitting feedback:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
