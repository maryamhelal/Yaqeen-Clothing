const express = require("express");
const router = express.Router();
const unsubscribeController = require("../controllers/unsubscribeController");

/**
 * @swagger
 * /api/unsubscribe:
 *   get:
 *     summary: Unsubscribe from promotional emails
 *     description: Unsubscribe a user from promotional emails using a token
 *     tags: [Unsubscribe]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Unsubscribe token
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad request - token missing
 *       404:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", unsubscribeController.unsubscribe);

/**
 * @swagger
 * /api/unsubscribe/resubscribe:
 *   post:
 *     summary: Resubscribe to promotional emails
 *     description: Resubscribe a user to promotional emails
 *     tags: [Unsubscribe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Successfully resubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - email missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/resubscribe", unsubscribeController.resubscribe);

module.exports = router;
