const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, requireRole } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/:orderNumber', auth, orderController.getOrderByNumber);
router.get('/admin', auth, requireRole(['admin', 'superadmin']), orderController.getAllOrders);
router.put('/:orderNumber/status', auth, requireRole(['admin', 'superadmin']), orderController.updateOrderStatus);
router.get('/my/orders', auth, orderController.getMyOrders);

module.exports = router;