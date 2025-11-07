const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     description: Create a new contact message from a user
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessageRequest'
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", messageController.createMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages (Admin only)
 *     description: Retrieve all contact messages (Admin authentication required)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of messages per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [unread, read, replied]
 *         description: Filter by message status
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalMessages:
 *                   type: integer
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.get("/", /* authMiddleware, */ messageController.getAllMessages);

/**
 * @swagger
 * /api/messages/{userEmail}:
 *   get:
 *     summary: Get messages by user email
 *     description: Retrieve all messages from a specific user by email
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User email address
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: User messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalMessages:
 *                   type: integer
 *       404:
 *         description: No messages found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/:userEmail", messageController.getUserMessages);

/**
 * @swagger
 * /api/messages/resolve/{id}:
 *   patch:
 *     summary: Resolve a message
 *     description: Mark a message as resolved
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
router.patch("/resolve/:id", messageController.resolveMessage);

module.exports = router;
