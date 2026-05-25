// controllers/authController.js
const mongoose = require('mongoose');
const User = require('../models/UserModel');
const UserRole = require('../models/UserRoleModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

// SIGNUP - accepts either roleName (string) or roleId (ObjectId string)
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // role can be roleName or roleId

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required (name, email, password, role)' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    let roleDoc;
    if (mongoose.Types.ObjectId.isValid(role)) {
      roleDoc = await UserRole.findById(role);
    } else {
      roleDoc = await UserRole.findOne({ roleName: role });
    }
    if (!roleDoc) return res.status(400).json({ message: 'Invalid role' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, roleId: roleDoc._id });

    // If user is a student, create a student document linked to this user
    if (roleDoc.roleName === 'student') {
      try {
        // create minimal student record; course/teacher can be set later by admin/faculty
        const student = await Student.create({ name, userId: user._id });
        // optional: attach student id to response (not necessary)
      } catch (studentErr) {
        console.error('Failed creating student record for user:', studentErr);
        // Not fatal for signup — respond with user created but warn
        return res.status(201).json({
          success: true,
          message: 'User created but failed to create student profile. Contact admin.',
          user: { id: user._id, name: user.name, email: user.email, role: roleDoc.roleName },
        });
      }
    }

    const userToSend = { id: user._id, name: user.name, email: user.email, role: roleDoc.roleName };
    res.status(201).json({ success: true, message: 'User created', user: userToSend });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('roleId');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // include roleId and roleName in token for convenience
    const token = jwt.sign(
      { id: user._id, roleId: user.roleId?._id?.toString(), role: user.roleId?.roleName },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.roleId?.roleName
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
