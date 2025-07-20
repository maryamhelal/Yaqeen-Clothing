const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  size: String,
  quantity: Number,
  price: Number,
});

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  country: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  orderNumber: String,
});

module.exports = mongoose.model('Order', orderSchema); 