const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const Joi = require('joi');

const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize email transporter
const emailTransporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Validation schemas
const phoneValidation = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required()
});

const emailValidation = Joi.object({
  email: Joi.string().email().required()
});

const otpValidation = Joi.object({
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  code: Joi.string().length(6).pattern(/^\d+$/).required()
});

// Gmail OAuth Routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      
      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth-error?message=${encodeURIComponent(error.message)}`);
    }
  }
);

// Phone number registration
router.post('/register/phone', async (req, res) => {
  try {
    const { error, value } = phoneValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { phone } = value;
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database (create temporary user)
    const tempUser = new User({
      phone,
      phoneVerificationCode: otpCode,
      phoneVerificationExpires: expiresAt,
      authMethod: 'phone',
      name: 'Temporary User', // Will be updated after verification
      email: `temp_${phone}@dishcompare.app` // Temporary email
    });

    await tempUser.save();

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your DishCompare verification code is: ${otpCode}. This code expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ 
      message: 'OTP sent successfully',
      phone: phone,
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Phone registration error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Email registration
router.post('/register/email', async (req, res) => {
  try {
    const { error, value } = emailValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = value;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database (create temporary user)
    const tempUser = new User({
      email,
      emailVerificationCode: otpCode,
      emailVerificationExpires: expiresAt,
      authMethod: 'gmail',
      name: 'Temporary User', // Will be updated after verification
      phone: `temp_${Date.now()}` // Temporary phone
    });

    await tempUser.save();

    // Send OTP via Email
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'DishCompare - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">DishCompare Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #667eea; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">DishCompare - Food Tasting Comparison App</p>
        </div>
      `
    });

    res.json({ 
      message: 'OTP sent successfully',
      email: email,
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Email registration error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { error, value } = otpValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { phone, code } = value;
    
    // Find user by phone
    const user = await User.findOne({ 
      phone,
      phoneVerificationCode: code,
      phoneVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark phone as verified
    user.phoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Phone verified successfully',
      token,
      user: user.profile
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Verify Email OTP
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { error, value } = Joi.object({
      email: Joi.string().email().required(),
      code: Joi.string().length(6).pattern(/^\d+$/).required()
    }).validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, code } = value;
    
    // Find user by email
    const user = await User.findOne({ 
      email,
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: user.profile
    });

  } catch (error) {
    console.error('Email OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Complete profile setup
router.post('/complete-profile', authenticateToken, async (req, res) => {
  try {
    const { name, preferences } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile
    user.name = name.trim();
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }
    
    await user.save();

    res.json({
      message: 'Profile completed successfully',
      user: user.profile
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ error: 'Failed to complete profile' });
  }
});

// Login with phone
router.post('/login/phone', async (req, res) => {
  try {
    const { error, value } = phoneValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { phone } = value;
    
    // Find user by phone
    const user = await User.findOne({ phone, phoneVerified: true });
    if (!user) {
      return res.status(404).json({ error: 'Phone number not registered or not verified' });
    }

    // Generate OTP for login
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.phoneVerificationCode = otpCode;
    user.phoneVerificationExpires = expiresAt;
    await user.save();

    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your DishCompare login code is: ${otpCode}. This code expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ 
      message: 'Login OTP sent successfully',
      phone: phone,
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ error: 'Failed to send login OTP' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Update last active time
    const user = await User.findById(req.user.userId);
    if (user) {
      await user.updateLastActive();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.profile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

module.exports = router;
