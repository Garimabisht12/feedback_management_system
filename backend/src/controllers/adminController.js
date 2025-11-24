// controllers/adminController.js
const Feedback = require('../models/Feedback');
const Faculty = require('../models/Faculty');

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
