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
const upload = multer();

router.get('/categories', productController.getCategories);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload.none(), auth, requireRole(['admin', 'superadmin']), productController.createProduct);
router.put('/:id', upload.none(), auth, requireRole(['admin', 'superadmin']), productController.updateProduct);
router.delete('/:id', auth, requireRole(['admin', 'superadmin']), productController.deleteProduct);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/collection/:collection', productController.getProductsByCollection);

module.exports = router; 