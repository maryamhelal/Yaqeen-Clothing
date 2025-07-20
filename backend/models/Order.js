const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  size: String,
  color: String,
  quantity: Number,
  price: Number,
});

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  country: String,
  phone: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  totalPrice: Number,
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: String,
  orderer: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: String,
    email: String,
  },
  createdAt: { type: Date, default: Date.now },
  orderNumber: { type: Number, unique: true },
});

orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { orderNumber: -1 } });
    this.orderNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 