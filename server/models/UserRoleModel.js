// models/UserRoleModel.js
const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true, trim: true },
  permissions: { type: [String], default: [] } // e.g. ["GET /students", "POST /courses"]
}, { timestamps: true });

module.exports = mongoose.models.UserRole || mongoose.model('UserRole', userRoleSchema);
