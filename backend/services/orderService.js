const orderRepo = require("../repos/orderRepo");

exports.createOrder = async (data) => {
  if (!data.items || data.items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }
  return await orderRepo.create(data);
};

exports.getOrderById = async (orderId) => {
  const order = await orderRepo.findById(orderId);
  if (!order) {
    throw new Error("Order not found.");
  }
  return order;
};

exports.getOrderByNumber = async (orderNumber) => {
  const order = await orderRepo.findByOrderNumber(orderNumber);
  if (!order) {
    throw new Error("Order not found.");
  }
  return order;
};

exports.getAllOrders = async (page = 1, limit = 10, status = '') => {
  return await orderRepo.findAllWithPagination(page, limit, status);
};

exports.updateOrderStatus = async (orderId, status) => {
  const order = await orderRepo.updateStatus(orderId, status);
  if (!order) {
    throw new Error("Order not found.");
  }
  return order;
};

exports.getOrdersByUser = async (userId, page = 1, limit = 10) => {
  return await orderRepo.findByUserWithPagination(userId, page, limit);
};
