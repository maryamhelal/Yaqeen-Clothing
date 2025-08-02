const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size: String,
    stock: Number,
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
    image: Buffer,
    sizes: [sizeSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [Buffer],
  colors: [colorSchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
  onSale: { type: Number, default: 0 }, // percentage off
});

module.exports = mongoose.model("Product", productSchema);
