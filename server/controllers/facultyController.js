// controllers/studentControllers.js
const mongoose = require("mongoose");
const Student = require("../models/Student");

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

