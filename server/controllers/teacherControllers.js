const Teacher = require("../models/Teacher");
// const { createSecretToken } = require("../util/SecretToken");
// const bcrypt = require("bcryptjs");

// Create student
module.exports.createTeacher = async (req, res, next) => {
    try {
        const { name, status } = req.body;

        const teacher = await Teacher.create({
            name,
            status,   // ✅ include status
        });

        res.status(201).json({
            message: "Teacher created successfully",
            success: true,
            teacher,
        });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


// Get all teachers
module.exports.getTeachers = async (req, res) => {
    try {
      const teachers = await Teacher.find();
res.status(200).json({ success: true, teachers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get teacher by ID
module.exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res
                .status(404)
                .json({ message: "teacher not found", success: false });
        }
        res.status(200).json({ success: true, teacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Update teacher
// Update teacher
module.exports.updateTeacher = async (req, res) => {
    try {
        const { name, status } = req.body;

        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res
                .status(404)
                .json({ message: "Teacher not found", success: false });
        }

        if (name) teacher.name = name;
        if (status) teacher.status = status;  // ✅ allow status update

        await teacher.save();

        res
            .status(200)
            .json({ message: "Teacher updated successfully", success: true, teacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


// Delete student
module.exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res
                .status(404)
                .json({ message: "Teacher not found", success: false });
        }
        res
            .status(200)
            .json({ message: "Teacher deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.getTeacherStudents = async (req, res) => {
  try {
    const students = await Student.find({ teacher: req.params.id })
      .populate("course")
      .populate("teacher");
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};