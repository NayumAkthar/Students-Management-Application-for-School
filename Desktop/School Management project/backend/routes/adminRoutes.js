
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.post("/add-student", adminController.addStudent);
router.get("/students", adminController.getAllStudents);
router.post("/assign-marks", adminController.assignMarks);
router.post('/reset-student-password', adminController.resetStudentPassword);



module.exports = router;
