const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: String,
  hex: String,
  images: [String], // URLs or paths
});

const sizeQuantitySchema = new mongoose.Schema({
  size: String,
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  colors: [colorSchema],
  sizes: [sizeQuantitySchema],
  category: String,
  collection: String,
  onSale: Boolean,
});

productSchema.statics.getAllCategories = async function() {
  return this.distinct('category');
};

module.exports = mongoose.model('Product', productSchema); 