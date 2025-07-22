const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: {
    city: String,
    area: String,
    street: String,
    landmarks: String,
    residenceType: String,
    floor: String,
    apartment: String,
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  addresses: [addressSchema],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  resetOTP: String,
  resetOTPExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 