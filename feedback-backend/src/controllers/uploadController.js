const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const TeachingAssignment = require('../models/TeachingAssignment')

const xlsx = require("xlsx");




const ExcelJS = require("exceljs");

const FeedbackForm = require("../models//FeedbackForm");
const FeedbackEntry = require("../models/FeedbackEntry");



exports.uploadStudents = async (req, res) => {
  
    try {

      // check file

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // read workbook

      const workbook = xlsx.read(req.file.buffer, {
        type: "buffer",
      });

      // first sheet

      const sheetName = workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];

      // convert to json

      const students = xlsx.utils.sheet_to_json(sheet);

      // check empty excel

      if (students.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Excel sheet is empty",
        });
      }

      // format student data

      const formattedStudents = students.map((student) => {

        return {

          name: student.name,

          email: student.email,

          rollno: student.rollno,

          course: student.course,

          branch: student.branch,

          semester: student.semester,

          batch: student.batch,

          password: student.password || "123456",
        };
      });

      // insert students

      await Student.insertMany(formattedStudents);

      return res.status(201).json({
        success: true,
        message: "Students uploaded successfully",
        total_students: formattedStudents.length,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }


exports.uploadAssignments = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required"
      });
    }

    // read file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let created = 0;
    let skipped = 0;

    for (let row of data) {

      const {
        teacherName,
        subjectCode,
        semester,
        batch,
        branch,
        course
      } = row;

      if (
        !teacherName ||
        !subjectCode ||
        !semester ||
        !batch ||
        !branch ||
        !course
      ) {
        skipped++;
        continue;
      }

      const teacher = await Teacher.findOne({ name: teacherName });
      const subject = await Subject.findOne({ subjectCode });

      if (!teacher || !subject) {
        skipped++;
        continue;
      }

      const exists = await TeachingAssignment.findOne({
        teacherId: teacher._id,
        subjectId: subject._id,
        semester,
        batch,
        branch,
        course
      });

      if (exists) {
        skipped++;
        continue;
      }

      await TeachingAssignment.create({
        teacherId: teacher._id,
        subjectId: subject._id,
        semester,
        batch,
        branch,
        course
      });

      created++;
    }

    return res.status(200).json({
      success: true,
      message: "Upload completed",
      created,
      skipped
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message
    });

  }

};



exports.exportAnalytics = async (req, res) => {

  try {

    const workbook = new ExcelJS.Workbook();

    // =========================
    // SHEET 1: FEEDBACK DETAILS
    // =========================
    const feedbackSheet = workbook.addWorksheet("Feedback Details");

    feedbackSheet.columns = [
      { header: "Student ID", key: "studentId", width: 25 },
      { header: "Teacher", key: "teacher", width: 20 },
      { header: "Subject", key: "subject", width: 20 },
      { header: "Rating", key: "rating", width: 10 },
      { header: "Comments", key: "comments", width: 40 }
    ];

    const entries = await FeedbackEntry.find({})
      .populate({
        path: "form_id",
        populate: { path: "student_id" }
      })
      .populate({
        path: "teaching_assignments_id",
        populate: ["teacherId", "subjectId"]
      });

    entries.forEach((e) => {

      feedbackSheet.addRow({
        studentId: e.form_id?.student_id?.rollNo || "",
        teacher: e.teaching_assignments_id?.teacherId?.name || "",
        subject: e.teaching_assignments_id?.subjectId?.name || "",
        rating: e.overall?.rating || "",
        comments: e.comments || ""
      });

    });

    // =========================
    // SHEET 2: TEACHER SUMMARY
    // =========================
    const summarySheet = workbook.addWorksheet("Teacher Summary");

    summarySheet.columns = [
      { header: "Teacher", key: "teacher", width: 25 },
      { header: "Avg Rating", key: "avg", width: 15 },
      { header: "Total Feedback", key: "count", width: 20 }
    ];

    const teacherAgg = await FeedbackEntry.aggregate([
      {
        $group: {
          _id: "$teaching_assignments_id",
          avgRating: { $avg: "$overall.rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    for (let t of teacherAgg) {
      summarySheet.addRow({
        teacher: t._id,
        avg: t.avgRating.toFixed(2),
        count: t.count
      });
    }

    // =========================
    // RESPONSE HEADERS
    // =========================
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=analytics.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Export failed",
      error: err.message
    });

  }

};
