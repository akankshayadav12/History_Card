// // routes/roleRoutes.js
// const express = require("express");
// const router = express.Router();


// module.exports = router;




const express = require("express");
const router = express.Router();
const roleController = require("../controllers/userRoleController");

// GET all roles
router.get("/roles", roleController.getRoles);

// Add role
router.post("/roles", roleController.addRole);

// Update role
router.put("/roles/:id", roleController.updateRole);

// Delete role
router.delete("/roles/:id", roleController.deleteRole);
module.exports = router;