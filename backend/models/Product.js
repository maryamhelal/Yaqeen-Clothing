const mongoose = require('mongoose');

const sizeQuantitySchema = new mongoose.Schema({
  size: String,
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  sizes: [sizeQuantitySchema],
  category: String,
  onSale: Boolean,
});

module.exports = mongoose.model('Product', productSchema); 