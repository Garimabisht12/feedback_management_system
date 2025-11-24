const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies?.token; // safe check

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


module.exports = adminAuth;


 
