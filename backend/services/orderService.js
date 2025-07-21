const orderRepo = require('../repos/orderRepo');

exports.createOrder = async (data) => {
  if (!data.items || data.items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }
  return await orderRepo.create(data);
};

exports.getOrderByNumber = async (orderNumber) => {
  const order = await orderRepo.findByOrderNumber(orderNumber);
  if (!order) {
    throw new Error('Order not found.');
  }
  return order;
};

exports.getAllOrders = () => orderRepo.findAll();
exports.updateOrderStatus = (orderNumber, status) => orderRepo.updateStatus(orderNumber, status);
exports.getOrdersByUser = (userId) => orderRepo.findByUser(userId); 