const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, salePercentage, category, collection } =
      req.body;

    let colors = JSON.parse(req.body.colors || "[]");

    colors = colors.map((color, idx) => {
      const file = req.files[`colorImages_${idx}`]?.[0];
      return {
        ...color,
        image: file ? file.buffer : undefined,
      };
    });

    const productImages = req.files["images"]
      ? req.files["images"].map((f) => f.buffer)
      : [];

    const product = await productService.createProduct({
      ...req.body,
      colors,
      images: productImages,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.length) {
      updateData.images = req.files.map((file) => file.path);
    }

    const product = await productService.updateProduct(
      req.params.id,
      updateData
    );
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || "";
    const collection = req.query.collection || "";

    const result = await productService.getAllProducts(
      page,
      limit,
      category,
      collection
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const product = await productService.getProductByName(req.params.name);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await productService.getProductsByCategory(
      req.params.category,
      page,
      limit
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductsByCollection = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await productService.getProductsByCollection(
      req.params.collection,
      page,
      limit
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductsBySearch = async (req, res) => {
  try {
    const { query } = req;
    const products = await productService.getProductsBySearch(query);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
