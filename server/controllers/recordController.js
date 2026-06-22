import MedicalRecord from '../models/medicalRecords.js';
import Appointment from '../models/appointments.js';

// @desc    Create a new clinical medical record & prescription
// @route   POST /api/records
// @access  Private (Doctors only)
export const createMedicalRecord = async (req, res) => {
    const { patient, appointment, vitals, diagnosis, treatmentPlan, prescriptions } = req.body;

    try {
        // Create the medical record entry
        const record = await MedicalRecord.create({
            patient,
            doctor: req.user._id, // Gathered securely from the protect middleware
            appointment,
            vitals,
            diagnosis,
            treatmentPlan,
            prescriptions
        });

        // Automatically update the linked appointment status to 'completed'
        await Appointment.findByIdAndUpdate(appointment, { status: 'completed' });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get complete medical history of a specific patient
// @route   GET /api/records/patient/:patientId
// @access  Private (Doctors, Nurses, Pharmacists, or the patient themselves)
export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Ensure patients can only access their own files
        if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
            return res.status(403).json({ message: 'Access Denied: You can only view your own records.' });
        }

        const records = await MedicalRecord.find({ patient: patientId })
            .populate('doctor', 'firstName lastName')
            .sort({ createdAt: -1 }); // Newest medical encounters first

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};