const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, requireRole } = require("../middleware/auth");

const optionalAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return next();
  try {
    const jwt = require("jsonwebtoken");
    const User = require("../models/User");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) req.user = user;
  } catch (err) {}
  next();
};

router.post("/", optionalAuth, orderController.createOrder);

router.get("/:orderId", auth, orderController.getOrderById);

router.get(
  "/admin",
  auth,
  requireRole(["admin", "superadmin"]),
  orderController.getAllOrders
);

router.put(
  "/:orderId/status",
  auth,
  requireRole(["admin", "superadmin"]),
  orderController.updateOrderStatus
);

router.get("/my/orders", auth, orderController.getMyOrders);

module.exports = router;
