const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Your Name is required"],
    },

    status: {
        type: String,
        default: "Active"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Teacher", teacherSchema);
