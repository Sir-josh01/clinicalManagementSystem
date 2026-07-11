import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import bcrypt from 'bcryptjs';

// @desc    Generate password reset token & simulate/send recovery link
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({ email })
    if(!user) {
      return res.status(200).json({ message: "Recovery information sent. Please check your inboxs / logs"})
    }

    // Generate a raw random 20-byte token 
    const rawToken = crypto.randomBytes(20).toString('hex');

    // Hash the token and save it to the database
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex'); 

    // set token expiration limit to 10mins
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4. Create the URL (points to your future frontend reset screen)
    // Since we are coding locally, we output this to the terminal console log
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${rawToken}`;

    console.log(`\n========== 📬 PASSWORD RESET EMAIL SIMULATION ==========`);
    console.log(`To: ${user.email}`);
    console.log(`Click this link to reset your account credentials:\n${resetUrl}`);
    console.log(`==========================================================\n`);

    res.status(200).json({ message: "Recovery information sent. Please check your inboxs / logs"})
  } catch (err) {
    res.status(500).json({ message: "Server error initiating the password reset protocol"})
  }
};

// @desc    Verify token validity and update password user account
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  // Hash the incoming URL token parameter to compare against our stored database hash
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const user = await User.findOne({ 
      resetPasswordToken: hashedToken, 
      resetPasswordExpire: {$gt: Date.now()}
    })

    if (!user) {
      return res.status(400).json({message : "Invalid or expire recovery token parameter"}) 
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: "Password must be provided and at least 6 characters long" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    // clear reset token tracking field completely
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message:"Password updated successfully. You can now login"});

  } catch(err) {
    res.status(500).json({ message:"Server encountered an error resetting your password"});
  }
};

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token remains valid for 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body;

    try {
        // FIX: Must call findOne directly on the User model
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // FIX: Must call create directly on the User model
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            phoneNumber
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data provided' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // FIX: Must call findOne directly on the User model
        const user = await User.findOne({ email });

        // Use the matchPassword schema method we created earlier to compare
        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};