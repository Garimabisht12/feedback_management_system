const Teacher = require('../models/Teacher')
const Subject = require('../models/Subject')
const TeachingAssignment = require('../models/TeachingAssignment')

exports.createTeacher = async (req, res) => {
  const { name, department } = req.body;
  if (!name || !department) {
    return res.status(400).json({
      success: false,
      message: 'Name and department required!'
    })
  }

  try {
    const existingTeacher = await Teacher.findOne({ name })
    if (existingTeacher) return res.status(400).json({ success: false, message: 'Already Exists' });
    const newTeacher = await Teacher.create({
      name,
      department
    });

    return res.status(201).json({
      success: true,
      message: 'Added successfully',
      data: newTeacher
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

exports.getAllTeachers = async (req, res) => {

  try {

    const faculty = await Teacher.aggregate([

      {
        $lookup: {
          from: "teachingassignments",
          localField: "_id",
          foreignField: "teacherId",
          as: "assignments"
        }
      },

      {
        $lookup: {
          from: "subjects",
          localField: "assignments.subjectId",
          foreignField: "_id",
          as: "subjects"
        }
      },

      {
        $addFields: {
          subjectsTaught: "$subjects.name"
        }
      }

    ]);

    return res.status(200).json({

      success: true,

      count: faculty.length,

      faculty

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: 'Internal server error',

      error: error.message

    });

  }

}

exports.getTeacherById = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {

      return res.status(400).json({
        success: false,
        message: "Teacher id required"
      });

    }

    const faculty = await Teacher.aggregate([

      {
        $match: {
          _id: new require("mongoose").Types.ObjectId(id)
        }
      },

      {
        $lookup: {
          from: "teachingassignments",
          localField: "_id",
          foreignField: "teacherId",
          as: "assignments"
        }
      },

      {
        $lookup: {
          from: "subjects",
          localField: "assignments.subjectId",
          foreignField: "_id",
          as: "subjects"
        }
      },

      {
        $addFields: {
          subjectsTaught: "$subjects.name"
        }
      }

    ]);

    if (faculty.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });

    }

    return res.status(200).json({

      success: true,

      faculty: faculty[0]

    });

  } catch (err) {

    return res.status(500).json({

      success: false,

      message: "Internal server error",

      error: err.message

    });

  }

}




exports.updateTeacher = async (req, res) => {

  try {

    const { id } = req.params

    const {
      teacherName,
      department,
      subjectsTaught
    } = req.body

    const teacher = await Teacher.findById(id)

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      })
    }

    // update teacher info
    if (teacherName) teacher.name = teacherName
    if (department) teacher.department = department

    await teacher.save()

    // REMOVE OLD ASSIGNMENTS
    await TeachingAssignment.deleteMany({
      teacherId: teacher._id
    })

    // CREATE NEW ASSIGNMENTS
    if (subjectsTaught && subjectsTaught.length > 0) {

      for (let subjectName of subjectsTaught) {

        const subject = await Subject.findOne({
          name: subjectName
        })

        if (!subject) continue

        await TeachingAssignment.create({
          teacherId: teacher._id,
          subjectId: subject._id,
          semester: subject.semester,
          batch: 1,
          branch: department,
          course: "btech"
        })

      }

    }

    return res.status(200).json({
      success: true,
      message: 'Teacher updated successfully'
    })

  }
  catch (err) {

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })

  }

}
// exports.updateTeacher = async (req, res) => {

//   try {

//     const { id } = req.params;

//     const { teacherName, department } = req.body;

//     const teacher = await Teacher.findById(id);

//     if (!teacher) {

//       return res.status(404).json({
//         success: false,
//         message: "Teacher not found"
//       });

//     }

//     // update fields

//     if (teacherName) {
//       teacher.name = teacherName;
//     }

//     if (department) {
//       teacher.department = department;
//     }

//     await teacher.save();

//     return res.status(200).json({

//       success: true,

//       message: "Teacher updated successfully",

//       data: teacher

//     });

//   } catch (err) {

//     return res.status(500).json({

//       success: false,

//       message: "Internal server error",

//       error: err.message

//     });

//   }

// }

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `${teacher.name} deleted successfully`
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}