const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size: String,
    quantity: Number,
  },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
    image: String,
    sizes: [sizeSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: { type: Number, required: true },
    salePrice: { type: Number },
    salePercentage: { type: Number, default: 0, min: 0, max: 100 },
    image: String,
    colors: [colorSchema],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.salePercentage > 0) {
    this.salePrice = Math.round(this.price * (1 - this.salePercentage / 100));
  } else {
    this.salePrice = undefined;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
