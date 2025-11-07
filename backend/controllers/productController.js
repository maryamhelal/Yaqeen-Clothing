const productService = require("../services/productService");
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      salePercentage,
      category,
      collection,
      colors,
    } = req.body;

    // Product image (single)
    let productImageUrl = null;
    if (req.files.image && req.files.image[0]) {
      productImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.files.image[0].filename
      }`;
    }

    // Parse colors JSON and attach image URLs
    let colorsArr = [];
    if (colors) {
      colorsArr = JSON.parse(colors).map((color, idx) => {
        let colorImageUrl = null;
        const colorImageField = `colorImages_${idx}`;
        if (req.files[colorImageField] && req.files[colorImageField][0]) {
          colorImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
            req.files[colorImageField][0].filename
          }`;
        }
        return {
          ...color,
          image: colorImageUrl,
        };
      });
    }

    // Save product
    const product = new Product({
      name,
      description,
      price,
      salePercentage,
      image: productImageUrl,
      colors: colorsArr,
      category,
      collection,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Product image (single)
    if (req.files.image && req.files.image[0]) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
        req.files.image[0].filename
      }`;
    }

    // Parse colors JSON and attach image URLs
    if (updateData.colors) {
      updateData.colors = JSON.parse(updateData.colors).map((color, idx) => {
        let colorImageUrl = null;
        const colorImageField = `colorImages_${idx}`;
        if (req.files[colorImageField] && req.files[colorImageField][0]) {
          colorImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
            req.files[colorImageField][0].filename
          }`;
        }
        return {
          ...color,
          image: colorImageUrl,
        };
      });
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
    // Do not expose archived products to public users
    if (product.archived)
      return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const product = await productService.getProductByName(req.params.name);
    if (!product) return res.status(404).json({ error: "Product not found" });
    // Hide archived products from public access
    if (product.archived)
      return res.status(404).json({ error: "Product not found" });
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

exports.getActiveProducts = async (req, res) => {
  try {
    const products = await productService.getActiveProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getArchivedProducts = async (req, res) => {
  try {
    const products = await productService.getArchivedProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.archiveProduct = async (req, res) => {
  try {
    const product = await productService.archiveProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product archived successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.unarchiveProduct = async (req, res) => {
  try {
    const product = await productService.unarchiveProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product unarchived successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
