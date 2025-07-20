const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ orderNumber: order.orderNumber, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};