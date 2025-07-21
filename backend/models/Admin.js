const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  categories: [String], // superadmin managed
  collections: [String], // superadmin managed
});

module.exports = mongoose.model('Admin', adminSchema); 