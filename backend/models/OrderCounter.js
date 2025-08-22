const mongoose = require("mongoose");

const orderCounterSchema = new mongoose.Schema({
  name: { type: String, default: "order" },
  seq: { type: Number, default: 1000 },
});

module.exports = mongoose.model("OrderCounter", orderCounterSchema);
