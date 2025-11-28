// controllers/adminController.js
const Feedback = require('../models/Feedback');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subjects');

// GET /admin/feedbacks - View all feedbacks
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).sort({ submittedAt: -1 });

        return res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (err) {
        console.error('Error fetching feedbacks:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// GET /admin/feedbacks/count - Get total feedback count
exports.getFeedbackCount = async (req, res) => {
    try {
        const count = await Feedback.countDocuments();

        return res.status(200).json({
            success: true,
            totalFeedbacks: count
        });
    } catch (err) {
        console.error('Error counting feedbacks:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// GET /admin/feedbacks/:id - Get single feedback by ID
exports.getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (err) {
        console.error('Error fetching feedback:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// DELETE /admin/feedbacks/:id - Delete a feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting feedback:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// ================== TEACHER MANAGEMENT ==================

// GET /admin/teachers - Get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Faculty.find({}).sort({ teacherName: 1 });

        return res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (err) {
        console.error('Error fetching teachers:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// GET /admin/teachers/:id - Get single teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Faculty.findById(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (err) {
        console.error('Error fetching teacher:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// POST /admin/teachers - Add new teacher
exports.addTeacher = async (req, res) => {
    try {
        const { teacherName, department, subjectsTaught } = req.body;

        // Validate required fields
        if (!teacherName || !department) {
            return res.status(400).json({
                success: false,
                message: 'Teacher name and department are required'
            });
        }

        // Check if teacher already exists
        const existingTeacher = await Faculty.findOne({ teacherName });
        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: 'Teacher with this name already exists'
            });
        }

        // Create new teacher
        const newTeacher = await Faculty.create({
            teacherName,
            department,
            subjectsTaught: subjectsTaught || []
        });

        return res.status(201).json({
            success: true,
            message: 'Teacher added successfully',
            data: newTeacher
        });
    } catch (err) {
        console.error('Error adding teacher:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// PUT /admin/teachers/:id - Update teacher
exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { teacherName, department, subjectsTaught } = req.body;

        // Find teacher
        const teacher = await Faculty.findById(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Update fields
        if (teacherName) teacher.teacherName = teacherName;
        if (department) teacher.department = department;
        if (subjectsTaught !== undefined) teacher.subjectsTaught = subjectsTaught;

        await teacher.save();

        return res.status(200).json({
            success: true,
            message: 'Teacher updated successfully',
            data: teacher
        });
    } catch (err) {
        console.error('Error updating teacher:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// DELETE /admin/teachers/:id - Delete teacher
exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Faculty.findByIdAndDelete(id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting teacher:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// PATCH /admin/teachers/:id/subjects - Add subject to teacher
exports.addSubjectToTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject } = req.body;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        const teacher = await Faculty.findById(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Check if subject already exists
        if (teacher.subjectsTaught.includes(subject)) {
            return res.status(400).json({
                success: false,
                message: 'Subject already assigned to this teacher'
            });
        }

        teacher.subjectsTaught.push(subject);
        await teacher.save();

        return res.status(200).json({
            success: true,
            message: 'Subject added successfully',
            data: teacher
        });
    } catch (err) {
        console.error('Error adding subject:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// PATCH /admin/teachers/:id/subjects/remove - Remove subject from teacher
exports.removeSubjectFromTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject } = req.body;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'Subject is required'
            });
        }

        const teacher = await Faculty.findById(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        teacher.subjectsTaught = teacher.subjectsTaught.filter(s => s !== subject);
        await teacher.save();

        return res.status(200).json({
            success: true,
            message: 'Subject removed successfully',
            data: teacher
        });
    } catch (err) {
        console.error('Error removing subject:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// GET /admin/teachers/department/:department - Get teachers by department
exports.getTeachersByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const teachers = await Faculty.find({ department }).sort({ teacherName: 1 });

        return res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (err) {
        console.error('Error fetching teachers by department:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Helper function to parse percentage strings
function parsePercentage(val) {
    if (val === undefined || val === null || val === '') return NaN;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const cleaned = val.replace('%', '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? NaN : num / 10; // Convert 0-100 scale to 0-10 scale
    }
    return NaN;
}

// Helper function to parse rating strings
function parseRating(val) {
    if (val === undefined || val === null || val === '') return NaN;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const num = parseFloat(val);
        return isNaN(num) ? NaN : num;
    }
    return NaN;
}

// GET /admin/teachers/analytics - Aggregated analytics per teacher
exports.getTeachersAnalytics = async (req, res) => {
    try {
        const faculties = await Faculty.find({});
        const feedbacks = await Feedback.find({});
        const subjects = await Subject.find({});

        // Create a map of subjectCode -> subjectName
        const subjectCodeToName = {};
        subjects.forEach(sub => {
            subjectCodeToName[sub.subjectCode] = sub.subjectName;
        });

        const analytics = faculties.map((teacher) => {
            const subjects = Array.isArray(teacher.subjectsTaught) ? teacher.subjectsTaught : [];

            const subjectStats = {};
            let totalNumSum = 0;
            let totalNumCount = 0;
            const paramSums = [];
            const paramCounts = [];
            let totalFeedbacksSet = new Set();
            let syllabusSum = 0, voiceSum = 0, regularitySum = 0, overallDataCount = 0;
            let bestTeacherVotes = 0;
            const comments = [];

            feedbacks.forEach((fb) => {
                // count best teacher votes
                if (Array.isArray(fb.bestTeachers) && fb.bestTeachers.includes(teacher.teacherName)) {
                    bestTeacherVotes++;
                }

                const ratingsObj = fb.ratings || {};
                let matchedThisFeedback = false;

                subjects.forEach((sub) => {
                    let arr = null;
                    if (ratingsObj && typeof ratingsObj.get === 'function') {
                        arr = ratingsObj.get(sub);
                    } else if (ratingsObj && Object.prototype.hasOwnProperty.call(ratingsObj, sub)) {
                        arr = ratingsObj[sub];
                    } else if (ratingsObj && ratingsObj[sub]) {
                        arr = ratingsObj[sub];
                    }

                    if (Array.isArray(arr) && arr.length > 0) {
                        matchedThisFeedback = true;

                        if (!subjectStats[sub]) subjectStats[sub] = { sum: 0, countNums: 0, feedbackCount: 0 };

                        const sumArr = arr.reduce((s, v) => s + (Number(v) || 0), 0);
                        subjectStats[sub].sum += sumArr;
                        subjectStats[sub].countNums += arr.reduce((c, v) => c + (v !== undefined && v !== null ? 1 : 0), 0);
                        subjectStats[sub].feedbackCount += 1;

                        totalNumSum += sumArr;
                        totalNumCount += arr.reduce((c, v) => c + (v !== undefined && v !== null ? 1 : 0), 0);

                        arr.forEach((val, idx) => {
                            const num = Number(val) || 0;
                            paramSums[idx] = (paramSums[idx] || 0) + num;
                            paramCounts[idx] = (paramCounts[idx] || 0) + 1;
                        });
                    }
                });

                if (matchedThisFeedback) {
                    totalFeedbacksSet.add(String(fb._id));

                    // overallData is nested per subject, process for each subject
                    const od = fb.overallData || {};
                    subjects.forEach((sub) => {
                        let subData = null;
                        if (od && typeof od.get === 'function') {
                            subData = od.get(sub);
                        } else if (od && Object.prototype.hasOwnProperty.call(od, sub)) {
                            subData = od[sub];
                        } else if (od && od[sub]) {
                            subData = od[sub];
                        }

                        if (subData) {
                            const syllabusVal = parsePercentage(subData.syllabus);
                            const voiceVal = parseRating(subData.voice);
                            const regularityVal = parseRating(subData.regularity);

                            if (!isNaN(syllabusVal)) syllabusSum += syllabusVal;
                            if (!isNaN(voiceVal)) voiceSum += voiceVal;
                            if (!isNaN(regularityVal)) regularitySum += regularityVal;
                            overallDataCount++;
                        }
                    });

                    // comments preview
                    if (fb.comments && typeof fb.comments === 'string' && fb.comments.trim() !== '') {
                        if (comments.length < 3) comments.push(fb.comments.trim());
                    }
                }
            });

            const avgRating = totalNumCount > 0 ? (totalNumSum / totalNumCount) : 0;

            const paramAverages = paramSums.map((s, i) => {
                const c = paramCounts[i] || 0;
                return c > 0 ? +(s / c).toFixed(2) : 0;
            });

            const subjectBreakdown = Object.entries(subjectStats).map(([sub, st]) => ({
                subjectCode: sub,
                subjectName: subjectCodeToName[sub] || sub,
                avgRating: st.countNums > 0 ? +(st.sum / st.countNums).toFixed(2) : 0,
                feedbackCount: st.feedbackCount
            }));

            return {
                teacherName: teacher.teacherName,
                department: teacher.department,
                totalFeedbacks: totalFeedbacksSet.size,
                averageRating: +avgRating.toFixed(2),
                avgSyllabus: overallDataCount > 0 ? +(syllabusSum / overallDataCount).toFixed(2) : 0,
                avgVoice: overallDataCount > 0 ? +(voiceSum / overallDataCount).toFixed(2) : 0,
                avgRegularity: overallDataCount > 0 ? +(regularitySum / overallDataCount).toFixed(2) : 0,
                parameterAverages: paramAverages,
                subjectBreakdown,
                bestTeacherVotes,
                commentsPreview: comments
            };
        });

        return res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        console.error('Error computing teacher analytics:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};
