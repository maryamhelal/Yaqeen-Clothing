const orderService = require("../services/orderService");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const confirmationEmail = require("../utils/confirmationEmail");

exports.createOrder = async (req, res) => {
  try {
    // Generate sequential order number
    const orderNumber = (await Order.countDocuments()) + 1;

    // Use items from request body
    const {
      items,
      shippingAddress,
      totalPrice,
      orderer,
      promocode: promocodeInput,
      paymentMethod,
      instapayUsername,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must contain at least one item.");
    }

    let userMongoId = null;
    let userId = null;
    let userDoc = null;
    // Try to resolve user from orderer, or from req.user if available
    if (
      orderer &&
      orderer.userMongoId &&
      typeof orderer.userMongoId === "string"
    ) {
      userDoc = await User.findById(orderer.userMongoId);
    } else if (orderer && typeof orderer.userId === "number") {
      userDoc = await User.findOne({ userId: orderer.userId });
    } else if (req.user && req.user._id) {
      userDoc = await User.findById(req.user._id);
    }
    if (userDoc) {
      userMongoId = userDoc._id;
      userId = userDoc.userId;
    }
    let appliedPromocode = null;
    let discountAmount = 0;
    let finalTotalPrice = totalPrice;

    if (promocodeInput && promocodeInput.code) {
      const Promocode = require("../models/Promocode");
      const promocodeDoc = await Promocode.findOne({
        code: promocodeInput.code,
        active: true,
      });
      if (!promocodeDoc) {
        return res
          .status(400)
          .json({ error: "Invalid or inactive promocode." });
      }
      if (promocodeDoc.expiry && new Date(promocodeDoc.expiry) < new Date()) {
        return res.status(400).json({ error: "Promocode expired." });
      }
      if (promocodeDoc.uses >= promocodeDoc.maxUses) {
        return res
          .status(400)
          .json({ error: "Promocode usage limit reached." });
      }
      // Only apply to eligible items
      let eligibleTotal = 0;
      items.forEach((item) => {
        if (
          (promocodeDoc.type === "product" &&
            item.id == String(promocodeDoc.targetId)) ||
          (promocodeDoc.type === "category" &&
            item.categoryId == String(promocodeDoc.targetId)) ||
          (promocodeDoc.type === "collection" &&
            item.collectionId == String(promocodeDoc.targetId))
        ) {
          eligibleTotal += item.price * item.quantity;
        }
      });
      if (eligibleTotal === 0) {
        return res.status(400).json({
          error: "Promocode not applicable to any items in your cart.",
        });
      }
      discountAmount = Math.round(
        (eligibleTotal * promocodeDoc.percentage) / 100
      );
      finalTotalPrice = totalPrice - discountAmount;
      appliedPromocode = {
        code: promocodeDoc.code,
        percentage: promocodeDoc.percentage,
        type: promocodeDoc.type,
        targetId: promocodeDoc.targetId,
        discountAmount,
      };
      // Increment promocode usage
      promocodeDoc.uses += 1;
      await promocodeDoc.save();
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
        categoryId: item.categoryId,
        collectionId: item.collectionId,
      })),
      totalPrice: finalTotalPrice,
      promocode: appliedPromocode,
      shippingAddress,
      orderer: {
        ...orderer,
        userMongoId,
        userId,
      },
      orderNumber,
      paymentMethod,
      instapayUsername: paymentMethod === "Instapay" && instapayUsername,
    };

    const order = await Order.create(orderData);

    // Add order to user's orders array
    if (userDoc) {
      userDoc.orders.push(order._id);
      await userDoc.save();
    }

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
      req.user.userId,
      page,
      limit
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
