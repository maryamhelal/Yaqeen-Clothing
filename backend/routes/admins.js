const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

router.get("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

router.post("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email exists" });
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email,
    password: hash,
    role: "admin",
  });
  res.status(201).json(admin);
});

router.put("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const update = { name, email, role };
  if (password) update.password = await bcrypt.hash(password, 10);
  const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(admin);
});

router.delete("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
});

module.exports = router;
