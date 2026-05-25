const HCR = require("../models/HCR");

exports.createHCR = async (req, res) => {
  try {
    const { student, topic, description } = req.body;

    const record = await HCR.create({ student, topic, description });
    res.status(201).json({ success: true, message: "HCR created", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllHCRs = async (req, res) => {
  try {
    const records = await HCR.find().populate("student", "name"); // populates student name
    res.status(200).json({ success: true, records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getHCRsByStudent = async (req, res) => {
  try {
    const records = await HCR.find({ student: req.params.studentId })
      .sort({ createdAt: -1 })
      .populate("student", "name");  // <-- add populate
    res.status(200).json({ success: true, records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getHCRById = async (req, res) => {
  try {
    const record = await HCR.findById(req.params.id)
      .populate("student", "name");  // <-- add populate

    if (!record) {
      return res.status(404).json({ success: false, message: "HCR not found" });
    }

    res.status(200).json({ success: true, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateHCR = async (req, res) => {
  try {
    const record = await HCR.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!record) {
      return res.status(404).json({ success: false, message: "HCR not found" });
    }

    res.status(200).json({ success: true, message: "HCR updated", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteHCR = async (req, res) => {
  try {
    const record = await HCR.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: "HCR not found" });
    }

    res.status(200).json({ success: true, message: "HCR deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getHCRByStudentId = async (req, res) => {
  try {
    const studentId = req.params.id;
    const hcrRecords = await HCR.find({ student: studentId }).populate("student");

    res.status(200).json({ success: true, hcrRecords });
  } catch (err) {
    console.error("Error fetching HCR records:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};