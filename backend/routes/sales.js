const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const { auth, requireRole } = require("../middleware/auth");

/**
 * @swagger
 * /api/sales/product/{productId}:
 *   put:
 *     summary: Update product sale percentage
 *     description: Update the sale percentage for a specific product (Admin/Superadmin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Sale percentage (0-100)
 *     responses:
 *       200:
 *         description: Product sale updated successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/product/:productId",
  auth,
  requireRole(["admin", "superadmin"]),
  saleController.updateProductSale
);

/**
 * @swagger
 * /api/sales/email:
 *   post:
 *     summary: Send sale promotional email
 *     description: Send promotional email about sale to all users (Admin/Superadmin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to include in the sale
 *               salePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Sale percentage
 *               saleType:
 *                 type: string
 *                 enum: [product, category, collection]
 *                 default: product
 *                 description: Type of sale
 *     responses:
 *       200:
 *         description: Sale email sent successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post(
  "/email",
  auth,
  requireRole(["admin", "superadmin"]),
  saleController.sendSaleEmail
);

/**
 * @swagger
 * /api/sales/products:
 *   get:
 *     summary: Get all products with sales
 *     description: Retrieve all products that have active sales (Admin/Superadmin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sale products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get(
  "/products",
  auth,
  requireRole(["admin", "superadmin"]),
  saleController.getSaleProducts
);

/**
 * @swagger
 * /api/sales/bulk:
 *   put:
 *     summary: Bulk update product sales
 *     description: Update sale percentage for multiple products at once (Admin/Superadmin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of product IDs to update
 *               salePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Sale percentage to apply
 *     responses:
 *       200:
 *         description: Products updated successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.put(
  "/bulk",
  auth,
  requireRole(["admin", "superadmin"]),
  saleController.bulkUpdateSale
);

module.exports = router;
