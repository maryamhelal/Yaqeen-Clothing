const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const adminController = require("../controllers/adminController");

// Get all admins
router.get("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

// Add admin
router.post("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email exists" });
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email,
    password: hash,
    role: role || "admin",
  });
  res.status(201).json(admin);
});

// Edit admin
router.put("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const update = { name, email, role };
  if (password) update.password = await bcrypt.hash(password, 10);
  const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(admin);
});

// Delete admin
router.delete("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
});

router.get("/categories", adminController.getCategories);
router.get("/collections", adminController.getCollections);

router.post("/add-category", adminController.addCategory);
router.post("/add-collection", adminController.addCollection);

router.delete("/delete-category", adminController.deleteCategory);
router.delete("/delete-collection", adminController.deleteCollection);

module.exports = router;
