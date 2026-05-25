// controllers/roleController.js
const UserRole = require('../models/UserRoleModel');

// Add Role
exports.addRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;
    if (!roleName || roleName.trim() === '') {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const existingRole = await UserRole.findOne({ roleName: roleName.trim() });
    if (existingRole) {
      return res.status(409).json({ error: 'Role already exists' });
    }

    const role = new UserRole({
      roleName: roleName.trim(),
      permissions: permissions || []
    });

    await role.save();

    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    console.error('AddRole error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await UserRole.find();
    res.json(roles);
  } catch (err) {
    console.error('GetRoles error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRole = await UserRole.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedRole);
  } catch (err) {
    console.error('UpdateRole error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    await UserRole.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    console.error('DeleteRole error:', err);
    res.status(500).json({ error: err.message });
  }
};
