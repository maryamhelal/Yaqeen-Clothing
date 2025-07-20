const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({ ...req.body, orderer: { userId: req.user._id, name: req.user.name, email: req.user.email } });
    res.status(201).json({ orderNumber: order.orderNumber, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    // Only allow orderer or admin/superadmin
    if (req.user.role === 'user' && (!order.orderer || String(order.orderer.userId) !== String(req.user._id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.orderNumber, req.body.status);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};