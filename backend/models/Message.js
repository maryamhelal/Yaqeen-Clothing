const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
