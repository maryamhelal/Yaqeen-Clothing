const Order = require('../models/Order');

exports.create = (data) => Order.create(data);
exports.findByOrderNumber = (orderNumber) => Order.findOne({ orderNumber });
exports.findAll = () => Order.find();
exports.updateStatus = (orderNumber, status) => Order.findOneAndUpdate({ orderNumber }, { status }, { new: true });
exports.findByUser = (userId) => Order.find({ 'orderer.userId': userId }); 