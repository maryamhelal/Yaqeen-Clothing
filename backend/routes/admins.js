const express = require("express");
const router = express.Router();
const { auth, requireRole } = require("../middleware/auth");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: List all admins (Superadmin only)
 *     description: Retrieve a list of all admin users (Superadmin only)
 *     tags: [Admins]
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
 *         description: Number of admins per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, superadmin]
 *         description: Filter by admin role
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
});

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Create new admin (Superadmin only)
 *     description: Create a new admin user (Superadmin only)
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request - email already exists
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email exists" });
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email,
    password: hash,
    role: "admin",
  });
  res.status(201).json(admin);
});

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Update admin (Superadmin only)
 *     description: Update an existing admin user (Superadmin only)
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Admin Name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updatedadmin@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const update = { name, email, role };
  if (password) update.password = await bcrypt.hash(password, 10);
  const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  res.json(admin);
});

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete admin (Superadmin only)
 *     description: Delete an admin user (Superadmin only)
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin deleted"
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", auth, requireRole(["superadmin"]), async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted" });
});

module.exports = router;
