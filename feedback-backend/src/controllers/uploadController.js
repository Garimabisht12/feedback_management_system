const xlsx = require("xlsx");
const ExcelJS = require("exceljs");

const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const TeachingAssignment = require('../models/TeachingAssignment')

const FeedbackForm = require("../models//FeedbackForm");
const FeedbackEntry = require("../models/FeedbackEntry");



exports.uploadStudents = async (req, res) => {
  
    try {

      // check file

      if (!req.file) {
        console.log('error no file uploaded')
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
        console.log('empty excel sheet')
        return res.status(400).json({
          success: false,
          message: "Excel sheet is empty",
        });
      }

      // format student data

      const formattedStudents = students.map((student) => {

        return {

          name: student.name,

          rollNo: student.rollNo,

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

    // check file

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Excel file required"
      });

    }

    // read excel file

    const workbook = xlsx.read(req.file.buffer, {
  type: "buffer",
});

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    // check empty sheet

    if (data.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Excel sheet is empty"
      });

    }

    let created = 0;

    let skipped = 0;

    let teachersCreated = 0;

    let subjectsCreated = 0;

    // loop rows

    for (let row of data) {

      const {
        teacherName,
        subjectCode,
        subjectName,
        semester,
        batch,
        branch,
        course
      } = row;

      // validate required fields

      if (
        !teacherName ||
        !subjectCode ||
        !subjectName ||
        !semester ||
        !batch ||
        !branch ||
        !course
      ) {

        skipped++;

        continue;
      }

      // find teacher

      let teacher = await Teacher.findOne({
        name: teacherName
      });

      // create teacher if not exists

      if (!teacher) {

        teacher = await Teacher.create({
          name: teacherName,
          department: branch
        });

        teachersCreated++;
      }

      // find subject

      let subject = await Subject.findOne({
        subjectCode: String(subjectCode)
      });

      // create subject if not exists

      if (!subject) {

        subject = await Subject.create({
          name: subjectName,
          semester,
          subjectCode: String(subjectCode)
        });

        subjectsCreated++;
      }

      // check assignment already exists

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

      // create assignment

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

      message: "Upload completed successfully",

      assignmentsCreated: created,

      teachersCreated,

      subjectsCreated,

      skipped

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Upload failed",

      error: error.message

    });

  }

};


exports.exportAnalytics = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();

    // ======================================================
    // FETCH ALL FEEDBACK ENTRIES
    // ======================================================
    const entries = await FeedbackEntry.find({})
      .populate({
        path: "feedback_form",
        populate: { path: "studentId" }
      });

    // ======================================================
    // SHEET 1 : COMPLETE FEEDBACK DATA
    // ======================================================
    const feedbackSheet = workbook.addWorksheet("Feedback Details");

    feedbackSheet.columns = [
      { header: "Student Roll No", key: "studentId", width: 25 },
      { header: "Teacher", key: "teacher", width: 25 },
      { header: "Subject", key: "subject", width: 30 },
      { header: "Rating", key: "rating", width: 15 },
      { header: "Comments", key: "comments", width: 40 }
    ];

    // HEADER STYLE
    feedbackSheet.getRow(1).font = { bold: true };

    entries.forEach((e) => {
      feedbackSheet.addRow({
        studentId: e.feedback_form?.studentId?.rollNo || "",
        teacher: e.teacher_name || "",
        subject: e.subject_name || "",
        rating: e.overall_performance || 0,
        comments: e.comment || ""
      });
    });

    // ======================================================
    // CALCULATE ANALYTICS
    // ======================================================
    const analytics = {};

    entries.forEach((e) => {
      const teacher = e.teacher_name || "Unknown";
      const subject = e.subject_name || "Unknown";
      const rating = Number(e.overall_performance || 0);

      if (!analytics[teacher]) {
        analytics[teacher] = {
          subject,
          total: 0,
          count: 0,
          highest: rating,
          lowest: rating,
          ratings: []
        };
      }

      analytics[teacher].total += rating;
      analytics[teacher].count += 1;
      analytics[teacher].ratings.push(rating);

      if (rating > analytics[teacher].highest) {
        analytics[teacher].highest = rating;
      }

      if (rating < analytics[teacher].lowest) {
        analytics[teacher].lowest = rating;
      }
    });

    // ======================================================
    // SHEET 2 : ANALYTICS SUMMARY
    // ======================================================
    const analyticsSheet = workbook.addWorksheet("Analytics Summary");

    analyticsSheet.columns = [
      { header: "Teacher", key: "teacher", width: 25 },
      { header: "Subject", key: "subject", width: 30 },
      { header: "Average Rating", key: "average", width: 18 },
      { header: "Highest Rating", key: "highest", width: 18 },
      { header: "Lowest Rating", key: "lowest", width: 18 },
      { header: "Total Feedbacks", key: "count", width: 18 },
      { header: "Performance", key: "performance", width: 20 }
    ];

    analyticsSheet.getRow(1).font = { bold: true };

    Object.keys(analytics).forEach((teacher) => {
      const data = analytics[teacher];

      const avg = data.total / data.count;

      let performance = "";

      if (avg >= 4.5) {
        performance = "Excellent";
      } else if (avg >= 4.0) {
        performance = "Very Good";
      } else if (avg >= 3.0) {
        performance = "Good";
      } else if (avg >= 2.0) {
        performance = "Average";
      } else {
        performance = "Poor";
      }

      analyticsSheet.addRow({
        teacher,
        subject: data.subject,
        average: avg.toFixed(2),
        highest: data.highest,
        lowest: data.lowest,
        count: data.count,
        performance
      });
    });

    // ======================================================
    // SHEET 3 : OVERALL SYSTEM ANALYTICS
    // ======================================================
    const overallSheet = workbook.addWorksheet("Overall Analytics");

    overallSheet.columns = [
      { header: "Metric", key: "metric", width: 35 },
      { header: "Value", key: "value", width: 20 }
    ];

    overallSheet.getRow(1).font = { bold: true };

    const totalFeedbacks = entries.length;

    const overallAverage =
      entries.reduce(
        (sum, e) => sum + Number(e.overall_performance || 0),
        0
      ) / (totalFeedbacks || 1);

    const uniqueTeachers = [
      ...new Set(entries.map((e) => e.teacher_name))
    ];

    const uniqueSubjects = [
      ...new Set(entries.map((e) => e.subject_name))
    ];

    overallSheet.addRow({
      metric: "Total Feedback Entries",
      value: totalFeedbacks
    });

    overallSheet.addRow({
      metric: "Overall Average Rating",
      value: overallAverage.toFixed(2)
    });

    overallSheet.addRow({
      metric: "Total Teachers",
      value: uniqueTeachers.length
    });

    overallSheet.addRow({
      metric: "Total Subjects",
      value: uniqueSubjects.length
    });

    // ======================================================
    // BEST TEACHER
    // ======================================================
    let bestTeacher = "";
    let bestRating = 0;

    Object.keys(analytics).forEach((teacher) => {
      const data = analytics[teacher];
      const avg = data.total / data.count;

      if (avg > bestRating) {
        bestRating = avg;
        bestTeacher = teacher;
      }
    });

    overallSheet.addRow({
      metric: "Best Performing Teacher",
      value: `${bestTeacher} (${bestRating.toFixed(2)})`
    });

    // ======================================================
    // STYLING
    // ======================================================
    workbook.eachSheet((sheet) => {
      sheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };

          if (rowNumber === 1) {
            cell.font = {
              bold: true,
              color: { argb: "FFFFFF" }
            };

            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "4472C4" }
            };
          }
        });
      });
    });

    // ======================================================
    // RESPONSE
    // ======================================================
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=feedback_analytics.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Export failed",
      error: err.message
    });
  }
};
