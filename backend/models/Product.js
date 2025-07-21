const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: String,
  quantity: Number,
}, { _id: false });

const colorSchema = new mongoose.Schema({
  name: String,
  sizes: [sizeSchema],
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [String],
  colors: [colorSchema],
  category: String,
  collection: String,
  onSale: Boolean,
  categories: [String], // for superadmin management
  collections: [String], // for superadmin management
});

productSchema.statics.getAllCategories = async function() {
  return this.distinct('category');
};

module.exports = mongoose.model('Product', productSchema); 