const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const existing = await Tag.findOne({ name: req.body.name });
    if (existing) return res.status(400).json({ error: "Tag already exists" });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTag = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) return res.status(400).json({ error: "Tag name is required" });

    const tag = await Tag.findOne({ name });
    if (!tag) return res.status(404).json({ error: "Tag not found" });

    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const tags = await Tag.find({ tag: "category" });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const tags = await Tag.find({ tag: "collection" });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) return res.status(400).json({ error: "Tag name is required" });

    const deletedTag = await Tag.findOneAndDelete({ name });
    if (!deletedTag) return res.status(404).json({ error: "Tag not found" });

    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTagSale = async (req, res) => {
  try {
    const { name, sale } = req.body;
    if (!name || sale == null) {
      return res.status(400).json({ error: "Both name and sale are required" });
    }

    const tag = await Tag.findOne({ name });
    if (!tag) return res.status(404).json({ error: "Tag not found" });

    tag.sale = sale;
    const updatedTag = await tag.save();
    res.json(updatedTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
