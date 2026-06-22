import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js'; // Import our new middleware

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private Test Route: Only logged-in users who are doctors or admins can hit this endpoint
router.get('/doctor-dashboard-test', protect, restrictTo('doctor', 'admin'), (req, res) => {
    res.status(200).json({
        message: `Access Granted! Welcome Dr. ${req.user.lastName}. Here is your secure data.`
    });
});

export default router;