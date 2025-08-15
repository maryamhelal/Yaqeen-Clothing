const Order = require("../models/Order");

exports.create = (data) => Order.create(data);

exports.findById = (orderId) => Order.findById(orderId);

exports.findByOrderNumber = (orderNumber) => Order.findById(orderNumber);

exports.findAll = () => Order.find().sort({ createdAt: -1 });

exports.findAllWithPagination = async (page = 1, limit = 10, status = '') => {
  const skip = (page - 1) * limit;
  const filter = status ? { status } : {};
  
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter)
  ]);
  
  return {
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
};

exports.updateStatus = (orderId, status) =>
  Order.findByIdAndUpdate(orderId, { status }, { new: true });

exports.findByUser = (userId) => Order.find({ "orderer.userId": userId }).sort({ createdAt: -1 });

exports.findByUserWithPagination = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [orders, total] = await Promise.all([
    Order.find({ "orderer.userId": userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ "orderer.userId": userId })
  ]);
  
  return {
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
};
