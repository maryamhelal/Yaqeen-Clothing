const productRepo = require('../repos/productRepo');
const fs = require('fs');

exports.getAllProducts = () => productRepo.findAll();
exports.getProductById = (id) => productRepo.findById(id);
exports.createProduct = (data) => productRepo.create(data);
exports.updateProduct = async (id, data) => {
  
  const existing = await productRepo.findById(id);
  if (existing && data.imageUrl) {
    const filePath = `.${existing.imageUrl}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  return productRepo.update(id, data);
};
exports.deleteProduct = async (id) => {
  const product = await productRepo.remove(id);
  if (product && product.imageUrl) {
    const filePath = `.${product.imageUrl}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  return product;
}; 
exports.getProductsByCategory = (category) => productRepo.findByCategory(category);
exports.getProductsByCollection = (collection) => productRepo.findByCollection(collection); 
exports.getAllCategories = () => require('../models/Product').getAllCategories(); 