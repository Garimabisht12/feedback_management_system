const TeachingAssignment = require("../models/TeachingAssignment");

const getAssignmentsByAcademicData = async ({
  semester,
  batch,
  branch,
  course
}) => {

  return await TeachingAssignment.find({
    semester,
    batch,
    branch,
    course
  })
    .populate("subjectId")
    .populate("teacherId");

};

module.exports = {
  getAssignmentsByAcademicData
};