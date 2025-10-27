const Student = require('../models/Student')


exports.loginStudent = async (req, res) => {
    try {
       
        if (!req.body || !req.body.rollNo) {
            return res.status(400).json({ message: "rollNo is required" });
        }
        const rollNo = Number(req.body.rollNo);

        const exists = await Student.findOne({ rollNo });
        if (!exists) {
            return res.status(404).json({ message: `Student NOT FOUND: ${rollNo}` });
        }
        console.log(exists)
        res.status(200).json({ message: "LOGGED IN", student: exists });
    } catch (err) {
        console.error("Login error:", err); 
        res.status(500).json({ message: "ERROR IN LOGGING IN", error: err.message });
    }
};


