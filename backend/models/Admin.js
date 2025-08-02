const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
