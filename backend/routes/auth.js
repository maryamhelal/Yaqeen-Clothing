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
    const user = await User.create({ name, email, password: hash, addresses: address ? [{ address }] : [], phone });
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, type: 'user', address, phone }, token });
    await emailService.sendMail({
      to: user.email,
      subject: 'Welcome to Yaqeen Clothing',
      text: 'Thank you for signing up!'
    });
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
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, type, role: user.role, phone: user.phone } });
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
    await emailService.sendMail({
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP is: ${otp}`
    });
    res.json({ message: 'OTP sent to email' });
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
    await emailService.sendMail({
      to: user.email,
      subject: 'Password Changed',
      text: 'Your password was changed successfully.'
    });
    res.json({ message: 'Password reset successful' });
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
    await emailService.sendMail({
      to: user.email,
      subject: 'Password Changed',
      text: 'Your password was changed successfully.'
    });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 