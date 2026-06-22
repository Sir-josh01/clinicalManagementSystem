import express from 'express';
const router = express.Router();
import { bookAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

// All appointment routes must go through the authentication check first
router.route('/')
    .post(protect, bookAppointment)
    .get(protect, getMyAppointments);

export default router;