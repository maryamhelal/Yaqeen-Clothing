const Product = require("../models/Product");
const Tag = require("../models/Tag");

exports.findAll = () => Product.find().sort({ createdAt: -1 });

exports.findAllWithPagination = async (
  page = 1,
  limit = 10,
  category = "",
  collection = ""
) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (category) {
    const categoryTag = await Tag.findOne({ name: category, tag: "category" });
    if (categoryTag) filter.category = categoryTag._id;
  }

  if (collection) {
    const collectionTag = await Tag.findOne({
      name: collection,
      tag: "collection",
    });
    if (collectionTag) filter.collection = collectionTag._id;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
};

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
  return Product.find({ category: tag._id }).sort({ createdAt: -1 });
};

exports.findByCategoryWithPagination = async (
  categoryName,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  // Find the tag by name first
  const tag = await Tag.findOne({ name: categoryName, tag: "category" });
  if (!tag) {
    return {
      products: [],
      totalPages: 0,
      currentPage: page,
      total: 0,
    };
  }

  // Then find products by the tag's ObjectId
  const [products, total] = await Promise.all([
    Product.find({ category: tag._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ category: tag._id }),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
};

exports.findByCollection = async (collectionName) => {
  // Find the tag by name first
  const tag = await Tag.findOne({ name: collectionName, tag: "collection" });
  if (!tag) return [];

  // Then find products by the tag's ObjectId
  return Product.find({ collection: tag._id }).sort({ createdAt: -1 });
};

exports.findByCollectionWithPagination = async (
  collectionName,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  // Find the tag by name first
  const tag = await Tag.findOne({ name: collectionName, tag: "collection" });
  if (!tag) {
    return {
      products: [],
      totalPages: 0,
      currentPage: page,
      total: 0,
    };
  }

  // Then find products by the tag's ObjectId
  const [products, total] = await Promise.all([
    Product.find({ collection: tag._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ collection: tag._id }),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
};
