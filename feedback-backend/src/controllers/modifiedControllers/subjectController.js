const Subject = require('../../models/model/Subject')

exports.createSubject = async(req, res) => {
  const {name, semester, subjectCode} = req.body;
  if (!name || !semester || !subjectCode) return res.status(400).json({message: 'All fields are required!'});

  try{
    const newSubject = await Subject.create({
      name,
      semester,
      subjectCode
    });
    return res.status(201).json({
      success: true,
      data: newSubject
    })
  } catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.'
    })
  }
}

// exports.deleteSubject = () => {

// }

// exports.getAllSubjects = () => {}

// exports.updateSubject = () => {

// }