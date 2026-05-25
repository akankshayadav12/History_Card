const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Correct import for named export
// const { auth } = require("../middleware/authMiddleware");
const auth = require("../middleware/authMiddleware");


// --------------------
// Student Dashboard
// --------------------
router.get("/dashboard", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate("course")
      .populate("teacher");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      dashboard: { student, hcrs: [] },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --------------------
// Logged-in student profile
// --------------------
router.get("/my", auth, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate("course")
      .populate("teacher");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --------------------
// Get ALL students
// --------------------
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("course").populate("teacher");
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --------------------
// Get student by ID
// --------------------
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("course")
      .populate("teacher");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
//
// --------------------
// Create Student
// --------------------
router.post("/", async (req, res) => {
  try {
    const { name, course, teacher, userId, status } = req.body;

    const student = new Student({
      name,
      course: course || null,
      teacher: teacher || null,
      userId,
      status: status || "ongoing",
    });

    await student.save();

    res.status(201).json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//
// --------------------
// Update Student
// --------------------
router.put("/:id", async (req, res) => {
  try {
    const { name, course, teacher, status } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, course, teacher, status },
      { new: true }
    )
      .populate("course")
      .populate("teacher");

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//
// --------------------
// Delete Student
// --------------------
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
