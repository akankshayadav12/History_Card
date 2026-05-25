
const Student = require("../models/Student");
const HCR = require("../models/HCR");
// const Student = require("../models/Student");
const mongoose = require("mongoose");

exports.createStudent = async (req, res) => {
  try {
    const { name, course, teacher, userId, status } = req.body;

    console.log("📥 Incoming student data:", req.body);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

    const student = await Student.create({
      name,
      course: course || null,
      teacher: teacher || null,
      userId: userId || null,
      status: status || "ongoing",
    });

    res.status(201).json({
      success: true,
      message: "Student created",
      student,
    });

  } catch (err) {
    console.error("❌ Error creating student:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("course", "name")
      .populate("teacher", "name");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student updated", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// controllers/studentControllers.js
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ userId })
      .populate("course")
      .populate("teacher");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const hcrs = await HCR.find({ student: student._id });

    res.json({
      success: true,
      dashboard: {
        student,
        hcrs,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// controllers/studentController.js
exports.getMyStudents = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const teacherId = req.user.id;

    const students = await Student.find({ teacher: teacherId })
      .populate("course", "name")
      .populate("teacher", "name");

    res.status(200).json({
      success: true,
      students,
    });

  } catch (err) {
    console.error("GET MY STUDENTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



exports.getAllStudents = async (req, res) => {
  try {
    const { facultyId } = req.query; // pass ?teacherId=<id> from frontend

    const filter = facultyId ? { teacher: facultyId } : {}; // only filter if teacherId is provided

    const students = await Student.find(filter)
      .populate("course", "name")
      .populate("teacher", "name");

    res.status(200).json({ success: true, students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getFacultyStudents = async (req, res) => {
  const { facultyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    return res.status(400).json({ success: false, message: "Invalid faculty ID" });
  }

  try {
    const students = await Student.find({ teacher: facultyId })
      .populate("teacher", "name")
      .populate("course", "name");

    res.status(200).json({ success: true, students });
  } catch (err) {
    console.error("Error fetching faculty students:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};