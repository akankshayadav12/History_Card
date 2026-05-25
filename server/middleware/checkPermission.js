// middleware/checkPermission.js
const UserRole = require('../models/UserRoleModel');

const checkPermission = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || !user.roleId) {
      return res.status(403).json({ error: 'Access Denied. No Role Assigned.' });
    }

    // roleId may be populated object or ObjectId
    const role = await UserRole.findById(user.roleId._id ? user.roleId._id : user.roleId);
    if (!role) {
      return res.status(403).json({ error: 'Role not found' });
    }

    // normalize paths: remove trailing slash
    let requestPath = req.originalUrl.split('?')[0].replace(/\/$/, '');
    const requestedPermission = `${req.method.toUpperCase()} ${requestPath}`;

    const isMatch = role.permissions.some((permission) => {
      if (!permission) return false;
      const parts = permission.trim().split(' ');
      if (parts.length < 2) return false;
      const method = parts[0].toUpperCase();
      const storedPath = parts.slice(1).join(' ').replace(/\/$/, '');

      if (method !== req.method.toUpperCase()) return false;

      // simple wildcard matching for :id style
      const storedParts = storedPath.split('/');
      const requestParts = requestPath.split('/');
      if (storedParts.length !== requestParts.length) return false;

      for (let i = 0; i < storedParts.length; i++) {
        if (storedParts[i].startsWith(':')) continue; // param match
        if (storedParts[i] !== requestParts[i]) return false;
      }
      return true;
    });

    if (!isMatch) {
      return res.status(403).json({ error: 'Access Denied. Insufficient permissions.' });
    }

    next();
  } catch (error) {
    console.error('CheckPermission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkPermission;
