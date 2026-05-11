const Subject = require('../models/Subject')



exports.createSubject = async (req, res) => {
  const { name, semester, subjectCode } = req.body;
  if (!name || !semester || !subjectCode) return res.status(400).json({ message: 'All fields are required!' });
  
  try {

    const existingSubject = await Subject.findOne({
      subjectCode
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject already exists'
      });
    }

    const newSubject = await Subject.create({
      name,
      semester,
      subjectCode
    });
    return res.status(201).json({
      success: true,
      data: newSubject
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.'
    })
  }
}


exports.getSubjectById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'id required' })
  try {
    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({
      success: false,
      message: 'subject not found'
    });
    return res.status(200).json({
      success: true,
      data: subject
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

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ name: 1 })
    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Interval server error',
      error: error.message
    });
  }
}

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, semester, subjectCode } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) return res.status(404).json({
      success: false,
      message: 'Subject not found!'

    });
    if (name) subject.name = name;
    if (semester) subject.semester = semester;
    if (subjectCode) subject.subjectCode = subjectCode;

    await subject.save();
    return res.status(200).json({
      success: true,
      message: `${name} details updated.`,
      data: subject
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

exports.deleteSubject = async () => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `subject not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `${subject.name} deleted successfully`
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