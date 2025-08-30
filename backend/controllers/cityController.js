const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find({}, "name price areas");
    res.json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCityAreas = async (req, res) => {
  try {
    const city = await City.findById(req.params.cityId);
    if (!city)
      return res.status(404).json({ success: false, error: "City not found" });
    res.json({ success: true, data: city.areas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin: create city
exports.createCity = async (req, res) => {
  try {
    const { name, price, areas } = req.body;
    const city = await City.create({ name, price, areas });
    res.status(201).json({ success: true, data: city });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin: update city
exports.updateCity = async (req, res) => {
  try {
    const { name, price, areas } = req.body;
    const city = await City.findByIdAndUpdate(
      req.params.cityId,
      { name, price, areas },
      { new: true }
    );
    if (!city)
      return res.status(404).json({ success: false, error: "City not found" });
    res.json({ success: true, data: city });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin: delete city
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.cityId);
    if (!city)
      return res.status(404).json({ success: false, error: "City not found" });
    res.json({ success: true, data: city });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
