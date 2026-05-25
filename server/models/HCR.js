// const mongoose = require("mongoose");

// const hcrSchema = new mongoose.Schema({
//     topic: {
//         type: String,
//         required: [true, "topic is required"],
//     },
//     description: {
//         type: String,
//         required: [true, "description is required"],
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model("HCR",hcrSchema);




const mongoose = require("mongoose");

const hcrSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    topic: {
        type: String,
        required: [true, "topic is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("HCR", hcrSchema);
