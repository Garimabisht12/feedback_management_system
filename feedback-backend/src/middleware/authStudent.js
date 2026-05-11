const jwt = require("jsonwebtoken");

const authStudent = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.student = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err.message
    });

  }

};

module.exports = authStudent;