const orderService = require("../services/orderService");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderCounter = require("../models/OrderCounter");
const confirmationEmail = require("../utils/confirmationEmail");

exports.createOrder = async (req, res) => {
  try {
    // Generate sequential order number
    let counter = await OrderCounter.findOneAndUpdate(
      { name: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderNumber = "ORD-" + counter.seq;

    // Use items from request body
    const { items, shippingAddress, totalPrice, orderer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    const orderData = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
      orderer,
      orderNumber,
      status: "preparing",
    };

    const order = await Order.create(orderData);

    // Subtract ordered quantities from product stock
    for (const item of order.items) {
      const product = await Product.findById(item.id);
      if (product) {
        const colorObj = product.colors.find((c) => c.name === item.color);
        if (colorObj) {
          const sizeObj = colorObj.sizes.find((s) => s.size === item.size);
          if (sizeObj) {
            sizeObj.quantity = Math.max(0, sizeObj.quantity - item.quantity);
          }
        }
        await product.save();
      }
    }

    // Send confirmation email
    try {
      await confirmationEmail.sendOrderConfirmation(order.orderer.email, order);
    } catch (emailErr) {
      console.error("Error sending confirmation email:", emailErr.message);
      // Optionally, you can still return success even if email fails
    }

    res.status(201).json({ orderId: order._id, order });
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    // Only allow orderer or admin/superadmin
    if (
      req.user.role === "user" &&
      (!order.orderer || String(order.orderer.userId) !== String(req.user._id))
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const result = await orderService.getAllOrders(page, limit, status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      req.body.status
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await orderService.getOrdersByUser(
      req.user._id,
      page,
      limit
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
