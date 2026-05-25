// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Your Name is required"] },

  // make course & teacher optional so we can create student record at signup time
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },

  // link to the User document (the logged-in account)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: { type: String, default: "ongoing" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
