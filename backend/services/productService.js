const productRepo = require("../repos/productRepo");
const fs = require("fs");

exports.getAllProducts = async (
  page = 1,
  limit = 10,
  category = "",
  collection = ""
) => {
  return await productRepo.findAllWithPagination(
    page,
    limit,
    category,
    collection
  );
};

exports.getProductById = (id) => productRepo.findById(id);

exports.getProductByName = (name) => productRepo.findByName(name);

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

exports.getProductsByCategory = async (category, page = 1, limit = 10) => {
  return await productRepo.findByCategoryWithPagination(category, page, limit);
};

exports.getProductsByCollection = async (collection, page = 1, limit = 10) => {
  return await productRepo.findByCollectionWithPagination(
    collection,
    page,
    limit
  );
};

exports.getActiveProducts = async (page = 1, limit = 10) => {
  return await productRepo.findActiveWithPagination(page, limit);
};

exports.getArchivedProducts = async (page = 1, limit = 10) => {
  return await productRepo.findArchivedWithPagination(page, limit);
};

exports.archiveProduct = async (id) => {
  return await productRepo.setArchiveStatus(id, true);
};

exports.unarchiveProduct = async (id) => {
  return await productRepo.setArchiveStatus(id, false);
};
