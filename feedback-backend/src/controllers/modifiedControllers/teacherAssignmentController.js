const TeachingAssignment = require("../../models/model/TeachingAssignment");
const { getAssignmentsByAcademicData } = require("../../services/assignmentService");



exports.createAssignment = async (req, res) => {
  const { semester, batch, subjectId, teacherId, course, branch } = req.body;

 

  if (!semester || !batch || !subjectId || !teacherId || !course || !branch) return res.status(400).json({ success: false, message: 'All fields required.' });

  try {

    const existingAssignment = await TeachingAssignment.findOne({
      semester,
      batch,
      subjectId,
      teacherId,
      course,
      branch
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already exists.'
      });
    }

    const newAssignment = await TeachingAssignment.create({
      semester,
      batch,
      subjectId,
      teacherId,
      course,
      branch
    })
    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: newAssignment
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
      error: error.message,
    })
  }

}

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await TeachingAssignment.find({}).populate('teacherId').populate('subjectId');

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    })
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message,
    })
  }
}

// get all the sujects taught by a teacher "A"
exports.getAssignedSubjectByTeacherId = async (req, res) => {

  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "TeacherId required"
      });
    }
    const assignedSubjects = await TeachingAssignment.find({
      teacherId
    }).populate("subjectId").populate("teacherId");
    if (assignedSubjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subjects assigned to this teacher"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned subjects found",
      data: assignedSubjects
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

// delete wrong assignment
exports.deleteAssignment = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assignment id required"
      });
    }

    const deletedData = await TeachingAssignment.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
      data: deletedData
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });

  }
};

exports.updateAssignment = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      subjectId,
      teacherId,
      semester,
      batch,
      course,
      branch
    } = req.body;

    const assignment = await TeachingAssignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    if (subjectId) assignment.subjectId = subjectId;
    if (teacherId) assignment.teacherId = teacherId;
    if (semester) assignment.semester = semester;
    if (batch) assignment.batch = batch;
    if (course) assignment.course = course;
    if (branch) assignment.branch = branch;

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });

  }
};


// get all teachers + subjects for a specific batch
exports.getDataByBatch = async (req, res) => {

  const { batch, semester, course, branch } = req.body;

  if (!batch || !semester || !course || !branch) {
    return res.status(400).json({
      success: false,
      message: "Batch, semester and course are required"
    });
  }

  try {

    const subjects = await getAssignmentsByAcademicData({
      semester,
      batch,
      branch,
      course
    });

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
};

