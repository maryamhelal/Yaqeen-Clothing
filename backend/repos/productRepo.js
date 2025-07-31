const Product = require("../models/Product");

exports.findAll = () => Product.find();
exports.findById = (id) => Product.findById(id);
exports.create = (data) => Product.create(data);
exports.update = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Product.findByIdAndDelete(id);
exports.findByCategory = (category) => Product.find({ category });
exports.findByCollection = (collection) => Product.find({ collection });
