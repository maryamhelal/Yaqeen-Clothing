const Promocode = require("../models/Promocode");

// Preview promocode validity and discount
exports.previewPromocode = async (req, res) => {
  try {
    const { items, promocode: promocodeInput } = req.body;
    if (!promocodeInput || !promocodeInput.code) {
      return res.status(400).json({ error: "No promocode provided." });
    }
    const promocodeDoc = await Promocode.findOne({
      code: promocodeInput.code,
      active: true,
    });
    if (!promocodeDoc) {
      return res.json({
        valid: false,
        error: "Invalid or inactive promocode.",
      });
    }
    if (promocodeDoc.expiry && new Date(promocodeDoc.expiry) < new Date()) {
      return res.json({ valid: false, error: "Promocode expired." });
    }
    if (promocodeDoc.uses >= promocodeDoc.maxUses) {
      return res.json({
        valid: false,
        error: "Promocode usage limit reached.",
      });
    }
    let eligibleTotal = 0;
    items.forEach((item) => {
      if (
        (promocodeDoc.type === "product" &&
          item.id == String(promocodeDoc.targetId)) ||
        (promocodeDoc.type === "category" &&
          item.categoryId == String(promocodeDoc.targetId)) ||
        (promocodeDoc.type === "collection" &&
          item.collectionId == String(promocodeDoc.targetId))
      ) {
        eligibleTotal += item.price * item.quantity;
      }
    });
    if (eligibleTotal === 0) {
      return res.json({
        valid: false,
        error: "Promocode not applicable to any items in your cart.",
      });
    }
    const discountAmount = Math.round(
      (eligibleTotal * promocodeDoc.percentage) / 100
    );
    return res.json({
      valid: true,
      discountAmount,
      promocode: {
        code: promocodeDoc.code,
        percentage: promocodeDoc.percentage,
        type: promocodeDoc.type,
        targetId: promocodeDoc.targetId,
        discountAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
};

// Create a new promocode
exports.createPromocode = async (req, res) => {
  try {
    const promocode = new Promocode(req.body);
    await promocode.save();
    res.status(201).json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all promocodes
exports.getPromocodes = async (req, res) => {
  try {
    const promocodes = await Promocode.find();
    res.json(promocodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a promocode
exports.updatePromocode = async (req, res) => {
  try {
    const promocode = await Promocode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!promocode)
      return res.status(404).json({ error: "Promocode not found" });
    res.json(promocode);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a promocode
exports.deletePromocode = async (req, res) => {
  try {
    const promocode = await Promocode.findByIdAndDelete(req.params.id);
    if (!promocode)
      return res.status(404).json({ error: "Promocode not found" });
    res.json({ message: "Promocode deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
