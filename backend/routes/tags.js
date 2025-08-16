const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     description: Create a new category or collection tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, tag]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Summer Collection"
 *               description:
 *                 type: string
 *                 example: "Our latest summer collection featuring trendy styles"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Image file for the tag"
 *               tag:
 *                 type: string
 *                 enum: [category, collection]
 *                 example: "collection"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, upload.single("image"), tagController.createTag);

/**
 * @swagger
 * /api/tags/id/{id}:
 *   get:
 *     summary: Get tag by ID
 *     description: Retrieve a specific tag by its ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag iD
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
router.get("/id/:id", tagController.getTagById);

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
 * /api/tags/name/{name}:
 *   put:
 *     summary: Update tag by name
 *     description: Update a specific tag by its name
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Our latest summer collection featuring trendy styles"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Image file for the tag"
 *               tag:
 *                 type: string
 *                 enum: [category, collection]
 *                 example: "collection"
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/name/:name",
  auth,
  upload.single("image"),
  tagController.updateTag
);

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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.delete("/name/:name", auth, tagController.deleteTag);

/**
 * @swagger
 * /api/tags/add-sale:
 *   post:
 *     summary: Add sale to tag
 *     description: Add sale information to a specific tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.post("/add-sale", auth, tagController.addTagSale);

module.exports = router;
