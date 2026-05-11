const express = require('express')
const authMiddleWare = require('../middleware/authMiddleware');
const multer = require("multer");

const router = express.Router();



const {
  uploadStudents,
  uploadAssignments,
  exportAnalytics
} = require("../controllers/uploadController");


// multer config

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});




router.post('/students', authMiddleWare, upload.single("file"), uploadStudents)


router.post("/assignments", authMiddleWare, upload.single("file"), uploadAssignments
);

router.get("/export", exportAnalytics);

module.exports = router;