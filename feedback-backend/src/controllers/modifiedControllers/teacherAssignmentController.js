const TeachingAssignment = require("../../models/model/TeachingAssignment");



exports.createAssignment = async(req, res) => {
  const {semester, batch, subjectId, teacherId} = req.body;

  if(!semester || !batch || !subjectId || !teacherId) return res.status(400).json({success: false, message: 'All fields required.'});

  try {

     const existingAssignment = await TeachingAssignment.findOne({
      semester,
      batch,
      subjectId,
      teacherId
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
      teacherId
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



exports.getAllAssignments = async(req, res) => {
  try{
    const assignments = await TeachingAssignment.find({}).populate('teacherId').populate('subjectId');

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    })
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message,
    })
  }
}






const getAssignedSubject = async(req, res) => {
  const {teacherId} = req.body;
  try {
    const assignments = TeachingAssignment.find({teacherId})
    const subjects = []
    assignments.map((assigned) => {
      const subject = Subject.findById(assigned.subjectId)
    // logic put here///// needs updation and correct logic
    
      subjects.push([subject, assigned.teacher, assigned.semester, assigned.batch])
    })

    return res.status(200).json({
      data: subjects
    })
  } catch (error) {
    
  }
}

// // get assignments by teacher 
// TeachingAssignment.find({ teacherId })


// // delete assignment 
// TeachingAssignment.findByIdAndDelete(id)

// //  delete assignment
// assignment.teacherId = newTeacherId


// // find all the subjects by teacher "A"
// TeachingAssignment.find({ teacherId })
// .populate("subjectId")
// // find all the teachers by subject "S"
// TeachingAssignment.find({ subjectId })
// .populate("teacherId")

// // find teachers for batch "ABC"
// TeachingAssignment.find({ batch: 2023 })
// .populate("teacherId")
// .populate("subjectId")