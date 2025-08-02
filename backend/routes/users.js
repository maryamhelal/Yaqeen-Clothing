const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/", auth, requireRole(["superadmin"]), userController.listUsers);

router.delete(
  "/:id",
  auth,
  requireRole(["superadmin"]),
  userController.deleteUser
);

module.exports = router;
