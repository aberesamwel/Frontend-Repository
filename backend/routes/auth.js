const express = require('express');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { loginLimiter, resetLimiter, authenticateToken, logAuditEvent } = require('../middleware/auth');

const router = express.Router();

// Gmail SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password, twoFactorCode } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      await logAuditEvent('LOGIN_FAILED', null, req, { username, reason: 'User not found' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.isLocked) {
      await logAuditEvent('LOGIN_FAILED', user._id, req, { reason: 'Account locked' });
      return res.status(423).json({ error: 'Account temporarily locked due to too many failed attempts' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incLoginAttempts();
      await logAuditEvent('LOGIN_FAILED', user._id, req, { reason: 'Invalid password' });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({ requiresTwoFactor: true });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2
      });

      if (!verified) {
        await user.incLoginAttempts();
        await logAuditEvent('2FA_VERIFY_FAILED', user._id, req);
        return res.status(401).json({ error: 'Invalid 2FA code' });
      }

      await logAuditEvent('2FA_VERIFY_SUCCESS', user._id, req);
    }

    // Reset login attempts on successful login
    await user.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 },
      $set: { lastLogin: new Date() }
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    await logAuditEvent('LOGIN_SUCCESS', user._id, req);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Setup 2FA
router.post('/setup-2fa', authenticateToken, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `TruckFlow (${req.user.username})`,
      issuer: 'TruckFlow Dashboard'
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate 2FA setup' });
  }
});

// Verify and enable 2FA
router.post('/verify-2fa', authenticateToken, async (req, res) => {
  try {
    const { secret, token } = req.body;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      twoFactorSecret: secret,
      twoFactorEnabled: true
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

// Forgot password
router.post('/forgot-password', resetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await user.updateOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'TruckFlow - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your TruckFlow account.</p>
        <p>Click the link below to reset your password (expires in 10 minutes):</p>
        <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    await logAuditEvent('PASSWORD_RESET_REQUEST', user._id, req);
    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    await user.save();

    await logAuditEvent('PASSWORD_RESET_COMPLETE', user._id, req);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isValidPassword = await req.user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();

    await logAuditEvent('PASSWORD_CHANGE', req.user._id, req);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await logAuditEvent('LOGOUT', req.user._id, req);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;