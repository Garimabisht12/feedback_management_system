const { getDataByBatch } = require('../../controllers/modifiedControllers/teacherAssignmentController');
const { getAssignmentsByAcademicData } = require('../../services/assignmentService');

exports.fetchSubjects = async (req, res) => {
  const student = req.student;
  if (!student) return res.status(400).json({
    success: false,
    message: "student data required!"
  })
  try {

    console.log(student)
    const subjects = await getAssignmentsByAcademicData({
      semester: student.semester,
      batch: student.batch,
      course: student.course,
      branch: student.branch
    })

    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No assignments found"
      });
    }

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });

  }
}
