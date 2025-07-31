const Order = require("../models/Order");

exports.create = (data) => Order.create(data);
exports.findByOrderId = (orderId) => Order.findById({ orderId });
exports.findAll = () => Order.find();
exports.updateStatus = (orderId, status) =>
  Order.findByIdAndUpdate({ orderId }, { status }, { new: true });
exports.findByUser = (userId) => Order.find({ "orderer.userId": userId });
