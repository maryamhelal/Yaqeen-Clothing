const Order = require('../models/Order');

exports.create = (data) => Order.create(data);
exports.findByOrderNumber = (orderNumber) => Order.findOne({ orderNumber }); 