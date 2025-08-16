const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { name, description, tag, sale } = req.body;

    // Validation
    if (!name || !tag) {
      return res.status(400).json({ error: "Name and tag type are required" });
    }

    if (!["category", "collection"].includes(tag)) {
      return res
        .status(400)
        .json({ error: "Tag type must be 'category' or 'collection'" });
    }

    // Check if tag already exists
    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: "Tag already exists" });
    }

    // Handle image upload
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // Create new tag
    const newTag = new Tag({
      name,
      description: description || "",
      image: imageUrl,
      tag,
      sale: sale || 0,
    });

    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (err) {
    console.error("Error creating tag:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Tag id is required" });

    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).json({ error: "Tag not found" });

    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.updateTag = async (req, res) => {
  try {
    const { name } = req.params;
    const { description, tag, sale } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const tagDoc = await Tag.findOne({ name });
    if (!tagDoc) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Update allowed fields
    if (description !== undefined) tagDoc.description = description;
    if (tag !== undefined) {
      if (!["category", "collection"].includes(tag)) {
        return res
          .status(400)
          .json({ error: "Tag type must be 'category' or 'collection'" });
      }
      tagDoc.tag = tag;
    }
    if (sale !== undefined) tagDoc.sale = sale;

    // Handle image upload
    if (req.file) {
      tagDoc.image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedTag = await tagDoc.save();
    res.json(updatedTag);
  } catch (err) {
    console.error("Error updating tag:", err);
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
