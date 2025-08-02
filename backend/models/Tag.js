const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    sale: { type: Number, default: 0 },
    tag: { type: String, enum: ["category", "collection"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);
