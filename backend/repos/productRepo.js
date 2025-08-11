const Product = require("../models/Product");
const Tag = require("../models/Tag");

exports.findAll = () => Product.find();
exports.findById = (id) => Product.findById(id);
exports.create = (data) => Product.create(data);
exports.update = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true });
exports.remove = (id) => Product.findByIdAndDelete(id);

exports.findByCategory = async (categoryName) => {
  // Find the tag by name first
  const tag = await Tag.findOne({ name: categoryName, tag: "category" });
  if (!tag) return [];
  
  // Then find products by the tag's ObjectId
  return Product.find({ category: tag._id });
};

exports.findByCollection = async (collectionName) => {
  // Find the tag by name first
  const tag = await Tag.findOne({ name: collectionName, tag: "collection" });
  if (!tag) return [];
  
  // Then find products by the tag's ObjectId
  return Product.find({ collection: tag._id });
};
