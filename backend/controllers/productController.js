const productService = require('../services/productService');

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { name, description, price, colors, category, collection, onSale, images } = req.body;
    // Parse JSON strings if needed
    if (typeof colors === 'string') colors = JSON.parse(colors);
    if (typeof images === 'string') images = JSON.parse(images);
    // Expect colors as an array of { name, sizes: [{ size, quantity }] }
    const product = await productService.createProduct({
      name,
      description,
      price,
      images,
      colors,
      category,
      collection,
      onSale,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let { name, description, price, colors, category, collection, onSale, images } = req.body;
    if (typeof colors === 'string') colors = JSON.parse(colors);
    if (typeof images === 'string') images = JSON.parse(images);
    const updateData = { name, description, price, colors, category, collection, onSale };
    if (images) updateData.images = images;
    const product = await productService.updateProduct(req.params.id, updateData);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByCollection = async (req, res) => {
  try {
    const products = await productService.getProductsByCollection(req.params.collection);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await productService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 