const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const emailService = require("../services/emailService");
const { generateEmailTemplate } = require("../utils/emailTemplates");
const { generateAndSaveOTP } = require("../utils/otp");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const existingPhoneNumber = await User.findOne({ phone });
    if (existingPhoneNumber)
      return res.status(400).json({ error: "Phone number already exists" });

    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters." });
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = (await User.countDocuments()) + 1;
    const user = await User.create({
      userId,
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
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail });
    let type = "user";

    if (!user) {
      user = await Admin.findOne({ email: cleanEmail });
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
};

const forgotPassword = async (req, res) => {
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
};

const resetPassword = async (req, res) => {
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
};

const changePassword = async (req, res) => {
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
};

const resendOTP = async (req, res) => {
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
};

const verifyToken = async (req, res) => {
  try {
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
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  resendOTP,
  verifyToken,
};
