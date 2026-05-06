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

// loginStudent

exports.loginStudent = async(req, res) => {
  try{
    const {rollNo, password} = req.body;
    if(!password || !rollNo){
      return res.status(400).json({message: "All fields are required!"}); 
    }

    const student = await Student.findOne({rollNo});
    if(!student) return res.status(404).json({message: 'Roll no. not found. Contact HOD.'})
    const isMatch = bcrypt.compare(password, student.password)
    if(!isMatch) return res.status(400).json({message: 'Invalid Credentials.'})
    res.status(200).json({message: "Successfully logged in.", student});
  }
  catch(err){
    res.status(500).json({message: "Error in logging in, please try again later."})
  }
}