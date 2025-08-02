const productService = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      colors,
      category,
      collection,
      onSale,
      images,
    } = req.body;
    if (typeof colors === "string") colors = JSON.parse(colors);
    if (typeof images === "string") images = JSON.parse(images);

    // Convert color images from base64 to Buffer
    colors = colors.map((color) => ({
      ...color,
      hex: color.hex || "#ffffff",
      image: color.image
        ? Buffer.from(
            color.image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          )
        : undefined,
    }));

    // Convert product images from base64 to Buffer
    images = images.map((img) =>
      img
        ? Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64")
        : undefined
    );

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
    let {
      name,
      description,
      price,
      colors,
      category,
      collection,
      onSale,
      images,
    } = req.body;
    if (typeof colors === "string") colors = JSON.parse(colors);
    if (typeof images === "string") images = JSON.parse(images);

    colors = colors.map((color) => ({
      ...color,
      image: color.image
        ? Buffer.from(
            color.image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          )
        : undefined,
    }));

    images = images.map((img) =>
      img
        ? Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64")
        : undefined
    );

    const updateData = {
      name,
      description,
      price,
      colors,
      category,
      collection,
      onSale,
    };
    if (images) updateData.images = images;
    const product = await productService.updateProduct(
      req.params.id,
      updateData
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProduct(req.params.id);
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
    const products = await productService.getProductsByCategory(
      req.params.category
    );
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProductsByCollection = async (req, res) => {
  try {
    const products = await productService.getProductsByCollection(
      req.params.collection
    );
    res.json(products);
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

function getEffectiveSale(product, categorySales = {}, collectionSales = {}) {
  if (product.onSale > 0) {
    return product.onSale;
  }
  if (product.collection && collectionSales[product.collection] > 0) {
    return collectionSales[product.collection];
  }
  if (product.category && categorySales[product.category] > 0) {
    return categorySales[product.category];
  }
  return 0;
}
