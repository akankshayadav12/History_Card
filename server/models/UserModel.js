// models/UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', required: true }
}, { timestamps: true });

// Guard against model overwrite in dev/hot-reload environments
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
