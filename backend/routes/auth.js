const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const authController = require("../controllers/authController");

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
router.post("/register", authController.registerUser);

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
router.post("/login", authController.loginUser);

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
router.post("/forgot-password", authController.forgotPassword);

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
router.post("/reset-password", authController.resetPassword);

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
router.post("/change-password", auth, authController.changePassword);

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
router.post("/resend-otp", authController.resendOTP);

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
router.get("/verify", auth, authController.verifyToken);

module.exports = router;
