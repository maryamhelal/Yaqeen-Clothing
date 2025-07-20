const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, requireRole(['admin', 'superadmin']), upload.array('images', 5), productController.createProduct);
router.put('/:id', auth, requireRole(['admin', 'superadmin']), upload.array('images', 5), productController.updateProduct);
router.delete('/:id', auth, requireRole(['admin', 'superadmin']), productController.deleteProduct);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/collection/:collection', productController.getProductsByCollection);

module.exports = router; 