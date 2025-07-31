const Admin = require("../models/Admin");

// Get categories and collections (superadmin only)
exports.getCategoriesAndCollections = async (req, res) => {
  try {
    const admin = await Admin.findOne({ role: "superadmin" });
    if (!admin) return res.status(404).json({ error: "Superadmin not found" });
    res.json({
      categories: admin.categories || [],
      collections: admin.collections || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add category
exports.addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const admin = await Admin.findOne({ role: "superadmin" });
    if (!admin) return res.status(404).json({ error: "Superadmin not found" });
    if (!admin.categories.includes(category)) {
      admin.categories.push(category);
      await admin.save();
    }
    res.json({ categories: admin.categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const admin = await Admin.findOne({ role: "superadmin" });
    if (!admin) return res.status(404).json({ error: "Superadmin not found" });
    if (admin.categories.includes(category)) {
      admin.categories = admin.categories.filter((cat) => cat !== category);
      await admin.save();
    }
    res.json({ categories: admin.categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add collection
exports.addCollection = async (req, res) => {
  try {
    const { collection } = req.body;
    const admin = await Admin.findOne({ role: "superadmin" });
    if (!admin) return res.status(404).json({ error: "Superadmin not found" });
    if (!admin.collections.includes(collection)) {
      admin.collections.push(collection);
      await admin.save();
    }
    res.json({ collections: admin.collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const { collection } = req.body;
    const admin = await Admin.findOne({ role: "superadmin" });
    if (!admin) return res.status(404).json({ error: "Superadmin not found" });
    if (admin.collections.includes(collection)) {
      admin.collections = admin.collections.filter((col) => col !== collection);
      await admin.save();
    }
    res.json({ collections: admin.collections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
