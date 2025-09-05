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
  building: Number,
  residenceType: String,
  floor: String,
  apartment: String,
  companyName: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalPrice: Number,
  promocode: {
    code: String,
    percentage: Number,
    type: String,
    targetId: mongoose.Schema.Types.ObjectId,
    discountAmount: Number,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Instapay"],
    default: "Cash",
  },
  instapayUsername: {
    type: String,
    default: null,
  },
  orderer: {
    userMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userId: Number,
    name: String,
    email: String,
    phone: String,
  },
  createdAt: { type: Date, default: Date.now },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
