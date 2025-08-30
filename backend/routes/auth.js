const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const emailService = require("../services/emailService");
const crypto = require("crypto");
const { auth } = require("../middleware/auth");
const { generateEmailTemplate } = require("../utils/emailTemplates");
const { generateAndSaveOTP } = require("../utils/otp");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             user1:
 *               summary: Sample user registration
 *               value:
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 password: "password123"
 *                 address: "123 Main St, City, Country"
 *                 phone: "+1234567890"
 *             user2:
 *               summary: Another user example
 *               value:
 *                 name: "Jane Smith"
 *                 email: "jane@example.com"
 *                 password: "securepass456"
 *                 address: "456 Oak Ave, City, Country"
 *                 phone: "+1234567891"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Successful registration
 *                 value:
 *                   message: "User registered"
 *                   user:
 *                     id: "507f1f77bcf86cd799439011"
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *                     type: "user"
 *                     address: "123 Main St, City, Country"
 *                     phone: "+1234567890"
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   emailWarning: null
 *       400:
 *         description: Bad request - email already exists
 *         content:
 *           application/json:
 *             examples:
 *               emailExists:
 *                 summary: Email already exists
 *                 value:
 *                   error: "Email already exists"
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters." });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: cleanEmail,
      password: hash,
      address,
      phone,
    });
    const token = jwt.sign(
      { id: user._id, type: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    let emailWarning = null;
    const html = generateEmailTemplate({
      title: `Hi ${user.name || "there"}`,
      subtitle: "Thank you for signing up to Yaqeen Clothing",
      body: "We're excited to have you with us. You can now shop the latest collections and view your orders from your profile.",
    });
    try {
      await emailService.sendMail({
        to: user.email,
        subject: "Welcome to Yaqeen Clothing",
        text: `Hi ${user.name || "there"},\n\nThank you for signing up!`,
        html,
      });
    } catch (e) {
      emailWarning =
        "Registration succeeded, but failed to send welcome email.";
      console.error("Email error (register):", e);
    }
    // Return the structured address in the response
    res.status(201).json({
      success: true,
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: "user",
        address: user.address,
        phone,
      },
      token,
      emailWarning,
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Registration failed" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             userLogin:
 *               summary: User login
 *               value:
 *                 email: "john@example.com"
 *                 password: "password123"
 *             adminLogin:
 *               summary: Admin login
 *               value:
 *                 email: "admin@example.com"
 *                 password: "adminpass123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             examples:
 *               userSuccess:
 *                 summary: User login success
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   user:
 *                     id: "507f1f77bcf86cd799439011"
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *                     type: "user"
 *                     role: "user"
 *                     address: "123 Main St, City, Country"
 *                     phone: "+1234567890"
 *               adminSuccess:
 *                 summary: Admin login success
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   user:
 *                     id: "507f1f77bcf86cd799439012"
 *                     name: "Admin User"
 *                     email: "admin@example.com"
 *                     type: "admin"
 *                     role: "admin"
 *       400:
 *         description: Bad request - invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               invalidCredentials:
 *                 summary: Invalid credentials
 *                 value:
 *                   error: "Invalid credentials"
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail });
    let type = "user";

    if (!user) {
      user = await Admin.findOne({ cleanEmail });
      type = user ? "admin" : null;
    }

    if (!user) {
      console.log("Login failed: user not found", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Login failed: incorrect password", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in .env");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const token = jwt.sign({ id: user._id, type }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // At the end, return the response as JSON:
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type,
        role: user.role || "user",
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send OTP to user's email for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           examples:
 *             forgotPassword:
 *               summary: Request password reset
 *               value:
 *                 email: "john@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: OTP sent
 *                 value:
 *                   message: "OTP sent to email"
 *                   emailWarning: null
 *       400:
 *         description: Bad request - user not found
 *         content:
 *           application/json:
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *       500:
 *         description: Internal server error
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = await generateAndSaveOTP(user);

    let emailWarning = null;
    const html = generateEmailTemplate({
      title: `Hi ${user.name || "there"}`,
      subtitle: "You requested a password reset. Please use the OTP below:",
      specialtext: otp,
      body: "This OTP is valid for 15 minutes. \n If you did not request this, please ignore this email.",
    });
    try {
      await emailService.sendMail({
        to: user.email,
        subject: "Your Password Reset OTP",
        text: `Your OTP is: ${otp}`,
        html,
      });
    } catch (e) {
      emailWarning = "OTP generated, but failed to send email.";
      console.error("Email error (forgot-password):", e);
    }
    res.json({ message: "OTP sent to email", emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     description: Reset user password using OTP from email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           examples:
 *             resetPassword:
 *               summary: Reset password with OTP
 *               value:
 *                 email: "john@example.com"
 *                 otp: "123456"
 *                 newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Password reset success
 *                 value:
 *                   message: "Password reset successful"
 *                   emailWarning: null
 *       400:
 *         description: Bad request - invalid or expired OTP
 *         content:
 *           application/json:
 *             examples:
 *               invalidOTP:
 *                 summary: Invalid OTP
 *                 value:
 *                   error: "Invalid or expired OTP"
 *       500:
 *         description: Internal server error
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const user = await User.findOne({
      email: cleanEmail,
      resetOTP: cleanOtp,
      resetOTPExpires: { $gt: Date.now() },
    });
    if (!user) {
      console.log("Reset failed: user not found or OTP expired", {
        email,
        otp,
      });
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    let emailWarning = null;
    const html = generateEmailTemplate({
      title: `Hi ${user.name || "there"}`,
      subtitle: "Your password has been successfully changed.",
    });
    try {
      await emailService.sendMail({
        to: user.email,
        subject: "Password Successfully Changed",
        text: `Hi ${
          user.name || "there"
        }, your password was successfully changed. If this wasn't you, please contact us at ${
          process.env.EMAIL_USER
        }.`,
        html,
      });
    } catch (e) {
      emailWarning = "Password reset, but failed to send confirmation email.";
      console.error("Email error (reset-password):", e);
    }
    res.json({ message: "Password reset successful", emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Change user password (authentication required)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *           examples:
 *             changePassword:
 *               summary: Change password
 *               value:
 *                 oldPassword: "oldpassword123"
 *                 newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Password change success
 *                 value:
 *                   message: "Password changed successfully"
 *                   emailWarning: null
 *       400:
 *         description: Bad request - old password incorrect
 *         content:
 *           application/json:
 *             examples:
 *               wrongOldPassword:
 *                 summary: Wrong old password
 *                 value:
 *                   error: "Old password incorrect"
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ error: "Old password incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    let emailWarning = null;
    const html = generateEmailTemplate({
      title: `Hi ${user.name || "there"}`,
      subtitle: "Your password has been successfully changed.",
    });
    try {
      await emailService.sendMail({
        to: user.email,
        subject: "Password Successfully Changed",
        text: `Hi ${
          user.name || "there"
        }, your password was successfully changed. If this wasn't you, please contact us at ${
          process.env.EMAIL_USER
        }.`,
        html,
      });
    } catch (e) {
      emailWarning = "Password changed, but failed to send confirmation email.";
      console.error("Email error (change-password):", e);
    }
    res.json({ message: "Password changed successfully", emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     description: Resend OTP to user's email for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           examples:
 *             resendOTP:
 *               summary: Resend OTP
 *               value:
 *                 email: "john@example.com"
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: OTP resent
 *                 value:
 *                   message: "OTP resent to email"
 *                   emailWarning: null
 *       400:
 *         description: Bad request - user not found
 *         content:
 *           application/json:
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *       429:
 *         description: Too many requests - please wait before resending
 *         content:
 *           application/json:
 *             examples:
 *               tooManyRequests:
 *                 summary: Too many requests
 *                 value:
 *                   error: "Please wait 45 seconds before resending OTP."
 *       500:
 *         description: Internal server error
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const now = Date.now();
    if (user.resetOTPExpires && user.resetOTP) {
      const lastSent = user.resetOTPExpires - 15 * 60 * 1000;
      const elapsed = now - lastSent;
      if (elapsed < 60 * 1000) {
        const wait = Math.ceil((60 * 1000 - elapsed) / 1000);
        return res
          .status(429)
          .json({ error: `Please wait ${wait} seconds before resending OTP.` });
      }
    }
    const otp = await generateAndSaveOTP(user);

    let emailWarning = null;
    const html = generateEmailTemplate({
      title: `Hi ${user.name || "there"}`,
      subtitle: "You requested a password reset. Please use the OTP below:",
      specialtext: otp,
      body: "This OTP is valid for 15 minutes. \n If you did not request this, please ignore this email.",
    });
    try {
      await emailService.sendMail({
        to: user.email,
        subject: "Your Password Reset OTP",
        text: `Your OTP is: ${otp}`,
        html,
      });
    } catch (e) {
      emailWarning = "OTP generated, but failed to send email.";
      console.error("Email error (resend-otp):", e);
    }
    res.json({ message: "OTP resent to email", emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify token validity
 *     description: Check if the provided token is valid and return user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Valid token
 *                 value:
 *                   valid: true
 *                   user:
 *                     id: "507f1f77bcf86cd799439011"
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *                     type: "user"
 *                     role: "user"
 *       401:
 *         description: Token is invalid or expired
 *         content:
 *           application/json:
 *             examples:
 *               invalid:
 *                 summary: Invalid token
 *                 value:
 *                   valid: false
 *                   error: "Invalid or expired token"
 */
router.get("/verify", auth, async (req, res) => {
  try {
    // If we reach here, the token is valid (auth middleware passed)
    const user = req.user;
    res.json({
      valid: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        role: user.role,
        address: user.address,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: "Invalid or expired token",
    });
  }
});

module.exports = router;
