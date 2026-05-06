const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
  const token = req.cookies?.token;

  if(!token) return res.status(401).json({message: 'Unauthorized access!'});
  try{
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch(err){
    return res.status(403).json({
      message: 'Invalid token.'
    })
  }
}

module.exports = authMiddleWare