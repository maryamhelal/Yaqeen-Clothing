const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const userController = require("../controllers/userController");

// List all users (superadmin only)
router.get("/", auth, requireRole(["superadmin"]), userController.listUsers);
// Delete user (superadmin only)
router.delete(
  "/:id",
  auth,
  requireRole(["superadmin"]),
  userController.deleteUser
);

module.exports = router;
