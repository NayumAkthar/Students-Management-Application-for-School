const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/add-student", adminController.addStudent);
router.post("/assign-marks", adminController.assignMarks);
router.get("/students", adminController.getAllStudents);
router.post("/reset-student-password", adminController.resetStudentPassword);

module.exports = router;
