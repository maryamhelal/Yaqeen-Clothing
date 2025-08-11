const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     description: Create a new category or collection tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", tagController.createTag);

/**
 * @swagger
 * /api/tags/name/{name}:
 *   get:
 *     summary: Get tag by name
 *     description: Retrieve a specific tag by its name
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.get("/name/:name", tagController.getTag);

/**
 * @swagger
 * /api/tags/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all category tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Internal server error
 */
router.get("/categories", tagController.getCategories);

/**
 * @swagger
 * /api/tags/collections:
 *   get:
 *     summary: Get all collections
 *     description: Retrieve all collection tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Collections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Internal server error
 */
router.get("/collections", tagController.getCollections);

/**
 * @swagger
 * /api/tags/name/{name}:
 *   delete:
 *     summary: Delete tag by name
 *     description: Delete a specific tag by its name
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tag deleted successfully"
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.delete("/name/:name", tagController.deleteTag);

/**
 * @swagger
 * /api/tags/add-sale:
 *   post:
 *     summary: Add sale to tag
 *     description: Add sale information to a specific tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, salePercentage]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Collection"
 *               salePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 20
 *     responses:
 *       200:
 *         description: Sale added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.post("/add-sale", tagController.addTagSale);

module.exports = router;
