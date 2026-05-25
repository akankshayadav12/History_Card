const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course Name is required"],
    },
    topics: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Course", courseSchema);
