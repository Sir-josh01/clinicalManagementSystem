import express from 'express';
const router = express.Router();
import { createMedicalRecord, getPatientHistory } from '../controllers/recordController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

// Only doctors can write new medical files
router.post('/', protect, restrictTo('doctor'), createMedicalRecord);

// Doctors, Nurses, Pharmacists, and Patients can read history based on the controller checks
router.get('/patient/:patientId', protect, getPatientHistory);

export default router;