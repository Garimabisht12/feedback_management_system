const Teacher = require('../models/Teacher')

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
    const teachers = await Teacher.find({}).sort({ name: 1 })
    return res.status(200).json({
      success: true,
      count: teachers.length,
      faculty: teachers
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Interval server error',
      error: error.message
    });
  }
}

exports.getTeacherById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'id required' })
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({
      success: false,
      message: 'Teacher not found'
    });
    return res.status(200).json({
      success: true,
      faculty: teacher
    });

  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    })
  }
}

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherName, department } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) return res.status(404).json({
      success: false,
      message: 'Teacher not found!'

    });
    if (teacherName) teacher.name = teacherName;
    if (department) teacher.department = department;

    await teacher.save();
    return res.status(200).json({
      success: true,
      message: `${teacherName} details updated.`,
      data: teacher
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