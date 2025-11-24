const Student = require('../models/Student')
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.loginAdmin = async(req, res) => {
    const {email, password} = req.body;
    const admin = await Admin.findOne({email});
    if (!admin) return res.status(400).json({message: "INVALID CREDENTIALS."})
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({message: "WRONG PASSWORD!"});
    const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET, { 
        expiresIn: "1d",

    })
   res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Login successful" });
}




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


