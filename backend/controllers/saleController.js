const Product = require("../models/Product");
const Tag = require("../models/Tag");
const emailCampaignService = require("../services/emailCampaignService");

exports.updateProductSale = async (req, res) => {
  try {
    const { productId } = req.params;
    const { salePercentage } = req.body;

    if (salePercentage < 0 || salePercentage > 100) {
      return res.status(400).json({ error: "Sale percentage must be between 0 and 100" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if category or collection has existing sales
    let warnings = [];
    if (product.category) {
      const category = await Tag.findById(product.category);
      if (category && category.sale > 0) {
        warnings.push(`Category "${category.name}" has ${category.sale}% sale`);
      }
    }
    if (product.collection) {
      const collection = await Tag.findById(product.collection);
      if (collection && collection.sale > 0) {
        warnings.push(`Collection "${collection.name}" has ${collection.sale}% sale`);
      }
    }

    // Update product sale
    product.salePercentage = salePercentage;
    await product.save();

    res.json({ 
      product, 
      warnings: warnings.length > 0 ? warnings : undefined,
      message: `Product sale updated to ${salePercentage}%`
    });
  } catch (err) {
    console.error("Error updating product sale:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.sendSaleEmail = async (req, res) => {
  try {
    const { productIds, salePercentage, saleType = 'product' } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Product IDs are required" });
    }

    if (salePercentage < 0 || salePercentage > 100) {
      return res.status(400).json({ error: "Sale percentage must be between 0 and 100" });
    }

    // Get products
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    // Send sale email directly (no queue)
    const result = await emailCampaignService.sendSaleEmail(products, salePercentage, saleType);

    res.json({
      success: true,
      message: `Sale email sent to ${result.recipientsCount} users`,
      recipientsCount: result.recipientsCount,
      productsCount: products.length
    });
  } catch (err) {
    console.error("Error sending sale email:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ salePercentage: { $gt: 0 } })
      .populate('category', 'name')
      .populate('collection', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("Error fetching sale products:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpdateSale = async (req, res) => {
  try {
    const { productIds, salePercentage } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "Product IDs are required" });
    }

    if (salePercentage < 0 || salePercentage > 100) {
      return res.status(400).json({ error: "Sale percentage must be between 0 and 100" });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { salePercentage }
    );

    res.json({
      success: true,
      message: `Updated sale percentage for ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Error bulk updating sale:", err);
    res.status(500).json({ error: err.message });
  }
};
