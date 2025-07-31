const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  color: String,
  colorImage: Buffer,
  size: String,
  quantity: Number,
  price: Number,
});

const shippingAddressSchema = new mongoose.Schema({
  city: String,
  area: String,
  street: String,
  landmarks: String,
  residenceType: String,
  floor: String,
  apartment: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Instapay", "Card"],
    default: "Cash",
  },
  orderer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: String,
    email: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
