// const Student = require("../models/Student");
// // const { createSecretToken } = require("../util/SecretToken");
// // const bcrypt = require("bcryptjs");

// // Create student
// module.exports.createStudent = async (req, res, next) => {
//     try {
//         const { name, course, teacher, createdAt } = req.body;

//         const student = await Student.create({
//             name,
//             course,
//             teacher,
//             status: "ongoing",
//             hcr: [],
//             createdAt,
//         });

//         res.status(201).json({
//             message: "Student created successfully",
//             success: true,
//             student,
//         });
//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// // Get all students
// module.exports.getStudents = async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.status(200).json({ success: true, students });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// // Get student by ID
// module.exports.getStudentById = async (req, res) => {
//     try {
//         const student = await Student.findById(req.params.id);
//         if (!student) {
//             return res
//                 .status(404)
//                 .json({ message: "Student not found", success: false });
//         }
//         res.status(200).json({ success: true, student });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// // Update student
// module.exports.updateStudent = async (req, res) => {
//     try {
//         const { name, course, teacher } = req.body;

//         const student = await Student.findById(req.params.id);
//         if (!student) {
//             return res
//                 .status(404)
//                 .json({ message: "Student not found", success: false });
//         }

//         if (name) student.name = name;
//         if (course) student.course = course;
//         if (teacher) student.teacher = teacher;


//         await student.save();

//         res
//             .status(200)
//             .json({ message: "Student updated successfully", success: true, student });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };

// // Delete student
// module.exports.deleteStudent = async (req, res) => {
//     try {
//         const student = await Student.findByIdAndDelete(req.params.id);
//         if (!student) {
//             return res
//                 .status(404)
//                 .json({ message: "Student not found", success: false });
//         }
//         res
//             .status(200)
//             .json({ message: "Student deleted successfully", success: true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };


const Student = require("../models/Student");
const mongoose = require("mongoose");

exports.createStudent = async (req, res) => {
  try {
    const { name, course, teacher, userId } = req.body;
    console.log("📥 Incoming data:", req.body);

    const student = await Student.create({ name, course, teacher, userId });
    res.status(201).json({ success: true, message: "Student created", student });
  } catch (err) {
    console.error("❌ Error creating student:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


// exports.getAllStudents = async (req, res) => {
//   try {
//     const { teacher } = req.query;

//     const filter = teacher ? { teacher } : {};
//     const students = await Student.find(filter)
//       .populate("course", "name")
//       .populate("teacher", "name");

//     res.status(200).json({ success: true, students });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

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
const getFacultyStudents = async (req, res) => {
  try {
    let students;
    if (req.user.role === "faculty") {
      students = await Student.find({ facultyId: req.user._id });
    } else {
      students = await Student.find(); // admin
    }
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFacultyStudents = async (req, res) => {
  try {
    let students;
    if (req.facultyId)
      students = await Student.find({ facultyId: req.facultyId });
    else {
      students = await Student.find(); // admin
    }
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/studentControllers.js
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/studentController.js
exports.getMyStudents = async (req, res) => {
  try {
    // req.user.id comes from JWT middleware
    const teacherId = req.user.id;

    const students = await Student.find({ teacher: teacherId })
      .populate("course")
      .populate("teacher");

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
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