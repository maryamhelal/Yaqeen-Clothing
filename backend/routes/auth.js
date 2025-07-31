const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const emailService = require('../services/emailService');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');

// Register (user only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    // Store structured address object in addresses array
    const user = await User.create({ name, email, password: hash, address, phone });
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    let emailWarning = null;
    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Welcome to Yaqeen Clothing',
        text: `Hi ${user.name || 'there'},\n\nThank you for signing up!`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #6D28D9; padding: 16px; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 80px;" />
              </div>
              <div style="padding: 24px;">
                <h2 style="margin-top: 0;">Hi ${user.name || 'there'},</h2>
                <p style="font-size: 16px;">Thank you for signing up to <b>Yaqeen Clothing</b>!</p>
                <p style="font-size: 14px; color: #555;">We're excited to have you with us. You can now shop the latest collections and view your orders from your profile.</p>
                <p style="font-size: 14px; color: #555;">If you have any questions, just reply to this email or contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #6D28D9; text-decoration: underline;">${process.env.EMAIL_USER}</a>.</p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
                &copy; 2025 Yaqeen Clothing. All rights reserved.
              </div>
            </div>
          </div>
        `
      });
    } catch (e) {
      emailWarning = 'Registration succeeded, but failed to send welcome email.';
      console.error('Email error (register):', e);
    }
    // Return the structured address in the response
    res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, type: 'user', address: user.address, phone }, token, emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (user or admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    let type = 'user';
    if (!user) {
      user = await Admin.findOne({ email });
      type = user ? 'admin' : null;
    }
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, type }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, type, role: user.role, address: user.address, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password (request OTP)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    let emailWarning = null;
    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Your Password Reset OTP',
        text: `Your OTP is: ${otp}`, // fallback for plain text clients
        html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #6D28D9; padding: 16px; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 80px;"/>
              </div>
              <div style="padding: 24px;">
                <h2 style="margin-top: 0;">Hi ${user.name || 'there'},</h2>
                <p style="font-size: 16px;">You requested a password reset. Please use the OTP below:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 16px 0; text-align: center; color: #6D28D9;">
                  ${otp}
                </div>
                <p style="font-size: 14px; color: #555;">This OTP is valid for 15 minutes.</p>
                <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
                &copy; 2025 Yaqeen Clothing. All rights reserved.
              </div>
            </div>
          </div>
        `
      }); 
    } catch (e) {
      emailWarning = 'OTP generated, but failed to send email.';
      console.error('Email error (forgot-password):', e);
    }
    res.json({ message: 'OTP sent to email', emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, resetOTP: otp, resetOTPExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();
    let emailWarning = null;
    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Password Successfully Changed',
        text: `Hi ${user.name || 'there'}, your password was successfully changed. If this wasn't you, please contact us at ${process.env.EMAIL_USER}.`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #6D28D9; padding: 16px; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 80px;" />
              </div>
              <div style="padding: 24px;">
                <h2 style="margin-top: 0;">Hi ${user.name || 'there'},</h2>
                <p style="font-size: 16px;">Your password has been successfully changed.</p>
                <p style="font-size: 14px; color: #555;">
                  If you did not change your password, please
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #6D28D9; text-decoration: underline;">
                    contact us
                  </a>
                  immediately.
                </p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
                &copy; 2025 Yaqeen Clothing. All rights reserved.
              </div>
            </div>
          </div>
        `
      });
    } catch (e) {
      emailWarning = 'Password reset, but failed to send confirmation email.';
      console.error('Email error (reset-password):', e);
    }
    res.json({ message: 'Password reset successful', emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password (authenticated)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Old password incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    let emailWarning = null;
    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Password Successfully Changed',
        text: `Hi ${user.name || 'there'}, your password was successfully changed. If this wasn't you, please contact us at ${process.env.EMAIL_USER}.`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #6D28D9; padding: 16px; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 80px;" />
              </div>
              <div style="padding: 24px;">
                <h2 style="margin-top: 0;">Hi ${user.name || 'there'},</h2>
                <p style="font-size: 16px;">Your password has been successfully changed.</p>
                <p style="font-size: 14px; color: #555;">
                  If you did not change your password, please
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #6D28D9; text-decoration: underline;">
                    contact us
                  </a>
                  immediately.
                </p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
                &copy; 2025 Yaqeen Clothing. All rights reserved.
              </div>
            </div>
          </div>
        `
      }); 
    } catch (e) {
      emailWarning = 'Password changed, but failed to send confirmation email.';
      console.error('Email error (change-password):', e);
    }
    res.json({ message: 'Password changed successfully', emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resend OTP (with 60s cooldown)
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const now = Date.now();
    if (user.resetOTPExpires && user.resetOTP) {
      const lastSent = user.resetOTPExpires - 15 * 60 * 1000; // When the OTP was generated
      const elapsed = now - lastSent;
      if (elapsed < 60 * 1000) {
        const wait = Math.ceil((60 * 1000 - elapsed) / 1000);
        return res.status(429).json({ error: `Please wait ${wait} seconds before resending OTP.` });
      }
    }
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = now + 15 * 60 * 1000;
    await user.save();
    let emailWarning = null;
    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Your Password Reset OTP',
        text: `Your OTP is: ${otp}`, // fallback for plain text clients
        html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
              <div style="background-color: #6D28D9; padding: 16px; text-align: center;">
                <img src="https://protoinfrastack.ivondy.com/media/XjM642wlbGinVtEapwWpTAKGJyfQq6p27KnN" alt="Yaqeen Logo" style="height: 80px;"/>
              </div>
              <div style="padding: 24px;">
                <h2 style="margin-top: 0;">Hi ${user.name || 'there'},</h2>
                <p style="font-size: 16px;">You requested a password reset. Please use the OTP below:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 16px 0; text-align: center; color: #6D28D9;">
                  ${otp}
                </div>
                <p style="font-size: 14px; color: #555;">This OTP is valid for 15 minutes.</p>
                <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
              </div>
              <div style="background: #f1f1f1; text-align: center; padding: 12px; font-size: 12px; color: #888;">
                &copy; 2025 Yaqeen Clothing. All rights reserved.
              </div>
            </div>
          </div>
        `
      });      
    } catch (e) {
      emailWarning = 'OTP generated, but failed to send email.';
      console.error('Email error (resend-otp):', e);
    }
    res.json({ message: 'OTP resent to email', emailWarning });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 