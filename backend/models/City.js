const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  areas: [{ type: String }],
});

module.exports = mongoose.model("City", citySchema);
