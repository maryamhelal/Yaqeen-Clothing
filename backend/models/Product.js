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
  price: { type: Number, required: true }, // Original price
  salePrice: { type: Number }, // Calculated sale price
  salePercentage: { type: Number, default: 0, min: 0, max: 100 }, // Individual product sale percentage
  images: [Buffer],
  colors: [colorSchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" }
}, { timestamps: true });

// Pre-save middleware to calculate sale price
productSchema.pre('save', function(next) {
  if (this.salePercentage > 0) {
    this.salePrice = Math.round(this.price * (1 - this.salePercentage / 100));
  } else {
    this.salePrice = undefined;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
