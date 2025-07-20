const orderRepo = require('../repos/orderRepo');

exports.createOrder = async (data) => {
  if (!data.items || data.items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }
  
  if (!data.orderNumber) {
    data.orderNumber = 'ORD-' + Date.now(); //if two orders are placed at the same time, this is not accurate
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