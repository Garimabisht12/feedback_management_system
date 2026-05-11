const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Student = require('../../models/model/Student')
const Admin = require('../../models/model/Admin')


// loginAdmin
exports.loginAdmin = async(req, res) => {
  const {email, password} = req.body;
  try{

    const admin = await Admin.findOne({email});
    if(!admin) return res.status(400).json({
      message: 'Invalid Credentials!'
    });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if(!isMatch) return res.status(400).json({
      message: "Invalid Credentials!"
    })
    
    const token = jwt.sign({id: admin._id}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    
    res.json({
      message: "Logged in Successfully!",
      token
    });
  }
  catch(e){
    res.status(500).json({
      message: "Internal Server Error!"
    })
  }
}



// register student



// REGISTER STUDENT

exports.registerStudent = async (req, res) => {

  try {

    const {
      name,
      email,
      rollNo,
      password,
      semester,
      batch,
      branch,
      course
    } = req.body;

    if (
      !name ||
      !email ||
      !rollNo ||
      !password ||
      !semester ||
      !batch ||
      !branch ||
      !course
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const existingStudent =
      await Student.findOne({ rollNo });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      rollNo,
      password: hashedPassword,
      semester,
      batch,
      branch,
      course
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: student
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });

  }

};


// LOGIN STUDENT

exports.loginStudent = async (req, res) => {

  try {

    const { rollNo, password } = req.body;

    if (!rollNo || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const student =
      await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        semester: student.semester,
        batch: student.batch,
        branch: student.branch,
        course: student.course
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        semester: student.semester,
        batch: student.batch,
        branch: student.branch,
        course: student.course
      }
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });

  }

};

