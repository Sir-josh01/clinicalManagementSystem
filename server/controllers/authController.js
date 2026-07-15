import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

// 1. RATE LIMITER: Prevent brute-force password recovery requests (Max 3 per 15 mins)
export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to dynamically initialize Nodemailer transport with error fallbacks
const getMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || '',
    },
  });
};

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Generate password reset token & send transactional recovery email
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Attack Mitigation: Prevent NoSQL Injection by sanitizing parameters explicitly to string
    const sanitizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: sanitizedEmail });
    
    // Security Best Practice: Never reveal if the email actually exists in your database
    const genericSuccessResponse = { message: 'If that email exists in our records, a secure reset link has been dispatched.' };
    
    if (!user) {
      return res.status(200).json(genericSuccessResponse);
    }

    // Generate secure crypto tokens (20 bytes raw)
    const rawToken = crypto.randomBytes(20).toString('hex');

    // Hash token to protect database records from visual read leaks
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // STRICT TIME REQUIREMENT: Recovery token lifespan shortened to exactly 5 minutes
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Determine target location dynamically based on environment configuration
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendBaseUrl}/reset-password/${rawToken}`;

    // Secure HTML & text email payload layout
    const mailOptions = {
      from: `"Clinical Portal Security" <${process.env.MAIL_FROM || 'security@clinicalcms.com'}>`,
      to: user.email,
      subject: 'Clinical Portal Access Reset Request',
      text: `A request to change your password has been registered. Reset your credentials by navigating to this link: ${resetUrl}. Note: This validation link is highly time-sensitive and will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 550px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-top: 0;">Password Reset Authorization</h2>
          <p>We received an execution request to override current access passwords for your account profile.</p>
          <p>Click the button below to update your security settings. This link is valid for exactly <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Verify and Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If you did not initiate this change request, please disregard this transmission safely. Your credentials will remain unchanged.</p>
        </div>
      `
    };

    const transporter = getMailTransporter();
    await transporter.sendMail(mailOptions);

    return res.status(200).json(genericSuccessResponse);
  } catch (err) {
    return res.status(500).json({ message: 'Mail delivery services encountered a critical engine timeout.' });
  }
};

// @desc    Verify token validity and update password user account
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: 'Required authorization parameter is missing.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Retrieve active user within valid timestamp criteria
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Recovery window has expired or authorization token is invalid.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be provided and at least 6 characters long.' });
    }

    // Hash new password payload securely
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear session tracking fields completely
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password database updated successfully. You can now log in.' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal systems encountered validation processing errors.' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ email: String(email || '').toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email: String(email || '').toLowerCase().trim(),
      password,
      role,
      phoneNumber
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};