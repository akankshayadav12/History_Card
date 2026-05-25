// controllers/userController.js
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

// Add User (admin UI) - expects roleId
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'name, email, password and roleId are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, roleId });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (err) {
    console.error('AddUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    // populate the roleId field
    const users = await User.find().select('-password').populate('roleId', 'roleName permissions');
    res.json(users);
  } catch (err) {
    console.error('GetUsers error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('UpdateUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('DeleteUser error:', err);
    res.status(500).json({ error: err.message });
  }
};
